const cloudStorage = require('../services/cloudStorage');
const fs = require('fs');
const path = require('path');

async function testCloudinaryUpload() {
  console.log('🧪 Testing Cloudinary Upload...\n');

  // Check if Cloudinary is configured
  console.log('📋 Storage Configuration:');
  console.log('Storage Type:', cloudStorage.storageType);
  console.log('Is Configured:', cloudStorage.isConfigured());
  console.log('Storage Info:', cloudStorage.getStorageInfo());

  if (!cloudStorage.isConfigured()) {
    console.log('❌ Cloudinary is not properly configured!');
    console.log('Please check your environment variables:');
    console.log('- CLOUDINARY_CLOUD_NAME');
    console.log('- CLOUDINARY_API_KEY');
    console.log('- CLOUDINARY_API_SECRET');
    return;
  }

  try {
    // Create a test file buffer (1x1 pixel PNG)
    const testImageBuffer = Buffer.from([
      0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D,
      0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
      0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53, 0xDE, 0x00, 0x00, 0x00,
      0x0C, 0x49, 0x44, 0x41, 0x54, 0x08, 0xD7, 0x63, 0xF8, 0x00, 0x00, 0x00,
      0x00, 0x01, 0x00, 0x01, 0x00, 0x00, 0x00, 0x37, 0x6E, 0xF9, 0x24, 0x00,
      0x00, 0x00, 0x00, 0x49, 0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82
    ]);

    // Create a mock file object
    const mockFile = {
      buffer: testImageBuffer,
      originalname: 'test-image.png',
      fieldname: 'images',
      mimetype: 'image/png',
      size: testImageBuffer.length
    };

    console.log('\n🧪 Testing upload to Cloudinary...');
    console.log('File details:', {
      originalname: mockFile.originalname,
      mimetype: mockFile.mimetype,
      size: mockFile.size
    });

    // Test upload
    const result = await cloudStorage.uploadToCloudinary(mockFile, 'admin');
    
    console.log('✅ Upload successful!');
    console.log('📊 Upload result:', {
      url: result.url,
      public_id: result.public_id,
      format: result.format,
      bytes: result.bytes
    });

    // Test URL accessibility
    console.log('\n🔗 Testing URL accessibility...');
    try {
      const response = await fetch(result.url);
      if (response.ok) {
        console.log('✅ Image URL is accessible');
        console.log('📊 Response status:', response.status);
        console.log('📊 Content-Type:', response.headers.get('content-type'));
      } else {
        console.log('❌ Image URL is not accessible:', response.status);
      }
    } catch (error) {
      console.log('❌ Error testing URL accessibility:', error.message);
    }

    // Show URL structure
    console.log('\n📋 URL Structure Analysis:');
    console.log('Full URL:', result.url);
    console.log('Base URL:', result.url.split('/image/upload/')[0]);
    console.log('Version:', result.url.match(/\/v(\d+)\//)?.[1] || 'No version');
    console.log('Public ID:', result.public_id);
    console.log('Format:', result.format);

    // Show transformation examples
    console.log('\n🔄 Transformation Examples:');
    const baseUrl = result.url.split('/image/upload/')[0];
    const publicId = result.public_id;
    const format = result.format;
    
    console.log('Original:', result.url);
    console.log('Resized (400x300):', `${baseUrl}/image/upload/w_400,h_300,c_limit/${publicId}.${format}`);
    console.log('Auto Quality:', `${baseUrl}/image/upload/q_auto/${publicId}.${format}`);
    console.log('Auto Format:', `${baseUrl}/image/upload/f_auto/${publicId}.${format}`);
    console.log('Multiple Transformations:', `${baseUrl}/image/upload/w_800,h_600,c_limit,q_auto,f_auto/${publicId}.${format}`);

    // Clean up test image
    console.log('\n🧹 Cleaning up test image...');
    try {
      const cloudinary = require('cloudinary').v2;
      await cloudinary.uploader.destroy(result.public_id);
      console.log('✅ Test image cleaned up successfully');
    } catch (error) {
      console.log('⚠️ Could not clean up test image:', error.message);
    }

  } catch (error) {
    console.error('❌ Upload test failed:', error.message);
    console.error('Error details:', error);
  }
}

testCloudinaryUpload();
