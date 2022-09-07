import type { NextApiRequest, NextApiResponse } from "next";

import { getMerchantOrder } from "lib/mercadopago";
// import { sendEmail } from "lib/sendgrid";

import { Order } from "lib/models/order";

// Lo que reciba en el query string con el parámetro id
export default async function (req: NextApiRequest, res: NextApiResponse) {
  const { id, topic } = req.query;
  // si el topico es merchant_order va a ir a buscar ese id
  if (topic == "merchant_order") {
    const order = await getMerchantOrder(id);
    // Si la órden esta pagada
    if (order.order_status == "paid") {
      // Enviamos un email a quien compra
      // Si está pago tiene el external_reference que es para nosotros el orderId

      // De la orden de mp extraigo la external reference
      const orderId = order.external_reference;
      // voy a la collection de ese orderId y ese orderId debería tener asociado el userId, ese userId es quien realizó la compra, quien generó la orden a ese le vamos a mandar el mail y vamos a cambiar el estado de la orden por eso ya está pago y ahí se completa todo el ciclo.
      // sendEmail("", 1);

      // Le agregamos que obtenga la order de nuesta db
      // Ese id es el de nuestra db
      const myOrder = new Order(orderId);

      // le pedimos que baje toda la info de la order
      await myOrder.pull();
      myOrder.data.status = "closed";
      // Seteamos a la db que la orden esta cerrada
      await myOrder.push();
      // Enviamos el email
      //  Al que compró
      // sendEmail("Tu pago fue confirmado")
      // Al que vende
      // sendEmailInterno("Alguien compró algo")
    }
  }
  res.send("ok");
}
