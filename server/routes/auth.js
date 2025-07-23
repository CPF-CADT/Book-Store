import express from 'express';
import bcrypt from 'bcrypt';
import { Users } from '../models/usersDb.js';

const router = express.Router();

// REGISTER a new user
router.post('/register', async (req, res) => {
  const { email, password, first_name, last_name, phone } = req.body;

  try {
    // Check if email already exists
    const existingUser = await Users.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await Users.create({
      email,
      password_hash: hashedPassword,
      first_name,
      last_name,
      phone,
    });

    return res.status(201).json({ success: true, message: 'User registered successfully', user: { id: newUser.id, email: newUser.email } });
  } catch (error) {
    console.error("Registration error:", error.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// LOGIN user
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await Users.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});
