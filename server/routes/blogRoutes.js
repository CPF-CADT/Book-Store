import { Router } from 'express';
import { getAllPublishedPosts, getPostBySlug ,createPost,updatePost,deletePost } from '../controllers/blogController.js';
import { isAuthenticated,isAuthorized } from '../middleware/authMiddleware.js';

const blogRouter = Router();

// Route to get all published posts with pagination
// GET /api/blog/posts
blogRouter.get('/posts', getAllPublishedPosts);

// Route to get a single post by its slug
// GET /api/blog/posts/my-amazing-post
blogRouter.get('/posts/:slug', getPostBySlug);
blogRouter.post(
  '/posts',
  isAuthenticated,
  isAuthorized(['admin', 'vendor']),
  createPost
);

// PUT /api/blog/posts/:id
blogRouter.put(
  '/posts/:id',
  isAuthenticated,
  isAuthorized(['admin', 'vendor']),
  updatePost
);

// DELETE /api/blog/posts/:id
blogRouter.delete(
  '/posts/:id',
  isAuthenticated,
  isAuthorized(['admin']), // Example: Only admins can delete
  deletePost
);

export default blogRouter;