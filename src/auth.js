import { auth, db } from "./firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export const registrarUsuario = async (email, password, role) => {
  const cred = await createUserWithEmailAndPassword(auth, email, password);

  await setDoc(doc(db, "usuarios", cred.user.uid), {
    email,
    role,
    empresaId: "empresa-demo"
  });
};