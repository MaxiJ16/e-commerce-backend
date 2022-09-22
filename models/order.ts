import { firestore } from "../lib/firestore";
const collection = firestore.collection("orders");

type OrderData = {
  status: "pending" | "close" | "paid";
  aditionalInfo?: any;
  productId: string;
  userId: string;
  externalOrder?;
  createdAt: Date;
};

export class Order {
  ref: FirebaseFirestore.DocumentReference;
  data: any;
  id: string;
  constructor(id) {
    this.id = id;
    this.ref = collection.doc(id);
  }
  async pull() {
    const snap = await this.ref.get();
    this.data = snap.data();
  }
  async push() {
    this.ref.update(this.data);
  }
  static async createNewOrder(newOrderData: OrderData = {} as any) {
    const newOrderSnap = await collection.add(newOrderData);
    const newOrder = new Order(newOrderSnap.id);

    newOrder.data = newOrderData;
    newOrder.data.createdAt = new Date();
    return newOrder;
  }

  static async ordersUser(userId: string) {
    const results = await collection.where("userId", "==", userId).get();

    if (results.empty) {
      throw "User without orders";
    } else {
      const orders = [];
      orders.push({ quantityOrders: results.size });

      results.forEach((doc) => {
        orders.push({ orderId: doc.id, orderData: doc.data() });
      });

      return orders;
    }
  }

  static async findById(orderId: string) {
    const results = await collection.doc(orderId).get();

    if (!results.exists) {
      throw "Order not found";
    } else {
      return results.data();
    }
  }
}
