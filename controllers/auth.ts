import addMinutes from "date-fns/addMinutes";
import { sendEmail } from "lib/sendgrid";
import { generate } from "lib/jwt";
import { User } from "models/user";
import { Auth } from "models/auth";

export async function findOrCreateAuth(email: string): Promise<Auth> {
  const cleanEmail = email.trim().toLowerCase();
  const auth = await Auth.findByEmail(cleanEmail);
  // Si encuentra el registro de auth
  if (auth) {
    return auth;
  } else {
    const newUser = await User.createNewUser({
      email: cleanEmail,
    });

    const newAuth = await Auth.createNewAuth({
      email: cleanEmail,
      userId: newUser.id,
      code: "",
      expires: new Date(),
    });

    return newAuth;
  }
}

export async function sendCode(email: string) {
  const auth = await findOrCreateAuth(email);
  
  const code = Math.floor(Math.random() * (99999 - 10000 + 1) + 10000);
  const now = new Date();
  const fiveMinutesFromNow = addMinutes(now, 5);

  auth.data.code = code;
  auth.data.expires = fiveMinutesFromNow;

  await auth.push();

  try {
    const resSendEmail = await sendEmail(auth.data.email, auth.data.code);
    return resSendEmail.message;
  } catch (error) {
    return "Error inesperado en Sendgrid " + error;
  }
}

export async function checkCodeExpired(auth: Auth) {
  const expires = auth.isCodeExpired();

  if (expires) {
    throw "Code expirado";
  }

  const token = generate({ userId: auth.data.userId });

  auth.data.expires = new Date();
  await auth.push();

  return { token };
}
