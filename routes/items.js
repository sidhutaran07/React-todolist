const express = require("express");
const Item = require("../models/Item");
const router = express.Router();

// CREATE (supports single or multiple)
router.post("/", async (req, res) => {
  try {
    const payload = Array.isArray(req.body) ? req.body : [req.body];
    const cleaned = payload.map(({ category, name, price }) => ({
      category: String(category || "").trim(),
      name: String(name || "").trim(),
      price: Number(price || 0),
    }));
    const created = await Item.insertMany(cleaned);
    res.status(201).json(created);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to create items" });
  }
});

// READ (list)
router.get("/", async (_req, res) => {
  try {
    const items = await Item.find().sort("-createdAt");
    res.json(items);
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch items" });
  }
});

// UPDATE (one)
router.put("/:id", async (req, res) => {
  try {
    const { category, name, price } = req.body;
    const updated = await Item.findByIdAndUpdate(
      req.params.id,
      { category, name, price },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ error: "Not found" });
    res.json(updated);
  } catch (e) {
    res.status(400).json({ error: "Update failed" });
  }
});

// DELETE (one)
router.delete("/:id", async (req, res) => {
  try {
    const out = await Item.findByIdAndDelete(req.params.id);
    if (!out) return res.status(404).json({ error: "Not found" });
    res.json({ ok: true });
  } catch (e) {
    res.status(400).json({ error: "Delete failed" });
  }
});

module.exports = router;
