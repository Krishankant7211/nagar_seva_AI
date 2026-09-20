import React from 'react';

export function StatusBadge({ status }) {
  const getStyle = (st) => {
    switch (st) {
      case 'Pending':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'In Progress':
        return 'bg-sky-100 text-sky-900 border-sky-300';
      case 'Resolved':
        return 'bg-emerald-100 text-emerald-900 border-emerald-300';
      case 'Rejected':
        return 'bg-red-100 text-red-900 border-red-300';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${getStyle(status)}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${
        status === 'Resolved' ? 'bg-emerald-600' :
        status === 'Rejected' ? 'bg-red-600' :
        status === 'In Progress' ? 'bg-sky-600' : 'bg-amber-600'
      }`} />
      <span>{status}</span>
    </span>
  );
}
