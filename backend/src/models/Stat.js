const mongoose = require("mongoose");

const StatSchema = new mongoose.Schema({
  pageViews: { type: Number, default: 0 }
});

module.exports = mongoose.model("Stat", StatSchema);
