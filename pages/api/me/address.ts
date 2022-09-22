import type { NextApiRequest, NextApiResponse } from "next";
import method from "micro-method-router";
import * as yup from "yup";
import { modifiedAddress } from "controllers/users";
import { authMiddleware } from "middlewares";
import { validateBody } from "middlewares/schemas";

const bodySchema = yup
  .object()
  .shape({
    address: yup.string().required("El address es requerido en el body."),
  })
  .strict()
  .noUnknown(true);

export async function modifyAddress(req: NextApiRequest, res: NextApiResponse, token) {
  const { address } = req.body;
  const { userId } = token;
  
  try {
    const resAddressModified = await modifiedAddress(userId, address);
    res.send(resAddressModified);
  } catch (error) {
    res.status(405).send({
      error: "No fue posible modificar la dirección.",
    });
  }
}

const handler = method({
  patch: authMiddleware(modifyAddress),
});

export default validateBody(bodySchema, handler);
