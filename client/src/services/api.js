import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (email, password) => api.post('/auth/login', { email, password }),
  googleAuth: (token) => api.post('/auth/google', { token }),
  facebookAuth: (accessToken) => api.post('/auth/facebook', { accessToken }),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.post('/auth/change-password', data)
};

export const productsAPI = {
  getAll: (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.category) queryParams.append('category', params.category);
    if (params.search) queryParams.append('search', params.search);
    if (params.sort) queryParams.append('sort', params.sort);
    const url = queryParams.toString() ? `/products?${queryParams}` : '/products';
    return api.get(url);
  },
  getMine: () => api.get('/products/mine'),
  getById: (id) => api.get(`/products/${id}`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
  createWithFile: (formData) => {
    return api.post('/products', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  updateWithFile: (id, formData) => {
    return api.put(`/products/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }
};

export const ordersAPI = {
  create: (items) => api.post('/orders', { items }),
  getAll: () => api.get('/orders'),
  getById: (id) => api.get(`/orders/${id}`),
  getAllForAdmin: () => api.get('/orders/admin/all'),
  updateStatus: (id, status) => api.put(`/orders/${id}/status`, { status })
};

export const cartAPI = {
  get: () => api.get('/cart'),
  add: (productId, quantity = 1, color = null) => api.post('/cart/add', { productId, quantity, color }),
  remove: (productId) => api.delete(`/cart/remove/${productId}`),
  update: (productId, quantity) => api.put(`/cart/update/${productId}`, { quantity })
};

export const reviewsAPI = {
  getProductReviews: (productId) => api.get(`/reviews/product/${productId}`),
  createReview: (data) => api.post('/reviews', data, data instanceof FormData ? {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  } : undefined),
  replyToReview: (id, data) => api.put(`/reviews/${id}/reply`, data),
  updateReview: (id, data) => api.put(`/reviews/${id}`, data),
  deleteReview: (id) => api.delete(`/reviews/${id}`)
};

export const wishlistAPI = {
  get: () => api.get('/wishlist'),
  add: (productId) => api.post(`/wishlist/${productId}`),
  remove: (productId) => api.delete(`/wishlist/${productId}`),
  sync: (productIds) => api.post('/wishlist/sync', { productIds })
};

export const messagesAPI = {
  getAll: () => api.get('/messages'),
  markAsRead: (id) => api.put(`/messages/${id}/read`)
};

export default api;
