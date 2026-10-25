import axiosClient from './axiosClient.js';

export const orderApi = {
  createOrder: (orderData) => axiosClient.post('/orders', orderData),
  validateCart: (items) => axiosClient.post('/orders/validate-cart', { items }),
  getMyOrders: () => axiosClient.get('/orders/my-orders'),
  getOrderById: (id) => axiosClient.get(`/orders/${id}`)
};
