import type { NextApiRequest, NextApiResponse } from "next";
import * as yup from "yup";
import method from "micro-method-router";
import { getOffsetAndLimitFromReq } from "lib/request";
import { getProducts } from "controllers/products";
import { validateQuery } from "middlewares/schemas";

const querySchema = yup
  .object()
  .shape({
    q: yup.string().required("El query es requerido en el query."),
    limit: yup.string(),
    offset: yup.string(),
  })
  .strict()
  .noUnknown(true);


export async function getSearchProducts(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { limit, offset } = getOffsetAndLimitFromReq(req);
    const results = await getProducts(req.query.q as string, limit, offset);
    res.send(results);
  } catch (error) {
    res.status(400).send({ error });
  }
}

const handler = method({
  get: getSearchProducts,
})

export default validateQuery(querySchema, handler)

