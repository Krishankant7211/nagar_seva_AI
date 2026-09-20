import React, { useState } from 'react';
import { AlertTriangle, ThumbsUp, PlusCircle, X, MapPin } from 'lucide-react';
import { apiService } from '../services/api';

export function DuplicateWarningModal({ isOpen, onClose, matchedComplaint, pendingPayload, onSupportExisting, onSubmitAnyway, currentUser }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !matchedComplaint) return null;

  const handleSupportClick = async () => {
    setError('');
    if (!currentUser || !currentUser.is_verified) {
      setError('You must be a verified citizen to support complaints.');
      return;
    }
    setLoading(true);
    try {
      await onSupportExisting(matchedComplaint.id);
      onClose();
    } catch (err) {
      setError(err.message || 'Support failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleForceSubmit = async () => {
    setLoading(true);
    try {
      await onSubmitAnyway(pendingPayload);
      onClose();
    } catch (err) {
      setError(err.message || 'Submission failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Warning Icon & Title */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-lg">Potential Duplicate Complaint Detected</h3>
            <p className="text-xs text-slate-500">A similar civic complaint has already been registered at this location.</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
            {error}
          </div>
        )}

        {/* Matched Complaint Card Preview */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-6">
          <div className="flex gap-4">
            <img
              src={matchedComplaint.image_url}
              alt="Existing report"
              className="w-20 h-20 rounded-lg object-cover border border-slate-200 shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-slate-900 truncate">{matchedComplaint.category}</span>
                <span className={`badge-status status-${matchedComplaint.status.replace(/\s+/g, '-')}`}>
                  {matchedComplaint.status}
                </span>
              </div>
              <div className="flex items-center gap-1 text-xs text-slate-600 mb-1">
                <MapPin className="w-3 h-3 text-blue-600 shrink-0" />
                <span className="truncate">{matchedComplaint.location}</span>
              </div>
              <p className="text-xs text-slate-500 line-clamp-2">
                {matchedComplaint.ai_summary || matchedComplaint.description}
              </p>
            </div>
          </div>
        </div>

        {/* Action Choices */}
        <div className="space-y-3">
          <button
            onClick={handleSupportClick}
            disabled={loading}
            className="w-full btn-blue py-2.5 text-sm font-semibold flex items-center justify-center gap-2 shadow-sm"
          >
            <ThumbsUp className="w-4 h-4 fill-white/20" />
            <span>Support Existing Complaint (Recommended)</span>
          </button>

          <button
            onClick={handleForceSubmit}
            disabled={loading}
            className="w-full btn-outline py-2 text-xs font-medium flex items-center justify-center gap-1.5 text-slate-600 hover:text-slate-900"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Submit New Complaint Anyway</span>
          </button>
        </div>
      </div>
    </div>
  );
}
