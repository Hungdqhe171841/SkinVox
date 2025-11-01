import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { User, Mail, Calendar, Camera, Save, Edit, Crown, Bookmark, ExternalLink, MessageSquare, Star } from 'lucide-react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'

export default function Profile() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [isEditing, setIsEditing] = useState(false)
  const [savedPosts, setSavedPosts] = useState([])
  const [loadingSaved, setLoadingSaved] = useState(true)
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    avatar: user?.avatar || ''
  })

  useEffect(() => {
    if (user) {
      loadSavedPosts()
    }
  }, [user])

  const loadSavedPosts = async () => {
    try {
      const token = localStorage.getItem('token')
      const apiUrl = import.meta.env.VITE_API_URL || 'https://skinvox-backend.onrender.com'
      const response = await fetch(`${apiUrl}/api/blog/saved-posts`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setSavedPosts(data.blogs || [])
      }
    } catch (error) {
      console.error('Error loading saved posts:', error)
    } finally {
      setLoadingSaved(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    // TODO: Implement profile update API call
    toast.success('Profile updated successfully!')
    setIsEditing(false)
  }

  const handleCancel = () => {
    setFormData({
      username: user?.username || '',
      email: user?.email || '',
      avatar: user?.avatar || ''
    })
    setIsEditing(false)
  }

  // Check if user is premium
  const isPremium = user?.isPremium || false
  const premiumExpiresAt = user?.premiumExpiresAt

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Thông Tin Cá Nhân</h1>
          <p className="text-gray-600 mt-2">
            Quản lý thông tin tài khoản và tùy chọn của bạn
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information Card */}
            <div className="card p-6 bg-white rounded-xl shadow-md">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Thông Tin Cá Nhân</h2>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="btn btn-outline flex items-center"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Chỉnh sửa
                  </button>
                )}
              </div>

              {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                      Tên người dùng
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        className="input pl-10"
                        placeholder="Nhập tên người dùng"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="input pl-10"
                        placeholder="Nhập email"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="avatar" className="block text-sm font-medium text-gray-700 mb-2">
                      URL Avatar
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Camera className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="url"
                        id="avatar"
                        name="avatar"
                        value={formData.avatar}
                        onChange={handleChange}
                        className="input pl-10"
                        placeholder="Nhập URL avatar"
                      />
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <button
                      type="submit"
                      className="btn btn-primary flex items-center"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Lưu thay đổi
                    </button>
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="btn btn-outline"
                    >
                      Hủy
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-20 h-20 bg-gradient-to-br from-rose-100 to-pink-100 rounded-full flex items-center justify-center border-2 border-rose-300">
                      {user?.avatar ? (
                        <img
                          src={user.avatar}
                          alt="Avatar"
                          className="w-20 h-20 rounded-full object-cover"
                        />
                      ) : (
                        <User className="w-10 h-10 text-rose-500" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-semibold text-gray-900">{user?.username}</h3>
                        {isPremium && (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 border border-purple-300">
                            <Crown className="w-3 h-3 mr-1" />
                            Premium
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600">{user?.email}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tên người dùng
                      </label>
                      <p className="text-gray-900">{user?.username}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <p className="text-gray-900">{user?.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Vai trò
                      </label>
                      <p className="text-gray-900 capitalize">
                        {user?.role === 'admin' ? 'Quản trị viên' : 'Người dùng'}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tham gia từ
                      </label>
                      <p className="text-gray-900">
                        {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Trạng thái tài khoản
                      </label>
                      <div className="flex items-center gap-2">
                        {isPremium ? (
                          <div>
                            <span className="inline-flex items-center px-2 py-1 rounded text-sm font-semibold bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800">
                              <Crown className="w-4 h-4 mr-1" />
                              Premium
                            </span>
                            {premiumExpiresAt && (
                              <p className="text-xs text-gray-500 mt-1">
                                Hết hạn: {new Date(premiumExpiresAt).toLocaleDateString('vi-VN')}
                              </p>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-600">Thường</span>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Đăng nhập lần cuối
                      </label>
                      <p className="text-gray-900">
                        {user?.lastLogin ? new Date(user.lastLogin).toLocaleDateString('vi-VN') : 'Chưa có'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Saved Posts Card */}
            <div className="card p-6 bg-white rounded-xl shadow-md">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <Bookmark className="w-5 h-5 text-rose-500" />
                  Bài Viết Đã Lưu
                </h2>
                <span className="text-sm text-gray-500">
                  {savedPosts.length} bài viết
                </span>
              </div>

              {loadingSaved ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-500"></div>
                </div>
              ) : savedPosts.length === 0 ? (
                <div className="text-center py-12">
                  <Bookmark className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">Bạn chưa lưu bài viết nào</p>
                  <Link
                    to="/blog"
                    className="inline-flex items-center text-rose-600 hover:text-rose-700 font-medium"
                  >
                    Khám phá bài viết <ExternalLink className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {savedPosts.map((blog) => (
                    <Link
                      key={blog._id}
                      to={`/blog/${blog._id}`}
                      className="group block p-4 border border-gray-200 rounded-lg hover:border-rose-300 hover:shadow-md transition-all"
                    >
                      <div className="flex gap-4">
                        <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                          <img
                            src={blog.featuredImage || (blog.images && blog.images[0]) || '/assets/Ava.jpg'}
                            alt={blog.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            onError={(e) => {
                              e.target.src = '/assets/Ava.jpg'
                            }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-rose-600 transition-colors">
                            {blog.title}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {new Date(blog.createdAt).toLocaleDateString('vi-VN')}
                            </span>
                            <span className="flex items-center gap-1">
                              <MessageSquare className="w-4 h-4" />
                              {blog.commentCount || 0}
                            </span>
                            {blog.rating > 0 && (
                              <span className="flex items-center gap-1">
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                {blog.rating.toFixed(1)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Account Status Card */}
            <div className="card p-6 bg-white rounded-xl shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Trạng Thái Tài Khoản</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-rose-50 to-pink-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Loại tài khoản</p>
                    <p className="text-lg font-bold text-gray-900 mt-1">
                      {isPremium ? 'Premium' : 'Thường'}
                    </p>
                  </div>
                  {isPremium ? (
                    <Crown className="w-8 h-8 text-purple-600" />
                  ) : (
                    <User className="w-8 h-8 text-gray-400" />
                  )}
                </div>
                
                {isPremium && premiumExpiresAt && (
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-700">Hết hạn vào</p>
                    <p className="text-lg font-semibold text-blue-900 mt-1">
                      {new Date(premiumExpiresAt).toLocaleDateString('vi-VN', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                )}

                {!isPremium && (
                  <button
                    onClick={() => navigate('/premium')}
                    className="w-full btn btn-primary flex items-center justify-center"
                  >
                    <Crown className="w-4 h-4 mr-2" />
                    Nâng cấp Premium
                  </button>
                )}

                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Bài viết đã lưu</span>
                    <span className="font-semibold text-gray-900">{savedPosts.length}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="card p-6 bg-white rounded-xl shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Thao Tác Nhanh</h3>
              <div className="space-y-3">
                <Link
                  to="/blog"
                  className="block w-full btn btn-outline text-center py-2"
                >
                  Khám phá Blog
                </Link>
                <Link
                  to="/beautybar"
                  className="block w-full btn btn-outline text-center py-2"
                >
                  Cửa hàng
                </Link>
                <Link
                  to="/chatbot"
                  className="block w-full btn btn-outline text-center py-2"
                >
                  Chatbot AI
                </Link>
                <Link
                  to="/privacy"
                  className="block w-full btn btn-outline text-center py-2"
                >
                  Chính sách bảo mật
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
