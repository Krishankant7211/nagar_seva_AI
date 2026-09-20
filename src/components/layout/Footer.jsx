import React from 'react';
import { Shield, ExternalLink, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs py-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pb-6 border-b border-slate-800">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <Shield className="w-4 h-4 text-blue-500" />
              <span>Nagar Seva AI</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Empowering citizens to report public infrastructure issues directly to municipal authorities with transparent resolution tracking.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-2">Public Services</h4>
            <ul className="space-y-1 text-slate-400">
              <li>Potholes & Road Repair</li>
              <li>Water Leakage & Pipeline</li>
              <li>Electricity & Wire Safety</li>
              <li>Sanitation & Garbage Clear</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-2">Government Help</h4>
            <ul className="space-y-1 text-slate-400">
              <li>Citizen Guidelines</li>
              <li>Track Grievance Status</li>
              <li>WhatsApp Bot Helpline</li>
              <li>Aadhaar Verification Flow</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-2">Platform Standard</h4>
            <p className="text-slate-400 text-xs leading-relaxed">
              Automated image categorization and severity assessment powered by Google Gemini AI API.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500">
          <span>© 2026 Nagar Seva AI • Public Civic Services Portal</span>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-300 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-300 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-300 cursor-pointer">Accessibility</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
