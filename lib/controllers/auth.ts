import { User } from "lib/models/user";
import { Auth } from "lib/models/auth";
import { sendEmail } from "lib/sendgrid";
import gen from "random-seed";
import addMinutes from "date-fns/addMinutes";

// Me pasan un email por parámetro que es lo que tengo como referencia para encontrar un usuario
export async function findOrCreateAuth(email: string): Promise<Auth> {
  //  guardamos ese email, con trim que le saca los espacios que puede tener al principio y al final
  const cleanEmail = email.trim().toLowerCase();
  // Mi controler le esta diciendo a la clase Auth : encontrame un Auth que tenga este email
  const auth = await Auth.findByEmail(cleanEmail);
  // Si encuentra un Auth
  if (auth) {
    console.log("auth encontrado");

    return auth;
  } else {
    // Una vez que tenemos el newUser creamos el newAuth
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

const seed = "eye";
const random = gen.create(seed);

// Recibe un email y a partir de eso genera un código y lo manda
export async function sendCode(email: string) {
  // Nos traemos el registro de auth, acá hace toda la lógica si existe, si no existe lo crea, etc
  const auth = await findOrCreateAuth(email);

  // Generamos el número random con la libreria
  // como mínimo le ponemos 10000 y máximo 99999, osea son nros de 5 digitos
  const code = random.intBetween(10000, 99999);

  // Creamos una fecha de ahora
  const now = new Date();

  // Le ponemos 20 minutos a la duración del código
  // entonces a la fecha de ahora le agregamos 20 minutos
  const twentyMinutesFromNow = addMinutes(now, 20);

  // una vez que tenemos el auth le agregamos en data el code
  // y expires con la fecha y hora en la que expira
  auth.data.code = code;
  auth.data.expires = twentyMinutesFromNow;

  await auth.push();

  try {
    //Enviamos el código a sendGrid
    const resSendEmail = await sendEmail(auth.data.email, auth.data.code);
    console.log(auth.data.code);

    return resSendEmail.message;
  } catch (error) {
    return "Error inesperado en Sendgrid " + error;
  }
}
