const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken'); // 1. Import the middleware

const Todo = require('../models/todo.model');
const Stat = require('../models/stat.model');

// Helper to get today's date string
const getTodayKey = () => new Date().toISOString().split('T')[0];

// --- TODO ROUTES (Protected) ---
// All todo routes now have the 'verifyToken' middleware added.
// All database queries are updated to use 'req.user.uid' to ensure
// users can only access their own data.

// GET all todos for the logged-in user
router.get('/todos', verifyToken, async (req, res) => {
    const todos = await Todo.find({ userId: req.user.uid }).sort({ createdAt: -1 });
    res.json(todos);
});

// POST a new todo for the logged-in user
router.post('/todos', verifyToken, async (req, res) => {
    const newTodo = new Todo({ 
        text: req.body.text,
        userId: req.user.uid // Associate with the logged-in user
    });
    await newTodo.save();

    const today = getTodayKey();
    await Stat.findOneAndUpdate(
        { date: today, userId: req.user.uid }, // Match user's stats
        { $inc: { created: 1 } },
        { upsert: true, new: true }
    );

    res.status(201).json(newTodo);
});

// UPDATE a todo (toggle complete)
router.put('/todos/:id', verifyToken, async (req, res) => {
    // Find the todo by its ID AND the user's ID to ensure they own it
    const todo = await Todo.findOne({ _id: req.params.id, userId: req.user.uid });

    if (!todo) {
        return res.status(404).json({ message: "Todo not found or you don't have permission." });
    }

    todo.completed = !todo.completed;
    await todo.save();

    if (todo.completed) {
        const today = getTodayKey();
        await Stat.findOneAndUpdate(
            { date: today, userId: req.user.uid }, // Match user's stats
            { $inc: { completed: 1 } },
            { upsert: true, new: true }
        );
    }
    
    res.json(todo);
});

// DELETE a todo
router.delete('/todos/:id', verifyToken, async (req, res) => {
    // Ensure the user can only delete their own todos
    const result = await Todo.findOneAndDelete({ _id: req.params.id, userId: req.user.uid });
    
    if (!result) {
        return res.status(404).json({ message: "Todo not found or you don't have permission." });
    }
    
    res.json({ message: 'Todo deleted successfully' });
});

// --- STATS / PRODUCTIVITY DASHBOARD ROUTE (Protected) ---

// GET all stats for the logged-in user
router.get('/stats', verifyToken, async (req, res) => {
    const stats = await Stat.find({ userId: req.user.uid }).sort({ date: -1 });
    
    const statsObject = stats.reduce((acc, stat) => {
        acc[stat.date] = {
            created: stat.created,
            completed: stat.completed
        };
        return acc;
    }, {});
    res.json(statsObject);
});

// --- PUBLIC ROUTES ---
// As requested, any routes for "Focus Time" would go here without the
// 'verifyToken' middleware. For example:
// router.get('/focustime', (req, res) => { ... });

module.exports = router;
