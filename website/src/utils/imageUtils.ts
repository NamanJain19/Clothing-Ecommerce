/**
 * Monolith Luxury Fashion - Image Normalization & Resolution Utility
 */

export const DEFAULT_FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80';

/**
 * Normalizes any image URL string:
 * - Extracts direct URL from Markdown formatted links: [caption](https://...) or [https://...](https://...)
 * - Unescapes characters such as \& -> &
 * - Trims whitespace and handles protocol-relative or direct URLs
 */
export const normalizeImageUrl = (url?: string | null): string => {
  if (!url || typeof url !== 'string') {
    return DEFAULT_FALLBACK_IMAGE;
  }

  let cleaned = url.trim();

  // If URL is in Markdown syntax [text](http...), extract the URL inside parentheses
  const mdMatch = cleaned.match(/\[.*?\]\((https?:\/\/[^\s)]+)\)/);
  if (mdMatch && mdMatch[1]) {
    cleaned = mdMatch[1];
  }

  // Also check if wrapped in parentheses alone: (https://...)
  const parenMatch = cleaned.match(/^\((https?:\/\/[^\s)]+)\)$/);
  if (parenMatch && parenMatch[1]) {
    cleaned = parenMatch[1];
  }

  // Replace escaped ampersands \& -> &
  cleaned = cleaned.replace(/\\&/g, '&');

  // Verify valid web protocol or relative path
  if (
    cleaned.startsWith('https://') ||
    cleaned.startsWith('http://') ||
    cleaned.startsWith('data:image/') ||
    cleaned.startsWith('/')
  ) {
    // If it contains example.com or invalid placeholders, return luxury fallback
    if (cleaned.includes('example.com') || cleaned.includes('placeholder.com/via')) {
      return DEFAULT_FALLBACK_IMAGE;
    }
    return cleaned;
  }

  return DEFAULT_FALLBACK_IMAGE;
};

/**
 * Resolves the primary product image using the priority:
 * images[0] -> thumbnail -> variants[0].image -> image -> DEFAULT_FALLBACK_IMAGE
 */
export const getProductImage = (product?: {
  images?: string[] | null;
  thumbnail?: string | null;
  variants?: Array<{ image?: string | null }> | null;
  image?: string | null;
} | null): string => {
  if (!product) return DEFAULT_FALLBACK_IMAGE;

  // 1. Try first element of images array
  if (product.images && Array.isArray(product.images) && product.images.length > 0) {
    const candidate = normalizeImageUrl(product.images[0]);
    if (candidate && candidate !== DEFAULT_FALLBACK_IMAGE) return candidate;
  }

  // 2. Try thumbnail
  if (product.thumbnail) {
    const candidate = normalizeImageUrl(product.thumbnail);
    if (candidate && candidate !== DEFAULT_FALLBACK_IMAGE) return candidate;
  }

  // 3. Try variants[0].image
  if (product.variants && Array.isArray(product.variants) && product.variants.length > 0) {
    const firstVarImg = product.variants.find((v) => v && v.image)?.image;
    if (firstVarImg) {
      const candidate = normalizeImageUrl(firstVarImg);
      if (candidate && candidate !== DEFAULT_FALLBACK_IMAGE) return candidate;
    }
  }

  // 4. Try legacy direct image field
  if (product.image) {
    return normalizeImageUrl(product.image);
  }

  return DEFAULT_FALLBACK_IMAGE;
};

/**
 * Extracts and normalizes all available images for a product into a clean array
 */
export const getProductImages = (product?: {
  images?: string[] | null;
  thumbnail?: string | null;
  variants?: Array<{ image?: string | null }> | null;
  image?: string | null;
} | null): string[] => {
  if (!product) return [DEFAULT_FALLBACK_IMAGE];

  const candidates: string[] = [];

  if (product.images && Array.isArray(product.images)) {
    product.images.forEach((img) => {
      const norm = normalizeImageUrl(img);
      if (norm && !candidates.includes(norm)) candidates.push(norm);
    });
  }

  if (product.thumbnail) {
    const norm = normalizeImageUrl(product.thumbnail);
    if (norm && !candidates.includes(norm)) candidates.push(norm);
  }

  if (product.variants && Array.isArray(product.variants)) {
    product.variants.forEach((v) => {
      if (v?.image) {
        const norm = normalizeImageUrl(v.image);
        if (norm && !candidates.includes(norm)) candidates.push(norm);
      }
    });
  }

  if (product.image) {
    const norm = normalizeImageUrl(product.image);
    if (norm && !candidates.includes(norm)) candidates.push(norm);
  }

  return candidates.length > 0 ? candidates : [DEFAULT_FALLBACK_IMAGE];
};
