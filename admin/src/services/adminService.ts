/**
 * Admin Service Layer
 * Connects Admin Panel directly to Backend MongoDB Atlas API
 * with strict production authentication, error handling, and zero mock fallbacks.
 */

declare global {
  interface ImportMeta {
    env: Record<string, string | undefined>;
  }
}

export const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:3011/api';

export const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem('admin_token') || localStorage.getItem('token') || '';
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const clearAdminAuthSession = () => {
  localStorage.removeItem('admin_token');
  localStorage.removeItem('token');
  localStorage.removeItem('admin_user');
  if (typeof window !== 'undefined' && !window.location.pathname.includes('/admin/login')) {
    window.location.href = '/admin/login';
  }
};

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
  const headers = {
    ...getAuthHeaders(),
    ...(options.headers as Record<string, string> | undefined),
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    clearAdminAuthSession();
    throw new Error('Authentication session expired. Please sign in again.');
  }

  let data: any;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const errorMsg = data?.message || data?.error || `Request failed with status ${response.status}`;
    throw new Error(errorMsg);
  }

  return data as T;
}

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
  // 1. Authentication
  async login(email: string, password: string) {
    const data = await apiRequest<{
      success: boolean;
      token: string;
      user: {
        _id: string;
        firstName: string;
        lastName: string;
        email: string;
        role: string;
      };
      message?: string;
    }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (data.token) {
      localStorage.setItem('admin_token', data.token);
      localStorage.setItem('token', data.token);
      localStorage.setItem('admin_user', JSON.stringify(data.user));
    }
    return data;
  },

  logout() {
    clearAdminAuthSession();
  },

  getCurrentUser() {
    try {
      const stored = localStorage.getItem('admin_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  },

  isAuthenticated(): boolean {
    const token = localStorage.getItem('admin_token') || localStorage.getItem('token');
    const user = this.getCurrentUser();
    return !!(token && user && ['admin', 'manager', 'staff'].includes(user.role));
  },

  async forgotPassword(email: string) {
    return await apiRequest<{ success: boolean; message: string }>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  async resetPassword(token: string, newPassword: string) {
    return await apiRequest<{ success: boolean; message: string }>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, newPassword }),
    });
  },

  // 2. Dashboard Stats & Analytics
  async getDashboardStats() {
    return await apiRequest<{
      success: boolean;
      data: {
        totalProducts: number;
        totalOrders: number;
        totalCustomers: number;
        totalRevenue: number;
        pendingOrders: number;
        lowStockProducts: number;
        totalReturns: number;
        totalRefunds: number;
        recentOrders: any[];
        topProducts: any[];
        salesSummary?: any[];
      };
    }>('/admin/dashboard');
  },

  async getSalesAnalytics(params: Record<string, any> = {}) {
    const query = new URLSearchParams(params).toString();
    return await apiRequest<{ success: boolean; data: any }>(`/admin/analytics/sales?${query}`);
  },

  async getOrderAnalytics(params: Record<string, any> = {}) {
    const query = new URLSearchParams(params).toString();
    return await apiRequest<{ success: boolean; data: any }>(`/admin/analytics/orders?${query}`);
  },

  async getCustomerAnalytics(params: Record<string, any> = {}) {
    const query = new URLSearchParams(params).toString();
    return await apiRequest<{ success: boolean; data: any }>(`/admin/analytics/customers?${query}`);
  },

  async getProductAnalytics(params: Record<string, any> = {}) {
    const query = new URLSearchParams(params).toString();
    return await apiRequest<{ success: boolean; data: any }>(`/admin/analytics/products?${query}`);
  },

  // 3. Products CRUD
  async getProducts(params: Record<string, any> = {}) {
    const query = new URLSearchParams(params).toString();
    return await apiRequest<{
      success: boolean;
      data: any[];
      products?: any[];
      pagination?: { page: number; limit: number; total: number; totalPages: number };
    }>(`/admin/products?limit=100&${query}`);
  },

  async getProductById(id: string) {
    return await apiRequest<{ success: boolean; data: any }>(`/admin/products/${id}`);
  },

  async createProduct(data: AdminProductPayload) {
    return await apiRequest<{ success: boolean; data: any }>('/admin/products', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateProduct(id: string, data: Partial<AdminProductPayload>) {
    return await apiRequest<{ success: boolean; data: any }>(`/admin/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deleteProduct(id: string) {
    return await apiRequest<{ success: boolean; message?: string }>(`/admin/products/${id}`, {
      method: 'DELETE',
    });
  },

  // 4. Categories CRUD
  async getCategories(params: Record<string, any> = {}) {
    const query = new URLSearchParams(params).toString();
    return await apiRequest<{ success: boolean; count?: number; data: any[] }>(
      `/admin/categories?${query}`
    );
  },

  async getCategoryById(id: string) {
    return await apiRequest<{ success: boolean; data: any }>(`/admin/categories/${id}`);
  },

  async createCategory(data: any) {
    return await apiRequest<{ success: boolean; data: any }>('/admin/categories', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateCategory(id: string, data: any) {
    return await apiRequest<{ success: boolean; data: any }>(`/admin/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deleteCategory(id: string) {
    return await apiRequest<{ success: boolean; message?: string }>(`/admin/categories/${id}`, {
      method: 'DELETE',
    });
  },

  // 5. Collections CRUD
  async getCollections(params: Record<string, any> = {}) {
    const query = new URLSearchParams(params).toString();
    return await apiRequest<{ success: boolean; count?: number; data: any[] }>(
      `/admin/collections?${query}`
    );
  },

  async getCollectionById(id: string) {
    return await apiRequest<{ success: boolean; data: any }>(`/admin/collections/${id}`);
  },

  async createCollection(data: any) {
    return await apiRequest<{ success: boolean; data: any }>('/admin/collections', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateCollection(id: string, data: any) {
    return await apiRequest<{ success: boolean; data: any }>(`/admin/collections/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deleteCollection(id: string) {
    return await apiRequest<{ success: boolean; message?: string }>(`/admin/collections/${id}`, {
      method: 'DELETE',
    });
  },

  // 6. Orders CRUD & Logistics
  async getOrders(params: Record<string, any> = {}) {
    const query = new URLSearchParams(params).toString();
    return await apiRequest<{
      success: boolean;
      data: any[];
      orders?: any[];
      total?: number;
      pagination?: { page: number; limit: number; total: number; totalPages: number };
    }>(`/admin/orders?${query}`);
  },

  async getOrderById(orderId: string) {
    return await apiRequest<{ success: boolean; data: any }>(`/admin/orders/${orderId}`);
  },

  async updateOrderStatus(
    orderId: string,
    status: string,
    trackingNumber?: string,
    carrier?: string
  ) {
    return await apiRequest<{ success: boolean; data: any }>(`/admin/orders/${orderId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, trackingNumber, carrier }),
    });
  },

  async createShipment(orderId: string, carrier?: string, service?: string) {
    return await apiRequest<{ success: boolean; data: any }>(`/admin/orders/${orderId}/shipment`, {
      method: 'POST',
      body: JSON.stringify({ carrier, service }),
    });
  },

  async refreshTracking(orderId: string) {
    return await apiRequest<{ success: boolean; data: any }>(
      `/admin/orders/${orderId}/tracking/refresh`,
      {
        method: 'POST',
      }
    );
  },

  async downloadInvoicePDF(orderId: string): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/admin/orders/${orderId}/invoice/download`, {
      headers: getAuthHeaders(),
    });

    if (res.status === 401) {
      clearAdminAuthSession();
      throw new Error('Session expired');
    }

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

  // 7. Customers Management
  async getCustomers(params: Record<string, any> = {}) {
    const query = new URLSearchParams(params).toString();
    return await apiRequest<{
      success: boolean;
      data: any[];
      customers?: any[];
      total?: number;
      pagination?: { page: number; limit: number; total: number; totalPages: number };
    }>(`/admin/customers?${query}`);
  },

  async getCustomerById(id: string) {
    return await apiRequest<{ success: boolean; data: any }>(`/admin/customers/${id}`);
  },

  async updateCustomerStatus(id: string, isActive: boolean) {
    return await apiRequest<{ success: boolean; data: any }>(`/admin/customers/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ isActive }),
    });
  },

  // 8. Inventory Management
  async getInventory(params: Record<string, any> = {}) {
    const query = new URLSearchParams(params).toString();
    return await apiRequest<{
      success: boolean;
      data: any[];
      pagination?: { page: number; limit: number; total: number; totalPages: number };
    }>(`/admin/inventory?${query}`);
  },

  async getLowStock(threshold = 5) {
    return await apiRequest<{
      success: boolean;
      count: number;
      threshold: number;
      data: any[];
    }>(`/admin/inventory/low-stock?threshold=${threshold}`);
  },

  async updateInventoryStock(productId: string, stock: number, lowStockThreshold?: number) {
    return await apiRequest<{ success: boolean; data: any }>(`/admin/inventory/${productId}`, {
      method: 'PATCH',
      body: JSON.stringify({ stock, lowStockThreshold }),
    });
  },

  // 9. Coupons CRUD
  async getCoupons(params: Record<string, any> = {}) {
    const query = new URLSearchParams(params).toString();
    return await apiRequest<{
      success: boolean;
      count?: number;
      data: any[];
    }>(`/admin/coupons?${query}`);
  },

  async getCouponById(id: string) {
    return await apiRequest<{ success: boolean; data: any }>(`/admin/coupons/${id}`);
  },

  async createCoupon(data: any) {
    return await apiRequest<{ success: boolean; data: any }>('/admin/coupons', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateCoupon(id: string, data: any) {
    return await apiRequest<{ success: boolean; data: any }>(`/admin/coupons/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deleteCoupon(id: string) {
    return await apiRequest<{ success: boolean; message?: string }>(`/admin/coupons/${id}`, {
      method: 'DELETE',
    });
  },

  // 10. Reviews Moderation
  async getReviews(params: Record<string, any> = {}) {
    const query = new URLSearchParams(params).toString();
    return await apiRequest<{
      success: boolean;
      count?: number;
      total?: number;
      data: any[];
    }>(`/admin/reviews?${query}`);
  },

  async getReviewById(id: string) {
    return await apiRequest<{ success: boolean; data: any }>(`/admin/reviews/${id}`);
  },

  async approveReview(id: string) {
    return await apiRequest<{ success: boolean; data: any }>(`/admin/reviews/${id}/approve`, {
      method: 'PATCH',
    });
  },

  async rejectReview(id: string, reason?: string) {
    return await apiRequest<{ success: boolean; data: any }>(`/admin/reviews/${id}/reject`, {
      method: 'PATCH',
      body: JSON.stringify({ reason }),
    });
  },

  async deleteReview(id: string) {
    return await apiRequest<{ success: boolean; message?: string }>(`/admin/reviews/${id}`, {
      method: 'DELETE',
    });
  },

  // 11. Banners Management
  async getBanners() {
    return await apiRequest<{
      success: boolean;
      data: any[];
    }>('/admin/banners');
  },

  async getBannerById(id: string) {
    return await apiRequest<{ success: boolean; data: any }>(`/admin/banners/${id}`);
  },

  async createBanner(data: any) {
    return await apiRequest<{ success: boolean; data: any }>('/admin/banners', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateBanner(id: string, data: any) {
    return await apiRequest<{ success: boolean; data: any }>(`/admin/banners/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deleteBanner(id: string) {
    return await apiRequest<{ success: boolean; message?: string }>(`/admin/banners/${id}`, {
      method: 'DELETE',
    });
  },

  // 12. Notifications Management
  async getNotifications() {
    return await apiRequest<{
      success: boolean;
      data: any[];
    }>('/admin/notifications');
  },

  async markNotificationRead(id: string) {
    return await apiRequest<{ success: boolean; data: any }>(`/admin/notifications/${id}/read`, {
      method: 'PATCH',
    });
  },

  async deleteNotification(id: string) {
    return await apiRequest<{ success: boolean; message?: string }>(
      `/admin/notifications/${id}`,
      {
        method: 'DELETE',
      }
    );
  },

  // 13. Returns & Exchanges
  async getReturns(params: Record<string, any> = {}) {
    const query = new URLSearchParams(params).toString();
    return await apiRequest<{
      success: boolean;
      data: any[];
    }>(`/admin/returns?${query}`);
  },

  async getReturnById(id: string) {
    return await apiRequest<{ success: boolean; data: any }>(`/admin/returns/${id}`);
  },

  async updateReturnStatus(id: string, status: string, notes?: string) {
    return await apiRequest<{ success: boolean; data: any }>(`/admin/returns/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, notes }),
    });
  },

  async approveReturn(id: string) {
    return await apiRequest<{ success: boolean; data: any }>(`/admin/returns/${id}/approve`, {
      method: 'PATCH',
    });
  },

  async rejectReturn(id: string, reason?: string) {
    return await apiRequest<{ success: boolean; data: any }>(`/admin/returns/${id}/reject`, {
      method: 'PATCH',
      body: JSON.stringify({ reason }),
    });
  },

  // 14. Brands Management
  async getBrands() {
    return await apiRequest<{
      success: boolean;
      data: any[];
    }>('/admin/brands');
  },

  async getBrandById(id: string) {
    return await apiRequest<{ success: boolean; data: any }>(`/admin/brands/${id}`);
  },

  async createBrand(data: any) {
    return await apiRequest<{ success: boolean; data: any }>('/admin/brands', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateBrand(id: string, data: any) {
    return await apiRequest<{ success: boolean; data: any }>(`/admin/brands/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deleteBrand(id: string) {
    return await apiRequest<{ success: boolean; message?: string }>(`/admin/brands/${id}`, {
      method: 'DELETE',
    });
  },

  // 15. Size Guides Management
  async getSizeGuides() {
    return await apiRequest<{
      success: boolean;
      data: any[];
    }>('/admin/size-guides');
  },

  async getSizeGuideById(id: string) {
    return await apiRequest<{ success: boolean; data: any }>(`/admin/size-guides/${id}`);
  },

  async createSizeGuide(data: any) {
    return await apiRequest<{ success: boolean; data: any }>('/admin/size-guides', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateSizeGuide(id: string, data: any) {
    return await apiRequest<{ success: boolean; data: any }>(`/admin/size-guides/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deleteSizeGuide(id: string) {
    return await apiRequest<{ success: boolean; message?: string }>(`/admin/size-guides/${id}`, {
      method: 'DELETE',
    });
  },

  // 16. Gift Cards Management
  async getGiftCards() {
    return await apiRequest<{
      success: boolean;
      data: any[];
    }>('/admin/gift-cards');
  },

  async getGiftCardById(id: string) {
    return await apiRequest<{ success: boolean; data: any }>(`/admin/gift-cards/${id}`);
  },

  async createGiftCard(data: any) {
    return await apiRequest<{ success: boolean; data: any }>('/admin/gift-cards', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateGiftCard(id: string, data: any) {
    return await apiRequest<{ success: boolean; data: any }>(`/admin/gift-cards/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deleteGiftCard(id: string) {
    return await apiRequest<{ success: boolean; message?: string }>(`/admin/gift-cards/${id}`, {
      method: 'DELETE',
    });
  },

  // 17. Website Content Management
  async getWebsiteContent() {
    return await apiRequest<{
      success: boolean;
      data: any[];
    }>('/admin/website-content');
  },

  async getWebsiteSectionById(id: string) {
    return await apiRequest<{ success: boolean; data: any }>(`/admin/website-content/${id}`);
  },

  async createWebsiteSection(data: any) {
    return await apiRequest<{ success: boolean; data: any }>('/admin/website-content', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateWebsiteSection(id: string, data: any) {
    return await apiRequest<{ success: boolean; data: any }>(`/admin/website-content/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deleteWebsiteSection(id: string) {
    return await apiRequest<{ success: boolean; message?: string }>(
      `/admin/website-content/${id}`,
      {
        method: 'DELETE',
      }
    );
  },

  // 18. Reports Management
  async getSalesReport(params: Record<string, any> = {}) {
    const query = new URLSearchParams(params).toString();
    return await apiRequest<{ success: boolean; data: any }>(`/admin/reports/sales?${query}`);
  },

  async getOrdersReport(params: Record<string, any> = {}) {
    const query = new URLSearchParams(params).toString();
    return await apiRequest<{ success: boolean; data: any }>(`/admin/reports/orders?${query}`);
  },

  async getCustomersReport(params: Record<string, any> = {}) {
    const query = new URLSearchParams(params).toString();
    return await apiRequest<{ success: boolean; data: any }>(`/admin/reports/customers?${query}`);
  },

  async getInventoryReport(params: Record<string, any> = {}) {
    const query = new URLSearchParams(params).toString();
    return await apiRequest<{ success: boolean; data: any }>(`/admin/reports/inventory?${query}`);
  },

  async getReturnsReport(params: Record<string, any> = {}) {
    const query = new URLSearchParams(params).toString();
    return await apiRequest<{ success: boolean; data: any }>(`/admin/reports/returns?${query}`);
  },

  // 19. Store Settings & Password Updates (Database Persisted)
  async getSettings() {
    return await apiRequest<{
      success: boolean;
      data: any;
    }>('/admin/settings');
  },

  async updateSettings(settings: any) {
    return await apiRequest<{
      success: boolean;
      data: any;
    }>('/admin/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
  },

  async changePassword(currentPassword: string, newPassword: string) {
    return await apiRequest<{
      success: boolean;
      message: string;
    }>('/admin/change-password', {
      method: 'PUT',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  },

  // 20. Cloudinary Product Image Uploads
  async uploadImage(
    file: File,
    folder = 'luxury_fashion/products'
  ): Promise<{ secure_url: string; public_id: string; url: string }> {
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

    if (res.status === 401) {
      clearAdminAuthSession();
      throw new Error('Session expired. Please log in again.');
    }

    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Image upload to Cloudinary failed');
    }

    return data.data || data;
  },

  async uploadImages(
    files: File[],
    folder = 'luxury_fashion/products'
  ): Promise<Array<{ secure_url: string; public_id: string; url: string }>> {
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

    if (res.status === 401) {
      clearAdminAuthSession();
      throw new Error('Session expired. Please log in again.');
    }

    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Multiple images upload failed');
    }

    return data.data;
  },

  async deleteImage(publicIdOrUrl: string): Promise<boolean> {
    const data = await apiRequest<{ success: boolean }>('/admin/upload/delete', {
      method: 'POST',
      body: JSON.stringify({ public_id: publicIdOrUrl, url: publicIdOrUrl }),
    });
    return data.success === true;
  },
};

export default adminService;
