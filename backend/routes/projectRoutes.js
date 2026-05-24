const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/authMiddleware');
const {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} = require('../controllers/projectController');

const Project = require('../models/Project');
const User = require('../models/User');

router.use(authMiddleware);

router.route('/')
  .get(getProjects)
  .post(createProject);

router.route('/:id')
  .get(getProjectById)
  .put(updateProject)
  .delete(deleteProject);

router.post('/:id/members', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Projet non trouvé' });
    if (project.owner.toString() !== req.user.id)
      return res.status(403).json({ message: 'Accès refusé' });

    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });

    if (project.members.includes(user._id))
      return res.status(400).json({ message: 'Membre déjà ajouté' });

    project.members.push(user._id);
    await project.save();
    res.json({ message: 'Membre ajouté', project });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:id/members/:userId', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Projet non trouvé' });
    if (project.owner.toString() !== req.user.id)
      return res.status(403).json({ message: 'Accès refusé' });

    project.members = project.members.filter(
      m => m.toString() !== req.params.userId
    );
    await project.save();
    res.json({ message: 'Membre retiré', project });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;