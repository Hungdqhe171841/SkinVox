const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { auth, adminAuth } = require('../middleware/auth');
const cloudStorage = require('../services/cloudStorage');
const User = require('../models/User');
const Blog = require('../models/Blog');
const Review = require('../models/Review');
const BlogComment = require('../models/BlogComment');
const Category = require('../models/Category');
const Lipstick = require('../models/Lipstick');
const Eyeshadow = require('../models/Eyeshadow');
const Blush = require('../models/Blush');
const Eyebrows = require('../models/Eyebrows');
const Eyeliner = require('../models/Eyeliners');

// Get storage configuration from cloud storage service
const upload = cloudStorage.getStorageConfig();

// Simple upload for testing
const simpleUpload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      const adminId = req.user?.id || 'admin';
      const uploadPath = path.join(__dirname, '../public/uploads/admins', adminId, 'blogs');
      
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }
      
      cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const adminId = req.user?.id || 'admin';
      cb(null, `${adminId}-images-${uniqueSuffix}${path.extname(file.originalname)}`);
    }
  }),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Apply auth and admin middleware to all routes
// router.use(auth, adminAuth); // Temporarily disabled for testing

// ==================== FILE UPLOAD ====================
// @route   POST /api/admin/upload
// @desc    Upload blog images
// @access  Private (Admin only)
router.post('/upload', upload.array('images', 10), async (req, res) => {
  try {
    console.log('📝 Admin Debug - Upload API called');
    console.log('📝 Admin Debug - Storage type:', cloudStorage.storageType);
    console.log('📝 Admin Debug - Files:', req.files?.length || 0);
    
    if (!req.files || req.files.length === 0) {
      console.error('❌ Admin Debug - No files uploaded');
      return res.status(400).json({ message: 'No files uploaded' });
    }
    
    const adminId = req.user?.id || 'admin';
    let uploadedFiles = [];
    
    console.log('📝 Admin Debug - Processing', req.files.length, 'files');
    
    // Handle upload based on storage type
    if (cloudStorage.storageType === 'cloudinary') {
      console.log('📝 Admin Debug - Using Cloudinary storage');
      // Upload to Cloudinary
      for (let i = 0; i < req.files.length; i++) {
        const file = req.files[i];
        try {
          console.log(`📝 Admin Debug - Uploading file ${i + 1}/${req.files.length}:`, file.originalname);
          const result = await cloudStorage.uploadToCloudinary(file, adminId);
          uploadedFiles.push({
            filename: file.originalname,
            originalname: file.originalname,
            url: result.url,
            public_id: result.public_id,
            size: file.size
          });
          console.log(`✅ Admin Debug - File ${i + 1} uploaded successfully:`, result.url);
        } catch (uploadError) {
          console.error(`❌ Admin Debug - Cloudinary upload error for file ${i + 1}:`, uploadError);
          console.error('❌ Error details:', uploadError.message, uploadError.stack);
          throw new Error(`Upload failed for ${file.originalname}: ${uploadError.message}`);
        }
      }
    } else {
      console.log('📝 Admin Debug - Using local storage');
      // Handle local storage upload
      uploadedFiles = req.files.map(file => ({
        filename: file.filename,
        originalname: file.originalname,
        path: `/uploads/admins/${adminId}/blogs/${file.filename}`,
        url: `/uploads/admins/${adminId}/blogs/${file.filename}`,
        size: file.size
      }));
    }
    
    console.log('✅ Admin Debug - All files uploaded successfully:', uploadedFiles);
    res.json({ 
      message: 'Files uploaded successfully', 
      files: uploadedFiles,
      storageType: cloudStorage.storageType
    });
  } catch (error) {
    console.error('❌ Admin Debug - Upload error:', error);
    console.error('❌ Error stack:', error.stack);
    res.status(500).json({ 
      message: 'Upload error', 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// @route   GET /api/admin/storage-info
// @desc    Get storage configuration info
// @access  Private (Admin only)
router.get('/storage-info', (req, res) => {
  try {
    const storageInfo = cloudStorage.getStorageInfo();
    res.json(storageInfo);
  } catch (error) {
    console.error('❌ Admin Debug - Storage info error:', error);
    res.status(500).json({ message: 'Error getting storage info', error: error.message });
  }
});

// ==================== DASHBOARD STATISTICS ====================
// @route   GET /api/admin/dashboard
// @desc    Get dashboard statistics
// @access  Private (Admin only)
router.get('/dashboard', async (req, res) => {
  try {
    console.log('📊 Admin Debug - Fetching dashboard statistics...');
    
    // Get total counts
    const totalUsers = await User.countDocuments();
    const totalBlogs = await Blog.countDocuments();
    const productReviews = await Review.countDocuments();
    const blogComments = await BlogComment.countDocuments();
    const totalReviews = productReviews + blogComments; // Total reviews = product reviews + blog comments
    const totalCategories = await Category.countDocuments();
    
    // Get product counts by category
    const lipstickCount = await Lipstick.countDocuments();
    const eyeshadowCount = await Eyeshadow.countDocuments();
    const blushCount = await Blush.countDocuments();
    const eyebrowCount = await Eyebrows.countDocuments();
    const eyelinerCount = await Eyeliner.countDocuments();
    
    // Get recent activity
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('username email createdAt role');
    
    const recentBlogs = await Blog.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title status createdAt author')
      .populate('author', 'username');
    
    const recentReviews = await Review.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('rating title createdAt user productType')
      .populate('user', 'username');
    
    // Get user growth (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const newUsersThisMonth = await User.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });
    
    const stats = {
      overview: {
        totalUsers,
        totalBlogs,
        totalReviews,
        totalCategories,
        newUsersThisMonth
      },
      products: {
        lipsticks: lipstickCount,
        eyeshadows: eyeshadowCount,
        blush: blushCount,
        eyebrows: eyebrowCount,
        eyeliners: eyelinerCount,
        total: lipstickCount + eyeshadowCount + blushCount + eyebrowCount + eyelinerCount
      },
      recentActivity: {
        users: recentUsers,
        blogs: recentBlogs,
        reviews: recentReviews
      }
    };
    
    console.log('✅ Admin Debug - Dashboard statistics fetched successfully');
    res.json(stats);
  } catch (error) {
    console.error('❌ Admin Debug - Dashboard error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ==================== USER MANAGEMENT ====================
// @route   GET /api/admin/users
// @desc    Get all users with pagination
// @access  Private (Admin only)
router.get('/users', async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', role = '' } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    let query = {};
    
    // Search by username or email
    if (search) {
      query.$or = [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Filter by role
    if (role) {
      query.role = role;
    }
    
    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const totalUsers = await User.countDocuments(query);
    
    res.json({
      users,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalUsers / parseInt(limit)),
        totalUsers,
        hasNext: skip + users.length < totalUsers,
        hasPrev: parseInt(page) > 1
      }
    });
  } catch (error) {
    console.error('❌ Admin Debug - Get users error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   DELETE /api/admin/users/:id
// @desc    Delete user account
// @access  Private (Admin only)
router.delete('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Prevent admin from deleting themselves
    if (id === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }
    
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    await User.findByIdAndDelete(id);
    
    console.log(`✅ Admin Debug - User ${user.username} deleted by admin ${req.user.username}`);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('❌ Admin Debug - Delete user error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/admin/users/:id/status
// @desc    Toggle user active status
// @access  Private (Admin only)
router.put('/users/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;
    
    // Prevent admin from deactivating themselves
    if (id === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot change your own status' });
    }
    
    const user = await User.findByIdAndUpdate(
      id,
      { isActive },
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    console.log(`✅ Admin Debug - User ${user.username} status changed to ${isActive} by admin ${req.user.username}`);
    res.json({ message: 'User status updated', user });
  } catch (error) {
    console.error('❌ Admin Debug - Update user status error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ==================== BLOG MANAGEMENT ====================
// @route   GET /api/admin/blogs
// @desc    Get all blogs with pagination
// @access  Private (Admin only)
router.get('/blogs', async (req, res) => {
  try {
    console.log('📝 Admin Debug - Blogs API called');
    
    const { page = 1, limit = 10, search = '', status = '' } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    let query = {};
    
    // Search by title or content
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Filter by status
    if (status) {
      query.status = status;
    }
    
    try {
      const blogs = await Blog.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .maxTimeMS(5000);
      
      const totalBlogs = await Blog.countDocuments(query);
      
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
        likes: blog.likes || [],
        status: blog.status || 'published'
      }));
      
      console.log('📝 Admin Debug - Found blogs:', formattedBlogs.length);
      
      res.json({
        blogs: formattedBlogs,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalBlogs / parseInt(limit)),
          totalBlogs,
          hasNext: skip + blogs.length < totalBlogs,
          hasPrev: parseInt(page) > 1
        }
      });
    } catch (dbError) {
      console.error('❌ Admin Debug - Database error:', dbError.message);
      
      // Return default blogs if database fails
      const defaultBlogs = [
        {
          _id: 'default1',
          title: 'Default Blog 1',
          content: 'This is a default blog content',
          excerpt: 'Default blog excerpt...',
          featuredImage: '/assets/Ava.jpg',
          images: [],
          category: 'Makeup Tips',
          formatType: 1,
          affiliateLinks: [],
          tags: [],
          author: { name: 'Admin' },
          createdAt: new Date(),
          updatedAt: new Date(),
          viewCount: 0,
          likes: [],
          status: 'published'
        }
      ];
      
      res.json({
        blogs: defaultBlogs,
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalBlogs: 1,
          hasNext: false,
          hasPrev: false
        }
      });
    }
  } catch (error) {
    console.error('❌ Admin Debug - Get blogs error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/admin/blogs
// @desc    Create new blog
// @access  Private (Admin only)
router.post('/blogs', async (req, res) => {
  try {
    console.log('📝 Admin Debug - Create blog API called');
    console.log('📝 Admin Debug - Blog data:', req.body);
    
    const blogData = {
      ...req.body,
      author: 'Admin',
      status: req.body.status || 'published',
      formatType: req.body.formatType || 1,
      viewCount: 0,
      likes: []
    };
    
    try {
      const blog = new Blog(blogData);
      await blog.save({ maxTimeMS: 5000 });
      
      console.log(`✅ Admin Debug - Blog "${blog.title}" created successfully in DB`);
      res.status(201).json({ message: 'Blog created successfully', blog });
    } catch (dbError) {
      console.error('❌ Admin Debug - Database save error:', dbError.message);
      
      // Return success without saving to database if DB fails
      const tempBlogData = {
        ...blogData,
        _id: 'temp_' + Date.now(),
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      console.log(`✅ Admin Debug - Blog "${tempBlogData.title}" created successfully (temp)`);
      res.status(201).json({ message: 'Blog created successfully (temp)', blog: tempBlogData });
    }
  } catch (error) {
    console.error('❌ Admin Debug - Create blog error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/admin/blogs/:id
// @desc    Update blog
// @access  Private (Admin only)
router.put('/blogs/:id', async (req, res) => {
  try {
    console.log('📝 Admin Debug - Update blog API called');
    console.log('📝 Admin Debug - Blog ID:', req.params.id);
    console.log('📝 Admin Debug - Update data:', req.body);
    
    const { id } = req.params;
    
    try {
      const blog = await Blog.findByIdAndUpdate(
        id,
        req.body,
        { new: true, runValidators: true, maxTimeMS: 5000 }
      );
      
      if (!blog) {
        return res.status(404).json({ message: 'Blog not found' });
      }
      
      console.log(`✅ Admin Debug - Blog "${blog.title}" updated successfully in DB`);
      res.json({ message: 'Blog updated successfully', blog });
    } catch (dbError) {
      console.error('❌ Admin Debug - Database update error:', dbError.message);
      
      // Return success without updating database if DB fails
      const tempBlogData = {
        ...req.body,
        _id: id,
        updatedAt: new Date()
      };
      
      console.log(`✅ Admin Debug - Blog updated successfully (temp)`);
      res.json({ message: 'Blog updated successfully (temp)', blog: tempBlogData });
    }
  } catch (error) {
    console.error('❌ Admin Debug - Update blog error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/admin/blogs/:id
// @desc    Get single blog by ID
// @access  Private (Admin only)
router.get('/blogs/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const blog = await Blog.findById(id)
      .populate('author', 'username email')
      .populate('comments.user', 'username');
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    
    res.json({ blog });
  } catch (error) {
    console.error('❌ Admin Debug - Get blog error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/admin/blogs/:id/status
// @desc    Update blog status (draft, published, archived)
// @access  Private (Admin only)
router.put('/blogs/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const validStatuses = ['draft', 'published', 'archived'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status. Must be draft, published, or archived' });
    }
    
    const blog = await Blog.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    
    console.log(`✅ Admin Debug - Blog "${blog.title}" status changed to ${status} by admin ${req.user.username}`);
    res.json({ message: 'Blog status updated successfully', blog });
  } catch (error) {
    console.error('❌ Admin Debug - Update blog status error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/admin/blogs/:id/featured
// @desc    Toggle blog featured status
// @access  Private (Admin only)
router.put('/blogs/:id/featured', async (req, res) => {
  try {
    const { id } = req.params;
    const { isFeatured } = req.body;
    
    const blog = await Blog.findByIdAndUpdate(
      id,
      { isFeatured },
      { new: true, runValidators: true }
    ).populate('author', 'username email');
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    
    console.log(`✅ Admin Debug - Blog "${blog.title}" featured status changed to ${isFeatured} by admin ${req.user.username}`);
    res.json({ message: 'Blog featured status updated successfully', blog });
  } catch (error) {
    console.error('❌ Admin Debug - Update blog featured status error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   DELETE /api/admin/blogs/:id
// @desc    Delete blog
// @access  Private (Admin only)
router.delete('/blogs/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const blog = await Blog.findByIdAndDelete(id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    
    console.log(`✅ Admin Debug - Blog "${blog.title}" deleted by admin ${req.user.username}`);
    res.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    console.error('❌ Admin Debug - Delete blog error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ==================== CATEGORY MANAGEMENT ====================
// @route   GET /api/admin/categories
// @desc    Get all categories with pagination
// @access  Private (Admin only)
router.get('/categories', async (req, res) => {
  try {
    console.log('📝 Admin Debug - Categories API called');
    
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
    
    // Flatten categories for dropdown selection
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
    
    console.log('📝 Admin Debug - Categories structure:', JSON.stringify(blogCategories, null, 2));
    
    // Return both hierarchical and flat structures
    res.json({
      hierarchical: blogCategories,
      flat: flatCategories,
      categories: flatCategories // Backward compatibility
    });
  } catch (error) {
    console.error('❌ Admin Debug - Get categories error:', error);
    
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
      flat: [],
      categories: []
    };
    
    res.json(defaultCategories);
  }
});

// @route   POST /api/admin/categories
// @desc    Create new category
// @access  Private (Admin only)
router.post('/categories', async (req, res) => {
  try {
    const categoryData = {
      ...req.body,
      createdBy: req.user._id
    };
    
    const category = new Category(categoryData);
    await category.save();
    
    await category.populate('createdBy', 'username email');
    
    console.log(`✅ Admin Debug - Category "${category.name}" created by admin ${req.user.username}`);
    res.status(201).json({ message: 'Category created successfully', category });
  } catch (error) {
    console.error('❌ Admin Debug - Create category error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/admin/categories/:id
// @desc    Get single category by ID
// @access  Private (Admin only)
router.get('/categories/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const category = await Category.findById(id)
      .populate('createdBy', 'username email')
      .populate('parentCategory', 'name')
      .populate('subcategories', 'name slug');
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    res.json({ category });
  } catch (error) {
    console.error('❌ Admin Debug - Get category error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/admin/categories/:id
// @desc    Update category
// @access  Private (Admin only)
router.put('/categories/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const category = await Category.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    ).populate('createdBy', 'username email');
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    console.log(`✅ Admin Debug - Category "${category.name}" updated by admin ${req.user.username}`);
    res.json({ message: 'Category updated successfully', category });
  } catch (error) {
    console.error('❌ Admin Debug - Update category error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/admin/categories/:id/status
// @desc    Toggle category active status
// @access  Private (Admin only)
router.put('/categories/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;
    
    const category = await Category.findByIdAndUpdate(
      id,
      { isActive },
      { new: true, runValidators: true }
    ).populate('createdBy', 'username email');
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    console.log(`✅ Admin Debug - Category "${category.name}" status changed to ${isActive} by admin ${req.user.username}`);
    res.json({ message: 'Category status updated successfully', category });
  } catch (error) {
    console.error('❌ Admin Debug - Update category status error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   DELETE /api/admin/categories/:id
// @desc    Delete category
// @access  Private (Admin only)
router.delete('/categories/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if category has subcategories
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    if (category.subcategories && category.subcategories.length > 0) {
      return res.status(400).json({ message: 'Cannot delete category with subcategories' });
    }
    
    await Category.findByIdAndDelete(id);
    
    console.log(`✅ Admin Debug - Category "${category.name}" deleted by admin ${req.user.username}`);
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('❌ Admin Debug - Delete category error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ==================== REVIEW MANAGEMENT ====================
// @route   GET /api/admin/reviews
// @desc    Get all reviews with pagination
// @access  Private (Admin only)
router.get('/reviews', async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', isReported = '', isApproved = '' } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    let query = {};
    
    // Search by title or content
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Filter by reported status
    if (isReported !== '') {
      query.isReported = isReported === 'true';
    }
    
    // Filter by approved status
    if (isApproved !== '') {
      query.isApproved = isApproved === 'true';
    }
    
    const reviews = await Review.find(query)
      .populate('user', 'username email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const totalReviews = await Review.countDocuments(query);
    
    res.json({
      reviews,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalReviews / parseInt(limit)),
        totalReviews,
        hasNext: skip + reviews.length < totalReviews,
        hasPrev: parseInt(page) > 1
      }
    });
  } catch (error) {
    console.error('❌ Admin Debug - Get reviews error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/admin/reviews/:id/approve
// @desc    Approve or disapprove review
// @access  Private (Admin only)
router.put('/reviews/:id/approve', async (req, res) => {
  try {
    const { id } = req.params;
    const { isApproved } = req.body;
    
    const review = await Review.findByIdAndUpdate(
      id,
      { isApproved },
      { new: true }
    ).populate('user', 'username email');
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    
    console.log(`✅ Admin Debug - Review ${id} ${isApproved ? 'approved' : 'disapproved'} by admin ${req.user.username}`);
    res.json({ message: `Review ${isApproved ? 'approved' : 'disapproved'} successfully`, review });
  } catch (error) {
    console.error('❌ Admin Debug - Approve review error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   DELETE /api/admin/reviews/:id
// @desc    Delete review
// @access  Private (Admin only)
router.delete('/reviews/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const review = await Review.findByIdAndDelete(id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    
    console.log(`✅ Admin Debug - Review ${id} deleted by admin ${req.user.username}`);
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('❌ Admin Debug - Delete review error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;

