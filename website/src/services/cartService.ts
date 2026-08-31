import { apiRequest } from './api';

export interface BackendCartItem {
  _id: string;
  product: {
    _id: string;
    name: string;
    slug?: string;
    price: number;
    compareAtPrice?: number;
    thumbnail?: string;
    images?: string[];
    stock?: number;
    isActive?: boolean;
    category?: { _id: string; name: string; slug: string } | string;
    variants?: any[];
  } | string;
  variantId?: string;
  quantity: number;
  price: number;
  size?: string;
  color?: string;
}

export interface BackendCart {
  _id?: string;
  user?: string;
  items: BackendCartItem[];
  subtotal: number;
  totalItems: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface AddCartPayload {
  productId: string;
  variantId?: string;
  quantity?: number;
  size?: string;
  color?: string;
}

export const cartService = {
  /**
   * Get current authenticated user's cart (GET /api/cart)
   */
  getCart: async (): Promise<BackendCart> => {
    const res = await apiRequest<{ cart: BackendCart }>('/cart', {
      method: 'GET',
    });
    return (res as any).cart || { items: [], subtotal: 0, totalItems: 0 };
  },

  /**
   * Add a product or variant to cart (POST /api/cart)
   */
  addToCart: async (payload: AddCartPayload): Promise<BackendCart> => {
    const res = await apiRequest<{ cart: BackendCart }>('/cart', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return (res as any).cart;
  },

  /**
   * Update cart item quantity (PUT /api/cart/items/:itemId)
   */
  updateCartItem: async (itemId: string, quantity: number): Promise<BackendCart> => {
    const res = await apiRequest<{ cart: BackendCart }>(`/cart/items/${itemId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    });
    return (res as any).cart;
  },

  /**
   * Remove item from cart (DELETE /api/cart/items/:itemId)
   */
  removeCartItem: async (itemId: string): Promise<BackendCart> => {
    const res = await apiRequest<{ cart: BackendCart }>(`/cart/items/${itemId}`, {
      method: 'DELETE',
    });
    return (res as any).cart;
  },

  /**
   * Clear user's entire cart (DELETE /api/cart)
   */
  clearCart: async (): Promise<void> => {
    await apiRequest('/cart', {
      method: 'DELETE',
    });
  },
};
