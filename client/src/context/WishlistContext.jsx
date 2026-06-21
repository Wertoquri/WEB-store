import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { wishlistAPI } from '../services/api';
import { useAuth } from './AuthContext';

const WishlistContext = createContext(null);
const WISHLIST_STORAGE_KEY = 'wishlist';

const readStoredWishlist = () => {
  try {
    const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const writeStoredWishlist = (items) => {
  localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items));
};

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated, loading: authLoading } = useAuth();

  // Fetch wishlist from backend if authenticated
  const fetchWishlist = useCallback(async () => {
    if (authLoading) {
      return [];
    }

    if (!isAuthenticated) {
      const storedWishlist = readStoredWishlist();
      setWishlist(storedWishlist);
      return storedWishlist;
    }

    setLoading(true);
    try {
      const response = await wishlistAPI.get();
      const products = response.data.products || [];
      setWishlist(products);
      return products;
    } catch (error) {
      console.error('Failed to fetch wishlist:', error);
      // Fallback to localStorage if backend fails
      const storedWishlist = readStoredWishlist();
      setWishlist(storedWishlist);
      return storedWishlist;
    } finally {
      setLoading(false);
    }
  }, [authLoading, isAuthenticated]);

  const syncWishlist = useCallback(async (productIds) => {
    if (!isAuthenticated) return [];

    setLoading(true);
    try {
      const idsToSync = Array.isArray(productIds)
        ? productIds
        : readStoredWishlist().map((product) => product.id);

      const response = await wishlistAPI.sync(idsToSync);
      const products = response.data.products || [];
      setWishlist(products);
      localStorage.removeItem(WISHLIST_STORAGE_KEY);
      return products;
    } catch (error) {
      console.error('Failed to sync wishlist:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Load wishlist on mount
  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (isAuthenticated) {
      const localWishlist = readStoredWishlist();
      if (localWishlist.length > 0) {
        syncWishlist(localWishlist.map((product) => product.id)).catch(() => {
          fetchWishlist().catch(() => {});
        });
      } else {
        fetchWishlist().catch(() => {});
      }
    } else {
      setWishlist(readStoredWishlist());
    }
  }, [authLoading, isAuthenticated, fetchWishlist, syncWishlist]);

  const addToWishlist = async (product) => {
    if (wishlist.some((item) => item.id === product.id)) {
      return wishlist;
    }

    setLoading(true);
    try {
      if (isAuthenticated) {
        const response = await wishlistAPI.add(product.id);
        const products = response.data.products || [];
        setWishlist(products);
        return products;
      } else {
        const newWishlist = [...wishlist, product];
        setWishlist(newWishlist);
        writeStoredWishlist(newWishlist);
        return newWishlist;
      }
    } catch (error) {
      console.error('Failed to add to wishlist:', error);

      if (isAuthenticated && error.response?.status === 400) {
        return fetchWishlist();
      }

      // Fallback to localStorage
      const newWishlist = [...wishlist, product];
      setWishlist(newWishlist);
      writeStoredWishlist(newWishlist);
      return newWishlist;
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId) => {
    setLoading(true);
    try {
      if (isAuthenticated) {
        const response = await wishlistAPI.remove(productId);
        const products = response.data.products || [];
        setWishlist(products);
        return products;
      } else {
        const newWishlist = wishlist.filter(p => p.id !== productId);
        setWishlist(newWishlist);
        writeStoredWishlist(newWishlist);
        return newWishlist;
      }
    } catch (error) {
      console.error('Failed to remove from wishlist:', error);
      // Fallback to localStorage
      const newWishlist = wishlist.filter(p => p.id !== productId);
      setWishlist(newWishlist);
      writeStoredWishlist(newWishlist);
      return newWishlist;
    } finally {
      setLoading(false);
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.some(p => p.id === productId);
  };

  const value = {
    wishlist,
    loading,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    syncWishlist,
    fetchWishlist,
    count: wishlist.length
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
