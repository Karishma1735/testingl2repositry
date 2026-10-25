import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, Package, ArrowRight, Truck, MapPin } from 'lucide-react';
import { orderApi } from '../api/orderApi.js';

export const OrderSuccess = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const res = await orderApi.getOrderById(id);
        if (res.success && res.order) {
          setOrder(res.order);
        } else {
          setError('Order details could not be retrieved.');
        }
      } catch (err) {
        setError(err.message || 'Failed to load order confirmation.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-atelier-900 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-md mx-auto py-24 text-center px-4">
        <h2 className="font-serif text-2xl text-atelier-950 mb-2">Order Not Found</h2>
        <p className="text-xs text-atelier-600 mb-6">{error || 'Order could not be located.'}</p>
        <Link
          to="/shop"
          className="px-6 py-3 bg-atelier-950 text-white text-xs uppercase tracking-luxury hover:bg-atelier-800"
        >
          Return to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-16 space-y-12">
      {/* Success Banner */}
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-atelier-950 text-atelier-gold rounded-full flex items-center justify-center mx-auto shadow-xl">
          <CheckCircle2 className="w-9 h-9 stroke-[1.5]" />
        </div>
        <span className="text-[10px] uppercase tracking-super-wide text-atelier-gold font-semibold">
          Acquisition Confirmed
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl text-atelier-950 font-normal">
          Thank you for your order
        </h1>
        <p className="text-xs text-atelier-600 max-w-md mx-auto leading-relaxed">
          Your order has been received by our atelier workshop and is currently being prepared for dispatch.
        </p>
      </div>

      {/* Order Summary Receipt Box */}
      <div className="bg-white border border-atelier-200 divide-y divide-atelier-200 shadow-sm">
        {/* Meta Bar */}
        <div className="p-6 bg-atelier-100/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs">
          <div>
            <span className="text-atelier-500 uppercase tracking-wider block text-[10px]">
              Order Identification
            </span>
            <span className="font-mono font-medium text-atelier-950">
              #{order._id}
            </span>
          </div>

          <div>
            <span className="text-atelier-500 uppercase tracking-wider block text-[10px]">
              Date Placed
            </span>
            <span className="font-medium text-atelier-950">
              {new Date(order.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
          </div>

          <div>
            <span className="text-atelier-500 uppercase tracking-wider block text-[10px]">
              Order Status
            </span>
            <span className="inline-block bg-atelier-950 text-atelier-gold text-[10px] uppercase tracking-widest px-2.5 py-0.5 font-semibold">
              {order.orderStatus}
            </span>
          </div>
        </div>

        {/* Order Items */}
        <div className="p-6 sm:p-8 space-y-6">
          <h3 className="font-serif text-base uppercase tracking-wider text-atelier-950 font-medium">
            Acquired Pieces
          </h3>

          <div className="divide-y divide-atelier-150">
            {order.orderItems.map((item, index) => (
              <div key={index} className="py-4 flex gap-4 items-center">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-20 object-cover object-center bg-atelier-150 border border-atelier-200 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-atelier-950 truncate">
                    {item.name}
                  </h4>
                  <p className="text-xs text-atelier-500 mt-0.5">
                    Quantity: {item.quantity} × ${item.price.toFixed(2)}
                  </p>
                </div>
                <span className="font-serif text-sm font-semibold text-atelier-950">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping & Payment Meta */}
        <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-8 text-xs">
          <div>
            <div className="flex items-center gap-1.5 text-atelier-950 font-medium uppercase tracking-wider mb-2">
              <MapPin className="w-3.5 h-3.5 text-atelier-gold" />
              <span>Delivery Destination</span>
            </div>
            <p className="text-atelier-700 leading-relaxed">
              {order.shippingAddress.street} <br />
              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode} <br />
              {order.shippingAddress.country} <br />
              Phone: {order.shippingAddress.phone}
            </p>
          </div>

          <div>
            <div className="flex items-center gap-1.5 text-atelier-950 font-medium uppercase tracking-wider mb-2">
              <Package className="w-3.5 h-3.5 text-atelier-gold" />
              <span>Payment & Settlement</span>
            </div>
            <p className="text-atelier-700 leading-relaxed">
              Method: {order.paymentMethod} <br />
              Status: <span className="text-emerald-800 font-medium">Payment Settled (Simulated)</span> <br />
              Reference ID: {order.paymentResult?.id || 'MOCK_TXN'}
            </p>
          </div>
        </div>

        {/* Totals Breakdown */}
        <div className="p-6 sm:p-8 bg-atelier-50/70 space-y-2 text-xs">
          <div className="flex justify-between text-atelier-700">
            <span>Subtotal</span>
            <span className="font-medium">${order.itemsPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-atelier-700">
            <span>Delivery</span>
            <span>{order.shippingPrice === 0 ? 'Complimentary' : `$${order.shippingPrice.toFixed(2)}`}</span>
          </div>
          <div className="flex justify-between text-atelier-700">
            <span>Estimated Taxes</span>
            <span className="font-medium">${order.taxPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between pt-3 border-t border-atelier-200 text-base font-serif font-bold text-atelier-950">
            <span>Total Settled</span>
            <span>${order.totalPrice.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
        <Link
          to="/orders"
          className="px-8 py-3.5 bg-atelier-950 text-white text-xs uppercase tracking-luxury hover:bg-atelier-800 transition-colors text-center"
        >
          View All Past Orders
        </Link>
        <Link
          to="/shop"
          className="px-8 py-3.5 bg-white border border-atelier-300 text-atelier-900 text-xs uppercase tracking-luxury hover:border-atelier-950 transition-colors text-center"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};
