import type { NextApiRequest, NextApiResponse } from "next";
import method from "micro-method-router";
import { authMiddleware } from "middlewares";
import { getOrdersUser } from "controllers/orders";

export async function getOrdersByUserId(req: NextApiRequest, res: NextApiResponse, token) {
  try {
    const resOrder = await getOrdersUser(token.userId);
    res.send(resOrder);
  } catch (error) {
    res.status(405).send({
      error,
    });
  }
}

const handler = method({
  get: getOrdersByUserId,
});

export default authMiddleware(handler);
