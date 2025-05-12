// Firestore operations
import app from "./firebase.js";
import { getFirestore, collection, getDocs, addDoc } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-firestore.js";

const db = getFirestore(app);

export const loadNotes = async () => {
    const notesCollection = collection(db, "notes");
    const notesSnapshot = await getDocs(notesCollection);
    return notesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const saveNote = async (note) => {
    try {
        const docRef = await addDoc(collection(db, "notes"), note);
        console.log("Nota guardada con ID:", docRef.id);
        return docRef.id;
    } catch (error) {
        console.error("Error al guardar la nota:", error);
        throw error;
    }
};