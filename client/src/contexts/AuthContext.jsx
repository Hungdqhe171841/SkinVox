import { createContext, useContext, useReducer, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { authAPI } from '../services/api'

const AuthContext = createContext()

const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  loading: true,
  error: null
}

function authReducer(state, action) {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, loading: true, error: null }
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        loading: false,
        error: null
      }
    case 'LOGIN_FAILURE':
      return {
        ...state,
        user: null,
        token: null,
        loading: false,
        error: action.payload
      }
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        loading: false,
        error: null
      }
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    default:
      return state
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState)

  useEffect(() => {
    const checkAuth = async () => {
      if (state.token) {
        try {
          const response = await authAPI.getMe()
          dispatch({
            type: 'LOGIN_SUCCESS',
            payload: { user: response.data.user, token: state.token }
          })
        } catch (error) {
          localStorage.removeItem('token')
          dispatch({ type: 'LOGOUT' })
        }
      } else {
        dispatch({ type: 'SET_LOADING', payload: false })
      }
    }

    checkAuth()
  }, [state.token])

  const login = async (credentials) => {
    console.log('🔐 AuthContext Debug - Login started with credentials:', credentials)
    dispatch({ type: 'LOGIN_START' })
    try {
      console.log('🌐 AuthContext Debug - Making API call to login...')
      const response = await authAPI.login(credentials)
      console.log('📡 AuthContext Debug - API response:', response.data)
      
      localStorage.setItem('token', response.data.token)
      console.log('💾 AuthContext Debug - Token saved to localStorage')
      
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: response.data
      })
      console.log('✅ AuthContext Debug - Login success, user:', response.data.user)
      return { success: true, user: response.data.user }
    } catch (error) {
      console.log('❌ AuthContext Debug - Login error:', error)
      console.log('❌ AuthContext Debug - Error response:', error.response?.data)
      console.log('❌ AuthContext Debug - Error status:', error.response?.status)
      
      const errorMessage = error.response?.data?.message || 'Login failed'
      dispatch({
        type: 'LOGIN_FAILURE',
        payload: errorMessage
      })
      return { success: false, error: errorMessage }
    }
  }

  const register = async (userData) => {
    dispatch({ type: 'LOGIN_START' })
    try {
      const response = await authAPI.register(userData)
      localStorage.setItem('token', response.data.token)
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: response.data
      })
      return { success: true, user: response.data.user }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed'
      dispatch({
        type: 'LOGIN_FAILURE',
        payload: errorMessage
      })
      return { success: false, error: errorMessage }
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    dispatch({ type: 'LOGOUT' })
  }

  const value = {
    ...state,
    login,
    register,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
