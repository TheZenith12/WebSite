import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import rateLimit from "express-rate-limit";

// Config
import connectDB from "./src/config/db.js";

// Routes
import authRoutes from "./src/routes/authRoutes.js";
import adminRoutes from "./src/routes/adminRoutes.js";
import publicRoutes from "./src/routes/publicRoutes.js";

// Environment variables
dotenv.config();

// Initialize app
const app = express();

// ====================================
// SECURITY MIDDLEWARE
// ====================================

// Helmet - HTTP headers security
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS - зөвхөн allowed origins-ийг зөвшөөрөх
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "https://web-site-seven-chi.vercel.app",
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // API tools (Postman, Thunder Client гэх мэт) - origin байхгүй
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn(`❌ CORS blocked: ${origin}`);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

// Rate limiting - DDoS protection
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 100, // 100 request/15min
  message: "Хэт олон хүсэлт илгээж байна. 15 минутын дараа дахин оролдоно уу",
  standardHeaders: true,
  legacyHeaders: false
});

app.use("/api/", limiter);

// Mongo sanitize - NoSQL injection protection
app.use(mongoSanitize());

// ====================================
// BODY PARSING
// ====================================
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ====================================
// DATABASE CONNECTION
// ====================================
connectDB();

// ====================================
// ROUTES
// ====================================
app.use("/api/auth", authRoutes);       // Login, Register
app.use("/api/admin", adminRoutes);     // Admin панелийн бүх routes
app.use("/api", publicRoutes);          // Public site-ын routes

// Health check
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "🚀 Resort Management API is running!",
    version: "2.0.0",
    endpoints: {
      auth: "/api/auth",
      admin: "/api/admin",
      public: "/api"
    }
  });
});

app.get("/health", (req, res) => {
  res.json({
    success: true,
    status: "healthy",
    timestamp: new Date().toISOString()
  });
});

// ====================================
// ERROR HANDLING
// ====================================

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route олдсонгүй",
    path: req.originalUrl
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("❌ Global Error:", err);

  // CORS error
  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({
      success: false,
      message: "CORS policy-аар хориглогдсон"
    });
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({
      success: false,
      message: messages[0] || "Validation алдаа"
    });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(400).json({
      success: false,
      message: `${field} аль хэдийн бүртгэлтэй байна`
    });
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      success: false,
      message: "Буруу токен"
    });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      success: false,
      message: "Токены хугацаа дууссан"
    });
  }

  // Default error
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Серверийн алдаа гарлаа",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack })
  });
});

// ====================================
// SERVER START
// ====================================
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`
  ╔════════════════════════════════════════════╗
  ║   🚀 Server is running!                   ║
  ║   📍 Port: ${PORT}                         ║
  ║   🌍 Environment: ${process.env.NODE_ENV || 'development'}        ║
  ╚════════════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("👋 SIGTERM received. Shutting down gracefully...");
  server.close(() => {
    console.log("✅ Server closed");
    process.exit(0);
  });
});

export default app;