import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

// Routes
import connectDB from './src/config/db.js';
import authRoutes from './src/routes/auth.js';
import resortRoutes from "./src/routes/resorts.js";
import fileRoutes from './src/routes/fileRoutes.js';

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/page-view", async (req, res) => {
  await db.query(
    "UPDATE stats SET page_views = page_views + 1 WHERE id = 1"
  );
  res.json({ success: true });
});

app.get("/api/stats", async (req, res) => {
  const [rows] = await db.query(
    "SELECT page_views FROM stats WHERE id = 1"
  );
  res.json({ pageViews: rows[0].page_views });
});

app.listen(3000);


dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware
app.use(
  cors({
    origin: [
      "https://amaraltws-admin.vercel.app",
      "https://amaraltws.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.options("*", cors());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://amaraltws-admin.vercel.app", "https://amaraltws.vercel.app");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  next();
});

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
