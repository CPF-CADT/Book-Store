// --- START OF FILE tagsDb.js ---

import { DataTypes } from "sequelize";
import { sequelizes } from "../utils/database.js";

export const Tags = sequelizes.define(
  "Tags",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    slug: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    createdAt: "created_at",
    // FIX: Explicitly disable updatedAt as no column is defined for it
    updatedAt: false,
    tableName: "tags",
  }
);

/*
// BEST PRACTICE: Move seeding logic to a separate seeder file.
(async () => {
  try {
    await sequelizes.sync({ alter: true });
    const [tag, created] = await Tags.findOrCreate({
      where: { slug: "fiction" },
      defaults: {
        name: "Fiction",
      }
    });
    if (created) {
        console.log("Tag saved:", tag.toJSON());
    } else {
        console.log("Tag already exists.");
    }
  } catch (error) {
    console.error("Error inserting tag:", error.message);
  }
})();
*/