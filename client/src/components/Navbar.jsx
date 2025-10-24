import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { User, LogOut, Menu, X } from 'lucide-react'
import { useState } from 'react'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
    setIsMenuOpen(false)
  }

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3">
              <img 
                src="/assets/Ava.jpg" 
                alt="SkinVox Avatar" 
                className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
              />
              <span className="text-xl font-bold text-gray-900">SkinVox</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Home
            </Link>
            <Link
              to="/beautybar"
              className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              BeautyBar
            </Link>
            <Link
              to="/blog"
              className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Blog
            </Link>
            <Link
              to="/makeup-ar"
              className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              ChatBot
            </Link>
            <Link
              to="/about"
              className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              About Us
            </Link>
            
                   {user ? (
                     <div className="flex items-center space-x-4">
                       {user.role === 'admin' && (
                         <Link
                           to="/admin/dashboard"
                           className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                         >
                           Admin Dashboard
                         </Link>
                       )}
                       <Link
                         to="/profile"
                         className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                       >
                         Profile
                       </Link>
                       <div className="flex items-center space-x-2">
                         <User className="w-4 h-4 text-gray-500" />
                         <span className="text-sm text-gray-700">{user.username}</span>
                         {user.role === 'admin' && (
                           <span className="text-xs bg-primary-100 text-primary-800 px-2 py-1 rounded-full">
                             Admin
                           </span>
                         )}
                       </div>
                       <button
                         onClick={handleLogout}
                         className="flex items-center space-x-1 text-gray-700 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                       >
                         <LogOut className="w-4 h-4" />
                         <span>Logout</span>
                       </button>
                     </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn btn-primary px-4 py-2"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-primary-600 p-2"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t">
              <Link
                to="/"
                className="block text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/beautybar"
                className="block text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                BeautyBar
              </Link>
              <Link
                to="/blog"
                className="block text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Blog
              </Link>
              <Link
                to="/makeup-ar"
                className="block text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                ChatBot
              </Link>
              <Link
                to="/about"
                className="block text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                About Us
              </Link>
              
                     {user ? (
                       <>
                         {user.role === 'admin' && (
                           <Link
                             to="/admin/dashboard"
                             className="block text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-base font-medium"
                             onClick={() => setIsMenuOpen(false)}
                           >
                             Admin Dashboard
                           </Link>
                         )}
                         <Link
                           to="/profile"
                           className="block text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-base font-medium"
                           onClick={() => setIsMenuOpen(false)}
                         >
                           Profile
                         </Link>
                         <div className="flex items-center px-3 py-2">
                           <User className="w-4 h-4 text-gray-500 mr-2" />
                           <span className="text-sm text-gray-700">{user.username}</span>
                           {user.role === 'admin' && (
                             <span className="text-xs bg-primary-100 text-primary-800 px-2 py-1 rounded-full ml-2">
                               Admin
                             </span>
                           )}
                         </div>
                         <button
                           onClick={handleLogout}
                           className="flex items-center w-full text-left text-gray-700 hover:text-red-600 px-3 py-2 rounded-md text-base font-medium"
                         >
                           <LogOut className="w-4 h-4 mr-2" />
                           Logout
                         </button>
                       </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-base font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block btn btn-primary px-3 py-2 text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
