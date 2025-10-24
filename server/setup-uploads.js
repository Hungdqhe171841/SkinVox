#!/usr/bin/env node

/**
 * Setup Upload Directory Script
 * This script creates the necessary upload directories for the SkinVox application
 */

const fs = require('fs');
const path = require('path');

// Get upload path from environment variable or use default
const uploadBasePath = process.env.UPLOAD_PATH || path.join(__dirname, 'public/uploads');

// Create directory structure
const directories = [
  'admins/admin/blogs',
  'admins/admin/products',
  'admins/admin/users',
  'temp',
  'backup'
];

console.log('🚀 Setting up upload directories...');
console.log('📁 Base path:', uploadBasePath);

// Create base directory if it doesn't exist
if (!fs.existsSync(uploadBasePath)) {
  fs.mkdirSync(uploadBasePath, { recursive: true });
  console.log('✅ Created base upload directory');
}

// Create subdirectories
directories.forEach(dir => {
  const fullPath = path.join(uploadBasePath, dir);
  
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
    console.log(`✅ Created directory: ${dir}`);
  } else {
    console.log(`📁 Directory already exists: ${dir}`);
  }
});

// Create .gitkeep files to ensure directories are tracked in git
directories.forEach(dir => {
  const gitkeepPath = path.join(uploadBasePath, dir, '.gitkeep');
  if (!fs.existsSync(gitkeepPath)) {
    fs.writeFileSync(gitkeepPath, '');
    console.log(`📝 Created .gitkeep: ${dir}`);
  }
});

// Set permissions (Unix/Linux only)
if (process.platform !== 'win32') {
  try {
    // Set directory permissions
    fs.chmodSync(uploadBasePath, '755');
    directories.forEach(dir => {
      const fullPath = path.join(uploadBasePath, dir);
      fs.chmodSync(fullPath, '755');
    });
    console.log('✅ Set directory permissions');
  } catch (error) {
    console.log('⚠️  Could not set permissions:', error.message);
  }
}

// Create README file
const readmePath = path.join(uploadBasePath, 'README.md');
const readmeContent = `# Upload Directory

This directory contains uploaded files for the SkinVox application.

## Structure

- \`admins/\` - Admin-specific uploads
  - \`admin/blogs/\` - Blog images
  - \`admin/products/\` - Product images
  - \`admin/users/\` - User avatars
- \`temp/\` - Temporary files
- \`backup/\` - Backup files

## Security

- Only image files are allowed for uploads
- File size limit: 5MB
- Files are automatically validated and sanitized

## Maintenance

- Regular cleanup of temporary files
- Backup important uploads
- Monitor disk usage

Generated on: ${new Date().toISOString()}
`;

if (!fs.existsSync(readmePath)) {
  fs.writeFileSync(readmePath, readmeContent);
  console.log('📝 Created README.md');
}

console.log('🎉 Upload directory setup complete!');
console.log('');
console.log('📋 Next steps:');
console.log('1. Set UPLOAD_PATH environment variable if needed');
console.log('2. Configure web server to serve /uploads/ path');
console.log('3. Set proper permissions for web server');
console.log('4. Test file uploads');
