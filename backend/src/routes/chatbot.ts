import express, { Request, Response } from 'express';
import { readDocuments, processDocuments, trainModel } from '../services/machineLearning';
import Question from '../models/Question';
import { authMiddleware } from '../middleware/auth';
import { AuthRequest } from '../types/type';

const router = express.Router();

// Endpoint para responder perguntas
router.post('/ask', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { questionText } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(400).json({ message: 'Usuário não autenticado' });
    }

    // Ler e processar documentos
    const documents = readDocuments();
    const processedDocuments = processDocuments(documents);

    // Buscar perguntas do usuário para treinar o modelo
    const userQuestions = await Question.find({ user: userId });

    if (userQuestions.length === 0) {
      return res.status(400).json({ message: 'Nenhuma pergunta encontrada para o usuário' });
    }

    const questions = userQuestions[0].questions.map(q => q.questionText);
    const classifier = trainModel(processedDocuments, questions);

    // Obter a melhor resposta para a pergunta
    const answer = classifier.classify(questionText);

    res.status(200).json({ answer });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: 'Erro ao processar pergunta', error: error.message });
    } else {
      res.status(500).json({ message: 'Erro desconhecido ao processar pergunta' });
    }
  }
});

export default router;
