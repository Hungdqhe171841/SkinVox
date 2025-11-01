// Direct test script with latest Gemini API
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testGeminiDirect() {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey || apiKey === 'your_api_key_here') {
    console.log('❌ GEMINI_API_KEY chưa được cấu hình');
    return;
  }

  console.log('🔑 API Key:', apiKey.substring(0, 10) + '...' + apiKey.substring(apiKey.length - 5));
  console.log('🧪 Testing Gemini connection...\n');

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Try with the most common model first
    const modelNames = [
      'gemini-1.5-flash',
      'gemini-1.5-pro', 
      'gemini-pro',
      'gemini-1.0-pro'
    ];
    
    let workingModel = null;
    
    for (const modelName of modelNames) {
      try {
        console.log(`🔍 Testing model: ${modelName}...`);
        const model = genAI.getGenerativeModel({ model: modelName });
        
        // Simple test with minimal prompt
        const prompt = 'Hi';
        const result = await model.generateContent({
          contents: [{ role: 'user', parts: [{ text: prompt }] }]
        });
        
        const response = result.response;
        const text = response.text();
        
        console.log(`✅ Model ${modelName} works!`);
        console.log(`📥 Response: "${text}"`);
        workingModel = modelName;
        break;
      } catch (e) {
        console.log(`❌ ${modelName}: ${e.message.substring(0, 80)}...`);
        continue;
      }
    }
    
    if (!workingModel) {
      throw new Error('No working model found');
    }
    
    // Now test with actual beauty question
    console.log('\n📤 Testing with beauty question...');
    const beautyModel = genAI.getGenerativeModel({ model: workingModel });
    const beautyPrompt = 'Xin chào! Bạn có thể giới thiệu ngắn gọn về làm đẹp không?';
    
    const result = await beautyModel.generateContent({
      contents: [{ role: 'user', parts: [{ text: beautyPrompt }] }]
    });
    
    const response = result.response;
    const text = response.text();
    
    console.log('\n✅ Gemini AI hoạt động thành công!');
    console.log('📥 Response:');
    console.log(text.substring(0, 200) + '...');
    console.log('\n🎉 Chatbot đã sẵn sàng sử dụng Gemini AI!');
    console.log(`✅ Recommended model: ${workingModel}`);
    
  } catch (error) {
    console.error('\n❌ Lỗi khi kết nối Gemini:');
    console.error('Error:', error.message);
    
    if (error.message.includes('API_KEY_INVALID') || error.message.includes('401')) {
      console.log('\n💡 API key không hợp lệ hoặc chưa được kích hoạt');
      console.log('💡 Vui lòng kiểm tra:');
      console.log('   1. API key đúng format');
      console.log('   2. Generative Language API đã được enable trong Google Cloud Console');
      console.log('   3. API key có quyền truy cập đúng project');
    } else if (error.message.includes('quota') || error.message.includes('429')) {
      console.log('\n💡 API key đã hết quota hoặc bị giới hạn rate limit');
    } else if (error.message.includes('404')) {
      console.log('\n💡 Model không tồn tại hoặc API version không đúng');
      console.log('💡 Có thể cần:');
      console.log('   1. Update package: npm install @google/generative-ai@latest');
      console.log('   2. Enable Generative Language API trong Google Cloud Console');
    }
  }
}

testGeminiDirect();

