const fs = require('fs');
const path = require('path');

function checkStaticFiles() {
  console.log('🔍 Checking static file serving...\n');

  // Check if uploads directory exists
  const uploadsDir = path.join(__dirname, '../public/uploads');
  console.log('📁 Uploads directory:', uploadsDir);
  console.log('📁 Directory exists:', fs.existsSync(uploadsDir));

  if (fs.existsSync(uploadsDir)) {
    // List all files in uploads directory
    console.log('\n📋 Files in uploads directory:');
    listFiles(uploadsDir, '');
  } else {
    console.log('❌ Uploads directory does not exist!');
    console.log('Creating uploads directory...');
    
    try {
      fs.mkdirSync(uploadsDir, { recursive: true });
      console.log('✅ Uploads directory created');
    } catch (error) {
      console.log('❌ Failed to create uploads directory:', error.message);
    }
  }

  // Check specific admin uploads directory
  const adminUploadsDir = path.join(__dirname, '../public/uploads/admins/admin/blogs');
  console.log('\n📁 Admin uploads directory:', adminUploadsDir);
  console.log('📁 Directory exists:', fs.existsSync(adminUploadsDir));

  if (fs.existsSync(adminUploadsDir)) {
    console.log('\n📋 Files in admin uploads directory:');
    listFiles(adminUploadsDir, '');
  }
}

function listFiles(dir, prefix) {
  try {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stats = fs.statSync(filePath);
      
      if (stats.isDirectory()) {
        console.log(`${prefix}📁 ${file}/`);
        listFiles(filePath, prefix + '  ');
      } else {
        console.log(`${prefix}📄 ${file} (${stats.size} bytes)`);
      }
    });
  } catch (error) {
    console.log(`${prefix}❌ Error reading directory: ${error.message}`);
  }
}

checkStaticFiles();
