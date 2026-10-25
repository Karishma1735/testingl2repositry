import React from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Store,
  LogOut,
  ShieldAlert
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';

export const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard, end: true },
    { name: 'Products & Stock', path: '/admin/products', icon: Package },
    { name: 'Customer Orders', path: '/admin/orders', icon: ShoppingBag },
    { name: 'Customer Directory', path: '/admin/customers', icon: Users }
  ];

  return (
    <div className="min-h-screen bg-atelier-50 text-atelier-900 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-atelier-950 text-atelier-200 border-r border-atelier-800 flex flex-col shrink-0">
        <div className="p-6 border-b border-atelier-800">
          <Link to="/" className="block">
            <span className="font-serif text-lg tracking-[0.18em] uppercase text-white font-medium block">
              Élégance
            </span>
            <span className="text-[9px] tracking-[0.3em] uppercase text-atelier-gold font-semibold flex items-center gap-1.5 mt-0.5">
              <ShieldAlert className="w-3 h-3 text-atelier-gold" />
              <span>Admin Console</span>
            </span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1 text-xs">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-none uppercase tracking-wider transition-colors ${
                  isActive
                    ? 'bg-atelier-800 text-atelier-gold font-semibold border-l-2 border-atelier-gold'
                    : 'text-atelier-400 hover:text-white hover:bg-atelier-900'
                }`
              }
            >
              <item.icon className="w-4 h-4" />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer Admin Info */}
        <div className="p-4 border-t border-atelier-800 text-xs space-y-3">
          <div className="px-2">
            <p className="font-medium text-white truncate">{user?.name}</p>
            <p className="text-[10px] text-atelier-400 truncate">{user?.email}</p>
          </div>

          <div className="pt-2 border-t border-atelier-800/60 flex flex-col gap-1">
            <Link
              to="/"
              className="flex items-center gap-2 px-2 py-2 text-atelier-300 hover:text-white transition-colors"
            >
              <Store className="w-3.5 h-3.5 text-atelier-gold" />
              <span>Back to Storefront</span>
            </Link>

            <button
              onClick={handleLogout}
              className="w-full text-left flex items-center gap-2 px-2 py-2 text-red-400 hover:text-red-300 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Admin Content Area */}
      <main className="flex-1 overflow-x-hidden min-h-screen flex flex-col">
        {/* Top Header */}
        <header className="bg-white border-b border-atelier-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-atelier-500">
            <span className="uppercase tracking-wider font-semibold text-atelier-950">
              Maison Administration
            </span>
          </div>

          <Link
            to="/"
            className="text-xs uppercase tracking-luxury text-atelier-700 hover:text-atelier-950 flex items-center gap-1.5 font-medium border border-atelier-300 px-3 py-1.5 bg-atelier-50"
          >
            <Store className="w-3.5 h-3.5 text-atelier-gold" />
            <span>View Live Store</span>
          </Link>
        </header>

        {/* Route views */}
        <div className="flex-1 p-6 md:p-10 max-w-7xl w-full mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
