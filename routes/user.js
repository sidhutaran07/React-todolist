const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Adjust the path to your User model if necessary

// --- Re-using the same security logic ---
const ADMIN_EMAIL = 'taranpreetsingh294@gmail.com';

// Admin Authorization Middleware (ensures only the admin can access these routes)
const isAdmin = (req, res, next) => {
  const userEmail = req.headers['x-user-email'];

  if (!userEmail) {
    return res.status(401).json({ message: 'Access Denied: No user email provided.' });
  }
  if (userEmail !== ADMIN_EMAIL) {
    return res.status(403).json({ message: 'Access Denied: You do not have permission to perform this action.' });
  }
  next();
};

// Apply the admin middleware to ALL routes defined in this file.
router.use(isAdmin);


//-- ROUTES --//

/**
 * @route   GET /api/users
 * @desc    Get all users (Admin Only)
 */
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server Error: ' + err.message });
  }
});

/**
 * @route   POST /api/users
 * @desc    Create a new user (Admin Only)
 */
router.post('/', async (req, res) => {
  const { name, email, qualification, contact, socialMedia } = req.body;

  const newUser = new User({
    name,
    email,
    qualification,
    contact,
    socialMedia,
  });

  try {
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(400).json({ message: 'Failed to create user: ' + err.message });
  }
});

/**
 * @route   GET /api/users/:id
 * @desc    Get a single user by ID (Admin Only)
 */
router.get('/:id', getUser, (req, res) => {
  // The 'getUser' middleware has already found the user for us
  res.json(res.user);
});

/**
 * @route   PATCH /api/users/:id
 * @desc    Update a user (Admin Only)
 */
router.patch('/:id', getUser, async (req, res) => {
  // Dynamically update fields that are present in the request body
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

/**
 * @route   DELETE /api/users/:id
 * @desc    Delete a user (Admin Only)
 */
router.delete('/:id', getUser, async (req, res) => {
  try {
    await res.user.deleteOne();
    res.json({ message: 'Successfully deleted user' });
  } catch (err) {
    res.status(500).json({ message: 'Server Error: ' + err.message });
  }
});


//-- MIDDLEWARE to find a single user by ID --//
async function getUser(req, res, next) {
  let user;
  try {
    user = await User.findById(req.params.id);
    if (user == null) {
      return res.status(404).json({ message: 'Cannot find user' });
    }
  } catch (err) {
    return res.status(500).json({ message: 'Server Error: ' + err.message });
  }
  res.user = user;
  next();
}


module.exports = router;
