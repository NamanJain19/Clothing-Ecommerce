import { API_BASE_URL, getToken } from './api';
import { Product } from '../types';

export interface VisualSearchResultItem {
  id: string;
  name: string;
  slug?: string;
  sku?: string;
  brand?: string;
  price: number;
  compareAtPrice?: number;
  image: string;
  category: string;
  gender?: string;
  stock?: number;
  inStock?: boolean;
  productUrl?: string;
  matchScore: number;
  matchQuality: string;
}

export interface VisualSearchAnalysis {
  itemType?: string;
  department?: string;
  category?: string;
  colors?: string[];
  patterns?: string[];
  style?: string[];
  material?: string[];
  features?: string[];
  keywords?: string[];
  detectedTags: string[];
}

export interface VisualSearchResponse {
  success: boolean;
  analysis: VisualSearchAnalysis;
  products: VisualSearchResultItem[];
  message?: string;
}

/**
 * Sends image file or payload to backend /api/ai/visual-search
 */
export const searchByImage = async (
  fileOrBase64: File | string
): Promise<VisualSearchResponse> => {
  const token = getToken();
  const headers: Record<string, string> = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  let body: any;

  if (fileOrBase64 instanceof File) {
    const formData = new FormData();
    formData.append('image', fileOrBase64);
    body = formData;
  } else if (typeof fileOrBase64 === 'string' && fileOrBase64.startsWith('data:image')) {
    headers['Content-Type'] = 'application/json';
    body = JSON.stringify({ imageBase64: fileOrBase64 });
  } else if (typeof fileOrBase64 === 'string' && fileOrBase64.startsWith('http')) {
    headers['Content-Type'] = 'application/json';
    body = JSON.stringify({ imageUrl: fileOrBase64 });
  } else {
    headers['Content-Type'] = 'application/json';
    body = JSON.stringify({ imageBase64: fileOrBase64 });
  }

  const response = await fetch(`${API_BASE_URL}/ai/visual-search`, {
    method: 'POST',
    headers,
    body,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Visual search failed (${response.status})`);
  }

  return await response.json();
};
