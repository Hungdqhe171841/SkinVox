const cloudinary = require('cloudinary').v2;
require('dotenv').config();

async function checkCloudinaryConfig() {
  console.log('🔍 Checking Cloudinary Configuration...\n');

  // Check environment variables
  console.log('📋 Environment Variables:');
  console.log('CLOUDINARY_CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME || 'NOT SET');
  console.log('CLOUDINARY_API_KEY:', process.env.CLOUDINARY_API_KEY || 'NOT SET');
  console.log('CLOUDINARY_API_SECRET:', process.env.CLOUDINARY_API_SECRET ? 'SET' : 'NOT SET');
  console.log('STORAGE_TYPE:', process.env.STORAGE_TYPE || 'NOT SET (defaults to cloudinary)');

  // Configure Cloudinary
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });

  console.log('\n🔧 Cloudinary Configuration:');
  console.log('Cloud Name:', cloudinary.config().cloud_name);
  console.log('API Key:', cloudinary.config().api_key);
  console.log('API Secret:', cloudinary.config().api_secret ? 'SET' : 'NOT SET');

  // Test Cloudinary connection
  try {
    console.log('\n🧪 Testing Cloudinary connection...');
    
    // Test with a simple API call
    const result = await cloudinary.api.ping();
    console.log('✅ Cloudinary connection successful!');
    console.log('📊 Ping result:', result);

    // Get account info
    try {
      const accountInfo = await cloudinary.api.account();
      console.log('\n📊 Account Information:');
      console.log('Plan:', accountInfo.plan);
      console.log('Storage Used:', accountInfo.used_storage);
      console.log('Credits Used:', accountInfo.credits_used);
      console.log('Credits Remaining:', accountInfo.credits_remaining);
    } catch (error) {
      console.log('⚠️ Could not fetch account info:', error.message);
    }

    // Test upload with a small image
    console.log('\n🧪 Testing image upload...');
    
    // Create a small test image buffer (1x1 pixel PNG)
    const testImageBuffer = Buffer.from([
      0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D,
      0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
      0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53, 0xDE, 0x00, 0x00, 0x00,
      0x0C, 0x49, 0x44, 0x41, 0x54, 0x08, 0xD7, 0x63, 0xF8, 0x00, 0x00, 0x00,
      0x00, 0x01, 0x00, 0x01, 0x00, 0x00, 0x00, 0x37, 0x6E, 0xF9, 0x24, 0x00,
      0x00, 0x00, 0x00, 0x49, 0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82
    ]);

    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          public_id: `test/skinvox-test-${Date.now()}`,
          folder: 'test',
          resource_type: 'image'
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );
      uploadStream.end(testImageBuffer);
    });

    console.log('✅ Test upload successful!');
    console.log('📊 Upload result:', {
      public_id: uploadResult.public_id,
      secure_url: uploadResult.secure_url,
      format: uploadResult.format,
      bytes: uploadResult.bytes
    });

    // Clean up test image
    try {
      await cloudinary.uploader.destroy(uploadResult.public_id);
      console.log('✅ Test image cleaned up successfully');
    } catch (error) {
      console.log('⚠️ Could not clean up test image:', error.message);
    }

  } catch (error) {
    console.error('❌ Cloudinary test failed:', error.message);
    console.error('Error details:', error);
  }

  console.log('\n📋 Cloudinary URL Format Examples:');
  console.log('Base URL: https://res.cloudinary.com/SkinVox');
  console.log('Image URL: https://res.cloudinary.com/SkinVox/image/upload/v1234567890/admins/admin/blogs/admin-images-1234567890-123456789.jpg');
  console.log('Transformed URL: https://res.cloudinary.com/SkinVox/image/upload/w_400,h_300,c_limit,q_auto/admins/admin/blogs/admin-images-1234567890-123456789.jpg');
}

checkCloudinaryConfig();
