import React from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Heart, 
  Sparkles, 
  Target, 
  Users, 
  Award, 
  Shield, 
  Globe, 
  Lightbulb,
  ShoppingCart,
  MessageCircle,
  CheckCircle2,
  BookOpen,
  TrendingUp,
  Calendar,
  ArrowRight
} from 'lucide-react'

export default function About() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-rose-50 via-pink-50 to-rose-50 py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-rose-400 via-pink-400 to-rose-400 bg-clip-text text-transparent mb-6 animate-fade-in">
              Về Chúng Tôi
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed animate-slide-in-from-bottom-4">
              Trao quyền làm đẹp bằng tri thức - SkinVox là nền tảng tri thức và cảm hứng làm đẹp, 
              được xây dựng trên ba giá trị cốt lõi: Trung thực – Khoa học – Cộng đồng.
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-pink-200 to-transparent"></div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-in-from-bottom-2">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Câu Chuyện Của Chúng Tôi
              </h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p className="text-lg">
                  SkinVox được thành lập với sứ mệnh mang lại trải nghiệm làm đẹp hoàn toàn mới, 
                  nơi công nghệ gặp gỡ nghệ thuật makeup. Chúng tôi hiểu rằng việc chọn đúng sản phẩm 
                  làm đẹp không chỉ là mua hàng, mà còn là một hành trình khám phá và tự thể hiện bản thân.
                </p>
                <p className="text-lg">
                  Với sự phát triển của công nghệ Augmented Reality (AR), chúng tôi nhận ra tiềm năng 
                  to lớn trong việc giúp người dùng "thử nghiệm" các sản phẩm makeup trước khi mua. 
                  Điều này không chỉ tiết kiệm thời gian và tiền bạc, mà còn mang lại sự tự tin cho 
                  mọi quyết định làm đẹp.
                </p>
                <p className="text-lg">
                  Ngày nay, SkinVox không chỉ là một nền tảng thương mại điện tử, mà còn là cộng đồng 
                  nơi mọi người chia sẻ kinh nghiệm, học hỏi về chăm sóc da, và khám phá những xu hướng 
                  làm đẹp mới nhất.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl animate-fade-in">
                <img 
                  src="/assets/Ava.jpg" 
                  alt="SkinVox Team" 
                  className="w-full h-[500px] object-cover"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=800&h=600&fit=crop'
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                  <p className="text-lg font-semibold">SkinVox Team</p>
                  <p className="text-sm opacity-90">Đội ngũ đam mê và tận tâm</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-pink-50 via-rose-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Sứ Mệnh & Tầm Nhìn
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Chúng tôi cam kết mang đến những giá trị tốt nhất cho cộng đồng làm đẹp
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Mission Card */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 animate-slide-in-from-bottom-2">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-rose-400 to-pink-400 rounded-xl flex items-center justify-center mr-4">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Sứ Mệnh</h3>
              </div>
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Trao quyền làm đẹp bằng tri thức</h4>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  Tại SkinVox, chúng tôi tin rằng mỗi người đều có quyền hiểu rõ làn da của mình và tự tin 
                  chăm sóc bản thân theo cách khoa học, lành mạnh và bền vững.
                </p>
                <p>
                  Sứ mệnh của chúng tôi là truyền tải kiến thức làm đẹp chính xác, dễ hiểu và đáng tin cậy 
                  đến mọi người – đặc biệt là những ai đang bắt đầu hành trình chăm sóc da và trang điểm.
                </p>
                <p className="italic text-gray-600 border-l-4 border-rose-400 pl-4 py-2">
                  "Đẹp không chỉ là vẻ ngoài – đó là sự tự tin và hiểu biết về chính mình."
                </p>
                <p>
                  SkinVox mong muốn trở thành người bạn đồng hành của bạn trên con đường tìm hiểu và yêu thương 
                  làn da mỗi ngày, giúp bạn hiểu – chọn – và sử dụng đúng sản phẩm phù hợp nhất với bản thân.
                </p>
              </div>
            </div>

            {/* Vision Card */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 animate-slide-in-from-bottom-4">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-rose-400 rounded-xl flex items-center justify-center mr-4">
                  <Lightbulb className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Tầm Nhìn</h3>
              </div>
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Trở thành cộng đồng làm đẹp đáng tin cậy tại Việt Nam</h4>
              <p className="text-gray-700 mb-4 leading-relaxed">
                Chúng tôi hướng đến việc xây dựng một cộng đồng chia sẻ kiến thức làm đẹp chuẩn mực, 
                nơi mọi người có thể:
              </p>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-rose-400 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Học hỏi kiến thức skincare và makeup từ các chuyên gia, bài viết khoa học, và trải nghiệm thực tế.</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-rose-400 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Trao đổi, đặt câu hỏi, nhận tư vấn qua hệ thống chatbox và diễn đàn thân thiện.</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-rose-400 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Truy cập nguồn thông tin minh bạch, giúp bạn tránh xa "hype" quảng cáo và tập trung vào giá trị thật của làn da.</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-rose-400 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Đồng hành cùng công nghệ AR giúp bạn tìm được sản phẩm thực sự phù hợp với bản thân.</span>
                </li>
              </ul>
              <p className="text-gray-700 mt-4 leading-relaxed">
                SkinVox không chỉ là một blog, mà là một nền tảng tri thức và cảm hứng làm đẹp, 
                được xây dựng trên ba giá trị cốt lõi: <strong className="text-gray-900">Trung thực – Khoa học – Cộng đồng</strong>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Giá Trị Cốt Lõi
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Ba nguyên tắc cơ bản dẫn dắt mọi hoạt động của chúng tôi
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Value 1: Trung thực */}
            <div className="group bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 animate-fade-in">
              <div className="w-16 h-16 bg-gradient-to-br from-rose-400 to-pink-400 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Trung Thực</h3>
              <p className="text-gray-700 leading-relaxed text-lg">
                Chúng tôi cam kết đánh giá trung thực, minh bạch trong mọi thông tin sản phẩm, 
                giúp bạn tránh xa những "hype" quảng cáo và tập trung vào giá trị thật của từng sản phẩm.
              </p>
            </div>

            {/* Value 2: Khoa học */}
            <div className="group bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 animate-fade-in">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-rose-400 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Khoa Học</h3>
              <p className="text-gray-700 leading-relaxed text-lg">
                Mọi kiến thức và đánh giá của chúng tôi đều dựa trên nghiên cứu khoa học, bài viết chuyên sâu 
                và trải nghiệm thực tế, giúp bạn hiểu rõ làn da và sản phẩm phù hợp.
              </p>
            </div>

            {/* Value 3: Cộng đồng */}
            <div className="group bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 animate-fade-in">
              <div className="w-16 h-16 bg-gradient-to-br from-rose-400 to-pink-400 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Cộng Đồng</h3>
              <p className="text-gray-700 leading-relaxed text-lg">
                Xây dựng một cộng đồng tích cực nơi mọi người có thể chia sẻ kinh nghiệm, hỏi đáp, 
                nhận tư vấn và cùng nhau phát triển trong hành trình chăm sóc da và làm đẹp.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Future Goals Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-pink-50 via-rose-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-4">
              <TrendingUp className="w-8 h-8 text-rose-400 mr-3" />
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Mục Tiêu Tương Lai
              </h2>
            </div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Bền vững và lan tỏa - Hành trình phát triển của SkinVox
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Short-term Goals */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-rose-400 to-pink-400 rounded-xl flex items-center justify-center mr-4">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Ngắn Hạn</h3>
                  <p className="text-sm text-gray-500">2025 – 2026</p>
                </div>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <ArrowRight className="w-5 h-5 text-rose-400 mr-3 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">
                    Hoàn thiện hệ thống nội dung chuyên sâu về chăm sóc da, trang điểm và chăm sóc bản thân.
                  </span>
                </li>
                <li className="flex items-start">
                  <ArrowRight className="w-5 h-5 text-rose-400 mr-3 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">
                    Ra mắt chuyên mục review minh bạch, chỉ giới thiệu sản phẩm thực sự hiệu quả và an toàn.
                  </span>
                </li>
                <li className="flex items-start">
                  <ArrowRight className="w-5 h-5 text-rose-400 mr-3 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">
                    Nâng cấp chatbox tư vấn thông minh, giúp người dùng hiểu rõ làn da và sản phẩm phù hợp hơn.
                  </span>
                </li>
                <li className="flex items-start">
                  <ArrowRight className="w-5 h-5 text-rose-400 mr-3 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">
                    Nâng cấp hệ thống AR, cập nhật nhiều tính năng sản phẩm, ưu tiên hành trình cá nhân hóa cho người dùng.
                  </span>
                </li>
              </ul>
            </div>

            {/* Long-term Goals */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-rose-400 rounded-xl flex items-center justify-center mr-4">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Dài Hạn</h3>
                  <p className="text-sm text-gray-500">2027 trở đi</p>
                </div>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <ArrowRight className="w-5 h-5 text-pink-400 mr-3 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">
                    Phát triển SkinVox thành trung tâm kiến thức làm đẹp số 1 tại Việt Nam, kết nối với chuyên gia và thương hiệu uy tín.
                  </span>
                </li>
                <li className="flex items-start">
                  <ArrowRight className="w-5 h-5 text-pink-400 mr-3 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">
                    Tổ chức các chiến dịch truyền thông, workshop và dự án cộng đồng lan tỏa thông điệp "Hiểu da – Yêu da – Sống đẹp".
                  </span>
                </li>
                <li className="flex items-start">
                  <ArrowRight className="w-5 h-5 text-pink-400 mr-3 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">
                    Tiến tới xây dựng ứng dụng SkinVox App, cá nhân hóa hành trình chăm sóc da cho từng người dùng.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-pink-50 to-rose-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Công Nghệ Tiên Tiến
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Chúng tôi sử dụng những công nghệ mới nhất để mang lại trải nghiệm tốt nhất
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-br from-rose-400 to-pink-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Augmented Reality</h3>
              <p className="text-gray-700">
                Công nghệ AR cho phép bạn thử nghiệm sản phẩm makeup trực tiếp trên khuôn mặt 
                trước khi quyết định mua hàng.
              </p>
            </div>

            <div className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-rose-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">AI Chatbot</h3>
              <p className="text-gray-700">
                Trợ lý AI thông minh sẵn sàng tư vấn 24/7, giúp bạn tìm kiếm sản phẩm phù hợp 
                với loại da và nhu cầu của mình.
              </p>
            </div>

            <div className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-br from-rose-400 to-pink-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Phân Tích Khoa Học</h3>
              <p className="text-gray-700">
                Hệ thống phân tích thành phần dựa trên nghiên cứu khoa học, giúp bạn hiểu rõ 
                về từng sản phẩm trước khi sử dụng.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-rose-400 via-pink-400 to-rose-400">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Sẵn Sàng Bắt Đầu Hành Trình Làm Đẹp Của Bạn?
          </h2>
          <p className="text-xl text-white/95 mb-8 leading-relaxed">
            Khám phá các sản phẩm làm đẹp chất lượng cao và trải nghiệm công nghệ AR độc đáo của chúng tôi
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/beautybar')}
              className="bg-white text-rose-500 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
            >
              <ShoppingCart className="w-5 h-5" />
              Khám Phá Sản Phẩm
            </button>
            <button
              onClick={() => navigate('/chatbot')}
              className="bg-white/10 backdrop-blur-sm text-white border-2 border-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/20 transition-colors flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-5 h-5" />
              Trò Chuyện Với AI
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

