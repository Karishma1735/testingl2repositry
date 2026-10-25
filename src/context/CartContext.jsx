import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext.jsx';
import { orderApi } from '../api/orderApi.js';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { success, error } = useToast();
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('atelier_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isValidating, setIsValidating] = useState(false);

  // Sync with localStorage
  useEffect(() => {
    try {
      localStorage.setItem('atelier_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.error('Failed to sync cart to localStorage', e);
    }
  }, [cartItems]);

  const addToCart = (product, quantity = 1) => {
    const qty = Math.max(1, parseInt(quantity, 10));

    setCartItems((prevItems) => {
      const existing = prevItems.find((item) => item._id === product._id);

      if (existing) {
        const newQty = existing.quantity + qty;
        if (newQty > product.countInStock) {
          error(`Only ${product.countInStock} items currently available in stock.`);
          return prevItems;
        }
        success(`Updated quantity for "${product.name}" in your bag.`);
        return prevItems.map((item) =>
          item._id === product._id ? { ...item, quantity: newQty } : item
        );
      } else {
        if (qty > product.countInStock) {
          error(`Only ${product.countInStock} items currently available in stock.`);
          return prevItems;
        }
        success(`Added "${product.name}" to your shopping bag.`);
        return [
          ...prevItems,
          {
            _id: product._id,
            name: product.name,
            slug: product.slug,
            category: product.category,
            price: product.price,
            image: product.images[0],
            countInStock: product.countInStock,
            quantity: qty
          }
        ];
      }
    });

    setIsCartOpen(true);
  };

  const updateQuantity = (productId, quantity) => {
    const qty = parseInt(quantity, 10);
    if (qty <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems((prev) =>
      prev.map((item) => {
        if (item._id === productId) {
          if (qty > item.countInStock) {
            error(`Maximum available stock reached (${item.countInStock}).`);
            return item;
          }
          return { ...item, quantity: qty };
        }
        return item;
      })
    );
  };

  const removeFromCart = (productId) => {
    setCartItems((prev) => {
      const target = prev.find((i) => i._id === productId);
      if (target) {
        success(`Removed "${target.name}" from shopping bag.`);
      }
      return prev.filter((item) => item._id !== productId);
    });
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('atelier_cart');
  };

  const validateCartItems = async () => {
    if (cartItems.length === 0) return null;
    try {
      setIsValidating(true);
      const res = await orderApi.validateCart(
        cartItems.map((item) => ({ productId: item._id, quantity: item.quantity }))
      );
      if (res.success && res.items) {
        // Synchronize updated prices or inventory availability
        setCartItems(res.items);
      }
      return res;
    } catch (err) {
      console.error('Cart validation error', err);
      return null;
    } finally {
      setIsValidating(false);
    }
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const toggleCart = () => setIsCartOpen((prev) => !prev);

  // Totals calculations
  const itemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = Math.round(
    cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0) * 100
  ) / 100;
  const shippingPrice = subtotal >= 250 || subtotal === 0 ? 0 : 25;
  const taxPrice = Math.round(subtotal * 0.085 * 100) / 100;
  const totalPrice = Math.round((subtotal + shippingPrice + taxPrice) * 100) / 100;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        itemCount,
        subtotal,
        shippingPrice,
        taxPrice,
        totalPrice,
        isCartOpen,
        isValidating,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        validateCartItems,
        openCart,
        closeCart,
        toggleCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
