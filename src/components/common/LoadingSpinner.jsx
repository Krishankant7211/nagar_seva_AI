import React from 'react';
import { Loader2 } from 'lucide-react';

export function LoadingSpinner({ message = 'Loading civic complaints...' }) {
  return (
    <div className="py-16 text-center flex flex-col items-center justify-center space-y-3">
      <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      <p className="text-xs font-semibold text-slate-500">{message}</p>
    </div>
  );
}
