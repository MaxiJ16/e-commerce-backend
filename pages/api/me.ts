import type { NextApiRequest, NextApiResponse } from "next";
import { User } from "lib/models/user";
import { authMiddleware } from "lib/middlewares";

// /ME ESTÁ PENSADO PARA QUE ME DEVUELVA LA INFO DE MI USUARIO QUE TIENE EL TOKEN
// PATRÓN DE UNA FUNCIÓN QUE RECIBE OTRA FUNCIÓN

// Función donde termina el request si todo sale bien
export async function handler(req: NextApiRequest, res: NextApiResponse, token) {
  // Generamos un nuevo usuario con el token
  const user = new User(token.userId);
  // Traemos la data con el pull
  await user.pull();
  res.send(user.data);
}

export default authMiddleware(handler)
