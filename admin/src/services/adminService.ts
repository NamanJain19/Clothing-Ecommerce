/**
 * Admin Service Layer
 * Connects Admin Panel directly to Backend MongoDB API (http://localhost:3011)
 * with reliable fallback handling.
 */

const API_BASE_URL = 'http://localhost:3011/api';

const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem('admin_token') || localStorage.getItem('token') || '';
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export interface AdminProductPayload {
  name: string;
  sku?: string;
  brand?: string;
  category?: string;
  collection?: string;
  gender?: 'men' | 'women' | 'kids' | 'unisex' | 'accessories';
  price: number;
  compareAtPrice?: number;
  stock?: number;
  isSale?: boolean;
  isFeatured?: boolean;
  isNewArrival?: boolean;
  isActive?: boolean;
  description?: string;
  shortDescription?: string;
  images: string[];
  thumbnail?: string;
  sizes?: string[];
  colors?: string[];
  material?: string;
}

export const adminService = {
  // 1. Dashboard Stats
  async getDashboardStats() {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/dashboard`, {
        headers: getAuthHeaders(),
      });
      if (res.ok) return await res.json();
    } catch (err) {
      console.warn('Backend dashboard stats offline, using fallback:', err);
    }
    return null;
  },

  // 2. Products CRUD
  async getProducts(params: Record<string, any> = {}) {
    try {
      const query = new URLSearchParams(params).toString();
      const res = await fetch(`${API_BASE_URL}/products?limit=100&${query}`);
      if (res.ok) return await res.json();
    } catch (err) {
      console.warn('Backend products fetch failed:', err);
    }
    return null;
  },

  async getProductById(id: string) {
    try {
      const res = await fetch(`${API_BASE_URL}/products/${id}`);
      if (res.ok) return await res.json();
    } catch (err) {
      console.warn('Backend product by id failed:', err);
    }
    return null;
  },

  async createProduct(data: AdminProductPayload) {
    try {
      const res = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      if (res.ok) return await res.json();
    } catch (err) {
      console.warn('Backend create product failed:', err);
    }
    return null;
  },

  async updateProduct(id: string, data: Partial<AdminProductPayload>) {
    try {
      const res = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      if (res.ok) return await res.json();
    } catch (err) {
      console.warn('Backend update product failed:', err);
    }
    return null;
  },

  async deleteProduct(id: string) {
    try {
      const res = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (res.ok) return await res.json();
    } catch (err) {
      console.warn('Backend delete product failed:', err);
    }
    return null;
  },

  // 3. Orders CRUD & Tracking Status
  async getOrders() {
    try {
      const res = await fetch(`${API_BASE_URL}/orders`, {
        headers: getAuthHeaders(),
      });
      if (res.ok) return await res.json();
    } catch (err) {
      console.warn('Backend orders fetch failed:', err);
    }
    return null;
  },

  async updateOrderStatus(orderId: string, status: string, trackingNumber?: string, carrier?: string) {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status, trackingNumber, carrier }),
      });
      if (res.ok) return await res.json();
    } catch (err) {
      console.warn('Backend update order status failed:', err);
    }
    return null;
  },

  async createShipment(orderId: string, carrier?: string, service?: string) {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/orders/${orderId}/shipment`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ carrier, service }),
      });
      if (res.ok) return await res.json();
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || 'Failed to generate courier shipment');
    } catch (err) {
      console.warn('Backend create shipment failed:', err);
      throw err;
    }
  },

  async refreshTracking(orderId: string) {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/orders/${orderId}/tracking/refresh`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });
      if (res.ok) return await res.json();
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || 'Failed to refresh tracking');
    } catch (err) {
      console.warn('Backend refresh tracking failed:', err);
      throw err;
    }
  },

  // 4. Reviews Moderation
  async getReviews() {
    try {
      const res = await fetch(`${API_BASE_URL}/reviews`, {
        headers: getAuthHeaders(),
      });
      if (res.ok) return await res.json();
    } catch (err) {
      console.warn('Backend reviews fetch failed:', err);
    }
    return null;
  },

  async approveReview(id: string) {
    try {
      const res = await fetch(`${API_BASE_URL}/reviews/${id}/approve`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
      });
      if (res.ok) return await res.json();
    } catch (err) {
      console.warn('Backend approve review failed:', err);
    }
    return null;
  },

  async deleteReview(id: string) {
    try {
      const res = await fetch(`${API_BASE_URL}/reviews/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (res.ok) return await res.json();
    } catch (err) {
      console.warn('Backend delete review failed:', err);
    }
    return null;
  },

  // 5. Coupons CRUD
  async getCoupons() {
    try {
      const res = await fetch(`${API_BASE_URL}/coupons`, {
        headers: getAuthHeaders(),
      });
      if (res.ok) return await res.json();
    } catch (err) {
      console.warn('Backend coupons fetch failed:', err);
    }
    return null;
  },

  async createCoupon(data: any) {
    try {
      const res = await fetch(`${API_BASE_URL}/coupons`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      if (res.ok) return await res.json();
    } catch (err) {
      console.warn('Backend create coupon failed:', err);
    }
    return null;
  },

  async deleteCoupon(id: string) {
    try {
      const res = await fetch(`${API_BASE_URL}/coupons/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (res.ok) return await res.json();
    } catch (err) {
      console.warn('Backend delete coupon failed:', err);
    }
    return null;
  },

  // 6. Registered Customers
  async getCustomers() {
    try {
      const res = await fetch(`${API_BASE_URL}/users`, {
        headers: getAuthHeaders(),
      });
      if (res.ok) return await res.json();
    } catch (err) {
      console.warn('Backend customers fetch failed:', err);
    }
    return null;
  },

  // 7. Banners
  async getBanners() {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/banners`, {
        headers: getAuthHeaders(),
      });
      if (res.ok) return await res.json();
    } catch (err) {
      console.warn('Backend banners fetch failed:', err);
    }
    return null;
  },

  async createBanner(data: any) {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/banners`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      if (res.ok) return await res.json();
    } catch (err) {
      console.warn('Backend create banner failed:', err);
    }
    return null;
  },

  async deleteBanner(id: string) {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/banners/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (res.ok) return await res.json();
    } catch (err) {
      console.warn('Backend delete banner failed:', err);
    }
    return null;
  },

  // 19. Change Password (MongoDB Database Persisted)
  async changePassword(currentPassword: string, newPassword: string) {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/change-password`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      return await res.json();
    } catch (err) {
      console.warn('Backend change password failed:', err);
      return { success: false, message: 'Network error connecting to backend' };
    }
  },

  // 20. Store Settings (MongoDB Database Persisted)
  async getSettings() {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/settings`, {
        headers: getAuthHeaders(),
      });
      if (res.ok) return await res.json();
    } catch (err) {
      console.warn('Backend get settings failed:', err);
    }
    return null;
  },

  async updateSettings(settings: any) {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/settings`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(settings),
      });
      if (res.ok) return await res.json();
    } catch (err) {
      console.warn('Backend update settings failed:', err);
    }
    return null;
  },

  // 21. Real PDF Invoice Download
  async downloadInvoicePDF(orderId: string): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/admin/orders/${orderId}/invoice/download`, {
      headers: getAuthHeaders(),
    });

    if (!res.ok) {
      throw new Error('Failed to generate admin invoice PDF');
    }

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Invoice-${orderId}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);
    window.URL.revokeObjectURL(url);
  },

  // 22. Cloudinary Product Image Uploads
  async uploadImage(file: File, folder = 'luxury_fashion/products'): Promise<{ secure_url: string; public_id: string; url: string }> {
    const token = localStorage.getItem('admin_token') || localStorage.getItem('token') || '';
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    const res = await fetch(`${API_BASE_URL}/admin/upload`, {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Image upload to Cloudinary failed');
    }

    return data.data || data;
  },

  async uploadImages(files: File[], folder = 'luxury_fashion/products'): Promise<Array<{ secure_url: string; public_id: string; url: string }>> {
    const token = localStorage.getItem('admin_token') || localStorage.getItem('token') || '';
    const formData = new FormData();
    files.forEach((f) => formData.append('files', f));
    formData.append('folder', folder);

    const res = await fetch(`${API_BASE_URL}/admin/upload/multiple`, {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Multiple images upload failed');
    }

    return data.data;
  },

  async deleteImage(publicIdOrUrl: string): Promise<boolean> {
    const res = await fetch(`${API_BASE_URL}/admin/upload/delete`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ public_id: publicIdOrUrl, url: publicIdOrUrl }),
    });

    const data = await res.json();
    return data.success === true;
  },
};

export default adminService;
