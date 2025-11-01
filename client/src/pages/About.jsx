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
  CheckCircle2
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
              SkinVox - Nền tảng làm đẹp thông minh với công nghệ AR tiên tiến, 
              giúp bạn khám phá và thử nghiệm các sản phẩm makeup một cách trực quan và chính xác.
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
              <p className="text-gray-700 leading-relaxed text-lg">
                SkinVox cam kết mang lại trải nghiệm mua sắm làm đẹp thông minh và cá nhân hóa, 
                sử dụng công nghệ AR để giúp khách hàng đưa ra quyết định chính xác và tự tin. 
                Chúng tôi tin rằng mọi người đều xứng đáng được trải nghiệm vẻ đẹp tự nhiên của mình 
                với những sản phẩm chất lượng cao và phù hợp nhất.
              </p>
            </div>

            {/* Vision Card */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 animate-slide-in-from-bottom-4">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-rose-400 rounded-xl flex items-center justify-center mr-4">
                  <Lightbulb className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Tầm Nhìn</h3>
              </div>
              <p className="text-gray-700 leading-relaxed text-lg">
                Trở thành nền tảng làm đẹp hàng đầu tại Việt Nam và khu vực, nơi công nghệ AI và AR 
                được tích hợp sâu để mang lại trải nghiệm mua sắm độc đáo. Chúng tôi hướng tới việc 
                xây dựng một cộng đồng nơi mọi người có thể chia sẻ, học hỏi và khám phá vẻ đẹp của 
                chính mình với sự tự tin và kiến thức đầy đủ.
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
              Những nguyên tắc dẫn dắt mọi hoạt động của chúng tôi
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Value 1: Innovation */}
            <div className="group bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 animate-fade-in">
              <div className="w-14 h-14 bg-gradient-to-br from-rose-400 to-pink-400 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Đổi Mới</h3>
              <p className="text-gray-700 leading-relaxed">
                Chúng tôi không ngừng đổi mới và áp dụng công nghệ tiên tiến nhất để mang lại 
                trải nghiệm tốt nhất cho người dùng.
              </p>
            </div>

            {/* Value 2: Quality */}
            <div className="group bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 animate-fade-in">
              <div className="w-14 h-14 bg-gradient-to-br from-pink-400 to-rose-400 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Award className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Chất Lượng</h3>
              <p className="text-gray-700 leading-relaxed">
                Chúng tôi chỉ cung cấp những sản phẩm được kiểm định chất lượng, đảm bảo an toàn 
                và hiệu quả cho người sử dụng.
              </p>
            </div>

            {/* Value 3: Transparency */}
            <div className="group bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 animate-fade-in">
              <div className="w-14 h-14 bg-gradient-to-br from-pink-400 to-rose-400 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Minh Bạch</h3>
              <p className="text-gray-700 leading-relaxed">
                Chúng tôi cam kết minh bạch trong mọi giao dịch, đánh giá trung thực và công khai 
                thông tin sản phẩm một cách đầy đủ.
              </p>
            </div>

            {/* Value 4: Community */}
            <div className="group bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 animate-fade-in">
              <div className="w-14 h-14 bg-gradient-to-br from-rose-400 to-pink-400 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Users className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Cộng Đồng</h3>
              <p className="text-gray-700 leading-relaxed">
                Chúng tôi xây dựng một cộng đồng tích cực nơi mọi người có thể chia sẻ kinh nghiệm 
                và hỗ trợ lẫn nhau trong hành trình làm đẹp.
              </p>
            </div>

            {/* Value 5: Global Reach */}
            <div className="group bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 animate-fade-in">
              <div className="w-14 h-14 bg-gradient-to-br from-rose-400 to-pink-400 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Globe className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Tiếp Cận Toàn Cầu</h3>
              <p className="text-gray-700 leading-relaxed">
                Chúng tôi mang đến những xu hướng và sản phẩm làm đẹp tốt nhất từ khắp nơi trên thế giới, 
                phù hợp với nhu cầu của thị trường Việt Nam.
              </p>
            </div>

            {/* Value 6: Customer Care */}
            <div className="group bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 animate-fade-in">
              <div className="w-14 h-14 bg-gradient-to-br from-pink-400 to-rose-400 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Heart className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Chăm Sóc Khách Hàng</h3>
              <p className="text-gray-700 leading-relaxed">
                Sự hài lòng của khách hàng là ưu tiên hàng đầu. Chúng tôi luôn lắng nghe và cải thiện 
                dịch vụ để đáp ứng mọi nhu cầu của bạn.
              </p>
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

