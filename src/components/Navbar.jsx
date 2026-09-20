import React from 'react';
import { ShieldCheck, UserCheck, PlusCircle, Shield, LogOut, CheckCircle2 } from 'lucide-react';

export function Navbar({ user, isAdmin, onOpenAuth, onOpenCreate, onToggleAdmin, onLogout }) {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => isAdmin && onToggleAdmin(false)}>
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-200">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg text-slate-900 tracking-tight">Nagar Seva AI</span>
              <span className="text-[10px] font-semibold tracking-wider text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full uppercase">
                MVP
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">Citizen Civic Intelligence Platform</p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          
          {/* Create Complaint Button */}
          {!isAdmin && (
            <button
              onClick={onOpenCreate}
              className="btn-blue shadow-sm shadow-blue-200"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Report Issue</span>
            </button>
          )}

          {/* Citizen Verification / Login Badge */}
          {!isAdmin && (
            user ? (
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-700">
                {user.is_verified ? (
                  <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Verified Citizen
                  </span>
                ) : (
                  <button onClick={onOpenAuth} className="text-blue-600 font-medium hover:underline">
                    Verify Aadhaar
                  </button>
                )}
                <button
                  onClick={onLogout}
                  title="Log out"
                  className="text-slate-400 hover:text-slate-600 ml-1"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="btn-outline text-xs py-1.5"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Citizen Login</span>
              </button>
            )
          )}

          {/* Admin Panel Toggle */}
          <button
            onClick={() => onToggleAdmin(!isAdmin)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
              isAdmin
                ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
            }`}
          >
            {isAdmin ? 'Exit Admin' : 'Admin Panel'}
          </button>
        </div>
      </div>
    </header>
  );
}
