console.log("✅ content.js injected (safe version)");

(function () {
  function insertHUD() {
    if (document.querySelector("#chessmotes-hud")) return;

    const container = document.body;
    if (!container) return;

    const hud = document.createElement("div");
    hud.id = "chessmotes-hud";

    const emoteBar = document.createElement("div");
    emoteBar.id = "emote-bar";

    const emote1 = document.createElement("img");
    const emote2 = document.createElement("img");

    try {
      emote1.src = chrome.runtime.getURL("emotes/emote1.png");
      emote2.src = chrome.runtime.getURL("emotes/emote2.png");
    } catch (e) {
      console.error("❌ Error loading emotes", e);
      return;
    }

    emote1.dataset.emote = "emote1";
    emote2.dataset.emote = "emote2";

    emoteBar.appendChild(emote1);
    emoteBar.appendChild(emote2);

    const chatBox = document.createElement("div");
    chatBox.id = "chat-box";

    const chatLog = document.createElement("div");
    chatLog.id = "chat-log";

    const chatInput = document.createElement("input");
    chatInput.id = "chat-input";
    chatInput.placeholder = "Type message...";

    const sendButton = document.createElement("button");
    sendButton.id = "chat-send";
    sendButton.textContent = "Send";


    const chatInputRow = document.createElement("div");
chatInputRow.id = "chat-input-row";
chatInputRow.appendChild(chatInput);
chatInputRow.appendChild(sendButton);

chatBox.appendChild(chatLog);
chatBox.appendChild(chatInputRow);


    hud.appendChild(emoteBar);
    hud.appendChild(chatBox);
    container.appendChild(hud);

    const style = document.createElement("style");
    style.textContent = `
      #chessmotes-hud {
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 240px;
        background: #1f1f1f;
        border-radius: 10px;
        padding: 10px;
        z-index: 100000;
        font-family: sans-serif;
        color: white;
        box-shadow: 0 0 8px rgba(0,0,0,0.5);
      }
      #emote-bar {
        display: flex;
        justify-content: space-around;
        margin-bottom: 8px;
      }
      #emote-bar img {
        width: 48px;
        height: 48px;
        cursor: pointer;
        border-radius: 8px;
        transition: transform 0.2s ease;
      }
      #emote-bar img:hover {
        transform: scale(1.1);
      }
      #chat-box {
        display: flex;
        flex-direction: column;
      }
      #chat-log {
        height: 80px;
        overflow-y: auto;
        background: #2a2a2a;
        border-radius: 6px;
        padding: 4px;
        font-size: 12px;
        margin-bottom: 5px;
      }
      #chat-log div {
        margin-bottom: 3px;
      }
      #chat-input {
        background: #333;
        color: white;
        border: none;
        padding: 6px;
        border-radius: 6px;
        font-size: 12px;
      }
      .emote {
  position: absolute;
  top: 100%;
  left: 0;
  width: 64px;
  height: 64px;
  animation: pop-up 0.5s ease, fade-out 0.5s ease 2.5s;
  z-index: 99999;
}

      @keyframes pop-up {
        0% { transform: scale(0); opacity: 0; }
        50% { transform: scale(1.2); opacity: 1; }
        100% { transform: scale(1); opacity: 1; }
      }
      @keyframes fade-out {
        to { opacity: 0; transform: translateY(-50px); }
      }

      #chat-input-row {
  display: flex;
  gap: 4px;
}

#chat-send {
  background: #00a86b; /* Verde de chess.com */
  color: white;
  border: none;
  padding: 6px 10px;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
  transition: background 0.2s ease;
}

#chat-send:hover {
  background: #007a52;
}
  #chessmotes-hud {
  position: fixed;
  bottom: 20px;
  right: 20px;
  cursor: move; /* para que se vea que se puede mover */
}


    `;
    document.head.appendChild(style);



    function censor(text) {
  const badWords = [
    "fuck", "shit", "bitch", "idiot", "ass", "pendejo", "puto", "puta", "mierda",
    "nigga", "nigger", "faggot", "fag", "retard", "spic", "kike", "tranny", "chink",
    "maricon", "culero", "joto", "perra", "cabron", "zorra", "imbecil", "pene", "pito",
    "sexo", "anal", "verga", "maldito", "idiota", "down", "nebro"
  ];

let isDragging = false;
let offsetX, offsetY;

hud.addEventListener("mousedown", (e) => {
  isDragging = true;
  offsetX = e.clientX - hud.getBoundingClientRect().left;
  offsetY = e.clientY - hud.getBoundingClientRect().top;
});

document.addEventListener("mousemove", (e) => {
  if (isDragging) {
    hud.style.left = `${e.clientX - offsetX}px`;
    hud.style.top = `${e.clientY - offsetY}px`;
    hud.style.right = "auto";
    hud.style.bottom = "auto";
  }
});

document.addEventListener("mouseup", () => {
  isDragging = false;
});


  let clean = text;
  badWords.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    clean = clean.replace(regex, '*'.repeat(word.length));
  });

  return clean;
}


    chatInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && chatInput.value.trim()) {
        const msg = censor(chatInput.value.trim());
        const msgElem = document.createElement("div");
        msgElem.textContent = "You: " + msg;
        chatLog.appendChild(msgElem);
        chatInput.value = "";
        chatLog.scrollTop = chatLog.scrollHeight;
      }
    });

    const emoteBox = document.createElement("div");
emoteBox.id = "emote-box";
hud.appendChild(emoteBox); // ahora está dentro del HUD

window.addEventListener('send-emote', (e) => {
  const img = document.createElement("img");
  img.src = chrome.runtime.getURL(`emotes/${e.detail}.png`);
  img.className = "emote";
  emoteBox.appendChild(img);
  setTimeout(() => img.remove(), 3000);
});


    sendButton.addEventListener("click", () => {
  if (chatInput.value.trim()) {
    const msg = censor(chatInput.value.trim());
    const msgElem = document.createElement("div");
    msgElem.textContent = "You: " + msg;
    chatLog.appendChild(msgElem);
    chatInput.value = "";
    chatLog.scrollTop = chatLog.scrollHeight;
  }
});


    [emote1, emote2].forEach(img => {
  img.onclick = () => {
    const emote = img.dataset.emote;

    // Emitir evento local
    window.dispatchEvent(new CustomEvent('send-emote', { detail: emote }));

    // Mostrar emote flotante
    const imgEl = document.createElement("img");
    imgEl.src = chrome.runtime.getURL(`emotes/${emote}.png`);
    imgEl.className = "emote";
    document.body.appendChild(imgEl);
    setTimeout(() => imgEl.remove(), 3000);
  };
});


    console.log("✅ HUD insertado en el DOM (Ya debería de aparecer pibe que está chequeando la consola)");
  }

  const interval = setInterval(() => insertHUD(), 1000);
})();
