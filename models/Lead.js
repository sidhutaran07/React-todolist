const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    userId: { type: String, required: true }, // who created it
  },
  { timestamps: true }
);

module.exports = mongoose.model("Lead", leadSchema);
