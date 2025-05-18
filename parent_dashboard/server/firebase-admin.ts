import admin from "firebase-admin";
import { ServiceAccount } from "firebase-admin"; // ✅ import the type
import serviceAccountJson from "./serviceAccountKey.json";

const serviceAccount = serviceAccountJson as ServiceAccount; // ✅ cast it

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL:
      "https://safeguard-c65bd-default-rtdb.asia-southeast1.firebasedatabase.app",
  });
}

export const db = admin.database();
