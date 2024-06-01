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

// Função para obter a melhor resposta com base na classificação
export const getBestAnswer = (
  classifier: natural.BayesClassifier,
  question: string,
  processedDocuments: string[][],
  originalDocuments: string[]
): string => {
  // Classificar a pergunta
  const label = classifier.classify(question);

  // Encontrar o documento correspondente à etiqueta classificada
  const docIndex = processedDocuments.findIndex(doc => doc.join(' ') === label);

  // Retornar o documento original como resposta
  if (docIndex !== -1) {
    return originalDocuments[docIndex];
  } else {
    return 'Desculpe, não consegui encontrar uma resposta adequada nos documentos.';
  }
};
