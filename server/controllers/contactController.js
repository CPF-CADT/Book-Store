import { ContactSubmission } from '../module/ContactSubmission.js'; // Adjust path
// Optional: Use a validation library for more robust checks
import { body, validationResult } from 'express-validator';

// Define the validation rules using express-validator
export const validateContactForm = [
  body('name').trim().notEmpty().withMessage('Name is required.').escape(),
  body('email').isEmail().withMessage('Please provide a valid email address.').normalizeEmail(),
  body('subject').trim().notEmpty().withMessage('Subject is required.').escape(),
  body('message').trim().notEmpty().withMessage('Message is required.').escape(),
];

// The main controller function
export async function handleSubmitContactForm(req, res) {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, email, subject, message } = req.body;

    // Create a new submission record in the database
    const newSubmission = await ContactSubmission.create({
      name,
      email,
      subject,
      message,
    });
    
    // Optional: Logic to send an email notification can be added here.
    // For example, using a library like Nodemailer.
    // await sendEmailNotification(newSubmission);

    // Send a success response back to the frontend
    res.status(201).json({
      message: 'Your message has been received successfully!',
      submission: newSubmission,
    });

  } catch (error) {
    console.error('Error handling contact form submission:', error);
    res.status(500).json({ message: 'An internal server error occurred.' });
  }
}