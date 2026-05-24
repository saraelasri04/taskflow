const express = require('express');
const router = express.Router();
const Activity = require('../models/Activity');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/projects/:id/activities', async (req, res) => {
  try {
    const activities = await Activity.find({ project: req.params.id })
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.json(activities);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;