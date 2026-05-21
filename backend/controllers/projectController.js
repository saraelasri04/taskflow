const Project = require('../models/Project');

// GET /api/projects?page=1&limit=10
const getProjects = async (req, res) => {
  try {
    const page  = Math.max(1, parseInt(req.query.page)  || 1);
    const limit = Math.min(50, parseInt(req.query.limit) || 10);
    const skip  = (page - 1) * limit;
    const filter = { owner: req.user.id };

    const [projects, total] = await Promise.all([
      Project.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Project.countDocuments(filter),
    ]);

    res.json({
      data: projects,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// GET /api/projects/:id
const getProjectById = async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      owner: req.user.id,
    });
    if (!project) {
      return res.status(404).json({ message: 'Projet introuvable' });
    }
    res.json({ data: project });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// POST /api/projects
const createProject = async (req, res) => {
  try {
    const { title, description, deadline, status } = req.body;
    const project = await Project.create({
      title,
      description,
      deadline: deadline || null,
      status:   status   || 'actif',
      owner:    req.user.id,
    });
    res.status(201).json({ message: 'Projet créé avec succès', data: project });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ message: 'Données invalides', errors: messages });
    }
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// PUT /api/projects/:id
const updateProject = async (req, res) => {
  try {
    const { title, description, deadline, status } = req.body;
    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, owner: req.user.id },
      { title, description, deadline, status },
      { new: true, runValidators: true }
    );
    if (!project) {
      return res.status(404).json({ message: 'Projet introuvable ou accès refusé' });
    }
    res.json({ message: 'Projet mis à jour', data: project });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ message: 'Données invalides', errors: messages });
    }
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// DELETE /api/projects/:id
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      owner: req.user.id,
    });
    if (!project) {
      return res.status(404).json({ message: 'Projet introuvable ou accès refusé' });
    }
    await project.deleteOne(); // déclenche le hook pre('deleteOne')
    res.json({ message: 'Projet et ses tâches supprimés avec succès' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

module.exports = { getProjects, getProjectById, createProject, updateProject, deleteProject };