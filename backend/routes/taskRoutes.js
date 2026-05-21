const express = require('express');
const router = express.Router();
const Task = require('../models/Task'); // استدعاء المخطط الذي أنشأته

// 1. جلب جميع مهام مشروع معين (GET /api/projects/:id/tasks)
router.get('/projects/:id/tasks', async (req, res) => {
    try {
        const tasks = await Task.find({ project: req.params.id });
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 2. إنشاء مهمة جديدة (POST /api/tasks)
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

// 3. تحديث حالة المهمة فقط عبر PATCH المطلوب في التقييم
router.patch('/tasks/:id/status', async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: 'Tâche non trouvée' });
        
        if (req.body.status) {
            task.status = req.body.status;
        }
        const updatedTask = await task.save();
        res.json(updatedTask);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// 4. حذف مهمة (DELETE /api/tasks/:id)
router.delete('/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) return res.status(404).json({ message: 'Tâche non trouvée' });
        res.json({ message: 'Tâche supprimée avec succès' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;