const express = require("express");
const router = express.Router();
router.post("/make-first-admin", async (req, res) => {
  const { uid, secret } = req.body;

  if (secret !== process.env.ADMIN_SECRET_KEY) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  await admin.auth().setCustomUserClaims(uid, { admin: true });
  res.json({ message: `✅ User ${uid} promoted to first admin` });
});
