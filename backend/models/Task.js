const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    assignedEmployees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    date: { type: Date },
    deadline: { type: Date },
    completed: { type: Boolean, default: false }, 
    completedAt: { type: Date } 
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
