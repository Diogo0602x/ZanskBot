import express from 'express';
import { exec } from 'child_process';
import path from 'path';
import { authMiddleware } from '../middleware/auth';
import Question from '../models/Question';
import { IUserQuestion } from '../types/type';

const router = express.Router();

router.post('/ask', authMiddleware, async (req, res) => {
  try {
    const { questionNumber } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(400).json({ message: 'Usuário não autenticado' });
    }

    if (typeof questionNumber !== 'number' || questionNumber < 1 || questionNumber > 10) {
      return res.status(400).json({ message: 'Número da pergunta inválido' });
    }

    const userQuestions = await Question.findOne({ user: userId }) as IUserQuestion;

    if (!userQuestions) {
      return res.status(404).json({ message: 'Perguntas não encontradas para o usuário' });
    }

    const question = userQuestions.questions.find(q => q.questionNumber === questionNumber);

    if (!question) {
      return res.status(404).json({ message: 'Pergunta não encontrada' });
    }

    const questionText = question.questionText;
    console.log(`Question Text: ${questionText}`);

    const pythonScriptPath = path.join(__dirname, '../ml/ml_model.py');
    const projectRoot = path.join(__dirname, '../../');

    exec(`python ${pythonScriptPath} answer "${questionText}"`, { cwd: projectRoot }, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return res.status(500).json({ message: 'Erro ao executar o modelo de ML', error: error.message });
      }

      console.log(`Python script output: ${stdout}`);
      console.log(`Python script error output: ${stderr}`);

      try {
        const result = JSON.parse(stdout);
        if (result.error) {
          return res.status(400).json({ message: result.error });
        }
        res.status(200).json({ answer: result.answer });
      } catch (parseError) {
        console.error(`JSON parse error: ${parseError}`);
        const errorMessage = parseError instanceof Error ? parseError.message : 'Erro desconhecido';
        return res.status(500).json({ message: 'Erro ao processar a resposta do modelo de ML', error: errorMessage });
      }
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: 'Erro ao processar a pergunta', error: error.message });
    }
  }
});

export default router;
