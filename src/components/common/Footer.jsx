import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Truck, RotateCcw, Sparkles } from 'lucide-react';
import { useToast } from '../../context/ToastContext.jsx';

export const Footer = () => {
  const [email, setEmail] = useState('');
  const { success } = useToast();

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      success('Thank you for subscribing to the Élégance Atelier Gazette.');
      setEmail('');
    }
  };

  return (
    <footer className="bg-atelier-950 text-atelier-200 pt-16 pb-12 border-t border-atelier-800">
      {/* Brand Guarantees Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 mb-16 pb-12 border-b border-atelier-800/80">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center md:text-left">
          <div className="flex flex-col items-center md:items-start">
            <Sparkles className="w-5 h-5 text-atelier-gold mb-3" />
            <h5 className="font-serif text-sm text-white uppercase tracking-wider mb-1">
              Artisanal Craftsmanship
            </h5>
            <p className="text-xs text-atelier-400">
              Hand-stitched in Tuscany using certified full-grain Italian leathers.
            </p>
          </div>

          <div className="flex flex-col items-center md:items-start">
            <Truck className="w-5 h-5 text-atelier-gold mb-3" />
            <h5 className="font-serif text-sm text-white uppercase tracking-wider mb-1">
              Complimentary Delivery
            </h5>
            <p className="text-xs text-atelier-400">
              Global express shipping included on all orders over $250.
            </p>
          </div>

          <div className="flex flex-col items-center md:items-start">
            <RotateCcw className="w-5 h-5 text-atelier-gold mb-3" />
            <h5 className="font-serif text-sm text-white uppercase tracking-wider mb-1">
              30-Day Courtesy Returns
            </h5>
            <p className="text-xs text-atelier-400">
              Complimentary return shipping and exchanges worldwide.
            </p>
          </div>

          <div className="flex flex-col items-center md:items-start">
            <ShieldCheck className="w-5 h-5 text-atelier-gold mb-3" />
            <h5 className="font-serif text-sm text-white uppercase tracking-wider mb-1">
              Lifetime Guarantee
            </h5>
            <p className="text-xs text-atelier-400">
              Every creation is backed by our comprehensive warranty for craftsmanship.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-atelier-800/80">
          {/* Brand Column */}
          <div className="md:col-span-4 space-y-4">
            <Link to="/" className="inline-block">
              <span className="font-serif text-2xl tracking-[0.2em] uppercase text-white font-medium block">
                Élégance
              </span>
              <span className="text-[10px] tracking-[0.4em] uppercase text-atelier-gold font-sans font-semibold block -mt-1">
                Atelier Paris
              </span>
            </Link>
            <p className="text-xs text-atelier-400 leading-relaxed max-w-sm">
              Dedicated to the preservation of high-fashion leathercraft. Each handbag is individually constructed by master leather artisans in small, deliberate editions.
            </p>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs uppercase tracking-luxury text-atelier-gold font-medium">
              Collections
            </h4>
            <ul className="space-y-2 text-xs text-atelier-300">
              <li>
                <Link to="/shop?category=Tote%20Bags" className="hover:text-white transition-colors">
                  Tote Bags
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Crossbody%20Bags" className="hover:text-white transition-colors">
                  Crossbody Purses
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Shoulder%20Bags" className="hover:text-white transition-colors">
                  Shoulder Bags
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Clutches%20%26%20Evening" className="hover:text-white transition-colors">
                  Evening Clutches
                </Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-white transition-colors">
                  All Purses
                </Link>
              </li>
            </ul>
          </div>

          {/* Client Care */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs uppercase tracking-luxury text-atelier-gold font-medium">
              Client Concierge
            </h4>
            <ul className="space-y-2 text-xs text-atelier-300">
              <li>
                <Link to="/orders" className="hover:text-white transition-colors">
                  Track Your Order
                </Link>
              </li>
              <li>
                <span className="text-atelier-400 cursor-default">
                  Complimentary Monogramming
                </span>
              </li>
              <li>
                <span className="text-atelier-400 cursor-default">
                  Leather Care & Restoration
                </span>
              </li>
              <li>
                <span className="text-atelier-400 cursor-default">
                  Atelier Boutiques
                </span>
              </li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="text-xs uppercase tracking-luxury text-atelier-gold font-medium">
              The Atelier Gazette
            </h4>
            <p className="text-xs text-atelier-400 leading-relaxed">
              Receive private invitations to seasonal private showcases, bespoke leather editions, and atelier previews.
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="bg-atelier-900 border border-atelier-800 text-xs px-3.5 py-2.5 text-white placeholder:text-atelier-500 flex-1 focus:outline-none focus:border-atelier-gold"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-accent text-accent-foreground text-xs uppercase tracking-luxury font-medium hover:bg-accent-hover transition-colors"
              >
                Join
              </button>
            </form>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-atelier-500 gap-4">
          <p>© {new Date().getFullYear()} Élégance Atelier. All rights reserved.</p>
          <div className="flex gap-6">
            <span className="hover:text-atelier-300 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-atelier-300 cursor-pointer">Terms of Service</span>
            <span className="hover:text-atelier-300 cursor-pointer">Sustainability Charter</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
