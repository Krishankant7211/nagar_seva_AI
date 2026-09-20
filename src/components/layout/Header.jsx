import React from 'react';
import { ShieldCheck, PlusCircle, User, LogOut, Lock, CheckCircle2, LayoutDashboard } from 'lucide-react';

export function Header({
  activeTab,
  onNavigate,
  user,
  isAdmin,
  onOpenAuth,
  onToggleAdmin,
  onLogout
}) {
  const citizenTabs = [
    { id: 'home', label: 'Home' },
    { id: 'report', label: 'Report Issue' },
    { id: 'community', label: 'Community Reports' },
    { id: 'my-reports', label: 'My Reports', requiresUser: true },
    { id: 'profile', label: 'Profile', requiresUser: true }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
      {/* Top National Bar */}
      <div className="bg-slate-900 text-white text-[11px] py-1 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between font-medium">
          <div className="flex items-center gap-2">
            <span className="bg-blue-600 text-white px-1.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider">Official</span>
            <span>Government Public Services & Civic Infrastructure Complaints Portal</span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-slate-300">
            <span>24/7 Helpline: 1800-NAGAR-SEVA</span>
            <span>Language: English</span>
          </div>
        </div>
      </div>

      {/* Main Header Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand & Emblem */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('home')}>
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-200 font-extrabold text-lg">
            NS
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg text-slate-900 tracking-tight">Nagar Seva AI</span>
              <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full uppercase">
                Citizen Portal
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">Civic Complaint Resolution System</p>
          </div>
        </div>

        {/* Navigation Tabs (Citizen View) */}
        {!isAdmin && (
          <nav className="hidden md:flex items-center gap-1">
            {citizenTabs.map((tab) => {
              if (tab.requiresUser && !user) return null;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onNavigate(tab.id)}
                  className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-all ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200/60'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </nav>
        )}

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          
          {/* Quick Report CTA Button */}
          {!isAdmin && (
            <button
              onClick={() => onNavigate('report')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-3.5 py-2 rounded-lg shadow-sm flex items-center gap-1.5 transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Report Issue</span>
            </button>
          )}

          {/* User Auth Status / Login */}
          {!isAdmin && (
            user ? (
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700">
                {user.is_verified ? (
                  <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="hidden sm:inline">Verified Citizen</span>
                  </span>
                ) : (
                  <button onClick={onOpenAuth} className="text-blue-600 font-semibold hover:underline">
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
                className="bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 font-medium text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5"
              >
                <User className="w-3.5 h-3.5 text-slate-500" />
                <span>Citizen Login</span>
              </button>
            )
          )}

          {/* Admin Mode Switcher */}
          <button
            onClick={() => onToggleAdmin(!isAdmin)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all flex items-center gap-1.5 ${
              isAdmin
                ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
            }`}
          >
            <Lock className="w-3 h-3" />
            <span>{isAdmin ? 'Exit Admin' : 'Admin Portal'}</span>
          </button>
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      {!isAdmin && (
        <div className="md:hidden flex items-center justify-around border-t border-slate-100 bg-slate-50/80 px-2 py-2 text-xs overflow-x-auto">
          {citizenTabs.map((tab) => {
            if (tab.requiresUser && !user) return null;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onNavigate(tab.id)}
                className={`px-2.5 py-1 rounded-md text-xs whitespace-nowrap font-medium ${
                  isActive ? 'bg-blue-600 text-white font-bold' : 'text-slate-600'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
}
