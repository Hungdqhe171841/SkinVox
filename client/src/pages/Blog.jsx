import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, User, ArrowRight, Eye } from 'lucide-react'
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
      
      if (data.flat && Array.isArray(data.flat)) {
        setCategories(data.flat)
      } else if (Array.isArray(data)) {
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  // Group categories by parent
  const groupedCategories = categories.reduce((acc, category) => {
    const parent = category.parent || 'Khác';
    if (!acc[parent]) {
      acc[parent] = [];
    }
    acc[parent].push(category);
    return acc;
  }, {});

  // Remove 'Khác' group if it exists
  delete groupedCategories['Khác'];

  return (
    <div className="blog-page" style={{ display: 'flex', gap: '20px', maxWidth: '1400px', margin: '0 auto', padding: '20px' }}>
      {/* Left Sidebar - Menu */}
      <aside className="blog-sidebar-menu" style={{ width: '250px', flexShrink: 0 }}>
        <nav>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            <li style={{ borderBottom: '1px solid #e5e7eb' }}>
              <button
                onClick={() => setSelectedCategory('All')}
                className={`blog-menu-item ${selectedCategory === 'All' ? 'active' : ''}`}
                style={{
                  width: '100%',
                  padding: '15px 0',
                  textAlign: 'left',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '15px',
                  fontWeight: selectedCategory === 'All' ? '600' : '400',
                  color: selectedCategory === 'All' ? '#000' : '#4b5563',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                Tất cả
                <span style={{ fontSize: '12px' }}>→</span>
              </button>
            </li>
            
            {/* Grouped categories */}
            {Object.keys(groupedCategories).map((parent) => (
              <li key={parent} style={{ borderBottom: '1px solid #e5e7eb' }}>
                <div style={{ padding: '15px 0', fontSize: '14px', fontWeight: '600', color: '#000' }}>
                  {parent}
                </div>
                {groupedCategories[parent].map((category) => (
                  <button
                    key={category.value || category.name}
                    onClick={() => setSelectedCategory(category.value || category.name)}
                    className={`blog-menu-item ${selectedCategory === (category.value || category.name) ? 'active' : ''}`}
                    style={{
                      width: '100%',
                      padding: '12px 0',
                      paddingLeft: '20px',
                      textAlign: 'left',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: selectedCategory === (category.value || category.name) ? '600' : '400',
                      color: selectedCategory === (category.value || category.name) ? '#000' : '#6b7280',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    {category.name}
                    <span style={{ fontSize: '12px' }}>→</span>
                  </button>
                ))}
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Right Content - Blog Grid */}
      <main className="blog-content" style={{ flex: 1 }}>
        {/* Page Header */}
        <div style={{ marginBottom: '30px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#000', marginBottom: '10px' }}>
            {selectedCategory === 'All' 
              ? 'Tất cả bài viết' 
              : categories.find(c => (c.value || c.name) === selectedCategory)?.name || selectedCategory}
          </h1>
          <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: 0 }} />
        </div>

        {/* Blog Grid - 3 columns */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '30px' }}>
          {filteredBlogs.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px 0' }}>
              <p style={{ color: '#6b7280', fontSize: '16px' }}>Không có bài viết nào trong danh mục này.</p>
            </div>
          ) : (
            filteredBlogs.map((blog) => (
              <Link 
                key={blog._id} 
                to={`/blog/${blog._id}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <article style={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  cursor: 'pointer',
                  transition: 'transform 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  {/* Blog Image */}
                  <div style={{ 
                    width: '100%', 
                    height: '200px', 
                    overflow: 'hidden',
                    borderRadius: '8px',
                    marginBottom: '16px',
                    backgroundColor: '#f3f4f6'
                  }}>
                    <img 
                      src={blog.featuredImage || (blog.images && blog.images[0]) || "/assets/Ava.jpg"} 
                      alt={blog.title}
                      style={{ 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'cover' 
                      }}
                      onError={(e) => {
                        e.target.src = "/assets/Ava.jpg"
                      }}
                    />
                  </div>
                  
                  {/* Blog Content */}
                  <h2 style={{ 
                    fontSize: '18px', 
                    fontWeight: '600', 
                    color: '#000',
                    marginBottom: '8px',
                    lineHeight: '1.4',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {blog.title}
                  </h2>
                  
                  {/* Blog Meta */}
                  <div style={{ 
                    fontSize: '14px', 
                    color: '#6b7280',
                    display: 'flex',
                    gap: '12px',
                    marginTop: 'auto'
                  }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar size={14} />
                      {new Date(blog.createdAt).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                </article>
              </Link>
            ))
          )}
        </div>
      </main>
    </div>
  )
}