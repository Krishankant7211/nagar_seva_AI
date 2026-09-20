import React from 'react';
import { BarChart3, CheckCircle2, AlertTriangle, TrendingUp } from 'lucide-react';

export function AdminAnalyticsPage({ analytics, complaints }) {
  const total = analytics.total_complaints || complaints.length || 1;
  const resolvedPct = Math.round(((analytics.resolved || 0) / total) * 100);
  const pendingPct = Math.round(((analytics.pending || 0) / total) * 100);
  const inProgressPct = Math.round(((analytics.in_progress || 0) / total) * 100);

  // Category counts
  const categoryCounts = complaints.reduce((acc, c) => {
    acc[c.category] = (acc[c.category] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-bold text-slate-900">Infrastructure Analytics & Performance</h1>
        <p className="text-xs text-slate-500 mt-0.5">Municipal grievance resolution efficiency & category distribution</p>
      </div>

      {/* Resolution Efficiency Progress Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Grievance Resolution Efficiency</h3>
            <p className="text-xs text-slate-500">Percentage of complaints resolved by municipal engineering teams</p>
          </div>
          <div className="text-2xl font-extrabold text-emerald-600">{resolvedPct}%</div>
        </div>

        {/* Progress bar */}
        <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden flex">
          <div style={{ width: `${resolvedPct}%` }} className="bg-emerald-500 h-full" title="Resolved" />
          <div style={{ width: `${inProgressPct}%` }} className="bg-sky-500 h-full" title="In Progress" />
          <div style={{ width: `${pendingPct}%` }} className="bg-amber-400 h-full" title="Pending" />
        </div>

        <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"/> Resolved ({analytics.resolved || 0})</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-sky-500 inline-block"/> In Progress ({analytics.in_progress || 0})</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block"/> Pending ({analytics.pending || 0})</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-400 inline-block"/> Rejected ({analytics.rejected || 0})</span>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
        <h3 className="font-bold text-slate-900 text-sm">Reports by Category</h3>
        
        <div className="space-y-3">
          {Object.entries(categoryCounts).map(([cat, count]) => {
            const pct = Math.round((count / total) * 100);
            return (
              <div key={cat} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                  <span>{cat}</span>
                  <span>{count} Reports ({pct}%)</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div style={{ width: `${pct}%` }} className="bg-blue-600 h-full rounded-full" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
