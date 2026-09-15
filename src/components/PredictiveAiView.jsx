import React from 'react';
import { Sparkles, AlertOctagon, ShieldAlert, Calendar, MapPin, ArrowRight, Zap, CloudRain } from 'lucide-react';

export default function PredictiveAiView({ predictiveHotspots }) {
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 16px' }}>
      
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <span className="badge badge-purple" style={{ padding: '6px 14px', fontSize: '0.8rem', marginBottom: '10px' }}>
          <Sparkles size={14} /> MyCity Predictive Intelligence Engine
        </span>
        <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>Predictive Civic Hotspots & Proactive Maintenance</h2>
        <p style={{ color: '#94a3b8', fontSize: '0.95rem', maxWidth: '700px', margin: '8px auto 0' }}>
          Traditional apps wait for problems to happen. MyCity AI analyzes weather forecasts, sensor data, and historical complaint velocity to predict civic failures <strong>before</strong> citizens report them.
        </p>
      </div>

      {/* Hotspots Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
        {predictiveHotspots.map(hot => (
          <div 
            key={hot.id} 
            className="glass-panel"
            style={{
              padding: '24px',
              borderTop: `4px solid ${hot.riskLevel === 'CRITICAL' ? '#ef4444' : hot.riskLevel === 'HIGH' ? '#f97316' : '#eab308'}`
            }}
          >
            {/* Top Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <span className={`badge ${hot.riskLevel === 'CRITICAL' ? 'badge-critical' : 'badge-high'}`}>
                <ShieldAlert size={12} /> {hot.riskLevel} RISK ({hot.riskScore}/100)
              </span>

              <span style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Calendar size={14} color="#06b6d4" /> {hot.predictedDateWindow}
              </span>
            </div>

            {/* Title & Zone */}
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'white', marginBottom: '6px' }}>
              {hot.problemType}
            </h3>
            
            <div style={{ fontSize: '0.85rem', color: '#38bdf8', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '16px' }}>
              <MapPin size={14} /> {hot.zone}
            </div>

            {/* AI Analytical Reasoning */}
            <div style={{
              background: 'rgba(15, 23, 42, 0.6)',
              padding: '14px',
              borderRadius: '10px',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              marginBottom: '16px'
            }}>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '4px' }}>
                🧠 AI Prediction Reasoning
              </div>
              <p style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>{hot.reasoning}</p>
            </div>

            {/* Recommended Proactive Action */}
            <div style={{
              background: 'rgba(59, 130, 246, 0.1)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              borderRadius: '10px',
              padding: '14px'
            }}>
              <div style={{ fontSize: '0.75rem', color: '#60a5fa', textTransform: 'uppercase', fontWeight: 700, marginBottom: '4px' }}>
                🛠️ Recommended Preventive Order
              </div>
              <p style={{ fontSize: '0.85rem', color: '#93c5fd' }}>{hot.recommendedAction}</p>
              <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '6px' }}>
                Estimated Impact: <strong>{hot.affectedCitizensEst}</strong>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
