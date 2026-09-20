import React, { useState } from 'react';
import { Filter, Calendar, MapPin, PlusCircle } from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';
import { EmptyState } from '../common/EmptyState';

export function MyReportsPage({
  complaints,
  currentUser,
  onNavigate,
  onSelectComplaint
}) {
  const [statusFilter, setStatusFilter] = useState('All');

  if (!currentUser) {
    return (
      <EmptyState
        title="Login Required"
        description="Please log in with your phone number to track your submitted reports."
        actionText="Log In Now"
        onAction={() => {}}
      />
    );
  }

  // Filter complaints submitted by current user (or mock matches)
  const myComplaints = complaints.filter(
    c => c.citizen_id === currentUser.id || c.citizen_name === currentUser.name
  );

  const filtered = myComplaints.filter(
    c => statusFilter === 'All' || c.status === statusFilter
  );

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Submitted Reports</h1>
          <p className="text-xs text-slate-500 mt-1">
            Track real-time resolution states for civic grievances submitted under your citizen profile.
          </p>
        </div>

        <button
          onClick={() => onNavigate('report')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Report New Issue</span>
        </button>
      </div>

      {/* Filter Dropdown */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-center justify-between">
        <div className="text-xs font-bold text-slate-700">
          Showing {filtered.length} of {myComplaints.length} Submitted Reports
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-semibold text-slate-600">Filter Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-700 focus:outline-none focus:border-blue-600"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Reports List */}
      {filtered.length === 0 ? (
        <EmptyState
          title="No Submitted Reports Found"
          description="You haven't submitted any complaints matching this filter yet."
          actionText="Report an Issue Now"
          onAction={() => onNavigate('report')}
        />
      ) : (
        <div className="space-y-4">
          {filtered.map((c) => (
            <div
              key={c.id}
              onClick={() => onSelectComplaint(c)}
              className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:border-blue-300 cursor-pointer transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <img src={c.image_url} alt="" className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0" />
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <StatusBadge status={c.status} />
                    <span className="text-xs font-bold text-slate-800">{c.category}</span>
                    <span className="text-[10px] text-slate-400 font-mono">ID: {c.id}</span>
                  </div>
                  <div className="text-xs font-bold text-slate-900 truncate max-w-md">{c.location}</div>
                  <div className="text-xs text-slate-500 line-clamp-1">{c.description || c.ai_summary}</div>
                </div>
              </div>

              <div className="text-right text-xs text-slate-500 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 w-full sm:w-auto flex sm:flex-col justify-between items-center sm:items-end">
                <span className="font-semibold text-blue-700">👍 {c.support_count || 0} Supports</span>
                <span className="text-[11px] text-slate-400">Updated: {new Date(c.updated_at || c.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
