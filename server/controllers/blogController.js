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
const generateSlug = (title) => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};


// --- ADMIN/VENDOR CONTROLLERS ---

export async function createPost(req, res) {
  try {
    const { title, content, excerpt, featured_image_url, status } = req.body;
    const author_id = req.user.id; // Get author ID from authenticated user

    if (!title || !content) {
      return res.status(400).json({ message: "Title and content are required." });
    }
    
    // IMPORTANT: In a real app, sanitize the HTML `content` here to prevent XSS attacks.
    // Use a library like `dompurify`.
    
    const slug = generateSlug(title);

    const newPost = await BlogPost.create({
      title,
      slug,
      content,
      excerpt,
      featured_image_url,
      status,
      author_id
    });
    
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ message: 'Error creating blog post.' });
  }
}

export async function updatePost(req, res) {
  try {
    const { id } = req.params;
    const { title, content, excerpt, featured_image_url, status } = req.body;
    
    const post = await BlogPost.findByPk(id);
    if (!post) {
      return res.status(404).json({ message: 'Blog post not found.' });
    }

    const updates = { content, excerpt, featured_image_url, status };
    if (title) {
      updates.title = title;
      updates.slug = generateSlug(title);
    }
    
    await post.update(updates);
    
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: 'Error updating blog post.' });
  }
}

export async function deletePost(req, res) {
  try {
    const { id } = req.params;
    const post = await BlogPost.findByPk(id);

    if (!post) {
      return res.status(404).json({ message: 'Blog post not found.' });
    }

    await post.destroy();
    res.status(200).json({ message: 'Blog post deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting blog post.' });
  }
}