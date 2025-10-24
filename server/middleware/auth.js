const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to verify JWT token
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    if (!user.isActive) {
      return res.status(401).json({ message: 'Account is deactivated' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Middleware to check if user is admin
const adminAuth = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        message: 'Admin access required',
        userRole: req.user.role 
      });
    }

    next();
  } catch (error) {
    console.error('Admin auth middleware error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Middleware to check if user is admin or owner
const adminOrOwner = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Admin can access everything
    if (req.user.role === 'admin') {
      return next();
    }

    // Check if user is the owner of the resource
    const resourceUserId = req.params.userId || req.body.userId;
    if (resourceUserId && resourceUserId.toString() === req.user._id.toString()) {
      return next();
    }

    return res.status(403).json({ 
      message: 'Access denied. Admin or resource owner required',
      userRole: req.user.role 
    });
  } catch (error) {
    console.error('Admin or owner middleware error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  auth,
  adminAuth,
  adminOrOwner
};


