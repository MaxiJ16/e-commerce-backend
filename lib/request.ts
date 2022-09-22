import type { NextApiRequest, NextApiResponse } from "next";

// Función que recibe el objeto req y devuelve el offset y el limit
export function getOffsetAndLimitFromReq(
  req: NextApiRequest,
  maxLimit = 100,
  maxOffset = 10000
) {
  // si no viene un limit o offset les pone 0
  const queryLimit = Number(req.query.limit || "0");
  const queryOffset = Number(req.query.offset || "0");

  // limit por defecto 10
  let limit = 10;
  // si el querylimit que nos pasan es mayor que 0 y menor que el máximo (100)
  if (queryLimit > 0 && queryLimit < maxLimit) {
    limit = queryLimit;
  } else if (queryLimit > maxLimit) {
    limit = maxLimit;
  }

  // si query offset es menor que el total de registros usamos queryOffset, sino 0
  const offset = queryOffset < maxOffset ? queryOffset : 0;

  return {
    limit,
    offset,
  };
}
