const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema(
  {
    category: { type: String, required: true, trim: true, maxlength: 120 },
    name:     { type: String, required: true, trim: true, maxlength: 200 },
    price:    { type: Number, required: true, min: 0 },
  },
  { timestamps: true }
);

ItemSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Item", ItemSchema);
