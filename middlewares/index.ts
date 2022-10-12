import type { NextApiRequest, NextApiResponse } from "next";
import parseBearerToken from "parse-bearer-token";
import { decode } from "lib/jwt";
import type { NextRequest } from "next/server";

export function middlewareCors(req: NextRequest) {
  return new Response("", {
    status: 204,
    headers: {
      "Access-Control-Allow-Credentials": "true",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,OPTIONS,PATCH,DELETE,POST,PUT",
      "Access-Control-Allow-Headers": req.headers.get(
        "Access-Control-Request-Headers"
      ),
      Vary: "Access-Control-Request-Headers",
      "Content-Length": "0",
    },
  });
}

export function authMiddleware(callback) {
  return function (
    req: NextApiRequest,
    res: NextApiResponse,
    request: NextRequest
  ) {
    if (request.method == "OPTIONS") {
      middlewareCors(request);
    }
    
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
