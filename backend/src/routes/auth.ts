import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User';

const router = express.Router();
const JWT_SECRET = 'your_secret_key';

// Endpoint para registrar um novo usuário
router.post('/register', async (req, res) => {
  try {
    const { cnpj, companyName, companySocialName, phone, email, companySize, password } = req.body;

    console.log('Recebendo requisição de registro:', req.body);

    // Verificar se o usuário já existe
    const existingUser = await User.findOne({ cnpj });
    if (existingUser) {
      console.log('Usuário já existe com este CNPJ');
      return res.status(400).json({ message: 'Usuário já existe' });
    }

    // Verificar se o e-mail já existe
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      console.log('E-mail já existe');
      return res.status(400).json({ message: 'E-mail já existe' });
    }

    // Criptografar a senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Criar um novo usuário
    const user = new User({
      cnpj,
      companyName,
      companySocialName,
      phone,
      email,
      companySize,
      password: hashedPassword,
    });

    // Salvar o usuário no banco de dados
    await user.save();

    res.status(201).json({ message: 'Usuário registrado com sucesso' });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Erro ao registrar usuário:', error.message);
      res.status(500).json({ message: 'Erro ao registrar usuário', error: error.message });
    } else {
      console.error('Erro desconhecido ao registrar usuário:', error);
      res.status(500).json({ message: 'Erro desconhecido ao registrar usuário' });
    }
  }
});

// Endpoint para autenticar um usuário
router.post('/login', async (req, res) => {
  try {
    const { cnpj, password } = req.body;

    console.log('Recebendo requisição de login:', req.body);

    // Buscar o usuário no banco de dados
    const user = await User.findOne({ cnpj });
    if (!user) {
      return res.status(400).json({ message: 'Usuário não encontrado' });
    }

    // Comparar a senha fornecida com a senha armazenada
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Senha incorreta' });
    }

    // Gerar um token JWT
    const token = jwt.sign({ id: user._id, cnpj: user.cnpj }, JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ message: 'Login bem-sucedido', token });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Erro ao autenticar usuário:', error.message);
      res.status(500).json({ message: 'Erro ao autenticar usuário', error: error.message });
    } else {
      console.error('Erro desconhecido ao autenticar usuário:', error);
      res.status(500).json({ message: 'Erro desconhecido ao autenticar usuário' });
    }
  }
});

export default router;
