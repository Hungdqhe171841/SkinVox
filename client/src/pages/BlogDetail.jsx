import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Calendar, User, Tag, ArrowLeft, Share2, Heart, ExternalLink } from 'lucide-react'
import '../styles/Blog.css'

export default function BlogDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [blog, setBlog] = useState(null)
  const [relatedBlogs, setRelatedBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [liked, setLiked] = useState(false)

  useEffect(() => {
    loadBlog()
    loadRelatedBlogs()
  }, [id])

  const loadBlog = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/blog/blogs/${id}`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      
      // Ensure blog has required fields with fallbacks
      const processedBlog = {
        ...data,
        title: data.title || 'Không có tiêu đề',
        content: data.content || 'Nội dung không có sẵn.',
        description: data.description || data.excerpt || 'Mô tả không có sẵn.',
        featuredImage: data.featuredImage || '/assets/Ava.jpg',
        images: data.images || [],
        category: data.category || 'general',
        formatType: data.formatType || 1,
        affiliateLinks: data.affiliateLinks || [],
        tags: data.tags || [],
        author: data.author || { name: 'Admin' },
        createdAt: data.createdAt || new Date(),
        viewCount: data.viewCount || 0,
        likes: data.likes || []
      }
      
      setBlog(processedBlog)
    } catch (error) {
      console.error('Error loading blog:', error)
      setBlog(null)
    } finally {
      setLoading(false)
    }
  }

  const loadRelatedBlogs = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/blog/blogs`)
      const data = await response.json()
      setRelatedBlogs(data.blogs || data || [])
    } catch (error) {
      console.error('Error loading related blogs:', error)
      setRelatedBlogs([])
    }
  }

  const handleLike = () => {
    setLiked(!liked)
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: blog.title,
        text: blog.description,
        url: window.location.href
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert('Link đã được copy vào clipboard!')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Không tìm thấy bài viết</h1>
          <Link to="/blog" className="text-blue-600 hover:text-blue-800">
            ← Quay lại danh sách bài viết
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="blog-detail-page">
      {/* Back Button */}
      <div className="blog-detail-back">
        <button 
          onClick={() => navigate('/blog')}
          className="back-btn"
        >
          <ArrowLeft size={16} />
          Quay lại
        </button>
      </div>

      {/* Main Content */}
      <div className="blog-detail-main">
        <div className="blog-detail-grid">
          {/* Article Content */}
          <article className="blog-detail-article">
            {/* Header */}
            <header className="blog-detail-header">
              <div className="blog-detail-meta">
                <span className="blog-detail-category">{blog.category}</span>
                <span className="blog-detail-date">
                  <Calendar size={14} />
                  {new Date(blog.createdAt || blog.publishDate || new Date()).toLocaleDateString('vi-VN')}
                </span>
                <span className="blog-detail-read-time">{Math.ceil((blog.content || '').length / 500)} phút đọc</span>
              </div>
              <h1 className="blog-detail-title">{blog.title}</h1>
              <p className="blog-detail-description">{blog.description || blog.excerpt}</p>
              <div className="blog-detail-author">
                <User size={16} />
                <span>{blog.author?.name || blog.author || 'Admin'}</span>
              </div>
            </header>

            {/* Featured Image */}
            <div className="blog-detail-featured-image">
              <img 
                src={blog.featuredImage || "/assets/Ava.jpg"} 
                alt={blog.title}
                onError={(e) => {
                  console.warn('Featured image failed to load:', e.target.src)
                  e.target.src = "/assets/Ava.jpg"
                }}
                onLoad={() => {
                  console.log('Featured image loaded successfully:', blog.featuredImage)
                }}
              />
            </div>

            {/* Content */}
            <div className="blog-detail-content">
              {(blog.content || '').split('\n').map((paragraph, index) => {
                if (paragraph.startsWith('## ')) {
                  return (
                    <h2 key={index} className="blog-content-h2">
                      {paragraph.replace('## ', '')}
                    </h2>
                  )
                } else if (paragraph.startsWith('### ')) {
                  return (
                    <h3 key={index} className="blog-content-h3">
                      {paragraph.replace('### ', '')}
                    </h3>
                  )
                } else if (paragraph.startsWith('- ')) {
                  return (
                    <li key={index} className="blog-content-li">
                      {paragraph.replace('- ', '')}
                    </li>
                  )
                } else if (paragraph.trim() === '') {
                  return <br key={index} />
                } else {
                  return (
                    <p key={index} className="blog-content-p">
                      {paragraph}
                    </p>
                  )
                }
              })}
            </div>

            {/* Additional Images */}
            {blog.images && blog.images.length > 0 && (
              <div className="blog-detail-gallery">
                <h3>Hình ảnh liên quan</h3>
                <div className="gallery-grid">
                  {blog.images.map((image, index) => (
                    <img 
                      key={index}
                      src={image || "/assets/Ava.jpg"} 
                      alt={`${blog.title} - ${index + 1}`}
                      onError={(e) => {
                        console.warn('Gallery image failed to load:', e.target.src)
                        e.target.src = "/assets/Ava.jpg"
                      }}
                      onLoad={() => {
                        console.log('Gallery image loaded successfully:', image)
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Affiliate Links */}
            {blog.affiliateLinks && blog.affiliateLinks.length > 0 && (
              <div className="blog-detail-affiliate">
                <h3>Sản phẩm liên quan</h3>
                <div className="affiliate-links-list">
                  {blog.affiliateLinks.map((link, index) => (
                    <div key={index} className="affiliate-link-item">
                      <h4>{link.productName}</h4>
                      <p>{link.note}</p>
                      <a 
                        href={link.productUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="affiliate-link-btn"
                      >
                        <ExternalLink size={16} />
                        Xem sản phẩm
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            {blog.tags && blog.tags.length > 0 && (
              <div className="blog-detail-tags">
                <h3>Tags</h3>
                <div className="tags-list">
                  {blog.tags.map((tag, index) => (
                    <span key={index} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="blog-detail-actions">
              <button 
                onClick={handleLike}
                className={`action-btn ${liked ? 'liked' : ''}`}
              >
                <Heart size={16} fill={liked ? 'currentColor' : 'none'} />
                {liked ? 'Đã thích' : 'Thích'}
              </button>
              <button onClick={handleShare} className="action-btn">
                <Share2 size={16} />
                Chia sẻ
              </button>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="blog-detail-sidebar">
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

            {/* Related Articles */}
            <div className="blog-related-articles">
              <h3>Bài viết liên quan</h3>
              <div className="related-articles-list">
                {relatedBlogs
                  .filter(b => b._id !== blog._id && b.category === blog.category)
                  .slice(0, 3)
                  .map((relatedBlog) => (
                    <Link 
                      key={relatedBlog._id} 
                      to={`/blog/${relatedBlog._id}`}
                      className="related-article-item"
                    >
                      <img 
                        src={relatedBlog.featuredImage || "/assets/Ava.jpg"} 
                        alt={relatedBlog.title}
                        onError={(e) => {
                          console.warn('Related blog image failed to load:', e.target.src)
                          e.target.src = "/assets/Ava.jpg"
                        }}
                      />
                      <div>
                        <h4>{relatedBlog.title}</h4>
                        <span>{new Date(relatedBlog.createdAt).toLocaleDateString('vi-VN')}</span>
                      </div>
                    </Link>
                  ))}
              </div>
            </div>

            {/* Newsletter */}
            <div className="blog-newsletter">
              <h3>Đăng ký nhận tin</h3>
              <p>Nhận những bài viết mới nhất và mẹo làm đẹp độc quyền</p>
              <form className="newsletter-form">
                <input
                  type="email"
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
