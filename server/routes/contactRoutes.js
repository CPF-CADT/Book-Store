import { Router } from 'express';
import {
  validateContactForm,
  handleSubmitContactForm,
} from '../controllers/contactController.js';

const contactRouter = Router();

/**
 * @route   POST /api/contact/submit
 * @desc    Submit a message from the contact form
 * @access  Public
 */
contactRouter.post(
  '/submit',
  validateContactForm,  // Middleware for validation
  handleSubmitContactForm // The controller function
);

export default contactRouter;