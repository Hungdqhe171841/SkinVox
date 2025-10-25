import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, User, Tag, ArrowRight, Eye } from 'lucide-react'
import '../styles/Blog.css'

export default function Blog() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [blogs, setBlogs] = useState([])
  const [categories, setCategories] = useState([])
  const [filteredBlogs, setFilteredBlogs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadBlogs()
    loadCategories()
  }, [])

  useEffect(() => {
    console.log('Filtering blogs:', { selectedCategory, blogsCount: blogs.length })
    if (selectedCategory === 'All') {
      setFilteredBlogs(blogs)
    } else {
      const filtered = blogs.filter(blog => {
        console.log('Blog category:', blog.category, 'Selected:', selectedCategory)
        return blog.category === selectedCategory
      })
      console.log('Filtered blogs:', filtered.length)
      setFilteredBlogs(filtered)
    }
  }, [selectedCategory, blogs])

  const loadBlogs = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/blog/blogs`)
      const data = await response.json()
      console.log('Blogs API response:', data)
      console.log('First blog createdAt:', data.blogs?.[0]?.createdAt)
      console.log('First blog date test:', new Date(data.blogs?.[0]?.createdAt))
      setBlogs(data.blogs || data || [])
    } catch (error) {
      console.error('Error loading blogs:', error)
      setBlogs([])
    }
  }

  const loadCategories = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/blog/blog-categories`)
      const data = await response.json()
      console.log('Categories API response:', data)
      
      // Handle new API structure with hierarchical and flat categories
      if (data.flat && Array.isArray(data.flat)) {
        setCategories(data.flat)
      } else if (Array.isArray(data)) {
        // Backward compatibility with old API structure
        setCategories(data)
      } else {
        setCategories([])
      }
    } catch (error) {
      console.error('Error loading categories:', error)
      setCategories([])
    } finally {
      setLoading(false)
    }
  }

  const handleSubscribe = (e) => {
    e.preventDefault()
    const email = e.target.email.value
    alert(`Cảm ơn bạn đã đăng ký với email: ${email}`)
    e.target.reset()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="blog-page">
      {/* Main Content */}
      <div className="blog-main">
        <div className="blog-grid">
          {/* Main Article */}
          <div>
            {/* Hero Section */}
            <div className="blog-hero">
              <h1 className="blog-hero-title">SkinVox Blog</h1>
              <p className="blog-hero-subtitle">
                Khám phá thế giới làm đẹp với những bài viết chuyên sâu, 
                mẹo hay và xu hướng mới nhất từ các chuyên gia.
              </p>
            </div>

            {/* Category Filter - Grouped by parent */}
            <div className="blog-category-filter">
              <button 
                className={`category-btn ${selectedCategory === 'All' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('All')}
              >
                Tất cả
              </button>
              
              {/* Group categories by parent */}
              {categories && Array.isArray(categories) && (() => {
                // Group categories by parent
                const grouped = categories.reduce((acc, category) => {
                  const parent = category.parent || 'Other';
                  if (!acc[parent]) {
                    acc[parent] = [];
                  }
                  acc[parent].push(category);
                  return acc;
                }, {});
                
                return Object.keys(grouped).map((parent) => (
                  <div key={parent} style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
                    {grouped[parent].map((category) => (
                      <button
                        key={category.value || category.name}
                        className={`category-btn ${selectedCategory === (category.value || category.name) ? 'active' : ''}`}
                        onClick={() => setSelectedCategory(category.value || category.name)}
                        style={{ fontSize: '14px', padding: '8px 12px' }}
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>
                ));
              })()}
            </div>

            {/* Blog List */}
            <div className="blog-list">
              {filteredBlogs.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">Không có bài viết nào trong danh mục này.</p>
                </div>
              ) : (
                filteredBlogs.map((blog) => (
                  <article key={blog._id} className="blog-card">
                    <div className="blog-card-image">
                      <img 
                        src={blog.featuredImage || (blog.images && blog.images[0]) || "/assets/Ava.jpg"} 
                        alt={blog.title}
                        onError={(e) => {
                          e.target.src = "/assets/Ava.jpg"
                        }}
                      />
                    </div>
                    <div className="blog-card-content">
                      <div className="blog-card-meta">
                        <span className="blog-category">{blog.category}</span>
                        <span className="blog-date">
                          <Calendar size={14} />
                          {(() => {
                            console.log('Blog date debug:', blog.title, blog.createdAt, new Date(blog.createdAt));
                            return new Date(blog.createdAt).toLocaleDateString('vi-VN');
                          })()}
                        </span>
                      </div>
                      <h2 className="blog-card-title">{blog.title}</h2>
                      <p className="blog-card-description">{blog.excerpt}</p>
                      <div className="blog-card-footer">
                        <div className="blog-card-author">
                          <User size={14} />
                          <span>{blog.author?.name || 'Admin'}</span>
                          <span className="blog-read-time">{Math.ceil(blog.content.length / 500)} phút đọc</span>
                        </div>
                        <Link 
                          to={`/blog/${blog._id}`} 
                          className="blog-read-more"
                        >
                          <Eye size={16} />
                          Xem chi tiết
                          <ArrowRight size={14} />
                        </Link>
                      </div>
                    </div>
                  </article>
                ))
              )}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="blog-sidebar">
            {/* Author Card */}
            <div className="blog-author-card">
              <div className="author-avatar">
                <img src="/assets/Ava.jpg" alt="SkinVox Team" />
              </div>
              <h3>SkinVox Team</h3>
              <p>
                Đội ngũ chuyên gia làm đẹp với nhiều năm kinh nghiệm, 
                luôn cập nhật những xu hướng mới nhất và chia sẻ bí quyết làm đẹp hiệu quả.
              </p>
            </div>

            {/* Latest Articles */}
            <div className="blog-latest-articles">
              <h3>Bài viết mới nhất</h3>
              <div className="latest-articles-list">
                {blogs.slice(0, 3).map((blog) => (
                  <div key={blog._id} className="latest-article-item">
                    <img 
                      src={blog.featuredImage || (blog.images && blog.images[0]) || "/assets/Ava.jpg"} 
                      alt={blog.title}
                      onError={(e) => {
                        e.target.src = "/assets/Ava.jpg"
                      }}
                    />
                    <div>
                      <h4>{blog.title}</h4>
                      <span>{(() => {
                        console.log('Sidebar blog date debug:', blog.title, blog.createdAt, new Date(blog.createdAt));
                        return new Date(blog.createdAt).toLocaleDateString('vi-VN');
                      })()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Newsletter */}
            <div className="blog-newsletter">
              <h3>Đăng ký nhận tin</h3>
              <p>Nhận những bài viết mới nhất và mẹo làm đẹp độc quyền</p>
              <form onSubmit={handleSubscribe} className="newsletter-form">
                <input
                  type="email"
                  name="email"
                  placeholder="Nhập email của bạn"
                  required
                  className="newsletter-input"
                />
                <button type="submit" className="newsletter-btn">
                  Đăng ký
                </button>
              </form>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}