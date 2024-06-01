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
    cb(null, 'uploads/');
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
    res.status(500).json({ message: 'Erro ao enviar documento', error });
  }
});

router.get('/download/:id', authMiddleware, async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({ message: 'Documento não encontrado' });
    }

    res.download(path.join(__dirname, '..', 'uploads', document.filename), document.originalName);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao fazer download do documento', error });
  }
});

export default router;
