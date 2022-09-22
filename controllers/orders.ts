import { createPreference, getMerchantOrder } from "lib/mercadopago";
import { sendConfirmedPayment } from "lib/sendgrid";
import { Order } from "models/order";
import { getProductObjectId } from "./products";
import { getUserById } from "./users";

type CreateOrderRes = {
  url: string;
  orderId: string;
};

export async function createOrder(
  userId: string,
  productId: string,
  aditionalInfo
): Promise<CreateOrderRes> {
  const product = await getProductObjectId(productId);

  if (!product) {
    throw "el producto no existe";
  }

  const order = await Order.createNewOrder({
    aditionalInfo,
    productId,
    userId,
    status: "pending",
    createdAt: new Date(),
  });

  const pref = await createPreference({
    external_reference: order.id,
    items: [
      {
        id: productId,
        title: product.Name,
        description: `Descripción de ${product.Name}`,
        picture_url: product.Images.url,
        category_id: product.Type,
        quantity: 1,
        currency_id: "ARS",
        unit_price: product["Unit cost"],
      },
    ],

    notification_url:
      // "https://webhook.site/9f8e720c-0015-4e3f-b279-cc7bb0321b3d",
      "https://e-commerce-backend-nbphjkfi2-maxij16.vercel.app/api/webhooks/mercadopago",
    back_urls: { success: "https://apx.school" },
  });

  return {
    url: pref.init_point,
    orderId: pref.external_reference,
  };
}

// Órdenes de un user
export async function getOrdersUser(id: string) {
  return await Order.ordersUser(id);
}

// Órdenes con su id
export async function orderById(id: string) {
  return await Order.findById(id);
}

export async function updateOrder(topic: string, id: string) {
  if (topic == "merchant_order") {
    const order = await getMerchantOrder(id);

    if (order.order_status == "paid") {
      const orderId = order.external_reference;

      const myOrder = new Order(orderId);
      await myOrder.pull();

      myOrder.data.status = "paid";
      myOrder.data.externalOrder = order;
      myOrder.data.updateAt = new Date();

      await myOrder.push();

      const user = await getUserById(myOrder.data.userId);
      const product = await getProductObjectId(myOrder.data.productId);
      const resEmail = await sendConfirmedPayment(user.email, product);

      return { Mensaje: resEmail.message, order };
    } else {
      throw "La órden no está pagada";
    }
  }
}
