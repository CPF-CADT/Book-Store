import { DataTypes } from 'sequelize';
import { sequelizes } from '../utils/database.js';
import { Users } from './usersDb.js'; // Assuming admins/vendors write posts

export const BlogPost = sequelizes.define(
  'BlogPost',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    content: {
      type: DataTypes.TEXT, // Use TEXT for long-form content
      allowNull: false,
    },
    excerpt: {
      type: DataTypes.STRING(500), // A short summary for the blog list page
      allowNull: true,
    },
    featured_image_url: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    author_id: { // Foreign key to the Users table
      type: DataTypes.INTEGER,
      references: {
        model: Users,
        key: 'id'
      }
    },
    status: {
      type: DataTypes.ENUM('published', 'draft'),
      defaultValue: 'draft',
    },
    published_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'blog_posts',
    timestamps: true,
    createdAt: 'published_at',
    updatedAt: 'updated_at',
  }
);

// A blog post belongs to a User (as an author)
BlogPost.belongsTo(Users, { foreignKey: 'author_id', as: 'author' });
Users.hasMany(BlogPost, { foreignKey: 'author_id', as: 'blogPosts' });