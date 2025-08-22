import { BACKEND_URL } from './api';

/**
 * Converts MinIO video URLs to proxy URLs to avoid CORS issues
 */
export const convertMinioUrlToProxy = (minioUrl: string): string => {
  // Check if it's a MinIO URL (127.0.0.1:9000 or localhost:9000)
  if (minioUrl.includes('127.0.0.1:9000') || minioUrl.includes('localhost:9000')) {
    try {
      const url = new URL(minioUrl);
      const path = url.pathname;

      // Convert to proxy URL
      const proxyUrl = `/api/video-proxy?path=${encodeURIComponent(path)}`;
      console.log('🎥 Converting MinIO URL to proxy:', { original: minioUrl, proxy: proxyUrl });

      return proxyUrl;
    } catch (error) {
      console.error('🎥 Error converting MinIO URL:', error);
      return minioUrl; // Return original if conversion fails
    }
  }

  // Return original URL if it's not a MinIO URL
  return minioUrl;
};

/**
 * Checks if a URL is a MinIO URL
 */
export const isMinioUrl = (url: string): boolean => {
  return url.includes('127.0.0.1:9000') || url.includes('localhost:9000');
};

/**
 * Checks if a URL is a YouTube URL
 */
export const isYouTubeUrl = (url: string): boolean => {
  return url.includes('youtube.com') || url.includes('youtu.be');
};

/**
 * Converts MinIO PDF URLs to proxy URLs to avoid CSP issues
 */
export const convertMinioPdfUrlToProxy = (minioUrl: string): string => {
  // Check if it's a MinIO URL (127.0.0.1:9000 or localhost:9000)
  if (isMinioUrl(minioUrl)) {
    try {
      // Convert to PDF proxy URL
      const proxyUrl = `/api/pdf-proxy?path=${encodeURIComponent(minioUrl)}`;
      console.log('📄 Converting MinIO PDF URL to proxy:', { original: minioUrl, proxy: proxyUrl });

      return proxyUrl;
    } catch (error) {
      console.error('📄 Error converting MinIO PDF URL:', error);
      return minioUrl; // Return original if conversion fails
    }
  }

  // Return original URL if it's not a MinIO URL
  return minioUrl;
};

/**
 * Converts MinIO image URLs to proxy URLs to avoid CSP issues
 */
export const convertMinioImageUrlToProxy = (minioUrl: string): string => {
  // Check if it's a MinIO URL (127.0.0.1:9000 or localhost:9000)
  if (isMinioUrl(minioUrl)) {
    try {
      // Convert to image proxy URL
      const proxyUrl = `/api/image-proxy?url=${encodeURIComponent(minioUrl)}`;
      console.log('🖼️ Converting MinIO image URL to proxy:', { original: minioUrl, proxy: proxyUrl });

      return proxyUrl;
    } catch (error) {
      console.error('🖼️ Error converting MinIO image URL:', error);
      return minioUrl; // Return original if conversion fails
    }
  }

  // Return original URL if it's not a MinIO URL
  return minioUrl;
};

/**
 * Checks if a URL is a PDF
 */
export const isPdfUrl = (url: string): boolean => {
  return url.toLowerCase().includes('.pdf') || url.toLowerCase().includes('application/pdf');
};

/**
 * Checks if a URL is an image
 */
export const isImageUrl = (url: string): boolean => {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp'];
  const lowerUrl = url.toLowerCase();
  return imageExtensions.some(ext => lowerUrl.includes(ext)) ||
    lowerUrl.includes('/images/') ||
    lowerUrl.includes('/uploads/');
};

/**
 * Gets the appropriate video URL based on the source
 */
export const getVideoUrl = (originalUrl: string): string => {
  if (isYouTubeUrl(originalUrl)) {
    return originalUrl; // YouTube URLs work directly
  }

  if (isMinioUrl(originalUrl)) {
    return convertMinioUrlToProxy(originalUrl); // Convert MinIO URLs to proxy
  }

  return originalUrl; // Return as-is for other URLs
};

/**
 * Gets the appropriate PDF URL based on the source
 */
export const getPdfUrl = (originalUrl: string): string => {
  if (isMinioUrl(originalUrl) && isPdfUrl(originalUrl)) {
    return convertMinioPdfUrlToProxy(originalUrl); // Convert MinIO PDF URLs to proxy
  }

  return originalUrl; // Return as-is for other URLs
};

/**
 * Gets the appropriate image URL based on the source
 */
export const getImageUrl = (originalUrl: string): string => {
  if (!originalUrl) return '';

  // If it's already a full URL, return as is
  if (originalUrl.startsWith('http://') || originalUrl.startsWith('https://')) {
    return originalUrl;
  }

  // If it starts with /uploads, make it a full URL using BACKEND_URL
  if (originalUrl.startsWith('/uploads/')) {
    return `${BACKEND_URL}${originalUrl}`;
  }

  // If it's a MinIO URL, convert to proxy
  if (isMinioUrl(originalUrl) && isImageUrl(originalUrl)) {
    return convertMinioImageUrlToProxy(originalUrl);
  }

  // If it's just a filename, assume it's in uploads
  if (!originalUrl.includes('/')) {
    return `${BACKEND_URL}/uploads/${originalUrl}`;
  }

  return originalUrl; // Return as-is for other URLs
};

/**
 * Gets the appropriate file URL based on the source and type
 */
export const getFileUrl = (originalUrl: string, fileType?: string): string => {
  if (isMinioUrl(originalUrl)) {
    if (fileType === 'VIDEO' || originalUrl.includes('/videos/')) {
      return convertMinioUrlToProxy(originalUrl);
    } else if (fileType === 'PDF' || isPdfUrl(originalUrl)) {
      return convertMinioPdfUrlToProxy(originalUrl);
    } else if (fileType === 'IMAGE' || isImageUrl(originalUrl)) {
      return convertMinioImageUrlToProxy(originalUrl);
    }
    // Para otros tipos de archivos de MinIO, usar la URL original por ahora
  }

  return originalUrl; // Return as-is for other URLs
};
