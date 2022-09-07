import type { NextApiRequest, NextApiResponse } from "next";
import { Order } from "lib/models/order";
import { authMiddleware } from "lib/middlewares";
import method from "micro-method-router";
import { createPreference } from "lib/mercadopago";

const products = {
  1234: {
    title: "Mate de APX",
    price: 200,
  },
};

// Order es un endpoint seguro, chequea que el user tenga token y este en sesión
export async function postHandler(
  req: NextApiRequest,
  res: NextApiResponse,
  token
) {
  const { productId } = req.query as any;
  const product = products[productId];

  // si este producto no existe
  if (!product) {
    res.status(404).json({ message: "el producto no existe" });
  }

  // Este orden tiene la info adicional, el producto y el usuario que quiere comprar
  const order = await Order.createNewOrder({
    // La data que nos pasó el user la guardamos como info adicional
    aditionalInfo: req.body,
    // que compra
    productId,
    // quien compra
    userId: token.userId,
    // iniciamos la orden con el estado pendiente
    status: "pending"
  });

  const pref = await createPreference({
    external_reference: order.id,
    items: [
      {
        title: product.title,
        description: "Dummy description",
        picture_url: "http://www.myapp.com/myimage.jpg",
        category_id: "cat123",
        quantity: 1,
        currency_id: "ARS",
        unit_price: product.price,
      },
    ],
    notification_url: "https://payments-jade.vercel.app/api/webhooks/mercadopago",
    back_urls: { success: "https://apx.school" },
  });

  // Respondemos solo el init point porque la otra data no le interesa al user
  res.send({
    url: pref.init_point,
  });
}

// A post hay que pasarle una f, le pasamos la de postHandler y hacemos un mapa 1 a 1
const handler = method({
  post: postHandler,
});

export default authMiddleware(handler);
