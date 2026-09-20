import React, { useState } from 'react';
import { X, Phone, Lock, ShieldCheck, User, Fingerprint, CheckCircle2 } from 'lucide-react';
import { apiService } from '../services/api';

export function AuthModal({ isOpen, onClose, onAuthSuccess, existingUser }) {
  const [step, setStep] = useState(existingUser ? 2 : 1);
  const [phone, setPhone] = useState(existingUser?.phone_number || '');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState(existingUser?.name || '');
  const [aadhaar, setAadhaar] = useState(existingUser?.aadhaar_number || '');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    if (phone.length < 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }
    setLoading(true);
    try {
      await apiService.sendOtp(phone);
      setOtpSent(true);
    } catch (err) {
      setError('Failed to send OTP. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    if (!otp) {
      setError('Please enter the OTP code.');
      return;
    }
    setLoading(true);
    try {
      const user = await apiService.verifyOtp(phone, otp);
      setStep(2);
      onAuthSuccess(user);
    } catch (err) {
      setError('Invalid OTP code. Please use 123456.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAadhaar = async (e) => {
    e.preventDefault();
    setError('');
    if (!name.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (aadhaar.length !== 12 || !/^\d+$/.test(aadhaar)) {
      setError('Aadhaar number must be exactly 12 numeric digits.');
      return;
    }
    setLoading(true);
    try {
      const currentUser = apiService.getCurrentUser() || existingUser;
      const updatedUser = await apiService.verifyAadhaar(
        currentUser?.id || 'USER-TEMP',
        name,
        phone || currentUser?.phone_number,
        aadhaar
      );
      onAuthSuccess(updatedUser);
      onClose();
    } catch (err) {
      setError(err.message || 'Verification failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
            {step === 1 ? <Phone className="w-6 h-6" /> : <Fingerprint className="w-6 h-6" />}
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-lg">
              {step === 1 ? 'Citizen Phone Login' : 'Aadhaar Profile Verification'}
            </h3>
            <p className="text-xs text-slate-500">
              {step === 1 ? 'Enter your mobile number to receive OTP' : 'Verify identity to support public complaints'}
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
            {error}
          </div>
        )}

        {/* STEP 1: Phone + OTP */}
        {step === 1 && (
          <form onSubmit={otpSent ? handleVerifyOtp : handleSendOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Mobile Phone Number</label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs font-semibold text-slate-400">+91</span>
                <input
                  type="tel"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder="9876543210"
                  disabled={otpSent}
                  className="w-full pl-12 pr-4 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:border-blue-500 disabled:bg-slate-50"
                />
              </div>
            </div>

            {otpSent && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-700">Enter OTP Code</label>
                  <span className="text-[10px] text-blue-600 font-semibold bg-blue-50 px-2 py-0.5 rounded">Mock OTP: 123456</span>
                </div>
                <input
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="123456"
                  className="w-full px-4 py-2 text-sm text-center tracking-widest font-bold rounded-lg border border-slate-300 focus:outline-none focus:border-blue-500"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-blue py-2.5 text-sm font-semibold"
            >
              {loading ? 'Processing...' : otpSent ? 'Verify OTP & Continue' : 'Get OTP Code'}
            </button>
          </form>
        )}

        {/* STEP 2: Mock Aadhaar Profile Verification */}
        {step === 2 && (
          <form onSubmit={handleVerifyAadhaar} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Citizen Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Rahul Sharma"
                  className="w-full pl-10 pr-4 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Mobile Number</label>
              <input
                type="text"
                disabled
                value={phone}
                className="w-full px-4 py-2 text-sm bg-slate-100 text-slate-600 rounded-lg border border-slate-200"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700">12-Digit Aadhaar Number</label>
                <span className="text-[10px] text-slate-400">Mock verification flow</span>
              </div>
              <div className="relative">
                <Fingerprint className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  maxLength={12}
                  value={aadhaar}
                  onChange={(e) => setAadhaar(e.target.value.replace(/\D/g, ''))}
                  placeholder="1234 5678 9012"
                  className="w-full pl-10 pr-4 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:border-blue-500 tracking-wider"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-blue py-2.5 text-sm font-semibold flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{loading ? 'Verifying...' : 'Complete Verification'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
