import fs from 'fs';
import path from 'path';
import natural from 'natural';

// Função para ler todos os documentos na pasta de uploads
export const readDocuments = (): string[] => {
  const documentsPath = path.join(__dirname, '..', 'uploads');
  const files = fs.readdirSync(documentsPath);
  
  return files.map(file => {
    const filePath = path.join(documentsPath, file);
    return fs.readFileSync(filePath, 'utf8');
  });
};

// Função para processar o conteúdo dos documentos
export const processDocuments = (documents: string[]): string[][] => {
  const tokenizer = new natural.WordTokenizer();
  return documents.map(doc => tokenizer.tokenize(doc.toLowerCase()));
};

// Função para treinar o modelo com as perguntas e documentos processados
export const trainModel = (processedDocuments: string[][], questions: string[]): natural.BayesClassifier => {
  const classifier = new natural.BayesClassifier();

  processedDocuments.forEach((doc, index) => {
    const question = questions[index];
    classifier.addDocument(doc.join(' '), question);
  });

  classifier.train();
  return classifier;
};
