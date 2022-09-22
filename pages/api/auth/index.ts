import type { NextApiRequest, NextApiResponse } from "next";
import method from "micro-method-router";
import * as yup from "yup";
import { validateBody } from "middlewares/schemas";
import { sendCode } from "controllers/auth";

let bodySchema = yup
  .object()
  .shape({
    email: yup.string().required("El email es requerido en el body."),
  })
  .strict()
  .noUnknown(true);

export async function auth(req: NextApiRequest, res: NextApiResponse) {
  const sendEmail = await sendCode(req.body.email);
  res.send(sendEmail);
}

const handler = method({
  post: auth,
});

export default validateBody(bodySchema, handler);
