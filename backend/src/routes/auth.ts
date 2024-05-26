import express from 'express';
import User from '../models/User';

const router = express.Router();

// Register route
router.post('/register', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Login route
router.post('/login', async (req, res) => {
  // Implement login logic here
});

export default router;
