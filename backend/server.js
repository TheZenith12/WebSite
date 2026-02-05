import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";

// Routes
import connectDB from "./src/config/db.js";
import authRoutes from "./src/routes/authRoutes.js";
import adminRoutes from "./src/routes/adminRoutes.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ CORS (ЗӨВ ХЭЛБЭР)
app.use(
  cors({
    origin: true, // 👈 incoming origin-ийг автоматаар зөвшөөрнө
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);


// ❌ ЭНД ӨӨР CORS / HEADER БИЧИХ ХЭРЭГГҮЙ
// ❌ app.options("*", cors());
// ❌ app.use((req, res, next) => {...})

connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin/", adminRoutes);

// Root
app.get("/", (req, res) => {
  res.send("Backend server is running on Vercel + Cloudinary!");
});

// Error handler
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.stack);
  res.status(500).json({ message: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);