# Google Analytics Troubleshooting Guide

## 🔍 Vấn đề hiện tại
Google Analytics hiển thị cảnh báo "Data collection isn't active for your website" và không thu thập được dữ liệu.

### **Lỗi đã sửa:**
1. **`import.meta` error**: Không thể sử dụng `import.meta` trong HTML script tag
2. **`window.gtag` not available**: Google Analytics script chưa load đúng
3. **Script loading timing**: Cần đợi script load trước khi sử dụng

## 🛠️ Các bước troubleshooting

### 1. Kiểm tra Environment Variables
```bash
# Kiểm tra file .env
cat client/.env

# Kết quả mong đợi:
VITE_API_URL=https://skinvox-backend.onrender.com
VITE_CLOUDINARY_CLOUD_NAME=SkinVox
VITE_CLOUDINARY_API_KEY=277762621615142
VITE_GA_MEASUREMENT_ID=G-C4NFL3C9TF
```

### 2. Kiểm tra Vercel Environment Variables
- Vào Vercel Dashboard > Project Settings > Environment Variables
- Đảm bảo có `VITE_GA_MEASUREMENT_ID=G-C4NFL3C9TF`
- Redeploy project sau khi thêm environment variables

### 3. Kiểm tra Google Analytics Configuration
- Measurement ID: `G-C4NFL3C9TF`
- Website URL: `https://skin-vox.vercel.app/`
- Enhanced measurement: Enabled

### 4. Test Google Analytics locally
```bash
# Mở file test-ga-script.html trong browser
open client/test-ga-script.html

# Kiểm tra console logs:
# - ✅ Google Analytics initialized with ID: G-C4NFL3C9TF
# - ✅ gtag available: function
# - ✅ Test event sent
```

### 5. Test Script Loading
```bash
# Mở file test-ga-script.html trong browser
open client/test-ga-script.html

# Kiểm tra:
# - Script tag có tồn tại không
# - gtag function có available không
# - dataLayer có được tạo không
```

### 5. Test trên production
1. Mở website: https://skin-vox.vercel.app/
2. Mở Developer Tools (F12)
3. Kiểm tra Console logs:
   ```
   🔍 Google Analytics initialized with ID: G-C4NFL3C9TF
   🔍 App Debug - Initializing Google Analytics...
   ✅ Analytics Debug - Google Analytics configured successfully
   ```

### 6. Test Google Analytics Events
```javascript
// Trong browser console:
gtag('event', 'test_event', {
  event_category: 'Test',
  event_label: 'Manual Test',
  value: 1
});

// Kiểm tra DataLayer:
console.log(window.dataLayer);
```

### 7. Kiểm tra Google Analytics Real-time Reports
1. Vào Google Analytics Dashboard
2. Reports > Real-time > Overview
3. Thực hiện actions trên website
4. Kiểm tra xem có data không

## 🔧 Các vấn đề thường gặp

### Vấn đề 1: Environment Variables không được load
**Triệu chứng**: `import.meta.env.VITE_GA_MEASUREMENT_ID` trả về `undefined`

**Giải pháp**:
1. Kiểm tra file `.env` có đúng format không
2. Redeploy project trên Vercel
3. Kiểm tra Vercel Environment Variables

### Vấn đề 2: Google Analytics script không load
**Triệu chứng**: `typeof window.gtag` trả về `undefined`

**Giải pháp**:
1. Kiểm tra network requests trong Developer Tools
2. Kiểm tra có bị block bởi ad blocker không
3. Kiểm tra CORS issues

### Vấn đề 3: Events không được track
**Triệu chứng**: Không thấy events trong Google Analytics

**Giải pháp**:
1. Kiểm tra console logs
2. Kiểm tra DataLayer
3. Test với manual events

### Vấn đề 4: Data collection không active
**Triệu chứng**: Google Analytics hiển thị warning

**Giải pháp**:
1. Đảm bảo script được load đúng
2. Kiểm tra Measurement ID
3. Đợi 24-48 giờ để data xuất hiện

## 🧪 Test Scripts

### Test Environment Variables
```javascript
import { testEnvironmentVariables } from './src/utils/testGA.js';
testEnvironmentVariables();
```

### Test Google Analytics
```javascript
import { testGoogleAnalytics } from './src/utils/testGA.js';
testGoogleAnalytics();
```

### Test Events
```javascript
import { testAnalyticsEvents } from './src/utils/testGA.js';
testAnalyticsEvents();
```

## 📊 Expected Results

### Console Logs
```
🔍 Google Analytics initialized with ID: G-C4NFL3C9TF
🔍 App Debug - Initializing Google Analytics...
✅ Analytics Debug - Google Analytics configured successfully
✅ App Debug - Google Analytics is working
```

### Google Analytics Real-time Reports
- Page views
- Events
- User interactions

### DataLayer
```javascript
window.dataLayer = [
  ['js', new Date()],
  ['config', 'G-C4NFL3C9TF'],
  ['event', 'page_view', {...}],
  ['event', 'test_event', {...}]
];
```

## 🚀 Next Steps

1. **Redeploy trên Vercel** với các thay đổi mới
2. **Test trên production** với debug logs
3. **Kiểm tra Google Analytics Real-time Reports**
4. **Đợi 24-48 giờ** để data xuất hiện đầy đủ

## 📞 Support

Nếu vẫn gặp vấn đề:
1. Kiểm tra console logs
2. Test với file `test-ga.html`
3. Kiểm tra Google Analytics Real-time Reports
4. Verify environment variables trên Vercel
