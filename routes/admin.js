const express = require('express');
const router = express.Router();

// Models
const User = require('../models/User');
const Lead = require('../models/Lead');

// Firebase Admin
const admin = require('firebase-admin');

// Middleware: verify Firebase ID token
async function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
}

// Environment variable for admin check
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'any@example.com';

/**
 * @route   GET /api/admin/data
 * @desc    Fetch all users and leads for the admin dashboard
 */
router.get('/data', authenticateToken, async (req, res) => {
  // 1. Check if the Firebase user’s email matches the admin email
  if (req.user.email !== ADMIN_EMAIL) {
    return res.status(403).json({ message: 'Access Denied: Not an admin.' });
  }

  try {
    // 2. Use Promise.all to fetch BOTH users and leads
    const [users, leads] = await Promise.all([
      User.find(),
      Lead.find(),
    ]);

    // 3. Send them back together
    res.json({ users, leads });
  } catch (err) {
    res.status(500).json({ message: 'Server Error: ' + err.message });
  }
});

module.exports = router;
