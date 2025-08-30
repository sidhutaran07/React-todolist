require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const leadsRouter = require('./routes/leads');
const usersRouter = require('./routes/users');
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Allow requests from your frontend
app.use(express.json()); // Allow server to accept JSON in request bodies

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.error(err));

// API Routes
app.use('/api/todo', require('./routes/todo'));

app.use('/api/leads', leadsRouter);
app.use('/api/users', usersRouter);
// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
