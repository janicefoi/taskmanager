const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const winston = require('winston');
const jwt = require('jsonwebtoken');

const app = express();

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log', level: 'error' })
  ]
});

mongoose.connect('mongodb://localhost/task-manager', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  logger.info('Connected to MongoDB');
})
.catch(err => {
  logger.error('Error connecting to MongoDB:', err);
});

app.use(cors());
app.use(express.json());

const usersRoutes = require('./routes/usersRoutes');
const tasksRoutes = require('./routes/tasksRoutes');

app.use('/api/users', usersRoutes);
app.use('/api/tasks', tasksRoutes);

// Middleware to handle JWT errors
app.use((err, req, res, next) => {
  if (err instanceof jwt.JsonWebTokenError) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next(err);
});

// Middleware for handling other errors
app.use((err, req, res, next) => {
  logger.error('Internal server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


