const express = require('express');
const router = express.Router();
const { auth, adminAuth } = require('../middleware/auth');
const User = require('../models/User');
const Blog = require('../models/Blog');
const Review = require('../models/Review');
const Category = require('../models/Category');
const Lipstick = require('../models/Lipstick');
const Eyeshadow = require('../models/Eyeshadow');
const Blush = require('../models/Blush');
const Eyebrows = require('../models/Eyebrows');
const Eyeliner = require('../models/Eyeliners');

// Apply auth and admin middleware to all routes
router.use(auth, adminAuth);

// ==================== DASHBOARD STATISTICS ====================
// @route   GET /api/admin/dashboard
// @desc    Get dashboard statistics
// @access  Private (Admin only)
router.get('/dashboard', async (req, res) => {
  try {
    console.log('📊 Admin Debug - Fetching dashboard statistics...');
    
    // Get total counts
    const totalUsers = await User.countDocuments();
    const totalBlogs = await Blog.countDocuments();
    const totalReviews = await Review.countDocuments();
    const totalCategories = await Category.countDocuments();
    
    // Get product counts by category
    const lipstickCount = await Lipstick.countDocuments();
    const eyeshadowCount = await Eyeshadow.countDocuments();
    const blushCount = await Blush.countDocuments();
    const eyebrowCount = await Eyebrows.countDocuments();
    const eyelinerCount = await Eyeliner.countDocuments();
    
    // Get recent activity
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('username email createdAt role');
    
    const recentBlogs = await Blog.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title status createdAt author')
      .populate('author', 'username');
    
    const recentReviews = await Review.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('rating title createdAt user productType')
      .populate('user', 'username');
    
    // Get user growth (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const newUsersThisMonth = await User.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });
    
    const stats = {
      overview: {
        totalUsers,
        totalBlogs,
        totalReviews,
        totalCategories,
        newUsersThisMonth
      },
      products: {
        lipsticks: lipstickCount,
        eyeshadows: eyeshadowCount,
        blush: blushCount,
        eyebrows: eyebrowCount,
        eyeliners: eyelinerCount,
        total: lipstickCount + eyeshadowCount + blushCount + eyebrowCount + eyelinerCount
      },
      recentActivity: {
        users: recentUsers,
        blogs: recentBlogs,
        reviews: recentReviews
      }
    };
    
    console.log('✅ Admin Debug - Dashboard statistics fetched successfully');
    res.json(stats);
  } catch (error) {
    console.error('❌ Admin Debug - Dashboard error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ==================== USER MANAGEMENT ====================
// @route   GET /api/admin/users
// @desc    Get all users with pagination
// @access  Private (Admin only)
router.get('/users', async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', role = '' } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    let query = {};
    
    // Search by username or email
    if (search) {
      query.$or = [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Filter by role
    if (role) {
      query.role = role;
    }
    
    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const totalUsers = await User.countDocuments(query);
    
    res.json({
      users,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalUsers / parseInt(limit)),
        totalUsers,
        hasNext: skip + users.length < totalUsers,
        hasPrev: parseInt(page) > 1
      }
    });
  } catch (error) {
    console.error('❌ Admin Debug - Get users error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   DELETE /api/admin/users/:id
// @desc    Delete user account
// @access  Private (Admin only)
router.delete('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Prevent admin from deleting themselves
    if (id === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }
    
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    await User.findByIdAndDelete(id);
    
    console.log(`✅ Admin Debug - User ${user.username} deleted by admin ${req.user.username}`);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('❌ Admin Debug - Delete user error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/admin/users/:id/status
// @desc    Toggle user active status
// @access  Private (Admin only)
router.put('/users/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;
    
    // Prevent admin from deactivating themselves
    if (id === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot change your own status' });
    }
    
    const user = await User.findByIdAndUpdate(
      id,
      { isActive },
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    console.log(`✅ Admin Debug - User ${user.username} status changed to ${isActive} by admin ${req.user.username}`);
    res.json({ message: 'User status updated', user });
  } catch (error) {
    console.error('❌ Admin Debug - Update user status error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ==================== BLOG MANAGEMENT ====================
// @route   GET /api/admin/blogs
// @desc    Get all blogs with pagination
// @access  Private (Admin only)
router.get('/blogs', async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', status = '' } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    let query = {};
    
    // Search by title or content
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Filter by status
    if (status) {
      query.status = status;
    }
    
    const blogs = await Blog.find(query)
      .populate('author', 'username email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const totalBlogs = await Blog.countDocuments(query);
    
    res.json({
      blogs,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalBlogs / parseInt(limit)),
        totalBlogs,
        hasNext: skip + blogs.length < totalBlogs,
        hasPrev: parseInt(page) > 1
      }
    });
  } catch (error) {
    console.error('❌ Admin Debug - Get blogs error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/admin/blogs
// @desc    Create new blog
// @access  Private (Admin only)
router.post('/blogs', async (req, res) => {
  try {
    const blogData = {
      ...req.body,
      author: req.user._id
    };
    
    const blog = new Blog(blogData);
    await blog.save();
    
    await blog.populate('author', 'username email');
    
    console.log(`✅ Admin Debug - Blog "${blog.title}" created by admin ${req.user.username}`);
    res.status(201).json({ message: 'Blog created successfully', blog });
  } catch (error) {
    console.error('❌ Admin Debug - Create blog error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/admin/blogs/:id
// @desc    Update blog
// @access  Private (Admin only)
router.put('/blogs/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const blog = await Blog.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    ).populate('author', 'username email');
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    
    console.log(`✅ Admin Debug - Blog "${blog.title}" updated by admin ${req.user.username}`);
    res.json({ message: 'Blog updated successfully', blog });
  } catch (error) {
    console.error('❌ Admin Debug - Update blog error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   DELETE /api/admin/blogs/:id
// @desc    Delete blog
// @access  Private (Admin only)
router.delete('/blogs/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const blog = await Blog.findByIdAndDelete(id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    
    console.log(`✅ Admin Debug - Blog "${blog.title}" deleted by admin ${req.user.username}`);
    res.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    console.error('❌ Admin Debug - Delete blog error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ==================== REVIEW MANAGEMENT ====================
// @route   GET /api/admin/reviews
// @desc    Get all reviews with pagination
// @access  Private (Admin only)
router.get('/reviews', async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', isReported = '', isApproved = '' } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    let query = {};
    
    // Search by title or content
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Filter by reported status
    if (isReported !== '') {
      query.isReported = isReported === 'true';
    }
    
    // Filter by approved status
    if (isApproved !== '') {
      query.isApproved = isApproved === 'true';
    }
    
    const reviews = await Review.find(query)
      .populate('user', 'username email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const totalReviews = await Review.countDocuments(query);
    
    res.json({
      reviews,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalReviews / parseInt(limit)),
        totalReviews,
        hasNext: skip + reviews.length < totalReviews,
        hasPrev: parseInt(page) > 1
      }
    });
  } catch (error) {
    console.error('❌ Admin Debug - Get reviews error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/admin/reviews/:id/approve
// @desc    Approve or disapprove review
// @access  Private (Admin only)
router.put('/reviews/:id/approve', async (req, res) => {
  try {
    const { id } = req.params;
    const { isApproved } = req.body;
    
    const review = await Review.findByIdAndUpdate(
      id,
      { isApproved },
      { new: true }
    ).populate('user', 'username email');
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    
    console.log(`✅ Admin Debug - Review ${id} ${isApproved ? 'approved' : 'disapproved'} by admin ${req.user.username}`);
    res.json({ message: `Review ${isApproved ? 'approved' : 'disapproved'} successfully`, review });
  } catch (error) {
    console.error('❌ Admin Debug - Approve review error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   DELETE /api/admin/reviews/:id
// @desc    Delete review
// @access  Private (Admin only)
router.delete('/reviews/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const review = await Review.findByIdAndDelete(id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    
    console.log(`✅ Admin Debug - Review ${id} deleted by admin ${req.user.username}`);
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('❌ Admin Debug - Delete review error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
