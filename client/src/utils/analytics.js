// Google Analytics utility functions
export const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || 'G-C4NFL3C9TF';

// Initialize Google Analytics
export const initGA = () => {
  console.log('🔍 Analytics Debug - initGA called');
  console.log('🔍 Analytics Debug - GA_MEASUREMENT_ID:', GA_MEASUREMENT_ID);
  console.log('🔍 Analytics Debug - window.gtag available:', typeof window !== 'undefined' && window.gtag);
  
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_title: document.title,
      page_location: window.location.href,
    });
    console.log('✅ Analytics Debug - Google Analytics configured successfully');
  } else {
    console.error('❌ Analytics Debug - Google Analytics not available');
  }
};

// Track page views
export const trackPageView = (url) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: url,
    });
  }
};

// Track custom events
export const trackEvent = (action, category, label, value) => {
  console.log('🔍 Analytics Debug - trackEvent called:', { action, category, label, value });
  
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
    console.log('✅ Analytics Debug - Event tracked successfully');
  } else {
    console.error('❌ Analytics Debug - Cannot track event, gtag not available');
  }
};

// Track user interactions
export const trackUserInteraction = (interactionType, elementName, value = null) => {
  trackEvent(interactionType, 'User Interaction', elementName, value);
};

// Track blog interactions
export const trackBlogInteraction = (action, blogTitle, blogId) => {
  trackEvent(action, 'Blog', blogTitle, blogId);
};

// Track product interactions
export const trackProductInteraction = (action, productName, productId) => {
  trackEvent(action, 'Product', productName, productId);
};

// Track AR interactions
export const trackARInteraction = (action, productType, productName) => {
  trackEvent(action, 'AR Feature', productType, productName);
};

// Track admin actions
export const trackAdminAction = (action, resource, resourceId) => {
  trackEvent(action, 'Admin Action', resource, resourceId);
};

// Track form submissions
export const trackFormSubmission = (formName, success = true) => {
  trackEvent('form_submit', 'Form', formName, success ? 1 : 0);
};

// Track search queries
export const trackSearch = (searchTerm, resultsCount) => {
  trackEvent('search', 'Search', searchTerm, resultsCount);
};

// Track authentication events
export const trackAuthEvent = (action, method = 'email') => {
  trackEvent(action, 'Authentication', method);
};

// Track navigation events
export const trackNavigation = (destination, source) => {
  trackEvent('navigate', 'Navigation', `${source} -> ${destination}`);
};

// Track error events
export const trackError = (errorType, errorMessage, errorLocation) => {
  trackEvent('error', 'Error', `${errorType}: ${errorMessage}`, errorLocation);
};

// Track performance events
export const trackPerformance = (metric, value, page) => {
  trackEvent('performance', 'Performance', metric, value);
};

// Enhanced ecommerce tracking (if needed)
export const trackPurchase = (transactionId, value, currency = 'VND') => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'purchase', {
      transaction_id: transactionId,
      value: value,
      currency: currency,
    });
  }
};

// Track add to cart events
export const trackAddToCart = (itemId, itemName, category, value) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'add_to_cart', {
      currency: 'VND',
      value: value,
      items: [{
        item_id: itemId,
        item_name: itemName,
        item_category: category,
        quantity: 1,
        price: value,
      }],
    });
  }
};

// Track view item events
export const trackViewItem = (itemId, itemName, category, value) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'view_item', {
      currency: 'VND',
      value: value,
      items: [{
        item_id: itemId,
        item_name: itemName,
        item_category: category,
        quantity: 1,
        price: value,
      }],
    });
  }
};

export default {
  initGA,
  trackPageView,
  trackEvent,
  trackUserInteraction,
  trackBlogInteraction,
  trackProductInteraction,
  trackARInteraction,
  trackAdminAction,
  trackFormSubmission,
  trackSearch,
  trackAuthEvent,
  trackNavigation,
  trackError,
  trackPerformance,
  trackPurchase,
  trackAddToCart,
  trackViewItem,
};
