/**
 * Admin Panel - Image Normalization & Resolution Utility
 */

export const DEFAULT_FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80';

export const normalizeImageUrl = (url?: string | null): string => {
  if (!url || typeof url !== 'string') {
    return DEFAULT_FALLBACK_IMAGE;
  }

  let cleaned = url.trim();

  // If Markdown link: [text](http...)
  const mdMatch = cleaned.match(/\[.*?\]\((https?:\/\/[^\s)]+)\)/);
  if (mdMatch && mdMatch[1]) {
    cleaned = mdMatch[1];
  }

  cleaned = cleaned.replace(/\\&/g, '&');

  if (
    cleaned.startsWith('https://') ||
    cleaned.startsWith('http://') ||
    cleaned.startsWith('data:image/') ||
    cleaned.startsWith('/')
  ) {
    if (cleaned.includes('example.com')) return DEFAULT_FALLBACK_IMAGE;
    return cleaned;
  }

  return DEFAULT_FALLBACK_IMAGE;
};

export const getProductImage = (product?: {
  images?: string[] | null;
  thumbnail?: string | null;
  variants?: Array<{ image?: string | null }> | null;
  image?: string | null;
} | null): string => {
  if (!product) return DEFAULT_FALLBACK_IMAGE;

  if (product.images && Array.isArray(product.images) && product.images.length > 0) {
    const candidate = normalizeImageUrl(product.images[0]);
    if (candidate && candidate !== DEFAULT_FALLBACK_IMAGE) return candidate;
  }

  if (product.thumbnail) {
    const candidate = normalizeImageUrl(product.thumbnail);
    if (candidate && candidate !== DEFAULT_FALLBACK_IMAGE) return candidate;
  }

  if (product.variants && Array.isArray(product.variants) && product.variants.length > 0) {
    const firstVar = product.variants.find((v) => v && v.image)?.image;
    if (firstVar) {
      const candidate = normalizeImageUrl(firstVar);
      if (candidate && candidate !== DEFAULT_FALLBACK_IMAGE) return candidate;
    }
  }

  if (product.image) {
    return normalizeImageUrl(product.image);
  }

  return DEFAULT_FALLBACK_IMAGE;
};
