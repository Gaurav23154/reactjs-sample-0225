// backend/routes/tasks.js
import express from 'express';
import Task from '../models/Task.js';
import authMiddleware from '../middleware/authMiddleware.js'; // Import the middleware

const router = express.Router();

// Get all tasks for the authenticated user
router.get('/', authMiddleware, async (req, res) => { // Apply middleware
  try {
    // Filter tasks by the authenticated user's ID
    const tasks = await Task.find({ user: req.user.userId });
    res.status(200).json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ message: 'Server error fetching tasks.' });
  }
});

// Create a new task
router.post('/', authMiddleware, async (req, res) => { // Apply middleware
  try {
    const { title, description, status } = req.body;
    const userId = req.user.userId; // Get user ID from authenticated user

    const newTask = new Task({ title, description, status, user: userId });

    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ message: 'Server error creating task.' });
  }
});

// Update a task
router.put('/:id', authMiddleware, async (req, res) => { // Apply middleware
  try {
    const taskId = req.params.id;
    const userId = req.user.userId; // Get user ID from authenticated user
    const { title, description, status } = req.body;

    // Find and update the task, ensuring it belongs to the authenticated user
    const updatedTask = await Task.findOneAndUpdate(
      { _id: taskId, user: userId },
      { title, description, status },
      { new: true } // Return the updated document
    );

    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found or you do not have permission to update it.' });
    }

    res.status(200).json(updatedTask);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ message: 'Server error updating task.' });
  }
});

// Delete a task
router.delete('/:id', authMiddleware, async (req, res) => { // Apply middleware
  try {
    const taskId = req.params.id;
    const userId = req.user.userId; // Get user ID from authenticated user

    // Find and delete the task, ensuring it belongs to the authenticated user
    const deletedTask = await Task.findOneAndDelete({ _id: taskId, user: userId });

    if (!deletedTask) {
      return res.status(404).json({ message: 'Task not found or you do not have permission to delete it.' });
    }

    res.status(200).json({ message: 'Task deleted successfully.' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ message: 'Server error deleting task.' });
  }
});

export default router; 