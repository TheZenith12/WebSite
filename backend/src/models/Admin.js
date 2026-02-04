import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
  email: String,
  password: String,
  isAdmin: {
    type: Boolean,
    default: true,
  },
});

export default mongoose.model("Admin", adminSchema);