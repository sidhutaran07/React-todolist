// Backend: models/User.js (MongoDB Model for Users)
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  qualification: { type: String, required: true },
  contact: { type: String, required: true },
  socialMedia: { type: [String], default: ['', '', ''] }, // Array of 3 strings
});

module.exports = mongoose.model('User', userSchema);
