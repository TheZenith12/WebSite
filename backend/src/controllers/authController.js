import Admin from "../models/Admin.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: "Admin not found" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Wrong password" });
    }

    const token = jwt.sign(
      { id: admin._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      token,
      admin: {
        id: admin._id,
        email: admin.email,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ REGISTER НЭМНЭ
export const register = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existing = await Admin.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await Admin.create({
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      success: true,
      admin: {
        id: admin._id,
        email: admin.email,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
