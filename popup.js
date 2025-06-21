
document.querySelectorAll('img').forEach(img => {
  img.onclick = () => {
    const emote = img.dataset.emote;
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        func: (emote) => {
          window.dispatchEvent(new CustomEvent('send-emote', { detail: emote }));
        },
        args: [emote]
      });
    });
  };
});
