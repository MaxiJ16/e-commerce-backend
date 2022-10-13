import type { NextApiRequest, NextApiResponse } from "next";
import parseBearerToken from "parse-bearer-token";
import { decode } from "lib/jwt";

export function authMiddleware(callback) {
  return function (req: NextApiRequest, res: NextApiResponse) {
    const token = parseBearerToken(req);

    if (!token) {
      res.status(401).send({ message: "No hay token" });
    }

    // Si hay token
    const decodedToken = decode(token);
    // si se pudo decodear
    if (decodedToken) {
      callback(req, res, decodedToken);
    } else {
      res.status(401).send({ message: "Token incorrecto" });
    }
  };
}
