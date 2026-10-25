import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { User, Mail, Lock, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

export const Register = () => {
  const { register } = useAuth();
  const { success, error: toastError } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    if (formData.password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    try {
      setLoading(true);
      setErrorMessage('');
      const user = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      success(`Welcome to Élégance Atelier, ${user.name}`);
      navigate(from, { replace: true });
    } catch (err) {
      setErrorMessage(err.message || 'Registration failed.');
      toastError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
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
            Atelier Membership
          </span>
          <h2 className="font-serif text-xl text-atelier-900 pt-2 font-normal">
            Create Your Account
          </h2>
        </div>

        {errorMessage && (
          <div className="p-3 bg-red-50 border border-red-200 text-xs text-red-800">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block uppercase tracking-wider text-atelier-600 font-semibold mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Eleanor Vance"
                required
                className="w-full bg-atelier-50 border border-atelier-200 p-3.5 pl-10 text-atelier-900 focus:outline-none focus:border-atelier-950 text-xs"
              />
              <User className="w-4 h-4 text-atelier-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

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
                placeholder="eleanor@atelier.com"
                required
                className="w-full bg-atelier-50 border border-atelier-200 p-3.5 pl-10 text-atelier-900 focus:outline-none focus:border-atelier-950 text-xs"
              />
              <Mail className="w-4 h-4 text-atelier-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block uppercase tracking-wider text-atelier-600 font-semibold mb-1.5">
              Password (min. 6 characters)
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

          <div>
            <label className="block uppercase tracking-wider text-atelier-600 font-semibold mb-1.5">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
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
            className="w-full py-4 bg-atelier-950 text-white text-xs uppercase tracking-luxury font-medium hover:bg-atelier-800 disabled:opacity-50 transition-colors flex items-center justify-center gap-2 shadow-md pt-2"
          >
            {loading ? <span>Creating Account...</span> : <span>Register Account</span>}
          </button>
        </form>

        <div className="text-center text-xs text-atelier-600">
          <span>Already have an account? </span>
          <Link
            to="/login"
            state={{ from: location.state?.from }}
            className="text-atelier-950 font-semibold hover:underline"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};
