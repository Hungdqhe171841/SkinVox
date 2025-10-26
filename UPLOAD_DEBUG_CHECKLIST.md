# Upload Debug Checklist

## 📋 Current Status

- ✅ Server is running on Render.com
- ❌ Upload endpoint returns 500 error
- ⏳ Waiting for detailed Cloudinary debug logs

## 🔍 Next Steps

### 1. Check Render.com Logs

**How to access logs:**
1. Go to https://dashboard.render.com
2. Find your backend service (skinvox-backend)
3. Click on "Logs" tab
4. Look for errors when you try to upload an image

**What to look for:**
- `📝 Cloudinary Debug - Starting upload for file:`
- `📝 Cloudinary Debug - File buffer: exists` or `missing`
- `📝 Cloudinary Debug - Cloudinary config:`
- `❌ Cloudinary Debug - Upload error:` (if any)

### 2. Common Issues to Check

#### A. Cloudinary Configuration Missing
If logs show:
```
Cloudinary config: {cloud_name: "missing", api_key: "missing", api_secret: "missing"}
```

**Fix:** Go to Render.com → Environment → Add/Edit:
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

#### B. File Buffer Missing
If logs show:
```
File buffer: missing
❌ Cloudinary upload error: File buffer is missing
```

**Fix:** Check that multer is using `memoryStorage` for Cloudinary (already configured).

#### C. Cloudinary API Error
If logs show:
```
❌ Cloudinary Debug - Upload error: [specific error]
```

**Possible causes:**
- Invalid Cloudinary credentials
- File too large (>5MB)
- Network/connectivity issues
- Rate limiting

### 3. Test Locally

To test locally, run:
```bash
cd server
node test-upload.js
```

This will test the upload endpoint with a sample image.

### 4. Check Frontend Request

In browser console, check the actual request being sent:
```javascript
// The request should include:
- URL: https://skinvox-backend.onrender.com/api/admin/upload
- Method: POST
- Body: FormData with file
```

## 📝 Expected Debug Output

When upload works correctly, you should see:
```
📝 Admin Debug - Upload API called
📝 Admin Debug - Storage type: cloudinary
📝 Admin Debug - Processing 1 files
📝 Cloudinary Debug - Starting upload for file: example.jpg
📝 Cloudinary Debug - File buffer: exists
📝 Cloudinary Debug - File size: 123456
📝 Cloudinary Debug - Cloudinary config: {cloud_name: "set", api_key: "set", api_secret: "set"}
📝 Cloudinary Debug - Generated file name: admin-images-1234567890-123456789
✅ Cloudinary Debug - Upload successful: https://res.cloudinary.com/...
✅ Admin Debug - All files uploaded successfully: [...]
```

## 🚨 If Upload Still Fails

After checking logs:
1. Share the full error message from Render.com logs
2. Check Cloudinary dashboard for any errors
3. Verify environment variables are set correctly
4. Test with a smaller image file (< 1MB)
