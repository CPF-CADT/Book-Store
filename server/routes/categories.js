import { Router } from "express";
import * as categoryController from '../controllers/categoriesController.js';
import { isAuthenticated, isAuthorized } from "../middleware/authMiddleware.js";
const categoryRoute= Router();

categoryRoute.get('/category', categoryController.handleGetAllCategories); 
categoryRoute.get('/category/:id', categoryController.handleGetCategoryDetail); 
// for admin 
categoryRoute.post(
  '/:userId/category',
  isAuthenticated,
  isAuthorized([ 'vendor']),
  categoryController.handleCreateCategory
);
categoryRoute.patch(
  '/:userId/category/:id',
  isAuthenticated,
  isAuthorized(['admin', 'vendor']),
  categoryController.handleUpdateCategory
);
categoryRoute.delete(
  '/:userId/category',
  isAuthenticated,
  isAuthorized(['admin', 'vendor']),
  categoryController.handleDeleteCategory
);
export default categoryRoute;