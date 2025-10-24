# Cloudinary Usage Guide for SkinVox

## 📋 Tổng quan

Cloudinary là một dịch vụ quản lý hình ảnh và video trên cloud, cung cấp:
- **Upload và lưu trữ** hình ảnh
- **Transform và optimize** hình ảnh tự động
- **CDN** để phân phối nhanh
- **Free tier** với 25GB storage và 25GB bandwidth/tháng

## 🔧 Cấu hình Cloudinary

### 1. Environment Variables

Trong file `.env` của server, cần có:

```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=dtkiwwwcm
CLOUDINARY_API_KEY=277762621615142
CLOUDINARY_API_SECRET=82yyRtiNlkZCXOpf382tkqRj4bk
STORAGE_TYPE=cloudinary
```

### 2. Kiểm tra cấu hình

```bash
# Chạy script kiểm tra
cd server
node scripts/check-cloudinary-config.js
```

## 🚀 Cách hoạt động với Cloudinary

### 1. Upload Process

```javascript
// 1. File được upload từ frontend
const formData = new FormData();
formData.append('images', file);

// 2. Server nhận file và upload lên Cloudinary
const result = await cloudStorage.uploadToCloudinary(file, adminId);

// 3. Cloudinary trả về URL
{
  url: "https://res.cloudinary.com/SkinVox/image/upload/v1234567890/admins/admin/blogs/admin-images-1234567890-123456789.jpg",
  public_id: "admins/admin/blogs/admin-images-1234567890-123456789",
  format: "jpg",
  bytes: 123456
}
```

### 2. URL Structure

#### **Base URL:**
```
https://res.cloudinary.com/dtkiwwwcm
```

#### **Image URL Format:**
```
https://res.cloudinary.com/dtkiwwwcm/image/upload/v{version}/{public_id}.{format}
```

#### **Ví dụ thực tế:**
```
https://res.cloudinary.com/dtkiwwwcm/image/upload/v1761292384/skinvox/blogs/blog-1761292388204-659571069.jpg
```

### 3. Transformation URLs

Cloudinary cho phép transform hình ảnh qua URL:

#### **Resize:**
```
https://res.cloudinary.com/SkinVox/image/upload/w_400,h_300,c_limit/admins/admin/blogs/admin-images-1234567890-123456789.jpg
```

#### **Quality Optimization:**
```
https://res.cloudinary.com/SkinVox/image/upload/q_auto/admins/admin/blogs/admin-images-1234567890-123456789.jpg
```

#### **Multiple Transformations:**
```
https://res.cloudinary.com/SkinVox/image/upload/w_1200,h_800,c_limit,q_auto,f_auto/admins/admin/blogs/admin-images-1234567890-123456789.jpg
```

## 📊 So sánh Storage Types

| Storage Type | URL Format | Advantages | Disadvantages |
|-------------|------------|------------|---------------|
| **Local** | `/uploads/admins/admin/blogs/file.jpg` | Free, Simple | Không scale, Không CDN |
| **Cloudinary** | `https://res.cloudinary.com/SkinVox/image/upload/v1234567890/admins/admin/blogs/file.jpg` | CDN, Transform, Optimize | Có giới hạn free tier |
| **AWS S3** | `https://bucket.s3.region.amazonaws.com/admins/admin/blogs/file.jpg` | Unlimited storage | Phức tạp, Có phí |

## 🔄 Chuyển đổi từ Local sang Cloudinary

### 1. Cập nhật Environment Variables

```env
# Thay đổi từ
STORAGE_TYPE=local

# Thành
STORAGE_TYPE=cloudinary
```

### 2. Cập nhật Database

Script để migrate existing images:

```javascript
// server/scripts/migrate-to-cloudinary.js
const mongoose = require('mongoose');
const Blog = require('../models/Blog');
const cloudStorage = require('../services/cloudStorage');

async function migrateToCloudinary() {
  // Find blogs with local image paths
  const blogs = await Blog.find({ 
    images: { $regex: /^\/uploads\// }
  });

  for (const blog of blogs) {
    console.log(`Migrating blog: ${blog.title}`);
    
    for (let i = 0; i < blog.images.length; i++) {
      const localPath = blog.images[i];
      console.log(`  Migrating image: ${localPath}`);
      
      // Upload to Cloudinary and update path
      // Implementation depends on your specific needs
    }
  }
}
```

## 🛠️ Troubleshooting

### 1. Lỗi thường gặp

#### **"Invalid Cloudinary configuration"**
```bash
# Kiểm tra environment variables
echo $CLOUDINARY_CLOUD_NAME
echo $CLOUDINARY_API_KEY
echo $CLOUDINARY_API_SECRET
```

#### **"Upload failed"**
```bash
# Kiểm tra network connection
curl -I https://api.cloudinary.com/v1_1/SkinVox/ping
```

#### **"File too large"**
```bash
# Kiểm tra file size limit (5MB default)
# Có thể tăng limit trong cloudStorage.js
```

### 2. Debug Commands

```bash
# Kiểm tra cấu hình
node server/scripts/check-cloudinary-config.js

# Kiểm tra storage info
curl https://skinvox-backend.onrender.com/api/admin/storage-info

# Test upload
node server/scripts/test-upload.js
```

## 📈 Monitoring và Analytics

### 1. Cloudinary Dashboard

Truy cập: https://cloudinary.com/console

- **Media Library**: Xem tất cả hình ảnh đã upload
- **Analytics**: Theo dõi bandwidth, storage usage
- **Transformations**: Xem các transformation đã sử dụng

### 2. Usage Tracking

```javascript
// Trong server logs
console.log('📊 Cloudinary upload successful:', {
  public_id: result.public_id,
  url: result.secure_url,
  bytes: result.bytes,
  format: result.format
});
```

## 💡 Best Practices

### 1. File Naming

```javascript
// Good: Descriptive và organized
public_id: `admins/${adminId}/blogs/${adminId}-images-${timestamp}-${random}`

// Bad: Random names
public_id: `image123`
```

### 2. Transformations

```javascript
// Sử dụng transformations để optimize
transformation: [
  { width: 1200, height: 800, crop: 'limit' },
  { quality: 'auto' },
  { format: 'auto' }
]
```

### 3. Error Handling

```javascript
try {
  const result = await cloudStorage.uploadToCloudinary(file, adminId);
  return result.url;
} catch (error) {
  console.error('Cloudinary upload failed:', error);
  // Fallback to local storage
  return fallbackUpload(file);
}
```

## 🎯 Kết luận

Cloudinary cung cấp:
- ✅ **CDN** cho tốc độ tải nhanh
- ✅ **Auto optimization** cho kích thước file nhỏ
- ✅ **Transformations** linh hoạt
- ✅ **Free tier** đủ cho development
- ✅ **Reliable** và scalable

**Đường dẫn Cloudinary sẽ có dạng:**
```
https://res.cloudinary.com/SkinVox/image/upload/v{version}/admins/admin/blogs/admin-images-{timestamp}-{random}.jpg
```
