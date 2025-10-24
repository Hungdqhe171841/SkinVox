// Test Google Analytics integration
export const testGoogleAnalytics = () => {
  console.log('🧪 Testing Google Analytics...');
  
  // Check if gtag is loaded
  if (typeof window !== 'undefined' && window.gtag) {
    console.log('✅ Google Analytics (gtag) is loaded');
    
    // Test manual event
    window.gtag('event', 'test_event', {
      event_category: 'Test',
      event_label: 'Manual Test',
      value: 1
    });
    
    console.log('✅ Test event sent to Google Analytics');
    
    // Check environment variables
    const gaId = import.meta.env.VITE_GA_MEASUREMENT_ID;
    console.log('📊 GA Measurement ID:', gaId);
    
    // Check API URL
    const apiUrl = import.meta.env.VITE_API_URL;
    console.log('🔗 API URL:', apiUrl);
    
    // Check Cloudinary config
    const cloudinaryName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const cloudinaryKey = import.meta.env.VITE_CLOUDINARY_API_KEY;
    console.log('☁️ Cloudinary Name:', cloudinaryName);
    console.log('☁️ Cloudinary Key:', cloudinaryKey ? 'Present' : 'Missing');
    
    return true;
  } else {
    console.error('❌ Google Analytics (gtag) is not loaded');
    return false;
  }
};

// Test all environment variables
export const testEnvironmentVariables = () => {
  console.log('🔧 Testing Environment Variables...');
  
  const envVars = {
    'VITE_API_URL': import.meta.env.VITE_API_URL,
    'VITE_GA_MEASUREMENT_ID': import.meta.env.VITE_GA_MEASUREMENT_ID,
    'VITE_CLOUDINARY_CLOUD_NAME': import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
    'VITE_CLOUDINARY_API_KEY': import.meta.env.VITE_CLOUDINARY_API_KEY
  };
  
  Object.entries(envVars).forEach(([key, value]) => {
    if (value) {
      console.log(`✅ ${key}: ${value}`);
    } else {
      console.log(`❌ ${key}: Missing`);
    }
  });
  
  return envVars;
};

// Test Google Analytics events
export const testAnalyticsEvents = () => {
  console.log('📊 Testing Analytics Events...');
  
  if (typeof window !== 'undefined' && window.gtag) {
    // Test page view
    window.gtag('event', 'page_view', {
      page_title: 'Test Page',
      page_location: window.location.href
    });
    
    // Test custom event
    window.gtag('event', 'test_interaction', {
      event_category: 'Test',
      event_label: 'Test Interaction',
      value: 1
    });
    
    // Test ecommerce event
    window.gtag('event', 'view_item', {
      currency: 'VND',
      value: 100000,
      items: [{
        item_id: 'test_item',
        item_name: 'Test Product',
        item_category: 'Test Category',
        quantity: 1,
        price: 100000
      }]
    });
    
    console.log('✅ All test events sent to Google Analytics');
    return true;
  } else {
    console.error('❌ Google Analytics is not available');
    return false;
  }
};

export default {
  testGoogleAnalytics,
  testEnvironmentVariables,
  testAnalyticsEvents
};
