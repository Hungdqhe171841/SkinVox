const mongoose = require('mongoose');

const blushSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Blush name is required'],
    trim: true
  },
  brand: {
    type: String,
    trim: true
  },
  color: {
    type: String,
    trim: true
  },
  shade: {
    type: String,
    trim: true
  },
  price: {
    type: Number,
    min: [0, 'Price cannot be negative']
  },
  description: {
    type: String,
    trim: true
  },
  image: {
    type: String,
    trim: true
  },
  type: {
    type: String,
    enum: ['powder', 'cream', 'liquid', 'gel'],
    default: 'powder'
  },
  skinTone: [{
    type: String,
    enum: ['fair', 'light', 'medium', 'tan', 'dark', 'deep']
  }],
  shades: {
    type: Map,
    of: String,
    default: {}
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  collection: 'blush' // match existing collection name in MongoDB Compass
});

// Index for search
blushSchema.index({ name: 'text', brand: 'text', color: 'text', description: 'text' });

module.exports = mongoose.model('Blush', blushSchema);
