import { BlogPost } from '../module/BlogPost.js';
import { Users } from '../module/usersDb.js';

// Get all published blog posts (for the public blog list page)
export async function getAllPublishedPosts(req, res) {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 9; // 9 for a 3x3 grid
    const offset = (page - 1) * limit;

    const { count, rows } = await BlogPost.findAndCountAll({
      where: { status: 'published' },
      limit,
      offset,
      order: [['published_at', 'DESC']],
      include: { // Include author's name
        model: Users,
        as: 'author',
        attributes: ['first_name', 'last_name'],
      },
      attributes: { exclude: ['content'] } // Exclude full content from list view
    });

    res.status(200).json({
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      posts: rows,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching blog posts.' });
  }
}

// Get a single blog post by its slug (for the detail page)
export async function getPostBySlug(req, res) {
  try {
    const { slug } = req.params;
    const post = await BlogPost.findOne({
      where: { slug, status: 'published' },
      include: {
        model: Users,
        as: 'author',
        attributes: ['first_name', 'last_name'],
      }
    });

    if (!post) {
      return res.status(404).json({ message: 'Blog post not found.' });
    }

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching blog post.' });
  }
}