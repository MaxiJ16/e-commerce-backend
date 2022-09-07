// Importamos la conexión a firestore
import { firestore } from "../firestore";

// Generamos una clase User (Representa a un user via id y guarda una referencia a ese id)
// En sus propiedades tiene definido una collection, en este caso users,
const collection = firestore.collection("users");

export class User {
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
  // Crea un nuevo registro y le devuelve una instancia de user
  static async createNewUser(data) {
    const newUserSnap = await collection.add(data);

    // Generamos una instancia de esta clase con el id que se genero en la base
    const newUser = new User(newUserSnap.id);
    newUser.data = data;
    return newUser;
  }
}
