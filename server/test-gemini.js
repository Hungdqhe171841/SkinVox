// Quick test script to verify Gemini API key
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testGemini() {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey || apiKey === 'your_api_key_here') {
    console.log('❌ GEMINI_API_KEY chưa được cấu hình trong .env');
    console.log('📝 Vui lòng thêm GEMINI_API_KEY=your_actual_key vào file .env');
    return;
  }

  console.log('🔑 API Key found (length:', apiKey.length, ')');
  console.log('🧪 Testing Gemini connection...\n');

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Try different model names
    const modelsToTry = [
      'gemini-pro',
      'gemini-1.5-flash',
      'gemini-1.5-pro',
      'gemini-1.5-flash-latest',
      'gemini-1.5-pro-latest'
    ];
    
    let workingModel = null;
    let model = null;
    
    for (const modelName of modelsToTry) {
      try {
        console.log(`🔍 Trying model: ${modelName}...`);
        model = genAI.getGenerativeModel({ model: modelName });
        // Test with a simple prompt
        const testResult = await model.generateContent('Hi');
        workingModel = modelName;
        console.log(`✅ Model ${modelName} works!`);
        break;
      } catch (e) {
        console.log(`❌ Model ${modelName} failed: ${e.message.substring(0, 50)}...`);
        continue;
      }
    }
    
    if (!workingModel) {
      console.log('\n⚠️  No working model found. Trying gemini-pro as default...');
      model = genAI.getGenerativeModel({ model: 'gemini-pro' });
      workingModel = 'gemini-pro';
    }
    
    const prompt = 'Xin chào! Bạn có thể giới thiệu ngắn gọn về làm đẹp không?';
    console.log(`\n📤 Using model: ${workingModel}`);
    console.log('📤 Sending test message:', prompt);
    console.log('⏳ Waiting for response...\n');

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log('✅ Gemini AI hoạt động thành công!');
    console.log('📥 Response:');
    console.log(text);
    console.log('\n🎉 Chatbot đã sẵn sàng sử dụng AI!');
  } catch (error) {
    console.error('❌ Lỗi khi kết nối Gemini:');
    console.error(error.message);
    
    if (error.message.includes('API_KEY_INVALID') || error.message.includes('401')) {
      console.log('\n💡 API key không hợp lệ. Vui lòng kiểm tra lại key trong .env');
    } else if (error.message.includes('quota') || error.message.includes('429')) {
      console.log('\n💡 API key đã hết quota hoặc bị giới hạn');
    } else if (error.message.includes('404')) {
      console.log('\n💡 Model không tồn tại. Vui lòng kiểm tra lại tên model');
      console.log('💡 Có thể cần update package @google/generative-ai');
    }
  }
}

testGemini();
