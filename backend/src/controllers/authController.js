import Admin from '../models/Admin.js';
import jwt from 'jsonwebtoken';
import bcrypt from "bcryptjs";


export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });

    console.log('admin:',admin)

    if (!admin || admin.password !== password) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: admin._id }, 'secretkey', { expiresIn: '1d' });
    res.json({ token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


export const register = async (req, res) => {
  try {
    const { email, password } = req.body;
    const newAdmin = new Admin({ email, password });
    await newAdmin.save();
    res.json({ message: 'Admin registered successfully' });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
