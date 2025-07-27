import { Router } from 'express';
import { getAllPublishedPosts, getPostBySlug } from '../controllers/blogController.js';

const blogRouter = Router();

// Route to get all published posts with pagination
// GET /api/blog/posts
blogRouter.get('/posts', getAllPublishedPosts);

// Route to get a single post by its slug
// GET /api/blog/posts/my-amazing-post
blogRouter.get('/posts/:slug', getPostBySlug);

export default blogRouter;