const express = require('express');
const router = express.Router();

// Import both models needed for the dashboard
const User = require('../models/User');
const Lead = require('../models/Lead');

const ADMIN_EMAIL = 'taranpreetsingh294@gmail.com';

/**
 * @route   POST /api/admin/data
 * @desc    Fetch all users and leads for the admin dashboard
 */
router.post('/data', async (req, res) => {
  const { email } = req.body;

  // 1. Check if the email from the request body is the admin's
  if (email !== ADMIN_EMAIL) {
    return res.status(403).json({ message: 'Access Denied: Invalid email.' });
  }

  try {
    // 2. Use Promise.all to efficiently get BOTH users and leads at the same time
    const [users, leads] = await Promise.all([
      User.find(),
      Lead.find()
    ]);

    // 3. Send them back together in one single response
    res.json({ users, leads });

  } catch (err) {
    res.status(500).json({ message: 'Server Error: ' + err.message });
  }
});

module.exports = router;
