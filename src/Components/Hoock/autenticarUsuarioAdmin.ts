
import { signInWithEmailAndPassword } from "firebase/auth";
import { toast } from "react-hot-toast";
import { auth } from "../Firebase/firebase";

/**
 * Autentica un usuario administrativo de forma automática
 * para permitir el acceso a Firestore/Storage sin UI de Login.
 */
export const autenticarUsuarioAdmin = async () => {
  const email = "jhornan.coningenieria@gmail.com"; // Usuario definido en código
  const password = "garcia032507";

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log("Autenticado como:", userCredential.user.email);
    // No mostramos toast para que sea transparente al flujo
    return userCredential.user;
  } catch (error) {
    console.error("Error de autenticación automática:", error);
    toast.error("Fallo de acceso a la base de datos");
    throw error;
  }
};
