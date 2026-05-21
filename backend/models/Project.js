const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Le titre du projet est obligatoire'],
      trim: true,
      maxlength: [100, 'Le titre ne peut pas dépasser 100 caractères'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'La description ne peut pas dépasser 500 caractères'],
    },
    deadline: { type: Date, default: null },
    status: {
      type: String,
      enum: {
        values: ['actif', 'en pause', 'archivé'],
        message: 'Le statut doit être : actif, en pause ou archivé',
      },
      default: 'actif',
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Chaque projet doit avoir un propriétaire'],
    },
  },
  { timestamps: true }
);

// ─── Cascade delete ────────────────────────────────────────────────────────────
projectSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
  try {
    await mongoose.model('Task').deleteMany({ project: this._id });
    next();
  } catch (err) {
    next(err);
  }
});

projectSchema.pre('findOneAndDelete', async function (next) {
  try {
    const doc = await this.model.findOne(this.getFilter());
    if (doc) {
      await mongoose.model('Task').deleteMany({ project: doc._id });
    }
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model('Project', projectSchema);