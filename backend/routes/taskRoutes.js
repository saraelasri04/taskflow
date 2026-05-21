const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

// Get all tasks for a project
router.get('/projects/:id/tasks', async (req, res) => {
    try {
        const tasks = await Task.find({ project: req.params.id });
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create a new task
router.post('/tasks', async (req, res) => {
    const task = new Task({
        title: req.body.title,
        priority: req.body.priority,
        status: req.body.status,
        project: req.body.project
    });
    try {
        const newTask = await task.save();
        res.status(201).json(newTask);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update task status
router.patch('/tasks/:id/status', async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: 'Task not found' });

        if (req.body.status) {
            task.status = req.body.status;
        }
        
        const updatedTask = await task.save();
        res.json(updatedTask);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete a task
router.delete('/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) return res.status(404).json({ message: 'Task not found' });
        res.json({ message: 'Task deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;