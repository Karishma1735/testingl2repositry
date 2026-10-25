import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  CreditCard,
  ShieldCheck,
  Lock,
  ArrowRight,
  AlertCircle,
  Truck,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { orderApi } from '../api/orderApi.js';

export const Checkout = () => {
  const { user, isAuthenticated } = useAuth();
  const { cartItems, clearCart, validateCartItems } = useCart();
  const { error: toastError, success: toastSuccess } = useToast();
  const navigate = useNavigate();

  // Shipping details state
  const [shippingAddress, setShippingAddress] = useState({
    street: user?.shippingAddress?.street || '',
    city: user?.shippingAddress?.city || '',
    state: user?.shippingAddress?.state || '',
    postalCode: user?.shippingAddress?.postalCode || '',
    country: user?.shippingAddress?.country || 'United States',
    phone: user?.shippingAddress?.phone || ''
  });

  // Mock payment details state (for simulation UI)
  const [cardData, setCardData] = useState({
    cardholderName: user?.name || '',
    cardNumber: '4242 •••• •••• 4242',
    expiry: '12/28',
    cvv: '888'
  });

  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [orderTotals, setOrderTotals] = useState({
    itemsPrice: 0,
    shippingPrice: 0,
    taxPrice: 0,
    totalPrice: 0
  });

  // Verify cart & fetch official server-side pricing on mount
  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart');
      return;
    }

    const checkPricing = async () => {
      try {
        const res = await validateCartItems();
        if (res && res.totals) {
          setOrderTotals(res.totals);
          if (res.hasStockIssue) {
            setValidationError('Some items in your cart exceed current available inventory.');
          }
        }
      } catch (err) {
        console.error('Pricing check failed', err);
      }
    };

    checkPricing();
  }, [cartItems]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setCardData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toastError('Please sign in to complete your purchase.');
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }

    // Validate shipping fields
    if (
      !shippingAddress.street ||
      !shippingAddress.city ||
      !shippingAddress.state ||
      !shippingAddress.postalCode ||
      !shippingAddress.phone
    ) {
      toastError('Please complete all shipping address fields.');
      return;
    }

    try {
      setLoading(true);
      setValidationError('');

      // Send only product IDs and quantities - server revalidates price and stock
      const payload = {
        items: cartItems.map((item) => ({
          productId: item._id,
          quantity: item.quantity
        })),
        shippingAddress,
        paymentMethod: 'Mock Credit Card (Test Flow)'
      };

      const res = await orderApi.createOrder(payload);

      if (res.success && res.order) {
        toastSuccess('Order placed successfully!');
        clearCart();
        navigate(`/order-success/${res.order._id}`);
      }
    } catch (err) {
      const msg = err.message || 'Failed to place order. Please check stock and try again.';
      setValidationError(msg);
      toastError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto py-24 px-4 text-center">
        <div className="w-14 h-14 bg-atelier-150 rounded-full flex items-center justify-center text-atelier-950 mx-auto mb-6">
          <Lock className="w-6 h-6 stroke-[1.5]" />
        </div>
        <h2 className="font-serif text-2xl text-atelier-950 mb-2">Sign In to Complete Checkout</h2>
        <p className="text-xs text-atelier-600 mb-8 leading-relaxed">
          Please sign in with your Élégance Atelier account or create one to save your order history and receive white-glove tracking updates.
        </p>
        <Link
          to="/login"
          state={{ from: '/checkout' }}
          className="inline-block w-full py-4 bg-atelier-950 text-white text-xs uppercase tracking-luxury font-medium hover:bg-atelier-800 transition-colors"
        >
          Sign In or Register
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="pb-6 border-b border-atelier-200">
        <span className="text-[10px] uppercase tracking-super-wide text-atelier-gold font-semibold">
          Finalize Acquisition
        </span>
        <h1 className="font-serif text-3xl text-atelier-950 font-normal mt-1">
          Complimentary White-Glove Checkout
        </h1>
      </div>

      {validationError && (
        <div className="bg-red-50 border border-red-200 p-4 text-xs text-red-800 flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <span>{validationError}</span>
        </div>
      )}

      <form onSubmit={handleSubmitOrder}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Form: Shipping + Payment Simulation */}
          <div className="lg:col-span-7 space-y-10">
            {/* Step 1: Shipping Address */}
            <div className="bg-surface p-6 sm:p-8 border border-atelier-200 space-y-6">
              <div className="flex items-center gap-2 pb-4 border-b border-atelier-150">
                <Truck className="w-4 h-4 text-atelier-gold" />
                <h3 className="font-serif text-base uppercase tracking-wider text-atelier-950 font-medium">
                  1. Shipping Destination
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="sm:col-span-2">
                  <label className="block uppercase tracking-wider text-atelier-500 font-semibold mb-1">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    name="street"
                    value={shippingAddress.street}
                    onChange={handleInputChange}
                    placeholder="e.g. 742 Fashion Avenue, Apt 4B"
                    required
                    className="w-full bg-atelier-50 border border-atelier-200 p-3 text-atelier-900 focus:outline-none focus:border-atelier-950"
                  />
                </div>

                <div>
                  <label className="block uppercase tracking-wider text-atelier-500 font-semibold mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={shippingAddress.city}
                    onChange={handleInputChange}
                    placeholder="New York"
                    required
                    className="w-full bg-atelier-50 border border-atelier-200 p-3 text-atelier-900 focus:outline-none focus:border-atelier-950"
                  />
                </div>

                <div>
                  <label className="block uppercase tracking-wider text-atelier-500 font-semibold mb-1">
                    State / Province *
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={shippingAddress.state}
                    onChange={handleInputChange}
                    placeholder="NY"
                    required
                    className="w-full bg-atelier-50 border border-atelier-200 p-3 text-atelier-900 focus:outline-none focus:border-atelier-950"
                  />
                </div>

                <div>
                  <label className="block uppercase tracking-wider text-atelier-500 font-semibold mb-1">
                    Postal / ZIP Code *
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    value={shippingAddress.postalCode}
                    onChange={handleInputChange}
                    placeholder="10018"
                    required
                    className="w-full bg-atelier-50 border border-atelier-200 p-3 text-atelier-900 focus:outline-none focus:border-atelier-950"
                  />
                </div>

                <div>
                  <label className="block uppercase tracking-wider text-atelier-500 font-semibold mb-1">
                    Contact Phone *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={shippingAddress.phone}
                    onChange={handleInputChange}
                    placeholder="+1 (212) 555-0199"
                    required
                    className="w-full bg-atelier-50 border border-atelier-200 p-3 text-atelier-900 focus:outline-none focus:border-atelier-950"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Payment Simulation */}
            <div className="bg-surface p-6 sm:p-8 border border-atelier-200 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-atelier-150">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-atelier-gold" />
                  <h3 className="font-serif text-base uppercase tracking-wider text-atelier-950 font-medium">
                    2. Payment Simulation
                  </h3>
                </div>
                <span className="text-[10px] uppercase tracking-wider bg-emerald-50 text-emerald-800 px-2 py-0.5 font-semibold">
                  Sandbox Active
                </span>
              </div>

              {/* Security Advisory */}
              <div className="p-3.5 bg-atelier-100/70 border border-atelier-200 text-xs text-atelier-700 flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-atelier-gold shrink-0 mt-0.5" />
                <span>
                  <strong>Sandbox Environment:</strong> This store is operating in test mode. No real credit card details are collected or processed. You can place test orders freely with the prefilled card credentials.
                </span>
              </div>

              {/* Simulated Card Presentation */}
              <div className="bg-gradient-to-tr from-atelier-950 to-atelier-800 text-white p-6 rounded-none shadow-xl border border-atelier-700 space-y-4">
                <div className="flex justify-between items-start">
                  <span className="font-serif text-lg tracking-widest text-atelier-gold font-medium">
                    ÉLÉGANCE ATELIER
                  </span>
                  <div className="w-9 h-6 bg-amber-400/80 rounded-sm"></div>
                </div>

                <div className="pt-2 font-mono text-lg tracking-[0.2em] text-atelier-100">
                  {cardData.cardNumber}
                </div>

                <div className="flex justify-between items-end pt-2 text-[10px] uppercase tracking-widest text-atelier-400">
                  <div>
                    <span className="block text-[8px] text-atelier-500">Cardholder</span>
                    <span className="text-white font-medium">{cardData.cardholderName || user?.name}</span>
                  </div>
                  <div>
                    <span className="block text-[8px] text-atelier-500">Expires</span>
                    <span className="text-white font-medium">{cardData.expiry}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="sm:col-span-2">
                  <label className="block uppercase tracking-wider text-atelier-500 font-semibold mb-1">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    name="cardholderName"
                    value={cardData.cardholderName}
                    onChange={handlePaymentChange}
                    className="w-full bg-atelier-50 border border-atelier-200 p-3 text-atelier-900 focus:outline-none focus:border-atelier-950"
                  />
                </div>

                <div>
                  <label className="block uppercase tracking-wider text-atelier-500 font-semibold mb-1">
                    Expiration Date
                  </label>
                  <input
                    type="text"
                    name="expiry"
                    value={cardData.expiry}
                    onChange={handlePaymentChange}
                    className="w-full bg-atelier-50 border border-atelier-200 p-3 text-atelier-900 focus:outline-none focus:border-atelier-950"
                  />
                </div>

                <div>
                  <label className="block uppercase tracking-wider text-atelier-500 font-semibold mb-1">
                    Security Code (CVV)
                  </label>
                  <input
                    type="text"
                    name="cvv"
                    value={cardData.cvv}
                    onChange={handlePaymentChange}
                    className="w-full bg-atelier-50 border border-atelier-200 p-3 text-atelier-900 focus:outline-none focus:border-atelier-950"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Summary Column */}
          <div className="lg:col-span-5 bg-atelier-100/70 p-6 sm:p-8 border border-atelier-200 space-y-6">
            <h3 className="font-serif text-lg uppercase tracking-wide text-atelier-950 font-normal">
              Order Items ({cartItems.length})
            </h3>

            <div className="divide-y divide-atelier-200 max-h-72 overflow-y-auto pr-2">
              {cartItems.map((item) => (
                <div key={item._id} className="py-3 flex gap-4 items-center">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-14 h-16 object-cover object-center bg-atelier-150 border border-atelier-200 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-atelier-950 truncate">
                      {item.name}
                    </p>
                    <p className="text-[10px] text-atelier-500">
                      Qty: {item.quantity} × ${item.price.toFixed(2)}
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-atelier-950">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-2.5 divide-y divide-atelier-200 text-xs pt-2">
              <div className="flex justify-between pb-2 text-atelier-700">
                <span>Items Subtotal</span>
                <span className="font-semibold text-atelier-950">
                  ${(orderTotals.itemsPrice || 0).toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between py-2 text-atelier-700">
                <span>Shipping Method</span>
                <span className="font-semibold text-emerald-800 uppercase tracking-wider">
                  {orderTotals.shippingPrice === 0 ? 'Complimentary' : `$${orderTotals.shippingPrice.toFixed(2)}`}
                </span>
              </div>

              <div className="flex justify-between py-2 text-atelier-700">
                <span>Estimated Tax (8.5%)</span>
                <span className="font-semibold text-atelier-950">
                  ${(orderTotals.taxPrice || 0).toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between pt-4 text-base">
                <span className="font-serif font-medium text-atelier-950">Total Acquisition</span>
                <span className="font-serif font-bold text-atelier-950 text-2xl">
                  ${(orderTotals.totalPrice || 0).toFixed(2)}
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-atelier-950 text-white text-xs uppercase tracking-luxury font-medium hover:bg-atelier-800 disabled:opacity-50 transition-colors flex items-center justify-center gap-2 shadow-xl"
            >
              {loading ? (
                <span>Securing Order...</span>
              ) : (
                <>
                  <span>Place Order • ${(orderTotals.totalPrice || 0).toFixed(2)}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="pt-2 text-[11px] text-atelier-500 space-y-1.5 text-center">
              <p>By placing this order, you authorize the simulation order creation.</p>
              <p>Complimentary 30-day returns and bespoke packaging included.</p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
