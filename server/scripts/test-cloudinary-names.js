const cloudinary = require('cloudinary').v2;

// Test với các cloud name khác nhau
const cloudNames = ['SkinVox', 'skinvox', 'skin-vox', 'ddaa7'];

async function testCloudinaryNames() {
  console.log('🔍 Testing different Cloudinary cloud names...\n');

  for (const cloudName of cloudNames) {
    console.log(`🧪 Testing cloud name: ${cloudName}`);
    
    try {
      cloudinary.config({
        cloud_name: cloudName,
        api_key: '277762621615142',
        api_secret: '82yyRtiNlkZCXOpf382tkqRj4bk'
      });

      const result = await cloudinary.api.ping();
      console.log(`✅ SUCCESS with cloud name: ${cloudName}`);
      console.log('📊 Ping result:', result);
      
      // Test account info
      try {
        const accountInfo = await cloudinary.api.account();
        console.log('📊 Account info:', {
          plan: accountInfo.plan,
          used_storage: accountInfo.used_storage,
          credits_remaining: accountInfo.credits_remaining
        });
      } catch (error) {
        console.log('⚠️ Could not get account info:', error.message);
      }
      
      break; // Stop at first successful connection
      
    } catch (error) {
      console.log(`❌ Failed with cloud name: ${cloudName}`);
      console.log('Error:', error.message);
    }
    
    console.log('---');
  }
}

testCloudinaryNames();
