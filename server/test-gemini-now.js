// Quick test after API enable
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testNow() {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    console.log('❌ No API key');
    return;
  }

  console.log('🔑 Testing Gemini after API enable...\n');
  console.log('API Key:', apiKey.substring(0, 15) + '...' + apiKey.substring(apiKey.length - 5));
  console.log('Project from key might be: 871987427351\n');

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Try models in order
    const models = ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-pro'];
    
    for (const modelName of models) {
      try {
        console.log(`🔄 Testing ${modelName}...`);
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent('Hi');
        const response = await result.response;
        const text = response.text();
        
        console.log(`\n✅ SUCCESS! Model ${modelName} works!`);
        console.log(`📝 Response: "${text.substring(0, 100)}..."`);
        console.log(`\n🎉 Gemini is now working!`);
        return;
      } catch (e) {
        if (e.message.includes('404')) {
          console.log(`   ❌ 404 - API not enabled or wrong project`);
        } else if (e.message.includes('403')) {
          console.log(`   ❌ 403 - Permission denied`);
        } else {
          console.log(`   ❌ Error: ${e.message.substring(0, 60)}...`);
        }
        continue;
      }
    }
    
    console.log('\n❌ All models failed. Possible issues:');
    console.log('   1. API not enabled in the project that owns this API key');
    console.log('   2. API key belongs to different project');
    console.log('   3. Need to wait a few minutes for API to propagate');
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testNow();

