import React from 'react';
import { LayoutDashboard, FileText, BarChart3, Shield, LogOut } from 'lucide-react';

export function AdminSidebar({ activeAdminTab, onAdminTabChange, onExitAdmin }) {
  const adminTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'complaints', label: 'Complaints', icon: FileText },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 }
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 min-h-[calc(100vh-4rem)] border-r border-slate-800">
      {/* Admin Title */}
      <div className="p-4 border-b border-slate-800 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
          <Shield className="w-4 h-4" />
        </div>
        <div>
          <div className="font-bold text-white text-sm">Authority Admin</div>
          <div className="text-[10px] text-slate-400">Municipal Command Center</div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="p-3 space-y-1 flex-1">
        {adminTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeAdminTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onAdminTabChange(tab.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-blue-600 text-white font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Exit Admin Footer */}
      <div className="p-3 border-t border-slate-800">
        <button
          onClick={onExitAdmin}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-all border border-slate-800"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Exit Admin Interface</span>
        </button>
      </div>
    </aside>
  );
}
