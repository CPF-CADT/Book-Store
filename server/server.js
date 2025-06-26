import express from 'express';
import './module/BookDb.js';
import './module/categoriesDb.js';
import './module/PublishersDb.js';
import './module/authorsDb.js';
import './module/BookauthorsDb.js';
import './module/BooktagesDb.js';
import './module/tagsDb.js';
import './module/usersDb.js';
import './module/reviewsDb.js';
import './module/CartItemDb.js';
import cors from 'cors';
import { sequelizes } from './utils/database.js';
import userRoutes from "./routes/userRoutes.js";


const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/user",userRoutes);

app.get('/', (req, res) => {
    res.send('Welcome to the server!');
});
// try {
//   await sequelizes.authenticate();
//   console.log('✅ Database connection established successfully.');
// } catch (error) {
//   console.error('❌ Unable to connect to the database:', error);
// };


// try {
//   await sequelizes.sync({ force: false });
//   console.log("✅ Sequelize synced.");
// } catch (err) {
//   console.error("❌ Sequelize sync failed:", err);
// }

const PORT = process.env.PORT ||5173;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);

})


