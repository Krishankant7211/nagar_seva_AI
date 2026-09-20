import React, { useState, useEffect } from 'react';
import { LayoutDashboard, CheckCircle2, Clock, XCircle, AlertCircle, Search, Filter, RefreshCw, MessageSquare, ChevronDown } from 'lucide-react';
import { apiService } from '../services/api';

export function AdminDashboard({ complaints, onUpdateStatus, onRefresh }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [updatingId, setUpdatingId] = useState(null);
  const [analytics, setAnalytics] = useState({
    total_complaints: complaints.length,
    pending: complaints.filter(c => c.status === 'Pending').length,
    in_progress: complaints.filter(c => c.status === 'In Progress').length,
    resolved: complaints.filter(c => c.status === 'Resolved').length,
    rejected: complaints.filter(c => c.status === 'Rejected').length
  });
  const [waSending, setWaSending] = useState(false);
  const [waSuccess, setWaSuccess] = useState('');

  useEffect(() => {
    fetchAnalytics();
  }, [complaints]);

  const fetchAnalytics = async () => {
    try {
      const data = await apiService.getAdminAnalytics();
      setAnalytics(data);
    } catch (e) {
      setAnalytics({
        total_complaints: complaints.length,
        pending: complaints.filter(c => c.status === 'Pending').length,
        in_progress: complaints.filter(c => c.status === 'In Progress').length,
        resolved: complaints.filter(c => c.status === 'Resolved').length,
        rejected: complaints.filter(c => c.status === 'Rejected').length
      });
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    setUpdatingId(id);
    try {
      await onUpdateStatus(id, newStatus);
      await fetchAnalytics();
    } catch (err) {
      alert(err.message || 'Status update failed.');
    } finally {
      setUpdatingId(null);
    }
  };

  // Simulated WhatsApp Webhook Call
  const handleSimulateWhatsApp = async () => {
    setWaSending(true);
    setWaSuccess('');
    try {
      const res = await fetch('http://localhost:8000/api/v1/whatsapp/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender_phone: '+919988776655',
          media_url: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
          description: 'Automated WhatsApp AI Report: Massive pothole near Ring Road flyover.',
          location_string: 'Ring Road Flyover, Junction 4'
        })
      });
      if (res.ok) {
        setWaSuccess('WhatsApp AI complaint created successfully via Backend Webhook!');
        onRefresh();
      } else {
        throw new Error('FastAPI server offline. Starting fallback.');
      }
    } catch (e) {
      // Fallback local simulation
      const mockComp = await apiService.createComplaint({
        citizen_id: 'USER-WA-BOT',
        citizen_name: 'WhatsApp Bot (+91 9988776655)',
        image_url: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
        description: 'Automated WhatsApp AI Report: Massive pothole near Ring Road flyover.',
        location: 'Ring Road Flyover, Junction 4',
        category: 'Pothole'
      });
      setWaSuccess('WhatsApp AI complaint created locally via API service!');
      onRefresh();
    } finally {
      setWaSending(false);
    }
  };

  const filtered = complaints.filter(c => {
    const matchesStat = statusFilter === 'All' || c.status === statusFilter;
    const q = search.toLowerCase();
    const matchesSearch = !search ||
      (c.location && c.location.toLowerCase().includes(q)) ||
      (c.description && c.description.toLowerCase().includes(q)) ||
      (c.citizen_name && c.citizen_name.toLowerCase().includes(q)) ||
      (c.category && c.category.toLowerCase().includes(q));

    return matchesStat && matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Admin Title & WhatsApp Test Action */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900">Admin Control Panel</h1>
            <span className="bg-slate-900 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full">
              Authority Dashboard
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor analytics metrics, update complaint resolution states, and test WhatsApp AI Agent integration.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSimulateWhatsApp}
            disabled={waSending}
            className="btn-outline text-xs bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100 font-semibold"
          >
            <MessageSquare className="w-4 h-4 text-emerald-600" />
            <span>{waSending ? 'Processing...' : 'Simulate WhatsApp AI Complaint'}</span>
          </button>
          
          <button
            onClick={onRefresh}
            className="btn-outline text-xs p-2 text-slate-600"
            title="Refresh Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {waSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{waSuccess}</span>
        </div>
      )}

      {/* Analytics Counter Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 mb-1">Total Complaints</div>
          <div className="text-2xl font-bold text-slate-900">{analytics.total_complaints || 0}</div>
        </div>
        
        <div className="bg-amber-50/60 border border-amber-200 rounded-xl p-4 shadow-sm">
          <div className="text-xs font-semibold text-amber-800 mb-1 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>Pending</span>
          </div>
          <div className="text-2xl font-bold text-amber-900">{analytics.pending || 0}</div>
        </div>

        <div className="bg-sky-50/60 border border-sky-200 rounded-xl p-4 shadow-sm">
          <div className="text-xs font-semibold text-sky-800 mb-1 flex items-center gap-1">
            <RefreshCw className="w-3.5 h-3.5" />
            <span>In Progress</span>
          </div>
          <div className="text-2xl font-bold text-sky-900">{analytics.in_progress || 0}</div>
        </div>

        <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-4 shadow-sm">
          <div className="text-xs font-semibold text-emerald-800 mb-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Resolved</span>
          </div>
          <div className="text-2xl font-bold text-emerald-900">{analytics.resolved || 0}</div>
        </div>

        <div className="bg-red-50/60 border border-red-200 rounded-xl p-4 shadow-sm">
          <div className="text-xs font-semibold text-red-800 mb-1 flex items-center gap-1">
            <XCircle className="w-3.5 h-3.5" />
            <span>Rejected</span>
          </div>
          <div className="text-2xl font-bold text-red-900">{analytics.rejected || 0}</div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col md:flex-row gap-3 justify-between items-center">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search citizen, location, category..."
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:border-blue-500 bg-slate-50"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-semibold text-slate-600">Filter Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-700 focus:outline-none focus:border-blue-500"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Complaints Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 uppercase tracking-wider">
              <tr>
                <th className="p-4">Complaint</th>
                <th className="p-4">Category</th>
                <th className="p-4">Location</th>
                <th className="p-4">Severity</th>
                <th className="p-4">Supports</th>
                <th className="p-4">Current Status</th>
                <th className="p-4 text-right">Update Status</th>
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
                    <td className="p-4 flex items-center gap-3">
                      <img src={c.image_url} alt="" className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0" />
                      <div>
                        <div className="font-bold text-slate-900">{c.citizen_name}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{c.id}</div>
                      </div>
                    </td>

                    <td className="p-4 font-semibold text-slate-800">
                      {c.category}
                    </td>

                    <td className="p-4 text-slate-600 max-w-[180px] truncate" title={c.location}>
                      {c.location}
                    </td>

                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                        c.estimated_severity === 'Critical' ? 'bg-red-100 text-red-700 border-red-200' :
                        c.estimated_severity === 'High' ? 'bg-orange-100 text-orange-700 border-orange-200' :
                        'bg-amber-100 text-amber-800 border-amber-200'
                      }`}>
                        {c.estimated_severity || 'Medium'}
                      </span>
                    </td>

                    <td className="p-4 font-bold text-blue-700">
                      👍 {c.support_count || 0}
                    </td>

                    <td className="p-4">
                      <span className={`badge-status status-${c.status.replace(/\s+/g, '-')}`}>
                        {c.status}
                      </span>
                    </td>

                    <td className="p-4 text-right">
                      <select
                        disabled={updatingId === c.id}
                        value={c.status}
                        onChange={(e) => handleStatusChange(c.id, e.target.value)}
                        className="text-xs font-semibold bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-slate-800 focus:outline-none focus:border-blue-500 cursor-pointer shadow-sm"
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Mark Resolved</option>
                        <option value="Rejected">Reject</option>
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
