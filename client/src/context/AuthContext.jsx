import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);
const AUTH_BLOCKED_KEY = 'webstore.authBlocked';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const authEpoch = useRef(0);

  const clearAuthData = () => {
    authEpoch.current += 1;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.setItem(AUTH_BLOCKED_KEY, 'true');
    setUser(null);
  };

  useEffect(() => {
    if (sessionStorage.getItem(AUTH_BLOCKED_KEY) === 'true') {
      setLoading(false);
      return;
    }

    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
        fetchProfile();
      } catch {
        clearAuthData();
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const handleStorage = (event) => {
      if (
        event.storageArea === localStorage &&
        (event.key === null || event.key === 'token')
      ) {
        // A login, logout, or password-change token rotation in another tab
        // must not leave this tab displaying the previous account's data or
        // attaching the new account's token to requests from this tab.
        authEpoch.current += 1;
        sessionStorage.setItem(AUTH_BLOCKED_KEY, 'true');
        setUser(null);
        setLoading(false);
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const fetchProfile = async () => {
    const epoch = authEpoch.current;
    try {
      const response = await authAPI.getProfile();
      if (epoch !== authEpoch.current || sessionStorage.getItem(AUTH_BLOCKED_KEY) === 'true') {
        return;
      }
      setUser(response.data);
      localStorage.setItem('user', JSON.stringify(response.data));
    } catch (error) {
      if (epoch !== authEpoch.current) {
        return;
      }
      if (error.response?.status === 401) {
        clearAuthData();
      } else {
        console.error('Failed to fetch profile:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  const login = (userData, token) => {
    authEpoch.current += 1;
    sessionStorage.removeItem(AUTH_BLOCKED_KEY);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    clearAuthData();
  };

  const updateUserData = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const value = {
    user,
    loading,
    login,
    logout,
    updateUserData,
    fetchProfile,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin'
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
