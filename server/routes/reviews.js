const express = require('express');
const router = express.Router();
const WebsiteReview = require('../models/WebsiteReview');
const { auth } = require('../middleware/auth');

// @route   GET /api/reviews
// @desc    Get all approved website reviews
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { limit = 10, featured = false } = req.query;
    
    let query = { isApproved: true };
    if (featured === 'true') {
      query.isFeatured = true;
    }
    
    const reviews = await WebsiteReview.find(query)
      .populate('user', 'username')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));
    
    res.json({ success: true, reviews });
  } catch (error) {
    console.error('❌ Reviews Debug - Get reviews error:', error);
    res.status(500).json({ message: 'Error fetching reviews', error: error.message });
  }
});

// @route   GET /api/reviews/stats
// @desc    Get website review statistics
// @access  Public
router.get('/stats', async (req, res) => {
  try {
    const reviews = await WebsiteReview.find({ isApproved: true });
    
    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0 
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews 
      : 0;
    
    // Calculate rating distribution
    const ratingDistribution = {
      5: reviews.filter(r => r.rating === 5).length,
      4: reviews.filter(r => r.rating === 4).length,
      3: reviews.filter(r => r.rating === 3).length,
      2: reviews.filter(r => r.rating === 2).length,
      1: reviews.filter(r => r.rating === 1).length
    };
    
    // Calculate percentages
    const ratingPercentages = {};
    Object.keys(ratingDistribution).forEach(star => {
      ratingPercentages[star] = totalReviews > 0 
        ? Math.round((ratingDistribution[star] / totalReviews) * 100) 
        : 0;
    });
    
    res.json({
      success: true,
      stats: {
        totalReviews,
        averageRating: Math.round(averageRating * 10) / 10,
        ratingDistribution,
        ratingPercentages
      }
    });
  } catch (error) {
    console.error('❌ Reviews Debug - Get stats error:', error);
    res.status(500).json({ message: 'Error fetching stats', error: error.message });
  }
});

// @route   POST /api/reviews
// @desc    Create a new website review
// @access  Private (requires authentication)
router.post('/', auth, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    
    // Validate input
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }
    
    if (!comment || comment.trim().length < 10) {
      return res.status(400).json({ message: 'Comment must be at least 10 characters' });
    }
    
    // Check if user already reviewed
    const existingReview = await WebsiteReview.findOne({ user: req.user.id });
    if (existingReview) {
      return res.status(400).json({ message: 'You have already submitted a review. You can update it instead.' });
    }
    
    // Create new review
    const newReview = new WebsiteReview({
      user: req.user.id,
      username: req.user.username,
      rating,
      comment: comment.trim()
    });
    
    await newReview.save();
    await newReview.populate('user', 'username');
    
    res.status(201).json({ 
      success: true, 
      message: 'Review submitted successfully',
      review: newReview
    });
  } catch (error) {
    console.error('❌ Reviews Debug - Create review error:', error);
    res.status(500).json({ message: 'Error creating review', error: error.message });
  }
});

// @route   PUT /api/reviews/:id
// @desc    Update user's review
// @access  Private (user can only update their own)
router.put('/:id', auth, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    
    const review = await WebsiteReview.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    
    // Check if user owns the review
    if (review.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this review' });
    }
    
    if (rating) review.rating = rating;
    if (comment) review.comment = comment.trim();
    
    await review.save();
    await review.populate('user', 'username');
    
    res.json({ 
      success: true, 
      message: 'Review updated successfully',
      review 
    });
  } catch (error) {
    console.error('❌ Reviews Debug - Update review error:', error);
    res.status(500).json({ message: 'Error updating review', error: error.message });
  }
});

// @route   DELETE /api/reviews/:id
// @desc    Delete user's review
// @access  Private (user can only delete their own or admin)
router.delete('/:id', auth, async (req, res) => {
  try {
    const review = await WebsiteReview.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    
    // Check if user owns the review or is admin
    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this review' });
    }
    
    await WebsiteReview.findByIdAndDelete(req.params.id);
    
    res.json({ 
      success: true, 
      message: 'Review deleted successfully' 
    });
  } catch (error) {
    console.error('❌ Reviews Debug - Delete review error:', error);
    res.status(500).json({ message: 'Error deleting review', error: error.message });
  }
});

module.exports = router;

