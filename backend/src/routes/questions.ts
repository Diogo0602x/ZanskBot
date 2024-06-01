import express from 'express';
import Question from '../models/Question';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

// Endpoint para registrar 10 perguntas
router.post('/register', authMiddleware, async (req, res) => {
  try {
    const { questions } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(400).json({ message: 'Usuário não autenticado' });
    }

    if (!questions || questions.length !== 10) {
      return res.status(400).json({ message: 'Deve enviar exatamente 10 perguntas' });
    }

    const newQuestions = new Question({
      user: userId,
      questions: questions.map((q: { questionNumber: number, questionText: string }) => ({
        questionNumber: q.questionNumber,
        questionText: q.questionText
      })),
    });

    await newQuestions.save();

    res.status(201).json({ message: 'Perguntas registradas com sucesso', newQuestions });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: 'Erro ao registrar perguntas', error: error.message });
    } else {
      res.status(500).json({ message: 'Erro desconhecido ao registrar perguntas' });
    }
  }
});

// Endpoint para buscar perguntas do usuário
router.get('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(400).json({ message: 'Usuário não autenticado' });
    }

    const questions = await Question.find({ user: userId });

    res.status(200).json({ questions });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: 'Erro ao buscar perguntas', error: error.message });
    } else {
      res.status(500).json({ message: 'Erro desconhecido ao buscar perguntas' });
    }
  }
});

// Endpoint para editar perguntas
router.put('/edit/:id', authMiddleware, async (req, res) => {
  try {
    const { questions } = req.body;
    const userId = req.user?.id;
    const questionId = req.params.id;

    if (!userId) {
      return res.status(400).json({ message: 'Usuário não autenticado' });
    }

    if (!questions || questions.length !== 10) {
      return res.status(400).json({ message: 'Deve enviar exatamente 10 perguntas' });
    }

    const updatedQuestions = await Question.findOneAndUpdate(
      { _id: questionId, user: userId },
      { $set: { questions: questions.map((q: { questionNumber: number, questionText: string }) => ({
        questionNumber: q.questionNumber,
        questionText: q.questionText
      })) }},
      { new: true }
    );

    if (!updatedQuestions) {
      return res.status(404).json({ message: 'Perguntas não encontradas' });
    }

    res.status(200).json({ message: 'Perguntas atualizadas com sucesso', updatedQuestions });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: 'Erro ao editar perguntas', error: error.message });
    } else {
      res.status(500).json({ message: 'Erro desconhecido ao editar perguntas' });
    }
  }
});

export default router;
