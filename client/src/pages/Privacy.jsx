import React from 'react'
import { 
  Shield, 
  Info, 
  MessageCircle, 
  FileText, 
  ExternalLink, 
  AlertTriangle,
  Mail,
  CheckCircle2
} from 'lucide-react'

export default function Privacy() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-rose-50 via-pink-50 to-rose-50 py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <Shield className="w-12 h-12 md:w-16 md:h-16 text-rose-400 mr-4" />
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-rose-400 via-pink-400 to-rose-400 bg-clip-text text-transparent animate-fade-in">
                Chính Sách Miễn Trừ Pháp Lý
              </h1>
            </div>
            <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed animate-slide-in-from-bottom-4">
              Vui lòng đọc kỹ các điều khoản và quy định dưới đây trước khi sử dụng dịch vụ của SkinVox
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-pink-200 to-transparent"></div>
      </section>

      {/* Main Content */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            {/* Section 1 */}
            <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-8 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-rose-400 to-pink-400 rounded-xl flex items-center justify-center mr-4">
                  <Info className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">1. Mục đích của website</h2>
              </div>
              <div className="space-y-4 text-gray-700 leading-relaxed text-lg">
                <p>
                  Trang web SkinVox được xây dựng với mục đích chia sẻ kiến thức và kinh nghiệm về chăm sóc da (skincare), 
                  trang điểm (makeup) và làm đẹp nói chung.
                </p>
                <p>
                  Tất cả nội dung trên trang (bài viết, hình ảnh, video, bình luận, và nội dung trong chatbox tư vấn) 
                  chỉ mang tính chất tham khảo và cung cấp thông tin.
                </p>
              </div>
            </div>

            {/* Section 2 */}
            <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl p-8 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-rose-400 rounded-xl flex items-center justify-center mr-4">
                  <AlertTriangle className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">2. Không thay thế lời khuyên y khoa hoặc chuyên môn</h2>
              </div>
              <div className="space-y-4 text-gray-700 leading-relaxed text-lg">
                <p>
                  Các bài viết và tư vấn trên SkinVox không phải là lời khuyên y khoa, da liễu hay dược mỹ phẩm chuyên sâu.
                </p>
                <p>
                  Người đọc nên tham khảo ý kiến bác sĩ da liễu, chuyên gia y tế hoặc chuyên viên thẩm mỹ có chuyên môn 
                  trước khi áp dụng bất kỳ phương pháp, sản phẩm hoặc liệu trình chăm sóc da nào được đề cập trên website.
                </p>
                <p className="font-semibold text-gray-900">
                  SkinVox không chịu trách nhiệm cho bất kỳ phản ứng phụ, kích ứng hoặc tổn thương nào phát sinh từ việc 
                  áp dụng thông tin từ trang web.
                </p>
              </div>
            </div>

            {/* Section 3 */}
            <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-8 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-rose-400 to-pink-400 rounded-xl flex items-center justify-center mr-4">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">3. Chatbox tư vấn</h2>
              </div>
              <div className="space-y-4 text-gray-700 leading-relaxed text-lg">
                <p>
                  Chức năng chatbox tư vấn trên SkinVox chỉ nhằm hỗ trợ người dùng tìm hiểu thông tin và định hướng cơ bản 
                  về sản phẩm hoặc quy trình chăm sóc da.
                </p>
                <p>
                  Các tư vấn được cung cấp bởi đội ngũ hỗ trợ không phải là chuẩn đoán y khoa hoặc hướng dẫn điều trị.
                </p>
                <p className="font-semibold text-gray-900">
                  Người dùng chịu trách nhiệm hoàn toàn cho việc lựa chọn, sử dụng hoặc không sử dụng bất kỳ sản phẩm hay 
                  phương pháp nào được đề cập trong phần chat.
                </p>
              </div>
            </div>

            {/* Section 4 */}
            <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl p-8 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-rose-400 rounded-xl flex items-center justify-center mr-4">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">4. Nội dung và bản quyền</h2>
              </div>
              <div className="space-y-4 text-gray-700 leading-relaxed text-lg">
                <p>
                  Mọi nội dung trên SkinVox (bài viết, hình ảnh, thiết kế, video...) thuộc quyền sở hữu của trang web hoặc 
                  được sử dụng có bản quyền.
                </p>
                <p className="font-semibold text-gray-900">
                  Người dùng không được sao chép, tái bản hoặc sử dụng lại nội dung mà không có sự đồng ý bằng văn bản từ SkinVox.
                </p>
              </div>
            </div>

            {/* Section 5 */}
            <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-8 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-rose-400 to-pink-400 rounded-xl flex items-center justify-center mr-4">
                  <ExternalLink className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">5. Liên kết ngoài (External Links)</h2>
              </div>
              <div className="space-y-4 text-gray-700 leading-relaxed text-lg">
                <p>
                  Website có thể chứa các liên kết đến trang web hoặc sản phẩm của bên thứ ba.
                </p>
                <p className="font-semibold text-gray-900">
                  SkinVox không chịu trách nhiệm về nội dung, chính sách hoặc chất lượng sản phẩm/dịch vụ được quảng cáo 
                  hoặc liên kết từ các trang bên ngoài.
                </p>
              </div>
            </div>

            {/* Section 6 */}
            <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl p-8 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-rose-400 rounded-xl flex items-center justify-center mr-4">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">6. Giới hạn trách nhiệm</h2>
              </div>
              <div className="space-y-4 text-gray-700 leading-relaxed text-lg">
                <p>
                  SkinVox không chịu trách nhiệm pháp lý hoặc bồi thường cho bất kỳ thiệt hại, mất mát, hoặc hậu quả nào 
                  (trực tiếp hoặc gián tiếp) phát sinh từ việc:
                </p>
                <ul className="space-y-3 ml-6 list-disc">
                  <li>Sử dụng thông tin trên trang;</li>
                  <li>Tin tưởng vào tư vấn qua chatbox;</li>
                  <li>Sử dụng sản phẩm, dịch vụ hoặc website bên thứ ba.</li>
                </ul>
              </div>
            </div>

            {/* Section 7 */}
            <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-8 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-rose-400 to-pink-400 rounded-xl flex items-center justify-center mr-4">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">7. Thay đổi chính sách</h2>
              </div>
              <div className="space-y-4 text-gray-700 leading-relaxed text-lg">
                <p>
                  SkinVox có quyền cập nhật, chỉnh sửa hoặc thay đổi Chính sách Miễn trừ pháp lý này bất kỳ lúc nào mà không 
                  cần thông báo trước.
                </p>
                <p>
                  Người dùng được khuyến nghị kiểm tra thường xuyên để nắm rõ các cập nhật mới nhất.
                </p>
              </div>
            </div>

            {/* Section 8 */}
            <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl p-8 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-rose-400 rounded-xl flex items-center justify-center mr-4">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">8. Liên hệ</h2>
              </div>
              <div className="space-y-4 text-gray-700 leading-relaxed text-lg">
                <p>
                  Nếu bạn có bất kỳ thắc mắc nào liên quan đến chính sách này, vui lòng liên hệ với chúng tôi qua email:
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
                <CheckCircle2 className="w-6 h-6 text-rose-600 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900 mb-2">Lưu ý quan trọng:</p>
                  <p className="text-gray-700 leading-relaxed">
                    Bằng việc sử dụng website SkinVox, bạn đã đồng ý với tất cả các điều khoản và quy định được nêu trong 
                    Chính sách Miễn trừ pháp lý này. Nếu bạn không đồng ý với bất kỳ điều khoản nào, vui lòng không sử dụng 
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

