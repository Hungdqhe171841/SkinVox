const cloudinary = require('cloudinary').v2;

async function testCloudinaryDTKIWWWCM() {
  console.log('🔍 Testing Cloudinary with dtkiwwwcm cloud name...\n');

  try {
    // Configure with correct cloud name
    cloudinary.config({
      cloud_name: 'dtkiwwwcm',
      api_key: '277762621615142',
      api_secret: '82yyRtiNlkZCXOpf382tkqRj4bk'
    });

    console.log('📋 Configuration:');
    console.log('Cloud Name: dtkiwwwcm');
    console.log('API Key: 277762621615142');
    console.log('API Secret: SET');

    // Test ping
    console.log('\n🧪 Testing ping...');
    const result = await cloudinary.api.ping();
    console.log('✅ Ping successful:', result);

    // Test account info
    console.log('\n🧪 Testing account info...');
    const accountInfo = await cloudinary.api.account();
    console.log('✅ Account info:', {
      plan: accountInfo.plan,
      used_storage: accountInfo.used_storage,
      credits_remaining: accountInfo.credits_remaining
    });

    // Test list resources
    console.log('\n🧪 Testing list resources...');
    const resources = await cloudinary.api.resources({ max_results: 10 });
    console.log('✅ Resources found:', resources.resources.length);
    
    resources.resources.forEach((resource, index) => {
      console.log(`📸 Resource ${index + 1}:`);
      console.log(`  - Public ID: ${resource.public_id}`);
      console.log(`  - URL: ${resource.secure_url}`);
      console.log(`  - Format: ${resource.format}`);
      console.log(`  - Size: ${resource.bytes} bytes`);
    });

    console.log('\n✅ All tests passed! Cloudinary is working correctly.');

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

testCloudinaryDTKIWWWCM();
