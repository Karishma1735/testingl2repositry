import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, ArrowRight, Clock, CheckCircle2, ChevronRight } from 'lucide-react';
import { orderApi } from '../api/orderApi.js';
import { EmptyState } from '../components/common/EmptyState.jsx';

export const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await orderApi.getMyOrders();
        if (res.success) {
          setOrders(res.orders || []);
        }
      } catch (err) {
        console.error('Failed to load past orders', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-atelier-900 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-20">
        <EmptyState
          icon={Package}
          title="No Past Acquisitions Found"
          description="You have not placed any orders yet. Discover our handcrafted purse collection to start your atelier journey."
          actionLabel="Explore Handbags"
          actionLink="/shop"
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 space-y-10">
      <div className="pb-6 border-b border-atelier-200">
        <span className="text-[10px] uppercase tracking-super-wide text-atelier-gold font-semibold">
          Customer Portal
        </span>
        <h1 className="font-serif text-3xl text-atelier-950 font-normal mt-1">
          Your Order History
        </h1>
      </div>

      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-surface border border-atelier-200 shadow-sm divide-y divide-atelier-150"
          >
            {/* Order Card Header */}
            <div className="p-6 bg-atelier-50/60 flex flex-wrap items-center justify-between gap-4 text-xs">
              <div className="flex flex-wrap items-center gap-6">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-atelier-500 block">
                    Order Ref
                  </span>
                  <span className="font-mono font-medium text-atelier-950">
                    #{order._id.substring(order._id.length - 8).toUpperCase()}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] uppercase tracking-wider text-atelier-500 block">
                    Date Placed
                  </span>
                  <span className="text-atelier-800">
                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] uppercase tracking-wider text-atelier-500 block">
                    Total Settled
                  </span>
                  <span className="font-serif font-bold text-atelier-950">
                    ${order.totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`text-[10px] uppercase tracking-widest px-3 py-1 font-semibold ${
                    order.orderStatus === 'Delivered'
                      ? 'bg-emerald-900 text-emerald-100'
                      : order.orderStatus === 'Shipped'
                      ? 'bg-blue-900 text-blue-100'
                      : 'bg-atelier-950 text-atelier-gold'
                  }`}
                >
                  {order.orderStatus}
                </span>

                <Link
                  to={`/order-success/${order._id}`}
                  className="px-4 py-2 border border-atelier-300 bg-surface hover:border-atelier-950 text-[11px] uppercase tracking-wider text-atelier-900 transition-colors flex items-center gap-1"
                >
                  <span>Receipt</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Order Items List */}
            <div className="p-6 divide-y divide-atelier-100">
              {order.orderItems.map((item, idx) => (
                <div key={idx} className="py-3 flex gap-4 items-center">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-14 h-16 object-cover object-center bg-atelier-150 border border-atelier-200 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-atelier-950 truncate">
                      {item.name}
                    </p>
                    <p className="text-xs text-atelier-500 mt-0.5">
                      Qty: {item.quantity} × ${item.price.toFixed(2)}
                    </p>
                  </div>
                  <span className="font-serif text-sm font-semibold text-atelier-950">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
