// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-auth.js";
import { renderLoginForm } from "./views/ui.js";

console.log("App inicializada");

// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDnk37eZ1UL_GS437343mB4LYYhqoh01pk",
    authDomain: "notitas-16a1e.firebaseapp.com",
    projectId: "notitas-16a1e",
    storageBucket: "notitas-16a1e.firebasestorage.app",
    messagingSenderId: "860713219431",
    appId: "1:860713219431:web:7330701e7f01f18164ebc2",
    measurementId: "G-6XCN8SWY70"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

console.log("Firebase configurado correctamente");

// Main application entry point
renderLoginForm();

