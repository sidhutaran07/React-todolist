const express = require('express');
const router = express.Router();
const User = require('../models/User');

// ✅ Use environment variable instead of hardcoded email
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

// Admin Authorization Middleware
const isAdmin = (req, res, next) => {
  const userEmail = req.headers['x-user-email'];
  if (!userEmail) {
    return res.status(401).json({ message: 'Access Denied: No user email provided.' });
  }
  if (userEmail !== ADMIN_EMAIL) {
    return res.status(403).json({ message: 'Access Denied: You do not have permission.' });
  }
  next();
};

//-- ROUTES --//

// Get all users (Admin only)
router.get('/', isAdmin, async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server Error: ' + err.message });
  }
});

// Create a new user (Public)
router.post('/', async (req, res) => {
  const { name, email, qualification, contact, socialMedia } = req.body;
  const newUser = new User({ name, email, qualification, contact, socialMedia });
  try {
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(400).json({ message: 'Failed to create user: ' + err.message });
  }
});

// Get single user (Admin only)
router.get('/:id', isAdmin, getUser, (req, res) => {
  res.json(res.user);
});

// Update user (Admin only)
router.patch('/:id', isAdmin, getUser, async (req, res) => {
  const fieldsToUpdate = ['name', 'email', 'qualification', 'contact', 'socialMedia'];
  fieldsToUpdate.forEach(field => {
    if (req.body[field] != null) {
      res.user[field] = req.body[field];
    }
  });
  try {
    const updatedUser = await res.user.save();
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: 'Failed to update user: ' + err.message });
  }
});

// Delete user (Admin only)
router.delete('/:id', isAdmin, getUser, async (req, res) => {
  try {
    await res.user.deleteOne();
    res.json({ message: 'Successfully deleted user' });
  } catch (err) {
    res.status(500).json({ message: 'Server Error: ' + err.message });
  }
});

// Middleware to find a user by ID
async function getUser(req, res, next) {
  let user;
  try {
    user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Cannot find user' });
    }
  } catch (err) {
    return res.status(500).json({ message: 'Server Error: ' + err.message });
  }
  res.user = user;
  next();
}

module.exports = router;
