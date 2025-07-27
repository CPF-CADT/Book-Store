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

const app = express();
const PORT = process.env.PORT || 3001; // Use 3001 to avoid conflicts

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

// Use the correct base paths for your routes
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes); // For all book-related operations
app.use('/api/customer', customerRoutes);
app.use('/api/vendor', vendorRoutes);

app.get('/', (req, res) => res.send('📚 Kon Khmer Bookstore API is running!'));

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
startServer();