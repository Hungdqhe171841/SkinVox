const express = require('express');
const router = express.Router();
const aiService = require('../services/aiService');
const Blog = require('../models/Blog');
const Lipstick = require('../models/Lipstick');
const Eyeshadow = require('../models/Eyeshadow');
const Blush = require('../models/Blush');
const Eyebrows = require('../models/Eyebrows');
const Eyeliners = require('../models/Eyeliners');

// Knowledge base for beauty and makeup questions
const knowledgeBase = {
  // Skincare questions
  'da dầu': {
    keywords: ['da dầu', 'da nhờn', 'dầu', 'nhờn', 'oily'],
    response: `Đối với da dầu, bạn nên:
1. **Làm sạch**: Sử dụng sữa rửa mặt cho da dầu 2 lần/ngày (sáng và tối)
2. **Toner**: Dùng toner không cồn để cân bằng pH
3. **Serum**: Niacinamide hoặc Salicylic Acid giúp kiểm soát dầu
4. **Kem dưỡng**: Chọn gel hoặc lotion nhẹ, không gây bít tắc
5. **Kem chống nắng**: Bắt buộc! Chọn loại không dầu (oil-free)
6. **Makeup**: Sử dụng primer kiểm soát dầu và setting spray

**Sản phẩm gợi ý**: Foundation dạng lỏng, powder compact, blotting papers để kiểm soát dầu trong ngày.`
  },
  
  'chăm sóc da': {
    keywords: ['chăm sóc da', 'skincare', 'routine', 'quy trình'],
    response: `**Quy trình chăm sóc da cơ bản hàng ngày:**

🌅 **BUỔI SÁNG:**
1. Rửa mặt với sữa rửa mặt nhẹ
2. Toner
3. Serum Vitamin C (tùy chọn)
4. Kem dưỡng ẩm
5. **Kem chống nắng** (quan trọng nhất!)

🌙 **BUỔI TỐI:**
1. Tẩy trang (nếu có makeup)
2. Rửa mặt
3. Toner
4. Serum điều trị (Retinol, AHA/BHA tùy nhu cầu)
5. Kem dưỡng ẩm

**Mẹo**: Uống đủ nước, ngủ đủ giấc, và thay đổi khăn gối thường xuyên!`
  },
  
  'màu son': {
    keywords: ['màu son', 'son môi', 'lipstick', 'chọn son', 'màu son phù hợp'],
    response: `**Cách chọn màu son phù hợp:**

🎨 **Theo tông da:**
- **Da trắng**: Hầu hết màu đều đẹp, thử các tông nude, hồng, đỏ tươi
- **Da ngăm**: Tông đỏ đậm, cam, berry, nude ấm
- **Da vàng**: Cam san hô, đỏ cam, nude ấm, hồng đào

💡 **Theo khuôn miệng:**
- **Môi mỏng**: Son bóng hoặc màu sáng để tạo độ đầy
- **Môi dày**: Có thể dùng mọi màu, son matte rất đẹp

**Gợi ý**: Thử nghiệm với AR Makeup của SkinVox để xem màu son phù hợp trước khi mua!`
  },
  
  'che khuyết điểm': {
    keywords: ['che khuyết điểm', 'concealer', 'che', 'mụn', 'thâm'],
    response: `**Cách che khuyết điểm hiệu quả:**

1. **Chọn đúng màu**: Concealer nên sáng hơn foundation 1-2 tông
2. **Kỹ thuật**: Dùng cọ hoặc beauty blender, tap nhẹ, không kéo
3. **Màu điều chỉnh**:
   - Đỏ/mụn đỏ → Màu xanh lá cây
   - Thâm quầng mắt → Màu cam/peach
   - Da vàng/không đều → Màu tím/lavender

4. **Bước thực hiện**:
   - Thoa một chấm nhỏ lên khuyết điểm
   - Dùng ngón tay hoặc cọ nhỏ tap đều
   - Set với powder để lâu trôi
   - Blend với foundation xung quanh

**Mẹo**: Dùng primer trước để concealer bám tốt hơn!`
  },
  
  'foundation': {
    keywords: ['foundation', 'kem nền', 'phấn nền', 'base makeup'],
    response: `**Hướng dẫn chọn và dùng foundation:**

🎯 **Chọn loại:**
- **Da khô**: Liquid foundation, dewy finish
- **Da dầu**: Matte foundation, powder foundation
- **Da hỗn hợp**: Satin finish, buildable coverage

🎨 **Chọn màu:**
- Test trên vùng quai hàm, không phải tay
- Màu phù hợp khi blend vào da tự nhiên
- Kiểm tra dưới ánh sáng tự nhiên

💫 **Cách apply:**
1. Dưỡng ẩm và primer trước
2. Dùng beauty sponge hoặc brush
3. Apply từ giữa ra ngoài
4. Set với powder ở vùng T-zone

**SkinVox AR** giúp bạn thử màu foundation ảo trước khi mua!`
  },
  
  'eyeshadow': {
    keywords: ['eyeshadow', 'phấn mắt', 'trang điểm mắt'],
    response: `**Hướng dẫn trang điểm mắt:**

👁️ **Kỹ thuật cơ bản:**
1. **Base**: Dùng primer mắt hoặc concealer để màu bám và lâu trôi
2. **Màu nền**: Màu sáng nhất cho toàn bộ mí
3. **Màu tạo chiều sâu**: Màu đậm hơn ở góc ngoài và nếp gấp mắt
4. **Highlight**: Màu sáng nhất ở xương chân mày và góc trong mắt
5. **Blend**: Quan trọng! Blend để không có đường ranh giới rõ ràng

🎨 **Màu cơ bản cần có:**
- Màu nude/beige
- Màu nâu đậm
- Màu highlight
- Màu tự chọn theo sở thích

**SkinVox AR** có bộ Eyeshadow Presets để bạn thử nghiệm!`
  },
  
  'blush': {
    keywords: ['blush', 'má hồng', 'rouge', 'má phấn'],
    response: `**Cách đánh má hồng tự nhiên:**

🌸 **Vị trí đúng:**
- Cười nhẹ để xác định phần má nổi cao
- Đánh từ giữa má ra ngoài, lên trên một chút về phía thái dương
- Không đánh quá gần mũi

🎨 **Màu sắc:**
- **Da trắng**: Hồng phấn, hồng đào
- **Da vàng**: Cam san hô, đào ấm
- **Da ngăm**: Đỏ cam, berry đậm

💫 **Kỹ thuật:**
- Dùng brush lớn, lông mềm
- Tap nhẹ, blend ra ngoài
- Build từ nhẹ đến đậm

**SkinVox AR** có Blush Presets để bạn thử màu trước!`
  }
};

// Default responses for greetings and common questions
const defaultResponses = {
  greetings: [
    'Xin chào! Tôi có thể giúp gì cho bạn về làm đẹp?',
    'Chào bạn! Bạn muốn biết gì về makeup hay skincare?',
    'Hi! Tôi sẵn sàng tư vấn về làm đẹp cho bạn!'
  ],
  general: [
    'Tôi hiểu bạn đang quan tâm đến chủ đề này. Bạn có thể hỏi cụ thể hơn không? Ví dụ: "Sản phẩm nào phù hợp với da dầu?" hoặc "Cách chọn màu son?"',
    'Để tôi tư vấn tốt hơn, bạn có thể hỏi về: skincare routine, chọn sản phẩm makeup, kỹ thuật trang điểm, hoặc chăm sóc da. Bạn muốn biết gì cụ thể?'
  ]
};

// Function to find relevant response
function findResponse(message) {
  const lowerMessage = message.toLowerCase();
  
  // Check for greetings
  if (lowerMessage.match(/chào|hello|hi|xin chào|hey/)) {
    return defaultResponses.greetings[
      Math.floor(Math.random() * defaultResponses.greetings.length)
    ];
  }
  
  // Check knowledge base
  for (const [key, data] of Object.entries(knowledgeBase)) {
    const found = data.keywords.some(keyword => lowerMessage.includes(keyword));
    if (found) {
      return data.response;
    }
  }
  
  // Check for specific product questions
  if (lowerMessage.includes('sản phẩm') || lowerMessage.includes('product')) {
    return `SkinVox có nhiều sản phẩm makeup chất lượng:
- **Lipstick**: Nhiều màu sắc, texture mịn màng
- **Eyeshadow**: Bảng màu đa dạng, pigment cao
- **Blush**: Tự nhiên, dễ blend
- **Foundation**: Nhiều tông màu, phù hợp mọi loại da

Bạn có thể xem và thử sản phẩm qua AR Makeup tại BeautyBar. Bạn quan tâm loại sản phẩm nào?`;
  }
  
  // Check for AR/Makeup AR questions
  if (lowerMessage.includes('ar') || lowerMessage.includes('thử') || lowerMessage.includes('makeup ar')) {
    return `**SkinVox AR Makeup** là công nghệ thử trang điểm ảo:
✨ Thử son môi, eyeshadow, blush, eyebrow, eyeliner trực tiếp trên khuôn mặt
📱 Sử dụng camera để xem hiệu ứng real-time
🎨 Hàng trăm màu sắc và preset để lựa chọn

Cách dùng:
1. Vào trang **BeautyBar** hoặc **Makeup AR**
2. Chọn sản phẩm muốn thử
3. Cho phép truy cập camera
4. Xem và chọn màu phù hợp với bạn!

Bạn muốn thử sản phẩm nào?`;
  }
  
  // Check for blog/content questions
  if (lowerMessage.includes('blog') || lowerMessage.includes('bài viết') || lowerMessage.includes('mẹo')) {
    return `SkinVox có nhiều bài viết hữu ích về:
📝 Mẹo làm đẹp
💄 Hướng dẫn trang điểm
🌸 Chăm sóc da
🔥 Xu hướng làm đẹp mới nhất

Bạn có thể xem tại mục **Blog** trên website. Bạn quan tâm chủ đề gì?`;
  }
  
  // Default response
  return defaultResponses.general[
    Math.floor(Math.random() * defaultResponses.general.length)
  ] + ` 

Tôi có thể giúp bạn về:
- 💄 Chọn sản phẩm makeup phù hợp
- 🌸 Chăm sóc da hàng ngày
- 🎨 Kỹ thuật trang điểm
- 📱 Cách sử dụng AR Makeup
- 💡 Mẹo làm đẹp

Bạn muốn biết gì cụ thể?`;
}

// @route   POST /api/chatbot/message
// @desc    Handle chatbot message and return response using AI (Gemini/OpenAI) with fallback
// @access  Public
router.post('/message', async (req, res) => {
  try {
    const { message, conversationHistory = [] } = req.body;
    
    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập câu hỏi'
      });
    }
    
    let response = null;
    let provider = 'fallback';
    
    // Retrieve real data (blogs + products) relevant to the user message
    let contextText = '';
    try {
      const searchTerm = String(message).slice(0, 120);
      const [blogs, lipsticks, eyeshadows, blush, eyebrows, eyeliners] = await Promise.all([
        Blog.find({ $text: { $search: searchTerm }, status: 'published' })
          .select('title description createdAt')
          .limit(3),
        Lipstick.find({ $text: { $search: searchTerm } }).select('name brand').limit(3),
        Eyeshadow.find({ $text: { $search: searchTerm } }).select('name brand').limit(3),
        Blush.find({ $text: { $search: searchTerm } }).select('name brand').limit(3),
        Eyebrows.find({ $text: { $search: searchTerm } }).select('name brand').limit(3),
        Eyeliners.find({ $text: { $search: searchTerm } }).select('name brand').limit(3)
      ]);
      const productLines = [
        ...lipsticks.map(p => `- Son/Lipstick: ${p.name} (${p.brand || 'N/A'})`),
        ...eyeshadows.map(p => `- Eyeshadow: ${p.name} (${p.brand || 'N/A'})`),
        ...blush.map(p => `- Blush: ${p.name} (${p.brand || 'N/A'})`),
        ...eyebrows.map(p => `- Eyebrow: ${p.name} (${p.brand || 'N/A'})`),
        ...eyeliners.map(p => `- Eyeliner: ${p.name} (${p.brand || 'N/A'})`)
      ].slice(0, 6);
      const blogLines = blogs.map(b => `- ${b.title}`);
      if (blogLines.length || productLines.length) {
        contextText = `Dữ liệu thực từ SkinVox (tối đa 3 bài viết, 6 sản phẩm):\n` +
          (blogLines.length ? `Bài viết liên quan:\n${blogLines.join('\n')}\n` : '') +
          (productLines.length ? `Sản phẩm liên quan:\n${productLines.join('\n')}\n` : '');
      }
    } catch (ctxErr) {
      console.log('Chatbot: skip context fetch (no index or empty):', ctxErr.message);
    }
    
    // Try AI first if available
    if (aiService.isAvailable()) {
      try {
        console.log('🤖 Chatbot: Attempting to use AI...');
        const enriched = contextText ? `${contextText}\n\nCâu hỏi: ${message}` : message;
        const aiResult = await aiService.getAIResponse(enriched, conversationHistory);
        if (aiResult) {
          response = aiResult.response;
          provider = aiResult.provider;
          console.log(`✅ Chatbot: Successfully using ${provider} AI`);
        } else {
          console.log('⚠️  Chatbot: AI service returned null, using fallback');
        }
      } catch (error) {
        console.error('❌ Chatbot: AI Service error:', error.message);
        console.log('📚 Chatbot: Falling back to knowledge base');
        // Fall through to knowledge base
      }
    } else {
      console.log('📚 Chatbot: AI not available, using knowledge base');
    }
    
    // Fallback to knowledge base if AI fails or not available
    if (!response) {
      // If we have context from real data, compose a helpful answer with links
      if (contextText) {
        response = `${findResponse(message)}\n\n${contextText}\nBạn có thể xem thêm tại mục Blog và BeautyBar để biết chi tiết.`;
      } else {
        response = findResponse(message);
      }
    }
    
    res.json({
      success: true,
      response: response,
      provider: provider, // 'gemini', 'openai', or 'fallback'
      aiEnabled: provider !== 'fallback',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Chatbot Debug - Error:', error);
    res.status(500).json({
      success: false,
      message: 'Đã có lỗi xảy ra. Vui lòng thử lại sau.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   GET /api/chatbot/health
// @desc    Check chatbot service health and AI availability
// @access  Public
router.get('/health', async (req, res) => {
  const aiAvailable = aiService.isAvailable();
  const providers = aiService.getAvailableProviders();
  
  // Test Gemini connection if available
  let geminiTest = null;
  if (aiAvailable && providers.includes('Gemini')) {
    try {
      const testResult = await aiService.getAIResponse('test', []);
      if (testResult && testResult.provider) {
        geminiTest = {
          status: 'connected',
          provider: testResult.provider
        };
      } else {
        // AI returned null, meaning it fell back to knowledge base
        geminiTest = {
          status: 'fallback',
          message: 'Gemini API not working, using knowledge base fallback',
          error: 'All models failed or API not enabled'
        };
      }
    } catch (error) {
      geminiTest = {
        status: 'error',
        error: error.message.substring(0, 100)
      };
    }
  }
  
  res.json({
    success: true,
    message: 'Chatbot service is running',
    aiAvailable: aiAvailable,
    aiProviders: providers,
    geminiTest: geminiTest,
    timestamp: new Date().toISOString(),
    note: aiAvailable ? 'AI is configured and ready' : 'AI not configured - using knowledge base fallback'
  });
});

module.exports = router;
