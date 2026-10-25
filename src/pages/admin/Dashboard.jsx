import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  DollarSign,
  ShoppingBag,
  Package,
  Users,
  AlertTriangle,
  ArrowRight,
  ChevronRight
} from 'lucide-react';
import { adminApi } from '../../api/adminApi.js';

export const Dashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true);
        const res = await adminApi.getMetrics();
        if (res.success) {
          setMetrics(res.metrics);
        }
      } catch (err) {
        console.error('Failed to load admin metrics', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-atelier-900 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const m = metrics || {
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalCustomers: 0,
    statusCounts: {},
    lowStockCount: 0,
    lowStockProducts: [],
    recentOrders: []
  };

  return (
    <div className="space-y-10">
      {/* Title */}
      <div>
        <span className="text-[10px] uppercase tracking-super-wide text-atelier-gold font-semibold">
          Performance Overview
        </span>
        <h1 className="font-serif text-3xl text-atelier-950 font-normal mt-1">
          Store Analytics & Operations
        </h1>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-surface p-6 border border-atelier-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-atelier-500">
            <span className="text-xs uppercase tracking-wider font-semibold">Total Revenue</span>
            <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="font-serif text-2xl font-bold text-atelier-950">
            ${m.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
          <span className="text-[11px] text-emerald-700 font-medium">
            From verified paid acquisitions
          </span>
        </div>

        <div className="bg-surface p-6 border border-atelier-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-atelier-500">
            <span className="text-xs uppercase tracking-wider font-semibold">Total Orders</span>
            <div className="w-8 h-8 rounded-full bg-atelier-150 text-atelier-900 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <p className="font-serif text-2xl font-bold text-atelier-950">
            {m.totalOrders}
          </p>
          <span className="text-[11px] text-atelier-500 font-medium">
            Lifetime orders placed
          </span>
        </div>

        <div className="bg-surface p-6 border border-atelier-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-atelier-500">
            <span className="text-xs uppercase tracking-wider font-semibold">Catalog Items</span>
            <div className="w-8 h-8 rounded-full bg-atelier-150 text-atelier-900 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <p className="font-serif text-2xl font-bold text-atelier-950">
            {m.totalProducts}
          </p>
          <span className="text-[11px] text-atelier-500 font-medium">
            Active luxury handbags
          </span>
        </div>

        <div className="bg-surface p-6 border border-atelier-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-atelier-500">
            <span className="text-xs uppercase tracking-wider font-semibold">Registered Clients</span>
            <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-800 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="font-serif text-2xl font-bold text-atelier-950">
            {m.totalCustomers}
          </p>
          <span className="text-[11px] text-amber-800 font-medium">
            Verified customer accounts
          </span>
        </div>
      </div>

      {/* Low Stock Warning Banner */}
      {m.lowStockProducts.length > 0 && (
        <div className="bg-amber-50/70 border border-amber-300 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-900">
              <AlertTriangle className="w-5 h-5 text-amber-700" />
              <h3 className="font-serif text-base uppercase tracking-wider font-medium">
                Inventory Alerts ({m.lowStockProducts.length} creations with ≤ 3 stock)
              </h3>
            </div>
            <Link
              to="/admin/products"
              className="text-xs text-amber-900 hover:underline uppercase tracking-wider font-semibold"
            >
              Manage Catalog Inventory →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {m.lowStockProducts.map((p) => (
              <div
                key={p._id}
                className="bg-surface p-3 border border-amber-200 flex items-center gap-3 text-xs"
              >
                <img
                  src={p.images[0]}
                  alt={p.name}
                  className="w-12 h-14 object-cover object-center bg-atelier-150 shrink-0 border border-atelier-200"
                />
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-atelier-950 truncate">{p.name}</p>
                  <p className="text-[10px] text-atelier-500">SKU: {p.sku}</p>
                  <span className="inline-block mt-1 text-[10px] uppercase font-bold text-red-700 bg-red-50 px-1.5 py-0.2">
                    {p.countInStock} Remaining
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Orders Overview */}
      <div className="bg-surface border border-atelier-200 shadow-sm space-y-4">
        <div className="p-6 border-b border-atelier-150 flex items-center justify-between">
          <h3 className="font-serif text-lg text-atelier-950 font-medium">
            Recent Client Orders
          </h3>
          <Link
            to="/admin/orders"
            className="text-xs uppercase tracking-luxury text-atelier-900 hover:text-atelier-gold-dark font-medium flex items-center gap-1"
          >
            <span>View All Orders</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-atelier-50 border-b border-atelier-200 text-[10px] uppercase tracking-wider text-atelier-600">
              <tr>
                <th className="p-4 pl-6">Order ID</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Date</th>
                <th className="p-4">Items</th>
                <th className="p-4">Total</th>
                <th className="p-4">Status</th>
                <th className="p-4 pr-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-atelier-150">
              {m.recentOrders.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-atelier-500">
                    No orders placed yet.
                  </td>
                </tr>
              ) : (
                m.recentOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-atelier-50/70 transition-colors">
                    <td className="p-4 pl-6 font-mono font-medium text-atelier-950">
                      #{order._id.substring(order._id.length - 8).toUpperCase()}
                    </td>
                    <td className="p-4 font-medium text-atelier-900">
                      {order.user?.name || 'Customer'}
                    </td>
                    <td className="p-4 text-atelier-500">
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td className="p-4 text-atelier-600">
                      {order.orderItems.length} items
                    </td>
                    <td className="p-4 font-serif font-bold text-atelier-950">
                      ${order.totalPrice.toFixed(2)}
                    </td>
                    <td className="p-4">
                      <span
                        className={`text-[9px] uppercase tracking-wider px-2.5 py-0.5 font-bold ${
                          order.orderStatus === 'Delivered'
                            ? 'bg-emerald-100 text-emerald-900'
                            : order.orderStatus === 'Shipped'
                            ? 'bg-blue-100 text-blue-900'
                            : 'bg-atelier-950 text-atelier-gold'
                        }`}
                      >
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <Link
                        to={`/order-success/${order._id}`}
                        className="text-xs text-atelier-900 hover:underline inline-flex items-center gap-1"
                      >
                        <span>Inspect</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
