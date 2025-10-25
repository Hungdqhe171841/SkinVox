const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Blog title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  content: {
    type: String,
    required: [true, 'Blog content is required']
  },
  description: {
    type: String,
    trim: true
  },
  images: [{
    type: String
  }],
  category: {
    type: String,
    required: [true, 'Blog category is required'],
    // Categories: Main categories (Skincare, Makeup) or Subcategories
    // Subcategories: "Chăm sóc da", "Điều trị da", "Review & So sánh sản phẩm", 
    //                "Makeup 101 (nền tảng)", "Eyes Makeup", "Face Makeup", "Lip Makeup", "Makeup Tips"
  },
  formatType: {
    type: Number,
    default: 1
  },
  affiliateLinks: [{
    productName: {
      type: String
    },
    productUrl: {
      type: String
    },
    note: {
      type: String
    }
  }],
  tags: [{
    type: String,
    trim: true
  }],
  author: {
    type: String,
    required: true,
    default: 'Admin'
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'published'
  },
  viewCount: {
    type: Number,
    default: 0
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
});

// Index for search
blogSchema.index({ title: 'text', content: 'text', tags: 'text' });

module.exports = mongoose.model('Blog', blogSchema);

