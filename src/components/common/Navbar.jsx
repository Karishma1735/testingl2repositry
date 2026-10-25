import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Heart,
  User,
  Search,
  Menu,
  X,
  ShieldAlert,
  LogOut,
  Package,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useCart } from '../../context/CartContext.jsx';
import { useWishlist } from '../../context/WishlistContext.jsx';
import { ThemeToggle } from './ThemeToggle.jsx';

export const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { itemCount, openCart } = useCart();
  const { wishlistCount } = useWishlist();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { name: 'Shop All', path: '/shop' },
    { name: 'Totes', path: '/shop?category=Tote%20Bags' },
    { name: 'Crossbody', path: '/shop?category=Crossbody%20Bags' },
    { name: 'Shoulder Bags', path: '/shop?category=Shoulder%20Bags' },
    { name: 'Evening Clutches', path: '/shop?category=Clutches%20%26%20Evening' },
    { name: 'Best Sellers', path: '/shop?sort=bestseller' }
  ];

  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-200">
      {/* Top Announcement Bar */}
      <div className="bg-accent text-accent-foreground text-[10px] tracking-super-wide uppercase py-2.5 px-4 text-center border-b border-accent/70">
        <span>Complimentary Express Delivery on Orders Over $250</span>
      </div>

      {/* Main Navigation Bar */}
      <nav className="nav-blur border-b border-atelier-200/80 px-4 sm:px-8 py-4 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-atelier-800 hover:text-atelier-950"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Desktop Left Nav Links */}
          <div className="hidden lg:flex items-center gap-7">
            {navLinks.slice(0, 3).map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="text-xs uppercase tracking-luxury text-atelier-700 hover:text-atelier-950 transition-colors font-normal hover:font-medium"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Brand Logo Center */}
          <div className="text-center">
            <Link to="/" className="inline-block group">
              <span className="font-serif text-xl sm:text-2xl lg:text-3xl tracking-[0.18em] uppercase text-atelier-950 font-medium block">
                Élégance
              </span>
              <span className="text-[9px] sm:text-[10px] tracking-[0.4em] uppercase text-atelier-gold font-sans font-semibold block -mt-1 group-hover:text-atelier-gold-dark transition-colors">
                Atelier Paris
              </span>
            </Link>
          </div>

          {/* Desktop Right Nav Links */}
          <div className="hidden lg:flex items-center gap-7">
            {navLinks.slice(3).map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="text-xs uppercase tracking-luxury text-atelier-700 hover:text-atelier-950 transition-colors font-normal hover:font-medium"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2.5 sm:gap-4">
            <ThemeToggle />

            {/* Search Trigger */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-1.5 text-atelier-700 hover:text-atelier-950 transition-colors"
              aria-label="Search"
            >
              <Search className="w-4 h-4 stroke-[1.8]" />
            </button>

            {/* Wishlist Link */}
            <Link
              to="/wishlist"
              className="p-1.5 text-atelier-700 hover:text-atelier-950 transition-colors relative"
              aria-label="Wishlist"
            >
              <Heart className="w-4 h-4 stroke-[1.8]" />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-atelier-950 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* User Account / Dropdown */}
            <div className="relative">
              {isAuthenticated ? (
                <div>
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-1.5 p-1.5 text-atelier-700 hover:text-atelier-950 transition-colors"
                  >
                    <User className="w-4 h-4 stroke-[1.8]" />
                    <span className="hidden md:inline text-xs font-medium max-w-[80px] truncate">
                      {user.name.split(' ')[0]}
                    </span>
                    <ChevronDown className="w-3 h-3 text-atelier-500" />
                  </button>

                  {userDropdownOpen && (
                    <div
                      onMouseLeave={() => setUserDropdownOpen(false)}
                      className="absolute right-0 mt-2 w-48 bg-surface border border-atelier-200 shadow-xl py-2 z-50 animate-fade-in text-xs"
                    >
                      <div className="px-4 py-2 border-b border-atelier-100">
                        <p className="font-semibold text-atelier-950 truncate">{user.name}</p>
                        <p className="text-[10px] text-atelier-500 truncate">{user.email}</p>
                      </div>

                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-accent hover:bg-accent/10 font-medium"
                        >
                          <ShieldAlert className="w-3.5 h-3.5 text-accent" />
                          <span>Admin Dashboard</span>
                        </Link>
                      )}

                      <Link
                        to="/orders"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-atelier-700 hover:bg-atelier-50"
                      >
                        <Package className="w-3.5 h-3.5" />
                        <span>Order History</span>
                      </Link>

                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          logout();
                        }}
                        className="w-full text-left flex items-center gap-2 px-4 py-2 text-red-700 hover:bg-red-50 border-t border-atelier-100 mt-1"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="p-1.5 text-atelier-700 hover:text-atelier-950 transition-colors flex items-center gap-1"
                  aria-label="Sign In"
                >
                  <User className="w-4 h-4 stroke-[1.8]" />
                  <span className="hidden md:inline text-xs uppercase tracking-luxury font-medium">
                    Sign In
                  </span>
                </Link>
              )}
            </div>

            {/* Shopping Bag Button */}
            <button
              onClick={openCart}
              className="p-1.5 text-atelier-950 hover:text-atelier-700 transition-colors relative flex items-center"
              aria-label="Open Shopping Bag"
            >
              <ShoppingBag className="w-4 h-4 stroke-[1.8]" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Search Overlay Bar */}
        {searchOpen && (
          <div className="border-t border-atelier-200 mt-3 pt-3 max-w-2xl mx-auto animate-fade-in">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <Search className="w-4 h-4 absolute left-3 text-atelier-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search leather totes, crossbody bags, clutches..."
                className="w-full pl-9 pr-20 py-2 bg-surface border border-atelier-200 text-xs text-atelier-900 placeholder:text-atelier-400 focus:outline-none focus:border-atelier-950"
                autoFocus
              />
              <button
                type="submit"
                className="absolute right-2 px-3 py-1 bg-atelier-950 text-white text-[10px] uppercase tracking-wider hover:bg-atelier-800"
              >
                Search
              </button>
            </form>
          </div>
        )}
      </nav>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-surface border-b border-atelier-200 px-6 py-6 space-y-4 animate-fade-in">
          <div className="space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm uppercase tracking-luxury text-atelier-800 hover:text-atelier-950 py-1"
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="pt-4 border-t border-atelier-150 flex flex-col gap-3">
            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs uppercase tracking-luxury text-accent font-bold flex items-center gap-2"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>Admin Dashboard</span>
              </Link>
            )}

            {isAuthenticated ? (
              <>
                <Link
                  to="/orders"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-xs uppercase tracking-luxury text-atelier-700"
                >
                  Order History
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="text-left text-xs uppercase tracking-luxury text-red-700"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs uppercase tracking-luxury text-atelier-950 font-medium"
              >
                Sign In / Register
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
