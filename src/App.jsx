import React from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { CartProvider } from './context/CartContext.jsx';
import { WishlistProvider } from './context/WishlistContext.jsx';

import { Navbar } from './components/common/Navbar.jsx';
import { Footer } from './components/common/Footer.jsx';
import { CartDrawer } from './components/cart/CartDrawer.jsx';
import { ProtectedRoute } from './components/common/ProtectedRoute.jsx';

import { Home } from './pages/Home.jsx';
import { Shop } from './pages/Shop.jsx';
import { ProductDetail } from './pages/ProductDetail.jsx';
import { Cart } from './pages/Cart.jsx';
import { Checkout } from './pages/Checkout.jsx';
import { OrderSuccess } from './pages/OrderSuccess.jsx';
import { OrderHistory } from './pages/OrderHistory.jsx';
import { Wishlist } from './pages/Wishlist.jsx';
import { Login } from './pages/Login.jsx';
import { Register } from './pages/Register.jsx';

import { AdminLayout } from './pages/admin/AdminLayout.jsx';
import { Dashboard as AdminDashboard } from './pages/admin/Dashboard.jsx';
import { ProductManager } from './pages/admin/ProductManager.jsx';
import { OrderManager } from './pages/admin/OrderManager.jsx';
import { CustomerList } from './pages/admin/CustomerList.jsx';

// Customer layout wrapper with sticky navbar, cart drawer, and luxury footer
const CustomerLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-atelier-50 text-atelier-900 selection:bg-atelier-gold selection:text-atelier-950 font-sans">
      <Navbar />
      <CartDrawer />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <BrowserRouter>
              <Routes>
                {/* Customer Storefront Routes */}
                <Route element={<CustomerLayout />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/shop" element={<Shop />} />
                  <Route path="/product/:idOrSlug" element={<ProductDetail />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/wishlist" element={<Wishlist />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />

                  {/* Customer Protected Routes */}
                  <Route
                    path="/checkout"
                    element={
                      <ProtectedRoute>
                        <Checkout />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/orders"
                    element={
                      <ProtectedRoute>
                        <OrderHistory />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/order-success/:id"
                    element={
                      <ProtectedRoute>
                        <OrderSuccess />
                      </ProtectedRoute>
                    }
                  />
                </Route>

                {/* Role-Protected Admin Dashboard Routes */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute adminOnly={true}>
                      <AdminLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<AdminDashboard />} />
                  <Route path="products" element={<ProductManager />} />
                  <Route path="orders" element={<OrderManager />} />
                  <Route path="customers" element={<CustomerList />} />
                </Route>

                {/* 404 Catch-All */}
                <Route
                  path="*"
                  element={
                    <CustomerLayout>
                      <div className="py-24 text-center">
                        <h2 className="font-serif text-3xl mb-2">Page Not Found</h2>
                        <p className="text-xs text-atelier-500 mb-6">
                          The requested atelier page could not be located.
                        </p>
                      </div>
                    </CustomerLayout>
                  }
                />
              </Routes>
            </BrowserRouter>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
