require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const authMiddleware = require('./middleware/authMiddleware');

const app = express();

app.use(cors());
app.use(express.json());

// ✅ Routes publiques (register + login)
app.use('/api/auth', authRoutes);

// ✅ Route protégée — exemple
app.get('/api/profile', authMiddleware, (req, res) => {
  res.json({ message: `Bonjour, utilisateur ${req.user.id}` });
});

// Connexion MongoDB + démarrage serveur
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connecté');
    app.listen(process.env.PORT, () =>
      console.log(`🚀 Serveur sur http://localhost:${process.env.PORT}`)
    );
  })
  .catch(err => console.error('❌ Erreur MongoDB :', err));