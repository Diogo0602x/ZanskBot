import os
import json
import sys
from utils import extract_text_from_pdf, json_to_text, clean_text

class DocumentProcessor:
    def __init__(self, folder_path, tokenizer, max_seq_len=512, overlap=50):
        self.folder_path = folder_path
        self.tokenizer = tokenizer
        self.max_seq_len = max_seq_len
        self.overlap = overlap
        self.documents = self._load_documents()

    def _load_documents(self):
        documents = []
        for filename in os.listdir(self.folder_path):
            file_path = os.path.join(self.folder_path, filename)
            if filename.endswith(".txt"):
                with open(file_path, 'r', encoding='utf-8') as file:
                    documents.append(file.read())
            elif filename.endswith(".pdf"):
                documents.append(extract_text_from_pdf(file_path))
            elif filename.endswith(".json"):
                with open(file_path, 'r', encoding='utf-8') as file:
                    try:
                        json_content = json.load(file)
                        documents.append(json_to_text(json_content))
                    except json.JSONDecodeError as e:
                        print(f"Error loading JSON from {file_path}: {e}", file=sys.stderr)
        return documents

    def _chunk_text(self, text):
        tokens = self.tokenizer.tokenize(text)
        chunks = []
        for i in range(0, len(tokens), self.max_seq_len - self.overlap):
            chunk = tokens[i:i + self.max_seq_len]
            chunks.append(self.tokenizer.convert_tokens_to_string(chunk))
        return chunks

    def process_documents(self):
        processed_docs = []
        for doc_content in self.documents:
            cleaned_content = clean_text(doc_content)
            chunks = self._chunk_text(cleaned_content)
            processed_docs.extend(chunks)
        return processed_docs
