// --- START OF FILE categoriesDb.js ---

import { DataTypes } from "sequelize";
import { sequelizes } from "../utils/database.js";

export const categories = sequelizes.define(
  "categories",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    slug: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    parent_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "categories",
        key: "id",
      },
      onDelete: "SET NULL",
    },
    sort_order: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    create_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: true,
    createdAt: "create_at",
    // FIX: Explicitly disable updatedAt as no column is defined for it
    updatedAt: false,
    tableName: "categories",
  }
);

// Self-referencing association for parent-child categories
categories.belongsTo(categories, {
  foreignKey: "parent_id",
  as: "parent",
});

categories.hasMany(categories, {
  // FIX: The foreign key is 'parent_id', not 'parent'
  foreignKey: "parent_id",
  // BEST PRACTICE: Add an alias for clarity
  as: "children",
});