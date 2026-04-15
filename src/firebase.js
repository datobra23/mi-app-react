import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBf4T5XJy-j620MioUodYJXei4b2nh_I9U",
  authDomain: "mi-fruteria-start.firebaseapp.com",
  projectId: "mi-fruteria-start",
  storageBucket: "mi-fruteria-start.firebasestorage.app",
  messagingSenderId: "329185625658",
  appId: "1:329185625658:web:b55db2590657192bd5d703"
};

const app = initializeApp(firebaseConfig);

// 🔥 ESTO ES LO QUE FALTABA
export const auth = getAuth(app);
export const db = getFirestore(app);