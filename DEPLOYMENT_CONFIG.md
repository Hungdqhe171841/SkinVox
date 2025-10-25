# SkinVox Deployment Configuration

## 🌐 Domain Configuration

### Frontend (Vercel)
- **Domain**: `ddaa7.vercel.app`
- **Environment Variables**:
  ```env
  VITE_API_URL=https://skinvox-backend.onrender.com
  VITE_CLOUDINARY_CLOUD_NAME=SkinVox
  VITE_CLOUDINARY_API_KEY=277762621615142
  ```

### Backend (Render)
- **Domain**: `skinvox-backend.onrender.com`
- **Environment Variables**:
  ```env
  CLOUDINARY_CLOUD_NAME=SkinVox
  CLOUDINARY_API_KEY=277762621615142
  CLOUDINARY_API_SECRET=82yyRtiN1kZCX0pf382tkqRj4bk
  MONGODB_URI=mongodb+srv://hinh:hinh123@cluster0.2uakk5o.mongodb.net/SkinVox?retryWrites=true&w=majority
  JWT_SECRET=skinvox-super-secret-jwt-key-2024
  NODE_ENV=production
  PORT=10000
  STORAGE_TYPE=cloudinary
  ```

## 🔧 CORS Configuration

Backend đã được cấu hình để chấp nhận requests từ:
- `https://ddaa7.vercel.app`
- `https://skinvox-client.vercel.app`
- `https://skinvox.vercel.app`
- `https://skin-vox.vercel.app`
- `https://*.vercel.app`
- `http://localhost:3000`
- `http://localhost:3002`
- `http://localhost:5173`

## 🧪 Testing

### Test Backend Connection
```javascript
// Run in browser console
fetch('https://skinvox-backend.onrender.com/api/health')
  .then(response => response.json())
  .then(data => console.log('Backend healthy:', data))
  .catch(error => console.error('Backend error:', error));
```

### Test Blog API
```javascript
// Run in browser console
fetch('https://skinvox-backend.onrender.com/api/blog/blogs')
  .then(response => response.json())
  .then(data => console.log('Blogs:', data.blogs?.length || 0))
  .catch(error => console.error('Blog API error:', error));
```

### Test Storage Configuration
```javascript
// Run in browser console
fetch('https://skinvox-backend.onrender.com/api/admin/storage-info')
  .then(response => response.json())
  .then(data => console.log('Storage config:', data))
  .catch(error => console.error('Storage error:', error));
```

## 🚀 Deployment Steps

1. **Backend (Render)**:
   - Environment variables đã được cấu hình đúng
   - CORS đã được cập nhật để bao gồm domain `ddaa7.vercel.app`

2. **Frontend (Vercel)**:
   - Cần kiểm tra environment variables trong Vercel dashboard
   - Đảm bảo `VITE_API_URL` trỏ đến `https://skinvox-backend.onrender.com`

## 🔍 Troubleshooting

### Common Issues:
1. **CORS Error**: Kiểm tra domain frontend có trong CORS origins
2. **API Connection Error**: Kiểm tra `VITE_API_URL` trong Vercel
3. **Image Upload Error**: Kiểm tra Cloudinary configuration
4. **Database Error**: Kiểm tra MongoDB URI

### Debug Commands:
```bash
# Test backend locally
curl https://skinvox-backend.onrender.com/api/health

# Test blog API
curl https://skinvox-backend.onrender.com/api/blog/blogs

# Test storage info
curl https://skinvox-backend.onrender.com/api/admin/storage-info
```
