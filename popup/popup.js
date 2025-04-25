//Splash screen while model is loading
//chrome.runtime.sendMessage({ action: "summarizePage" });

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

//rotating messages while API is processing the text
const tips =[
  "Thinking like a lawyer (but cooler)...",
  "Doing like important stuff right now",
   "Let's be real, you wouldn't have read this without me",
   "Hang on! I'm almost done",
   "Declined an invitation to Julius Caesar's party to get this done for you"
];

let tipCount=0;
let tipInterval;

function startLoading(){
  document.getElementById("loading-screen").style.display="block";
  document.getElementById("summaryContainer").style.display="none";

  const loadingText=document.getElementById("loading-text");
  tipInterval=setInterval(() => {
    tipCount=(tipCount+1)% tips.length;
    loadingText.textContent=tips[tipCount];
  },5000)
}

function stopLoading(){
  clearInterval(tipInterval);
  document.getElementById("loading-screen").style.display="none";
  document.getElementById("summaryContainer").style.display="block";
}
