// --- START OF FILE BookauthorsDb.js ---
// server/module/BookauthorsDb.js
import { DataTypes } from "sequelize";
import { sequelizes } from "../utils/database.js";
import { Books } from "./BookDb.js";
import { authors } from "./authorsDb.js";

export const BookAuthors = sequelizes.define('BookAuthors',
    {
    book_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      references: {
        model: 'Books',
        key: 'id',
        },
      onDelete: 'CASCADE',
    },
    author_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      references: {
        model: 'authors',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    role: {
      type: DataTypes.ENUM('author', 'co-author', 'editor', 'translator'),
      defaultValue: 'author',
      allowNull: false,
    },
  },
  {
    timestamps: false,
    tableName: 'bookAuthors',
  }
);

// Define associations
Books.belongsToMany(authors, {
  // FIX: The model name is 'BookAuthors', not 'BookAuthor'
  through: BookAuthors,
  foreignKey: 'book_id',
  otherKey: 'author_id',
  as: 'authors',
});

authors.belongsToMany(Books, {
  // FIX: The model name is 'BookAuthors', not 'BookAuthor'
  through: BookAuthors,
  foreignKey: 'author_id',
  otherKey: 'book_id',
  as: 'books',
});