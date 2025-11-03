import axios from 'axios'

// Use production backend URL if not in development
const getApiBaseUrl = () => {
  // If VITE_API_URL is explicitly set, use it
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL
  }
  // In production (Vercel), use Render backend
  if (import.meta.env.PROD) {
    return 'https://skinvox-backend.onrender.com'
  }
  // In development, use localhost
  return 'http://localhost:5000'
}

const API_BASE_URL = getApiBaseUrl()

// Log API URL (only in development)
if (import.meta.env.DEV) {
  console.log('🔗 API Base URL:', API_BASE_URL)
  console.log('🔗 Environment:', import.meta.env.MODE)
  console.log('🔗 VITE_API_URL set:', !!import.meta.env.VITE_API_URL)
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    if (import.meta.env.DEV) {
      console.log('📤 API Debug - Request:', config.method?.toUpperCase(), config.url)
      console.log('📤 API Debug - Request data:', config.data)
    }
    
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
      if (import.meta.env.DEV) {
        console.log('🔑 API Debug - Token added to headers')
      }
    } else if (import.meta.env.DEV) {
      console.log('⚠️ API Debug - No token found in localStorage')
    }
    return config
  },
  (error) => {
    if (import.meta.env.DEV) {
      console.log('❌ API Debug - Request interceptor error:', error)
    }
    return Promise.reject(error)
  }
)

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    if (import.meta.env.DEV) {
      console.log('📥 API Debug - Response:', response.status, response.config.url)
      console.log('📥 API Debug - Response data:', response.data)
    }
    return response
  },
  async (error) => {
    const isDev = import.meta.env.DEV
    
    if (isDev) {
      console.log('❌ API Debug - Response error:', error.response?.status, error.config?.url)
      console.log('❌ API Debug - Error data:', error.response?.data)
    }
    
    // Handle 429 rate limiting with retry
    if (error.response?.status === 429 && error.config && !error.config._retry) {
      error.config._retry = true
      const retryCount = error.config._retryCount || 0
      
      if (retryCount < 2) {
        error.config._retryCount = retryCount + 1
        const delay = (retryCount + 1) * 2000 // 2s, 4s
        
        if (isDev) {
          console.warn(`⚠️ Rate limit reached. Retrying in ${delay/1000}s... (attempt ${retryCount + 1}/2)`)
        }
        
        await new Promise(resolve => setTimeout(resolve, delay))
        return api.request(error.config)
      }
    }
    
    // Only log 404 if it's not a favicon or static resource
    if (error.config?.url && !error.config.url.includes('favicon') && !error.config.url.includes('static')) {
      if (isDev) {
        console.error(`❌ API Debug - Request failed: ${error.config.method?.toUpperCase()} ${error.config.url}`)
        console.error(`❌ API Debug - Status: ${error.response?.status || 'No response'}`)
      }
    }
    
    if (error.response?.status === 401) {
      if (isDev) {
        console.log('🔒 API Debug - 401 Unauthorized, removing token and redirecting to login')
      }
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const authAPI = {
  login: async (credentials) => {
    if (import.meta.env.DEV) {
      console.log('🌐 API Debug - Login request to:', '/api/auth/login')
      console.log('🌐 API Debug - Login credentials:', credentials)
    }
    try {
      const response = await api.post('/api/auth/login', credentials)
      if (import.meta.env.DEV) {
        console.log('📡 API Debug - Login response:', response.data)
      }
      return response
    } catch (error) {
      if (import.meta.env.DEV) {
        console.log('❌ API Debug - Login error:', error)
        console.log('❌ API Debug - Error response:', error.response?.data)
        console.log('❌ API Debug - Error status:', error.response?.status)
      }
      throw error
    }
  },
  register: (userData) => api.post('/api/auth/register', userData),
  getMe: () => api.get('/api/auth/me'),
}

export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
}

export const chatbotAPI = {
  sendMessage: (message) => api.post('/api/chatbot/message', { message }),
  checkHealth: () => api.get('/api/chatbot/health'),
}

export const blogAPI = {
  savePost: (blogId) => api.post(`/api/blog/blogs/${blogId}/save`),
  getSavedPosts: () => api.get('/api/blog/saved-posts'),
}

export default api
