const express = require('express');
const router = express.Router();
const Lead = require('../models/Lead');

// --- Admin Email from Environment Variable ---
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'z@y.com';

// --- Admin Authorization Middleware ---
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

// -------------------- ROUTES -------------------- //

/**
 * @route   POST /api/leads
 * @desc    Create a new lead (✅ PUBLIC for form submissions)
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
 * @route   GET /api/leads
 * @desc    Get all leads (❌ ADMIN ONLY)
 */
router.get('/', isAdmin, async (req, res) => {
  try {
    const leads = await Lead.find();
    res.json(leads);
  } catch (err) {
    res.status(500).json({ message: 'Server Error: ' + err.message });
  }
});

/**
 * @route   GET /api/leads/:id
 * @desc    Get a single lead by ID (❌ ADMIN ONLY)
 */
router.get('/:id', isAdmin, getLead, (req, res) => {
  res.json(res.lead);
});

/**
 * @route   PATCH /api/leads/:id
 * @desc    Update a lead (❌ ADMIN ONLY)
 */
router.patch('/:id', isAdmin, getLead, async (req, res) => {
  if (req.body.name != null) res.lead.name = req.body.name;
  if (req.body.email != null) res.lead.email = req.body.email;
  if (req.body.interestedIn != null) res.lead.interestedIn = req.body.interestedIn;

  try {
    const updatedLead = await res.lead.save();
    res.json(updatedLead);
  } catch (err) {
    res.status(400).json({ message: 'Failed to update lead: ' + err.message });
  }
});

/**
 * @route   DELETE /api/leads/:id
 * @desc    Delete a lead (❌ ADMIN ONLY)
 */
router.delete('/:id', isAdmin, getLead, async (req, res) => {
  try {
    await res.lead.deleteOne();
    res.json({ message: 'Successfully deleted lead' });
  } catch (err) {
    res.status(500).json({ message: 'Server Error: ' + err.message });
  }
});

// -- Helper Middleware to fetch a lead --
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
