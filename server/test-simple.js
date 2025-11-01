// Simple test with basic string format
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testSimple() {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    console.log('❌ No API key');
    return;
  }

  console.log('🔑 Testing with API key...\n');

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Try with simple string format
    const models = ['gemini-pro', 'gemini-1.5-flash', 'gemini-1.5-pro'];
    
    for (const modelName of models) {
      try {
        console.log(`Testing ${modelName}...`);
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent('Say hi');
        const response = await result.response;
        const text = response.text();
        
        console.log(`✅ ${modelName} works! Response: "${text.substring(0, 50)}..."`);
        return modelName;
      } catch (e) {
        console.log(`❌ ${modelName}: ${e.message.substring(0, 100)}`);
      }
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testSimple();

