// backend/index.js
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRouter from './routes/auth.js';
import tasksRouter from './routes/tasks.js';

dotenv.config(); // Load environment variables from .env file

const app = express();
const port = process.env.PORT || 5000; // Use port from environment variable or default to 5000

// Middleware
app.use(cors()); // Allows cross-origin requests
app.use(express.json()); // Parses incoming requests with JSON payloads

// Routes
app.use('/api/auth', authRouter);
app.use('/api/tasks', tasksRouter);

// Database connection
mongoose.connect(process.env.MONGODB_URI, {
  // useNewUrlParser: true, // These options are deprecated in recent Mongoose versions
  // useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// Basic route for testing
app.get('/', (req, res) => {
  res.send('Task Board Backend is running!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 