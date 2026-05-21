require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');

const app = express();

app.use(cors());
app.use(express.json());

// Routes publiques
app.use('/api/auth', authRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connecté');
    app.listen(process.env.PORT, () =>
      console.log(`🚀 Serveur sur http://localhost:${process.env.PORT}`)
    );
  })
  .catch(err => console.error('❌ Connexion MongoDB échouée :', err));