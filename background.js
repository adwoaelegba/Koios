chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "summarizePage") {
    fetch("https://refinesummary-production.up.railway.app/refined", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ summaries: { "Policy": message.text } })
    })
    .then(response => response.json())
    .then(data => {
      chrome.tabs.sendMessage(sender.tab.id, {
        action: "showSummaries",
        summaries: data["refined summary"],
        colors: generateColorMap(data["refined summary"])
      });
    })
    .catch(error => {
      console.error("API Error:", error);
    });

    return true; // Required for async response
  }
});

function generateColorMap(summaries) {
  const colors = ["#FFD700", "#FF69B4", "#87CEFA", "#90EE90", "#FFA07A"];
  let colorMap = {};
  Object.keys(summaries).forEach((heading, index) => {
    colorMap[heading] = colors[index % colors.length];
  });
  return colorMap;
}