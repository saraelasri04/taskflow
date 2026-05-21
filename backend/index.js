const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// استدعاء مسارات إدارة المهام الخاصة بك
const taskRoutes = require('./routes/taskRoutes');

const app = express();

// الـ Middleware الأساسية للبيانات والـ CORS
app.use(cors());
app.use(express.json());

// تفعيل مسارات المهام الخاصة بك تحت /api
app.use('/api', taskRoutes);

// مسار تجريبي للتأكد من عمل السيرفر
app.get('/', (req, res) => {
    res.send('Server TaskFlow fonctionne بنجاح! 🚀');
});

// الاتصال بقاعدة البيانات وتشغيل السيرفر
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/taskflow';

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('Connecté à MongoDB avec succès ! 🍃');
        app.listen(PORT, () => console.log(`Serveur lancé sur le port ${PORT} ⚡`));
    })
    .catch(err => {
        console.error('Erreur de connexion à MongoDB:', err.message);
    });