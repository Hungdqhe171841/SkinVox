const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    console.log('🔐 Server Debug - JWT_SECRET:', process.env.JWT_SECRET ? 'Present' : 'Missing');
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(400).json({
        message: 'User already exists with this email or username'
      });
    }

    // Create new user
    const user = new User({
      username,
      email,
      password
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      message: 'Registration failed',
      error: error.message
    });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    console.log('🔐 Server Debug - Login request received');
    console.log('🔐 Server Debug - Request body:', req.body);
    
    const { email, password } = req.body;

    console.log('🔍 Server Debug - Looking for user with email:', email);
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      console.log('❌ Server Debug - User not found');
      return res.status(401).json({
        message: 'Invalid credentials'
      });
    }

    console.log('👤 Server Debug - User found:', {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role
    });

    console.log('🔑 Server Debug - Checking password...');
    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log('❌ Server Debug - Password mismatch');
      return res.status(401).json({
        message: 'Invalid credentials'
      });
    }

    console.log('✅ Server Debug - Password match, updating last login');
    // Update last login
    user.lastLogin = new Date();
    await user.save();

    console.log('🎫 Server Debug - Generating JWT token...');
    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    console.log('✅ Server Debug - Login successful, sending response');
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('❌ Server Debug - Login error:', error);
    res.status(500).json({
      message: 'Login failed',
      error: error.message
    });
  }
});

// Get current user
router.get('/me', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        avatar: user.avatar
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
});

module.exports = router;
