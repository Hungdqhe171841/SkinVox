import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    console.log('📤 API Debug - Request:', config.method?.toUpperCase(), config.url)
    console.log('📤 API Debug - Request data:', config.data)
    
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
      console.log('🔑 API Debug - Token added to headers')
    } else {
      console.log('⚠️ API Debug - No token found in localStorage')
    }
    return config
  },
  (error) => {
    console.log('❌ API Debug - Request interceptor error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    console.log('📥 API Debug - Response:', response.status, response.config.url)
    console.log('📥 API Debug - Response data:', response.data)
    return response
  },
  (error) => {
    console.log('❌ API Debug - Response error:', error.response?.status, error.config?.url)
    console.log('❌ API Debug - Error data:', error.response?.data)
    
    if (error.response?.status === 401) {
      console.log('🔒 API Debug - 401 Unauthorized, removing token and redirecting to login')
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const authAPI = {
  login: async (credentials) => {
    console.log('🌐 API Debug - Login request to:', '/auth/login')
    console.log('🌐 API Debug - Login credentials:', credentials)
    try {
      const response = await api.post('/auth/login', credentials)
      console.log('📡 API Debug - Login response:', response.data)
      return response
    } catch (error) {
      console.log('❌ API Debug - Login error:', error)
      console.log('❌ API Debug - Error response:', error.response?.data)
      console.log('❌ API Debug - Error status:', error.response?.status)
      throw error
    }
  },
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me'),
}

export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
}

export default api
