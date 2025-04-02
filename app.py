from fastapi import FastAPI
from pydantic import BaseModel
import torch
from transformers import PegasusForConditionalGeneration, PegasusTokenizer
import nltk
from nltk.tokenize import sent_tokenize
from sentence_transformers import SentenceTransformer
from sklearn.feature_extraction.text import TfidfVectorizer
import numpy as np
import openai

# Initialize FastAPI
app = FastAPI()

# Load models
model_name = "google/pegasus-xsum"
tokenizer = PegasusTokenizer.from_pretrained(model_name)
model = PegasusForConditionalGeneration.from_pretrained(model_name)

sent_model = SentenceTransformer("all-MiniLM-L6-v2")

# Privacy-related keywords and legal phrases
privacy_keywords = {"privacy", "data", "personal", "information", "collection", "third-party", "cookies"}
legal_phrases = {"third-party sharing", "right to be forgotten", "legitimate interest"}

class HTMLInput(BaseModel):
    file_path: str

def preprocess_text(text):
    for phrase in legal_phrases:
        text = text.replace(phrase, phrase.replace(" ", "_"))
    return text

def td_extract_summary(text, boost_factor=2.0):
    text = preprocess_text(text)
    sentences = sent_tokenize(text)
    vectorizer = TfidfVectorizer()
    tdidf_matrix = vectorizer.fit_transform(sentences)
    word_to_tdidf = dict(zip(vectorizer.get_feature_names_out(), np.asarray(tdidf_matrix.mean(axis=0)).flatten()))

    sentence_weights = [sum(word_to_tdidf.get(word, 0) for word in sentence.lower().split()) for sentence in sentences]
    sentence_embeddings = sent_model.encode(sentences, convert_to_tensor=True)
    doc_embedding = torch.mean(sentence_embeddings, dim=0)
    similarities = torch.nn.functional.cosine_similarity(sentence_embeddings, doc_embedding.unsqueeze(0))
    top_indices = torch.topk(similarities, min(len(sentences), 5)).indices.cpu().numpy()
    top_sentences = [sentences[i] for i in sorted(top_indices)]

    return " ".join(top_sentences)

def sum_text(input_text):
    inputs = tokenizer(input_text, return_tensors="pt", truncation=True, max_length=1024)
    summary_ids = model.generate(**inputs, max_length=150, min_length=50, num_beams=3)
    return tokenizer.decode(summary_ids[0], skip_special_tokens=True)

def refined_text(text):
    client = openai.OpenAI(api_key=openai.api_key)
    response = client.chat.completions.create(
        model="gpt-4-turbo",
        messages=[{"role": "user", "content": f"Rewrite the following privacy policy section using emojis and simple, engaging language:\n\n{text}"}],
        max_tokens=150
    )
    return response.choices[0].message.content

def extraction_function(html):
    with open(html, "r", encoding="utf-8") as file:
        content = file.read()
        soup = BeautifulSoup(content, "html.parser")

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

@app.post("/summarize")
async def summarize(html_input: HTMLInput):
    extracted_summary = extraction_function(html_input.file_path)
    if not extracted_summary:
        return {"error": "No text extracted from the document."}
    
    final_summary = {}
    for heading, text in extracted_summary.items():
        extractive_mod_summary = td_extract_summary(text)
        cleaned_text = extractive_mod_summary.replace("\n", " ").strip()
        abstractive_mod_summary = sum_text(cleaned_text)
        refined_summary = refined_text(abstractive_mod_summary)
        final_summary[heading] = refined_summary
    
    return final_summary
