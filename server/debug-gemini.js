// Debug script to check Gemini connection
require('dotenv').config();
const aiService = require('./services/aiService');

async function debugGemini() {
  console.log('🔍 Debugging Gemini Connection...\n');
  
  // Check API key
  const apiKey = process.env.GEMINI_API_KEY;
  console.log('1. API Key Check:');
  if (apiKey && apiKey !== 'your_api_key_here') {
    console.log(`   ✅ API Key found: ${apiKey.substring(0, 15)}...${apiKey.substring(apiKey.length - 5)}`);
    console.log(`   📏 Length: ${apiKey.length} characters`);
  } else {
    console.log('   ❌ API Key NOT found or invalid');
    return;
  }
  
  // Check if service is available
  console.log('\n2. AI Service Availability:');
  const isAvailable = aiService.isAvailable();
  console.log(`   Available: ${isAvailable}`);
  
  // Check providers
  const providers = aiService.getAvailableProviders();
  console.log(`   Providers: ${providers.join(', ') || 'None'}`);
  
  // Check internal state
  console.log('\n3. Internal State:');
  console.log(`   geminiAI: ${aiService.geminiAI ? '✅ Initialized' : '❌ Not initialized'}`);
  console.log(`   geminiModel: ${aiService.geminiModel ? '✅ Set' : '❌ Not set'}`);
  console.log(`   workingModelName: ${aiService.workingModelName || 'None'}`);
  
  // Test actual API call
  console.log('\n4. Testing API Call:');
  try {
    const result = await aiService.getAIResponse('Hi', []);
    if (result) {
      console.log(`   ✅ AI Response received from: ${result.provider}`);
      console.log(`   📝 Response: "${result.response.substring(0, 50)}..."`);
    } else {
      console.log('   ❌ AI returned null (falling back)');
    }
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
  }
  
  console.log('\n✅ Debug complete');
}

debugGemini().catch(console.error);

