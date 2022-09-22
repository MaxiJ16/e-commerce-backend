import type { NextApiRequest, NextApiResponse } from "next";
import * as yup from "yup";
import method from "micro-method-router";
import { Auth } from "models/auth";
import { checkCodeExpired } from "controllers/auth";
import { validateBody } from "middlewares/schemas";

const bodySchema = yup
  .object()
  .shape({
    email: yup.string().required("El email es requerido en el body."),
    code: yup.number().required("El code es requerido en el body."),
  })
  .strict()
  .noUnknown(true);

export async function authToken(req: NextApiRequest, res: NextApiResponse) {
  const auth = await Auth.findByEmailAndCode(req.body.email, req.body.code);

  if (!auth) {
    res.status(401).send({
      message: "email or code incorrect",
    });
  }

  try {
    const resExpired = await checkCodeExpired(auth);
    res.send(resExpired);
  } catch (error) {
    // Si expiró
    res.status(401).send({
      error,
    });
  }
}

const handler = method({
  post: authToken,
});

export default validateBody(bodySchema, handler);
