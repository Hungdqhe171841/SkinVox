const express = require('express');
const router = express.Router();

// Import models
const Lipstick = require('../models/Lipstick');
const Eyeshadow = require('../models/Eyeshadow');
const Blush = require('../models/Blush');
const Eyebrows = require('../models/Eyebrows');
const Eyeliners = require('../models/Eyeliners');

// Get all products by category
router.get('/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const { page = 1, limit = 10, search = '', sort = 'createdAt', order = 'desc' } = req.query;
    
    let Model;
    switch (category) {
      case 'lipsticks':
        Model = Lipstick;
        break;
      case 'eyeshadows':
        Model = Eyeshadow;
        break;
      case 'blush':
        Model = Blush;
        break;
      case 'eyebrows':
        Model = Eyebrows;
        break;
      case 'eyeliners':
        Model = Eyeliners;
        break;
      default:
        return res.status(400).json({ message: 'Invalid category' });
    }

    const query = search ? { $text: { $search: search } } : {};
    const sortObj = { [sort]: order === 'desc' ? -1 : 1 };

    const products = await Model.find(query)
      .sort(sortObj)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('reviews.user', 'username');

    const total = await Model.countDocuments(query);

    res.json({
      products,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ message: 'Failed to fetch products', error: error.message });
  }
});

// Get single product
router.get('/:category/:id', async (req, res) => {
  try {
    const { category, id } = req.params;
    
    let Model;
    switch (category) {
      case 'lipsticks':
        Model = Lipstick;
        break;
      case 'eyeshadows':
        Model = Eyeshadow;
        break;
      case 'blush':
        Model = Blush;
        break;
      case 'eyebrows':
        Model = Eyebrows;
        break;
      case 'eyeliners':
        Model = Eyeliners;
        break;
      default:
        return res.status(400).json({ message: 'Invalid category' });
    }

    const product = await Model.findById(id).populate('reviews.user', 'username');
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ message: 'Failed to fetch product', error: error.message });
  }
});

// Add review to product
router.post('/:category/:id/reviews', async (req, res) => {
  try {
    const { category, id } = req.params;
    const { userId, rating, comment } = req.body;
    
    let Model;
    switch (category) {
      case 'lipsticks':
        Model = Lipstick;
        break;
      case 'eyeshadows':
        Model = Eyeshadow;
        break;
      case 'blush':
        Model = Blush;
        break;
      case 'eyebrows':
        Model = Eyebrows;
        break;
      case 'eyeliners':
        Model = Eyeliners;
        break;
      default:
        return res.status(400).json({ message: 'Invalid category' });
    }

    const product = await Model.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if user already reviewed
    const existingReview = product.reviews.find(review => review.user.toString() === userId);
    if (existingReview) {
      return res.status(400).json({ message: 'User has already reviewed this product' });
    }

    product.reviews.push({
      user: userId,
      rating,
      comment
    });

    // Update average rating
    const totalRating = product.reviews.reduce((sum, review) => sum + review.rating, 0);
    product.rating = totalRating / product.reviews.length;

    await product.save();

    res.json({ message: 'Review added successfully', product });
  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({ message: 'Failed to add review', error: error.message });
  }
});

// Get product shades for AR
router.get('/:category/:id/shades', async (req, res) => {
  try {
    const { category, id } = req.params;
    
    let Model;
    switch (category) {
      case 'lipsticks':
        Model = Lipstick;
        break;
      case 'eyeshadows':
        Model = Eyeshadow;
        break;
      case 'blush':
        Model = Blush;
        break;
      case 'eyebrows':
        Model = Eyebrows;
        break;
      case 'eyeliners':
        Model = Eyeliners;
        break;
      default:
        return res.status(400).json({ message: 'Invalid category' });
    }

    const product = await Model.findById(id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Convert shades Map to array format
    const shades = [];
    if (product.shades && product.shades.size > 0) {
      product.shades.forEach((value, key) => {
        shades.push({
          name: key,
          hex: value,
          rgba: value.includes('rgba') ? value : convertHexToRgba(value)
        });
      });
    } else if (product.color) {
      // Fallback to single color
      shades.push({
        name: product.color,
        hex: product.color,
        rgba: product.color.includes('rgba') ? product.color : convertHexToRgba(product.color)
      });
    }

    res.json({
      success: true,
      shades,
      product: {
        name: product.name,
        brand: product.brand,
        type: product.type || product.category
      }
    });
  } catch (error) {
    console.error('Get product shades error:', error);
    res.status(500).json({ message: 'Failed to fetch product shades', error: error.message });
  }
});

// Helper function to convert hex to rgba
function convertHexToRgba(hex) {
  if (hex.includes('rgba')) return hex;
  
  // Remove # if present
  hex = hex.replace('#', '');
  
  // Convert to RGB
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  // Return with alpha for makeup
  return `rgba(${r}, ${g}, ${b}, 0.7)`;
}

// Search products across all categories
router.get('/search/all', async (req, res) => {
  try {
    const { q: searchTerm, limit = 10 } = req.query;
    
    if (!searchTerm) {
      return res.status(400).json({ message: 'Search term is required' });
    }

    const searchQuery = { $text: { $search: searchTerm } };
    const limitNum = parseInt(limit);

    const [lipsticks, eyeshadows, blush, eyebrows, eyeliners] = await Promise.all([
      Lipstick.find(searchQuery).limit(limitNum),
      Eyeshadow.find(searchQuery).limit(limitNum),
      Blush.find(searchQuery).limit(limitNum),
      Eyebrows.find(searchQuery).limit(limitNum),
      Eyeliners.find(searchQuery).limit(limitNum)
    ]);

    res.json({
      lipsticks,
      eyeshadows,
      blush,
      eyebrows,
      eyeliners,
      total: lipsticks.length + eyeshadows.length + blush.length + eyebrows.length + eyeliners.length
    });
  } catch (error) {
    console.error('Search products error:', error);
    res.status(500).json({ message: 'Failed to search products', error: error.message });
  }
});

module.exports = router;
