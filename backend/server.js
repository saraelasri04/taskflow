feature/taches
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// استدعاء مسارات إدارة المهام التي قمت ببرمجتها أنت يا محمد
const taskRoutes = require('./routes/taskRoutes');

const app = express();

// الـ Middleware الأساسية لتمرير البيانات والـ CORS
app.use(cors());
app.use(express.json());

// تفعيل مسارات المهام الخاصة بك تحت المسار الرئيسي /api
app.use('/api', taskRoutes);

// مسار تجريبي للتأكد من عمل السيرفر
app.get('/', (req, res) => {
    res.send('Server TaskFlow fonctionne بنجاح! 🚀');
});

// الاتصال بقاعدة البيانات وتشغيل السيرفر
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:21017/taskflow';

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('Connecté à MongoDB avec succès ! 🍃');
        app.listen(PORT, () => console.log(`Serveur lancé sur le port ${PORT} ⚡`));
    })
    .catch(err => {
        console.error('Erreur de connexion à MongoDB:', err.message);
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
develop
