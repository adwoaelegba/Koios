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
        chrome.runtime.sendMessage({ action: "summarizePage", text: pageText });
      };
  
      document.body.appendChild(button);
    }
  }
  
  injectButtonIfNeeded();
  
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
chrome.runtime.sendMessage({
  action: "showSummaries",
  summaries: data["refined summary"],
  colors: colorMap
});
