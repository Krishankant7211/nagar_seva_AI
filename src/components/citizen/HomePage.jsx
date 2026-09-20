import React from 'react';
import { PlusCircle, ArrowRight, Camera, CheckCircle2, Search, ShieldCheck, MapPin, Sparkles } from 'lucide-react';
import { ComplaintCard } from '../ComplaintCard';
import { StatusBadge } from '../common/StatusBadge';

export function HomePage({
  complaints,
  analytics,
  onNavigate,
  currentUser,
  onSupport,
  onOpenAuth,
  onSelectComplaint
}) {
  const latestReports = complaints.slice(0, 3);
  const totalReported = analytics?.total_complaints || complaints.length || 0;
  const totalResolved = analytics?.resolved || complaints.filter(c => c.status === 'Resolved').length || 0;

  return (
    <div className="space-y-10">
      
      {/* 1. HERO SECTION */}
      <section className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-800 text-white rounded-2xl p-8 sm:p-10 shadow-xl shadow-blue-900/10 relative overflow-hidden">
        <div className="max-w-2xl space-y-4 relative z-10">
          <div className="inline-flex items-center gap-1.5 bg-blue-500/30 border border-blue-400/40 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-blue-100">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-300" />
            <span>Official Citizen Infrastructure Reporting Portal</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            Report City Infrastructure Issues in 30 Seconds.
          </h1>
          <p className="text-blue-100 text-sm sm:text-base leading-relaxed">
            Nagar Seva AI connects verified citizens with municipal authorities to fast-track resolution of potholes, water leakage, power outages, and sanitation hazards.
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('report')}
              className="bg-white text-blue-700 hover:bg-blue-50 px-5 py-3 rounded-xl font-bold text-sm shadow-md transition-all flex items-center gap-2"
            >
              <PlusCircle className="w-5 h-5 text-blue-600" />
              <span>Report an Issue Now</span>
            </button>
            <button
              onClick={() => onNavigate('community')}
              className="bg-blue-800/60 hover:bg-blue-800/80 text-white border border-blue-400/30 px-5 py-3 rounded-xl font-semibold text-sm transition-all flex items-center gap-2"
            >
              <span>View Community Reports</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 2. QUICK STATISTICS */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Total Issues Reported</div>
            <div className="text-3xl font-extrabold text-slate-900">{totalReported}</div>
            <p className="text-xs text-slate-400 mt-1">Verified civic reports across all wards</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">
            📋
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">Issues Resolved</div>
            <div className="text-3xl font-extrabold text-emerald-800">{totalResolved}</div>
            <p className="text-xs text-slate-400 mt-1">Successfully repaired by authorities</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-lg">
            ✅
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS (Compact 3-Step) */}
      <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h2 className="text-lg font-bold text-slate-900">How Nagar Seva AI Works</h2>
          <p className="text-xs text-slate-500 mt-0.5">Three simple steps from problem to resolution</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 font-bold text-sm flex items-center justify-center shrink-0">
              1
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 mb-1">Capture Problem</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Take a photo of the infrastructure defect and upload it with location details.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 font-bold text-sm flex items-center justify-center shrink-0">
              2
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 mb-1">Submit Report</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Gemini AI auto-summarizes, categorizes, and estimates hazard severity.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 font-bold text-sm flex items-center justify-center shrink-0">
              3
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 mb-1">Track Progress</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Receive live status updates as municipal teams inspect and resolve the grievance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. RECENT COMMUNITY REPORTS */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Recent Community Reports</h2>
            <p className="text-xs text-slate-500">Public grievances submitted by local citizens</p>
          </div>
          <button
            onClick={() => onNavigate('community')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 hover:underline"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {latestReports.map((c) => (
            <div key={c.id} onClick={() => onSelectComplaint(c)} className="cursor-pointer">
              <ComplaintCard
                complaint={c}
                currentUser={currentUser}
                onSupport={onSupport}
                onOpenAuth={onOpenAuth}
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
