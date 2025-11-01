// List available Gemini models
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function listModels() {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    console.log('❌ No API key');
    return;
  }

  console.log('🔍 Listing available Gemini models...\n');
  console.log('🔑 API Key:', apiKey.substring(0, 20) + '...\n');

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Try to list models using the SDK
    // Note: The SDK might not have a direct listModels method
    // But we can try different model names
    
    console.log('📋 Testing model availability:\n');
    
    const modelsToTest = [
      'gemini-pro',
      'gemini-1.0-pro',
      'gemini-1.5-flash',
      'gemini-1.5-pro',
      'gemini-2.0-flash-exp',
      'gemini-2.5-pro-exp-03-25'
    ];
    
    for (const modelName of modelsToTest) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        // Try a simple call
        const result = await model.generateContent('test');
        const response = await result.response;
        const text = response.text();
        
        console.log(`✅ ${modelName}: WORKING!`);
        console.log(`   Response: "${text.substring(0, 50)}..."`);
        console.log(`   This model is available for your API key!\n`);
        return modelName; // Found working model
      } catch (error) {
        if (error.message.includes('404')) {
          console.log(`❌ ${modelName}: 404 Not Found`);
        } else if (error.message.includes('403')) {
          console.log(`❌ ${modelName}: 403 Forbidden`);
        } else {
          console.log(`❌ ${modelName}: ${error.message.substring(0, 60)}`);
        }
      }
    }
    
    console.log('\n❌ No models are available!');
    console.log('\n💡 Possible solutions:');
    console.log('1. Create API key from Google AI Studio instead of Cloud Console:');
    console.log('   https://aistudio.google.com/app/apikey');
    console.log('2. Check if Generative AI API is enabled in project');
    console.log('3. Verify API key has correct permissions');
    console.log('4. Try enabling Vertex AI API if using Cloud Console key');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

listModels();

