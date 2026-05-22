const mongoose = require('mongoose');
const Task     = require('../models/Task');
const Project  = require('../models/Project');

const getDashboard = async (req, res) => {
  try {
    const userId = req.user.id;
    const now    = new Date();

    // ─── Projets actifs ────────────────────────────────────────────────────────
    const activeProjects = await Project.countDocuments({
      owner:  userId,
      status: 'actif',
    });

    // ─── Métriques tâches via pipeline d'agrégation MongoDB ───────────────────
    const taskMetrics = await Task.aggregate([
      {
        $match: {
          assignedTo: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $group: {
          _id: null,
          totalAssigned: { $sum: 1 },
          totalDone: {
            $sum: { $cond: [{ $eq: ['$status', 'terminé'] }, 1, 0] },
          },
          totalLate: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $ne:  ['$status', 'terminé'] },
                    { $ne:  ['$deadline', null] },
                    { $lt:  ['$deadline', now] },
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
      },
    ]);

    // ─── Tâches en cours triées par priorité puis deadline ────────────────────
    const inProgressTasks = await Task.find({
      assignedTo: userId,
      status:     'en cours',
    })
      .populate('project', 'title')
      .sort({ deadline: 1 });

    // Tri priorité décroissante côté JS
    const PRIORITY_ORDER = { haute: 3, moyenne: 2, basse: 1 };
    inProgressTasks.sort(
      (a, b) => (PRIORITY_ORDER[b.priority] || 0) - (PRIORITY_ORDER[a.priority] || 0)
    );

    // ─── Réponse ───────────────────────────────────────────────────────────────
    const metrics = taskMetrics[0] || {
      totalAssigned: 0,
      totalDone:     0,
      totalLate:     0,
    };

    res.json({
      data: {
        activeProjects,
        totalAssigned:   metrics.totalAssigned,
        totalDone:       metrics.totalDone,
        totalLate:       metrics.totalLate,
        inProgressTasks,
      },
    });

  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

module.exports = { getDashboard };