// --- START OF FILE CartItemDb.js ---

import { DataTypes } from "sequelize";
import { sequelizes } from "../utils/database.js";
import { Users } from "./usersDb.js";
import { Books } from "./BookDb.js";

export const cartItems = sequelizes.define(
  "cartItems",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "users",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    session_id: {
      type: DataTypes.STRING(255),
      allowNull: true,
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
    quantity: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      allowNull: false,
    },
    added_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    createdAt: "added_at",
    updatedAt: false,
    tableName: "cartItems",
    indexes: [
      {
        name: "idx_user_cart",
        fields: ["user_id"],
      },
      {
        name: "idx_session_cart",
        fields: ["session_id"],
      },
    ],
  }
);

// Define associations
Users.hasMany(cartItems, {
  foreignKey: "user_id",
  as: "cartItems",
});

cartItems.belongsTo(Users, {
  foreignKey: "user_id",
  as: "user",
});

Books.hasMany(cartItems, {
  foreignKey: "book_id",
  as: "cartItems",
});

cartItems.belongsTo(Books, {
  foreignKey: "book_id",
  as: "book",
});