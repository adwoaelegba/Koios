# Koios
This browser extension allows users to easily summarize privacy policies found on websites. The name of extension is inspired by the Greek god of intellect, Koios (Coeus), whose desire for understanding leads him to see beyond what is obvious. In the same way, with a single click, the extension generates a simplified summary in an interactive manner using a hybrid summarization model API, developed from the combination of TF-IDF for extractive summarization and Pegasus LLM for abstractive summarization.

# Context
This tool was used during the experiment to test whether this tool could improve user's understanding and facilitate informed consent among Internet users.

# Features
1. # One-click summarization
   The user clicks on the Summarize button to process the privacy policy of the web page.

2. # Text extraction
   The extension extracts only the relevant privacy policy sections from the page.

3. # API Summarization
   The extracted text is sent to an API built with hybrid summarization, which provides a simplified summary.

4. # Summary display
   The summary is displayed in a side bar for convenient side-to-side access. Key sections are colour coded and include emojis to enhance visual understanding.
   
# Folders
koios_web_extension code : Contains the frontend (HTML, CSS and JavaScript) code for the web extension
Model API: Contains FastAPI setup for deployment
Summarization model: This contains the final summarization pipeline ( TF-IDF+ MiniLM  for extractive summarization and Pegasus LLM and abstractive summmarization) and all the model combinations tested before settling on the final pipeline.

# Installation Requirements
The tool is in two parts, the API which contains both the extractive and abstractive summarization model, and the web extension code, which contains all the frontend code used in designing the extension.
## To run the API:
* You must first install all the dependencies contained in the requirements.txt file using this code; pip install -r requirements.txt
* Then you must run the main file (app.py)
* To finally test the API locally using Fast API, run the following code; uvicorn app:app --reload
* Optionally, to further test the API, the host link provided by Fast API can be tested using Postman
  
## To run the web extension:
* Download the folder titled 'koios_web extension code'
* Open Chrome and go to: chrome://extensions/
* Enable Developer Mode (top-right corner toggle).
* Click "Load unpacked" (top-left).
* Select your extension's root folder('koios_web extension code'), which contains manifest.json, scripts (e.g., background.js, content.js, etc.), popup files (popup.html, popup.js)
* The extension should now appear in the list and the icon will show up in the Chrome toolbar.
* Visit a page with a privacy policy from the test environment folder (this contains test privacy policy websites where you can test the extension).
  
## To debug (in case):
* Use the console in DevTools to debug
* Right-click the page > Inspect
* Check Console for logs or errors.
* Use the Service Worker section in DevTools (under the extension) for background script logs.

# Additional Code
Test environment- These are privacy policies that have been designed in different formats. The web extension can be tested on these websites that can be locally hosted using XAMPP or using the hosted version (https://testkoios.netlify.app/)
Model combinations- This folder contains all the tested extractive and abstractive combinations.

