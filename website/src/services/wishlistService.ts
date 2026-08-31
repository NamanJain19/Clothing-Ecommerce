import { apiRequest } from './api';
import { BackendProduct } from '../types/product';

export const wishlistService = {
  /**
   * Get user's wishlist (GET /api/wishlist)
   */
  getWishlist: async (): Promise<BackendProduct[]> => {
    const res = await apiRequest<{ data: BackendProduct[]; count: number }>('/wishlist', {
      method: 'GET',
    });
    return (res as any).data || [];
  },

  /**
   * Add a product to wishlist (POST /api/wishlist/:productId)
   */
  addToWishlist: async (productId: string): Promise<BackendProduct[]> => {
    const res = await apiRequest<{ data: BackendProduct[]; count: number }>(`/wishlist/${productId}`, {
      method: 'POST',
    });
    return (res as any).data || [];
  },

  /**
   * Remove a product from wishlist (DELETE /api/wishlist/:productId)
   */
  removeFromWishlist: async (productId: string): Promise<BackendProduct[]> => {
    const res = await apiRequest<{ data: BackendProduct[]; count: number }>(`/wishlist/${productId}`, {
      method: 'DELETE',
    });
    return (res as any).data || [];
  },

  /**
   * Clear entire wishlist (DELETE /api/wishlist)
   */
  clearWishlist: async (): Promise<void> => {
    await apiRequest('/wishlist', {
      method: 'DELETE',
    });
  },
};
