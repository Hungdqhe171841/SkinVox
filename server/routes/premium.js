const express = require('express');
const router = express.Router();
const PremiumSubscription = require('../models/PremiumSubscription');
const User = require('../models/User');
const { auth, adminAuth } = require('../middleware/auth');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

// Configure Cloudinary
if (process.env.CLOUDINARY_CLOUD_NAME) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
}

// Multer configuration for memory storage
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Upload to Cloudinary helper
const uploadToCloudinary = (buffer, folder = 'premium-payments') => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folder,
        resource_type: 'image'
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result.secure_url);
        }
      }
    );
    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};

// Premium plan pricing
const PREMIUM_PLANS = {
  '1-month': { duration: 30, amount: 99000 },
  '3-months': { duration: 90, amount: 249000 },
  '6-months': { duration: 180, amount: 449000 },
  '1-year': { duration: 365, amount: 799000 }
};

// @route   POST /api/premium/subscribe
// @desc    Create a new premium subscription request
// @access  Private
router.post('/subscribe', auth, upload.single('paymentProof'), async (req, res) => {
  try {
    const { plan, transactionId, notes } = req.body;
    
    console.log('💎 Premium Debug - Subscribe request:', { plan, userId: req.user.id });
    
    // Validate plan
    if (!PREMIUM_PLANS[plan]) {
      return res.status(400).json({ message: 'Invalid premium plan' });
    }
    
    // Check if payment proof was uploaded
    if (!req.file) {
      return res.status(400).json({ message: 'Payment proof image is required' });
    }
    
    // Upload payment proof to Cloudinary
    let paymentProofUrl;
    try {
      paymentProofUrl = await uploadToCloudinary(req.file.buffer, 'premium-payments');
      console.log('💎 Premium Debug - Payment proof uploaded:', paymentProofUrl);
    } catch (error) {
      console.error('❌ Premium Debug - Cloudinary upload error:', error);
      return res.status(500).json({ message: 'Failed to upload payment proof', error: error.message });
    }
    
    // Get user info
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if user already has a pending subscription
    const pendingSubscription = await PremiumSubscription.findOne({
      user: req.user.id,
      status: 'pending'
    });
    
    if (pendingSubscription) {
      return res.status(400).json({ 
        message: 'You already have a pending subscription request. Please wait for admin approval.' 
      });
    }
    
    // Create subscription request
    const planDetails = PREMIUM_PLANS[plan];
    const subscription = new PremiumSubscription({
      user: req.user.id,
      username: user.username,
      email: user.email,
      plan,
      amount: planDetails.amount,
      duration: planDetails.duration,
      paymentProof: paymentProofUrl,
      transactionId: transactionId || '',
      notes: notes || '',
      status: 'pending'
    });
    
    await subscription.save();
    
    console.log('💎 Premium Debug - Subscription created:', subscription._id);
    
    res.status(201).json({
      success: true,
      message: 'Premium subscription request submitted successfully. Please wait for admin approval.',
      subscription: {
        _id: subscription._id,
        plan: subscription.plan,
        amount: subscription.amount,
        status: subscription.status,
        createdAt: subscription.createdAt
      }
    });
  } catch (error) {
    console.error('❌ Premium Debug - Subscribe error:', error);
    res.status(500).json({ message: 'Error creating subscription', error: error.message });
  }
});

// @route   GET /api/premium/my-subscriptions
// @desc    Get current user's subscriptions
// @access  Private
router.get('/my-subscriptions', auth, async (req, res) => {
  try {
    const subscriptions = await PremiumSubscription.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .populate('reviewedBy', 'username');
    
    res.json({ success: true, subscriptions });
  } catch (error) {
    console.error('❌ Premium Debug - Get my subscriptions error:', error);
    res.status(500).json({ message: 'Error fetching subscriptions', error: error.message });
  }
});

// @route   GET /api/premium/status
// @desc    Get current user's premium status
// @access  Private
router.get('/status', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('isPremium premiumExpiresAt premiumActivatedAt');
    
    // Check if premium has expired
    if (user.isPremium && user.premiumExpiresAt && new Date(user.premiumExpiresAt) < new Date()) {
      user.isPremium = false;
      await user.save();
    }
    
    res.json({
      success: true,
      isPremium: user.isPremium,
      premiumExpiresAt: user.premiumExpiresAt,
      premiumActivatedAt: user.premiumActivatedAt,
      daysRemaining: user.isPremium && user.premiumExpiresAt 
        ? Math.ceil((new Date(user.premiumExpiresAt) - new Date()) / (1000 * 60 * 60 * 24))
        : 0
    });
  } catch (error) {
    console.error('❌ Premium Debug - Get status error:', error);
    res.status(500).json({ message: 'Error fetching premium status', error: error.message });
  }
});

// @route   GET /api/premium/plans
// @desc    Get available premium plans
// @access  Public
router.get('/plans', (req, res) => {
  const plans = Object.entries(PREMIUM_PLANS).map(([key, value]) => ({
    id: key,
    name: key.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
    duration: value.duration,
    amount: value.amount,
    amountFormatted: new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND' 
    }).format(value.amount)
  }));
  
  res.json({ success: true, plans });
});

// ==================== ADMIN ROUTES ====================

// @route   GET /api/premium/admin/subscriptions
// @desc    Get all subscription requests (admin)
// @access  Admin
router.get('/admin/subscriptions', adminAuth, async (req, res) => {
  try {
    const { status = 'all', page = 1, limit = 20 } = req.query;
    
    let query = {};
    if (status !== 'all') {
      query.status = status;
    }
    
    const subscriptions = await PremiumSubscription.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('user', 'username email avatar')
      .populate('reviewedBy', 'username');
    
    const total = await PremiumSubscription.countDocuments(query);
    
    res.json({
      success: true,
      subscriptions,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('❌ Premium Debug - Admin get subscriptions error:', error);
    res.status(500).json({ message: 'Error fetching subscriptions', error: error.message });
  }
});

// @route   POST /api/premium/admin/approve/:id
// @desc    Approve a subscription request
// @access  Admin
router.post('/admin/approve/:id', adminAuth, async (req, res) => {
  try {
    const subscription = await PremiumSubscription.findById(req.params.id);
    
    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }
    
    if (subscription.status !== 'pending') {
      return res.status(400).json({ message: 'Subscription already processed' });
    }
    
    // Update subscription status
    subscription.status = 'approved';
    subscription.reviewedBy = req.user.id;
    subscription.reviewedAt = new Date();
    await subscription.save();
    
    // Update user premium status
    const user = await User.findById(subscription.user);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const now = new Date();
    const expiresAt = new Date(now.getTime() + subscription.duration * 24 * 60 * 60 * 1000);
    
    user.isPremium = true;
    user.premiumActivatedAt = now;
    user.premiumExpiresAt = expiresAt;
    await user.save();
    
    console.log('💎 Premium Debug - Subscription approved:', subscription._id);
    console.log('💎 Premium Debug - User premium activated:', user._id);
    
    res.json({
      success: true,
      message: 'Subscription approved successfully',
      subscription,
      user: {
        _id: user._id,
        username: user.username,
        isPremium: user.isPremium,
        premiumExpiresAt: user.premiumExpiresAt
      }
    });
  } catch (error) {
    console.error('❌ Premium Debug - Approve error:', error);
    res.status(500).json({ message: 'Error approving subscription', error: error.message });
  }
});

// @route   POST /api/premium/admin/reject/:id
// @desc    Reject a subscription request
// @access  Admin
router.post('/admin/reject/:id', adminAuth, async (req, res) => {
  try {
    const { reason } = req.body;
    
    const subscription = await PremiumSubscription.findById(req.params.id);
    
    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }
    
    if (subscription.status !== 'pending') {
      return res.status(400).json({ message: 'Subscription already processed' });
    }
    
    // Update subscription status
    subscription.status = 'rejected';
    subscription.reviewedBy = req.user.id;
    subscription.reviewedAt = new Date();
    subscription.rejectionReason = reason || 'No reason provided';
    await subscription.save();
    
    console.log('💎 Premium Debug - Subscription rejected:', subscription._id);
    
    res.json({
      success: true,
      message: 'Subscription rejected',
      subscription
    });
  } catch (error) {
    console.error('❌ Premium Debug - Reject error:', error);
    res.status(500).json({ message: 'Error rejecting subscription', error: error.message });
  }
});

// @route   GET /api/premium/admin/stats
// @desc    Get premium subscription statistics
// @access  Admin
router.get('/admin/stats', adminAuth, async (req, res) => {
  try {
    const totalSubscriptions = await PremiumSubscription.countDocuments();
    const pendingCount = await PremiumSubscription.countDocuments({ status: 'pending' });
    const approvedCount = await PremiumSubscription.countDocuments({ status: 'approved' });
    const rejectedCount = await PremiumSubscription.countDocuments({ status: 'rejected' });
    
    const activePremiumUsers = await User.countDocuments({ 
      isPremium: true,
      premiumExpiresAt: { $gt: new Date() }
    });
    
    const totalRevenue = await PremiumSubscription.aggregate([
      { $match: { status: 'approved' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    
    res.json({
      success: true,
      stats: {
        totalSubscriptions,
        pendingCount,
        approvedCount,
        rejectedCount,
        activePremiumUsers,
        totalRevenue: totalRevenue[0]?.total || 0
      }
    });
  } catch (error) {
    console.error('❌ Premium Debug - Stats error:', error);
    res.status(500).json({ message: 'Error fetching stats', error: error.message });
  }
});

module.exports = router;

