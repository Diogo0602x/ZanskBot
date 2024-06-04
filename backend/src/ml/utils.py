import re
import PyPDF2
import json

def extract_text_from_pdf(file_path):
    pdf_text = ""
    with open(file_path, 'rb') as file:
        reader = PyPDF2.PdfFileReader(file)
        for page_num in range(reader.numPages):
            page = reader.getPage(page_num)
            pdf_text += page.extract_text()
    return pdf_text

def json_to_text(json_content):
    if isinstance(json_content, dict):
        return ' '.join([f"{key}: {json_to_text(value)}" for key, value in json_content.items()])
    elif isinstance(json_content, list):
        return ' '.join([json_to_text(element) for element in json_content])
    else:
        return str(json_content)

def clean_text(text):
    text = text.strip()
    text = re.sub(r'\s+', ' ', text)  # Replace multiple spaces with a single space
    return text
