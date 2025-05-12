// UI rendering logic
import { loadNotes, saveNote } from "../services/firestore.js";
import { login, loginWithGoogle, logout } from "../services/auth.js";

const appDiv = document.getElementById("app");

export const renderLoginForm = () => {
    // Ensure the app container is cleared before rendering
    appDiv.innerHTML = "";

    // Create the login container
    const loginContainer = document.createElement("div");
    loginContainer.className = "login-container";

    // Add content to the login container
    loginContainer.innerHTML = `
        <h2>🌙 Bienvenido a Notas Lunares</h2>
        <p>Inicia sesión para guardar y compartir tus pensamientos bajo la luz de la luna.</p>
        <button class="google-login-button">Iniciar sesión con Google</button>
    `;

    // Append the login container to the app
    appDiv.appendChild(loginContainer);

    // Configure the Google login button event
    const googleLoginButton = loginContainer.querySelector(".google-login-button");
    googleLoginButton.addEventListener("click", async () => {
        try {
            const user = await loginWithGoogle();
            alert(`Bienvenido, ${user.displayName}`);
            renderNotesView();
        } catch (error) {
            alert("Error al iniciar sesión: " + error.message);
        }
    });
};

export const renderNotesView = async () => {
    appDiv.innerHTML = ""; // Clear previous content

    const form = document.createElement("form");
    form.innerHTML = `
        <input type="text" id="title" placeholder="Título" required />
        <textarea id="content" placeholder="Contenido" required></textarea>
        <button type="submit">Crear Cartita</button>
    `;
    appDiv.appendChild(form);

    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        const title = document.getElementById("title").value;
        const content = document.getElementById("content").value;

        const note = { title, content, createdAt: new Date().toISOString() };
        await saveNote(note);
        form.reset();
        renderNotesView();
    });

    const notes = await loadNotes();
    notes.forEach(note => {
        const cardDiv = document.createElement("div");
        cardDiv.className = "card";
        cardDiv.innerHTML = `
            <h3>${note.title}</h3>
            <p>${note.content}</p>
            <small>Creado el: ${new Date(note.createdAt).toLocaleString()}</small>
        `;
        appDiv.appendChild(cardDiv);
    });
};

export const renderModal = () => {
    const modal = document.createElement("div");
    modal.className = "modal";
    modal.id = "note-modal";
    modal.innerHTML = `
        <h2>Crear Nueva Nota</h2>
        <input type="text" id="modal-title" placeholder="Título" required />
        <textarea id="modal-content" placeholder="Contenido" required></textarea>
        <button id="save-note">Guardar Nota</button>
        <button id="close-modal">Cerrar</button>
    `;
    document.body.appendChild(modal);

    const closeModal = () => {
        modal.classList.remove("active");
    };

    document.getElementById("close-modal").addEventListener("click", closeModal);

    document.getElementById("save-note").addEventListener("click", async () => {
        const title = document.getElementById("modal-title").value;
        const content = document.getElementById("modal-content").value;

        if (title && content) {
            const note = { title, content, createdAt: new Date().toISOString() };
            await saveNote(note);
            closeModal();
            renderNotesView();
        } else {
            alert("Por favor, completa todos los campos.");
        }
    });
};

export const showModal = () => {
    const modal = document.getElementById("note-modal");
    modal.classList.add("active");
};

export const renderDropdownForm = () => {
    const dropdown = document.createElement("div");
    dropdown.className = "dropdown";

    dropdown.innerHTML = `
        <button class="dropdown-button">Crear Nueva Nota</button>
        <div class="dropdown-content">
            <input type="text" id="dropdown-title" placeholder="Título" required />
            <textarea id="dropdown-content" placeholder="Contenido" required></textarea>
            <button id="dropdown-save">Guardar Nota</button>
        </div>
    `;

    appDiv.appendChild(dropdown);

    const saveButton = dropdown.querySelector("#dropdown-save");
    saveButton.addEventListener("click", async () => {
        const title = dropdown.querySelector("#dropdown-title").value;
        const content = dropdown.querySelector("#dropdown-content").value;

        if (title && content) {
            const note = { title, content, createdAt: new Date().toISOString() };
            await saveNote(note);
            renderNotesView();
        } else {
            alert("Por favor, completa todos los campos.");
        }
    });
};