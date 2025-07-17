// --- START OF FILE usersDb.js ---

import { DataTypes } from "sequelize";
import { sequelizes } from "../utils/database.js";
// Associations are defined elsewhere, but imports are needed
// to establish the relationships when models are initialized.


export const Users = sequelizes.define(
  "Users",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    password_hash: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    first_name: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    last_name: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },
    role: {
      type: DataTypes.ENUM("customer", "admin", "vendor"),
      defaultValue: "customer",
      allowNull: false,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
    email_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
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
    tableName: "users",
  }
);

// FIX: Removed redundant association definitions. They are correctly
// defined in reviewsDb.js and CartItemDb.js. Keeping them in one
// place is best practice.