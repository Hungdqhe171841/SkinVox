const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

async function testUpload() {
  try {
    console.log('🧪 Testing upload endpoint...');
    
    // Create a test image file (1x1 pixel red PNG)
    const testImagePath = path.join(__dirname, 'test-image.png');
    const pngBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
    fs.writeFileSync(testImagePath, Buffer.from(pngBase64, 'base64'));
    
    console.log('✅ Test image created:', testImagePath);
    
    const form = new FormData();
    form.append('images', fs.createReadStream(testImagePath), 'test.png');
    
    console.log('📤 Sending upload request...');
    const response = await axios.post('http://localhost:3000/api/admin/upload', form, {
      headers: form.getHeaders(),
    });
    
    console.log('✅ Upload successful!');
    console.log('Response:', response.data);
    
    // Clean up
    fs.unlinkSync(testImagePath);
  } catch (error) {
    console.error('❌ Upload failed:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
  }
}

testUpload();
