//Splash screen while model is loading
chrome.runtime.sendMessage({ action: "summarizePage" });

startLoading(); // Start splash while fetching

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "showSummaries") {
    stopLoading(); // Stop splash once summaries arrive
    const container = document.getElementById("summaryContainer");
    container.innerHTML = "";

    Object.entries(message.summaries).forEach(([heading, summary]) => {
      const colour = message.colors[heading] || "#eee";

      const card = document.createElement("div");
      card.style.backgroundColor = colour;
      card.style.padding = "10px";
      card.style.margin = "10px 0";
      card.style.borderRadius = "10px";
      card.style.boxShadow = "0 0 10px rgba(0,0,0,0.1)";
      card.innerHTML = `
        <strong>${heading}</strong>
        <p>${summary}</p>
      `;
      container.appendChild(card);
    });
  }
});
