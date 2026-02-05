import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

// JWT token шалгах
export const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Энэ үйлдлийг хийхэд эрх хэрэгтэй. Нэвтэрнэ үү"
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.id).select("-password");

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Admin олдсонгүй"
      });
    }

    if (!admin.isActive) {
      return res.status(403).json({
        success: false,
        message: "Таны эрх идэвхгүй байна"
      });
    }

    req.user = admin;
    next();
  } catch (err) {
    console.error("❌ Auth error:", err);

    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Буруу token"
      });
    }

    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token-ий хугацаа дууссан"
      });
    }

    return res.status(500).json({
      success: false,
      message: "Эрх баталгаажуулахад алдаа гарлаа"
    });
  }
};

// Admin эсэхийг шалгах
export const verifyAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Эхлээд нэвтэрнэ үү"
    });
  }

  if (!req.user.isAdmin) {
    return res.status(403).json({
      success: false,
      message: "Зөвхөн админ хийх эрхтэй"
    });
  }

  next();
};