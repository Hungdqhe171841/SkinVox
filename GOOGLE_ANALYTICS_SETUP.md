# Google Analytics Setup for SkinVox

## 📊 Overview
Google Analytics has been successfully integrated into the SkinVox website to track user interactions, page views, and various events.

## 🔧 Configuration

### Measurement ID
- **Measurement ID**: `G-C4NFL3C9TF`
- **Property**: SkinVox
- **Website**: https://skin-vox.vercel.app/

### Files Modified

#### 1. **HTML Integration** (`client/index.html`)
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-C4NFL3C9TF"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-C4NFL3C9TF');
</script>
```

#### 2. **Analytics Utility** (`client/src/utils/analytics.js`)
- Comprehensive tracking functions for all user interactions
- Event tracking for blogs, products, AR features, admin actions
- E-commerce tracking capabilities
- Error and performance tracking

#### 3. **React Hooks** (`client/src/hooks/useAnalytics.js`)
- Custom hooks for easy integration
- Automatic page view tracking
- Specialized hooks for different interaction types

#### 4. **Component Integration**
- **App.jsx**: Initializes Google Analytics
- **BlogDetail.jsx**: Tracks blog views, likes, shares
- **BeautyBar.jsx**: Tracks product views, AR interactions
- **AdminDashboard.jsx**: Tracks admin actions, blog management

## 📈 Events Tracked

### Page Views
- Automatic tracking on route changes
- Custom page view tracking for specific pages

### Blog Interactions
- `blog_view`: When user views a blog post
- `blog_like`: When user likes a blog post
- `blog_share`: When user shares a blog post
- `blog_comment`: When user comments on a blog post

### Product Interactions
- `product_view`: When user views a product
- `product_like`: When user likes a product
- `ar_view`: When user opens AR feature
- `ar_interaction`: When user interacts with AR

### Admin Actions
- `admin_login`: When admin logs in
- `admin_logout`: When admin logs out
- `blog_create`: When admin creates a blog
- `blog_update`: When admin updates a blog
- `blog_delete`: When admin deletes a blog
- `image_upload`: When admin uploads images

### User Interactions
- `click`: General click tracking
- `form_submit`: Form submission tracking
- `search`: Search query tracking
- `navigate`: Navigation tracking

### Error Tracking
- `error`: Error event tracking with context

## 🚀 Usage

### Basic Usage
```javascript
import { useAnalytics } from '../hooks/useAnalytics';

function MyComponent() {
  const { trackEvent } = useAnalytics();
  
  const handleClick = () => {
    trackEvent('click', 'Button', 'Header CTA');
  };
}
```

### Blog Tracking
```javascript
import { useTrackBlogInteraction } from '../hooks/useAnalytics';

function BlogComponent() {
  const { trackBlogView, trackBlogLike } = useTrackBlogInteraction();
  
  useEffect(() => {
    trackBlogView(blogTitle, blogId);
  }, []);
  
  const handleLike = () => {
    trackBlogLike(blogTitle, blogId);
  };
}
```

### Product Tracking
```javascript
import { useTrackProductInteraction } from '../hooks/useAnalytics';

function ProductComponent() {
  const { trackProductView, trackARView } = useTrackProductInteraction();
  
  const handleProductClick = () => {
    trackProductView(productName, productId, category);
  };
  
  const handleARClick = () => {
    trackARView(productName, productType);
  };
}
```

## 🔍 Testing

### Google Analytics Real-Time Reports
1. Go to Google Analytics dashboard
2. Navigate to Reports > Real-time
3. Visit your website and perform actions
4. Check if events are being tracked in real-time

### Browser Console Testing
```javascript
// Test if gtag is loaded
console.log(typeof window.gtag); // Should return "function"

// Test manual event
gtag('event', 'test_event', {
  event_category: 'Test',
  event_label: 'Manual Test'
});

// Test environment variables
console.log('GA ID:', import.meta.env.VITE_GA_MEASUREMENT_ID);
console.log('API URL:', import.meta.env.VITE_API_URL);
```

### Testing with Test Script
```javascript
// Import test functions
import { testGoogleAnalytics, testEnvironmentVariables, testAnalyticsEvents } from './src/utils/testAnalytics';

// Test Google Analytics
testGoogleAnalytics();

// Test environment variables
testEnvironmentVariables();

// Test analytics events
testAnalyticsEvents();
```

## 📊 Expected Data

### Page Views
- Home page visits
- Blog page visits
- Blog detail page visits
- BeautyBar page visits
- Admin dashboard visits

### Events
- Blog interactions (views, likes, shares)
- Product interactions (views, AR usage)
- Admin actions (login, blog management)
- User interactions (clicks, form submissions)

### User Behavior
- Navigation patterns
- Most popular content
- User engagement metrics
- Error tracking

## 🛠️ Maintenance

### Adding New Events
1. Add new tracking function to `analytics.js`
2. Create specialized hook if needed
3. Integrate into relevant components
4. Test in Google Analytics

### Environment Variables
File `.env` đã được cập nhật với các biến môi trường sau:

```env
VITE_API_URL=https://skinvox-backend.onrender.com
VITE_CLOUDINARY_CLOUD_NAME=SkinVox
VITE_CLOUDINARY_API_KEY=277762621615142
VITE_GA_MEASUREMENT_ID=G-C4NFL3C9TF
```

- `VITE_GA_MEASUREMENT_ID`: Google Analytics Measurement ID
- `VITE_API_URL`: Backend API URL
- `VITE_CLOUDINARY_CLOUD_NAME`: Cloudinary cloud name
- `VITE_CLOUDINARY_API_KEY`: Cloudinary API key

Default fallback to `G-C4NFL3C9TF` if `VITE_GA_MEASUREMENT_ID` is not set

### Debugging
- Check browser console for gtag errors
- Verify Measurement ID is correct
- Test events in Google Analytics real-time reports

## 📱 Mobile Support
- All tracking works on mobile devices
- Touch events are tracked as click events
- Responsive design interactions are tracked

## 🔒 Privacy Considerations
- No personally identifiable information is tracked
- Users can opt-out through browser settings
- GDPR compliance considerations for EU users

## 📈 Analytics Dashboard
Access your Google Analytics dashboard at:
https://analytics.google.com/analytics/web/#/a359721010p494682869/

## 🎯 Goals and Conversions
Set up goals in Google Analytics to track:
- Blog engagement
- Product interactions
- AR feature usage
- Admin actions
- User registrations

## 📞 Support
For issues with Google Analytics integration:
1. Check browser console for errors
2. Verify Measurement ID is correct
3. Test in Google Analytics real-time reports
4. Check network requests for gtag calls
