import type { NextApiRequest, NextApiResponse } from "next";
import * as yup from "yup";
import method from "micro-method-router";
import { orderById } from "controllers/orders";
import { validateQuery } from "middlewares/schemas";

const querySchema = yup
  .object()
  .shape({
    orderId: yup.string().required("Orderid es requerida."),
  })
  .strict()
  .noUnknown(true);

export async function getOrderId(req: NextApiRequest, res: NextApiResponse) {
  try {
    const resolve = await orderById(req.query.orderId as string);
    res.send(resolve);
  } catch (error) {
    res.status(404).send({ error });
  }
}

const handler = method({
  get: getOrderId,
});

export default validateQuery(querySchema, handler);
