// Faux contacts / avatars
const contacts = [
    {
        id: 1,
        name: "Alice",
        status: "online",
        avatar: "https://via.placeholder.com/24x24?text=A"
    },
    {
        id: 2,
        name: "Marc",
        status: "away",
        avatar: "https://via.placeholder.com/24x24?text=M"
    },
    {
        id: 3,
        name: "Nina",
        status: "busy",
        avatar: "https://via.placeholder.com/24x24?text=N"
    }
];

const predefinedAvatars = [
    "https://via.placeholder.com/48x48?text=A",
    "https://via.placeholder.com/48x48?text=B",
    "https://via.placeholder.com/48x48?text=C",
    "https://via.placeholder.com/48x48?text=D",
    "https://via.placeholder.com/48x48?text=E",
    "https://via.placeholder.com/48x48?text=F",
    "https://via.placeholder.com/48x48?text=G",
    "https://via.placeholder.com/48x48?text=H",
    "https://via.placeholder.com/48x48?text=I",
    "https://via.placeholder.com/48x48?text=J"
];

const contactsList = document.getElementById("contactsList");
const chatArea = document.getElementById("chatArea");
const messageInput = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");
const wizzBtn = document.getElementById("wizzBtn");
const statusSelect = document.getElementById("statusSelect");
const remoteName = document.getElementById("remoteName");
const remoteStatus = document.getElementById("remoteStatus");
const remoteAvatar = document.getElementById("remoteAvatar");
const msnWindow = document.getElementById("msnWindow");

const soundMessage = document.getElementById("soundMessage");
const soundWizz = document.getElementById("soundWizz");

const avatarModal = document.getElementById("avatarModal");
const changeAvatarBtn = document.getElementById("changeAvatarBtn");
const closeAvatarModal = document.getElementById("closeAvatarModal");
const avatarGrid = document.getElementById("avatarGrid");
const avatarUpload = document.getElementById("avatarUpload");
const localAvatar = document.getElementById("localAvatar");

let currentContact = contacts[0];

// Initialisation
renderContacts();
setRemoteContact(currentContact);
addSystemMessage("Conversation démarrée avec " + currentContact.name + ".");

// Contacts
function renderContacts() {
    contactsList.innerHTML = "";
    contacts.forEach(c => {
        const li = document.createElement("li");
        li.dataset.id = c.id;

        li.innerHTML = `
            <img class="contact-avatar" src="${c.avatar}" alt="">
            <span class="contact-name">${c.name}</span>
            <span class="contact-status ${c.status}">${c.status}</span>
        `;

        li.addEventListener("click", () => {
            currentContact = c;
            setRemoteContact(c);
            addSystemMessage("Tu discutes maintenant avec " + c.name + ".");
        });

        contactsList.appendChild(li);
    });
}

function setRemoteContact(contact) {
    remoteName.textContent = contact.name;
    remoteStatus.textContent = contact.status;
    remoteStatus.className = "status-label " + contact.status;
    remoteAvatar.src = contact.avatar.replace("24x24", "48x48");
}

// Messages
function addSystemMessage(text) {
    const div = document.createElement("div");
    div.className = "message system";
    div.innerHTML = `<div class="text" style="color:#666;font-style:italic;">${text}</div>`;
    chatArea.appendChild(div);
    chatArea.scrollTop = chatArea.scrollHeight;
}

function addMessage(author, text, isMe = false) {
    const div = document.createElement("div");
    div.className = "message" + (isMe ? " me" : "");
    div.innerHTML = `
        <div class="author">${author}</div>
        <div class="text">${escapeHtml(text)}</div>
    `;
    chatArea.appendChild(div);
    chatArea.scrollTop = chatArea.scrollHeight;
}

function escapeHtml(str) {
    return str.replace(/[&<>"']/g, c => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    }[c]));
}

// Envoi message
sendBtn.addEventListener("click", sendMessage);
messageInput.addEventListener("keydown", e => {
    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

function sendMessage() {
    const text = messageInput.value.trim();
    if (!text) return;

    addMessage("Toi", text, true);
    messageInput.value = "";
    playMessageSound();

    // Simuler une réponse du contact
    setTimeout(() => {
        const reply = "Réponse auto de " + currentContact.name + " : \"" + text + "\" 😉";
        addMessage(currentContact.name, reply, false);
        playMessageSound();
    }, 800);
}

// Sons
function playMessageSound() {
    soundMessage.currentTime = 0;
    soundMessage.play().catch(() => {});
}

function playWizzSound() {
    soundWizz.currentTime = 0;
    soundWizz.play().catch(() => {});
}

// Wizz / Nudge
wizzBtn.addEventListener("click", () => {
    triggerWizz("Tu as envoyé un wizz à " + currentContact.name + " !");
    // Simuler un wizz reçu
    setTimeout(() => {
        triggerWizz(currentContact.name + " t’a envoyé un wizz !");
    }, 1200);
});

function triggerWizz(message) {
    addSystemMessage(message);
    msnWindow.classList.remove("shake");
    void msnWindow.offsetWidth; // reset animation
    msnWindow.classList.add("shake");
    playWizzSound();
}

// Changement de statut local (visuel seulement)
statusSelect.addEventListener("change", () => {
    const status = statusSelect.value;
    addSystemMessage("Ton statut est maintenant : " + status + ".");
});

// Modal avatar
changeAvatarBtn.addEventListener("click", () => {
    avatarModal.classList.remove("hidden");
    renderAvatarGrid();
});

closeAvatarModal.addEventListener("click", () => {
    avatarModal.classList.add("hidden");
});

function renderAvatarGrid() {
    avatarGrid.innerHTML = "";
    predefinedAvatars.forEach(url => {
        const img = document.createElement("img");
        img.src = url;
        img.addEventListener("click", () => {
            localAvatar.src = url;
            avatarModal.classList.add("hidden");
        });
        avatarGrid.appendChild(img);
    });
}

avatarUpload.addEventListener("change", e => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
        localAvatar.src = reader.result;
        avatarModal.classList.add("hidden");
    };
    reader.readAsDataURL(file);
});
