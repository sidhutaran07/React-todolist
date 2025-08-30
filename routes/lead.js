const express = require('express');
const router = express.Router();
const Lead = require('../models/Lead'); // Make sure the path to your model is correct

// --- NEW: Define the hardcoded admin email ---
const ADMIN_EMAIL = 'taranpreetsingh294@gmail.com';

// --- NEW: Admin Authorization Middleware ---
const isAdmin = (req, res, next) => {
  // Get the email from a custom request header
  const userEmail = req.headers['x-user-email'];

  // Check 1: Was an email header even provided?
  if (!userEmail) {
    // 401 Unauthorized: The client did not provide credentials.
    return res.status(401).json({ message: 'Access Denied: No user email provided.' });
  }

  // Check 2: Does the provided email match the admin email?
  if (userEmail !== ADMIN_EMAIL) {
    // 403 Forbidden: The client is known, but they don't have permission.
    return res.status(403).json({ message: 'Access Denied: You do not have permission to perform this action.' });
  }

  // If both checks pass, proceed to the actual route handler
  next();
};

// --- NEW: Apply the middleware to ALL routes in this file ---
// Any request to /api/leads/... will now run the isAdmin check first.
router.use(isAdmin);


//-- ROUTES --//
// (The rest of your routes remain exactly the same)

/**
 * @route   GET /api/leads
 * @desc    Get all leads (Admin Only)
 */
router.get('/', async (req, res) => {
  try {
    const leads = await Lead.find();
    res.json(leads);
  } catch (err) {
    res.status(500).json({ message: 'Server Error: ' + err.message });
  }
});

/**
 * @route   POST /api/leads
 * @desc    Create a new lead (Admin Only)
 */
router.post('/', async (req, res) => {
  const newLead = new Lead({
    name: req.body.name,
    email: req.body.email,
    interestedIn: req.body.interestedIn,
  });

  try {
    const savedLead = await newLead.save();
    res.status(201).json(savedLead);
  } catch (err) {
    res.status(400).json({ message: 'Failed to create lead: ' + err.message });
  }
});

/**
 * @route   GET /api/leads/:id
 * @desc    Get a single lead by its ID (Admin Only)
 */
router.get('/:id', getLead, (req, res) => {
  res.json(res.lead);
});

/**
 * @route   PATCH /api/leads/:id
 * @desc    Update a lead (Admin Only)
 */
router.patch('/:id', getLead, async (req, res) => {
  if (req.body.name != null) {
    res.lead.name = req.body.name;
  }
  if (req.body.email != null) {
    res.lead.email = req.body.email;
  }
  if (req.body.interestedIn != null) {
    res.lead.interestedIn = req.body.interestedIn;
  }

  try {
    const updatedLead = await res.lead.save();
    res.json(updatedLead);
  } catch (err) {
    res.status(400).json({ message: 'Failed to update lead: ' + err.message });
  }
});


/**
 * @route   DELETE /api/leads/:id
 * @desc    Delete a lead (Admin Only)
 */
router.delete('/:id', getLead, async (req, res) => {
  try {
    await res.lead.deleteOne();
    res.json({ message: 'Successfully deleted lead' });
  } catch (err) {
    res.status(500).json({ message: 'Server Error: ' + err.message });
  }
});


//-- MIDDLEWARE for getting a single lead --//
async function getLead(req, res, next) {
  let lead;
  try {
    lead = await Lead.findById(req.params.id);
    if (lead == null) {
      return res.status(404).json({ message: 'Cannot find lead' });
    }
  } catch (err) {
    return res.status(500).json({ message: 'Server Error: ' + err.message });
  }
  res.lead = lead;
  next();
}


module.exports = router;
