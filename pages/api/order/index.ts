import type { NextApiRequest, NextApiResponse } from "next";
import method from "micro-method-router";
import * as yup from "yup";
import { validateBody, validateQuery } from "middlewares/schemas";
import { authMiddleware } from "middlewares";
import { createOrder } from "controllers/orders";

let querySchema = yup
  .object()
  .shape({
    productId: yup.string().required("Falta el productId en la query."),
  });

let bodySchema = yup
  .object()
  .shape({
    color: yup.string(),
    shippment_address: yup
      .string()
      .required("La dirección del envío es necesaria en el body."),
  })
  .strict()
  .noUnknown(true);

export async function postHandler(req: NextApiRequest, res: NextApiResponse, token) {
  const { productId } = req.query as any;

  try {
    const { url, orderId } = await createOrder(
      token.userId,
      productId,
      req.body
    );

    res.send({ url, orderId });
  } catch (error) {
    res.status(400).send({ message: error });
  }
}

const handler = method({
  post: postHandler,
});

export default validateQuery(
  querySchema,
  validateBody(bodySchema, authMiddleware(handler))
);
