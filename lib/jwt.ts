import jwt from "jsonwebtoken";

export function generate(obj) {
  // Le pasamos el secret que guardamos en .env.local
  return jwt.sign(obj, process.env.JWT_SECRET);
}

export function decode(token) {
  // Puede fallar si está mal el token, así que lo metemos en un try catch
  try {
    // Devuelve el token decodificado
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    console.error("Token incorrecto", error);
    // si hay error devuelve null
    return null;
  }
}
