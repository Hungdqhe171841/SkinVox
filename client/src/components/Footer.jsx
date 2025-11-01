import { Link } from 'react-router-dom'
import { Facebook, Instagram, Twitter } from 'lucide-react'

export default function Footer() {
 
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <img 
                src="/assets/Ava.jpg" 
                alt="SkinVox Avatar" 
                className="w-12 h-12 rounded-full object-cover border-2 border-gray-600"
              />
              <span className="text-2xl font-bold">SkinVox</span>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              Nền tảng làm đẹp thông minh với công nghệ AR tiên tiến, giúp bạn khám phá và thử nghiệm các sản phẩm makeup một cách trực quan và chính xác.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/profile.php?id=61581544359179" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="w-6 h-6" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Liên kết nhanh</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition-colors">
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link to="/beautybar" className="text-gray-300 hover:text-white transition-colors">
                  BeautyBar
                </Link>
              </li>
              <li>
                <Link to="/makeup-ar" className="text-gray-300 hover:text-white transition-colors">
                  ChatBot
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-300 hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Liên hệ</h3>
            <ul className="space-y-2 text-gray-300">
              <li>Email: nhilphs181009@fpt.edu.vn</li>
              <li>Hotline: 1900-181009</li>
              <li>Địa chỉ: 
              FPT university, Hanoi, Vietnam </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © 2025 SkinVox. Tất cả quyền được bảo lưu. | 
            <Link to="/privacy" className="hover:text-white transition-colors ml-2">Chính sách bảo mật</Link> | 
            <Link to="/terms" className="hover:text-white transition-colors ml-2">Điều khoản sử dụng</Link>
          </p>
        </div>
      </div>
  
    </footer>
  )
}
