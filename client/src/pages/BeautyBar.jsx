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
              <h1 className="text-3xl font-bold text-gray-900">BeautyBar</h1>
              <p className="mt-2 text-gray-600">Khám phá bộ sưu tập mỹ phẩm cao cấp</p>
            </div>
            
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="mt-4 lg:mt-0 lg:ml-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
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
                <h3 className="text-lg font-semibold text-gray-900">Bộ lọc</h3>
                <button
                  onClick={clearFilters}
                  className="text-sm text-pink-600 hover:text-pink-700"
                >
                  Xóa tất cả
                </button>
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Danh mục</h4>
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
                    <span className="text-sm text-gray-700">Tất cả</span>
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
                <h4 className="text-sm font-medium text-gray-900 mb-3">Thương hiệu</h4>
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
                    <span className="text-sm text-gray-700">Tất cả</span>
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
                <h4 className="text-sm font-medium text-gray-900 mb-3">Khoảng giá</h4>
                <div className="space-y-2">
                  <input
                    type="number"
                    placeholder="Từ"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                  <input
                    type="number"
                    placeholder="Đến"
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
                    {products.length} sản phẩm
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
                <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy sản phẩm</h3>
                <p className="text-gray-600">Hãy thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
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
                      className={`bg-white rounded-lg shadow hover:shadow-lg transition-shadow ${
                        viewMode === 'list' ? 'flex' : ''
                      }`}
                    >
                      <div className={viewMode === 'list' ? 'w-48 h-48' : 'aspect-square'}>
                        <img
                          src={product.image || 'https://via.placeholder.com/300x300'}
                          alt={product.name}
                          className="w-full h-full object-cover rounded-t-lg"
                        />
                      </div>
                      
                      <div className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                        <div className="flex items-start justify-between mb-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(product.productType)}`}>
                            {product.type}
                          </span>
                          <button className="text-gray-400 hover:text-red-500">
                            <Heart className="w-4 h-4" />
                          </button>
                        </div>

                        <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
                          {product.name}
                        </h3>
                        
                        <p className="text-sm text-gray-600 mb-2">{product.brand}</p>
                        
                        {product.description && (
                          <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                            {product.description}
                          </p>
                        )}

                        <div className="flex items-center mb-3">
                          <div className="flex items-center">
                            {renderStars(product.rating)}
                          </div>
                          <span className="ml-2 text-sm text-gray-600">
                            ({product.rating})
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-xl font-bold text-pink-600">
                            ${product.price}
                          </span>
                          <div className="flex space-x-2">
                            <button className="p-2 text-gray-400 hover:text-gray-600">
                              <Eye className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex space-x-2 mt-3">
                          <button className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 flex items-center justify-center">
                            <span className="text-sm font-medium">✨ Thử sản phẩm</span>
                          </button>
                          <button className="flex-1 bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition-colors flex items-center justify-center">
                            <ShoppingCart className="w-4 h-4 mr-1" />
                            <span className="text-sm font-medium">Mua ngay</span>
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
