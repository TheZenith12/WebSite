import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

// Routes
import connectDB from './src/config/db.js';
import authRoutes from './src/routes/auth.js';
import resortRoutes from "./src/routes/resorts.js";
import fileRoutes from './src/routes/fileRoutes.js';

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174"],
  credentials: true
}));


connectDB();

// API Routes
app.use('/api/admin/resorts', resortRoutes);
app.use("/api/admin/files", fileRoutes);
app.use("/api/admin", authRoutes);

// Error handler
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.stack);
  res.status(500).json({ message: err.message });
});

// Root
app.get('/', (req, res) => {
  res.send('Backend server is running on Vercel + Cloudinary!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Export as serverless function for Vercel
export default app;
