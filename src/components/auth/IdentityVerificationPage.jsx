import React, { useState } from 'react';
import { ShieldCheck, Fingerprint, ArrowRight, CheckCircle2, MessageCircle, X } from 'lucide-react';
import { apiService } from '../../services/api';
import { OnboardingProgress } from './RegisterPage';

export function IdentityVerificationPage({ user, onVerified }) {
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [aadhaar, setAadhaar] = useState('');
  const [otp, setOtp] = useState('');
  const [referenceId, setReferenceId] = useState('');
  const [step, setStep] = useState('form'); // 'form' | 'otp' | 'success'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const formatAadhaar = (val) => {
    const digits = val.replace(/\D/g, '').slice(0, 12);
    return digits.replace(/(\d{4})(\d{0,4})(\d{0,4})/, (_, a, b, c) =>
      [a, b, c].filter(Boolean).join(' ')
    );
  };

  const handleInitiate = async (e) => {
    e.preventDefault();
    setError('');
    if (!fullName.trim()) { setError('Full name is required.'); return; }
    const cleanAadhaar = aadhaar.replace(/\s/g, '');
    if (cleanAadhaar.length !== 12 || !/^\d+$/.test(cleanAadhaar)) {
      setError('Aadhaar number must be exactly 12 numeric digits.'); return;
    }

    setLoading(true);
    try {
      const res = await apiService.initiateIdentityVerification(user.id, fullName, cleanAadhaar);
      if (res.success) {
        setReferenceId(res.reference_id || '');
        setStep('otp');
      } else {
        setError(res.message || 'Failed to initiate verification.');
      }
    } catch (err) {
      setError(err.message || 'Verification initiation failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (e) => {
    e.preventDefault();
    setError('');
    if (!otp.trim()) { setError('OTP code is required.'); return; }

    setLoading(true);
    try {
      const cleanAadhaar = aadhaar.replace(/\s/g, '');
      const updatedUser = await apiService.confirmIdentityVerification(
        user.id,
        referenceId,
        otp,
        fullName,
        cleanAadhaar
      );
      setStep('success');
      setTimeout(() => onVerified(updatedUser), 1800);
    } catch (err) {
      setError(err.message || 'OTP verification failed.');
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
          <h1 className="text-2xl font-extrabold text-slate-900">Identity Verification</h1>
          <p className="text-xs text-slate-500 mt-1">
            Required before accessing the Nagar Seva AI platform
          </p>
        </div>

        {/* Progress */}
        <OnboardingProgress step={3} />

        {/* Success State */}
        {step === 'success' && (
          <div className="bg-white border border-emerald-200 rounded-2xl p-8 mt-6 text-center shadow-sm space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto text-emerald-600">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h3 className="font-extrabold text-emerald-900 text-xl">Identity Verified!</h3>
            <p className="text-xs text-slate-500">
              Your Aadhaar identity has been successfully verified. Redirecting to the platform...
            </p>
          </div>
        )}

        {/* OTP Step */}
        {step === 'otp' && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mt-6">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-5 text-xs text-blue-800 font-medium">
              An OTP has been dispatched to the mobile number linked to your Aadhaar card.
              <span className="block font-bold mt-1">Reference ID: {referenceId}</span>
              <span className="block text-[11px] text-blue-600 mt-0.5">Mock OTP for testing: <strong>123456</strong></span>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl">
                {error}
              </div>
            )}

            <form onSubmit={handleConfirm} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">6-Digit OTP Code</label>
                <input
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="1 2 3 4 5 6"
                  className="w-full px-4 py-3 text-lg text-center font-bold tracking-widest rounded-xl border border-slate-300 focus:outline-none focus:border-blue-600"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{loading ? 'Verifying...' : 'Confirm Identity'}</span>
              </button>

              <button
                type="button"
                onClick={() => { setStep('form'); setOtp(''); setError(''); }}
                className="w-full text-xs text-slate-500 hover:text-slate-700 font-medium underline"
              >
                ← Go back and change Aadhaar details
              </button>
            </form>
          </div>
        )}

        {/* Form Step */}
        {step === 'form' && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mt-6">
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-5 text-xs text-amber-800 font-medium leading-relaxed">
              <strong>Privacy Notice:</strong> Your raw Aadhaar number is <strong>never stored</strong>.
              Only the last 4 digits and a reference ID are retained for record-keeping.
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl">
                {error}
              </div>
            )}

            <form onSubmit={handleInitiate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Full Name (as on Aadhaar)</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="Rahul Kumar Sharma"
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">12-Digit Aadhaar Number</label>
                <div className="relative">
                  <Fingerprint className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    value={aadhaar}
                    onChange={e => setAadhaar(formatAadhaar(e.target.value))}
                    placeholder="1234 5678 9012"
                    className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-blue-600 tracking-wider font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{loading ? 'Sending OTP...' : 'Send Aadhaar OTP'}</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
