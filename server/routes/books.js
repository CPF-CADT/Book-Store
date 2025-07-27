import { Router } from "express";
import {
  handleGetAllbooks,
  getbookdetail,
  createBook,
  updateBook,
  deleteBooks
} from '../controllers/bookControllers.js';
import { isAuthenticated, isAuthorized } from "../middleware/authMiddleware.js";

const bookRoutes = Router();

// For anyone 
bookRoutes.get('/', handleGetAllbooks);
bookRoutes.get('/:bookId', getbookdetail);


// For vendors and admins

bookRoutes.post(
  '/:userId',
  isAuthenticated,
  isAuthorized([ 'vendor']),
  createBook
);
bookRoutes.patch(
  '/:userId/:bookId',
  isAuthenticated,
  isAuthorized(['admin', 'vendor']),
  updateBook
);
bookRoutes.delete(
  '/:userId/:ids',
  isAuthenticated,
  isAuthorized(['admin', 'vendor']),
  deleteBooks
);


export default bookRoutes;