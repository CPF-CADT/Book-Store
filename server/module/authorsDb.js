// --- START OF FILE authorsDb.js ---

import { DataTypes } from "sequelize";
import { sequelizes } from "../utils/database.js";

export const authors = sequelizes.define(
    'authors',{
        id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    photo_url: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    birth_date: {
      type: DataTypes.DATEONLY, // Using DATEONLY is often better for just dates
      allowNull: true,
    },
    nationality: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
    },{
        // FIX: Let Sequelize manage the timestamp for consistency.
        // No updated_at column is defined, so we disable it.
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: false,
        tableName: 'authors',
    }
);


// (async () => {
//   try {
//     await sequelizes.sync({ alter: true });
//     const [author, created] = await authors.findOrCreate({
//       where: { name: "J.K. Rowling" },
//       defaults: {
//         bio: "British author, best known for the Harry Potter series.",
//         photo_url: "https://example.com/jk-rowling.jpg",
//         birth_date: "1965-07-31",
//         nationality: "British",
//       }
//     });

//     if (created) {
//       console.log("Author saved:", author.toJSON());
//     } else {
//       console.log("Author already exists.");
//     }
//   } catch (error) {
//     console.error("Error inserting author:", error.message);
//   }
// })();
