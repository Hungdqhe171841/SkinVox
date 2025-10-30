const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');
const BlogComment = require('../models/BlogComment');
const { auth } = require('../middleware/auth');

// Get all published blogs
router.get('/blogs', async (req, res) => {
  try {
    const { category, page = 1, limit = 10 } = req.query;
    
    let query = {};
    
    // Filter by category if provided
    if (category && category !== 'All') {
      query.category = category;
    }
    
    // Don't filter by status since database doesn't have status field
    // const sampleBlog = await Blog.findOne({});
    // if (sampleBlog && sampleBlog.status) {
    //   query.status = 'published';
    // }
    
    const blogs = await Blog.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Blog.countDocuments(query);
    
    // Transform data to match expected format
    const formattedBlogs = blogs.map(blog => ({
      _id: blog._id,
      title: blog.title,
      content: blog.content,
      excerpt: blog.description || (blog.content ? blog.content.substring(0, 200) + '...' : ''),
      featuredImage: blog.images && blog.images[0] && blog.images[0].startsWith('http') ? blog.images[0] : '/assets/Ava.jpg',
      images: blog.images ? blog.images.filter(img => img && img.startsWith('http')) : [],
      category: blog.category,
      formatType: blog.formatType || 1,
      affiliateLinks: blog.affiliateLinks || [],
      tags: blog.tags || [],
      author: { name: blog.author || 'Admin' },
      createdAt: blog.createdAt || blog._id.getTimestamp() || new Date(),
      updatedAt: blog.updatedAt || blog._id.getTimestamp() || new Date(),
      viewCount: blog.viewCount || 0,
      likes: blog.likes || []
    }));
    
    res.json({
      blogs: formattedBlogs,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('❌ Blog Debug - Get blogs error:', error);
    res.status(500).json({ message: 'Error fetching blogs', error: error.message });
  }
});

// ==================== BLOG COMMENTS & RATINGS ====================
// NOTE: These routes MUST come BEFORE '/blogs/:id' to avoid route conflicts

// @route   GET /api/blog/blogs/:id/comments
// @desc    Get all comments for a blog
// @access  Public
router.get('/blogs/:id/comments', async (req, res) => {
  try {
    console.log('📝 Comment Debug - GET /blogs/:id/comments called for blogId:', req.params.id);
    
    const comments = await BlogComment.find({ 
      blog: req.params.id,
      isApproved: true 
    })
      .populate('user', 'username')
      .populate('replies.user', 'username')
      .sort({ createdAt: -1 });
    
    console.log('📝 Comment Debug - Found comments:', comments.length);
    
    res.json({ success: true, comments });
  } catch (error) {
    console.error('❌ Blog Debug - Get comments error:', error);
    res.status(500).json({ message: 'Error fetching comments', error: error.message });
  }
});

// @route   POST /api/blog/blogs/:id/comments
// @desc    Add a comment to a blog
// @access  Private (requires authentication)
router.post('/blogs/:id/comments', auth, async (req, res) => {
  try {
    console.log('📝 Comment Debug - POST /blogs/:id/comments called for blogId:', req.params.id);
    console.log('📝 Comment Debug - User:', req.user);
    console.log('📝 Comment Debug - Request body:', req.body);
    
    const { comment, rating } = req.body;
    
    // Validate input
    if (!comment || comment.trim().length < 3) {
      return res.status(400).json({ message: 'Comment must be at least 3 characters' });
    }
    
    if (rating && (rating < 1 || rating > 5)) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }
    
    // Check if blog exists
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    
    // Create new comment
    const newComment = new BlogComment({
      blog: req.params.id,
      user: req.user.id,
      username: req.user.username,
      comment: comment.trim(),
      rating: rating || null
    });
    
    await newComment.save();
    
    // Update blog comment count
    blog.commentCount = (blog.commentCount || 0) + 1;
    
    // Update blog rating if rating provided
    if (rating) {
      const currentRating = blog.rating || 0;
      const currentCount = blog.ratingCount || 0;
      const totalRating = currentRating * currentCount + rating;
      blog.ratingCount = currentCount + 1;
      blog.rating = totalRating / blog.ratingCount;
    }
    
    await blog.save();
    
    // Populate user info before sending response
    await newComment.populate('user', 'username');
    
    res.status(201).json({ 
      success: true, 
      message: 'Comment added successfully',
      comment: newComment,
      blog: {
        commentCount: blog.commentCount,
        rating: blog.rating,
        ratingCount: blog.ratingCount
      }
    });
  } catch (error) {
    console.error('❌ Blog Debug - Add comment error:', error);
    res.status(500).json({ message: 'Error adding comment', error: error.message });
  }
});

// @route   POST /api/blog/blogs/:id/comments/:commentId/reply
// @desc    Reply to a comment
// @access  Private (requires authentication)
router.post('/blogs/:id/comments/:commentId/reply', auth, async (req, res) => {
  try {
    const { comment } = req.body;
    
    if (!comment || comment.trim().length < 3) {
      return res.status(400).json({ message: 'Reply must be at least 3 characters' });
    }
    
    const blogComment = await BlogComment.findById(req.params.commentId);
    if (!blogComment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    
    blogComment.replies.push({
      user: req.user.id,
      username: req.user.username,
      comment: comment.trim()
    });
    
    await blogComment.save();
    await blogComment.populate('replies.user', 'username');
    
    res.json({ 
      success: true, 
      message: 'Reply added successfully',
      comment: blogComment
    });
  } catch (error) {
    console.error('❌ Blog Debug - Add reply error:', error);
    res.status(500).json({ message: 'Error adding reply', error: error.message });
  }
});

// @route   POST /api/blog/blogs/:id/comments/:commentId/helpful
// @desc    Mark comment as helpful
// @access  Private (requires authentication)
router.post('/blogs/:id/comments/:commentId/helpful', auth, async (req, res) => {
  try {
    const comment = await BlogComment.findById(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    
    const helpfulIndex = comment.helpful.indexOf(req.user.id);
    
    if (helpfulIndex > -1) {
      comment.helpful.splice(helpfulIndex, 1);
    } else {
      comment.helpful.push(req.user.id);
    }
    
    await comment.save();
    
    res.json({ 
      success: true,
      helpful: helpfulIndex === -1,
      helpfulCount: comment.helpful.length 
    });
  } catch (error) {
    console.error('❌ Blog Debug - Mark helpful error:', error);
    res.status(500).json({ message: 'Error marking helpful', error: error.message });
  }
});

// @route   DELETE /api/blog/blogs/:id/comments/:commentId
// @desc    Delete a comment (user can only delete their own)
// @access  Private (requires authentication)
router.delete('/blogs/:id/comments/:commentId', auth, async (req, res) => {
  try {
    const comment = await BlogComment.findById(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    
    // Check if user owns the comment or is admin
    if (comment.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }
    
    await BlogComment.findByIdAndDelete(req.params.commentId);
    
    // Update blog comment count
    const blog = await Blog.findById(req.params.id);
    if (blog) {
      blog.commentCount = Math.max(0, (blog.commentCount || 0) - 1);
      await blog.save();
    }
    
    res.json({ 
      success: true, 
      message: 'Comment deleted successfully' 
    });
  } catch (error) {
    console.error('❌ Blog Debug - Delete comment error:', error);
    res.status(500).json({ message: 'Error deleting comment', error: error.message });
  }
});

// Get single blog by ID
router.get('/blogs/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const blog = await Blog.findById(id);
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    
    // Increment view count
    blog.viewCount += 1;
    await blog.save();
    
    // Transform data to match expected format
    const formattedBlog = {
      _id: blog._id,
      title: blog.title,
      content: blog.content,
      excerpt: blog.description || (blog.content ? blog.content.substring(0, 200) + '...' : ''),
      description: blog.description || (blog.content ? blog.content.substring(0, 200) + '...' : ''),
      featuredImage: blog.images && blog.images[0] && blog.images[0].startsWith('http') ? blog.images[0] : '/assets/Ava.jpg',
      images: blog.images ? blog.images.filter(img => img && img.startsWith('http')) : [],
      category: blog.category,
      formatType: blog.formatType || 1,
      affiliateLinks: blog.affiliateLinks || [],
      tags: blog.tags || [],
      author: { name: blog.author || 'Admin' },
      createdAt: blog.createdAt || blog._id.getTimestamp() || new Date(),
      updatedAt: blog.updatedAt || blog._id.getTimestamp() || new Date(),
      viewCount: blog.viewCount,
      likes: blog.likes || [],
      status: blog.status
    };
    
    res.json(formattedBlog);
  } catch (error) {
    console.error('❌ Blog Debug - Get blog error:', error);
    res.status(500).json({ message: 'Error fetching blog', error: error.message });
  }
});

// Get blog categories with hierarchical structure
router.get('/blog-categories', async (req, res) => {
  try {
    console.log('📝 Blog Debug - Categories API called');
    
    // New hierarchical blog categories structure
    const blogCategories = [
      {
        name: "Skincare",
        description: "Các bài viết về chăm sóc, điều trị và review sản phẩm chăm sóc da.",
        subcategories: [
          {
            name: "Chăm sóc da",
            children: [
              "Da thường",
              "Da khô",
              "Da dầu",
              "Da nhạy cảm",
              "Da hỗn hợp"
            ]
          },
          {
            name: "Điều trị da",
            children: [
              "Da mụn",
              "Da Breakout",
              "Da lão hóa",
              "Da không đều màu"
            ]
          },
          {
            name: "Review & So sánh sản phẩm"
          }
        ]
      },
      {
        name: "Makeup",
        description: "Các bài viết hướng dẫn, review và xu hướng về trang điểm.",
        subcategories: [
          {
            name: "Makeup 101 (nền tảng)",
            children: [
              "Xác định undertone & chọn tông nền",
              "Thứ tự các bước base – mắt – má – môi",
              "Vệ sinh dụng cụ & an toàn da"
            ]
          },
          {
            name: "Eyes Makeup",
            children: [
              "Brown Makeup",
              "Eyeliner",
              "Mascara",
              "Eyes Shadow"
            ]
          },
          {
            name: "Face Makeup",
            children: [
              "Foundation",
              "Blush",
              "Highlight - Contour",
              "Concealer"
            ]
          },
          {
            name: "Lip Makeup"
          },
          {
            name: "Makeup Tips"
          }
        ]
      }
    ];
    
    // Flatten categories for dropdown selection (backward compatibility)
    // Only show main categories and subcategories, NOT the children to keep it compact
    const flatCategories = [];
    
    blogCategories.forEach(category => {
      // Add main category with parent reference
      flatCategories.push({
        name: category.name,
        value: category.name.toLowerCase().replace(/\s+/g, '-'),
        description: category.description,
        parent: category.name // Self-reference for main categories
      });
      
      // Add subcategories only (skip children to keep dropdown compact)
      category.subcategories.forEach(subcategory => {
        flatCategories.push({
          name: subcategory.name,
          value: subcategory.name.toLowerCase().replace(/\s+/g, '-'),
          description: subcategory.description || subcategory.name,
          parent: category.name
        });
      });
    });
    
    console.log('📝 Blog Debug - Categories structure:', JSON.stringify(blogCategories, null, 2));
    
    // Return both hierarchical and flat structures
    res.json({
      hierarchical: blogCategories,
      flat: flatCategories
    });
  } catch (error) {
    console.error('❌ Blog Debug - Get categories error:', error);
    
    // Return hierarchical structure as fallback
    const defaultCategories = {
      hierarchical: [
        {
          name: "Skincare",
          description: "Các bài viết về chăm sóc, điều trị và review sản phẩm chăm sóc da.",
          subcategories: [
            {
              name: "Chăm sóc da",
              children: ["Da thường", "Da khô", "Da dầu", "Da nhạy cảm", "Da hỗn hợp"]
            },
            {
              name: "Review & So sánh sản phẩm"
            }
          ]
        },
        {
          name: "Makeup",
          description: "Các bài viết hướng dẫn, review và xu hướng về trang điểm.",
          subcategories: [
            {
              name: "Makeup Tips"
            }
          ]
        }
      ],
      flat: []
    };
    
    res.json(defaultCategories);
  }
});

// Like/Unlike blog
router.post('/blogs/:id/like', async (req, res) => {
  try {
    const { userId } = req.body;
    const blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    
    const likeIndex = blog.likes.indexOf(userId);
    
    if (likeIndex > -1) {
      blog.likes.splice(likeIndex, 1);
    } else {
      blog.likes.push(userId);
    }
    
    await blog.save();
    
    res.json({ 
      liked: likeIndex === -1,
      likesCount: blog.likes.length 
    });
  } catch (error) {
    console.error('❌ Blog Debug - Like blog error:', error);
    res.status(500).json({ message: 'Error updating like', error: error.message });
  }
});

module.exports = router;
