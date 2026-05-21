const express          = require('express');
const router           = express.Router();
const authMiddleware   = require('../middleware/authMiddleware');
const { getDashboard } = require('../controllers/dashboardController');

router.use(authMiddleware);

// GET /api/dashboard
router.get('/', getDashboard);

module.exports = router;