import Admin from "../models/Admin.js";
import jwt from "jsonwebtoken";

// JWT token үүсгэх
const generateToken = (adminId) => {
  return jwt.sign(
    { id: adminId },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// Success response
const sendTokenResponse = (admin, statusCode, res) => {
  const token = generateToken(admin._id);

  res.status(statusCode).json({
    success: true,
    token,
    admin: {
      id: admin._id,
      email: admin.email,
      name: admin.name,
      isAdmin: admin.isAdmin
    }
  });
};

// Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email болон нууц үгээ оруулна уу"
      });
    }

    const admin = await Admin.findOne({ email }).select("+password");
    
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Email буюу нууц үг буруу байна"
      });
    }

    if (!admin.isActive) {
      return res.status(403).json({
        success: false,
        message: "Таны эрх идэвхгүй байна"
      });
    }

    const isPasswordValid = await admin.comparePassword(password);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Email буюу нууц үг буруу байна"
      });
    }

    await admin.updateLastLogin();
    sendTokenResponse(admin, 200, res);

  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({
      success: false,
      message: "Нэвтрэхэд алдаа гарлаа"
    });
  }
};

// Register
export const register = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email болон нууц үг шаардлагатай"
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Нууц үг 6-аас дээш тэмдэгт байх ёстой"
      });
    }

    const existingAdmin = await Admin.findOne({ email });
    
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: "Энэ email аль хэдийн бүртгэгдсэн байна"
      });
    }

    const admin = await Admin.create({
      email,
      password,
      name,
      isAdmin: true
    });

    sendTokenResponse(admin, 201, res);

  } catch (err) {
    console.error("❌ Register error:", err);
    
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({
        success: false,
        message: messages[0]
      });
    }

    res.status(500).json({
      success: false,
      message: "Бүртгэхэд алдаа гарлаа"
    });
  }
};

// Get me
export const getMe = async (req, res) => {
  try {
    const admin = await Admin.findById(req.user.id);

    res.status(200).json({
      success: true,
      admin: {
        id: admin._id,
        email: admin.email,
        name: admin.name,
        isAdmin: admin.isAdmin,
        lastLogin: admin.lastLogin
      }
    });
  } catch (err) {
    console.error("❌ Get me error:", err);
    res.status(500).json({
      success: false,
      message: "Мэдээлэл татахад алдаа гарлаа"
    });
  }
};

// Logout
export const logout = async (req, res) => {
  res.status(200).json({
    success: true,
    message: "Амжилттай гарлаа"
  });
};