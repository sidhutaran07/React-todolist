const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const statSchema = new Schema({
    // The date string, e.g., "2025-08-18"
    date: {
        type: String,
        required: true,
        unique: true // Ensures only one entry per day
    },
    created: {
        type: Number,
        default: 0
    },
    completed: {
        type: Number,
        default: 0
    }
});

const Stat = mongoose.model('Stat', statSchema);

module.exports = Stat;
