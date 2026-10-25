import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ShieldCheck, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';
import { EmptyState } from '../components/common/EmptyState.jsx';

export const Cart = () => {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    shippingPrice,
    taxPrice,
    totalPrice,
    itemCount
  } = useCart();
  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-20">
        <EmptyState
          title="Your Shopping Bag is Empty"
          description="You currently have no luxury handbags saved in your bag. Explore our collection to find your next statement piece."
          actionLabel="Explore The Collection"
          actionLink="/shop"
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-atelier-200 gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-super-wide text-atelier-gold font-semibold">
            Order Review
          </span>
          <h1 className="font-serif text-3xl text-atelier-950 font-normal mt-1">
            Your Shopping Bag ({itemCount} {itemCount === 1 ? 'item' : 'items'})
          </h1>
        </div>
        <button
          onClick={clearCart}
          className="text-xs text-atelier-500 hover:text-red-700 transition-colors uppercase tracking-wider"
        >
          Clear Entire Bag
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Cart Item Table */}
        <div className="lg:col-span-8 divide-y divide-atelier-200">
          {cartItems.map((item) => (
            <div key={item._id} className="py-6 flex flex-col sm:flex-row gap-6 items-start sm:items-center">
              <Link to={`/product/${item.slug || item._id}`} className="shrink-0">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-24 h-28 object-cover object-center bg-atelier-150 border border-atelier-200"
                />
              </Link>

              <div className="flex-1 min-w-0">
                <p className="text-[10px] uppercase tracking-widest text-atelier-500 mb-1">
                  {item.category}
                </p>
                <Link
                  to={`/product/${item.slug || item._id}`}
                  className="font-serif text-base font-normal text-atelier-950 hover:text-atelier-gold-dark transition-colors block mb-1 truncate"
                >
                  {item.name}
                </Link>
                <p className="text-sm font-semibold text-atelier-900 mb-4">
                  ${item.price.toFixed(2)}
                </p>

                <div className="flex items-center gap-4">
                  {/* Quantity Stepper */}
                  <div className="inline-flex items-center border border-atelier-300 bg-white">
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity - 1)}
                      className="p-1.5 hover:bg-atelier-100 text-atelier-700 transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-xs font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      className="p-1.5 hover:bg-atelier-100 text-atelier-700 transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="text-xs text-atelier-500 hover:text-red-700 flex items-center gap-1 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove</span>
                  </button>
                </div>
              </div>

              <div className="text-right sm:self-center">
                <span className="font-serif text-lg font-bold text-atelier-950">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            </div>
          ))}

          <div className="pt-6">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-luxury text-atelier-800 hover:text-atelier-950 transition-colors font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Continue Shopping</span>
            </Link>
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-4 bg-atelier-100/70 p-6 sm:p-8 border border-atelier-200 space-y-6">
          <h3 className="font-serif text-lg uppercase tracking-wide text-atelier-950 font-normal">
            Summary
          </h3>

          <div className="space-y-3 divide-y divide-atelier-200 text-xs">
            <div className="flex justify-between pb-2 text-atelier-700">
              <span>Subtotal</span>
              <span className="font-semibold text-atelier-950">${subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between py-2 text-atelier-700">
              <span>Estimated Shipping</span>
              <span>
                {shippingPrice === 0 ? (
                  <strong className="text-emerald-800 uppercase tracking-wider font-semibold">
                    Complimentary
                  </strong>
                ) : (
                  `$${shippingPrice.toFixed(2)}`
                )}
              </span>
            </div>

            <div className="flex justify-between py-2 text-atelier-700">
              <span>Estimated Tax (8.5%)</span>
              <span className="font-semibold text-atelier-950">${taxPrice.toFixed(2)}</span>
            </div>

            <div className="flex justify-between pt-4 text-base">
              <span className="font-serif font-medium text-atelier-950">Estimated Total</span>
              <span className="font-serif font-bold text-atelier-950 text-xl">
                ${totalPrice.toFixed(2)}
              </span>
            </div>
          </div>

          <button
            onClick={() => navigate('/checkout')}
            className="w-full py-4 bg-atelier-950 text-white text-xs uppercase tracking-luxury font-medium hover:bg-atelier-800 transition-colors flex items-center justify-center gap-2 shadow-lg"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 text-[11px] text-atelier-600 justify-center">
            <ShieldCheck className="w-4 h-4 text-atelier-gold" />
            <span>Guaranteed Secure & Encrypted Checkout</span>
          </div>
        </div>
      </div>
    </div>
  );
};
