import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

export const protect = async (req, res, next) => {
  try {
    // Authorization header шалгах (жишээ нь: "Bearer eyJhbGciOiJI...")
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    // Токен баталгаажуулах
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secretkey");

    // Админыг токеноор нь шалгаж олох
    const admin = await Admin.findById(decoded.id).select("-password");
    if (!admin) {
      return res.status(401).json({ message: "Admin not found" });
    }

    // Олдсон админыг req объект дээр нэмэх
    req.user = admin;
    next();
  } catch (err) {
    console.error("Auth middleware error:", err.message);
    res.status(403).json({ message: "Invalid or expired token" });
  }
};
