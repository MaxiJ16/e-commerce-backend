import { firestore } from "lib/firestore";
import isAfter from "date-fns/isAfter";

const collection = firestore.collection("auth");

export class Auth {
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

  static async findByEmail(email: string) {
    const cleanEmail = Auth.cleanEmail(email);
    const results = await collection.where("email", "==", cleanEmail).get();

    if (results.docs.length) {
      const first = results.docs[0];
      const newAuth = new Auth(first.id);
      newAuth.data = first.data();
      return newAuth;
    } else {
      return null;
    }
  }

  static async createNewAuth(data) {
    const newAuthSnap = await collection.add(data);
    const newAuth = new Auth(newAuthSnap.id);
    newAuth.data = data;
    return newAuth;
  }

  static cleanEmail(email: string) {
    return email.trim().toLowerCase();
  }

  static async findByEmailAndCode(email: string, code: number) {
    const cleanEmail = Auth.cleanEmail(email);

    const results = await collection
      .where("email", "==", cleanEmail)
      .where("code", "==", code)
      .get();

    if (results.empty) {
      throw "email y code no coinciden";
    } else {
      const doc = results.docs[0];
      const auth = new Auth(doc.id);
      auth.data = doc.data();
      return auth;
    }
  }

  isCodeExpired() {
    const now = new Date();
    const expired = this.data.expires.toDate();
    return isAfter(now, expired);
  }
}
