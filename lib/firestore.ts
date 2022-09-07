import admin from "firebase-admin";

const serviceAccount = JSON.parse(process.env.FIREBASE_CONNECTION);

// Preguntamos si ya hay instancias levantadas así no se ejecuta muchas veces
if (admin.apps.length == 0) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

// Declaramos una constante que es igual al admin
const firestore = admin.firestore();
// y lo exportamos
export { firestore };
