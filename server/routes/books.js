// server/routes/books.js
import express from 'express';
// Note: your file is bookController.js, not bookControllers.js
import { handleGetAllbooks, getbookdetail, getFilterOptions } from '../controllers/bookController.js';

const router = express.Router();

// GET /api/books - Get all books with filtering
router.get('/', handleGetAllbooks);

// GET /api/books/filters - Get data for the sidebar
router.get('/filters', getFilterOptions);

// GET /api/books/:id - Get a single book by its ID
router.get('/:id', getbookdetail);

export default router;