const express = require("express");
const router = express.Router();
const admin = require("../admin"); // Firebase Admin SDK

// Promote the first admin from env variable
router.post("/make-first-admin", async (req, res) => {
  try {
    const firstAdminEmail = process.env.FIRST_ADMIN_EMAIL;

    if (!firstAdminEmail) {
      return res.status(400).json({ error: "FIRST_ADMIN_EMAIL not set in env" });
    }

    // Fetch user by email
    const userRecord = await admin.auth().getUserByEmail(firstAdminEmail);

    // Assign custom claim
    await admin.auth().setCustomUserClaims(userRecord.uid, { admin: true });

    res.json({ message: `✅ ${userRecord.email} is now admin` });
  } catch (err) {
    console.error("Error making first admin:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
