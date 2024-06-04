import os
import sys
import json
import warnings
from utils import DocumentLoader, QuestionAnsweringModel

# Suppress warnings
warnings.filterwarnings("ignore", category=UserWarning, module='transformers')

def main():
    try:
        command = sys.argv[1]

        if command == "answer":
            question_text = sys.argv[2]
            folder_path = os.path.join(os.path.dirname(__file__), '../uploads')
            doc_loader = DocumentLoader(folder_path=folder_path)
            documents = doc_loader.load_documents()

            qa_model = QuestionAnsweringModel()
            answer = qa_model.answer_question(question_text, documents)
            print(json.dumps({"answer": answer}))

        elif command == "fine-tune":
            training_data_path = sys.argv[2]
            output_dir = sys.argv[3]
            num_train_epochs = int(sys.argv[4]) if len(sys.argv) > 4 else 3

            qa_model = QuestionAnsweringModel()
            qa_model.fine_tune_model(training_data_path, output_dir, num_train_epochs)

        elif command == "evaluate":
            eval_data_path = sys.argv[2]

            qa_model = QuestionAnsweringModel()
            results = qa_model.evaluate_model(eval_data_path)
            print(json.dumps(results))

    except Exception as e:
        print(json.dumps({"error": str(e)}), file=sys.stderr)

if __name__ == "__main__":
    main()
