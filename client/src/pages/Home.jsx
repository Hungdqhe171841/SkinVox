import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../HomePage.css'
import { ShoppingCart, Eye, ClipboardCheck, Target, TrendingUp, Link2, Compass, MessageSquare, Star, Sparkles } from 'lucide-react'
import WebsiteReviews from '../components/WebsiteReviews'

const HomePage = () => {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProducts()
    loadBlogs()
  }, [])

  const loadProducts = async () => {
    try {
      console.log('Loading featured products...')
      const apiUrl = import.meta.env.VITE_API_URL || 'https://skinvox-backend.onrender.com'
      const response = await fetch(`${apiUrl}/api/beautybar/products?page=1&limit=4&sortBy=createdAt&sortOrder=desc`)
      console.log('Products response:', response)
      if (response.ok) {
        const data = await response.json()
        console.log('Products data:', data)
        setProducts(data.products || [])
      } else {
        console.error('Products response not OK:', response.status, response.statusText)
      }
    } catch (error) {
      console.error('Error loading products:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadBlogs = async () => {
    try {
      console.log('Loading featured blogs...')
      const apiUrl = import.meta.env.VITE_API_URL || 'https://skinvox-backend.onrender.com'
      const response = await fetch(`${apiUrl}/api/blog/blogs`)
      console.log('Blogs response:', response)
      if (response.ok) {
        const data = await response.json()
        console.log('Blogs data:', data)
        // Filter blogs with formatType 2 (Nổi bật) on the client side
        const allBlogs = data.blogs || data || []
        console.log('All blogs:', allBlogs)
        console.log('All blogs count:', allBlogs.length)
        console.log('FormatType values:', allBlogs.map(b => ({ title: b.title, formatType: b.formatType })))
        // formatType: 2 = "Nổi bật" (featured blogs)
        // Show max 4 blogs
        const featuredBlogs = allBlogs.filter(blog => blog.formatType === 2).slice(0, 4)
        console.log('Featured blogs:', featuredBlogs)
        console.log('Featured blogs count:', featuredBlogs.length)
        setBlogs(featuredBlogs)
      } else {
        console.error('Blogs response not OK:', response.status, response.statusText)
      }
    } catch (error) {
      console.error('Error loading blogs:', error)
    }
  }

  return (
    <div className="homepage-new">
      {/* Hero Section */}
      <section className="hero-section">
        <img 
          src="https://images.unsplash.com/photo-1612817288484-6f916006741a?w=1200&h=600&fit=crop" 
          alt="Beauty Products" 
          className="hero-image"
        />
        <div className="hero-overlay">
          <h1 className="hero-title">Just Like Nature Intended</h1>
          <p className="hero-subtitle">Sản phẩm Hữu cơ Thủ công từ Thiên nhiên</p>
          <button className="hero-cta" onClick={() => navigate('/beautybar')}>
            Mua ngay
            <ShoppingCart className="hero-cta-icon" />
          </button>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="why-choose-us">
        <div className="container">
          <h2 className="section-title">Why Choose Us</h2>
          <p className="section-description">
            Chúng tôi hiểu rằng khi bạn tìm kiếm sản phẩm Skincare, bạn phải đối mặt với hàng ngàn lựa chọn và vô số lời quảng cáo.
          </p>
          
          <div className="features-grid">
            <div className="feature-card">
              <ClipboardCheck className="feature-icon" />
              <h3 className="feature-title">Phân tích Dựa trên Khoa học</h3>
              <p className="feature-description">
                SkinVox đi sâu vào bảng thành phần (INCI), phân tích hoạt chất, độ ổn định và yếu tố có thể gây kích ứng — để bạn biết chính xác mình đang thoa gì lên da.
              </p>
              <a href="#" className="feature-link">Tìm hiểu thêm</a>
            </div>

            <div className="feature-card">
              <Target className="feature-icon" />
              <h3 className="feature-title">Giải pháp Theo Mục Tiêu</h3>
              <p className="feature-description">
                Chúng tôi phân loại sản phẩm theo loại da, tình trạng (mụn, lão hóa, nhạy cảm…) và ngân sách — giúp bạn chỉ mua thứ thật sự hiệu quả cho nhu cầu của mình.
              </p>
              <a href="#" className="feature-link">Tìm hiểu thêm</a>
            </div>

            <div className="feature-card">
              <TrendingUp className="feature-icon" />
              <h3 className="feature-title">Cập nhật Xu hướng & Da liễu</h3>
              <p className="feature-description">
                Đội ngũ SkinVox theo dõi liên tục nghiên cứu da liễu và công nghệ skincare toàn cầu, mang đến góc nhìn chuyên gia và những đột phá mới nhất.
              </p>
              <a href="#" className="feature-link">Tìm hiểu thêm</a>
            </div>

            <div className="feature-card">
              <Link2 className="feature-icon" />
              <h3 className="feature-title">Đánh giá Affiliate Minh bạch</h3>
              <p className="feature-description">
                Bài đánh giá trung thực, không tài trợ. SkinVox luôn ghi rõ liên kết affiliate (nếu có), đảm bảo hoa hồng không ảnh hưởng đến xếp hạng chất lượng sản phẩm.
              </p>
              <a href="#" className="feature-link">Tìm hiểu thêm</a>
            </div>

            <div className="feature-card">
              <Compass className="feature-icon" />
              <h3 className="feature-title">Giá trị Xứng đáng</h3>
              <p className="feature-description">
                Chúng tôi giúp bạn đánh giá hiệu quả–chi phí thực sự, chỉ ra đâu là khoản "đầu tư dài hạn" đáng tiền và đâu chỉ là lời quảng cáo.
              </p>
              <a href="#" className="feature-link">Tìm hiểu thêm</a>
            </div>

            <div className="feature-card">
              <Sparkles className="feature-icon" />
              <h3 className="feature-title">Công nghệ tối ưu</h3>
              <p className="feature-description">
                Đội ngũ vận hành chuyên môn của SkinVox nâng cấp tối ưu, tích hợp AR và công nghệ Chatbox để mang lại trải nghiệm "cá nhân hóa" tốt nhất cho khách hàng.
              </p>
              <a href="#" className="feature-link">Tìm hiểu thêm</a>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="container">
          <h2 className="section-title">What Our Customer Said</h2>
          <div className="testimonial-carousel">
            <button className="carousel-btn prev">‹</button>
            <div className="testimonial-slide">
              <p className="testimonial-text">
                "Sản phẩm chăm sóc da của bạn định nghĩa lại sự sang trọng, mang lại kết quả rõ ràng nói lên tất cả."
              </p>
              <div className="testimonial-author">
                <img 
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" 
                  alt="Customer" 
                  className="testimonial-avatar"
                />
                <div>
                  <h4 className="author-name">Jonathan Taylor</h4>
                  <p className="author-title">CEO tại Creativex</p>
                </div>
              </div>
            </div>
            <button className="carousel-btn next">›</button>
          </div>
        </div>
      </section>

      {/* Popular Products Section */}
      <section className="popular-products">
        <div className="container">
          <h2 className="section-title">Most Popular Product</h2>
          <p className="section-description">
          “Bộ sưu tập sản phẩm nổi bật tháng này mang đến trải nghiệm làm đẹp toàn diện — từ serum dưỡng da, kẻ mắt chống trôi đến son dưỡng mềm mịn, giúp bạn tự tin tỏa sáng mỗi ngày.”
          </p>
          
          {loading ? (
            <div className="loading-text">Đang tải sản phẩm...</div>
          ) : products.length === 0 ? (
            <div className="no-products">Không có sản phẩm</div>
                     ) : (
             <div className={`products-grid ${products.length > 0 && products.length < 4 ? 'products-grid-center' : ''}`}>
               {products.map((product) => (
                <div key={product._id} className="product-card">
                  <a href="#" className="explore-link">Khám phá</a>
                  <img 
                    src={product.image || 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=300&h=300&fit=crop'} 
                    alt={product.name}
                    className="product-image"
                  />
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-price">{product.price?.toLocaleString('vi-VN')} VND</p>
                  <div className="product-actions">
                    <button className="btn-ar">
                      <Eye className="btn-icon" />
                      Thử AR
                    </button>
                    <button className="btn-shop">
                      <ShoppingCart className="btn-icon" />
                      Mua ngay
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="view-all-cta">
            <button className="btn-view-all" onClick={() => navigate('/beautybar')}>
              Xem tất cả sản phẩm skincare
            </button>
          </div>
        </div>
      </section>

      {/* Featured Blogs Section */}
      <section className="blog-posts-section">
        <div className="container">
          <h2 className="section-title">Keep Updated With Our Beauty blog</h2>
          
                     <div className="blog-grid">
             {blogs.length > 0 ? (
               blogs.map((blog) => (
                 <article key={blog._id} className="blog-card" onClick={() => navigate(`/blog/${blog._id}`)}>
                   <div className="blog-image">
                     <img 
                       src={blog.featuredImage || blog.images?.[0] || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop'} 
                       alt={blog.title}
                       onError={(e) => {
                         e.target.src = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop'
                       }}
                     />
                     <div className="blog-date">
                       {new Date(blog.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                     </div>
                   </div>
                   <h3 className="blog-title">{blog.title}</h3>
                   <p className="blog-description">
                     {blog.description || 'Đọc thêm về bài viết nổi bật này...'}
                   </p>
                   <div className="blog-stats" style={{ display: 'flex', gap: '16px', marginTop: '12px', fontSize: '14px', color: '#666' }}>
                     <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                       <MessageSquare size={16} />
                       <span>{blog.commentCount || 0} bình luận</span>
                     </div>
                     <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                       <Star size={16} className={blog.rating > 0 ? 'fill-yellow-400 text-yellow-400' : ''} />
                       <span>{blog.rating ? blog.rating.toFixed(1) : '0.0'} ({blog.ratingCount || 0})</span>
                     </div>
                   </div>
                 </article>
               ))
             ) : (
               <div className="loading-text">Đang tải blog nổi bật...</div>
             )}
           </div>
        </div>
      </section>

      {/* Website Reviews Section - What Our Customer Said */}
      <WebsiteReviews />

      {/* Appendix Section */}
      <section className="appendix-section">
        <div className="container">
          <h2 className="section-title">Resources & Guides</h2>
          <div className="appendix-grid">
            <div className="appendix-card">
              <h3 className="appendix-title">User Guide</h3>
              <ul className="appendix-list">
                <li>Cách chọn sản phẩm phù hợp với loại da của bạn</li>
                <li>Quy trình chăm sóc da cơ bản</li>
                <li>Mẹo trang điểm tự nhiên</li>
                <li>Bảo quản sản phẩm làm đẹp</li>
              </ul>
            </div>

            <div className="appendix-card">
              <h3 className="appendix-title">Resources</h3>
              <ul className="appendix-list">
                <li>Video hướng dẫn chăm sóc da</li>
                <li>E-book quy trình chăm sóc da</li>
                <li>Bảng kiểm tra lựa chọn sản phẩm</li>
                <li>Lịch chăm sóc da theo mùa</li>
              </ul>
            </div>

            <div className="appendix-card">
              <h3 className="appendix-title">Useful Links</h3>
              <ul className="appendix-list">
                <li>Blog làm đẹp chuyên sâu</li>
                <li>Chia sẻ kinh nghiệm cộng đồng</li>
                <li>Tư vấn chuyên gia trực tuyến</li>
                <li>Khóa học làm đẹp miễn phí</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage
