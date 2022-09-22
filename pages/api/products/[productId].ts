import type { NextApiRequest, NextApiResponse } from "next";
import * as yup from "yup";
import method from "micro-method-router";
import { getProductObjectId } from "controllers/products";
import { validateQuery } from "middlewares/schemas";

const querySchema = yup
  .object()
  .shape({
    productId: yup.string().required("El productId es requerido en el query."),
  })
  .strict()
  .noUnknown(true);

export async function getProductId(req: NextApiRequest, res: NextApiResponse) {
  try {
    const resolve = await getProductObjectId(req.query.productId as string);
    res.send(resolve);
  } catch (error) {
    res.status(404).send({ error });
  }
}

const handler = method({
  get: getProductId,
});

export default validateQuery(querySchema, handler);
