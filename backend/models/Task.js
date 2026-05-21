require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const taskRoutes = require('./routes/taskRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const authRoutes = require('./routes/auth');
const authMiddleware = require('./middleware/authMiddleware');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', taskRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/auth', authRoutes);

app.get('/api/profile', authMiddleware, (req, res) => {
  res.json({ message: `Bonjour utilisateur ${req.user.id}` });
});

app.get('/', (req, res) => {
  res.send('Server TaskFlow fonctionne');
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/taskflow';

 feature/auth-assignment
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB connecte');
    app.listen(PORT, () => {
      console.log(`Server lance sur http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Erreur MongoDB :', err.message);
  });

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Le titre de la tâche est obligatoire'],
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    priority: {
      type: String,
      enum: ['basse', 'moyenne', 'haute'],
      default: 'moyenne',
    },

    status: {
      type: String,
      enum: ['à faire', 'en cours', 'terminée'],
      default: 'à faire',
    },

    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Task', taskSchema);
 develop
