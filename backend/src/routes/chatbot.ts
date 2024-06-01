import express, { Request, Response } from 'express';
import { readDocuments, processDocuments, trainModel, getBestAnswer } from '../services/machineLearning';
import Question from '../models/Question';
import { authMiddleware } from '../middleware/auth';
import { AuthRequest } from '../types/type';

const router = express.Router();

// Endpoint para responder perguntas
router.post('/ask', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { questionNumber } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(400).json({ message: 'Usuário não autenticado' });
    }

    // Ler e processar documentos
    const documents = readDocuments();
    const processedDocuments = processDocuments(documents);

    // Buscar perguntas do usuário para treinar o modelo
    const userQuestions = await Question.findOne({ user: userId });

    if (!userQuestions) {
      return res.status(400).json({ message: 'Nenhuma pergunta encontrada para o usuário' });
    }

    const questions = userQuestions.questions;

    if (questionNumber < 1 || questionNumber > questions.length) {
      return res.status(400).json({ message: 'Número da pergunta inválido' });
    }

    const selectedQuestion = questions.find(q => q.questionNumber === questionNumber)?.questionText || '';

    // Treinar o modelo
    const classifier = trainModel(processedDocuments, questions.map(q => q.questionText));

    // Obter a melhor resposta para a pergunta
    const answer = getBestAnswer(classifier, selectedQuestion, processedDocuments, documents);

    res.status(200).json({ answer });
  } catch (error) {
    console.error('Erro ao processar pergunta:', error);
    if (error instanceof Error) {
      res.status(500).json({ message: 'Erro ao processar pergunta', error: error.message });
    } else {
      res.status(500).json({ message: 'Erro desconhecido ao processar pergunta' });
    }
  }
});

export default router;
