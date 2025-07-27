import bcrypt from 'bcrypt';
import * as userRepositories from '../Repositories/sqlUserRepositories.js';

export const handleRegister = async (req, res) => {
  const { first_name, last_name, email, password, phone } = req.body;
  if (!first_name || !email || !password) {
    return res.status(400).json({ success: false, message: 'First name, email, and password are required.' });
  }
  try {
    const existingUser = await userRepositories.findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'Email already exists.' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const userData = { first_name, last_name, email, password_hash: hashedPassword, phone };
    const newUser = await userRepositories.createUser(userData);
    res.status(201).json({ success: true, message: 'User registered successfully!', user: { id: newUser.id, email: newUser.email } });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ success: false, message: 'Server error during registration.' });
  }
};

export const handleLogin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required.' });
  }
  try {
    const user = await userRepositories.findUserByEmail(email);
    if (!user || !await bcrypt.compare(password, user.password_hash)) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }
    res.status(200).json({
      success: true,
      message: 'Login successful',
      user: { id: user.id, email: user.email, first_name: user.first_name }
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ success: false, message: 'Server error during login.' });
  }
};