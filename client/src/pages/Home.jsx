import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../HomePage.css'
import { ShoppingCart, Eye, ClipboardCheck, Target, TrendingUp, Link2, Compass } from 'lucide-react'

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
      const response = await fetch(`${apiUrl}/api/beautybar/products?page=1&limit=6&sortBy=createdAt&sortOrder=desc`)
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
      const response = await fetch(`${apiUrl}/api/blogs?formatType=nổi bật&limit=3`)
      console.log('Blogs response:', response)
      if (response.ok) {
        const data = await response.json()
        console.log('Blogs data:', data)
        setBlogs(data.blogs || data || [])
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
          <p className="hero-subtitle">Handcrafted Organic Soaps & Candles</p>
          <button className="hero-cta" onClick={() => navigate('/beautybar')}>
            Shop now
            <ShoppingCart className="hero-cta-icon" />
          </button>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="why-choose-us">
        <div className="container">
          <h2 className="section-title">Why Choose Us</h2>
          <p className="section-description">
            We understand that when you're looking for Skincare products, you're faced with thousands of options and tons of hype.
          </p>
          
          <div className="features-grid">
            <div className="feature-card">
              <ClipboardCheck className="feature-icon" />
              <h3 className="feature-title">Science-Backed Analysis</h3>
              <p className="feature-description">
                We deep-dive into the INCI List, analyzing active ingredients, stability, and potential irritants. 
                You know exactly what you're putting on your skin.
              </p>
              <a href="#" className="feature-link">Read More</a>
            </div>

            <div className="feature-card">
              <Target className="feature-icon" />
              <h3 className="feature-title">Targeted Solutions</h3>
              <p className="feature-description">
                We categorize products by skin type, condition (acne, aging, sensitivity), and budget. 
                Buy only what truly works for your needs.
              </p>
              <a href="#" className="feature-link">Read More</a>
            </div>

            <div className="feature-card">
              <TrendingUp className="feature-icon" />
              <h3 className="feature-title">Trend & Dermatology Updates</h3>
              <p className="feature-description">
                Our team tracks the latest dermatology research and global skincare technology. 
                You get current, expert insights on breakthroughs.
              </p>
              <a href="#" className="feature-link">Read More</a>
            </div>

            <div className="feature-card">
              <Link2 className="feature-icon" />
              <h3 className="feature-title">Unbiased Affiliate Reviews</h3>
              <p className="feature-description">
                Our reviews are truthful and non-sponsored. We disclose affiliate links upfront, 
                ensuring commission never influences product quality ratings.
              </p>
              <a href="#" className="feature-link">Read More</a>
            </div>

            <div className="feature-card">
              <Compass className="feature-icon" />
              <h3 className="feature-title">Value for Money</h3>
              <p className="feature-description">
                We help you determine a product's true cost-effectiveness. Know which items are worth 
                the long-term investment versus pure marketing hype.
              </p>
              <a href="#" className="feature-link">Read More</a>
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
                "Your skincare products redefine luxury, delivering visible results that speak louder than words."
              </p>
              <div className="testimonial-author">
                <img 
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" 
                  alt="Customer" 
                  className="testimonial-avatar"
                />
                <div>
                  <h4 className="author-name">Jonathan Taylor</h4>
                  <p className="author-title">CEO at Creativex</p>
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
            The Retinol Renewal Serum is this month's #1 affiliate purchase! Stable, potent, and delivers 
            dramatic texture improvements. The anti-aging holy grail.
          </p>
          
          {loading ? (
            <div className="loading-text">Loading products...</div>
          ) : products.length === 0 ? (
            <div className="no-products">No products available</div>
          ) : (
            <div className="products-grid">
              {products.map((product) => (
                <div key={product._id} className="product-card">
                  <a href="#" className="explore-link">Explore</a>
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
                      Try AR
                    </button>
                    <button className="btn-shop">
                      <ShoppingCart className="btn-icon" />
                      Shop now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="view-all-cta">
            <button className="btn-view-all" onClick={() => navigate('/beautybar')}>
              View all skincare product
            </button>
          </div>
        </div>
      </section>

      {/* Featured Blogs Section */}
      {blogs.length > 0 && (
        <section className="blog-posts-section">
          <div className="container">
            <h2 className="section-title">Featured Blogs</h2>
            
            <div className="blog-grid">
              {blogs.map((blog) => (
                <article key={blog._id} className="blog-card" onClick={() => navigate(`/blog/${blog._id}`)}>
                  <div className="blog-image">
                    <img 
                      src={blog.images?.[0] || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop'} 
                      alt={blog.title} 
                    />
                    <div className="blog-date">
                      {new Date(blog.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                  </div>
                  <h3 className="blog-title">{blog.title}</h3>
                  <p className="blog-description">
                    {blog.description || 'Read more about this featured blog post...'}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Star Ratings Section */}
      <section className="star-ratings-section">
        <div className="container">
          <h2 className="section-title">Customer Ratings</h2>
          <div className="ratings-summary">
            <div className="overall-rating">
              <div className="rating-number">4.8</div>
              <div className="rating-stars">⭐⭐⭐⭐⭐</div>
              <div className="rating-text">Based on 1,247 reviews</div>
            </div>
            <div className="rating-breakdown">
              <div className="rating-bar">
                <span>5 stars</span>
                <div className="bar">
                  <div className="fill" style={{width: '85%'}}></div>
                </div>
                <span>85%</span>
              </div>
              <div className="rating-bar">
                <span>4 stars</span>
                <div className="bar">
                  <div className="fill" style={{width: '12%'}}></div>
                </div>
                <span>12%</span>
              </div>
              <div className="rating-bar">
                <span>3 stars</span>
                <div className="bar">
                  <div className="fill" style={{width: '2%'}}></div>
                </div>
                <span>2%</span>
              </div>
              <div className="rating-bar">
                <span>2 stars</span>
                <div className="bar">
                  <div className="fill" style={{width: '1%'}}></div>
                </div>
                <span>1%</span>
              </div>
              <div className="rating-bar">
                <span>1 star</span>
                <div className="bar">
                  <div className="fill" style={{width: '0%'}}></div>
                </div>
                <span>0%</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Appendix Section */}
      <section className="appendix-section">
        <div className="container">
          <h2 className="section-title">Resources & Guides</h2>
          <div className="appendix-grid">
            <div className="appendix-card">
              <h3 className="appendix-title">User Guide</h3>
              <ul className="appendix-list">
                <li>How to choose products for your skin type</li>
                <li>Basic skincare routine</li>
                <li>Natural makeup tips</li>
                <li>Beauty product storage</li>
              </ul>
            </div>

            <div className="appendix-card">
              <h3 className="appendix-title">Resources</h3>
              <ul className="appendix-list">
                <li>Skincare tutorial videos</li>
                <li>Skincare routine e-book</li>
                <li>Product selection checklist</li>
                <li>Seasonal skincare schedule</li>
              </ul>
            </div>

            <div className="appendix-card">
              <h3 className="appendix-title">Useful Links</h3>
              <ul className="appendix-list">
                <li>In-depth beauty blog</li>
                <li>Community experience sharing</li>
                <li>Online expert consultation</li>
                <li>Free beauty courses</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage
