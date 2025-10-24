const fs = require('fs');
const path = require('path');

async function testSystem() {
  console.log('🧪 Testing SkinVox System...');
  
  // Test 1: Check if server is running
  console.log('\n1. Testing server connection...');
  try {
    const response = await fetch('http://localhost:5000/api/health');
    const data = await response.json();
    console.log('✅ Server is running:', data);
  } catch (error) {
    console.log('❌ Server not running:', error.message);
    return;
  }
  
  // Test 2: Check admin storage info
  console.log('\n2. Testing admin storage info...');
  try {
    const response = await fetch('http://localhost:5000/api/admin/storage-info');
    const data = await response.json();
    console.log('✅ Storage info:', data);
  } catch (error) {
    console.log('❌ Storage info error:', error.message);
  }
  
  // Test 3: Check blog API
  console.log('\n3. Testing blog API...');
  try {
    const response = await fetch('http://localhost:5000/api/blog/blogs');
    const data = await response.json();
    console.log('✅ Blog API working, found', data.blogs?.length || 0, 'blogs');
    if (data.blogs && data.blogs.length > 0) {
      const firstBlog = data.blogs[0];
      console.log('   First blog:', {
        title: firstBlog.title,
        images: firstBlog.images,
        featuredImage: firstBlog.featuredImage
      });
    }
  } catch (error) {
    console.log('❌ Blog API error:', error.message);
  }
  
  // Test 4: Check categories API
  console.log('\n4. Testing categories API...');
  try {
    const response = await fetch('http://localhost:5000/api/blog/blog-categories');
    const data = await response.json();
    console.log('✅ Categories API working, found', data.length || 0, 'categories');
  } catch (error) {
    console.log('❌ Categories API error:', error.message);
  }
  
  // Test 5: Check if test images exist
  console.log('\n5. Testing test images...');
  const imagePaths = [
    'public/uploads/admins/admin/blogs/Tips1.jpg',
    'public/uploads/admins/admin/blogs/Tips2.jpg'
  ];
  
  imagePaths.forEach(imagePath => {
    const fullPath = path.join(__dirname, imagePath);
    if (fs.existsSync(fullPath)) {
      console.log('✅ Image exists:', imagePath);
    } else {
      console.log('❌ Image missing:', imagePath);
    }
  });
  
  console.log('\n🎯 System test completed!');
}

testSystem();
