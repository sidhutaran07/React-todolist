const express = require('express');
const router = express.Router();

const Todo = require('../models/todo.model');
const Stat = require('../models/stat.model');

// Helper to get today's date string
const getTodayKey = () => new Date().toISOString().split('T')[0];

// --- TODO ROUTES ---

// GET all todos
router.get('/todos', async (req, res) => {
    const todos = await Todo.find().sort({ createdAt: -1 });
    res.json(todos);
});

// POST a new todo
router.post('/todos', async (req, res) => {
    const newTodo = new Todo({ text: req.body.text });
    await newTodo.save();

    // Update stats for task creation
    const today = getTodayKey();
    await Stat.findOneAndUpdate(
        { date: today },
        { $inc: { created: 1 } },
        { upsert: true, new: true } // upsert creates the doc if it doesn't exist
    );

    res.status(201).json(newTodo);
});

// UPDATE a todo (toggle complete)
router.put('/todos/:id', async (req, res) => {
    const todo = await Todo.findById(req.params.id);
    todo.completed = !todo.completed;
    await todo.save();

    // If the task is now complete, increment today's completed count
    if (todo.completed) {
        const today = getTodayKey();
        await Stat.findOneAndUpdate(
            { date: today },
            { $inc: { completed: 1 } },
            { upsert: true, new: true }
        );
    }
    // Note: We don't decrement if it's unchecked to keep stats simple.

    res.json(todo);
});


// DELETE a todo
router.delete('/todos/:id', async (req, res) => {
    await Todo.findByIdAndDelete(req.params.id);
    res.json({ message: 'Todo deleted successfully' });
});

// --- STATS ROUTES ---

// GET all stats
router.get('/stats', async (req, res) => {
    const stats = await Stat.find().sort({ date: -1 });
    // Convert array to the object format the frontend expects { "date": { data } }
    const statsObject = stats.reduce((acc, stat) => {
        acc[stat.date] = {
            created: stat.created,
            completed: stat.completed
        };
        return acc;
    }, {});
    res.json(statsObject);
});


module.exports = router;
