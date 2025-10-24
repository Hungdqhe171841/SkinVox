const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');

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
      featuredImage: blog.images && blog.images[0] ? blog.images[0] : '/assets/Ava.jpg',
      images: blog.images || [],
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
      featuredImage: blog.images && blog.images[0] ? blog.images[0] : '/assets/Ava.jpg',
      images: blog.images || [],
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

// Get blog categories
router.get('/blog-categories', async (req, res) => {
  try {
    console.log('📝 Blog Debug - Categories API called');
    
    // Use find with projection instead of distinct to avoid timeout
    const blogs = await Blog.find({}, 'category').limit(100);
    const categories = [...new Set(blogs.map(blog => blog.category).filter(Boolean))];
    
    console.log('📝 Blog Debug - Categories found:', categories);
    
    const categoryData = categories.map(cat => {
      return {
        name: cat,
        value: cat.toLowerCase().replace(/\s+/g, '-'),
        description: `Bài viết về ${cat}`
      };
    });
    
    console.log('📝 Blog Debug - Formatted categories:', categoryData);
    res.json(categoryData);
  } catch (error) {
    console.error('❌ Blog Debug - Get categories error:', error);
    // Return default categories if database fails
    const defaultCategories = [
      { name: 'Makeup Tips', value: 'makeup-tips', description: 'Bài viết về Makeup Tips' },
      { name: 'Skincare Routine', value: 'skincare-routine', description: 'Bài viết về Skincare Routine' },
      { name: 'Product Reviews', value: 'product-reviews', description: 'Bài viết về Product Reviews' },
      { name: 'Trends & Looks', value: 'trends-looks', description: 'Bài viết về Trends & Looks' },
      { name: 'Behind The Brand', value: 'behind-the-brand', description: 'Bài viết về Behind The Brand' }
    ];
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
