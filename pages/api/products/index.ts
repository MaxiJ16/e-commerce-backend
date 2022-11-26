import type { NextApiRequest, NextApiResponse } from "next";
import method from "micro-method-router";
import { getAllProducts } from "controllers/products";

export async function getProducts(req: NextApiRequest, res: NextApiResponse) {
  try {
    const resolve = await getAllProducts();
    res.send(resolve);
  } catch (error) {
    res.status(404).send({ error });
  }
}

const handler = method({
  get: getProducts,
});

export default handler;
