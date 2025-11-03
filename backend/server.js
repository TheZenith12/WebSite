import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Local imports (ESM хувилбар)
import connectDB from './src/config/db.js';
import authRoutes from './src/routes/auth.js';
import resortRoutes from "./src/routes/resorts.js";
import fileRoutes from './src/routes/fileRoutes.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static( 'public/uploads'));

connectDB();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Upload фолдер үүсгэх
const uploadDir = path.join(__dirname, 'public', 'uploads', 'resorts');
fs.mkdirSync(uploadDir, { recursive: true });

// Static файлуудыг serve хий

app.use('/api/admin/resorts', resortRoutes);
app.use("/api/admin/files", fileRoutes);
app.use("/api/admin", authRoutes);
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message });
});


app.get('/', (req, res) => {
  res.send('Backend server is running!');
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server started on port ${PORT}`));
