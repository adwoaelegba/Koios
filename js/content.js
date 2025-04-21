function injectButtonIfNeeded() {
    const bodyText = document.body.innerText.toLowerCase();
    if (bodyText.includes("privacy policy")) {
      if (document.getElementById("privacy-popup-button")) return;
  
      const button = document.createElement("button");
      button.id = "privacy-popup-button";
      button.textContent = "Summarize Policy";
      Object.assign(button.style, {
        position: "fixed", bottom: "20px", right: "20px",
        zIndex: 10000, padding: "10px 15px", borderRadius: "10px",
        background: "#6200ea", color: "#fff", border: "none", cursor: "pointer",
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
      });
  
      button.onclick = () => {
        const pageText = document.body.innerText;
        chrome.runtime.sendMessage({ action: "summarizePolicy", text: pageText });
      };
  
      document.body.appendChild(button);
    }
  }
  
  injectButtonIfNeeded();
  