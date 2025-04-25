
// In background.js, inside chrome.runtime.onMessage.addListener
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  //console.log("Background: Message received:", message);

  if (message.action === "summarizePage") {
    //console.log("Background: Action is summarizePage. Extracting text and URL...");
    const pageText = message.text;
    const pageUrl = message.url; // *** Receive the URL from the message ***

    //console.log("Background: URL being sent to API:", pageUrl);
    //console.log("Background: Text being sent to API (first 500 chars):", pageText ? pageText.substring(0, 500) + "..." : "No text received");
    //console.log("Background: Total text length:", pageText ? pageText.length : 0);


   // console.log("Background: Fetching data from API...");
    fetch("https://refinesummary-production.up.railway.app/refined", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      
      body: JSON.stringify({ url: pageUrl }) // *** Send the URL in the request body ***
      
    })
    .then(response => {
        //console.log("Background: Fetch response received. Status:", response.status, response);
        if (!response.ok) {
            const errorResponseClone = response.clone();
            errorResponseClone.text().then(text => {
                //console.error("Background: HTTP error response body:", text);
            }).catch(e => {
                //console.error("Background: Could not read response body for error details:", e);
            });
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
      //console.log("--- API Response Data (Parsed JSON) ---", data);

      const summaries = data ? data["refined summary"] : null;
      //console.log("--- Extracted summaries (data['refined summary']) ---", summaries);

      if (summaries && typeof summaries === 'object' && Object.keys(summaries).length > 0) {
        //console.log("Background: Summaries are valid. Proceeding to send...");

        //console.log("--- Calling generateColorMap with ---", summaries);
        const colors = generateColorMap(summaries);

        //console.log("Background: Sending showSummaries message to tab:", sender.tab.id);
        chrome.tabs.sendMessage(sender.tab.id, {
          action: "showSummaries",
          summaries: summaries,
          colors: colors
        }).catch(error => {
             //console.error("Background: Error sending showSummaries message back to tab:", error);
        });

      } else {
        console.error("Background: API response did not contain valid 'refined summary' data or was empty:", data);
        chrome.tabs.sendMessage(sender.tab.id, {
            action: "showError",
            message: "Could not get summary data from the service. Response structure invalid."
        }).catch(error => {
             console.error("Background: Error sending invalid data error message back to tab:", error);
        });
      }
    })
    .catch(error => {
      console.error("Background: API Fetch or Processing Error:", error);
       chrome.tabs.sendMessage(sender.tab.id, {
            action: "showError",
            message: `Error communicating with summary service: ${error.message || "Unknown error"}`
       }).catch(error => {
            console.error("Background: Error sending fetch error message back to tab:", error);
       });
    });

    return true;
  }
});

// generateColorMap function is unchanged and correct for processing the *expected* successful API response
function generateColorMap(summaries) {
  console.log("--- Inside generateColorMap. Summaries argument:", summaries);
  const colors = ["#FFD700", "#FF69B4", "#87CEFA", "#90EE90", "#FFA07A"];
  let colorMap = {};
  if (summaries && typeof summaries === 'object') {
      console.log("generateColorMap: summaries is valid object, processing keys.");
      Object.keys(summaries).forEach((heading, index) => {
          colorMap[heading] = colors[index % colors.length];
      });
  } else {
      console.warn("generateColorMap called with invalid summaries data:", summaries);
  }
  return colorMap;
}