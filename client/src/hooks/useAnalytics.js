import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView, trackEvent } from '../utils/analytics';

// Custom hook for Google Analytics
export const useAnalytics = () => {
  const location = useLocation();

  // Track page views on route changes
  useEffect(() => {
    trackPageView(location.pathname + location.search);
  }, [location]);

  return {
    trackEvent,
    trackPageView: () => trackPageView(location.pathname + location.search),
  };
};

// Hook for tracking user interactions
export const useTrackUserInteraction = () => {
  const trackClick = (elementName, elementType = 'button') => {
    trackEvent('click', 'User Interaction', `${elementType}: ${elementName}`);
  };

  const trackFormSubmit = (formName, success = true) => {
    trackEvent('form_submit', 'Form', formName, success ? 1 : 0);
  };

  const trackSearch = (searchTerm, resultsCount) => {
    trackEvent('search', 'Search', searchTerm, resultsCount);
  };

  const trackNavigation = (destination, source) => {
    trackEvent('navigate', 'Navigation', `${source} -> ${destination}`);
  };

  return {
    trackClick,
    trackFormSubmit,
    trackSearch,
    trackNavigation,
  };
};

// Hook for tracking blog interactions
export const useTrackBlogInteraction = () => {
  const trackBlogView = (blogTitle, blogId) => {
    trackEvent('blog_view', 'Blog', blogTitle, blogId);
  };

  const trackBlogLike = (blogTitle, blogId) => {
    trackEvent('blog_like', 'Blog', blogTitle, blogId);
  };

  const trackBlogShare = (blogTitle, blogId, platform) => {
    trackEvent('blog_share', 'Blog', `${blogTitle} on ${platform}`, blogId);
  };

  const trackBlogComment = (blogTitle, blogId) => {
    trackEvent('blog_comment', 'Blog', blogTitle, blogId);
  };

  return {
    trackBlogView,
    trackBlogLike,
    trackBlogShare,
    trackBlogComment,
  };
};

// Hook for tracking product interactions
export const useTrackProductInteraction = () => {
  const trackProductView = (productName, productId, category) => {
    trackEvent('product_view', 'Product', `${category}: ${productName}`, productId);
  };

  const trackProductLike = (productName, productId) => {
    trackEvent('product_like', 'Product', productName, productId);
  };

  const trackARView = (productName, productType) => {
    trackEvent('ar_view', 'AR Feature', `${productType}: ${productName}`);
  };

  const trackARInteraction = (productName, productType, interactionType) => {
    trackEvent('ar_interaction', 'AR Feature', `${productType}: ${productName} - ${interactionType}`);
  };

  return {
    trackProductView,
    trackProductLike,
    trackARView,
    trackARInteraction,
  };
};

// Hook for tracking admin actions
export const useTrackAdminAction = () => {
  const trackAdminLogin = () => {
    trackEvent('admin_login', 'Admin Action', 'Login');
  };

  const trackAdminLogout = () => {
    trackEvent('admin_logout', 'Admin Action', 'Logout');
  };

  const trackBlogCreate = (blogTitle) => {
    trackEvent('blog_create', 'Admin Action', blogTitle);
  };

  const trackBlogUpdate = (blogTitle, blogId) => {
    trackEvent('blog_update', 'Admin Action', blogTitle, blogId);
  };

  const trackBlogDelete = (blogTitle, blogId) => {
    trackEvent('blog_delete', 'Admin Action', blogTitle, blogId);
  };

  const trackImageUpload = (imageCount) => {
    trackEvent('image_upload', 'Admin Action', `Upload ${imageCount} images`);
  };

  return {
    trackAdminLogin,
    trackAdminLogout,
    trackBlogCreate,
    trackBlogUpdate,
    trackBlogDelete,
    trackImageUpload,
  };
};

export default useAnalytics;
