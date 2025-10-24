import React from 'react'
import { Routes, Route, createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import AdminProtectedRoute from './components/AdminProtectedRoute'
import Layout from './components/Layout'
import DebugConsole from './components/DebugConsole'
import { initGA } from './utils/analytics'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import AdminDashboard from './pages/AdminDashboard'
import Profile from './pages/Profile'
import BeautyBar from './pages/BeautyBar'
import Blog from './pages/Blog'
import BlogDetail from './pages/BlogDetail'
import MakeupAR from './pages/MakeupAR'
import NotFound from './pages/NotFound'

// Create router with future flags
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "beautybar", element: <BeautyBar /> },
      { path: "blog", element: <Blog /> },
      { path: "blog/:id", element: <BlogDetail /> },
      { path: "makeup-ar", element: <MakeupAR /> },
      { 
        path: "dashboard", 
        element: (
          <AdminProtectedRoute>
            <Dashboard />
          </AdminProtectedRoute>
        )
      },
      { 
        path: "admin/dashboard", 
        element: (
          <AdminProtectedRoute>
            <AdminDashboard />
          </AdminProtectedRoute>
        )
      },
      { 
        path: "profile", 
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        )
      },
      { path: "*", element: <NotFound /> }
    ],
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true
    }
  }
], {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true
  }
});

function App() {
  // Initialize Google Analytics
  React.useEffect(() => {
    console.log('🔍 App Debug - Initializing Google Analytics...');
    initGA();
    
    // Test Google Analytics after initialization
    setTimeout(() => {
      if (typeof window !== 'undefined' && window.gtag) {
        console.log('✅ App Debug - Google Analytics is working');
        window.gtag('event', 'app_initialized', {
          event_category: 'App',
          event_label: 'App Initialized',
          value: 1
        });
      } else {
        console.error('❌ App Debug - Google Analytics not working');
      }
    }, 1000);
  }, []);

  return (
    <AuthProvider>
      <RouterProvider router={router} />
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10B981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 5000,
            iconTheme: {
              primary: '#EF4444',
              secondary: '#fff',
            },
          },
        }}
      />
      <DebugConsole />
    </AuthProvider>
  )
}

export default App
