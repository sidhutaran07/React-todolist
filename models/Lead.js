// Backend: models/Lead.js (MongoDB Model for Leads)
const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  interestedIn: { type: String, required: true, enum: ['A', 'B'] },
});

module.exports = mongoose.model('Lead', leadSchema);
