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
      // Add main category
      flatCategories.push({
        name: category.name,
        value: category.name.toLowerCase().replace(/\s+/g, '-'),
        description: category.description
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
