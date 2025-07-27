// server/routes/auth.js
import express from 'express';
// Assuming your login/register logic is in userController.js
import { handleLogin, handleRegister } from '../controllers/userController.js';

const router = express.Router();

router.post('/register', handleRegister);
router.post('/login', handleLogin);

export default router;