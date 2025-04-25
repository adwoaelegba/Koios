console.log("Content script loaded");

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
  

button.onclick = (e) => {
  e.preventDefault();
  const pageText = document.body.innerText;
  const pageUrl = window.location.href; // Get the current page URL
  //console.log("Content script: Button clicked, sending message with text and URL"); // Add log
  chrome.runtime.sendMessage({
    action: "summarizePage",
    text: pageText, 
    url: pageUrl // *** Include the URL in the message ***
  });
};
  
      document.body.appendChild(button);
    }
  }
  
  injectButtonIfNeeded();

  console.log("Content script loaded");

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("Message received in content script:", message); // ✅
    if (message.action === "showSummaries") {
      const container = document.createElement("div");
      container.id = "summaryContainer";
      Object.assign(container.style, {
        position: "fixed", top: "20px", right: "20px", width: "300px", 
        background: "#fff", zIndex: 10001, padding: "15px", 
        borderRadius: "10px", boxShadow: "0 0 10px rgba(0,0,0,0.1)"
      });
  
      Object.entries(message.summaries).forEach(([heading, summary]) => {
        const card = document.createElement("div");
        card.style.backgroundColor = message.colors[heading] || "#eee";
        card.style.padding = "10px";
        card.style.marginBottom = "10px";
        card.style.borderRadius = "8px";
        card.innerHTML = `<strong>${heading}</strong><p>${summary}</p>`;
        container.appendChild(card);
      });
  
      document.body.appendChild(container);
    }
  });
  

  
//Highlighting sections of the the privacy agreement in different colours
const highlightSections = (summaries) => {
  const colors = ["#FFD700", "#FF69B4", "#87CEFA", "#90EE90", "#FFA07A"];
  let colorMap = {};

  Object.keys(summaries).forEach((heading, index) => {
      let headerElems = [...document.querySelectorAll("h1, h2, h3")];
      let match = headerElems.find(el => el.textContent.trim().includes(heading));
      if (match) {
          const color = colors[index % colors.length];
          match.style.backgroundColor = color;
          colorMap[heading] = color;
      }
  });

  return colorMap;
};


//send to the popup ui
//chrome.runtime.sendMessage({
  //action: "showSummaries",
  //summaries: data["refined summary"],
  //colors: colorMap
//});

//Hnadling response from button click
