const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  titre: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    default: '' 
  },
  priorite: { 
    type: String, 
    enum: ['basse', 'moyenne', 'haute'], 
    required: true 
  },
  statut: { 
    type: String, 
    enum: ['à faire', 'en cours', 'terminé'], 
    required: true,
    default: 'à faire'
  },
  projet: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Project', 
    required: true 
  },
  assignedTo: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    default: null 
  }
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);