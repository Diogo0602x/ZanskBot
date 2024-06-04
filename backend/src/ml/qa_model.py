from transformers import AutoTokenizer, AutoModelForQuestionAnswering, pipeline

class QAModel:
    def __init__(self, model_name="deepset/roberta-base-squad2"):
        self.tokenizer = AutoTokenizer.from_pretrained(model_name)
        self.model = AutoModelForQuestionAnswering.from_pretrained(model_name)
        self.qa_pipeline = pipeline("question-answering", model=self.model, tokenizer=self.tokenizer)

    def answer_question(self, question, context):
        try:
            inputs = {
                'question': question,
                'context': context
            }
            result = self.qa_pipeline(inputs)
            return result['answer'], result['score']
        except Exception as e:
            print(f"Error during QA pipeline execution: {e}", file=sys.stderr)
            return "", 0
