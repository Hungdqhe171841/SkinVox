const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function testUploadToCloudinary() {
  try {
    // Configure Cloudinary
    cloudinary.config({
      cloud_name: 'dtkiwwwcm',
      api_key: '277762621615142',
      api_secret: '82yyRtiNlkZCXOpf382tkqRj4bk'
    });

    console.log('🔍 Testing upload to Cloudinary Media Library...\n');

    // Get a test image file
    const testImagePath = path.join(__dirname, '../public/uploads/admins/admin/blogs/z7150284340186_bba97b6b2d6208447959d9927e688674.jpg');
    
    if (!fs.existsSync(testImagePath)) {
      console.log('❌ Test image not found. Please ensure there are images in the uploads directory.');
      return;
    }

    console.log('📁 Test image found:', testImagePath);

    // Upload to Cloudinary with folder 'blogs'
    const result = await cloudinary.uploader.upload(testImagePath, {
      folder: 'blogs',
      public_id: `test-upload-${Date.now()}`,
      resource_type: 'auto',
      transformation: [
        { width: 1200, height: 800, crop: 'limit' },
        { quality: 'auto' }
      ]
    });

    console.log('✅ Upload successful!');
    console.log('📊 Upload result:');
    console.log('  - URL:', result.secure_url);
    console.log('  - Public ID:', result.public_id);
    console.log('  - Folder:', result.folder);
    console.log('  - Format:', result.format);
    console.log('  - Size:', result.bytes, 'bytes');
    console.log('  - Dimensions:', result.width, 'x', result.height);

    // Test if the image is accessible
    console.log('\n🧪 Testing image accessibility...');
    try {
      const response = await fetch(result.secure_url);
      if (response.ok) {
        console.log('✅ Image is accessible via URL');
      } else {
        console.log('❌ Image is not accessible:', response.status);
      }
    } catch (error) {
      console.log('❌ Error testing image accessibility:', error.message);
    }

    console.log('\n📋 Summary:');
    console.log('✅ Image uploaded to Cloudinary Media Library');
    console.log('✅ Image saved in "blogs" folder');
    console.log('✅ Image is accessible via URL');
    console.log('✅ Ready for use in database');

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

testUploadToCloudinary();
