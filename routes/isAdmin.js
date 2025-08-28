const express = require("express");
const verifyToken = require("../middleware/verifyToken");

const router = express.Router();

router.get("/is-admin", verifyToken, (req, res) => {
  const isAdmin = req.user.email === process.env.ADMIN_EMAIL;
  res.json({ isAdmin });
});

module.exports = router;
