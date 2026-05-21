const mongoose = require('mongoose');

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

module.exports = mongoose.model('Task', taskSchema);