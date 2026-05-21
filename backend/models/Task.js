const mongoose = require('mongoose');

 feature/taches
// مخطط المهمة المطلوب في الميزة رقم 3
       
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
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }
}, { timestamps: true }
);
develop

module.exports = mongoose.model('Task', taskSchema);