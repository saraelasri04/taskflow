const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
 feature/sauvegarde
const auth = require('../middleware/authMiddleware'); // ← هاد السطر كان ناقص

// 1. جلب المهام مع فلترة
router.get('/tasks', auth, async (req, res) => {
  try {
    const filter = {};

    if (req.query.projet) filter.projet = req.query.projet;

    if (req.query.assignedTo === 'me') {
      filter.assignedTo = req.user.id;
    } else if (req.query.assignedTo) {
      filter.assignedTo = req.query.assignedTo;
    }

    const tasks = await Task.find(filter)
      .populate('assignedTo', 'nom email');

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// 2. إنشاء مهمة جديدة
router.post('/tasks', auth, async (req, res) => {
  try {
    const task = new Task({
      titre:       req.body.titre,
      description: req.body.description,
      priorite:    req.body.priorite,
      statut:      req.body.statut,
      projet:      req.body.projet,
    });

    const newTask = await task.save();
    res.status(201).json(newTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 3. Assigner une tâche à un membre
router.patch('/tasks/:id/assign', auth, async (req, res) => {
  try {
    const { userId } = req.body;

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { assignedTo: userId },
      { new: true }
    ).populate('assignedTo', 'nom email');

    res.json(task);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// 4. حذف مهمة
router.delete('/tasks/:id', auth, async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: 'Tâche non trouvée' });
    res.json({ message: 'Tâche supprimée avec succès' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }


router.get('/projects/:id/tasks', async (req, res) => {
 try {
   const { status, priority, assignedTo, search, page = 1, limit = 10 } = req.query;

   const filter = { project: req.params.id };

   if (status) filter.status = status;
   if (priority) filter.priority = priority;
   if (assignedTo) filter.assignedTo = assignedTo;
   if (search) {
     filter.$or = [
       { title: { $regex: search, $options: 'i' } },
       { description: { $regex: search, $options: 'i' } }
     ];
   }

   const skip = (Number(page) - 1) * Number(limit);
   const total = await Task.countDocuments(filter);
   const data = await Task.find(filter)
     .populate('assignedTo', 'name email')
     .skip(skip)
     .limit(Number(limit));

   res.json({
     data,
     total,
     page: Number(page),
     totalPages: Math.ceil(total / Number(limit))
   });

 } catch (err) {
   res.status(500).json({ message: err.message });
 }
});

router.post('/tasks', async (req, res) => {
 const task = new Task({
   title: req.body.title,
   description: req.body.description,
   priority: req.body.priority,
   status: req.body.status,
   project: req.body.project,
   assignedTo: req.body.assignedTo
 });
 try {
   const newTask = await task.save();
   res.status(201).json(newTask);
 } catch (err) {
   res.status(400).json({ message: err.message });
 }
});

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

router.delete('/tasks/:id', async (req, res) => {
 try {
   const task = await Task.findByIdAndDelete(req.params.id);
   if (!task) return res.status(404).json({ message: 'Task not found' });
   res.json({ message: 'Task deleted successfully' });
 } catch (err) {
   res.status(500).json({ message: err.message });
 }
 develop
});

module.exports = router;