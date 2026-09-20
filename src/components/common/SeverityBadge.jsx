import React from 'react';

export function SeverityBadge({ severity }) {
  const getStyle = (sev) => {
    switch (sev) {
      case 'Critical':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'High':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'Medium':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      default:
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    }
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border ${getStyle(severity || 'Medium')}`}>
      {severity || 'Medium'} Severity
    </span>
  );
}
