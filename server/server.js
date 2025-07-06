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
import vendorRoutes from './routes/vendorRoutes.js';
import bookroutes from './routes/books.js'


const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/customer",userRoutes);
app.use("/api/vendor",vendorRoutes);
app.use('/api/books',bookroutes);
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

const PORT = process.env.PORT ||3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);

})


