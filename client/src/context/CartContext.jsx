import { createContext, useContext, useState, useEffect } from 'react';
import { cartAPI } from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

const createAuthError = () => {
  const error = new Error('Authentication required');
  error.code = 'AUTH_REQUIRED';
  return error;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated, loading: authLoading, logout } = useAuth();

  const fetchCart = async () => {
    if (authLoading || !isAuthenticated) {
      setCart(null);
      return null;
    }

    try {
      setLoading(true);
      const response = await cartAPI.get();
      setCart(response.data);
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        setCart(null);
        logout();
        throw createAuthError();
      }
      console.error('Failed to fetch cart:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1, color = null) => {
    if (!isAuthenticated) {
      throw createAuthError();
    }

    try {
      const response = await cartAPI.add(productId, quantity, color);
      setCart(response.data);
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        setCart(null);
        logout();
        throw createAuthError();
      }
      console.error('Failed to add to cart:', error);
      throw error;
    }
  };

  const removeFromCart = async (productId) => {
    if (!isAuthenticated) {
      throw createAuthError();
    }

    try {
      const response = await cartAPI.remove(productId);
      setCart(response.data);
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        setCart(null);
        logout();
        throw createAuthError();
      }
      console.error('Failed to remove from cart:', error);
      throw error;
    }
  };

  const updateCartItem = async (productId, quantity) => {
    if (!isAuthenticated) {
      throw createAuthError();
    }

    try {
      const response = await cartAPI.update(productId, quantity);
      setCart(response.data);
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        setCart(null);
        logout();
        throw createAuthError();
      }
      console.error('Failed to update cart:', error);
      throw error;
    }
  };

  const clearCart = () => {
    setCart(null);
  };

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (isAuthenticated) {
      fetchCart().catch(() => {});
    } else {
      clearCart();
    }
  }, [isAuthenticated, authLoading]);

  const value = {
    cart,
    loading,
    fetchCart,
    addToCart,
    removeFromCart,
    updateCartItem,
    clearCart,
    itemCount: cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0,
    total: cart?.total || 0
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
