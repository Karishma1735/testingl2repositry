import axiosClient from './axiosClient.js';

export const adminApi = {
  getMetrics: () => axiosClient.get('/admin/metrics'),
  getOrders: (params = {}) => axiosClient.get('/admin/orders', { params }),
  updateOrderStatus: (id, status) => axiosClient.put(`/admin/orders/${id}/status`, { status }),
  getCustomers: (params = {}) => axiosClient.get('/admin/customers', { params })
};
