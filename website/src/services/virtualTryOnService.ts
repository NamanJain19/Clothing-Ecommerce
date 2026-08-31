import { API_BASE_URL, getToken } from './api';

export interface VirtualTryOnResponse {
  success: boolean;
  resultImageUrl: string;
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
    category?: string;
  };
  meta?: {
    vtonModel: string;
    garmentCategory: string;
    timestamp: string;
  };
  message?: string;
}

/**
 * Sends customer photo and selected product ID to backend /api/ai/virtual-try-on
 */
export const requestVirtualTryOn = async (
  customerPhoto: File | string,
  productId: string
): Promise<VirtualTryOnResponse> => {
  const token = getToken();
  const headers: Record<string, string> = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  let body: any;

  if (customerPhoto instanceof File) {
    const formData = new FormData();
    formData.append('image', customerPhoto);
    formData.append('productId', productId);
    body = formData;
  } else if (typeof customerPhoto === 'string' && customerPhoto.startsWith('data:image')) {
    headers['Content-Type'] = 'application/json';
    body = JSON.stringify({
      humanImageBase64: customerPhoto,
      productId,
    });
  } else if (typeof customerPhoto === 'string' && customerPhoto.startsWith('http')) {
    headers['Content-Type'] = 'application/json';
    body = JSON.stringify({
      humanImageUrl: customerPhoto,
      productId,
    });
  } else {
    headers['Content-Type'] = 'application/json';
    body = JSON.stringify({
      humanImage: customerPhoto,
      productId,
    });
  }

  const response = await fetch(`${API_BASE_URL}/ai/virtual-try-on`, {
    method: 'POST',
    headers,
    body,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || `Virtual try-on failed (${response.status})`);
  }

  return data;
};
