import mercadopago from "mercadopago";

//  EL TOKEN QUE USAMOS ES DEL USER VENDEDOR
mercadopago.configure({
  access_token: process.env.MP_TOKEN,
});

// HACEMOS UNA F PROPIA DE LA LIB, ASÍ NO EXPONEMOS TODA LA LIBRERIA DE MP HACIA EL RESTO DE NUESTRO BACK
export async function getMerchantOrder(id) {
  // HACEMOS UN GET DE LA MERCHANT ORDER
  const res = await mercadopago.merchant_orders.get(id);
  return res.body;
}


// Para crear las preferencias
export async function createPreference(data) {
  try {
    const res = await mercadopago.preferences.create(data);
    return res.body; 
  } catch (error) {
    return error
  }
}
