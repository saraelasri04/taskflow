require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const taskRoutes = require('./routes/taskRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const authRoutes = require('./routes/auth');
const authMiddleware = require('./middleware/authMiddleware');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', taskRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/auth', authRoutes);

// Route protégée
app.get('/api/profile', authMiddleware, (req, res) => {
  res.json({
    message: `Bonjour utilisateur ${req.user.id}`,
  });
});

// Route test
app.get('/', (req, res) => {
  res.send('Server TaskFlow fonctionne 🚀');
});

// MongoDB connection
const PORT = process.env.PORT || 5000;

const MONGO_URI =
  process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/taskflow';

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connecté');

    app.listen(PORT, () => {
      console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Erreur MongoDB :', err.message);
  });
