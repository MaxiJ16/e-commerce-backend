import type { NextApiRequest, NextApiResponse } from "next";
import method from "micro-method-router";
import * as yup from "yup";

import { getUserById, modifiedUser } from "controllers/users";
import { authMiddleware } from "middlewares";
import { validateBody } from "middlewares/schemas";

// /ME ESTÁ PENSADO PARA QUE ME DEVUELVA LA INFO DE MI USUARIO QUE TIENE EL TOKEN
export async function getUser(
  req: NextApiRequest,
  res: NextApiResponse,
  token
) {
  try {
    const resGet = await getUserById(token.userId);
    res.send(resGet);
  } catch (error) {
    res.status(405).send({
      error,
    });
  }
}

const bodySchema = yup
  .object()
  .shape({
    email: yup.string().notRequired(),
    username: yup.string(),
    address: yup.string(),
    phone: yup.number()
  })
  .required()
  .strict()
  .noUnknown(true);

export async function modifyUser(
  req: NextApiRequest,
  res: NextApiResponse,
  token
) {
  try {
    const resUserModified = await modifiedUser(token.userId, req.body);
    res.send(resUserModified);
  } catch (error) {
    res.status(400).send({
      error,
    });
  }
}

const handler = method({
  get: authMiddleware(getUser),
  patch: validateBody(bodySchema, authMiddleware(modifyUser)),
});

export default handler;
