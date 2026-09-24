import React, { useState } from 'react';
import { LogIn, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { authService } from '../../services/authService';
import { OnboardingProgress } from './RegisterPage';

export function LoginPage({ onLoggedIn, onGoToRegister }) {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!emailOrPhone.trim()) { setError('Email or phone number is required.'); return; }
    if (!password) { setError('Password is required.'); return; }

    setLoading(true);
    try {
      const user = await authService.login({ emailOrPhone, password });
      onLoggedIn(user);
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">

        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-extrabold text-xl mx-auto mb-4 shadow-lg shadow-blue-200">
            NS
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">Sign In to Nagar Seva AI</h1>
          <p className="text-xs text-slate-500 mt-1">Official Government Civic Infrastructure Portal</p>
        </div>

        {/* Progress */}
        <OnboardingProgress step={2} />

        {/* Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mt-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Email or Phone Number</label>
              <input
                type="text"
                value={emailOrPhone}
                onChange={e => setEmailOrPhone(e.target.value)}
                placeholder="rahul@example.com or +919876543210"
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 pr-10 text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-blue-600"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(p => !p)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              <span>{loading ? 'Signing In...' : 'Sign In'}</span>
            </button>
          </form>

          <p className="text-center text-xs text-slate-500 mt-4">
            Don't have an account?{' '}
            <button onClick={onGoToRegister} className="text-blue-600 font-bold hover:underline">
              Register Now
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
