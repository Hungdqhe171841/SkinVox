const mongoose = require('mongoose');

const eyebrowsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Eyebrow product name is required'],
    trim: true
  },
  brand: {
    type: String,
    required: [true, 'Brand is required'],
    trim: true
  },
  type: {
    type: String,
    enum: ['pencil', 'powder', 'gel', 'pomade', 'marker', 'tint']
  },
  color: {
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
  hairColor: [{
    type: String,
    enum: ['black', 'brown', 'blonde', 'red', 'gray', 'auburn']
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
  collection: 'eyebrows'
});

// Index for search
eyebrowsSchema.index({ name: 'text', brand: 'text', type: 'text', color: 'text', description: 'text' });

module.exports = mongoose.model('Eyebrows', eyebrowsSchema);
