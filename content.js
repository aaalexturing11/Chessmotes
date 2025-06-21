const menu = document.createElement("div");
menu.id = "emote-menu";
menu.innerHTML = `
  <img src="${chrome.runtime.getURL("emotes/emote1.png")}" data-emote="emote1">
`;
document.body.appendChild(menu);

// Estilo básico desde JS (puedes mover a styles.css)
const style = document.createElement("style");
style.textContent = `
  #emote-menu {
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: rgba(30,30,30,0.95);
    padding: 10px;
    border-radius: 12px;
    display: flex;
    gap: 10px;
    z-index: 100000;
  }
  #emote-menu img {
    width: 40px;
    height: 40px;
    cursor: pointer;
    border-radius: 8px;
    transition: transform 0.2s ease;
  }
  #emote-menu img:hover {
    transform: scale(1.2);
  }
`;
document.head.appendChild(style);

// Emote click handler
menu.querySelectorAll('img').forEach(img => {
  img.onclick = () => {
    const emote = img.dataset.emote;
    window.dispatchEvent(new CustomEvent('send-emote', { detail: emote }));
  };
});
