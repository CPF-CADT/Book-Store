import express from 'express';
import { getAllBooks, getBookById, getFilterOptions } from '../controllers/bookController.js';

const router = express.Router();

router.get('/', getAllBooks);
router.get('/filters', getFilterOptions);
router.get('/:id', getBookById);

export default router;