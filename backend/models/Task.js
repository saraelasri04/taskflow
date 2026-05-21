const mongoose = require('mongoose');

 feature/taches
// مخطط المهمة المطلوب في الميزة رقم 3
const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true // العنوان إجباري
    },
    priority: {
        type: String,
        enum: ['basse', 'moyenne', 'haute'], // التحقق من الأولويات المطلوبة
        required: true
    },
    status: {
        type: String,
        enum: ['à faire', 'en cours', 'terminé'], // التحقق من الحالات المطلوبة
        default: 'à faire'
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project', // مرجع يربط المهمة بالمشروع الأب
        required: true
    }
}, { timestamps: true });
const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Le titre de la tâche est obligatoire'],
      trim: true,
    },
    description: { type: String, trim: true },
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
develop

module.exports = mongoose.model('Task', taskSchema);