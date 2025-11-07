// Image utility functions

// Generate a simple placeholder image as data URI
export const getPlaceholderImage = (width = 300, height = 300, text = 'No Image') => {
  // Create a simple SVG placeholder as data URI (URL encoded for better compatibility)
  const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#f3f4f6"/><text x="50%" y="50%" font-family="Arial, sans-serif" font-size="14" fill="#9ca3af" text-anchor="middle" dy=".3em">${encodeURIComponent(text)}</text></svg>`;
  
  // Use URL encoding instead of base64 for better browser compatibility
  return `data:image/svg+xml,${svg}`;
};

// Get product image with fallback
export const getProductImage = (imagePath, fallbackText = 'No Image') => {
  if (!imagePath || imagePath.trim() === '') {
    return getPlaceholderImage(300, 300, fallbackText);
  }
  
  // If it's already a full URL, return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://') || imagePath.startsWith('data:')) {
    return imagePath;
  }
  
  // If it's already an absolute path (starts with /), return as is
  if (imagePath.startsWith('/')) {
    return imagePath;
  }
  
  // Otherwise, assume it's a public asset and prepend /
  // This handles cases like "assets/lipstick3.jpg" -> "/assets/lipstick3.jpg"
  return `/${imagePath}`;
};

// Handle image error with fallback
export const handleImageError = (e, fallbackText = 'No Image') => {
  e.target.src = getPlaceholderImage(300, 300, fallbackText);
  e.target.onerror = null; // Prevent infinite loop
};

