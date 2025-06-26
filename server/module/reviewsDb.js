// --- START OF FILE reviewsDb.js ---

import { DataTypes } from "sequelize";
import { sequelizes } from "../utils/database.js";
import { Books } from "./BookDb.js";
import { Users } from "./usersDb.js";

export const reviews = sequelizes.define(
  "Reviews",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    book_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        // FIX: The table name for Books is 'Books' (capitalized)
        model: "Books",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
          model: "users",
          key: "id",
      },
      onDelete: 'SET NULL', // Set user to null if user is deleted, preserves review
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
      },
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    review_text: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    is_verified_purchase: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    is_approved: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    helpful_votes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    tableName: "Reviews",
    indexes: [
      {
        name: "idx_book_rating",
        fields: ["book_id", "rating"],
      },
      {
        name: "idx_approved",
        fields: ["is_approved"],
      },
    ],
  }
);

// Define associations
Books.hasMany(reviews, {
  foreignKey: "book_id",
  as: "reviews",
});

reviews.belongsTo(Books, {
  foreignKey: "book_id",
  as: "book",
});

Users.hasMany(reviews, {
  foreignKey: "user_id",
  as: "reviews",
});

reviews.belongsTo(Users, {
  foreignKey: "user_id",
  as: "user",
});

/*
// BEST PRACTICE: Move seeding logic to a separate seeder file.
(async () => {
  try {
    await sequelizes.sync({ alter: true });
    // This will fail if book_id: 2 and user_id: 1 do not exist.
    // Seeders should create dependencies first.
    const review = reviews.build({
      book_id: 2,
      user_id: 1,
      rating: 4,
      title: "Great Book!",
      review_text: "Really enjoyed this book, highly recommend.",
    });

    const saved = await review.save();
    console.log("Review saved:", saved.toJSON());
  } catch (error) {
    console.error("Error inserting review:", error.message);
  }
})();
*/