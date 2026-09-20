import React, { useState } from 'react';
import { X, MapPin, Calendar, User, ThumbsUp, Sparkles, Clock, CheckCircle2, AlertTriangle, ChevronRight } from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';
import { SeverityBadge } from '../common/SeverityBadge';

export function ComplaintDetailPage({
  complaint,
  onClose,
  allComplaints,
  currentUser,
  onSupport,
  onOpenAuth,
  onSelectComplaint
}) {
  const [loadingSupport, setLoadingSupport] = useState(false);
  const [error, setError] = useState('');

  if (!complaint) return null;

  const related = (allComplaints || []).filter(
    c => c.category === complaint.category && c.id !== complaint.id
  ).slice(0, 2);

  const handleSupportClick = async () => {
    setError('');
    if (!currentUser) {
      onOpenAuth();
      return;
    }
    if (!currentUser.is_verified) {
      setError('Aadhaar verification required to support.');
      onOpenAuth();
      return;
    }
    setLoadingSupport(true);
    try {
      await onSupport(complaint.id);
    } catch (err) {
      setError(err.message || 'Support failed.');
    } finally {
      setLoadingSupport(false);
    }
  };

  const getTimelineStep = (status) => {
    switch (status) {
      case 'Pending': return 1;
      case 'In Progress': return 2;
      case 'Resolved': return 3;
      case 'Rejected': return 3;
      default: return 1;
    }
  };

  const step = getTimelineStep(complaint.status);

  return (
    <div className="modal-overlay">
      <div className="bg-white rounded-2xl max-w-3xl w-full p-6 sm:p-8 shadow-xl border border-slate-200 relative max-h-[90vh] overflow-y-auto space-y-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Category & Status Header */}
        <div className="flex items-center gap-3">
          <StatusBadge status={complaint.status} />
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{complaint.category}</span>
          <span className="text-xs text-slate-400">ID: {complaint.id}</span>
        </div>

        {/* Full Image */}
        <div className="h-72 w-full bg-slate-100 rounded-xl overflow-hidden border border-slate-200 relative">
          <img src={complaint.image_url} alt={complaint.category} className="w-full h-full object-cover" />
          <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-sm text-white px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-blue-400" />
            <span>{complaint.location}</span>
          </div>
        </div>

        {/* Description & Citizen Info */}
        <div className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900">
            {complaint.description || `${complaint.category} reported at ${complaint.location}`}
          </h2>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-slate-400" />
              <span>Reported by: <strong className="text-slate-700">{complaint.citizen_name}</strong></span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Submitted: {new Date(complaint.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* STATUS PROGRESS TIMELINE */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700">
            <span>Resolution Timeline</span>
            <SeverityBadge severity={complaint.estimated_severity} />
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs pt-2">
            
            {/* Step 1: Pending */}
            <div className={`p-3 rounded-lg border font-semibold ${
              step >= 1 ? 'bg-amber-50 text-amber-900 border-amber-300' : 'bg-white text-slate-400 border-slate-200'
            }`}>
              <div className="font-bold mb-1">1. Registered</div>
              <div className="text-[10px] text-amber-800">Pending Verification</div>
            </div>

            {/* Step 2: In Progress */}
            <div className={`p-3 rounded-lg border font-semibold ${
              step >= 2 ? 'bg-sky-50 text-sky-900 border-sky-300' : 'bg-white text-slate-400 border-slate-200'
            }`}>
              <div className="font-bold mb-1">2. Inspection</div>
              <div className="text-[10px] text-sky-800">In Progress</div>
            </div>

            {/* Step 3: Resolved / Rejected */}
            <div className={`p-3 rounded-lg border font-semibold ${
              complaint.status === 'Resolved'
                ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                : complaint.status === 'Rejected'
                ? 'bg-red-50 text-red-900 border-red-300'
                : 'bg-white text-slate-400 border-slate-200'
            }`}>
              <div className="font-bold mb-1">3. Final State</div>
              <div className="text-[10px]">{complaint.status}</div>
            </div>
          </div>
        </div>

        {/* AI Analysis Box */}
        {complaint.ai_summary && (
          <div className="bg-blue-50/60 border border-blue-200 rounded-xl p-4">
            <div className="flex items-center gap-2 text-xs font-bold text-blue-800 mb-1">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>Gemini AI Infrastructure Summary</span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              {complaint.ai_summary}
            </p>
          </div>
        )}

        {/* Support Action Bar */}
        <div className="pt-2 flex items-center justify-between border-t border-slate-200">
          <div className="flex items-center gap-2">
            <button
              onClick={handleSupportClick}
              disabled={loadingSupport}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-sm flex items-center gap-2 transition-all"
            >
              <ThumbsUp className="w-4 h-4 fill-white/20" />
              <span>Support This Issue ({complaint.support_count || 0})</span>
            </button>
            {error && <span className="text-xs text-red-600 font-semibold">{error}</span>}
          </div>

          <button onClick={onClose} className="btn-outline text-xs py-2 px-4 rounded-xl">
            Close
          </button>
        </div>

        {/* Related Complaints */}
        {related.length > 0 && (
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Related {complaint.category} Issues</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {related.map((r) => (
                <div
                  key={r.id}
                  onClick={() => {
                    onClose();
                    onSelectComplaint(r);
                  }}
                  className="bg-slate-50 border border-slate-200 rounded-xl p-3 cursor-pointer hover:border-blue-300 flex items-center gap-3 transition-all"
                >
                  <img src={r.image_url} alt="" className="w-12 h-12 rounded-lg object-cover shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold text-slate-900 truncate">{r.location}</div>
                    <div className="text-[11px] text-slate-500 truncate">{r.description}</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
