import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { wishlistService } from '../services/wishlistService';
import { BackendProduct } from '../types/product';
import { useAuth } from './AuthContext';

export interface WishlistItem {
  id: string;
  name: string;
  specs?: string;
  category?: string;
  price: number;
  image: string;
  hoverImage?: string;
}

interface WishlistContextType {
  wishlistItems: WishlistItem[];
  wishlistCount: number;
  isLoading: boolean;
  addToWishlist: (item: WishlistItem) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  toggleWishlist: (item: WishlistItem) => Promise<void>;
  clearWishlist: () => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  refreshWishlist: () => Promise<void>;
}

const GUEST_WISHLIST_KEY = 'luxury_wishlist';

export const formatBackendWishlistItems = (products: BackendProduct[]): WishlistItem[] => {
  if (!products || !Array.isArray(products)) return [];
  return products.map((p) => ({
    id: p._id || p.id || p.slug,
    name: p.name,
    specs: typeof p.category === 'object' && p.category ? p.category.name : (p.brand || 'MONOLITH'),
    category: typeof p.category === 'object' && p.category ? p.category.name : 'MONOLITH',
    price: p.price,
    image: p.images?.[0] || p.thumbnail || '',
    hoverImage: p.images?.[1] || p.images?.[0] || '',
  }));
};

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const isSyncingRef = useRef(false);

  // Sync and load wishlist
  const syncAndLoadWishlist = useCallback(async () => {
    if (authLoading) return;

    if (isAuthenticated) {
      if (isSyncingRef.current) return;
      isSyncingRef.current = true;
      setIsLoading(true);

      try {
        // Check for local guest items to merge
        let localGuestItems: WishlistItem[] = [];
        try {
          const stored = localStorage.getItem(GUEST_WISHLIST_KEY);
          if (stored) {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed)) localGuestItems = parsed;
          }
        } catch (e) {
          console.warn('Error reading guest wishlist:', e);
        }

        // If local guest items exist with 24-char hex MongoDB IDs, merge them
        if (localGuestItems.length > 0) {
          for (const item of localGuestItems) {
            const isMongoId = /^[0-9a-fA-F]{24}$/.test(item.id);
            if (isMongoId) {
              try {
                await wishlistService.addToWishlist(item.id);
              } catch (err) {
                // Ignore if already in wishlist
              }
            }
          }
          localStorage.removeItem(GUEST_WISHLIST_KEY);
        }

        // Fetch authoritative server wishlist
        const serverProducts = await wishlistService.getWishlist();
        const formatted = formatBackendWishlistItems(serverProducts);
        setWishlistItems(formatted);
      } catch (err) {
        console.warn('Failed to fetch server wishlist:', err);
      } finally {
        setIsLoading(false);
        isSyncingRef.current = false;
      }
    } else {
      // Guest User: Load from localStorage
      setIsLoading(true);
      try {
        const stored = localStorage.getItem(GUEST_WISHLIST_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            setWishlistItems(parsed);
          } else {
            setWishlistItems([]);
          }
        } else {
          setWishlistItems([]);
        }
      } catch (e) {
        console.warn('Failed to read guest wishlist from localStorage:', e);
        setWishlistItems([]);
      } finally {
        setIsLoading(false);
      }
    }
  }, [isAuthenticated, authLoading]);

  useEffect(() => {
    syncAndLoadWishlist();
  }, [syncAndLoadWishlist]);

  // Sync guest wishlist changes to localStorage
  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      try {
        localStorage.setItem(GUEST_WISHLIST_KEY, JSON.stringify(wishlistItems));
      } catch (e) {
        console.warn('Failed to save guest wishlist to localStorage:', e);
      }
    }
  }, [wishlistItems, isAuthenticated, isLoading]);

  const addToWishlist = async (item: WishlistItem): Promise<void> => {
    const isMongoId = /^[0-9a-fA-F]{24}$/.test(item.id);

    if (isAuthenticated && isMongoId) {
      try {
        const updated = await wishlistService.addToWishlist(item.id);
        const formatted = formatBackendWishlistItems(updated);
        setWishlistItems(formatted);
      } catch (err: any) {
        console.warn('Failed to add to server wishlist:', err);
      }
    } else {
      setWishlistItems((prev) => {
        if (prev.some((w) => w.id === item.id)) return prev;
        return [...prev, item];
      });
    }
  };

  const removeFromWishlist = async (productId: string): Promise<void> => {
    const isMongoId = /^[0-9a-fA-F]{24}$/.test(productId);

    if (isAuthenticated && isMongoId) {
      try {
        const updated = await wishlistService.removeFromWishlist(productId);
        const formatted = formatBackendWishlistItems(updated);
        setWishlistItems(formatted);
      } catch (err) {
        console.warn('Failed to remove from server wishlist:', err);
        setWishlistItems((prev) => prev.filter((w) => w.id !== productId));
      }
    } else {
      setWishlistItems((prev) => prev.filter((w) => w.id !== productId));
    }
  };

  const toggleWishlist = async (item: WishlistItem): Promise<void> => {
    const exists = wishlistItems.some((w) => w.id === item.id);
    if (exists) {
      await removeFromWishlist(item.id);
    } else {
      await addToWishlist(item);
    }
  };

  const clearWishlist = async (): Promise<void> => {
    if (isAuthenticated) {
      try {
        await wishlistService.clearWishlist();
        setWishlistItems([]);
      } catch (err) {
        console.warn('Failed to clear server wishlist:', err);
      }
    } else {
      setWishlistItems([]);
      localStorage.removeItem(GUEST_WISHLIST_KEY);
    }
  };

  const isInWishlist = (productId: string): boolean => {
    return wishlistItems.some((w) => w.id === productId);
  };

  const refreshWishlist = async (): Promise<void> => {
    await syncAndLoadWishlist();
  };

  const wishlistCount = wishlistItems.length;

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        wishlistCount,
        isLoading,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        clearWishlist,
        isInWishlist,
        refreshWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = (): WishlistContextType => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
