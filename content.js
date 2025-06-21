console.log("✅ content.js injected (safe version)");

window.addEventListener("DOMContentLoaded", () => {
  function insertHUD() {
    if (document.querySelector("#chessmotes-hud")) return;

    const container = document.querySelector(".board-layout-component") || document.body;
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
      console.error("❌ Error getting emote image URL:", e);
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

    chatBox.appendChild(chatLog);
    chatBox.appendChild(chatInput);

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
        position: fixed;
        bottom: 100px;
        right: 20px;
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
    `;
    document.head.appendChild(style);

    const badWords = ['fuck', 'shit', 'bitch', 'idiot', 'ass', 'pendejo', 'puto'];
    function censor(text) {
      let clean = text;
      badWords.forEach(word => {
        const regex = new RegExp(word, 'gi');
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
    document.body.appendChild(emoteBox);

    window.addEventListener('send-emote', (e) => {
      const img = document.createElement("img");
      try {
        img.src = chrome.runtime.getURL(`emotes/${e.detail}.png`);
        img.className = "emote";
        emoteBox.appendChild(img);
        setTimeout(() => img.remove(), 3000);
      } catch (e) {
        console.error("❌ Error dispatching emote image:", e);
      }
    });

    [emote1, emote2].forEach(img => {
      img.onclick = () => {
        const emote = img.dataset.emote;
        window.dispatchEvent(new CustomEvent('send-emote', { detail: emote }));
      };
    });

    console.log("✅ HUD inserted into DOM");
  }

  const interval = setInterval(() => insertHUD(), 1000);
});
