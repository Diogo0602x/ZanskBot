import express from 'express';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

router.post('/generate-api', authMiddleware, (req, res) => {
  const apiKey = '12345-abcde-67890-fghij';
  res.status(200).json({ apiKey });
});

export default router;