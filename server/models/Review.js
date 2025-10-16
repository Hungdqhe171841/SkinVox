const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'productType',
    required: true
  },
  productType: {
    type: String,
    required: true,
    enum: ['Lipstick', 'Eyeshadow', 'Blush', 'Eyebrows', 'Eyeliner']
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5']
  },
  title: {
    type: String,
    required: [true, 'Review title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  content: {
    type: String,
    required: [true, 'Review content is required'],
    minlength: [10, 'Review must be at least 10 characters'],
    maxlength: [1000, 'Review cannot exceed 1000 characters']
  },
  images: [{
    type: String
  }],
  isVerified: {
    type: Boolean,
    default: false
  },
  isApproved: {
    type: Boolean,
    default: true
  },
  isReported: {
    type: Boolean,
    default: false
  },
  reportReason: {
    type: String,
    enum: ['spam', 'inappropriate', 'fake', 'offensive', 'other']
  },
  reportDescription: {
    type: String,
    maxlength: [500, 'Report description cannot exceed 500 characters']
  },
  helpful: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  notHelpful: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  replies: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    content: {
      type: String,
      required: true,
      maxlength: [500, 'Reply cannot exceed 500 characters']
    },
    isApproved: {
      type: Boolean,
      default: true
    }
  }, { timestamps: true }]
}, {
  timestamps: true
});

// Index for efficient queries
reviewSchema.index({ product: 1, productType: 1 });
reviewSchema.index({ user: 1 });
reviewSchema.index({ rating: 1 });
reviewSchema.index({ isApproved: 1 });
reviewSchema.index({ isReported: 1 });

// Virtual for helpful score
reviewSchema.virtual('helpfulScore').get(function() {
  return this.helpful.length - this.notHelpful.length;
});

// Ensure user can only review a product once
reviewSchema.index({ user: 1, product: 1, productType: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);


