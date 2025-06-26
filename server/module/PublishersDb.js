// --- START OF FILE PublishersDb.js ---

import { DataTypes } from "sequelize";
import {  sequelizes } from "../utils/database.js";

export const publishers = sequelizes.define("publishers",{
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    name:{
        type:DataTypes.STRING(255),
        allowNull:false,
        unique:true
    },
    slug:{
        type:DataTypes.STRING(255),
        allowNull:false,
        unique:true
    },
    description:{
        type:DataTypes.TEXT,
        allowNull:true
    },
    website:{
        type:DataTypes.STRING(255),
        allowNull:true
    },
    logo_url :{
        type:DataTypes.STRING(500),
        allowNull:true
    },
    is_active:{
        type:DataTypes.BOOLEAN,
        defaultValue:true
    },
    create_at:{
        type:DataTypes.DATE,
        defaultValue:DataTypes.NOW
    }
},{
    timestamps:true,
    createdAt:'create_at',
    // FIX: Explicitly disable updatedAt as no column is defined for it
    updatedAt: false,
    tableName:'publishers'
});