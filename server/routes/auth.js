import express from 'express';
import { login,CustomerSignUp  } from '../controllers/userControllers.js';

const router = express.Router();

router.post('/register', CustomerSignUp);
router.post('/login', handleLogin);

export default router;