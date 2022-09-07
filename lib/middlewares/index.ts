import type { NextApiRequest, NextApiResponse } from "next";
import parseBearerToken from "parse-bearer-token";
import { decode } from "lib/jwt";

// Middleware que recibe la función handler o la que le pasemos
// Que va a ser quién ejecute finalmente lo que tenga que ser con este endpoint si todo sale bien

// 1 - Parsea el token
// 2 - Si existe en el req lo decodea y sino retorna el msg de error
// 3 - Si está el token decodeado pasa a ejecutar el callback que es la función handler en este caso, y sino devuelve token incorrecto
export function authMiddleware(callback) {
  return function (req: NextApiRequest, res: NextApiResponse) {
    // Extraemos el token del bearer token que nos pasan en el header
    const token = parseBearerToken(req);

    if (!token) {
      // El status 401 es que no estás autorizado para hacer esto
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

