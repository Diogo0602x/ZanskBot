import express from 'express';
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import Document from '../models/Document';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

// Configuração do Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '..', 'uploads');
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, uuidv4() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

router.post('/upload', authMiddleware, upload.single('document'), async (req, res) => {
  try {
    const { file } = req;
    const userId = req.user?.id;

    if (!file) {
      return res.status(400).json({ message: 'Nenhum arquivo enviado' });
    }

    if (!userId) {
      return res.status(400).json({ message: 'Usuário não autenticado' });
    }

    const document = new Document({
      user: userId,
      filename: file.filename,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size
    });

    await document.save();

    res.status(201).json({ message: 'Documento enviado com sucesso', document });
  } catch (error) {
    if (error instanceof Error) {
      console.error('Erro ao enviar documento:', error.message);
      res.status(500).json({ message: 'Erro ao enviar documento', error: error.message });
    } else {
      res.status(500).json({ message: 'Erro desconhecido ao enviar documento' });
    }
  }
});

router.get('/', authMiddleware, async (req, res) => {
  try {
    const documents = await Document.find({ user: req.user?.id });
    res.status(200).json({ documents });
  } catch (error) {
    if (error instanceof Error) {
      console.error('Erro ao buscar documentos:', error.message);
      res.status(500).json({ message: 'Erro ao buscar documentos', error: error.message });
    } else {
      console.error('Erro desconhecido ao buscar documentos:', error);
      res.status(500).json({ message: 'Erro desconhecido ao buscar documentos' });
    }
  }
});

router.get('/download/:id', authMiddleware, async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({ message: 'Documento não encontrado' });
    }

    const filePath = path.join(__dirname, '..', 'uploads', document.filename);
    res.download(filePath, document.originalName);
  } catch (error) {
    if (error instanceof Error) {
      console.error('Erro ao fazer download do documento:', error.message);
      res.status(500).json({ message: 'Erro ao fazer download do documento', error: error.message });
    } else {
      res.status(500).json({ message: 'Erro desconhecido ao fazer download do documento' });
    }
  }
});

export default router;
