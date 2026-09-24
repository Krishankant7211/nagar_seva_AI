import React from 'react';
import { User, Phone, Mail, Fingerprint, ShieldCheck, CheckCircle2, LogOut, MessageCircle, AlertCircle } from 'lucide-react';
import { EmptyState } from '../common/EmptyState';

export function ProfilePage({ currentUser, onOpenAuth, onLogout, onInitiateVerification }) {
  if (!currentUser) {
    return (
      <EmptyState
        title="No Citizen Profile Found"
        description="Please log in to access your verified citizen profile."
        actionText="Log In Now"
        onAction={onOpenAuth}
      />
    );
  }

  const displayName = currentUser.full_name || currentUser.name || 'Citizen';
  const isVerified = currentUser.is_aadhaar_verified || currentUser.is_verified;

  return (
    <div className="max-w-md mx-auto space-y-6">

      {/* Title */}
      <div className="border-b border-slate-200 pb-4 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Citizen Profile</h1>
        <p className="text-xs text-slate-500 mt-1">Official Municipal Identity Record</p>
      </div>

      {/* Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">

        {/* Avatar & Status */}
        <div className="flex flex-col items-center justify-center text-center space-y-2 pb-6 border-b border-slate-100">
          <div className="w-16 h-16 rounded-full bg-blue-100 border-2 border-blue-200 text-blue-700 flex items-center justify-center font-bold text-xl">
            {displayName[0].toUpperCase()}
          </div>
          <div>
            <h3 className="font-bold text-lg text-slate-900">{displayName}</h3>
            <span className="text-xs text-slate-400 font-mono">User ID: {currentUser.id}</span>
          </div>

          <div>
            {isVerified ? (
              <span className="inline-flex items-center gap-1 bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold px-3 py-1 rounded-full text-xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Aadhaar Verified Citizen</span>
              </span>
            ) : (
              <button
                onClick={onInitiateVerification || onOpenAuth}
                className="inline-flex items-center gap-1 bg-amber-50 border border-amber-200 text-amber-800 font-bold px-3 py-1 rounded-full text-xs hover:bg-amber-100 transition-colors"
              >
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Aadhaar Verification Pending — Click to Verify</span>
              </button>
            )}
          </div>
        </div>

        {/* Profile Details */}
        <div className="space-y-3 text-xs">

          {/* Full Name */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-2.5 text-slate-600">
              <User className="w-4 h-4 text-slate-400" />
              <span className="font-medium">Full Name</span>
            </div>
            <span className="font-bold text-slate-900">{displayName}</span>
          </div>

          {/* Email */}
          {currentUser.email && (
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-2.5 text-slate-600">
                <Mail className="w-4 h-4 text-slate-400" />
                <span className="font-medium">Email</span>
              </div>
              <span className="font-mono font-bold text-slate-900">{currentUser.email}</span>
            </div>
          )}

          {/* Phone */}
          {currentUser.phone_number && (
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-2.5 text-slate-600">
                <Phone className="w-4 h-4 text-slate-400" />
                <span className="font-medium">Mobile Number</span>
              </div>
              <span className="font-mono font-bold text-slate-900">{currentUser.phone_number}</span>
            </div>
          )}

          {/* Aadhaar (masked) */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-2.5 text-slate-600">
              <Fingerprint className="w-4 h-4 text-slate-400" />
              <span className="font-medium">Aadhaar Number</span>
            </div>
            <span className="font-mono font-bold text-slate-900">
              {currentUser.aadhaar_last4
                ? `XXXX-XXXX-${currentUser.aadhaar_last4}`
                : currentUser.aadhaar_number
                ? `XXXX-XXXX-${currentUser.aadhaar_number.slice(-4)}`
                : '—'}
            </span>
          </div>

          {/* WhatsApp Status */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-2.5 text-slate-600">
              <MessageCircle className="w-4 h-4 text-slate-400" />
              <span className="font-medium">WhatsApp Linked</span>
            </div>
            {currentUser.whatsapp_number ? (
              <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {currentUser.whatsapp_number}
              </span>
            ) : (
              <span className="text-slate-400 font-medium">Not Linked</span>
            )}
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={onLogout}
          className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition-all border border-slate-200"
        >
          <LogOut className="w-4 h-4 text-slate-500" />
          <span>Log Out Citizen Session</span>
        </button>
      </div>
    </div>
  );
}
