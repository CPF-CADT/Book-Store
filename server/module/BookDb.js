// --- START OF FILE BookDb.js ---

import { DataTypes } from "sequelize";
import { sequelizes } from "../utils/database.js";
import { publishers } from "./PublishersDb.js";
import { categories } from "./categoriesDb.js";

export const Books = sequelizes.define(
    "Books",
    {
        id:{
            type:DataTypes.INTEGER,
            autoIncrement:  true,
            primaryKey: true
        },
        title:{
            type: DataTypes.STRING(100),
            allowNull: false
        },
        // FIX: Removed redundant 'author' field.
        // The relationship is now correctly handled by the BookAuthors model.
        /*
        author:{
            type: DataTypes.STRING(100),
            allowNull: false
        },
        */
        description:{
            type: DataTypes.TEXT,
            allowNull: true
        },
        price:{
            type:DataTypes.DECIMAL(10,2),
            allowNull:false
        },
        original_price:{
            type:DataTypes.DECIMAL(10,2),
            allowNull:true
        },
        image_url:{
            type:DataTypes.STRING(500),
            allowNull:true
        },
        isbn:{
            type:DataTypes.STRING(20),
            unique:true,
            allowNull:true
        },
        stock:{
            type: DataTypes.INTEGER,
            defaultValue:0
        },
        rating:{
            type: DataTypes.DECIMAL(3,2),
            defaultValue:0
        },
        review_count:{
            type: DataTypes.INTEGER,
            defaultValue:0,
        },
        category_id:{
            type: DataTypes.INTEGER,
            allowNull: true
        },
        publisher_id:{
            type: DataTypes.INTEGER,
            allowNull: true
        },
        publisher_date:{
            type: DataTypes.DATEONLY, // Changed to DATEONLY
            allowNull:true
        },
        page_count:{
            type: DataTypes.INTEGER,
            allowNull:true
        },
        language:{
            type:DataTypes.STRING(50), // 500 is excessive for language
            defaultValue:"English"
        },
        format:{
            type:DataTypes.ENUM('paperback', 'hardcover', 'ebook'),
            defaultValue:'paperback'
        },
        status:{
            type:DataTypes.ENUM('active', 'inactive', 'out_of_print'),
            defaultValue:'active'
        },
        create_at:{
            type:DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        update_at:{
            type:DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            onUpdate: DataTypes.NOW
        },
    },
    {
        timestamps:true,
        createdAt:'create_at',
        updatedAt:'update_at',
        tableName: 'Books',
        indexes:[
            {fields: ['category_id'],name:"idx_category_id"},
            {fields: ['publisher_id'],name:"idx_publisher_id"},
            {fields: ['price'],name:"idx_price"},
            {fields: ['rating'],name:"idx_rating"}, // 'rating' is not a valid index name, changed to idx_rating
            {fields: ['stock'],name:"idx_stock"},
        ]
    }
);

// Define associations
Books.belongsTo(categories, {
  foreignKey: "category_id",
  as: "category",
});

categories.hasMany(Books, {
  foreignKey: "category_id",
  as: "books",
});

Books.belongsTo(publishers, {
  foreignKey: "publisher_id",
  as: "publisher",
});

publishers.hasMany(Books, {
  foreignKey: "publisher_id",
  as: "books",
});


// (async()=>{
//     await sequelizes.sync({alter: true});
//     const [book, created] = await Books.findOrCreate({
//         where: { isbn: '1236' },
//         defaults: {
//             title: 'kon',
//             description:'messi the goat',
//             price: 10.00,
//             original_price:20.00,
//             image_url:'cooked',
//             stock:10,
//             page_count:100,
//         }
//     });
//     if (created) {
//         console.log('book saved:', book.toJSON());
//     } else {
//         console.log('book already exists.');
//     }
// })();
