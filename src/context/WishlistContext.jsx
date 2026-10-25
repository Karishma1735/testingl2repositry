import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext.jsx';
import { useToast } from './ToastContext.jsx';
import { wishlistApi } from '../api/wishlistApi.js';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const { success, info } = useToast();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load wishlist from backend if authenticated, or localStorage if guest
  useEffect(() => {
    const fetchWishlist = async () => {
      if (isAuthenticated) {
        try {
          setLoading(true);
          const res = await wishlistApi.getWishlist();
          if (res.success) {
            setWishlistItems(res.wishlist || []);
          }
        } catch (err) {
          console.error('Failed to load user wishlist', err);
        } finally {
          setLoading(false);
        }
      } else {
        // Load guest wishlist
        try {
          const guestList = localStorage.getItem('atelier_guest_wishlist');
          setWishlistItems(guestList ? JSON.parse(guestList) : []);
        } catch {
          setWishlistItems([]);
        }
      }
    };

    fetchWishlist();
  }, [isAuthenticated]);

  const toggleWishlist = async (product) => {
    const productId = product._id;
    const isCurrentlyWishlisted = wishlistItems.some(
      (item) => (item._id || item) === productId
    );

    if (isAuthenticated) {
      try {
        const res = await wishlistApi.toggleWishlist(productId);
        if (res.success) {
          if (res.isWishlisted) {
            setWishlistItems((prev) => [...prev, product]);
            success(`Saved "${product.name}" to your wishlist.`);
          } else {
            setWishlistItems((prev) =>
              prev.filter((item) => (item._id || item) !== productId)
            );
            info(`Removed "${product.name}" from your wishlist.`);
          }
        }
      } catch (err) {
        console.error('Failed to toggle wishlist item', err);
      }
    } else {
      // Guest local management
      if (isCurrentlyWishlisted) {
        const updated = wishlistItems.filter((i) => (i._id || i) !== productId);
        setWishlistItems(updated);
        localStorage.setItem('atelier_guest_wishlist', JSON.stringify(updated));
        info(`Removed "${product.name}" from your wishlist.`);
      } else {
        const updated = [...wishlistItems, product];
        setWishlistItems(updated);
        localStorage.setItem('atelier_guest_wishlist', JSON.stringify(updated));
        success(`Saved "${product.name}" to your wishlist.`);
      }
    }
  };

  const isWishlisted = (productId) => {
    return wishlistItems.some((item) => (item._id || item) === productId);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        wishlistCount: wishlistItems.length,
        loading,
        toggleWishlist,
        isWishlisted
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
