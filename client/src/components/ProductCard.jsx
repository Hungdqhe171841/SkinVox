import React from 'react';
import { Heart, ShoppingCart, Eye } from 'lucide-react';

function ProductCard({ product, viewMode, onTryAR, renderStars, toVnd }) {
  const getCategoryColor = (category) => {
    const colors = {
      lipstick: 'bg-red-100 text-red-800',
      eyeshadow: 'bg-purple-100 text-purple-800',
      blush: 'bg-pink-100 text-pink-800',
      eyebrow: 'bg-brown-100 text-brown-800',
      eyeliner: 'bg-black-100 text-black-800',
      foundation: 'bg-yellow-100 text-yellow-800',
      concealer: 'bg-orange-100 text-orange-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const handleTryAR = () => {
    onTryAR(product);
  };

  const handleShopNow = () => {
    // Handle shop now action
    console.log('Shop now clicked for:', product.name);
  };

  const handleAddToWishlist = () => {
    // Handle add to wishlist action
    console.log('Add to wishlist clicked for:', product.name);
  };

  return (
    <div className={`product-card ${viewMode}`}>
      {/* Product Image */}
      <div className="product-image-container">
        <img
          src={product.image}
          alt={product.name}
          className="product-image"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
          }}
        />
        
        {/* Overlay Actions */}
        <div className="product-overlay">
          <button 
            className="overlay-btn wishlist-btn"
            onClick={handleAddToWishlist}
            title="Add to Wishlist"
          >
            <Heart className="overlay-icon" />
          </button>
          <button 
            className="overlay-btn view-btn"
            title="Quick View"
          >
            <Eye className="overlay-icon" />
          </button>
        </div>

        {/* Category Badge */}
        <div className="product-badge">
          <span className={`category-badge ${getCategoryColor(product.category)}`}>
            {product.category}
          </span>
        </div>

        {/* Explore Badge */}
        <div className="explore-badge">
          <span>Explore</span>
        </div>
      </div>

      {/* Product Info */}
      <div className="product-info">
        {/* Brand */}
        <p className="product-brand">{product.brand}</p>

        {/* Product Name */}
        <h3 className="product-name">{product.name}</h3>

        {/* Description */}
        {product.description && (
          <p className="product-description">{product.description}</p>
        )}

        {/* Rating */}
        <div className="product-rating">
          <div className="stars">
            {renderStars(product.rating)}
          </div>
          <span className="rating-text">({product.rating})</span>
        </div>

        {/* Price */}
        <div className="product-price">
          <span className="price">{toVnd(product.price)}</span>
        </div>

        {/* Action Buttons */}
        <div className="product-actions">
          <button 
            className="action-btn try-ar-btn"
            onClick={handleTryAR}
          >
            Try AR
          </button>
          <button 
            className="action-btn shop-now-btn"
            onClick={handleShopNow}
          >
            <ShoppingCart className="btn-icon" />
            Shop now
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;

