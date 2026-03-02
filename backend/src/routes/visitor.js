import express from "express";
import Visitor from "../models/Stat.js";

const router = express.Router();

router.get("/visit", async (req, res) => {
  try {
    let visitor = await Visitor.findOne();

    if (!visitor) {
      visitor = await Visitor.create({ total: 1 });
    } else {
      visitor.total += 1;
      await visitor.save();
    }

    res.json({ total: visitor.total });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;