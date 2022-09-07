import type { NextApiRequest, NextApiResponse } from "next";
// Importamos la clase User
import { Auth } from "lib/models/auth";

import { findOrCreateAuth } from "lib/controllers/auth";
import { User } from "lib/models/user";
import { sendCode } from "lib/controllers/auth";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  // // Creamos un nuevo usuario
  // const newUser = await firestore.collection("auth").add({
  //   email: "marce@apx.school",
  // });

  // EJEMPLO 1

  // // le pasamos el id (el id lo trajimos desde la base de datos )
  // const marce = new Auth("5nr4zkVOI305wYkbIl2p");
  // // le decimos que traiga la data de marce
  // await marce.pull();

  // marce.data.test = "dato hacia la base";
  // await marce.push();
  // // y respondemos con marce.data
  // res.send(marce.data);

  // EJEMPLO DE AUTH

  // const auth = await findOrCreateAuth(req.body.email);
  // auth.data.test = "Cambio desde el endpoint";
  // await auth.push();
  // res.send(auth.data);

  // EJEMPLO NEW USER
  // const newUser = await User.createNewUser({
  //   email: "test+1",
  // });
  // newUser.data.test = "cambio"
  // await newUser.push()

  // ÚLTIMO EJEMPLO
  const auth = await sendCode(req.body.email);

  res.send(auth);
}

