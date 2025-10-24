import React from 'react'
import '../HomePage.css'

const HomePage = () => {
  return (
    <div className="homepage">

      {/* Journal Header */}
      <section className="journal-header">
        <div className="trending-badge">/ Trending Reads</div>
        <h1 className="journal-title">BEAUTY JOURNAL</h1>
      </section>

      {/* Main Content */}
      <section className="main-content">
        <div className="image-panel">
          <div className="beauty-flatlay">
            <img 
              src="https://images.unsplash.com/photo-1551650975-87deedd944c3?w=600&h=400&fit=crop" 
              alt="Beauty Products" 
              className="beauty-flatlay-image"
            />
            <div className="beauty-products">
              <div className="amber-bottles">
                <div className="bottle bottle-1"></div>
                <div className="bottle bottle-2"></div>
                <div className="bottle bottle-3"></div>
              </div>
              <div className="dried-flowers">
                <div className="flower flower-1"></div>
                <div className="flower flower-2"></div>
                <div className="flower flower-3"></div>
              </div>
              <div className="palm-leaf"></div>
              <div className="white-dish"></div>
            </div>
          </div>
        </div>
        <div className="text-panel">
          <div className="content-box">
            <h2 className="content-title">Where Every Beauty Journey Begins</h2>
            <p className="content-description">
              Welcome to our Beauty Journal, where brand-new blog tales meet cutting-edge beauty tech. 
              Watch as lipsticks swirl onto your lips in AR, serums glide across your skin in real-time, 
              and AI SkinScan whispers insights about your unique canvas. Explore, experiment, 
              and celebrate the skin you're in.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <span className="cta-arrow">→</span>
        <span className="cta-text">Dive into our latest beauty stories and start your glow journey here!</span>
      </section>

      {/* Articles Section */}
      <section className="articles-section">
        <article className="article-card">
          <div className="article-image mirror-glow">
            <img 
              src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=250&fit=crop" 
              alt="Mirror Glow Routine" 
              className="article-image-bg"
            />
            <div className="image-overlay">
              <div className="date">29th June, 2025</div>
            </div>
          </div>
          <div className="article-content">
            <h3 className="article-title">Mirror-Glow Routine</h3>
            <p className="article-description">
              Our 3-step, 5-minute morning ritual: primer, tone up cream, and soft-focus highlighter 
              tested for an instant, camera ready radiance that lasts past lunchtime.
            </p>
          </div>
        </article>

        <article className="article-card">
          <div className="article-image peony-dew">
            <img 
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop" 
              alt="Peony Dew Cream" 
              className="article-image-bg"
            />
            <div className="image-overlay">
              <div className="date">23th June, 2025</div>
            </div>
          </div>
          <div className="article-content">
            <h3 className="article-title">Peony Dew Cream Review</h3>
            <p className="article-description">
              After 14 days of use, we gauge how this petal-rich moisturizer 
              delivers bounce, locks water deep in the skin barrier, and leaves a sheer floral glow with zero stickiness.
            </p>
          </div>
        </article>

        <article className="article-card">
          <div className="article-image amber-botanics">
            <img 
              src="https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=250&fit=crop" 
              alt="Amber Botanics" 
              className="article-image-bg"
            />
            <div className="image-overlay">
              <div className="date">15th June, 2025</div>
            </div>
          </div>
          <div className="article-content">
            <h3 className="article-title">Amber Botanics Elixirs</h3>
            <p className="article-description">
              We break down the antioxidant blend in these apothecary-style serums to see if their 
              promised shield against pollution matches the elegant packaging.
            </p>
          </div>
        </article>
      </section>

      {/* Featured Articles Section */}
      <section className="featured-articles">
        <div className="container">
          <h2>Bài viết nổi bật</h2>
          <div className="articles-grid">
            <article className="article-card featured">
              <div className="article-image">
                <img src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop" alt="Mirror Glow Routine" />
                <div className="article-date">29th June, 2025</div>
              </div>
              <div className="article-content">
                <h3>Mirror-Glow Routine</h3>
                <p>Our 3-step, 5-minute morning ritual: primer, tone up cream, and soft-focus highlighter tested for an instant, camera ready radiance that lasts past lunchtime.</p>
                <div className="article-rating">
                  <span className="stars">⭐⭐⭐⭐⭐</span>
                  <span className="rating-text">(4.8/5 - 127 reviews)</span>
                </div>
              </div>
            </article>

            <article className="article-card featured">
              <div className="article-image">
                <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop" alt="Peony Dew Cream" />
                <div className="article-date">23th June, 2025</div>
              </div>
              <div className="article-content">
                <h3>Peony Dew Cream Review</h3>
                <p>After 14 days of use, we gauge how this petal-rich moisturizer delivers bounce, locks water deep in the skin barrier, and leaves a sheer floral glow with zero stickiness.</p>
                <div className="article-rating">
                  <span className="stars">⭐⭐⭐⭐⭐</span>
                  <span className="rating-text">(4.9/5 - 89 reviews)</span>
                </div>
              </div>
            </article>

            <article className="article-card featured">
              <div className="article-image">
                <img src="https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop" alt="Amber Botanics" />
                <div className="article-date">15th June, 2025</div>
              </div>
              <div className="article-content">
                <h3>Amber Botanics Elixirs</h3>
                <p>We break down the antioxidant blend in these apothecary-style serums to see if their promised shield against pollution matches the elegant packaging.</p>
                <div className="article-rating">
                  <span className="stars">⭐⭐⭐⭐</span>
                  <span className="rating-text">(4.6/5 - 156 reviews)</span>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* Secondary Articles */}
      <section className="secondary-articles">
        <div className="container">
          <h2>Bài viết phụ</h2>
          <div className="secondary-grid">
            <article className="secondary-card">
              <div className="secondary-image">
                <img src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300&h=200&fit=crop" alt="Skincare Tips" />
              </div>
              <div className="secondary-content">
                <h4>5 Skincare Tips for Winter</h4>
                <p>Essential winter skincare routine to keep your skin glowing...</p>
                <div className="secondary-rating">⭐⭐⭐⭐ (4.2/5)</div>
              </div>
            </article>

            <article className="secondary-card">
              <div className="secondary-image">
                <img src="https://images.unsplash.com/photo-1522335789203-aabd1fc6bcbe?w=300&h=200&fit=crop" alt="Makeup Trends" />
              </div>
              <div className="secondary-content">
                <h4>2025 Makeup Trends</h4>
                <p>Discover the latest makeup trends for this year...</p>
                <div className="secondary-rating">⭐⭐⭐⭐⭐ (4.7/5)</div>
              </div>
            </article>

            <article className="secondary-card">
              <div className="secondary-image">
                <img src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop" alt="Hair Care" />
              </div>
              <div className="secondary-content">
                <h4>Natural Hair Care Routine</h4>
                <p>Learn how to care for your hair naturally...</p>
                <div className="secondary-rating">⭐⭐⭐⭐ (4.3/5)</div>
              </div>
            </article>

            <article className="secondary-card">
              <div className="secondary-image">
                <img src="https://images.unsplash.com/photo-1594736797933-d0c0b1b0b0b0?w=300&h=200&fit=crop" alt="Beauty Tools" />
              </div>
              <div className="secondary-content">
                <h4>Essential Beauty Tools</h4>
                <p>Must-have tools for your beauty routine...</p>
                <div className="secondary-rating">⭐⭐⭐⭐⭐ (4.8/5)</div>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* Featured Reviews */}
      <section className="featured-reviews">
        <div className="container">
          <h2>Đánh giá nổi bật</h2>
          <div className="reviews-grid">
            <div className="review-card">
              <div className="review-header">
                <div className="reviewer-info">
                  <div className="reviewer-avatar">A</div>
                  <div className="reviewer-details">
                    <h4>Anna Smith</h4>
                    <p>Beauty Enthusiast</p>
                  </div>
                </div>
                <div className="review-rating">⭐⭐⭐⭐⭐</div>
              </div>
              <div className="review-content">
                <p>"The Mirror-Glow Routine completely transformed my morning routine! My skin has never looked better. Highly recommend to anyone looking for that perfect glow."</p>
              </div>
              <div className="review-date">2 days ago</div>
            </div>

            <div className="review-card">
              <div className="review-header">
                <div className="reviewer-info">
                  <div className="reviewer-avatar">M</div>
                  <div className="reviewer-details">
                    <h4>Maria Garcia</h4>
                    <p>Skincare Expert</p>
                  </div>
                </div>
                <div className="review-rating">⭐⭐⭐⭐⭐</div>
              </div>
              <div className="review-content">
                <p>"Peony Dew Cream is absolutely amazing! My skin feels so hydrated and the floral scent is divine. Worth every penny!"</p>
              </div>
              <div className="review-date">1 week ago</div>
            </div>

            <div className="review-card">
              <div className="review-header">
                <div className="reviewer-info">
                  <div className="reviewer-avatar">S</div>
                  <div className="reviewer-details">
                    <h4>Sarah Johnson</h4>
                    <p>Makeup Artist</p>
                  </div>
                </div>
                <div className="review-rating">⭐⭐⭐⭐</div>
              </div>
              <div className="review-content">
                <p>"Amber Botanics Elixirs have become a staple in my routine. The packaging is beautiful and the results are incredible!"</p>
              </div>
              <div className="review-date">2 weeks ago</div>
            </div>
          </div>
        </div>
      </section>

      {/* Star Ratings Section */}
      <section className="star-ratings">
        <div className="container">
          <h2>Đánh giá bằng sao</h2>
          <div className="ratings-summary">
            <div className="overall-rating">
              <div className="rating-number">4.8</div>
              <div className="rating-stars">⭐⭐⭐⭐⭐</div>
              <div className="rating-text">Dựa trên 1,247 đánh giá</div>
            </div>
            <div className="rating-breakdown">
              <div className="rating-bar">
                <span>5 sao</span>
                <div className="bar">
                  <div className="fill" style={{width: '85%'}}></div>
                </div>
                <span>85%</span>
              </div>
              <div className="rating-bar">
                <span>4 sao</span>
                <div className="bar">
                  <div className="fill" style={{width: '12%'}}></div>
                </div>
                <span>12%</span>
              </div>
              <div className="rating-bar">
                <span>3 sao</span>
                <div className="bar">
                  <div className="fill" style={{width: '2%'}}></div>
                </div>
                <span>2%</span>
              </div>
              <div className="rating-bar">
                <span>2 sao</span>
                <div className="bar">
                  <div className="fill" style={{width: '1%'}}></div>
                </div>
                <span>1%</span>
              </div>
              <div className="rating-bar">
                <span>1 sao</span>
                <div className="bar">
                  <div className="fill" style={{width: '0%'}}></div>
                </div>
                <span>0%</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Appendix */}
      <section className="appendix">
        <div className="container">
          <h2>Phụ lục</h2>
          <div className="appendix-content">
            <div className="appendix-section">
              <h3>Hướng dẫn sử dụng</h3>
              <ul>
                <li>Cách chọn sản phẩm phù hợp với loại da</li>
                <li>Quy trình chăm sóc da cơ bản</li>
                <li>Tips trang điểm tự nhiên</li>
                <li>Bảo quản sản phẩm làm đẹp</li>
              </ul>
            </div>
            <div className="appendix-section">
              <h3>Tài nguyên</h3>
              <ul>
                <li>Video hướng dẫn chăm sóc da</li>
                <li>E-book về skincare routine</li>
                <li>Checklist chọn sản phẩm phù hợp</li>
                <li>Lịch chăm sóc da theo mùa</li>
              </ul>
            </div>
            <div className="appendix-section">
              <h3>Liên kết hữu ích</h3>
              <ul>
                <li>Blog chuyên sâu về beauty</li>
                <li>Cộng đồng chia sẻ kinh nghiệm</li>
                <li>Chuyên gia tư vấn trực tuyến</li>
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
