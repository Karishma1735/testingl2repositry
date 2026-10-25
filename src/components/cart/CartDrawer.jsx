import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Plus, Minus, Trash2, ArrowRight, ShieldCheck } from 'lucide-react';
import { useCart } from '../../context/CartContext.jsx';

export const CartDrawer = () => {
  const {
    cartItems,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
    subtotal,
    itemCount
  } = useCart();
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const freeShippingThreshold = 250;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const progressPercent = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  const handleCheckoutClick = () => {
    closeCart();
    navigate('/checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-atelier-50 text-atelier-900 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="px-6 py-5 border-b border-atelier-200 flex items-center justify-between">
            <div>
              <h2 className="font-serif text-lg tracking-wide uppercase text-atelier-950">
                Shopping Bag
              </h2>
              <span className="text-xs text-atelier-500 uppercase tracking-wider">
                {itemCount} {itemCount === 1 ? 'Item' : 'Items'}
              </span>
            </div>
            <button
              onClick={closeCart}
              className="p-1.5 text-atelier-500 hover:text-atelier-950 transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Complimentary Shipping Tracker */}
          <div className="bg-atelier-100/70 px-6 py-3 border-b border-atelier-200">
            <div className="flex justify-between text-xs mb-1.5">
              {remainingForFreeShipping > 0 ? (
                <span>
                  Add <strong className="text-atelier-950 font-medium">${remainingForFreeShipping.toFixed(2)}</strong> more for complimentary delivery
                </span>
              ) : (
                <span className="text-emerald-800 font-medium flex items-center gap-1">
                  ✨ You have unlocked complimentary delivery
                </span>
              )}
            </div>
            <div className="w-full bg-atelier-200 h-1.5 overflow-hidden rounded-full">
              <div
                className="bg-atelier-gold h-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Item List */}
          <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-atelier-150">
            {cartItems.length === 0 ? (
              <div className="py-20 text-center">
                <p className="font-serif text-xl text-atelier-950 mb-2">
                  Your bag is empty
                </p>
                <p className="text-xs text-atelier-500 mb-6">
                  Select a purse to begin your collection.
                </p>
                <button
                  onClick={closeCart}
                  className="px-6 py-2.5 bg-atelier-950 text-white text-xs uppercase tracking-luxury hover:bg-atelier-800 transition-colors"
                >
                  Explore Catalog
                </button>
              </div>
            ) : (
              cartItems.map((item) => (
                <div key={item._id} className="py-4 flex gap-4 items-center">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-24 object-cover object-center bg-atelier-150 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] uppercase tracking-wider text-atelier-500 mb-0.5">
                      {item.category}
                    </p>
                    <h4 className="text-sm font-medium text-atelier-950 truncate mb-1">
                      {item.name}
                    </h4>
                    <p className="text-xs font-semibold text-atelier-900 mb-2">
                      ${item.price.toFixed(2)}
                    </p>

                    <div className="flex items-center gap-3">
                      <div className="inline-flex items-center border border-atelier-300">
                        <button
                          onClick={() => updateQuantity(item._id, item.quantity - 1)}
                          className="p-1 hover:bg-atelier-200 text-atelier-600 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 text-xs font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item._id, item.quantity + 1)}
                          className="p-1 hover:bg-atelier-200 text-atelier-600 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item._id)}
                        className="text-atelier-400 hover:text-red-700 transition-colors text-xs flex items-center gap-1"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {cartItems.length > 0 && (
            <div className="p-6 border-t border-atelier-200 bg-atelier-50/90 space-y-4">
              <div className="flex justify-between items-baseline text-sm">
                <span className="text-atelier-600 uppercase tracking-wider text-xs">
                  Estimated Subtotal
                </span>
                <span className="font-serif text-lg font-bold text-atelier-950">
                  ${subtotal.toFixed(2)}
                </span>
              </div>
              <p className="text-[11px] text-atelier-500 leading-normal">
                Taxes, customs & final shipping calculated at checkout.
              </p>

              <button
                onClick={handleCheckoutClick}
                className="w-full py-4 bg-atelier-950 text-white uppercase text-xs tracking-luxury font-medium hover:bg-atelier-800 transition-colors flex items-center justify-center gap-2"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-atelier-500 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-atelier-gold" />
                <span>Complimentary returns within 30 days</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
