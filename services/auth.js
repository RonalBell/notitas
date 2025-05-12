// Authentication logic
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, signOut } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-auth.js";
import app from "./firebase.js";

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export const login = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log("Usuario autenticado:", userCredential.user);
        return userCredential.user;
    } catch (error) {
        console.error("Error al iniciar sesión:", error);
        throw error;
    }
};

export const loginWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        console.log("Usuario autenticado con Google:", user);

        // Verificar si el usuario tiene acceso permitido
        const allowedEmails = ["ronalbello2529@gmail.com", "emaildeella@gmail.com"]; // Reemplaza con los correos permitidos
        if (!allowedEmails.includes(user.email)) {
            throw new Error("Acceso denegado: Este correo no tiene permisos.");
        }

        return user;
    } catch (error) {
        console.error("Error al autenticar con Google:", error);
        throw error;
    }
};

export const logout = async () => {
    try {
        await signOut(auth);
        console.log("Usuario desconectado");
        alert("Sesión cerrada. Ahora puedes iniciar sesión con otra cuenta.");
    } catch (error) {
        console.error("Error al cerrar sesión:", error);
    }
};