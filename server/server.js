import express from 'express';
import cors from 'cors';

// Import Sequelize connection
import { sequelizes } from './utils/database.js';

// Import all DB models (to initialize relationships and sync them)
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

// Import routes

import userRoutes from './routes/userRoutes.js';
import vendorRoutes from './routes/vendorRoutes.js';
import bookRoutes from './routes/books.js';
import filtersRoutes from './routes/filters.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: "http://localhost:5173" 
}));
// app.use(cors());
app.use(express.json());


// Routes

app.use('/api.auth', userRoutes);
app.use('/api/customer', userRoutes);
app.use('/api/vendor', vendorRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/filters', filtersRoutes);

app.get('/', (req, res) => {
  res.send('📚 Welcome to the Bookstore API Server!');
});

// Start server with DB connection
async function startServer() {
  try {
    // Connect to database
    await sequelizes.authenticate();
    console.log('✅ Database connection established successfully.');

    // Sync models (adjust `force: true` if you want to drop and recreate tables)
    await sequelizes.sync({ force: false });
    console.log('✅ Sequelize models synced.');

    // Start listening
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start the server:', error);
  }
}

startServer();
