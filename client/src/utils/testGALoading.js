// Test Google Analytics loading and availability
export const testGALoading = () => {
  console.log('🧪 Testing Google Analytics Loading...');
  
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

// Test Google Analytics after a delay
export const testGAAfterDelay = (delay = 2000) => {
  console.log(`⏳ Testing Google Analytics after ${delay}ms delay...`);
  
  setTimeout(() => {
    testGALoading();
    
    // Try to send a test event
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'delayed_test', {
        event_category: 'Test',
        event_label: 'Delayed Test',
        value: 1
      });
      console.log('✅ Delayed test event sent');
    } else {
      console.error('❌ Cannot send delayed test event - gtag not available');
    }
  }, delay);
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
  testGALoading,
  testGAAfterDelay,
  monitorGALoading
};
