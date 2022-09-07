// Importamos la conexión a firestore
import { firestore } from "lib/firestore";
import isAfter from "date-fns/isAfter";

// Generamos una clase Auth (Representa a un auth via id y guarda una referencia a ese id)
// En sus propiedades tiene definido una collection, en este caso auth,
const collection = firestore.collection("auth");

export class Auth {
  // nos paramos sobre this.collection.DOC y de ahí sacamos el tipo para ponerle a ref
  ref: FirebaseFirestore.DocumentReference;
  // Declaramos la propiedad data
  data: any;
  id: string;
  // En el constructor definimos que esta clase necesita por lo menos un id
  constructor(id) {
    this.id = id;
    // Ese id va a ser guardado en this.ref(osea la referencia a la base de datos)
    this.ref = collection.doc(id);
  }
  // Agregamos un método para que traiga la data de ese user
  async pull() {
    // El método pull usa el this.ref (recordar que es el doc) y le va a hacer un get que trae la data de esa referencia de firestore
    // snap es la foto del documento en ese momento
    const snap = await this.ref.get();
    // Guardamos la data que nos trae de firestore en this.data
    this.data = snap.data();
  }

  // Si le queremos agregar data y hacer un push
  async push() {
    // this.ref es la referencia al doc en el server
    this.ref.update(this.data);
  }
  isCodeExpired() {
    // fecha de ahora
    const now = new Date();
    // fecha en la que se genero el código
    const expired = this.data.expires.toDate();
    console.log(now);
    console.log(expired);
    
    // comparamos la fecha de ahora con la otra para ver si se pasaron los 2 min
    return isAfter(now, expired);
  }
  // Método para buscar por email
  // Es estático, no pertenece a ninguna instancia, pertenece a la clase
  // xq yo quiero que este método me genere una instancia de esta clase
  static async findByEmail(email: string) {
    const cleanEmail = Auth.cleanEmail(email);
    // Buscamos en la collection donde el campo email sea igual que el cleanEmail que nos pasan
    const results = await collection.where("email", "==", cleanEmail).get();
    // Si tiene algo en los resultados
    if (results.docs.length) {
      // el resultado que queremos es el primero, no debería haber 2 respuestas
      const first = results.docs[0];
      // Creamos un newAuth, nueva instancia de la clase donde estamos y le pasamos el id de results
      const newAuth = new Auth(first.id);
      // no necesitamos hacer un pull para que traiga la data del server
      // entonces le rellenamos la data directamente con lo que trajimos de results
      newAuth.data = first.data();
      return newAuth;
    } else {
      return null;
    }
  }

  // Crea un nuevo registro y le devuelve una instancia de user
  static async createNewAuth(data) {
    const newAuthSnap = await collection.add(data);

    // Generamos una instancia de esta clase con el id que se genero en la base
    const newAuth = new Auth(newAuthSnap.id);
    newAuth.data = data;
    return newAuth;
  }

  static cleanEmail(email: string) {
    return email.trim().toLowerCase();
  }
  // Método que busca 1 de los registros de la collection que tenga ese email y ese code
  static async findByEmailAndCode(email: string, code: number) {
    const cleanEmail = Auth.cleanEmail(email);
    // a la coleccion le estamos pidiendo un registro que tenga un email y un code que coincidan con lo que nos pasan
    const results = await collection
      .where("email", "==", cleanEmail)
      .where("code", "==", code)
      .get();

    //si no encontro nada
    if (results.empty) {
      console.error("email y code no coinciden");
      return null;
    } else {
      const doc = results.docs[0];
      const auth = new Auth(doc.id);
      console.log(results.docs[0]);
      auth.data = doc.data();
      return auth;
      // return results;
    }
  }
}
