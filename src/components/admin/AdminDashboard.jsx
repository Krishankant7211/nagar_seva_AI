import React from 'react';
import { LayoutDashboard, Clock, RefreshCw, CheckCircle2, XCircle, AlertTriangle, ShieldAlert } from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';
import { SeverityBadge } from '../common/SeverityBadge';

export function AdminDashboardView({ analytics, complaints, onSelectComplaint, onNavigateToTab }) {
  const pendingItems = complaints.filter(c => c.status === 'Pending').slice(0, 4);

  return (
    <div className="space-y-8">
      
      {/* Overview Title */}
      <div className="border-b border-slate-200 pb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Municipal Command Dashboard</h1>
          <p className="text-xs text-slate-500 mt-1">Operational resolution metrics and urgent civic queue</p>
        </div>
        <button
          onClick={() => onNavigateToTab('complaints')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-4 py-2 rounded-xl transition-all shadow-sm"
        >
          Manage All Complaints
        </button>
      </div>

      {/* 5 Analytics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-1">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Complaints</div>
          <div className="text-3xl font-extrabold text-slate-900">{analytics.total_complaints || complaints.length}</div>
          <p className="text-[11px] text-slate-400">Total logged grievances</p>
        </div>

        <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-5 shadow-sm space-y-1">
          <div className="text-xs font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>Pending</span>
          </div>
          <div className="text-3xl font-extrabold text-amber-900">{analytics.pending || 0}</div>
          <p className="text-[11px] text-amber-700">Awaiting inspection</p>
        </div>

        <div className="bg-sky-50/70 border border-sky-200 rounded-xl p-5 shadow-sm space-y-1">
          <div className="text-xs font-bold text-sky-800 uppercase tracking-wider flex items-center gap-1">
            <RefreshCw className="w-3.5 h-3.5" />
            <span>In Progress</span>
          </div>
          <div className="text-3xl font-extrabold text-sky-900">{analytics.in_progress || 0}</div>
          <p className="text-[11px] text-sky-700">Active maintenance</p>
        </div>

        <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-5 shadow-sm space-y-1">
          <div className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Resolved</span>
          </div>
          <div className="text-3xl font-extrabold text-emerald-900">{analytics.resolved || 0}</div>
          <p className="text-[11px] text-emerald-700">Completed repairs</p>
        </div>

        <div className="bg-red-50/70 border border-red-200 rounded-xl p-5 shadow-sm space-y-1">
          <div className="text-xs font-bold text-red-800 uppercase tracking-wider flex items-center gap-1">
            <XCircle className="w-3.5 h-3.5" />
            <span>Rejected</span>
          </div>
          <div className="text-3xl font-extrabold text-red-900">{analytics.rejected || 0}</div>
          <p className="text-[11px] text-red-700">Invalid / Duplicates</p>
        </div>
      </div>

      {/* Urgent Pending Queue */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-amber-600" />
            <h3 className="font-bold text-slate-900 text-base">Urgent Inspection Queue</h3>
          </div>
          <span className="text-xs font-semibold text-slate-400">High Severity First</span>
        </div>

        <div className="divide-y divide-slate-100">
          {pendingItems.length === 0 ? (
            <div className="py-6 text-center text-xs text-slate-400">
              No pending complaints requiring immediate verification.
            </div>
          ) : (
            pendingItems.map((c) => (
              <div
                key={c.id}
                onClick={() => onSelectComplaint(c)}
                className="py-3 flex items-center justify-between hover:bg-slate-50 rounded-lg px-2 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3">
                  <img src={c.image_url} alt="" className="w-10 h-10 rounded-lg object-cover border border-slate-200" />
                  <div>
                    <div className="font-bold text-xs text-slate-900">{c.category} • {c.location}</div>
                    <div className="text-[11px] text-slate-500 line-clamp-1">{c.description || c.ai_summary}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <SeverityBadge severity={c.estimated_severity} />
                  <span className="text-xs text-blue-600 font-bold hover:underline">Review &rarr;</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
