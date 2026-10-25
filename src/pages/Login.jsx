import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Lock, Mail, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

export const Login = () => {
  const { login } = useAuth();
  const { success, error: toastError } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setErrorMessage('');
      const user = await login(formData);
      success(`Welcome back, ${user.name}`);
      navigate(user.role === 'admin' && from === '/' ? '/admin' : from, { replace: true });
    } catch (err) {
      setErrorMessage(err.message || 'Invalid credentials.');
      toastError(err.message || 'Failed to sign in.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoFill = (type) => {
    if (type === 'admin') {
      setFormData({
        email: 'admin@atelier.com',
        password: 'AdminPassword123!'
      });
    } else {
      setFormData({
        email: 'sophia@atelier.com',
        password: 'CustomerPassword123!'
      });
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-16 px-4">
      <div className="max-w-md w-full bg-white border border-atelier-200 p-8 sm:p-10 shadow-lg space-y-8">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <span className="font-serif text-2xl tracking-[0.2em] uppercase text-atelier-950 font-medium block">
            Élégance
          </span>
          <span className="text-[10px] tracking-[0.3em] uppercase text-atelier-gold font-semibold block">
            Client Portal
          </span>
          <h2 className="font-serif text-xl text-atelier-900 pt-2 font-normal">
            Sign In to Your Account
          </h2>
        </div>

        {errorMessage && (
          <div className="p-3 bg-red-50 border border-red-200 text-xs text-red-800">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 text-xs">
          <div>
            <label className="block uppercase tracking-wider text-atelier-600 font-semibold mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="sophia@atelier.com"
                required
                className="w-full bg-atelier-50 border border-atelier-200 p-3.5 pl-10 text-atelier-900 focus:outline-none focus:border-atelier-950 text-xs"
              />
              <Mail className="w-4 h-4 text-atelier-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block uppercase tracking-wider text-atelier-600 font-semibold mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••••••"
                required
                className="w-full bg-atelier-50 border border-atelier-200 p-3.5 pl-10 text-atelier-900 focus:outline-none focus:border-atelier-950 text-xs"
              />
              <Lock className="w-4 h-4 text-atelier-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-atelier-950 text-white text-xs uppercase tracking-luxury font-medium hover:bg-atelier-800 disabled:opacity-50 transition-colors flex items-center justify-center gap-2 shadow-md"
          >
            {loading ? <span>Verifying...</span> : <span>Sign In</span>}
          </button>
        </form>

        {/* Demo Fast Login Buttons for testing */}
        <div className="pt-4 border-t border-atelier-150 space-y-2.5">
          <span className="block text-center text-[10px] uppercase tracking-wider text-atelier-400 font-semibold">
            One-Click Test Accounts
          </span>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <button
              type="button"
              onClick={() => handleDemoFill('customer')}
              className="p-2 border border-atelier-200 bg-atelier-50 hover:bg-atelier-100 text-atelier-800 transition-colors text-center"
            >
              Fill <strong>Customer</strong>
            </button>
            <button
              type="button"
              onClick={() => handleDemoFill('admin')}
              className="p-2 border border-atelier-gold/40 bg-atelier-50 hover:bg-amber-50/60 text-amber-900 transition-colors text-center"
            >
              Fill <strong>Admin</strong>
            </button>
          </div>
        </div>

        <div className="text-center text-xs text-atelier-600">
          <span>New to Élégance Atelier? </span>
          <Link
            to="/register"
            state={{ from: location.state?.from }}
            className="text-atelier-950 font-semibold hover:underline"
          >
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
};
