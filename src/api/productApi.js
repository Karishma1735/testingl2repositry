import axiosClient from './axiosClient.js';

export const productApi = {
  getProducts: (params = {}) => axiosClient.get('/products', { params }),
  getFeatured: () => axiosClient.get('/products/featured'),
  getProduct: (idOrSlug) => axiosClient.get(`/products/${idOrSlug}`),
  getCategories: () => axiosClient.get('/products/categories'),
  
  // Admin actions
  createProduct: (data) => axiosClient.post('/products', data),
  updateProduct: (id, data) => axiosClient.put(`/products/${id}`, data),
  deleteProduct: (id) => axiosClient.delete(`/products/${id}`)
};
