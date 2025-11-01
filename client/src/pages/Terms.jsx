import React from 'react'
import { 
  FileText, 
  Users, 
  Shield, 
  AlertCircle,
  CheckCircle,
  Mail,
  Scale,
  Lock
} from 'lucide-react'

export default function Terms() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-rose-50 via-pink-50 to-rose-50 py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <Scale className="w-12 h-12 md:w-16 md:h-16 text-rose-400 mr-4" />
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-rose-400 via-pink-400 to-rose-400 bg-clip-text text-transparent animate-fade-in">
                Điều Khoản Sử Dụng
              </h1>
            </div>
            <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed animate-slide-in-from-bottom-4">
              Vui lòng đọc kỹ các điều khoản dưới đây trước khi sử dụng dịch vụ của SkinVox
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-pink-200 to-transparent"></div>
      </section>

      {/* Main Content */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            {/* Introduction */}
            <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl p-8 shadow-md">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-rose-400 rounded-xl flex items-center justify-center mr-4">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Giới Thiệu</h2>
              </div>
              <div className="space-y-4 text-gray-700 leading-relaxed text-lg">
                <p>
                  Chào mừng bạn đến với SkinVox! Khi bạn truy cập và sử dụng website của chúng tôi, 
                  bạn đồng ý tuân thủ và bị ràng buộc bởi các Điều khoản Sử dụng này.
                </p>
                <p>
                  Nếu bạn không đồng ý với bất kỳ phần nào của các điều khoản này, vui lòng không sử dụng 
                  dịch vụ của chúng tôi.
                </p>
              </div>
            </div>

            {/* Section 1: Acceptance of Terms */}
            <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-8 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-rose-400 to-pink-400 rounded-xl flex items-center justify-center mr-4">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">1. Chấp Nhận Điều Khoản</h2>
              </div>
              <div className="space-y-4 text-gray-700 leading-relaxed text-lg">
                <p>
                  Bằng việc truy cập hoặc sử dụng website SkinVox, bạn thừa nhận rằng đã đọc, hiểu và đồng ý 
                  tuân thủ các Điều khoản Sử dụng này cùng với tất cả các luật và quy định hiện hành có liên quan.
                </p>
                <p>
                  Nếu bạn không đồng ý với bất kỳ điều khoản nào, bạn không được phép sử dụng dịch vụ của chúng tôi.
                </p>
              </div>
            </div>

            {/* Section 2: User Account */}
            <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl p-8 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-rose-400 rounded-xl flex items-center justify-center mr-4">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">2. Tài Khoản Người Dùng</h2>
              </div>
              <div className="space-y-4 text-gray-700 leading-relaxed text-lg">
                <p>
                  Khi tạo tài khoản trên SkinVox, bạn có trách nhiệm:
                </p>
                <ul className="space-y-2 ml-6 list-disc">
                  <li>Cung cấp thông tin chính xác, đầy đủ và cập nhật.</li>
                  <li>Bảo mật mật khẩu và thông tin tài khoản của bạn.</li>
                  <li>Chịu trách nhiệm về tất cả các hoạt động diễn ra dưới tài khoản của bạn.</li>
                  <li>Thông báo ngay cho chúng tôi nếu phát hiện việc sử dụng trái phép tài khoản.</li>
                </ul>
                <p>
                  SkinVox có quyền từ chối phục vụ, đình chỉ hoặc chấm dứt tài khoản nếu vi phạm các điều khoản này.
                </p>
              </div>
            </div>

            {/* Section 3: User Conduct */}
            <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-8 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-rose-400 to-pink-400 rounded-xl flex items-center justify-center mr-4">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">3. Quy Tắc Sử Dụng</h2>
              </div>
              <div className="space-y-4 text-gray-700 leading-relaxed text-lg">
                <p className="font-semibold text-gray-900">Bạn đồng ý KHÔNG:</p>
                <ul className="space-y-2 ml-6 list-disc">
                  <li>Sử dụng website cho mục đích bất hợp pháp hoặc trái pháp luật.</li>
                  <li>Đăng tải nội dung vi phạm quyền sở hữu trí tuệ, quyền riêng tư của người khác.</li>
                  <li>Phát tán virus, malware hoặc mã độc hại.</li>
                  <li>Cố gắng truy cập trái phép vào hệ thống hoặc dữ liệu của chúng tôi.</li>
                  <li>Sử dụng bot, script hoặc công cụ tự động để thu thập dữ liệu.</li>
                  <li>Gửi spam, quảng cáo không mong muốn hoặc nội dung không phù hợp.</li>
                  <li>Giả mạo danh tính hoặc đăng tải thông tin sai lệch.</li>
                </ul>
              </div>
            </div>

            {/* Section 4: Intellectual Property */}
            <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl p-8 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-rose-400 rounded-xl flex items-center justify-center mr-4">
                  <Lock className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">4. Quyền Sở Hữu Trí Tuệ</h2>
              </div>
              <div className="space-y-4 text-gray-700 leading-relaxed text-lg">
                <p>
                  Tất cả nội dung trên website SkinVox, bao gồm nhưng không giới hạn: văn bản, hình ảnh, logo, 
                  đồ họa, video, âm thanh, phần mềm, và thiết kế, đều thuộc quyền sở hữu của SkinVox hoặc 
                  các bên cấp phép.
                </p>
                <p className="font-semibold text-gray-900">
                  Bạn không được phép sao chép, tái sản xuất, phân phối, hoặc tạo tác phẩm phái sinh từ nội dung 
                  của website mà không có sự cho phép bằng văn bản từ chúng tôi.
                </p>
              </div>
            </div>

            {/* Section 5: User Content */}
            <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-8 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-rose-400 to-pink-400 rounded-xl flex items-center justify-center mr-4">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">5. Nội Dung Người Dùng</h2>
              </div>
              <div className="space-y-4 text-gray-700 leading-relaxed text-lg">
                <p>
                  Khi bạn đăng tải, gửi hoặc chia sẻ nội dung (bình luận, đánh giá, hình ảnh, v.v.) trên SkinVox, 
                  bạn cấp cho chúng tôi quyền sử dụng, chỉnh sửa, hiển thị và phân phối nội dung đó trên website 
                  và các kênh liên quan.
                </p>
                <p>
                  Bạn đảm bảo rằng bạn có quyền cấp phép cho nội dung đó và nội dung không vi phạm quyền của bên thứ ba.
                </p>
                <p className="font-semibold text-gray-900">
                  SkinVox có quyền xóa hoặc từ chối bất kỳ nội dung nào mà chúng tôi cho là vi phạm các điều khoản này.
                </p>
              </div>
            </div>

            {/* Section 6: Payment and Premium */}
            <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl p-8 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-rose-400 rounded-xl flex items-center justify-center mr-4">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">6. Thanh Toán và Gói Premium</h2>
              </div>
              <div className="space-y-4 text-gray-700 leading-relaxed text-lg">
                <p>
                  Nếu bạn đăng ký gói Premium hoặc mua hàng trên SkinVox:
                </p>
                <ul className="space-y-2 ml-6 list-disc">
                  <li>Bạn đồng ý thanh toán đúng và đầy đủ các khoản phí được công bố.</li>
                  <li>Thanh toán được xử lý qua các cổng thanh toán bên thứ ba an toàn.</li>
                  <li>Gói Premium có thể bị hủy hoặc hoàn tiền theo chính sách hoàn tiền của chúng tôi.</li>
                  <li>SkinVox có quyền thay đổi giá cả và điều khoản gói Premium với thông báo trước.</li>
                </ul>
              </div>
            </div>

            {/* Section 7: Limitation of Liability */}
            <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-8 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-rose-400 to-pink-400 rounded-xl flex items-center justify-center mr-4">
                  <AlertCircle className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">7. Giới Hạn Trách Nhiệm</h2>
              </div>
              <div className="space-y-4 text-gray-700 leading-relaxed text-lg">
                <p>
                  SkinVox cung cấp dịch vụ "như hiện có" và "như có sẵn". Chúng tôi không đảm bảo rằng:
                </p>
                <ul className="space-y-2 ml-6 list-disc">
                  <li>Website sẽ hoạt động liên tục, không gián đoạn hoặc không có lỗi.</li>
                  <li>Thông tin trên website là hoàn toàn chính xác, đầy đủ hoặc cập nhật.</li>
                  <li>Các lỗi sẽ được sửa hoặc website sẽ được bảo mật hoàn toàn.</li>
                </ul>
                <p className="font-semibold text-gray-900">
                  SkinVox không chịu trách nhiệm cho bất kỳ thiệt hại trực tiếp, gián tiếp, ngẫu nhiên, đặc biệt 
                  hoặc hậu quả nào phát sinh từ việc sử dụng hoặc không thể sử dụng dịch vụ của chúng tôi.
                </p>
              </div>
            </div>

            {/* Section 8: Termination */}
            <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl p-8 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-rose-400 rounded-xl flex items-center justify-center mr-4">
                  <AlertCircle className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">8. Chấm Dứt</h2>
              </div>
              <div className="space-y-4 text-gray-700 leading-relaxed text-lg">
                <p>
                  SkinVox có quyền chấm dứt hoặc đình chỉ quyền truy cập của bạn vào website, bất kỳ lúc nào, 
                  mà không cần thông báo trước, nếu bạn vi phạm các Điều khoản Sử dụng này.
                </p>
                <p>
                  Bạn có thể chấm dứt tài khoản của mình bất kỳ lúc nào bằng cách liên hệ với chúng tôi hoặc 
                  sử dụng chức năng xóa tài khoản (nếu có).
                </p>
              </div>
            </div>

            {/* Section 9: Changes to Terms */}
            <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-8 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-rose-400 to-pink-400 rounded-xl flex items-center justify-center mr-4">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">9. Thay Đổi Điều Khoản</h2>
              </div>
              <div className="space-y-4 text-gray-700 leading-relaxed text-lg">
                <p>
                  SkinVox có quyền sửa đổi, bổ sung hoặc thay đổi các Điều khoản Sử dụng này bất kỳ lúc nào.
                </p>
                <p>
                  Các thay đổi sẽ có hiệu lực ngay sau khi được đăng tải trên website. Việc bạn tiếp tục sử dụng 
                  dịch vụ sau khi có thay đổi được coi là bạn đã chấp nhận các điều khoản mới.
                </p>
                <p>
                  Bạn được khuyến nghị kiểm tra định kỳ để nắm rõ các cập nhật mới nhất.
                </p>
              </div>
            </div>

            {/* Section 10: Contact */}
            <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl p-8 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-rose-400 rounded-xl flex items-center justify-center mr-4">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">10. Liên Hệ</h2>
              </div>
              <div className="space-y-4 text-gray-700 leading-relaxed text-lg">
                <p>
                  Nếu bạn có bất kỳ câu hỏi nào về các Điều khoản Sử dụng này, vui lòng liên hệ với chúng tôi:
                </p>
                <div className="flex items-center bg-white rounded-xl p-4 shadow-sm">
                  <Mail className="w-6 h-6 text-rose-400 mr-3" />
                  <a 
                    href="mailto:nhilphs181009@fpt.edu.vn" 
                    className="text-lg font-semibold text-rose-600 hover:text-rose-700 hover:underline transition-colors"
                  >
                    nhilphs181009@fpt.edu.vn
                  </a>
                </div>
              </div>
            </div>

            {/* Important Notice */}
            <div className="bg-gradient-to-br from-rose-100 to-pink-100 border-2 border-rose-300 rounded-2xl p-6 mt-8">
              <div className="flex items-start">
                <CheckCircle className="w-6 h-6 text-rose-600 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900 mb-2">Lưu ý quan trọng:</p>
                  <p className="text-gray-700 leading-relaxed">
                    Bằng việc sử dụng website SkinVox, bạn đã đồng ý với tất cả các điều khoản được nêu trong 
                    Điều khoản Sử dụng này. Nếu bạn không đồng ý với bất kỳ điều khoản nào, vui lòng không sử dụng 
                    các dịch vụ của chúng tôi.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

