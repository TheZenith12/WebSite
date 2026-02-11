import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

// DB
import connectDB from "./src/config/db.js";

// Routes
import authRoutes from "./src/routes/auth.js";
import resortRoutes from "./src/routes/resorts.js";
import fileRoutes from "./src/routes/fileRoutes.js";

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://amaraltws-admin.vercel.app",
      "https://amaraltws.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.options("*", cors());

// DB
connectDB();

// ===== PAGE VIEWS =====
let pageViews = 0;

app.get("/api/stats", (req, res) => {
  pageViews++;
  res.json({ pageViews });
});

// Routes
app.use("/api/admin", authRoutes);
app.use("/api/admin/resorts", resortRoutes);
app.use("/api/admin/files", fileRoutes);

// Root
app.get("/", (req, res) => {
  res.send("✅ Backend server running");
});

// Error handler
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.stack);
  res.status(500).json({ message: err.message });
});

//gh

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


export default app;
