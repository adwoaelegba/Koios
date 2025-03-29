 
from flask import Flask, jsonify, request
import torch
import nltk
from nltk.tokenize import sent_tokenize
from sentence_transformers import SentenceTransformer
from sklearn.feature_extraction.text import TfidfVectorizer
import numpy as np
from transformers import PegasusForConditionalGeneration, PegasusTokenizer
import openai
import requests
from bs4 import BeautifulSoup

openai.api_key = "sk-proj-..."  # Replace with environment variable in production

app = Flask(__name__)

# Load models
model_name = "google/pegasus-large"
ptokenizer = PegasusTokenizer.from_pretrained(model_name)
pmodel = PegasusForConditionalGeneration.from_pretrained(model_name)

nltk.download('stopwords')
nltk.download('punkt')

sent_model = SentenceTransformer("all-MiniLM-L6-v2")

# Key privacy terms to prioritize
privacy_keywords = {
    "privacy", "data", "personal", "information", "collection", "third-party",
    "cookies", "retention", "sharing", "consent", "security", "policy", "tracking",
    "advertising", "partners", "compliance", "regulation", "opt-out"
}
stopwords = list(set(nltk.corpus.stopwords.words("english")).union({"shall", "hereby", "thereof", "whereas"}) - set("to be".split()))

def preprocess_text(text):
    return text.replace(" ", "_")

def extraction_function(url):
    #Extracts sections from an HTML page (either from a file or URL).
    if url.startswith("http"):
        response = requests.get(url)
        html_content = response.text
    else:
        with open(url, "r", encoding="utf-8") as file:
            html_content = file.read()
    
    soup = BeautifulSoup(html_content, "html.parser")
    sections = {}
    current_heading = None
    current_text = []

    for elem in soup.find_all(["h1", "h2", "h3", "p"]):
        if elem.name in ["h1", "h2", "h3"]:
            if current_heading:
                sections[current_heading] = " ".join(current_text).strip()
            current_heading = elem.get_text().strip()
            current_text = []
        else:
            current_text.append(elem.get_text().strip())

    if current_heading and current_text:
        sections[current_heading] = " ".join(current_text).strip()

    return sections

def td_extract_summary(text, boost_factor=2.0):
    text = preprocess_text(text)
    sentences = sent_tokenize(text)
    total_sentences = len(sentences)

    if total_sentences < 5:
        return text
    num_sentences = max(5, int(total_sentences * 0.4))

    vectorizer = TfidfVectorizer(stop_words=stopwords)
    tdidf_matrix = vectorizer.fit_transform(sentences)
    tdidf_scores = np.asarray(tdidf_matrix.mean(axis=0)).flatten()
    word_to_tdidf = dict(zip(vectorizer.get_feature_names_out(), tdidf_scores))

    sentence_weights = []
    for sentence in sentences:
        words = sentence.lower().split()
        weight = sum(word_to_tdidf.get(word, 0) for word in words)
        if any(word in privacy_keywords for word in words):
            weight *= boost_factor
        sentence_weights.append(weight)

    sentence_weights = np.array(sentence_weights)
    sentence_embeddings = sent_model.encode(sentences, convert_to_tensor=True)
    doc_embedding = torch.mean(sentence_embeddings, dim=0)

    similarities = torch.nn.functional.cosine_similarity(sentence_embeddings, doc_embedding.unsqueeze(0))
    sentence_weights_tensor = torch.tensor(sentence_weights, dtype=torch.float32, device=similarities.device)
    similarities = similarities * sentence_weights_tensor

    top_indices = torch.topk(similarities, num_sentences).indices.cpu().numpy()
    top_sentences = [sentences[i].replace("_", " ") for i in sorted(top_indices)]

    return " ".join(top_sentences)

def sum_text(input_text):
    if not input_text.strip():
        return "No summary available."

    inputs = ptokenizer(input_text, truncation=True, max_length=1024, return_tensors="pt")
    summary_ids = pmodel.generate(**inputs, max_length=150, min_length=50, num_beams=3, length_penalty=1.5, 
                                  repetition_penalty=2.0, no_repeat_ngram_size=3, temperature=0.9, 
                                  top_k=50, top_p=0.85, do_sample=True)

    return ptokenizer.decode(summary_ids[0], skip_special_tokens=True)

def refined_text(text):
    api_key = os.getenv("API_KEY")  # Get API key from environment variables

    if not api_key:
       raise ValueError("Error: API_KEY is not set. Please configure it as an environment variable.")
    client = openai.OpenAI(api_key=api_key)
    response = client.chat.completions.create(
        model="gpt-4-turbo",
        messages=[{"role": "user", "content": f"Rewrite this privacy policy section using emojis and simple language:{text}"}],
        max_tokens=150
    )
    return response.choices[0].message.content

def process_summary(url):
    extracted_summary = extraction_function(url)
    if not extracted_summary:
        return None
    
    final_summary = {}
    for heading, text in extracted_summary.items():
        extractive_mod_summary = td_extract_summary(text)
        if not isinstance(extractive_mod_summary, str):
            continue

        abstractive_mod_summary = sum_text(extractive_mod_summary.strip())
        refined_summary = refined_text(abstractive_mod_summary)
        final_summary[heading] = refined_summary
    
    return final_summary

@app.route('/koios', methods=['POST'])
def koios_summarize():
    data = request.json
    url = data.get("url")
    if not url:
        return jsonify({"error": "No URL provided"}), 400
    
    summary = process_summary(url)
    return jsonify(summary)

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000,debug=True)
