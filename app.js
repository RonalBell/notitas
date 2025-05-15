// Referencias a elementos del DOM
const loginView = document.getElementById('loginView');
const notesView = document.getElementById('notesView');
const googleLoginBtn = document.getElementById('googleLogin');
const logoutBtn = document.getElementById('logoutBtn');
const notesList = document.getElementById('notesList');
const addNoteForm = document.getElementById('addNoteForm');
const noteContent = document.getElementById('noteContent');
const addNoteBtn = document.getElementById('addNoteBtn');

// Referencia a la colección de notas
const notesRef = db.collection('notes');

// Estado del usuario
let currentUser = null;
let isAdmin = false;

// Configurar el proveedor de Google
const googleProvider = new firebase.auth.GoogleAuthProvider();

// Función para iniciar sesión con Google
googleLoginBtn.addEventListener('click', async () => {
    try {
        const result = await auth.signInWithPopup(googleProvider);
        currentUser = result.user;
        
        // Verificar si el usuario es administrador
        const userDoc = await db.collection('users').doc(currentUser.uid).get();
        if (userDoc.exists) {
            isAdmin = userDoc.data().isAdmin;
        } else {
            // Si es la primera vez que inicia sesión, crear el documento del usuario
            await db.collection('users').doc(currentUser.uid).set({
                email: currentUser.email,
                isAdmin: false, // Por defecto, no es administrador
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
        }
        
        showNotesView();
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        alert('Error al iniciar sesión. Por favor, intenta de nuevo.');
    }
});

// Función para cerrar sesión
logoutBtn.addEventListener('click', async () => {
    try {
        await auth.signOut();
        currentUser = null;
        isAdmin = false;
        showLoginView();
    } catch (error) {
        console.error('Error al cerrar sesión:', error);
    }
});

// Función para mostrar la vista de notas
function showNotesView() {
    loginView.classList.add('hidden');
    notesView.classList.remove('hidden');
    
    // Mostrar u ocultar el formulario de agregar notas según el rol
    addNoteForm.style.display = isAdmin ? 'block' : 'none';
    
    // Cargar las notas existentes
    loadNotes();
}

// Función para mostrar la vista de login
function showLoginView() {
    notesView.classList.add('hidden');
    loginView.classList.remove('hidden');
    notesList.innerHTML = '';
}

// Función para cargar las notas
function loadNotes() {
    notesRef.orderBy('createdAt', 'desc').onSnapshot((snapshot) => {
        notesList.innerHTML = '';
        snapshot.forEach((doc) => {
            const note = doc.data();
            const noteElement = createNoteElement(doc.id, note);
            notesList.appendChild(noteElement);
        });
    });
}

// Función para crear un elemento de nota
function createNoteElement(id, note) {
    const div = document.createElement('div');
    div.className = 'note';
    div.innerHTML = `
        <p>${note.content}</p>
        <small>Creado por: ${note.authorEmail}</small>
        ${isAdmin ? `
            <button class="delete-btn" onclick="deleteNote('${id}')">
                <i class="fas fa-trash"></i>
            </button>
        ` : ''}
    `;
    return div;
}

// Función para agregar una nueva nota
addNoteBtn.addEventListener('click', async () => {
    if (!noteContent.value.trim()) {
        alert('Por favor, escribe algo en la nota.');
        return;
    }

    try {
        const noteData = {
            content: noteContent.value,
            authorEmail: currentUser.email,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        };

        await notesRef.add(noteData);
        
        // Notificar a los usuarios no admin
        if (isAdmin) {
            await notifyNewNote(noteContent.value, currentUser.email);
        }
        
        noteContent.value = '';
    } catch (error) {
        console.error('Error al agregar la nota:', error);
        alert('Error al agregar la nota. Por favor, intenta de nuevo.');
    }
});

// Función para eliminar una nota
async function deleteNote(id) {
    if (!isAdmin) return;
    
    try {
        await notesRef.doc(id).delete();
    } catch (error) {
        console.error('Error al eliminar la nota:', error);
        alert('Error al eliminar la nota. Por favor, intenta de nuevo.');
    }
}

// Observar el estado de autenticación
auth.onAuthStateChanged((user) => {
    if (user) {
        currentUser = user;
        showNotesView();
    } else {
        currentUser = null;
        showLoginView();
    }
}); 