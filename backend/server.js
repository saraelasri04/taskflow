require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/taskRoutes');

const authMiddleware = require('./middleware/authMiddleware');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes auth
app.use('/api/auth', authRoutes);

// Routes tasks
app.use('/api', taskRoutes);

// Route protégée test
app.get('/api/profile', authMiddleware, (req, res) => {
  res.json({
    message: `Bonjour utilisateur ${req.user.id}`
  });
});

// Route test
app.get('/', (req, res) => {
  res.send('Server TaskFlow fonctionne 🚀');
});

// MongoDB + server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {

    console.log('✅ MongoDB connecté');

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`);
    });

  })
  .catch(err => {
    console.error('❌ Erreur MongoDB :', err.message);
  });