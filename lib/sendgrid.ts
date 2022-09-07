import * as sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.API_KEY_SENDGRID);

export async function sendEmail(email: string, code: number) {
  const msgEmail = {
    to: email,
    from: "maxijofre.c@gmail.com",
    subject: `Tu código para ingresar es ${code}`,
    text: "Nueva información sobre tu mascota",
    html: `<h1>APP E-COMMERCE</h1><p>Estimado/a ${email}, <p>Inserta este código para ingresar <strong>${code}</strong>.</p>`,
  };

  const mailSentRes = await sgMail.send(msgEmail);
  
  return { message: "Código enviado! Revisa tu casilla de mensajes", res: mailSentRes };
}
