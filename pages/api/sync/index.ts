import type { NextApiRequest, NextApiResponse } from "next";
import { SyncProducts } from "controllers/products";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    await SyncProducts();
    res.status(200).send({ Message: "Sincronizado con éxito" });
  } catch (error) {
    res.status(400).send({ error: 400, Message: error });
  }
}
