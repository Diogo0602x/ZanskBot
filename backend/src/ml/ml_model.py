import os
import json
import sys
import warnings
from qa_model import QAModel
from document_processor import DocumentProcessor

# Suppress warnings
warnings.filterwarnings("ignore", category=UserWarning, module='transformers')

class DocumentReader:
    def __init__(self, folder_path):
        self.folder_path = folder_path
        self.qa_model = QAModel()
        self.doc_processor = DocumentProcessor(folder_path=self.folder_path, tokenizer=self.qa_model.tokenizer)
        self.processed_docs = self.doc_processor.process_documents()

    def answer_question(self, question):
        best_answer = ""
        best_score = float('-inf')

        for chunk in self.processed_docs:
            try:
                answer, score = self.qa_model.answer_question(question, chunk)
                if score > best_score:
                    best_score = score
                    best_answer = answer
            except Exception as e:
                print(f"Error in QA pipeline: {e}", file=sys.stderr)

        if not best_answer or best_answer.strip() == "":
            best_answer = "I'm sorry, I couldn't find a relevant answer in the documents."

        return best_answer

if __name__ == "__main__":
    try:
        command = sys.argv[1]

        if command == "answer":
            question_text = sys.argv[2]
            folder_path = os.path.join(os.path.dirname(__file__), '../uploads')
            doc_reader = DocumentReader(folder_path=folder_path)
            answer = doc_reader.answer_question(question_text)
            print(json.dumps({"answer": answer}))

    except Exception as e:
        print(json.dumps({"error": str(e)}), file=sys.stderr)
