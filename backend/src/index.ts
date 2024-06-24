import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import authRoutes from './routes/auth';
import documentRoutes from './routes/documents';
import questionsRoutes from './routes/questions';
import chatbotRoutes from './routes/chatbot';
import apiRoutes from './routes/api';
import { authMiddleware } from './middleware/auth';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/documents', authMiddleware, documentRoutes);
app.use('/api/questions', authMiddleware, questionsRoutes);
app.use('/api/chatbot', authMiddleware, chatbotRoutes);
app.use('/api', authMiddleware, apiRoutes);

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/zanskbot')
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(error => {
    console.error('Error connecting to MongoDB', error);
  });