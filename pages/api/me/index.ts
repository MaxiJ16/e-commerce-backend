import type { NextApiRequest, NextApiResponse } from "next";
import method from "micro-method-router";
import * as yup from "yup";
import { getUserById, modifiedUser } from "controllers/users";
import { authMiddleware } from "middlewares";
import { validateBody } from "middlewares/schemas";

export async function getUser( req: NextApiRequest, res: NextApiResponse, token) {
  try {
    const res = await getUserById(token.userId);
    res.send(res);
  } catch (error) {
    res.status(405).send({
      error,
    });
  }
}

const bodySchema = yup
  .object()
  .shape({
    email: yup.string().required("El email es requerido en el body."),
    username: yup.string().required("El username es requerido en el body."),
  })
  .strict()
  .noUnknown(true);

export async function modifyUser(req: NextApiRequest, res: NextApiResponse, token) {
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
  patch: authMiddleware(modifyUser),
});


export default validateBody(bodySchema, handler);
