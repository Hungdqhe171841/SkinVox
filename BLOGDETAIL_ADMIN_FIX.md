# BlogDetail Admin Fix

## ✅ Changes Made

### Updated `client/src/pages/AdminDashboard.jsx`

**Before:**
```javascript
onClick={() => window.open(`/blog/${blog._id}`, '_blank')}
```

**After:**
```javascript
onClick={() => {
  console.log('Opening blog:', blog._id, blog.title)
  const url = `${window.location.origin}/blog/${blog._id}`
  console.log('Blog URL:', url)
  window.open(url, '_blank')
}}
```

## 🎯 Why This Fix Works

**Issue:**
- When clicking the Eye icon in Admin Dashboard, it uses a relative URL `/blog/${blog._id}`
- On Vercel, this might not resolve correctly if the page is loaded from a different route

**Solution:**
- Use `window.location.origin` to get the full domain
- Construct complete URL: `https://your-domain.com/blog/blog-id`
- Add console logs for debugging

## 🧪 Testing

1. Go to Admin Dashboard
2. Navigate to "Blog Management" tab
3. Click the Eye (👁️) icon next to any blog
4. Should open blog detail in a new tab

## 🔍 Debugging

If blog detail still doesn't load:

1. Check browser console for:
   - `Opening blog: [id] [title]`
   - `Blog URL: [full-url]`

2. Check Network tab:
   - API call to `/api/blog/blogs/[id]`
   - Should return blog data

3. Verify blog ID exists in database

## 📝 Additional Notes

- The blog detail page (`BlogDetail.jsx`) has proper error handling
- If blog not found, shows "Không tìm thấy bài viết" message
- The route `/blog/:id` is properly configured in `App.jsx`
