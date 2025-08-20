/**
 * Convierte URLs de MinIO a URLs del proxy para evitar problemas de CSP
 */
export const getVideoUrl = (url: string): string => {
  if (!url) return '';
  
  // Si es una URL de MinIO, usar el proxy
  if (url.includes('127.0.0.1:9000') || url.includes('localhost:9000')) {
    return `/api/video-proxy?url=${encodeURIComponent(url)}`;
  }
  
  // Si es una URL de YouTube, convertir a embed
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    const videoId = extractYouTubeId(url);
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}`;
    }
  }
  
  // Para otras URLs, devolver tal como están
  return url;
};

/**
 * Extrae el ID del video de YouTube de una URL
 */
export const extractYouTubeId = (url: string): string | null => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

/**
 * Verifica si una URL es de MinIO
 */
export const isMinioUrl = (url: string): boolean => {
  return url.includes('127.0.0.1:9000') || url.includes('localhost:9000');
};

/**
 * Verifica si una URL es de YouTube
 */
export const isYouTubeUrl = (url: string): boolean => {
  return url.includes('youtube.com') || url.includes('youtu.be');
};

/**
 * Obtiene la URL de thumbnail de YouTube
 */
export const getYouTubeThumbnail = (url: string): string => {
  const videoId = extractYouTubeId(url);
  if (videoId) {
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  }
  return '';
};
