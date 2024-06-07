import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User';
import nodemailer from 'nodemailer';

const router = express.Router();
const JWT_SECRET = 'your_secret_key';
const EMAIL_SERVICE = 'your_email_service';
const EMAIL_USER = 'your_email_user';
const EMAIL_PASS = 'your_email_password';

const transporter = nodemailer.createTransport({
  service: EMAIL_SERVICE,
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});


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
    const { email } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Email not found' });
    }

    // Generate reset token
    const token = crypto.randomBytes(20).toString('hex');

    // Set token and expiration on user
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

    // Save the updated user
    await user.save();

    // Send email with reset link
    const mailOptions = {
      to: user.email,
      from: EMAIL_USER,
      subject: 'Password Reset',
      text: `You are receiving this because you (or someone else) have requested to reset your password. 
        Please click on the following link, or paste it into your browser to complete the process:
        http://${req.headers.host}/reset-password/${token}
        If you did not request this, please ignore this email and your password will remain unchanged.`
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Password reset email sent' });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error on password reset request:', error.message);
      res.status(500).json({ message: 'Error on password reset request', error: error.message });
    } else {
      console.error('Unknown error on password reset request:', error);
      res.status(500).json({ message: 'Unknown error on password reset request' });
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