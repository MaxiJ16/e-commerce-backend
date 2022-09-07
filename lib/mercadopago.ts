import mercadopago from "mercadopago";

//  EL TOKEN QUE USAMOS ES DEL USER VENDEDOR
mercadopago.configure({
  access_token: process.env.MP_TOKEN,
});

export async function getMerchantOrder(id) {
  const res = await mercadopago.merchant_orders.get(id);
  return res.body;
}


// Para crear las preferencias
export async function createPreference(data) {
  // Creamos la preferencia
  const res = await mercadopago.preferences.create(data);
  return res.body; 
}
