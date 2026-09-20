import React, { useState } from 'react';
import { Search, Filter, CheckCircle2, XCircle, Eye, ChevronDown } from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';
import { SeverityBadge } from '../common/SeverityBadge';

export function AdminComplaintsTable({
  complaints,
  onUpdateStatus,
  onSelectComplaint
}) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [updatingId, setUpdatingId] = useState(null);

  const handleStatusChange = async (id, newStatus) => {
    setUpdatingId(id);
    try {
      await onUpdateStatus(id, newStatus);
    } catch (err) {
      alert(err.message || 'Status update failed.');
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = complaints.filter(c => {
    const matchesStat = statusFilter === 'All' || c.status === statusFilter;
    const q = search.toLowerCase();
    const matchesSearch = !search ||
      (c.location && c.location.toLowerCase().includes(q)) ||
      (c.description && c.description.toLowerCase().includes(q)) ||
      (c.citizen_name && c.citizen_name.toLowerCase().includes(q)) ||
      (c.category && c.category.toLowerCase().includes(q)) ||
      (c.id && c.id.toLowerCase().includes(q));

    return matchesStat && matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Complaints Operations Table</h1>
          <p className="text-xs text-slate-500 mt-0.5">Filter, inspect, and transition grievance resolution status</p>
        </div>
      </div>

      {/* Filter & Search Controls */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col sm:flex-row gap-3 justify-between items-center">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search ID, citizen, location..."
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:border-blue-600 bg-slate-50"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-semibold text-slate-600">Filter Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-700 focus:outline-none focus:border-blue-600"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Operations Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 uppercase tracking-wider">
              <tr>
                <th className="p-4">ID</th>
                <th className="p-4">Citizen</th>
                <th className="p-4">Category</th>
                <th className="p-4">Location</th>
                <th className="p-4">Status</th>
                <th className="p-4">Created Date</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400 font-medium">
                    No complaints match the filter.
                  </td>
                </tr>
              ) : (
                filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* ID */}
                    <td className="p-4 font-mono font-bold text-slate-900">
                      {c.id}
                    </td>

                    {/* Citizen */}
                    <td className="p-4">
                      <div className="font-bold text-slate-900">{c.citizen_name}</div>
                      <div className="text-[10px] text-blue-700 font-semibold">👍 {c.support_count || 0} supports</div>
                    </td>

                    {/* Category */}
                    <td className="p-4 font-semibold text-slate-800">
                      {c.category}
                    </td>

                    {/* Location */}
                    <td className="p-4 text-slate-600 max-w-[180px] truncate" title={c.location}>
                      {c.location}
                    </td>

                    {/* Status */}
                    <td className="p-4">
                      <StatusBadge status={c.status} />
                    </td>

                    {/* Created Date */}
                    <td className="p-4 text-slate-500">
                      {new Date(c.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => onSelectComplaint(c)}
                        title="View Details"
                        className="btn-outline text-xs px-2.5 py-1 text-slate-600 hover:text-slate-900"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      <select
                        disabled={updatingId === c.id}
                        value={c.status}
                        onChange={(e) => handleStatusChange(c.id, e.target.value)}
                        className="text-xs font-semibold bg-white border border-slate-300 rounded-lg px-2 py-1 text-slate-800 focus:outline-none focus:border-blue-600 cursor-pointer shadow-sm"
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Mark Resolved</option>
                        <option value="Rejected">Reject Issue</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
