// routes/leads.js
const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const Lead = require("../models/Lead");

// Create lead (any logged in user)
router.post("/", verifyToken, async (req, res) => {
  try {
    const { name, email } = req.body;
    const lead = new Lead({ name, email, userId: req.user.uid });
    await lead.save();
    res.status(201).json(lead);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all leads (admin only)
router.get("/", verifyToken, async (req, res) => {
  try {
    if (!req.user.isAdmin) return res.status(403).json({ error: "Not authorized" });
    const leads = await Lead.find();
    res.json(leads);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
