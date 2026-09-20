import React, { useState } from 'react';
import { MapPin, Calendar, User, ThumbsUp, Sparkles, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';

export function ComplaintCard({ complaint, currentUser, onSupport, onOpenAuth }) {
  const [loadingSupport, setLoadingSupport] = useState(false);
  const [supportErr, setSupportErr] = useState('');

  const handleSupportClick = async () => {
    setSupportErr('');
    if (!currentUser) {
      onOpenAuth();
      return;
    }
    if (!currentUser.is_verified) {
      setSupportErr('Aadhaar verification required to support.');
      onOpenAuth();
      return;
    }
    setLoadingSupport(true);
    try {
      await onSupport(complaint.id);
    } catch (err) {
      setSupportErr(err.message || 'Support failed.');
    } finally {
      setLoadingSupport(false);
    }
  };

  const getSeverityBadgeClass = (sev) => {
    switch (sev) {
      case 'Critical': return 'bg-red-100 text-red-700 border-red-200';
      case 'High': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Medium': return 'bg-amber-100 text-amber-800 border-amber-200';
      default: return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    }
  };

  const formatDate = (isoString) => {
    if (!isoString) return 'Just now';
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch (e) {
      return 'Recent';
    }
  };

  return (
    <div className="card-clean overflow-hidden flex flex-col h-full bg-white border border-slate-200 rounded-xl hover:border-slate-300">
      
      {/* Complaint Image & Status Overlay */}
      <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
        <img
          src={complaint.image_url}
          alt={complaint.category}
          className="w-full h-full object-cover"
        />
        
        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <span className={`badge-status status-${complaint.status.replace(/\s+/g, '-')}`}>
            {complaint.status}
          </span>
        </div>

        {/* Category Pill */}
        <div className="absolute top-3 right-3">
          <span className="bg-white/95 backdrop-blur-sm text-slate-800 border border-slate-200 font-semibold px-2.5 py-1 rounded-md text-xs shadow-sm">
            {complaint.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Location & Date */}
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <div className="flex items-center gap-1 font-medium text-slate-700 truncate max-w-[200px]" title={complaint.location}>
              <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span className="truncate">{complaint.location}</span>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{formatDate(complaint.created_at)}</span>
            </div>
          </div>

          {/* Citizen Description */}
          <p className="text-sm font-semibold text-slate-900 line-clamp-2 mb-3">
            {complaint.description || `${complaint.category} reported by citizen.`}
          </p>

          {/* AI Summary Box */}
          {complaint.ai_summary && (
            <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-2.5 mb-3">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-blue-700">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  <span>Gemini AI Summary</span>
                </div>
                {complaint.estimated_severity && (
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${getSeverityBadgeClass(complaint.estimated_severity)}`}>
                    {complaint.estimated_severity} Severity
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-600 leading-snug">
                {complaint.ai_summary}
              </p>
            </div>
          )}
        </div>

        {/* Footer: Citizen Name & Support Button */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between mt-2">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <User className="w-3.5 h-3.5 text-slate-400" />
            <span className="truncate max-w-[120px]">{complaint.citizen_name || 'Citizen'}</span>
          </div>

          <div className="flex flex-col items-end">
            <button
              onClick={handleSupportClick}
              disabled={loadingSupport}
              className="btn-outline text-xs py-1 px-3 rounded-lg border-blue-200 text-blue-700 hover:bg-blue-50 flex items-center gap-1.5 font-medium transition-all"
            >
              <ThumbsUp className="w-3.5 h-3.5 text-blue-600 fill-blue-50" />
              <span>Support ({complaint.support_count || 0})</span>
            </button>
            {supportErr && (
              <span className="text-[10px] text-red-600 font-medium mt-1">{supportErr}</span>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
