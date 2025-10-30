import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { 
  Users, 
  BarChart3, 
  Settings, 
  Shield, 
  Activity,
  TrendingUp,
  UserCheck,
  AlertCircle,
  FileText,
  Plus,
  Edit,
  Trash2,
  Eye,
  Tag,
  Calendar,
  Search,
  Filter
} from 'lucide-react'
import BlogForm from '../components/BlogForm'
import { useAnalytics, useTrackAdminAction } from '../hooks/useAnalytics'

export default function AdminDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [blogs, setBlogs] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [showBlogForm, setShowBlogForm] = useState(false)
  const [editingBlog, setEditingBlog] = useState(null)
  const [showCategoryForm, setShowCategoryForm] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [newCategory, setNewCategory] = useState({
    name: '',
    description: '',
    parent: '',
    subcategory: '',
    children: []
  })
  const [dashboardStats, setDashboardStats] = useState({
    overview: {
      totalUsers: 0,
      totalBlogs: 0,
      totalReviews: 0,
      totalCategories: 0,
      newUsersThisMonth: 0
    },
    products: {
      total: 0,
      lipsticks: 0,
      eyeshadows: 0,
      blush: 0,
      eyebrows: 0,
      eyeliners: 0
    },
    recentActivity: {
      users: [],
      blogs: [],
      reviews: []
    }
  })
  
  // Google Analytics hooks
  useAnalytics()
  const { trackAdminLogin, trackBlogCreate, trackBlogUpdate, trackBlogDelete } = useTrackAdminAction()

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/')
    } else {
      // Track admin login
      trackAdminLogin()
    }
  }, [user, navigate, trackAdminLogin])

  // Load dashboard stats on mount
  useEffect(() => {
    if (user && user.role === 'admin') {
      loadDashboardStats()
    }
  }, [user])

  // Load blogs when blog management tab is active
  useEffect(() => {
    if (activeTab === 'blogs') {
      loadBlogs()
      loadCategories()
    }
    if (activeTab === 'categories') {
      loadCategories()
    }
  }, [activeTab])

  const loadDashboardStats = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/dashboard`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      const data = await response.json()
      console.log('Dashboard stats loaded:', data)
      setDashboardStats(data)
    } catch (error) {
      console.error('Error loading dashboard stats:', error)
    }
  }

  const loadBlogs = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/blogs`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      const data = await response.json()
      console.log('Admin blogs API response:', data)
      console.log('First blog data:', data.blogs?.[0])
      setBlogs(data.blogs || [])
    } catch (error) {
      console.error('Error loading blogs:', error)
      // Fallback to public blog API if admin API fails
      try {
        const fallbackResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/blog/blogs`)
        const fallbackData = await fallbackResponse.json()
        console.log('Fallback blogs API response:', fallbackData)
        setBlogs(fallbackData.blogs || [])
      } catch (fallbackError) {
        console.error('Fallback API also failed:', fallbackError)
        setBlogs([])
      }
    } finally {
      setLoading(false)
    }
  }

  const loadCategories = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/categories`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      const data = await response.json()
      console.log('Admin categories API response:', data)
      
      // Handle new API structure with hierarchical and flat categories
      if (data.flat && Array.isArray(data.flat)) {
        setCategories(data.flat)
      } else if (data.categories && Array.isArray(data.categories)) {
        setCategories(data.categories)
      } else {
        setCategories([])
      }
    } catch (error) {
      console.error('Error loading categories:', error)
      // Fallback to public categories API
      try {
        const fallbackResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/blog/blog-categories`)
        const fallbackData = await fallbackResponse.json()
        console.log('Fallback categories API response:', fallbackData)
        
        // Handle new API structure
        if (fallbackData.flat && Array.isArray(fallbackData.flat)) {
          setCategories(fallbackData.flat)
        } else if (Array.isArray(fallbackData)) {
          setCategories(fallbackData)
        } else {
          setCategories([])
        }
      } catch (fallbackError) {
        console.error('Fallback categories API also failed:', fallbackError)
        setCategories([])
      }
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const handleCreateBlog = () => {
    console.log('Creating blog, categories:', categories)
    setEditingBlog(null)
    setShowBlogForm(true)
  }

  const handleEditBlog = (blog) => {
    setEditingBlog(blog)
    setShowBlogForm(true)
  }

  const handleDeleteBlog = async (blogId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bài viết này?')) {
      try {
        const blog = blogs.find(b => b._id === blogId)
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/blogs/${blogId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })
        
        if (response.ok) {
          // Track blog delete
          if (blog) {
            trackBlogDelete(blog.title, blog._id)
          }
          loadBlogs() // Reload blogs
          alert('Xóa bài viết thành công!')
        } else {
          alert('Có lỗi xảy ra khi xóa bài viết!')
        }
      } catch (error) {
        console.error('Error deleting blog:', error)
        alert('Có lỗi xảy ra khi xóa bài viết!')
      }
    }
  }

  const handleSaveBlog = async (blogData) => {
    try {
      const url = editingBlog 
        ? `${import.meta.env.VITE_API_URL}/api/admin/blogs/${editingBlog._id}`
        : `${import.meta.env.VITE_API_URL}/api/admin/blogs`
      
      const method = editingBlog ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(blogData)
      })
      
      if (response.ok) {
        // Track blog create/update
        if (editingBlog) {
          trackBlogUpdate(blogData.title, editingBlog._id)
        } else {
          trackBlogCreate(blogData.title)
        }
        
        setShowBlogForm(false)
        setEditingBlog(null)
        loadBlogs() // Reload blogs
        alert(editingBlog ? 'Cập nhật bài viết thành công!' : 'Tạo bài viết thành công!')
      } else {
        const errorData = await response.json()
        alert(`Có lỗi xảy ra: ${errorData.message}`)
      }
    } catch (error) {
      console.error('Error saving blog:', error)
      alert('Có lỗi xảy ra khi lưu bài viết!')
    }
  }

  const handleCancelBlogForm = () => {
    setShowBlogForm(false)
    setEditingBlog(null)
  }

  if (!user || user.role !== 'admin') {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Tabs */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'dashboard'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                <BarChart3 className="w-4 h-4 mr-2" />
                Dashboard
              </div>
            </button>
            <button
              onClick={() => setActiveTab('blogs')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'blogs'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                <FileText className="w-4 h-4 mr-2" />
                Blog Management
              </div>
            </button>
            <button
              onClick={() => setActiveTab('categories')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'categories'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                <Tag className="w-4 h-4 mr-2" />
                Categories
              </div>
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'users'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-2" />
                Users
              </div>
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <>
            {/* Welcome Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Welcome back, {user.username}!
              </h2>
              <p className="text-gray-600">
                Manage your SkinVox platform from this admin dashboard.
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Users</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {dashboardStats.overview.totalUsers.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <FileText className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Blogs</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {dashboardStats.overview.totalBlogs.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Products</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {dashboardStats.products.total.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Activity className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Reviews</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {dashboardStats.overview.totalReviews.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <button 
                      onClick={() => setActiveTab('blogs')}
                      className="w-full flex items-center p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <FileText className="w-5 h-5 text-gray-400 mr-3" />
                      <span className="text-gray-700">Manage Blogs</span>
                    </button>
                    <button 
                      onClick={() => setActiveTab('categories')}
                      className="w-full flex items-center p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <Tag className="w-5 h-5 text-gray-400 mr-3" />
                      <span className="text-gray-700">Manage Categories</span>
                    </button>
                    <button 
                      onClick={() => setActiveTab('users')}
                      className="w-full flex items-center p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <Users className="w-5 h-5 text-gray-400 mr-3" />
                      <span className="text-gray-700">Manage Users</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    {dashboardStats.recentActivity.blogs.slice(0, 3).map((blog, idx) => (
                      <div key={blog._id} className="flex items-center text-sm">
                        <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                        <span className="text-gray-600 truncate flex-1">
                          Blog: {blog.title}
                        </span>
                        <span className="text-gray-400 ml-2">
                          {new Date(blog.createdAt).toLocaleDateString('vi-VN')}
                        </span>
                      </div>
                    ))}
                    {dashboardStats.recentActivity.users.slice(0, 2).map((user, idx) => (
                      <div key={user._id} className="flex items-center text-sm">
                        <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                        <span className="text-gray-600 truncate flex-1">
                          User: {user.username} registered
                        </span>
                        <span className="text-gray-400 ml-2">
                          {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                        </span>
                      </div>
                    ))}
                    {dashboardStats.recentActivity.blogs.length === 0 && 
                     dashboardStats.recentActivity.users.length === 0 && (
                      <p className="text-sm text-gray-500 text-center py-4">No recent activity</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Blog Management Tab */}
        {activeTab === 'blogs' && (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Blog Management</h2>
                <p className="text-gray-600">Create, edit, and manage blog posts</p>
              </div>
              <button 
                onClick={handleCreateBlog}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Blog
              </button>
            </div>

            {/* Search and Filter */}
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search blogs..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Status</option>
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                  <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </button>
                </div>
              </div>
            </div>

            {/* Blog List */}
            <div className="bg-white rounded-lg shadow">
              {loading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Loading blogs...</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Title
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Category
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Format
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Author
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Created
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {blogs.map((blog) => (
                        <tr key={blog._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {blog.title}
                                </div>
                                <div className="text-sm text-gray-500 truncate max-w-xs">
                                  {blog.excerpt}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {blog.category}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                              {(() => {
                                const formatTypes = {
                                  1: 'Thường',
                                  2: 'Nổi bật',
                                  3: 'Hướng dẫn',
                                  4: 'Đánh giá',
                                  5: 'Xu hướng'
                                };
                                return formatTypes[blog.formatType] || 'Thường';
                              })()}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              blog.status === 'published' ? 'bg-green-100 text-green-800' :
                              blog.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {blog.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {blog.author?.name || 'Admin'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(blog.createdAt).toLocaleDateString('vi-VN')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button 
                                onClick={() => {
                                  console.log('Opening blog:', blog._id, blog.title)
                                  const url = `${window.location.origin}/blog/${blog._id}`
                                  console.log('Blog URL:', url)
                                  window.open(url, '_blank')
                                }}
                                className="text-blue-600 hover:text-blue-900"
                                title="Xem bài viết"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => handleEditBlog(blog)}
                                className="text-indigo-600 hover:text-indigo-900"
                                title="Chỉnh sửa"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => handleDeleteBlog(blog._id)}
                                className="text-red-600 hover:text-red-900"
                                title="Xóa"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Categories Tab */}
        {activeTab === 'categories' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Category Management</h2>
                <p className="text-gray-600">Organize blog content with hierarchical categories</p>
              </div>
              <button 
                onClick={() => setShowCategoryForm(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Category
              </button>
            </div>

            {/* Categories List */}
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Blog Categories</h3>
                  
                  {categories.length === 0 ? (
                    <div className="text-center py-8">
                      <Tag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No categories found. Create your first category!</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Group categories by parent */}
                      {Array.from(new Set(categories.map(cat => cat.parent))).map(parentName => (
                        <div key={parentName} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center">
                              <Tag className="w-5 h-5 text-blue-600 mr-2" />
                              <h4 className="font-semibold text-gray-900">{parentName}</h4>
                            </div>
                            <span className="text-sm text-gray-500">
                              {categories.filter(c => c.parent === parentName).length} subcategories
                            </span>
                          </div>
                          
                          {/* Main category description */}
                          {categories.find(c => c.name === parentName)?.description && (
                            <p className="text-sm text-gray-600 mb-3">
                              {categories.find(c => c.name === parentName).description}
                            </p>
                          )}
                          
                          {/* Subcategories */}
                          <div className="flex flex-wrap gap-2 mt-2">
                            {categories
                              .filter(cat => cat.parent === parentName && cat.name !== parentName)
                              .map(subcat => (
                                <span
                                  key={subcat.value}
                                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                                >
                                  {subcat.name}
                                </span>
                              ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Category Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Tag className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Categories</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {Array.from(new Set(categories.map(cat => cat.parent))).length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Tag className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Subcategories</p>
                    <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <FileText className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Blog Posts</p>
                    <p className="text-2xl font-bold text-gray-900">{blogs.length}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
                <p className="text-gray-600">Manage user accounts and permissions</p>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow text-center">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">User Management</h3>
              <p className="text-gray-600">User management interface will be implemented here.</p>
            </div>
          </div>
        )}
      </main>
      
      {/* Blog Form Modal */}
      {showBlogForm && (
        <BlogForm
          blog={editingBlog}
          onSave={handleSaveBlog}
          onCancel={handleCancelBlogForm}
          categories={categories}
          isEditing={!!editingBlog}
        />
      )}

      {/* Category Form Modal */}
      {showCategoryForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  {editingCategory ? 'Edit Category' : 'Create New Category'}
                </h3>
                <button
                  onClick={() => {
                    setShowCategoryForm(false)
                    setEditingCategory(null)
                    setNewCategory({
                      name: '',
                      description: '',
                      parent: '',
                      subcategory: '',
                      children: []
                    })
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={(e) => {
                e.preventDefault()
                // Handle category creation/update
                console.log('Creating category:', newCategory)
                alert('Category creation functionality will be implemented with backend API')
                setShowCategoryForm(false)
              }} className="space-y-6">
                {/* Category Type Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category Type
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="categoryType"
                        value="main"
                        checked={newCategory.parent === ''}
                        onChange={() => setNewCategory({ ...newCategory, parent: '', subcategory: '' })}
                        className="mr-2"
                      />
                      Main Category
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="categoryType"
                        value="sub"
                        checked={newCategory.parent !== ''}
                        onChange={() => setNewCategory({ ...newCategory, parent: 'select' })}
                        className="mr-2"
                      />
                      Subcategory
                    </label>
                  </div>
                </div>

                {/* Parent Category Selection (if subcategory) */}
                {newCategory.parent !== '' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Parent Category
                    </label>
                    <select
                      value={newCategory.parent}
                      onChange={(e) => setNewCategory({ ...newCategory, parent: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="select">Select parent category...</option>
                      {Array.from(new Set(categories.map(cat => cat.parent))).map(parentName => (
                        <option key={parentName} value={parentName}>{parentName}</option>
                      ))}
                      <option value="Skincare">Skincare</option>
                      <option value="Makeup">Makeup</option>
                    </select>
                  </div>
                )}

                {/* Category Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    value={newCategory.name}
                    onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                    placeholder="e.g., Skincare, Makeup Tips"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* Category Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={newCategory.description}
                    onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                    placeholder="Brief description of this category..."
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Children (comma-separated) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Child Categories (optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Da thường, Da khô, Da dầu (comma-separated)"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    onChange={(e) => {
                      const children = e.target.value.split(',').map(c => c.trim()).filter(c => c)
                      setNewCategory({ ...newCategory, children })
                    }}
                  />
                  <p className="text-sm text-gray-500 mt-1">Separate multiple children with commas</p>
                </div>

                {/* Preview */}
                {newCategory.name && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
                    <div className="flex items-center">
                      <Tag className="w-4 h-4 text-blue-600 mr-2" />
                      <span className="font-medium">
                        {newCategory.parent && newCategory.parent !== 'select' && `${newCategory.parent} > `}
                        {newCategory.name}
                      </span>
                    </div>
                    {newCategory.description && (
                      <p className="text-sm text-gray-600 mt-2">{newCategory.description}</p>
                    )}
                    {newCategory.children.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {newCategory.children.map((child, idx) => (
                          <span key={idx} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            {child}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCategoryForm(false)
                      setEditingCategory(null)
                      setNewCategory({
                        name: '',
                        description: '',
                        parent: '',
                        subcategory: '',
                        children: []
                      })
                    }}
                    className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    {editingCategory ? 'Update Category' : 'Create Category'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

