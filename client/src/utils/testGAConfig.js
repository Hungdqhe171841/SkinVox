// Test Google Analytics Configuration
export const testGAConfig = () => {
  console.log('🧪 Testing Google Analytics Configuration...');
  
  // Check if gtag script is loaded
  const gtagScript = document.querySelector('script[src*="googletagmanager.com/gtag/js"]');
  if (gtagScript) {
    console.log('✅ Google Analytics script tag found');
    console.log('📊 Script src:', gtagScript.src);
  } else {
    console.error('❌ Google Analytics script tag not found');
  }
  
  // Check if gtag function is available
  if (typeof window.gtag === 'function') {
    console.log('✅ gtag function is available');
  } else {
    console.error('❌ gtag function is not available');
    console.log('🔍 window.gtag type:', typeof window.gtag);
  }
  
  // Check if dataLayer is available
  if (typeof window.dataLayer === 'object' && Array.isArray(window.dataLayer)) {
    console.log('✅ dataLayer is available');
    console.log('📊 dataLayer length:', window.dataLayer.length);
    console.log('📊 dataLayer contents:', window.dataLayer);
  } else {
    console.error('❌ dataLayer is not available');
    console.log('🔍 window.dataLayer type:', typeof window.dataLayer);
  }
  
  // Check for any Google Analytics related properties
  const gaProperties = Object.keys(window).filter(key => 
    key.includes('gtag') || 
    key.includes('data') || 
    key.includes('google') || 
    key.includes('analytics')
  );
  console.log('🔍 Google Analytics related properties:', gaProperties);
  
  return {
    scriptLoaded: !!gtagScript,
    gtagAvailable: typeof window.gtag === 'function',
    dataLayerAvailable: typeof window.dataLayer === 'object' && Array.isArray(window.dataLayer),
    gaProperties
  };
};

// Test Google Analytics events
export const testGAEvents = () => {
  console.log('🧪 Testing Google Analytics Events...');
  
  if (typeof window.gtag === 'function') {
    // Test page view
    window.gtag('event', 'page_view', {
      page_title: 'Test Page',
      page_location: window.location.href
    });
    
    // Test custom event
    window.gtag('event', 'test_event', {
      event_category: 'Test',
      event_label: 'Test Event',
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

// Test Google Analytics connection
export const testGAConnection = () => {
  console.log('🔗 Testing Google Analytics Connection...');
  
  if (typeof window.gtag === 'function') {
    // Send a test event
    window.gtag('event', 'ga_connection_test', {
      event_category: 'Test',
      event_label: 'Connection Test',
      value: 1
    });
    
    console.log('✅ Google Analytics connection test event sent');
    
    // Check if dataLayer exists
    if (window.dataLayer) {
      console.log('✅ DataLayer exists with', window.dataLayer.length, 'items');
      console.log('📊 DataLayer contents:', window.dataLayer);
    } else {
      console.error('❌ DataLayer does not exist');
    }
    
    return true;
  } else {
    console.error('❌ Google Analytics is not available');
    return false;
  }
};

// Test specific SkinVox events
export const testSkinVoxEvents = () => {
  console.log('🧪 Testing SkinVox Specific Events...');
  
  if (typeof window.gtag === 'function') {
    // Test blog view event
    window.gtag('event', 'blog_view', {
      event_category: 'Blog',
      event_label: 'Test Blog Post',
      blog_id: 'test_blog_001',
      blog_category: 'Beauty Tips'
    });
    
    // Test AR view event
    window.gtag('event', 'ar_view', {
      event_category: 'AR Feature',
      event_label: 'Test AR Product',
      product_type: 'Lipstick',
      product_name: 'Test Lipstick'
    });
    
    // Test admin login event
    window.gtag('event', 'admin_login', {
      event_category: 'Admin',
      event_label: 'Admin Login Test',
      user_role: 'admin'
    });
    
    console.log('✅ All SkinVox events sent to Google Analytics');
    return true;
  } else {
    console.error('❌ Google Analytics is not available');
    return false;
  }
};

// Monitor Google Analytics loading
export const monitorGALoading = () => {
  console.log('🔍 Monitoring Google Analytics loading...');
  
  let attempts = 0;
  const maxAttempts = 50; // 5 seconds max
  
  const checkInterval = setInterval(() => {
    attempts++;
    
    if (typeof window.gtag === 'function') {
      console.log(`✅ Google Analytics loaded after ${attempts * 100}ms`);
      clearInterval(checkInterval);
      
      // Send a test event
      window.gtag('event', 'ga_loaded', {
        event_category: 'Test',
        event_label: 'GA Loaded',
        value: attempts * 100
      });
      
    } else if (attempts >= maxAttempts) {
      console.error(`❌ Google Analytics failed to load after ${maxAttempts * 100}ms`);
      clearInterval(checkInterval);
    } else {
      console.log(`⏳ Waiting for Google Analytics... (${attempts * 100}ms)`);
    }
  }, 100);
};

export default {
  testGAConfig,
  testGAEvents,
  testGAConnection,
  testSkinVoxEvents,
  monitorGALoading
};
