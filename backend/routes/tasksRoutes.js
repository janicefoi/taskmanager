const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

// POST route to create a new task
router.post('/create', async (req, res) => {
  const { title, description, assignedEmployees, deadline } = req.body;
  
  try {
    const currentDate = new Date(); 
    const newTask = new Task({
      title,
      description,
      assignedEmployees,
      deadline,
      date: currentDate 
    });
  
    await newTask.save();
  
    res.status(201).json({ message: 'Task created successfully' });
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

// GET route to fetch all tasks
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).json({ tasks });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

// GET route to fetch tasks assigned to a specific user
router.get('/user/:userId', async (req, res) => {
  const userId = req.params.userId;
  try {
    const tasks = await Task.find({ assignedEmployees: userId });
    res.status(200).json({ tasks });
  } catch (error) {
    console.error('Error fetching tasks for user:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});
// PUT route to mark a task as completed
router.put('/:taskId/complete', async (req, res) => {
  try {
    const taskId = req.params.taskId;
    const { completedAt } = req.body; 
    
    // Update the task to mark it as completed and set the completion date
    const updatedTask = await Task.findByIdAndUpdate(taskId, { completed: true, completedAt }, { new: true });
    
    res.status(200).json({ message: 'Task marked as completed', task: updatedTask });
  } catch (error) {
    console.error('Error marking task as completed:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});


module.exports = router;
