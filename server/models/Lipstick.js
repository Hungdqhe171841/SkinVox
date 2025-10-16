const mongoose = require('mongoose');

const lipstickSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Lipstick name is required'],
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
  category: {
    type: String,
    enum: ['matte', 'glossy', 'satin', 'cream', 'liquid'],
    default: 'matte'
  },
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
  collection: 'lipsticks'
});

// Index for search
lipstickSchema.index({ name: 'text', brand: 'text', color: 'text', description: 'text' });

module.exports = mongoose.model('Lipstick', lipstickSchema);
