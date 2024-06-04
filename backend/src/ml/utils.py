import os
import json
import re
import PyPDF2
from transformers import AutoTokenizer, AutoModelForQuestionAnswering, pipeline

class DocumentLoader:
    def __init__(self, folder_path):
        self.folder_path = folder_path

    def load_documents(self):
        documents = []
        for filename in os.listdir(self.folder_path):
            file_path = os.path.join(self.folder_path, filename)
            if filename.endswith(".txt"):
                with open(file_path, 'r', encoding='utf-8') as file:
                    documents.append(file.read())
            elif filename.endswith(".pdf"):
                documents.append(self._extract_text_from_pdf(file_path))
            elif filename.endswith(".json"):
                with open(file_path, 'r', encoding='utf-8') as file:
                    try:
                        json_content = json.load(file)
                        documents.append(self._json_to_text(json_content))
                    except json.JSONDecodeError as e:
                        print(f"Error loading JSON from {file_path}: {e}")
        return documents

    def _extract_text_from_pdf(self, file_path):
        pdf_text = ""
        with open(file_path, 'rb') as file:
            reader = PyPDF2.PdfFileReader(file)
            for page_num in range(reader.numPages):
                page = reader.getPage(page_num)
                pdf_text += page.extract_text()
        return pdf_text

    def _json_to_text(self, json_content):
        if isinstance(json_content, dict):
            return ' '.join([f"{key}: {self._json_to_text(value)}" for key, value in json_content.items()])
        elif isinstance(json_content, list):
            return ' '.join([self._json_to_text(element) for element in json_content])
        else:
            return str(json_content)

    def clean_text(self, text):
        text = text.strip()
        text = re.sub(r'\s+', ' ', text)
        return text

class QuestionAnsweringModel:
    def __init__(self):
        self.tokenizer = AutoTokenizer.from_pretrained("deepset/roberta-base-squad2")
        self.model = AutoModelForQuestionAnswering.from_pretrained("deepset/roberta-base-squad2")
        self.qa_pipeline = pipeline("question-answering", model=self.model, tokenizer=self.tokenizer)
        self.max_seq_len = 512

    def chunk_text(self, text, chunk_size=512, overlap=50):
        tokens = self.tokenizer.tokenize(text)
        chunks = []
        for i in range(0, len(tokens), chunk_size - overlap):
            chunk = tokens[i:i + chunk_size]
            chunks.append(self.tokenizer.convert_tokens_to_string(chunk))
        return chunks

    def answer_question(self, question, documents):
        best_answer = ""
        best_score = float('-inf')

        for doc_content in documents:
            doc_loader = DocumentLoader(folder_path=None)  # No folder_path needed for this instance
            cleaned_content = doc_loader.clean_text(doc_content)
            chunks = self.chunk_text(cleaned_content, chunk_size=self.max_seq_len - 2)

            for chunk in chunks:
                inputs = {
                    'question': question,
                    'context': chunk
                }
                result = self.qa_pipeline(inputs)

                if result['score'] > best_score:
                    best_score = result['score']
                    best_answer = result['answer']

        if not best_answer or best_answer.strip() == "":
            best_answer = "I'm sorry, I couldn't find a relevant answer in the documents."

        return best_answer

    def fine_tune_model(self, training_data_path, output_dir, num_train_epochs=3):
        from transformers import TrainingArguments, Trainer, DefaultDataCollator
        from datasets import load_dataset

        dataset = load_dataset('json', data_files=training_data_path)

        training_args = TrainingArguments(
            output_dir=output_dir,
            per_device_train_batch_size=16,
            per_device_eval_batch_size=16,
            num_train_epochs=num_train_epochs,
            weight_decay=0.01,
            logging_dir='./logs',
            logging_steps=10,
            evaluation_strategy="epoch"
        )

        data_collator = DefaultDataCollator(return_tensors="pt")

        trainer = Trainer(
            model=self.model,
            args=training_args,
            train_dataset=dataset['train'],
            eval_dataset=dataset['test'],
            tokenizer=self.tokenizer,
            data_collator=data_collator
        )

        trainer.train()
        self.model.save_pretrained(output_dir)
        self.tokenizer.save_pretrained(output_dir)

    def evaluate_model(self, eval_data_path):
        from datasets import load_metric

        metric = load_metric('squad')
        dataset = load_dataset('json', data_files=eval_data_path)
        eval_results = []

        for item in dataset['test']:
            question = item['question']
            context = item['context']
            answer = item['answers']['text'][0]

            inputs = {
                'question': question,
                'context': context
            }
            result = self.qa_pipeline(inputs)
            pred_answer = result['answer']

            eval_results.append({
                'prediction': pred_answer,
                'reference': answer
            })

        return metric.compute(predictions=[res['prediction'] for res in eval_results],
                              references=[res['reference'] for res in eval_results])
