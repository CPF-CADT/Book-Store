// import mysql from "mysql2/promise";
// import dotenv from "dotenv";
// dotenv.config();
// const pool = mysql.createPool({
//     host : process.env.DB_HOST,
//     user : process.env.DB_USER,
//     password : process.env.DB_PASSWORD,
//     database : process.env.DB_NAME,
//     port : process.env.DB_PORT

// });
// export { pool };
import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config({path:'./.env'});



const sequelizes = new Sequelize({
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT),
  dialect: "mysql",
  logging: console.log,
});
// console.log("ENV CONFIG:", {
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
//   port: process.env.DB_PORT,
// });
console.log(process.env.DB_NAME);
export { sequelizes };