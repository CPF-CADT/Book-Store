// --- START OF FILE BooktagesDb.js ---

import { DataTypes } from "sequelize";
import { sequelizes } from "../utils/database.js";
import { Books } from "./BookDb.js";
import { Tags } from "./tagsDb.js";

export const BookTags = sequelizes.define(
  "BookTags",
  {
    book_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      references: {
        // FIX: The table name for Books is 'Books' (capitalized)
        model: "Books",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    tag_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      references: {
        model: "tags",
        key: "id",
      },
      onDelete: "CASCADE",
    },
  },
  {
    timestamps: false,
    tableName: "book_tags",
  }
);

// Define many-to-many associations
Books.belongsToMany(Tags, {
  // FIX: The model name is 'BookTags', not 'BookTag'
  through: BookTags,
  foreignKey: "book_id",
  otherKey: "tag_id",
  as: "tags",
});

Tags.belongsToMany(Books, {
  // FIX: The model name is 'BookTags', not 'BookTag'
  through: BookTags,
  foreignKey: "tag_id",
  otherKey: "book_id",
  as: "books",
});