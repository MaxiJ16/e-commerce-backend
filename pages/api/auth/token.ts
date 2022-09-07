import type { NextApiRequest, NextApiResponse } from "next";
import { Auth } from "lib/models/auth";
import { generate } from "lib/jwt";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const auth = await Auth.findByEmailAndCode(req.body.email, req.body.code);
  // Generamos un token a partir de este objeto

  console.log(auth);

  if (!auth) {
    res.status(401).send({
      message: "email or code incorrect",
    });
  }

  // Para extraer la data de firebase con un formato que podamos usar
  const expires = auth.isCodeExpired();

  // si expiró
  if (expires) {
    res.status(401).send({
      message: "code expirado",
    });
  }

  // si no expiró generamos un token y lo devolvemos
  const token = generate({ userId: auth.data.userId });

  res.send(token);
}
