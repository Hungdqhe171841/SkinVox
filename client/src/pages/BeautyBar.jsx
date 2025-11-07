import { useState, useEffect } from 'react'
import ARModal from '../makeup/components/ARModal'
import { useAnalytics, useTrackProductInteraction } from '../hooks/useAnalytics'
import { getProductImage, handleImageError } from '../utils/imageUtils'
import '../styles/ProductPage.css'
import { 
  Search, 
  Filter, 
  Star, 
  ShoppingCart, 
  Heart,
  Eye,
  ChevronLeft,
  ChevronRight,
  Grid,
  List
} from 'lucide-react'

export default function BeautyBar() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedBrand, setSelectedBrand] = useState('')
  const [priceRange, setPriceRange] = useState({ min: '', max: '' })
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState('desc')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [viewMode, setViewMode] = useState('grid')
  const [filters, setFilters] = useState({ brands: [], categories: [] })
  const [showAR, setShowAR] = useState(false)
  const [arProduct, setArProduct] = useState(null)
  
  // Google Analytics hooks
  useAnalytics()
  const { trackProductView, trackARView } = useTrackProductInteraction()

  useEffect(() => {
    loadProducts()
  }, [currentPage, selectedCategory, selectedBrand, priceRange, sortBy, sortOrder, searchTerm])

  const loadProducts = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: currentPage,
        limit: 12,
        ...(selectedCategory && { category: selectedCategory }),
        ...(selectedBrand && { brand: selectedBrand }),
        ...(priceRange.min && { minPrice: priceRange.min }),
        ...(priceRange.max && { maxPrice: priceRange.max }),
        ...(searchTerm && { search: searchTerm }),
        sortBy,
        sortOrder
      })

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/beautybar/products?${params}`)
      
      // Handle different response statuses
      if (!response.ok) {
        if (response.status === 429) {
          console.warn('⚠️ Rate limit reached. Please try again in a moment.')
          // Wait 2 seconds and retry once
          await new Promise(resolve => setTimeout(resolve, 2000))
          const retryResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/beautybar/products?${params}`)
          if (retryResponse.ok) {
            const retryData = await retryResponse.json()
            setProducts(retryData.products || [])
            setTotalPages(retryData.pagination?.totalPages || 1)
            setFilters({
              brands: retryData.filters?.brands || [],
              categories: retryData.filters?.categories || []
            })
            return
          }
        }
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      
      setProducts(data.products || [])
      setTotalPages(data.pagination?.totalPages || 1)
      setFilters({
        brands: data.filters?.brands || [],
        categories: data.filters?.categories || []
      })
    } catch (error) {
      console.error('Error loading products:', error)
      // Set empty state on error
      setProducts([])
      setTotalPages(1)
      setFilters({ brands: [], categories: [] })
    } finally {
      setLoading(false)
    }
  }

  const handleOpenAR = (product) => {
    const supported = ['lipstick', 'eyeliner', 'eyebrows', 'blush', 'eyeshadow']
    const type = (product?.productType || '').toLowerCase()
    if (!supported.includes(type)) {
      alert('AR is not supported for this product type yet.')
      return
    }
    
    // Track AR view
    trackARView(product.name, product.productType)
    
    setArProduct(product)
    setShowAR(true)
  }

  const handleCloseAR = () => {
    setShowAR(false)
    setArProduct(null)
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setCurrentPage(1)
    loadProducts()
  }

  const handleFilterChange = (filterType, value) => {
    setCurrentPage(1)
    switch (filterType) {
      case 'category':
        setSelectedCategory(value)
        break
      case 'brand':
        setSelectedBrand(value)
        break
      case 'price':
        setPriceRange(value)
        break
      case 'sort':
        const [sort, order] = value.split('-')
        setSortBy(sort)
        setSortOrder(order)
        break
    }
  }

  const clearFilters = () => {
    setSelectedCategory('')
    setSelectedBrand('')
    setPriceRange({ min: '', max: '' })
    setSearchTerm('')
    setCurrentPage(1)
  }

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ))
  }

  const toVnd = (num) => {
    if (typeof num !== 'number') return '—'
    return num.toLocaleString('vi-VN') + ' VND'
  }

  // Prefer local asset by product name; fallback to product.image, then placeholder
  const sanitizeName = (name) => {
    return name
      .replace(/[®™©]/g, '')
      .replace(/[^a-zA-Z0-9\s\-_.]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  };

  const getProductImageUrl = (product) => {
    return getProductImage(product.image, 'No Image');
  };

  const getCategoryColor = (category) => {
    const colors = {
      lipstick: 'bg-red-100 text-red-800',
      eyeshadow: 'bg-purple-100 text-purple-800',
      blush: 'bg-pink-100 text-pink-800',
      eyebrows: 'bg-brown-100 text-brown-800',
      eyeliner: 'bg-black-100 text-black-800'
    }
    return colors[category] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="product-page">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Section Title */}
        <div className="product-header">
          <p className="featured-title">/ Affiliate Picks</p>
          <h1 className="our-products-heading">SHOP OUR PICKS</h1>
        </div>

        {/* Filter Bar */}
        <div className="filter-bar-wrapper">
          <div className="filter-bar">
            {/* Categories Dropdown */}
            <select
              value={selectedCategory || ''}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="filter-select"
            >
              <option value="">Categories</option>
              {filters.categories.map((category) => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>

            {/* Brand Dropdown */}
            <select
              value={selectedBrand || ''}
              onChange={(e) => handleFilterChange('brand', e.target.value)}
              className="filter-select"
            >
              <option value="">Brand</option>
              {filters.brands.filter(brand => brand).map((brand) => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
            </select>

            {/* Price Range Inputs */}
            <div className="price-range-inputs">
              <input
                type="number"
                placeholder="Min Price"
                value={priceRange.min}
                onChange={(e) => handleFilterChange('price', { ...priceRange, min: e.target.value })}
                className="filter-search"
                min="0"
              />
              <span className="price-separator">-</span>
              <input
                type="number"
                placeholder="Max Price"
                value={priceRange.max}
                onChange={(e) => handleFilterChange('price', { ...priceRange, max: e.target.value })}
                className="filter-search"
                min="0"
              />
            </div>
            
            {/* Search Input */}
                <input
                  type="text"
                  placeholder="Search Products"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
              className="filter-search"
                />
        </div>
      </div>

        {/* Product Grid */}
        <div className="w-full">

          {/* Products Grid */}
              {loading ? (
              <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600"></div>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No products</h3>
                  <p className="text-gray-600">Try changing filters or search keywords</p>
              </div>
            ) : (
              <>
              <div className="product-grid">
                  {products.map((product) => (
                    <div
                      key={`${product.productType}-${product._id}`}
                    className="product-card"
                    >
                    <div className="product-image-container">
                        <img
                          src={getProductImageUrl(product)}
                          alt={product.name}
                        className="product-image"
                          onError={(e) => handleImageError(e, 'No Image')}
                      />
                      <span className="explore-badge">
                          Explore
                        </span>
                      </div>
                      
                    <div className="product-info">
                      <h3 className="product-name">
                          {product.name}
                        </h3>
                        
                      {product.brand && (
                        <p className="product-brand">
                          {product.brand}
                          </p>
                        )}

                      <p className="product-price">
                        {product.price ? toVnd(product.price) : 'Price not available'}
                      </p>

                        {/* Action Buttons */}
                      <div className="action-buttons">
                          <button
                            onClick={() => handleOpenAR(product)}
                          className="try-ar-btn"
                          >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                          </svg>
                          Try AR
                          </button>
                        <button className="shop-now-btn">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                          </svg>
                          Shop now
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center mt-8">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        const page = i + 1
                        return (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`px-3 py-2 rounded-lg ${
                              currentPage === page
                              ? 'bg-gray-800 text-white'
                                : 'border border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            {page}
                          </button>
                        )
                      })}
                      
                      <button
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
        </div>
      </div>

      {showAR && (
        <ARModal product={arProduct} onClose={handleCloseAR} />
      )}
    </div>
  )
}
