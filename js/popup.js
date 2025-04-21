chrome.runtime.sendMessage({ action: "getSummaries" }, (response) => {
    const container = document.getElementById("summaryContainer");
    container.innerHTML = ""; // clear loading text
  
    const colors = ["blue", "green", "orange", "red"];
    response.summaries.forEach((section, index) => {
      const card = document.createElement("div");
      card.className = `card ${colors[index % colors.length]}`;
      card.innerHTML = `<strong>${section.title}:</strong><br>${section.summary}`;
      container.appendChild(card);
    });
  });
  