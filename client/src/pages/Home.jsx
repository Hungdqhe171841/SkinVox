import React from 'react'
import '../HomePage.css'
import { ShoppingCart, Eye, ClipboardCheck, Target, TrendingUp, Link2, Compass } from 'lucide-react'

const HomePage = () => {
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
          <button className="hero-cta">
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
          
          <div className="products-grid">
            <div className="product-card">
              <a href="#" className="explore-link">Explore</a>
              <img 
                src="https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=300&h=300&fit=crop" 
                alt="Velvet Bloom"
                className="product-image"
              />
              <h3 className="product-name">Velvet Bloom</h3>
              <p className="product-price">219 000 VND</p>
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

            <div className="product-card">
              <a href="#" className="explore-link">Explore</a>
              <img 
                src="https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=300&h=300&fit=crop" 
                alt="Rose Muse"
                className="product-image"
              />
              <h3 className="product-name">Rose Muse</h3>
              <p className="product-price">206 000 VND</p>
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

            <div className="product-card">
              <a href="#" className="explore-link">Explore</a>
              <img 
                src="https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=300&h=300&fit=crop" 
                alt="Pink Aura"
                className="product-image"
              />
              <h3 className="product-name">Pink Aura</h3>
              <p className="product-price">215 000 VND</p>
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

            <div className="product-card">
              <a href="#" className="explore-link">Explore</a>
              <img 
                src="https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=300&h=300&fit=crop" 
                alt="Velvet Bloom"
                className="product-image"
              />
              <h3 className="product-name">Velvet Bloom</h3>
              <p className="product-price">219 000 VND</p>
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

            <div className="product-card">
              <a href="#" className="explore-link">Explore</a>
              <img 
                src="https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=300&h=300&fit=crop" 
                alt="Rose Muse"
                className="product-image"
              />
              <h3 className="product-name">Rose Muse</h3>
              <p className="product-price">205 000 VND</p>
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

            <div className="product-card">
              <a href="#" className="explore-link">Explore</a>
              <img 
                src="https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=300&h=300&fit=crop" 
                alt="Berry Pop"
                className="product-image"
              />
              <h3 className="product-name">Berry Pop</h3>
              <p className="product-price">229 000 VND</p>
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
          </div>

          <div className="view-all-cta">
            <button className="btn-view-all">View all skincare product</button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage
