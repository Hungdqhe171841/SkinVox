const mongoose = require('mongoose');

const eyeshadowSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Eyeshadow name is required'],
    trim: true
  },
  brand: {
    type: String,
    trim: true
  },
  palette: {
    type: String,
    trim: true
  },
  colors: [{
    name: String,
    hex: String,
    finish: {
      type: String,
      enum: ['matte', 'shimmer', 'metallic', 'satin', 'glitter']
    }
  }],
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
  collection: 'eyeshadows'
});

// Index for search
eyeshadowSchema.index({ name: 'text', brand: 'text', palette: 'text', description: 'text' });

module.exports = mongoose.model('Eyeshadow', eyeshadowSchema);
