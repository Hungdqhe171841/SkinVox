import React, { useState } from 'react';
import { Search, Filter, ChevronDown } from 'lucide-react';

function ProductFilterBar({ onFilterChange, onSearch }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);

  const categories = [
    'All',
    'Lipstick',
    'Eyeshadow',
    'Blush',
    'Eyebrow',
    'Eyeliner',
    'Foundation',
    'Concealer'
  ];

  const brands = [
    'All',
    'Maybelline',
    'L\'Oreal',
    'Revlon',
    'Covergirl',
    'NYX',
    'Elf',
    'Wet n Wild'
  ];

  const sortOptions = [
    { value: 'newest', label: 'Mới nhất' },
    { value: 'oldest', label: 'Cũ nhất' },
    { value: 'price-low', label: 'Giá thấp đến cao' },
    { value: 'price-high', label: 'Giá cao đến thấp' },
    { value: 'rating', label: 'Đánh giá cao nhất' },
    { value: 'name-asc', label: 'Tên A-Z' },
    { value: 'name-desc', label: 'Tên Z-A' }
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    onFilterChange({ category, brand: selectedBrand, priceRange, sortBy });
  };

  const handleBrandChange = (brand) => {
    setSelectedBrand(brand);
    onFilterChange({ category: selectedCategory, brand, priceRange, sortBy });
  };

  const handleSortChange = (sort) => {
    setSortBy(sort);
    onFilterChange({ category: selectedCategory, brand: selectedBrand, priceRange, sortBy: sort });
  };

  const handlePriceChange = (type, value) => {
    const newPriceRange = { ...priceRange, [type]: value };
    setPriceRange(newPriceRange);
    onFilterChange({ category: selectedCategory, brand: selectedBrand, priceRange: newPriceRange, sortBy });
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedBrand('');
    setPriceRange({ min: '', max: '' });
    setSortBy('newest');
    onFilterChange({ category: '', brand: '', priceRange: { min: '', max: '' }, sortBy: 'newest' });
    onSearch('');
  };

  return (
    <div className="filter-bar">
      {/* Search Bar */}
      <div className="search-section">
        <form onSubmit={handleSearch} className="search-form">
          <div className="search-input-container">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search Products"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </form>
      </div>

      {/* Filter Toggle */}
      <div className="filter-toggle-section">
        <button 
          className="filter-toggle-btn"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter className="filter-icon" />
          <span>Filters</span>
          <ChevronDown className={`chevron ${showFilters ? 'rotated' : ''}`} />
        </button>
      </div>

      {/* Expanded Filters */}
      {showFilters && (
        <div className="expanded-filters">
          <div className="filter-group">
            <h4 className="filter-title">Categories</h4>
            <div className="filter-options">
              {categories.map((category) => (
                <button
                  key={category}
                  className={`filter-option ${selectedCategory === category ? 'active' : ''}`}
                  onClick={() => handleCategoryChange(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <h4 className="filter-title">Brand</h4>
            <div className="filter-options">
              {brands.map((brand) => (
                <button
                  key={brand}
                  className={`filter-option ${selectedBrand === brand ? 'active' : ''}`}
                  onClick={() => handleBrandChange(brand)}
                >
                  {brand}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <h4 className="filter-title">Price Range</h4>
            <div className="price-inputs">
              <input
                type="number"
                placeholder="From"
                value={priceRange.min}
                onChange={(e) => handlePriceChange('min', e.target.value)}
                className="price-input"
              />
              <span className="price-separator">-</span>
              <input
                type="number"
                placeholder="To"
                value={priceRange.max}
                onChange={(e) => handlePriceChange('max', e.target.value)}
                className="price-input"
              />
            </div>
          </div>

          <div className="filter-group">
            <h4 className="filter-title">Sort By</h4>
            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="sort-select"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-actions">
            <button className="clear-filters-btn" onClick={clearFilters}>
              Clear All Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductFilterBar;

