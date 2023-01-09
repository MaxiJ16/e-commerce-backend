import * as sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.API_KEY_SENDGRID);

export async function sendEmail(email: string, code: number) {
  const msgEmail = {
    to: email,
    from: "maxijofre.c@gmail.com",
    subject: `Tu código para ingresar es ${code}`,
    text: "Código de ingreso",
    html: `<h1>APP E-COMMERCE</h1><p>Estimado/a ${email}, <p>Inserta este código para ingresar <strong>${code}</strong>.</p>`,
  };

  const mailSentRes = await sgMail.send(msgEmail);

  return {
    message: "Codigo enviado! Revisa tu casilla de mensajes",
    res: mailSentRes,
  };
}

export async function sendConfirmedPayment(email: string, productData) {
  const msgEmail = {
    to: email,
    from: "maxijofre.c@gmail.com",
    subject: `Compraste ${productData.Name}!`,
    text: "Pago aprobado!",
    html: `<h1>APP E-COMMERCE</h1><p>Estimado/a ${email} <p><strong> Hemos recibido el pago de $ ${productData['Unit cost']} por el producto ${productData.Name}, esperamos que lo disfrutes! Saludos </strong></p>`,
  };

  const mailSentRes = await sgMail.send(msgEmail);

  return {
    message: "Aprobado! Revisa tu casilla de mensajes",
    res: mailSentRes,
  };
}
