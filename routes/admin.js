// routes/admin.js
const express = require("express");
const router = express.Router();
const admin = require("../admin");
const verifyToken = require("../middleware/verifyToken");

// Promote user to admin
router.post("/make-admin", verifyToken, async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ error: "Not authorized" });
    }

    const { target } = req.body;
    if (!target) return res.status(400).json({ error: "Missing target (email or uid)" });

    let uid = target;
    if (target.includes("@")) {
      const userRecord = await admin.auth().getUserByEmail(target);
      uid = userRecord.uid;
    }

    await admin.auth().setCustomUserClaims(uid, { admin: true });
    res.json({ message: `✅ User ${uid} promoted to admin` });
  } catch (err) {
    console.error("make-admin error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
