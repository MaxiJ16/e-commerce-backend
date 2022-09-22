import type { NextApiRequest, NextApiResponse } from "next";
import method from "micro-method-router";
import { updateOrder } from "controllers/orders";

export async function postHandler(req: NextApiRequest, res: NextApiResponse) {
  const { id, topic } = req.query;

  try {
    const resUpOrder = await updateOrder(topic as string, id as string);
    res.send(resUpOrder);
  } catch (error) {
    res.send(error);
  }
}

const handler = method({
  post: postHandler,
});

export default handler;