const mongoose = require('mongoose');

const premiumSubscriptionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  plan: {
    type: String,
    enum: ['1-month', '3-months', '6-months', '1-year'],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  duration: {
    type: Number, // Duration in days
    required: true
  },
  paymentMethod: {
    type: String,
    default: 'QR Code'
  },
  paymentProof: {
    type: String, // URL to uploaded payment screenshot
    required: true
  },
  transactionId: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewedAt: {
    type: Date
  },
  rejectionReason: {
    type: String
  },
  notes: {
    type: String
  }
}, {
  timestamps: true
});

// Index for efficient queries
premiumSubscriptionSchema.index({ user: 1, createdAt: -1 });
premiumSubscriptionSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('PremiumSubscription', premiumSubscriptionSchema);

