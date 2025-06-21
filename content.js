
const emoteBox = document.createElement("div");
emoteBox.id = "emote-box";
document.body.appendChild(emoteBox);

window.addEventListener('send-emote', (e) => {
  const img = document.createElement("img");
  img.src = chrome.runtime.getURL(`emotes/${e.detail}.png`);
  img.className = "emote";
  emoteBox.appendChild(img);
  setTimeout(() => img.remove(), 3000);

  if (e.detail === "emote1") {
    import(chrome.runtime.getURL("lib/confetti.min.js")).then(module => {
      module.default();
    });
  }
});
