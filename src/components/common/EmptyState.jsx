import React from 'react';
import { AlertCircle } from 'lucide-react';

export function EmptyState({ title = 'No Reports Found', description = 'There are no complaints matching your criteria.', actionText, onAction }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-12 text-center space-y-3 shadow-sm">
      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h3 className="font-bold text-slate-900 text-base">{title}</h3>
      <p className="text-xs text-slate-500 max-w-sm mx-auto">{description}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="mt-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-4 py-2 rounded-lg transition-all inline-flex items-center gap-2"
        >
          {actionText}
        </button>
      )}
    </div>
  );
}
