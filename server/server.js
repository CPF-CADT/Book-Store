// server/server.js
import express from 'express';
import cors from 'cors';
import { sequelizes } from './utils/database.js';
import './module/associations.js'; // This is a great way to handle associations

// Correctly import your route files
import authRoutes from './routes/auth.js';
import bookRoutes from './routes/books.js';
import customerRoutes from './routes/customerRoutes.js';
import vendorRoutes from './routes/vendorRoutes.js';
import bookRoutes from './routes/books.js';
import categoryRoute from './routes/categories.js';
import authorRoutes from './routes/author.js';
import publisherRoutes from './routes/pulishers.js';
import tagRoutes from './routes/tag.js';
import cartRouter from './routes/cart.route.js';
import contactRouter from './routes/contactRoutes.js';
import blogRouter from './routes/blogRoutes.js';

const app = express();
const PORT = process.env.PORT || 3001; // Use 3001 to avoid conflicts

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());


// Routes
app.use('/api/blog', blogRouter);
app.use('/api/contact', contactRouter);
app.use('/api/user', userRoutes);
app.use('/api/customer', userRoutes);
app.use('/api/vendor', vendorRoutes);
app.use('/api/books', bookRoutes);
app.use ('/api/category',categoryRoute);
app.use ('/api/author',authorRoutes);
app.use ('/api/publisher',publisherRoutes);
app.use ('/api/tag',tagRoutes);
app.use('/api/cart',cartRouter)
app.get('/', (req, res) => {
  res.send('📚 Welcome to the Bookstore API Server!');
});

async function startServer() {
  try {
    await sequelizes.authenticate();
    console.log('✅ Database connection established.');
    await sequelizes.sync({ force: false });
    console.log('✅ Models synchronized.');
    app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
  } catch (error) {
    console.error('❌ Server startup failed:', error);
  }
}

await startServer();