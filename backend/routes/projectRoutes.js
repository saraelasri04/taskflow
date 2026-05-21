const express = require('express');
const router  = express.Router();

const authMiddleware = require('../middleware/authMiddleware');
const {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} = require('../controllers/projectController');

router.use(authMiddleware); // toutes les routes protégées

router.route('/')
  .get(getProjects)
  .post(createProject);

router.route('/:id')
  .get(getProjectById)
  .put(updateProject)
  .delete(deleteProject);

module.exports = router;