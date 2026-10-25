import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Filter,
  Eye,
  CheckCircle2,
  Clock,
  X,
  MapPin,
  ChevronRight
} from 'lucide-react';
import { adminApi } from '../../api/adminApi.js';
import { useToast } from '../../context/ToastContext.jsx';

const STATUSES = ['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

export const OrderManager = () => {
  const { success, error: toastError } = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getOrders({
        status: statusFilter !== 'All' ? statusFilter : undefined,
        limit: 50
      });
      if (res.success) {
        setOrders(res.orders || []);
      }
    } catch (err) {
      console.error('Failed to load orders', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setUpdatingId(orderId);
      const res = await adminApi.updateOrderStatus(orderId, newStatus);
      if (res.success) {
        success(`Order status updated to "${newStatus}".`);
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? { ...o, orderStatus: newStatus } : o))
        );
        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder((prev) => ({ ...prev, orderStatus: newStatus }));
        }
      }
    } catch (err) {
      toastError(err.message || 'Failed to update order status.');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-atelier-200 gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-super-wide text-atelier-gold font-semibold">
            Order Fulfillment
          </span>
          <h1 className="font-serif text-3xl text-atelier-950 font-normal mt-1">
            Customer Orders ({orders.length})
          </h1>
        </div>

        {/* Status Filters */}
        <div className="flex flex-wrap gap-1">
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`text-xs px-3 py-1.5 border transition-all ${
                statusFilter === s
                  ? 'bg-atelier-950 text-white border-atelier-950 font-medium'
                  : 'bg-white text-atelier-700 border-atelier-200 hover:border-atelier-400'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-atelier-200 shadow-sm overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-atelier-50 border-b border-atelier-200 text-[10px] uppercase tracking-wider text-atelier-600">
            <tr>
              <th className="p-4 pl-6">Order ID</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Date Placed</th>
              <th className="p-4">Total</th>
              <th className="p-4">Current Status</th>
              <th className="p-4">Update Status</th>
              <th className="p-4 pr-6 text-right">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-atelier-150">
            {loading ? (
              <tr>
                <td colSpan="7" className="p-8 text-center text-atelier-500">
                  Retrieving orders...
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan="7" className="p-8 text-center text-atelier-500">
                  No orders found under "{statusFilter}".
                </td>
              </tr>
            ) : (
              orders.map((o) => (
                <tr key={o._id} className="hover:bg-atelier-50/70 transition-colors">
                  <td className="p-4 pl-6 font-mono font-medium text-atelier-950">
                    #{o._id.substring(o._id.length - 8).toUpperCase()}
                  </td>

                  <td className="p-4">
                    <p className="font-medium text-atelier-950">{o.user?.name || 'Customer'}</p>
                    <p className="text-[10px] text-atelier-500">{o.user?.email}</p>
                  </td>

                  <td className="p-4 text-atelier-500">
                    {new Date(o.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </td>

                  <td className="p-4 font-serif font-bold text-atelier-950">
                    ${o.totalPrice.toFixed(2)}
                  </td>

                  <td className="p-4">
                    <span
                      className={`text-[9px] uppercase tracking-wider px-2.5 py-0.5 font-bold ${
                        o.orderStatus === 'Delivered'
                          ? 'bg-emerald-100 text-emerald-900'
                          : o.orderStatus === 'Shipped'
                          ? 'bg-blue-100 text-blue-900'
                          : o.orderStatus === 'Cancelled'
                          ? 'bg-red-100 text-red-900'
                          : 'bg-atelier-950 text-atelier-gold'
                      }`}
                    >
                      {o.orderStatus}
                    </span>
                  </td>

                  <td className="p-4">
                    <select
                      value={o.orderStatus}
                      disabled={updatingId === o._id}
                      onChange={(e) => handleStatusChange(o._id, e.target.value)}
                      className="bg-atelier-50 border border-atelier-300 text-xs p-1.5 focus:outline-none focus:border-atelier-950"
                    >
                      {STATUSES.filter((s) => s !== 'All').map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>

                  <td className="p-4 pr-6 text-right">
                    <button
                      onClick={() => setSelectedOrder(o)}
                      className="p-1.5 text-atelier-700 hover:text-atelier-950 hover:bg-atelier-100 inline-flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Inspect</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Inspect Order Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-2xl w-full p-8 shadow-2xl border border-atelier-200 max-h-[90vh] overflow-y-auto space-y-6 animate-fade-in">
            <div className="flex items-center justify-between pb-4 border-b border-atelier-200">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-atelier-500">
                  Order Inspection
                </span>
                <h3 className="font-serif text-xl text-atelier-950 font-normal">
                  #{selectedOrder._id}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-atelier-400 hover:text-atelier-950"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customer & Shipping Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 bg-atelier-50 text-xs border border-atelier-200">
              <div>
                <span className="text-atelier-500 uppercase tracking-wider font-semibold block mb-1">
                  Customer Information
                </span>
                <p className="font-medium text-atelier-950">{selectedOrder.user?.name}</p>
                <p className="text-atelier-600">{selectedOrder.user?.email}</p>
              </div>

              <div>
                <span className="text-atelier-500 uppercase tracking-wider font-semibold block mb-1">
                  Delivery Destination
                </span>
                <p className="text-atelier-800">
                  {selectedOrder.shippingAddress.street} <br />
                  {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.postalCode} <br />
                  {selectedOrder.shippingAddress.country} <br />
                  Phone: {selectedOrder.shippingAddress.phone}
                </p>
              </div>
            </div>

            {/* Order Items */}
            <div className="space-y-3">
              <h4 className="font-serif text-sm uppercase tracking-wider text-atelier-950 font-medium">
                Ordered Handbags ({selectedOrder.orderItems.length})
              </h4>
              <div className="divide-y divide-atelier-150 border border-atelier-200">
                {selectedOrder.orderItems.map((item, idx) => (
                  <div key={idx} className="p-3 flex items-center gap-4 text-xs">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-14 object-cover object-center bg-atelier-150 shrink-0 border border-atelier-200"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-atelier-950 truncate">{item.name}</p>
                      <p className="text-[10px] text-atelier-500">
                        Qty: {item.quantity} × ${item.price.toFixed(2)}
                      </p>
                    </div>
                    <span className="font-serif font-bold text-atelier-950">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Status Controller */}
            <div className="p-4 bg-atelier-100/60 border border-atelier-200 flex items-center justify-between text-xs">
              <div>
                <span className="font-medium text-atelier-950 block">Update Order Status:</span>
                <span className="text-[10px] text-atelier-500">
                  Delivered status logs the delivery timestamp.
                </span>
              </div>
              <select
                value={selectedOrder.orderStatus}
                onChange={(e) => handleStatusChange(selectedOrder._id, e.target.value)}
                className="bg-white border border-atelier-300 text-xs p-2 focus:outline-none focus:border-atelier-950 font-semibold"
              >
                {STATUSES.filter((s) => s !== 'All').map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-6 py-2.5 bg-atelier-950 text-white text-xs uppercase tracking-luxury hover:bg-atelier-800"
              >
                Close Inspection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
