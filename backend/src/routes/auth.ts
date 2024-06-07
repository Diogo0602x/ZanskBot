import express from 'express';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User';
import nodemailer from 'nodemailer';

const router = express.Router();
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || 'default_secret_key';

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

// Endpoint to request a password reset
router.post('/forgot-password', async (req, res) => {
  try {
    const { cnpj, email } = req.body;

    // Find user by CNPJ and email
    const user = await User.findOne({ cnpj, email });
    if (!user) {
      return res.status(409).json({ message: 'E-mail e cnpj não coincidem com nenhum usuário cadastrado' });
    }

    // Generate reset token
    const token = crypto.randomBytes(20).toString('hex');

    // Set token and expiration on user
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

    // Save the updated user
    await user.save();

    // Respond with success message and token
    res.status(200).json({ message: 'Usuário encontrado, redirecionando para redefinição de senha', token });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Erro ao solicitar recuperação de senha:', error.message);
      res.status(500).json({ message: 'Erro ao solicitar recuperação de senha', error: error.message });
    } else {
      console.error('Erro desconhecido ao solicitar recuperação de senha:', error);
      res.status(500).json({ message: 'Erro desconhecido ao solicitar recuperação de senha' });
    }
  }
});

// Endpoint to reset the password
router.post('/reset-password/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    // Find user by reset token and check if token is expired
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Password reset token is invalid or has expired' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Set the new password and clear the reset token and expiration
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    // Save the updated user
    await user.save();

    res.status(200).json({ message: 'Password has been reset successfully' });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error on password reset:', error.message);
      res.status(500).json({ message: 'Error on password reset', error: error.message });
    } else {
      console.error('Unknown error on password reset:', error);
      res.status(500).json({ message: 'Unknown error on password reset' });
    }
  }
});

export default router;