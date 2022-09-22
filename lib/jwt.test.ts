import { generate, decode } from "./jwt";
import test from "ava";

test("jwt encode/decode", (t) => {
  // Objeto
  const payload = { maxi: true };
  // Generamos el token con ese objeto
  const token = generate(payload);
  // Decodeamos ese token
  const salida = decode(token) as any;

  // Le sacamos el iat a salida para que concidan
  delete salida.iat;

  // EL PAYLOAD Y LA SALIDA TIENEN QUE SER IGUALES
  // ENTONCES AHI SI CHEQUEAMOS QUE LAS FUNCIONES HAGAN LOS QUE TENGAN QUE HACER, ENCODEAR Y DECODEAR

  // LE DECIMOS A AVA QUE EVALUE SI SON IGUALES EL PAYLOAD Y LA SALIDA
  t.deepEqual(payload, salida);
});
