/* 
Author: Nana Adwoa Ayiw Elegba
Date: 26/04/2025
Description:  This page handles every injected html on the web page like the button that starts off the process of summarizing and the popup that displays the summaries 
*/

console.log("✅ Content script loaded");

// === Function for injecting the summarize policy button once it detects the words 'Privacy Policy' ===
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

    button.addEventListener("click", () => {
      button.style.transform = "translateY(-5px)";
      button.style.transition = "transform 0.2s ease";

      setTimeout(() => {
        button.style.transform = "translateY(0)";
      }, 200);
    });

    button.onclick = (e) => {
      e.preventDefault();
      const pageText = document.body.innerText;
      const pageUrl = window.location.href;

      // Create popup container with loading screen
      createLoadingPopup();

      // Send page text + URL to background
      chrome.runtime.sendMessage({
        action: "summarizePage",
        text: pageText,
        url: pageUrl
      });
    };

    document.body.appendChild(button);
  }
}

injectButtonIfNeeded();

// ===Creating the popup that will contain the loading screen and the summaries once they're ready===
let loadingInterval;

function createLoadingPopup() {
  if (document.getElementById("summaryContainer")) return; // To prevent multiple popups

  const container = document.createElement("div");
  container.id = "summaryContainer";
  Object.assign(container.style, {
    position: "fixed", top: "20px", right: "20px", width: "320px", height: "400px",
    background: "#fff", zIndex: 10001, padding: "20px", 
    borderRadius: "12px", boxShadow: "0 0 12px rgba(0,0,0,0.2)",
    overflowY: "auto", boxSizing: "border-box",
    textAlign: "center"
  });

  // Adding Koios head image and an initial loading text
  const loadingImageUrl = chrome.runtime.getURL('/images/koiosguide.png');
  container.innerHTML = `
    <div style="padding:20px;">
      <img src="${loadingImageUrl}" class="pulse-image" style="width:150px;"/>
      <p id="loading-message" style="margin-top:15px; font-size:16px;">Loading your summary...</p>
    </div>
  `;

  document.body.appendChild(container);

  // Rotating loading messages 
  const loadingMessages = [
    "Thinking like a lawyer (but cooler)...",
    "Doing like important stuff right now",
     "Let's be real, you wouldn't have read this without me",
     "Hang on! I'm almost done",
     "Declined an invitation to Julius Caesar's party to get this done for you"
  ];

  let messageIndex = 0;
  loadingInterval = setInterval(() => {
    const loadingTextElement = document.getElementById("loading-message");
    if (loadingTextElement) {
      loadingTextElement.innerText = loadingMessages[messageIndex];
      messageIndex = (messageIndex + 1) % loadingMessages.length;
    }
  }, 2000);
}

// === Display the summaries once they are done ===
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "showSummaries") {
    console.log("✅ Summaries received!");

    clearInterval(loadingInterval);
    const container = document.getElementById("summaryContainer");
    container.innerHTML = ""; // Clear loading content

    Object.entries(message.summaries).forEach(([heading, summary]) => {
      const card = document.createElement("div");
      Object.assign(card.style, {
        backgroundColor: message.colors[heading] || "#f9f9f9",
        padding: "15px",
        marginBottom: "12px",
        borderRadius: "10px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
      });
      card.innerHTML = `
        <strong style="font-size:16px;">${heading}</strong>
        <p style="margin-top:8px;">${summary}</p>
      `;
      container.appendChild(card);
    });
  }
});
