const express = require('express');
const router = express.Router();
const Lipstick = require('../models/Lipstick');
const Eyeshadow = require('../models/Eyeshadow');
const Blush = require('../models/Blush');
const Eyebrows = require('../models/Eyebrows');
const Eyeliner = require('../models/Eyeliners');
const mongoose = require('mongoose');

// ==================== BEAUTYBAR PRODUCTS ====================
// @route   GET /api/beautybar/products
// @desc    Get all BeautyBar products with pagination and filtering
// @access  Public
router.get('/products', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 12, 
      category = '', 
      brand = '', 
      minPrice = '', 
      maxPrice = '',
      search = '',
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    let allProducts = [];

    // Build query for each product type
    const buildQuery = (baseQuery = {}) => {
      // Treat documents without isActive as active
      let query = { $or: [{ isActive: true }, { isActive: { $exists: false } }], ...baseQuery };

      // Search filter
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { brand: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ];
      }

      // Brand filter
      if (brand) {
        query.brand = { $regex: brand, $options: 'i' };
      }

      // Price range filter
      if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = parseFloat(minPrice);
        if (maxPrice) query.price.$lte = parseFloat(maxPrice);
      }

      return query;
    };

    // Get products based on category filter
    if (category === 'lipstick' || !category) {
      const lipstickQuery = buildQuery();
      if (category === 'lipstick') {
        const lipstickCategory = req.query.lipstickCategory;
        if (lipstickCategory) {
          lipstickQuery.category = lipstickCategory;
        }
      }
      const lipsticks = await Lipstick.find(lipstickQuery)
        .select('-reviews')
        .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 });
      
      allProducts = allProducts.concat(lipsticks.map(product => ({
        ...product.toObject(),
        productType: 'lipstick',
        type: 'Lipstick'
      })));
    }

    if (category === 'eyeshadow' || !category) {
      const eyeshadows = await Eyeshadow.find(buildQuery())
        .select('-reviews')
        .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 });
      
      allProducts = allProducts.concat(eyeshadows.map(product => ({
        ...product.toObject(),
        productType: 'eyeshadow',
        type: 'Eyeshadow'
      })));
    }

    if (category === 'blush' || !category) {
      const blushes = await Blush.find(buildQuery())
        .select('-reviews')
        .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 });
      
      allProducts = allProducts.concat(blushes.map(product => ({
        ...product.toObject(),
        productType: 'blush',
        type: 'Blush'
      })));
    }

    if (category === 'eyebrows' || !category) {
      const eyebrows = await Eyebrows.find(buildQuery())
        .select('-reviews')
        .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 });
      
      allProducts = allProducts.concat(eyebrows.map(product => ({
        ...product.toObject(),
        productType: 'eyebrows',
        type: 'Eyebrow'
      })));
    }

    if (category === 'eyeliner' || !category) {
      const eyeliners = await Eyeliner.find(buildQuery())
        .select('-reviews')
        .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 });
      
      allProducts = allProducts.concat(eyeliners.map(product => ({
        ...product.toObject(),
        productType: 'eyeliner',
        type: 'Eyeliner'
      })));
    }

    // Sort all products
    allProducts.sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];
      if (sortOrder === 'desc') {
        return bValue > aValue ? 1 : -1;
      } else {
        return aValue > bValue ? 1 : -1;
      }
    });

    // Pagination
    const totalProducts = allProducts.length;
    const paginatedProducts = allProducts.slice(skip, skip + parseInt(limit));

    // Get unique brands for filtering
    const brands = [...new Set(allProducts.map(product => product.brand))].sort();

    res.json({
      products: paginatedProducts,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalProducts / parseInt(limit)),
        totalProducts,
        hasNext: skip + paginatedProducts.length < totalProducts,
        hasPrev: parseInt(page) > 1
      },
      filters: {
        brands,
        categories: ['lipstick', 'eyeshadow', 'blush', 'eyebrows', 'eyeliner']
      }
    });
  } catch (error) {
    console.error('❌ BeautyBar Debug - Get products error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/beautybar/products/:type/:id
// @desc    Get single product by type and ID
// @access  Public
router.get('/products/:type/:id', async (req, res) => {
  try {
    const { type, id } = req.params;
    let Product, productType;

    // Determine which model to use
    switch (type) {
      case 'lipstick':
        Product = Lipstick;
        productType = 'Lipstick';
        break;
      case 'eyeshadow':
        Product = Eyeshadow;
        productType = 'Eyeshadow';
        break;
      case 'blush':
        Product = Blush;
        productType = 'Blush';
        break;
      case 'eyebrows':
        Product = Eyebrows;
        productType = 'Eyebrow';
        break;
      case 'eyeliner':
        Product = Eyeliner;
        productType = 'Eyeliner';
        break;
      default:
        return res.status(400).json({ message: 'Invalid product type' });
    }

    const product = await Product.findById(id).populate('reviews.user', 'username');
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (!product.isActive) {
      return res.status(404).json({ message: 'Product not available' });
    }

    res.json({
      product: {
        ...product.toObject(),
        productType: type,
        type: productType
      }
    });
  } catch (error) {
    console.error('❌ BeautyBar Debug - Get product error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Shades for a BeautyBar product (by type)
router.get('/products/:type/:id/shades', async (req, res) => {
  try {
    const { type, id } = req.params;
    let Product;
    switch (type) {
      case 'lipstick':
        Product = Lipstick; break;
      case 'eyeshadow':
        Product = Eyeshadow; break;
      case 'blush':
        Product = Blush; break;
      case 'eyebrows':
        Product = Eyebrows; break;
      case 'eyeliner':
        Product = Eyeliner; break;
      default:
        return res.status(400).json({ message: 'Invalid product type' });
    }

    const product = await Product.findById(id).select('name brand type category color shades colors');
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const shades = [];
    
    console.log('🔍 Shades Debug - Product:', product.name, 'Type:', type);
    console.log('🔍 Shades Debug - Product._id:', product._id);
    console.log('🔍 Shades Debug - Has colors array:', !!product.colors);
    console.log('🔍 Shades Debug - colors value:', product.colors);
    console.log('🔍 Shades Debug - Has shades:', !!product.shades);
    console.log('🔍 Shades Debug - shades value:', product.shades);
    console.log('🔍 Shades Debug - Shades type:', typeof product.shades);
    console.log('🔍 Shades Debug - Is Map?:', product.shades instanceof Map);
    console.log('🔍 Shades Debug - Is Array?:', Array.isArray(product.shades));
    
    // For Eyeshadow: use colors array first
    if (type === 'eyeshadow' && product.colors && Array.isArray(product.colors) && product.colors.length > 0) {
      product.colors.forEach((color) => {
        shades.push({ 
          name: color.name || 'Shade', 
          hex: color.hex, 
          rgba: color.hex,
          finish: color.finish 
        });
      });
      console.log('✅ Shades Debug - Using colors array:', shades.length);
    }
    // For shades as Object (plain object with key-value pairs)
    else if (product.shades && typeof product.shades === 'object' && !Array.isArray(product.shades)) {
      // Handle both Map and plain Object
      if (product.shades instanceof Map) {
        product.shades.forEach((value, key) => {
          shades.push({ name: key, hex: value, rgba: value.includes('rgba') ? value : value });
        });
      } else {
        // Plain object
        Object.entries(product.shades).forEach(([key, value]) => {
          if (key !== '_id') { // Skip MongoDB internal fields
            shades.push({ name: key, hex: value, rgba: value.includes('rgba') ? value : value });
          }
        });
      }
      console.log('✅ Shades Debug - Using shades object:', shades.length);
    } 
    // Fallback to color field
    else if (product.color) {
      shades.push({ name: product.color, hex: product.color, rgba: product.color });
      console.log('✅ Shades Debug - Using color field:', shades.length);
    }

    console.log('✅ Shades Debug - Final shades:', shades);
    res.json({ success: true, shades });
  } catch (error) {
    console.error('❌ BeautyBar Debug - Get shades error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/beautybar/featured
// @desc    Get featured products
// @access  Public
router.get('/featured', async (req, res) => {
  try {
    const { limit = 8 } = req.query;
    
    // Get top-rated products from each category
    const featuredLipsticks = await Lipstick.find({ isActive: true })
      .sort({ rating: -1 })
      .limit(2)
      .select('-reviews');
    
    const featuredEyeshadows = await Eyeshadow.find({ isActive: true })
      .sort({ rating: -1 })
      .limit(2)
      .select('-reviews');
    
    const featuredBlushes = await Blush.find({ isActive: true })
      .sort({ rating: -1 })
      .limit(2)
      .select('-reviews');
    
    const featuredEyebrows = await Eyebrows.find({ isActive: true })
      .sort({ rating: -1 })
      .limit(1)
      .select('-reviews');
    
    const featuredEyeliners = await Eyeliner.find({ isActive: true })
      .sort({ rating: -1 })
      .limit(1)
      .select('-reviews');

    const featuredProducts = [
      ...featuredLipsticks.map(product => ({ ...product.toObject(), productType: 'lipstick', type: 'Lipstick' })),
      ...featuredEyeshadows.map(product => ({ ...product.toObject(), productType: 'eyeshadow', type: 'Eyeshadow' })),
      ...featuredBlushes.map(product => ({ ...product.toObject(), productType: 'blush', type: 'Blush' })),
      ...featuredEyebrows.map(product => ({ ...product.toObject(), productType: 'eyebrows', type: 'Eyebrow' })),
      ...featuredEyeliners.map(product => ({ ...product.toObject(), productType: 'eyeliner', type: 'Eyeliner' }))
    ];

    // Shuffle and limit results
    const shuffled = featuredProducts.sort(() => 0.5 - Math.random());
    const limited = shuffled.slice(0, parseInt(limit));

    res.json({ products: limited });
  } catch (error) {
    console.error('❌ BeautyBar Debug - Get featured products error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/beautybar/stats
// @desc    Get BeautyBar statistics
// @access  Public
router.get('/stats', async (req, res) => {
  try {
    const activeOrMissing = { $or: [{ isActive: true }, { isActive: { $exists: false } }] };
    const [
      lipstickCount,
      eyeshadowCount,
      blushCount,
      eyebrowCount,
      eyelinerCount
    ] = await Promise.all([
      Lipstick.countDocuments(activeOrMissing),
      Eyeshadow.countDocuments(activeOrMissing),
      Blush.countDocuments(activeOrMissing),
      Eyebrows.countDocuments(activeOrMissing),
      Eyeliner.countDocuments(activeOrMissing)
    ]);

    const totalProducts = lipstickCount + eyeshadowCount + blushCount + eyebrowCount + eyelinerCount;

    res.json({
      totalProducts,
      categories: {
        lipsticks: lipstickCount,
        eyeshadows: eyeshadowCount,
        blushes: blushCount,
        eyebrows: eyebrowCount,
        eyeliners: eyelinerCount
      }
    });
  } catch (error) {
    console.error('❌ BeautyBar Debug - Get stats error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;

// Debug: connection info and counts
router.get('/__debug', async (req, res) => {
  try {
    const info = {
      db: mongoose.connection && mongoose.connection.name,
      host: mongoose.connection && mongoose.connection.host,
    };
    const [lipsticks, eyeshadows, blushes, eyebrows, eyeliners] = await Promise.all([
      Lipstick.countDocuments({}),
      Eyeshadow.countDocuments({}),
      Blush.countDocuments({}),
      Eyebrows.countDocuments({}),
      Eyeliner.countDocuments({})
    ]);
    res.json({ info, counts: { lipsticks, eyeshadows, blushes, eyebrows, eyeliners } });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});
