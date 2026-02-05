import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const adminSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email шаардлагатай"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Зөв email хаяг оруулна уу"]
    },
    
    password: {
      type: String,
      required: [true, "Нууц үг шаардлагатай"],
      minlength: [6, "Нууц үг 6-аас дээш тэмдэгт байх ёстой"],
      select: false
    },
    
    isAdmin: {
      type: Boolean,
      default: true
    },
    
    name: {
      type: String,
      trim: true
    },
    
    lastLogin: {
      type: Date
    },
    
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

// Password hash хийх
adminSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Password шалгах method
adminSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (err) {
    throw new Error("Нууц үг шалгахад алдаа гарлаа");
  }
};

// Login date шинэчлэх
adminSchema.methods.updateLastLogin = async function() {
  this.lastLogin = new Date();
  await this.save();
};

export default mongoose.model("Admin", adminSchema);