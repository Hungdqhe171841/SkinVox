import { useState, useEffect } from 'react'
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

      const response = await fetch(`/api/beautybar/products?${params}`)
      const data = await response.json()
      
      setProducts(data.products || [])
      setTotalPages(data.pagination?.totalPages || 1)
      setFilters({
        brands: data.filters?.brands || [],
        categories: data.filters?.categories || []
      })
    } catch (error) {
      console.error('Error loading products:', error)
    } finally {
      setLoading(false)
    }
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

  const getProductImage = (product) => `/assets/${encodeURIComponent(product.name)}.jpg`;

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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm text-gray-400">/ Affiliate Picks</p>
              <h1 className="mt-1 text-3xl font-bold text-gray-900">SHOP OUR PICKS</h1>
            </div>
            
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="mt-4 lg:mt-0 lg:ml-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search Products"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full lg:w-80 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-64">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                <button
                  onClick={clearFilters}
                  className="text-sm text-pink-600 hover:text-pink-700"
                >
                  Clear all
                </button>
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Categories</h4>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="category"
                      value=""
                      checked={selectedCategory === ''}
                      onChange={(e) => handleFilterChange('category', e.target.value)}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">All</span>
                  </label>
                  {filters.categories.map((category) => (
                    <label key={category} className="flex items-center">
                      <input
                        type="radio"
                        name="category"
                        value={category}
                        checked={selectedCategory === category}
                        onChange={(e) => handleFilterChange('category', e.target.value)}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700 capitalize">{category}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Brand Filter */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Brand</h4>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="brand"
                      value=""
                      checked={selectedBrand === ''}
                      onChange={(e) => handleFilterChange('brand', e.target.value)}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">All</span>
                  </label>
                  {filters.brands.map((brand) => (
                    <label key={brand} className="flex items-center">
                      <input
                        type="radio"
                        name="brand"
                        value={brand}
                        checked={selectedBrand === brand}
                        onChange={(e) => handleFilterChange('brand', e.target.value)}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">{brand}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Price</h4>
                <div className="space-y-2">
                  <input
                    type="number"
                    placeholder="From"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                  <input
                    type="number"
                    placeholder="To"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="bg-white rounded-lg shadow p-4 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center space-x-4">
                  <select
                    value={`${sortBy}-${sortOrder}`}
                    onChange={(e) => handleFilterChange('sort', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="createdAt-desc">Mới nhất</option>
                    <option value="createdAt-asc">Cũ nhất</option>
                    <option value="price-asc">Giá thấp đến cao</option>
                    <option value="price-desc">Giá cao đến thấp</option>
                    <option value="rating-desc">Đánh giá cao nhất</option>
                    <option value="name-asc">Tên A-Z</option>
                    <option value="name-desc">Tên Z-A</option>
                  </select>
                </div>

                <div className="flex items-center space-x-2 mt-4 sm:mt-0">
                  <span className="text-sm text-gray-600">
                    {products.length} products
                  </span>
                  <div className="flex border border-gray-300 rounded-md">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 ${viewMode === 'grid' ? 'bg-pink-100 text-pink-600' : 'text-gray-600'}`}
                    >
                      <Grid className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 ${viewMode === 'list' ? 'bg-pink-100 text-pink-600' : 'text-gray-600'}`}
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Products Grid/List */}
              {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <ShoppingCart className="w-16 h-16 mx-auto" />
                </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No products</h3>
                  <p className="text-gray-600">Try changing filters or search keywords</p>
              </div>
            ) : (
              <>
                <div className={viewMode === 'grid' 
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                  : 'space-y-4'
                }>
                  {products.map((product) => (
                    <div
                      key={`${product.productType}-${product._id}`}
                      className={`bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow ${
                        viewMode === 'list' ? 'flex' : ''
                      }`}
                    >
                      <div className={(viewMode === 'list' ? 'w-48 h-48' : 'aspect-square') + ' relative bg-gray-50 rounded-xl'}>
                        <img
                          data-attempt="0"
                          src={getProductImage(product)}
                          alt={product.name}
                          className="w-full h-full object-cover rounded-xl"
                          onError={(e) => {
                            const img = e.currentTarget;
                            const attempt = parseInt(img.getAttribute('data-attempt') || '0', 10);
                            const name = product?.name || '';
                            if (attempt === 0) {
                              img.setAttribute('data-attempt', '1');
                              const alt1 = `/assets/${encodeURIComponent(sanitizeName(name))}.jpg`;
                              img.src = alt1;
                              return;
                            }
                            if (attempt === 1) {
                              img.setAttribute('data-attempt', '2');
                              const alt2 = `/assets/${encodeURIComponent(name)} copy.jpg`;
                              img.src = alt2;
                              return;
                            }
                            img.onerror = null;
                            img.src = product.image || 'https://via.placeholder.com/300x300';
                          }}
                        />
                        <span className="absolute top-2 right-3 text-[10px] uppercase text-gray-400 tracking-wider">
                          Explore
                        </span>
                      </div>
                      
                      <div className={`p-5 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                        <div className="flex items-start justify-between mb-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(product.productType)}`}>
                            {product.type}
                          </span>
                          <button className="text-gray-400 hover:text-red-500">
                            <Heart className="w-4 h-4" />
                          </button>
                        </div>

                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
                          {product.name}
                        </h3>
                        
                        <p className="text-sm text-gray-600 mb-2">{product.brand || '—'}</p>
                        
                        {product.description && (
                          <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                            {product.description}
                          </p>
                        )}

                        <div className="flex items-center mb-2">
                          <div className="flex items-center">
                            {renderStars(product.rating)}
                          </div>
                          <span className="ml-2 text-sm text-gray-600">
                            ({product.rating})
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-lg sm:text-xl font-bold text-pink-600">
                            {toVnd(product.price)}
                          </span>
                          <div className="flex space-x-2" />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex space-x-2 mt-4">
                          <button className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full hover:from-purple-600 hover:to-pink-600 transition-all duration-200 text-sm">
                            <span className="text-sm font-medium">Try AR</span>
                          </button>
                          <button className="flex-1 bg-pink-600 text-white px-4 py-2 rounded-full hover:bg-pink-700 transition-colors flex items-center justify-center text-sm">
                            <ShoppingCart className="w-4 h-4 mr-1"/>
                            <span className="font-medium">Shop now</span>
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
                                ? 'bg-pink-600 text-white'
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
      </div>
    </div>
  )
}
