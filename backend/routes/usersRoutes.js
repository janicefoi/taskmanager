const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Import user model
const User = require('../models/User');

// GET users route to fetch all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({ users });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});
// User signup route
router.post('/signup', async (req, res) => {
    const { name, email, password, role } = req.body;
  
    try {
      // Check if user already exists by email or name
      const existingUserByEmail = await User.findOne({ email });
      const existingUserByName = await User.findOne({ name });
      
      if (existingUserByEmail || existingUserByName) {
        return res.status(400).json({ error: 'User already exists' });
      }
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create a new user
      const newUser = new User({
        name,
        email,
        password: hashedPassword,
        role
      });
  
      // Save the user to the database
      await newUser.save();
  
      res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
      console.error('Error signing up user:', error);
      res.status(500).json({ error: 'Internal server error', details: error.message });
    }
  });
router.post('/login', async (req, res) => {
    const { email, password, role } = req.body;

    try {
        // Find user by email
        const user = await User.findOne({ email });

        // Log the user's role
        console.log('User role:', user.role);

        // Check if user exists
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Check if password is correct
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        // Check if user role matches
        if (user.role !== role) {
            return res.status(401).json({ error: 'Unauthorized access' });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user._id, email: user.email }, 'your-secret-key', { expiresIn: '1h' });

        // Send token and user ID in response
        res.status(200).json({ token, userId: user._id });
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
});

module.exports = router;
