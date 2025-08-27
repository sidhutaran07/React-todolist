// Temporary route to create first admin
router.post("/make-first-admin", async (req, res) => {
  const { uid, secret } = req.body;

  // Check secret against environment variable
  if (secret !== process.env.ADMIN_SECRET_KEY) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    // Set admin custom claim in Firebase
    await admin.auth().setCustomUserClaims(uid, { admin: true });
    res.json({ message: `✅ User ${uid} promoted to first admin` });
  } catch (err) {
    console.error("make-first-admin error:", err);
    res.status(500).json({ error: err.message });
  }
});
