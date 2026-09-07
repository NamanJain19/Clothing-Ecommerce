/**
 * Admin Panel - Image Normalization & Resolution Utility
 */

export const DEFAULT_FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80';

import { API_BASE_URL } from '../services/adminService';

const getBackendRoot = (): string => {
  const cleanBase = (API_BASE_URL || 'http://localhost:3011/api').replace(/\/+$/, '');
  return cleanBase.replace(/\/api$/, '');
};

export const normalizeImageUrl = (input?: any): string => {
  if (!input) return DEFAULT_FALLBACK_IMAGE;

  let raw = '';
  if (typeof input === 'string') {
    raw = input.trim();
  } else if (typeof input === 'object') {
    raw = input.secure_url || input.url || input.image || input.src || '';
  }

  if (!raw || typeof raw !== 'string') {
    return DEFAULT_FALLBACK_IMAGE;
  }

  let cleaned = raw.trim();

  // If Markdown link: [text](http...)
  const mdMatch = cleaned.match(/\[.*?\]\((https?:\/\/[^\s)]+)\)/);
  if (mdMatch && mdMatch[1]) {
    cleaned = mdMatch[1];
  }

  cleaned = cleaned.replace(/\\&/g, '&');

  // If relative path like /uploads/... or uploads/...
  if (cleaned.startsWith('/uploads/') || cleaned.startsWith('/images/')) {
    cleaned = `${getBackendRoot()}${cleaned}`;
  } else if (cleaned.startsWith('uploads/') || cleaned.startsWith('images/')) {
    cleaned = `${getBackendRoot()}/${cleaned}`;
  }

  // If running on production (HTTPS), replace accidental localhost images with production backend
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    if (cleaned.includes('localhost:3011')) {
      cleaned = cleaned.replace('http://localhost:3011', 'https://monolith-backend-yzxj.onrender.com');
    }
  }

  if (
    cleaned.startsWith('https://') ||
    cleaned.startsWith('http://') ||
    cleaned.startsWith('data:image/') ||
    cleaned.startsWith('/')
  ) {
    if (cleaned.includes('example.com') || cleaned.includes('placeholder.com/via')) {
      return DEFAULT_FALLBACK_IMAGE;
    }
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
