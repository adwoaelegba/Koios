function addButtonOnPrivacy(){
    const pageBody=document.body.innerText.toLowerCase();
    if(pageBody.includes("privacy policy")){
        if (document.getElementById("privacy_button")) return;

        const button= document.createElement("button");
        button.id="privacy_button";
        button.style.position="fixed";
        button.textContent=" View Summary";
        button.style.bottom = "20px";
        button.style.right = "20px";
        button.style.zIndex = 10000;
        button.style.padding = "10px 15px";
        button.style.borderRadius = "10px";
        button.style.background = "#6200ea";
        button.style.color = "#fff";
        button.style.border = "none";
        button.style.cursor = "pointer";
        button.style.boxShadow = "0 4px 6px rgba(0,0,0,0.1)";

        button.onclick = () => {
            chrome.runtime.sendMessage({ action: "openPopup" });
          };
      
          document.body.appendChild(button);
    
    
    
    }
}