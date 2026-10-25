import axiosClient from './axiosClient.js';

export const wishlistApi = {
  getWishlist: () => axiosClient.get('/wishlist'),
  toggleWishlist: (productId) => axiosClient.post(`/wishlist/toggle/${productId}`)
};
