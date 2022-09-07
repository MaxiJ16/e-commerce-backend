// Importamos la conexión a firestore
import { firestore } from "../firestore";

const collection = firestore.collection("orders");

// Representa la data de cada documento de la collection orders
type OrderData = {
  status?: string;
  aditionalInfo?: string;
  productId?: string;
  userId?: string;
};

export class Order {
  ref: FirebaseFirestore.DocumentReference;
  data: OrderData;
  id: string;
  constructor(id) {
    this.id = id;
    this.ref = collection.doc(id);
  }
  // Trae la data de firebase
  async pull() {
    const snap = await this.ref.get();
    this.data = snap.data();
  }
  // Agrega nueva data con update
  async push() {
    this.ref.update(this.data);
  }
  static async createNewOrder(newOrderData: OrderData = {}) {
    // Crea la order con la data que nos pasan
    const newOrderSnap = await collection.add(newOrderData);
    const newOrder = new Order(newOrderSnap.id);
    newOrder.data = newOrderData;
    return newOrder;
  }
}
