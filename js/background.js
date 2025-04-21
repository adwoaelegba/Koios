let summaryData = [];

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "summarizePolicy") {
    fetch("https://your-api-endpoint.com/summarize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: message.text })
    })
    .then(res => res.json())
    .then(data => {
      summaryData = data.sections; // expecting: [{ title: '', summary: '' }, ...]
    })
    .catch(err => console.error("API Error:", err));
  }

  if (message.action === "getSummaries") {
    sendResponse({ summaries: summaryData });
  }

  return true; // keep the message channel open for async sendResponse
});
