const mongoose = require('mongoose');

const eyelinersSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Eyeliner name is required'],
    trim: true
  },
  brand: {
    type: String,
    trim: true
  },
  type: {
    type: String,
    enum: ['pencil', 'liquid', 'gel', 'cream', 'marker', 'kohl']
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
  finish: {
    type: String,
    enum: ['matte', 'shimmer', 'metallic', 'glitter', 'satin'],
    default: 'matte'
  },
  waterproof: {
    type: Boolean,
    default: false
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
  collection: 'eyeliners' // ensure collection name matches Compass
});

// Index for search
eyelinersSchema.index({ name: 'text', brand: 'text', type: 'text', color: 'text', description: 'text' });

module.exports = mongoose.model('Eyeliners', eyelinersSchema);
