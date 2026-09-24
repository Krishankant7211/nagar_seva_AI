import React, { useState } from 'react';
import { Shield, Mail, Phone, Eye, EyeOff, ArrowRight, CheckCircle2 } from 'lucide-react';
import { authService } from '../../services/authService';

export function RegisterPage({ onRegistered, onGoToLogin }) {
  const [mode, setMode] = useState('email'); // 'email' | 'phone'
  const [fullName, setFullName] = useState('');
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!fullName.trim()) { setError('Full name is required.'); return; }
    if (!emailOrPhone.trim()) { setError(`${mode === 'email' ? 'Email address' : 'Phone number'} is required.`); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }

    setLoading(true);
    try {
      const user = await authService.register({
        email: mode === 'email' ? emailOrPhone : null,
        phone: mode === 'phone' ? emailOrPhone : null,
        password,
        fullName
      });
      onRegistered(user);
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
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
          <h1 className="text-2xl font-extrabold text-slate-900">Create Citizen Account</h1>
          <p className="text-xs text-slate-500 mt-1">Nagar Seva AI • Official Government Civic Portal</p>
        </div>

        {/* Progress Stepper */}
        <OnboardingProgress step={1} />

        {/* Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mt-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl">
              {error}
            </div>
          )}

          {/* Mode Toggle */}
          <div className="flex bg-slate-100 rounded-xl p-1 mb-5">
            <button
              type="button"
              onClick={() => { setMode('email'); setEmailOrPhone(''); }}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all ${mode === 'email' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500'}`}
            >
              <Mail className="w-3.5 h-3.5" /> Email
            </button>
            <button
              type="button"
              onClick={() => { setMode('phone'); setEmailOrPhone(''); }}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all ${mode === 'phone' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500'}`}
            >
              <Phone className="w-3.5 h-3.5" /> Phone
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder="Rahul Sharma"
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-blue-600"
              />
            </div>

            {/* Email or Phone */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {mode === 'email' ? 'Email Address' : 'Mobile Number'}
              </label>
              <input
                type={mode === 'email' ? 'email' : 'tel'}
                value={emailOrPhone}
                onChange={e => setEmailOrPhone(e.target.value)}
                placeholder={mode === 'email' ? 'rahul@example.com' : '+91 98765 43210'}
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-blue-600"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
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
              <span>{loading ? 'Creating Account...' : 'Create Account'}</span>
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          <p className="text-center text-xs text-slate-500 mt-4">
            Already have an account?{' '}
            <button onClick={onGoToLogin} className="text-blue-600 font-bold hover:underline">
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export function OnboardingProgress({ step }) {
  const steps = [
    { n: 1, label: 'Register' },
    { n: 2, label: 'Login' },
    { n: 3, label: 'Verify Identity' },
    { n: 4, label: 'Access Platform' }
  ];

  return (
    <div className="flex items-center justify-between relative px-2">
      {/* Connector line */}
      <div className="absolute top-4 left-6 right-6 h-0.5 bg-slate-200 z-0" />
      {steps.map((s, i) => (
        <div key={s.n} className="flex flex-col items-center z-10 relative">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
            step > s.n
              ? 'bg-emerald-500 border-emerald-500 text-white'
              : step === s.n
              ? 'bg-blue-600 border-blue-600 text-white'
              : 'bg-white border-slate-300 text-slate-400'
          }`}>
            {step > s.n ? <CheckCircle2 className="w-4 h-4" /> : s.n}
          </div>
          <span className={`text-[10px] font-semibold mt-1.5 ${step === s.n ? 'text-blue-700' : 'text-slate-400'}`}>
            {s.label}
          </span>
        </div>
      ))}
    </div>
  );
}
