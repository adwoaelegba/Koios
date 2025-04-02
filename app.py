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

class TextInput(BaseModel):
    text: str

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

@app.post("/summarize")
async def summarize(text_input: TextInput):
    extractive_summary = td_extract_summary(text_input.text)
    abstractive_summary = sum_text(extractive_summary)
    refined_summary = refined_text(abstractive_summary)
    return {"summary": refined_summary}
