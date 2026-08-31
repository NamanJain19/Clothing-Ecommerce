import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { cartService, BackendCart, AddCartPayload } from '../services/cartService';
import { useAuth } from './AuthContext';

export interface CartItem {
  id: string; // Cart line item ID (MongoDB _id when authenticated, or compound key when guest)
  productId: string;
  variantId?: string;
  name: string;
  image: string;
  price: number;
  size?: string;
  color?: string;
  quantity: number;
  categoryTag?: string;
}

export interface AddToCartInput {
  productId: string;
  variantId?: string;
  name: string;
  image: string;
  price: number;
  size?: string;
  color?: string;
  quantity?: number;
  categoryTag?: string;
}

interface CartContextType {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  isLoading: boolean;
  addToCart: (item: AddToCartInput) => Promise<void>;
  removeFromCart: (id: string) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  increaseQuantity: (id: string) => Promise<void>;
  decreaseQuantity: (id: string) => Promise<void>;
  clearCart: () => Promise<void>;
  isInCart: (productId: string, size?: string, color?: string) => boolean;
  refreshCart: () => Promise<void>;
}

const GUEST_CART_KEY = 'luxury_cart';

export const formatBackendCartItems = (backendCart: BackendCart): CartItem[] => {
  if (!backendCart || !Array.isArray(backendCart.items)) return [];
  return backendCart.items.map((item) => {
    const prod = typeof item.product === 'object' && item.product ? item.product : null;
    const productId = prod ? prod._id : String(item.product);
    const name = prod ? prod.name : 'Monolith Luxury Piece';
    const image = prod
      ? prod.images?.[0] || prod.thumbnail || ''
      : '';
    const categoryTag =
      prod && typeof prod.category === 'object' && prod.category
        ? prod.category.name
        : 'MONOLITH';

    return {
      id: item._id,
      productId,
      variantId: item.variantId,
      name,
      image,
      price: item.price,
      size: item.size || 'M',
      color: item.color || 'Standard',
      quantity: item.quantity,
      categoryTag,
    };
  });
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [subtotal, setSubtotal] = useState<number>(0);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const isSyncingRef = useRef(false);

  // Helper to calculate totals for guest cart
  const calculateGuestTotals = (cartItems: CartItem[]) => {
    const totalQty = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    const totalCost = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setTotalItems(totalQty);
    setSubtotal(totalCost);
  };

  // 1. Initial / Auth state change handling
  const syncAndLoadCart = useCallback(async () => {
    if (authLoading) return;

    if (isAuthenticated) {
      if (isSyncingRef.current) return;
      isSyncingRef.current = true;
      setIsLoading(true);

      try {
        // Check for local guest items to merge
        let localGuestItems: CartItem[] = [];
        try {
          const stored = localStorage.getItem(GUEST_CART_KEY);
          if (stored) {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed)) localGuestItems = parsed;
          }
        } catch (e) {
          console.warn('Error reading guest cart:', e);
        }

        // If local guest items exist with 24-char hex MongoDB IDs, merge them into server cart
        if (localGuestItems.length > 0) {
          for (const item of localGuestItems) {
            const isMongoId = /^[0-9a-fA-F]{24}$/.test(item.productId);
            if (isMongoId) {
              try {
                await cartService.addToCart({
                  productId: item.productId,
                  variantId: item.variantId && /^[0-9a-fA-F]{24}$/.test(item.variantId) ? item.variantId : undefined,
                  quantity: item.quantity,
                  size: item.size,
                  color: item.color,
                });
              } catch (err) {
                console.warn('Failed to merge guest item into server cart:', item.name, err);
              }
            }
          }
          // Clear local guest items after sync
          localStorage.removeItem(GUEST_CART_KEY);
        }

        // Fetch final authoritative server cart
        const serverCart = await cartService.getCart();
        const formatted = formatBackendCartItems(serverCart);
        setItems(formatted);
        setSubtotal(serverCart.subtotal || 0);
        setTotalItems(serverCart.totalItems || 0);
      } catch (err) {
        console.warn('Failed to fetch server cart, keeping existing state:', err);
      } finally {
        setIsLoading(false);
        isSyncingRef.current = false;
      }
    } else {
      // Guest User: Load from localStorage
      setIsLoading(true);
      try {
        const stored = localStorage.getItem(GUEST_CART_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            setItems(parsed);
            calculateGuestTotals(parsed);
          } else {
            setItems([]);
            calculateGuestTotals([]);
          }
        } else {
          setItems([]);
          calculateGuestTotals([]);
        }
      } catch (e) {
        console.warn('Failed to read guest cart from localStorage:', e);
        setItems([]);
        calculateGuestTotals([]);
      } finally {
        setIsLoading(false);
      }
    }
  }, [isAuthenticated, authLoading]);

  useEffect(() => {
    syncAndLoadCart();
  }, [syncAndLoadCart]);

  // Sync guest cart changes to localStorage
  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      try {
        localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
        calculateGuestTotals(items);
      } catch (e) {
        console.warn('Failed to save guest cart to localStorage:', e);
      }
    }
  }, [items, isAuthenticated, isLoading]);

  // Add To Cart
  const addToCart = async (input: AddToCartInput): Promise<void> => {
    const qty = Math.max(1, input.quantity || 1);
    const size = input.size || 'M';
    const color = input.color || 'Standard';
    const isMongoId = /^[0-9a-fA-F]{24}$/.test(input.productId);

    if (isAuthenticated && isMongoId) {
      setIsLoading(true);
      try {
        const payload: AddCartPayload = {
          productId: input.productId,
          variantId: input.variantId && /^[0-9a-fA-F]{24}$/.test(input.variantId) ? input.variantId : undefined,
          quantity: qty,
          size,
          color,
        };
        const updatedServerCart = await cartService.addToCart(payload);
        const formatted = formatBackendCartItems(updatedServerCart);
        setItems(formatted);
        setSubtotal(updatedServerCart.subtotal || 0);
        setTotalItems(updatedServerCart.totalItems || 0);
      } catch (err: any) {
        console.error('Failed to add item to server cart:', err);
        alert(err.message || 'Unable to add item to cart. Please check available stock.');
      } finally {
        setIsLoading(false);
      }
    } else {
      // Guest Cart Logic
      const guestId = `${input.productId}-${size}-${color}`.replace(/\s+/g, '-');
      setItems((prevItems) => {
        const existingIndex = prevItems.findIndex((item) => item.id === guestId);
        let updated: CartItem[];
        if (existingIndex > -1) {
          updated = [...prevItems];
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: updated[existingIndex].quantity + qty,
          };
        } else {
          const newItem: CartItem = {
            id: guestId,
            productId: input.productId,
            variantId: input.variantId,
            name: input.name,
            image: input.image,
            price: input.price,
            size,
            color,
            quantity: qty,
            categoryTag: input.categoryTag,
          };
          updated = [...prevItems, newItem];
        }
        calculateGuestTotals(updated);
        return updated;
      });
    }
  };

  // Remove item from cart
  const removeFromCart = async (id: string): Promise<void> => {
    if (isAuthenticated) {
      setIsLoading(true);
      try {
        const updatedServerCart = await cartService.removeCartItem(id);
        const formatted = formatBackendCartItems(updatedServerCart);
        setItems(formatted);
        setSubtotal(updatedServerCart.subtotal || 0);
        setTotalItems(updatedServerCart.totalItems || 0);
      } catch (err) {
        console.warn('Failed to remove cart item on backend:', err);
        // Optimistic removal fallback
        setItems((prev) => {
          const filtered = prev.filter((item) => item.id !== id);
          calculateGuestTotals(filtered);
          return filtered;
        });
      } finally {
        setIsLoading(false);
      }
    } else {
      setItems((prev) => {
        const filtered = prev.filter((item) => item.id !== id);
        calculateGuestTotals(filtered);
        return filtered;
      });
    }
  };

  // Update quantity directly
  const updateQuantity = async (id: string, quantity: number): Promise<void> => {
    if (quantity <= 0) {
      await removeFromCart(id);
      return;
    }

    if (isAuthenticated) {
      setIsLoading(true);
      try {
        const updatedServerCart = await cartService.updateCartItem(id, quantity);
        const formatted = formatBackendCartItems(updatedServerCart);
        setItems(formatted);
        setSubtotal(updatedServerCart.subtotal || 0);
        setTotalItems(updatedServerCart.totalItems || 0);
      } catch (err: any) {
        console.warn('Failed to update quantity on backend:', err);
        alert(err.message || 'Failed to update item quantity.');
      } finally {
        setIsLoading(false);
      }
    } else {
      setItems((prev) => {
        const updated = prev.map((item) => (item.id === id ? { ...item, quantity } : item));
        calculateGuestTotals(updated);
        return updated;
      });
    }
  };

  const increaseQuantity = async (id: string): Promise<void> => {
    const item = items.find((i) => i.id === id);
    if (!item) return;
    await updateQuantity(id, item.quantity + 1);
  };

  const decreaseQuantity = async (id: string): Promise<void> => {
    const item = items.find((i) => i.id === id);
    if (!item) return;
    await updateQuantity(id, item.quantity - 1);
  };

  const clearCart = async (): Promise<void> => {
    if (isAuthenticated) {
      setIsLoading(true);
      try {
        await cartService.clearCart();
        setItems([]);
        setSubtotal(0);
        setTotalItems(0);
      } catch (err) {
        console.warn('Failed to clear cart on backend:', err);
      } finally {
        setIsLoading(false);
      }
    } else {
      setItems([]);
      setSubtotal(0);
      setTotalItems(0);
      localStorage.removeItem(GUEST_CART_KEY);
    }
  };

  const isInCart = (productId: string, size?: string, color?: string): boolean => {
    return items.some((item) => {
      const matchProduct = item.productId === productId;
      const matchSize = !size || item.size === size;
      const matchColor = !color || item.color === color;
      return matchProduct && matchSize && matchColor;
    });
  };

  const refreshCart = async (): Promise<void> => {
    await syncAndLoadCart();
  };

  return (
    <CartContext.Provider
      value={{
        items,
        totalItems,
        subtotal,
        isLoading,
        addToCart,
        removeFromCart,
        updateQuantity,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        isInCart,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
