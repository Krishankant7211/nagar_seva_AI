import React from 'react';
import { TrendingUp, Award, Clock, Layers, BarChart3, CheckCircle2 } from 'lucide-react';
import { CATEGORIES } from '../data/mockData';

export default function AnalyticsView({ issues }) {
  const total = issues.length;
  const resolved = issues.filter(i => i.status === 'Resolved').length;
  const resolvedRate = Math.round((resolved / (total || 1)) * 100);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 16px' }}>
      
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>City Civic Analytics & Performance</h2>
        <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
          Real-time municipal KPIs, category distribution, and resolution velocity metrics.
        </p>
      </div>

      {/* Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>AVG RESOLUTION TIME</div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#10b981', marginTop: '4px' }}>
            2.4 Days
          </div>
          <div style={{ fontSize: '0.75rem', color: '#6ee7b7', marginTop: '4px' }}>↓ 34% faster than manual dispatch</div>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>CITIZEN SATISFACTION RATE</div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#38bdf8', marginTop: '4px' }}>
            94.8%
          </div>
          <div style={{ fontSize: '0.75rem', color: '#7dd3fc', marginTop: '4px' }}>Based on post-resolution verification</div>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>AI DEDUPLICATION EFFICIENCY</div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#c4b5fd', marginTop: '4px' }}>
            76.2%
          </div>
          <div style={{ fontSize: '0.75rem', color: '#a78bfa', marginTop: '4px' }}>Redundant reports merged automatically</div>
        </div>
      </div>

      {/* Category Breakdown & Ward Performance */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        
        {/* Category Breakdown */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BarChart3 size={20} color="#3b82f6" /> Issues by Civic Category
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {CATEGORIES.map(cat => {
              const count = issues.filter(i => i.category === cat.id).length;
              const pct = Math.round((count / (total || 1)) * 100);
              return (
                <div key={cat.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
                    <span style={{ color: 'white', fontWeight: 600 }}>{cat.name}</span>
                    <span style={{ color: '#94a3b8' }}>{count} issues ({pct}%)</span>
                  </div>
                  <div style={{ height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '99px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct || 15}%`, background: cat.color, borderRadius: '99px' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Ward Wise Performance */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Award size={20} color="#10b981" /> Municipal Ward Velocity
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {[
              { ward: 'North Ward Zone A (Sector 15)', resolved: 92, avgDays: 1.8, status: 'Top Performing' },
              { ward: 'Central Ward Zone C (Sector 22)', resolved: 88, avgDays: 2.1, status: 'On Track' },
              { ward: 'East Ward Zone B (Ward 12)', resolved: 79, avgDays: 2.9, status: 'Needs Crew' },
              { ward: 'South Ward Zone D (Sector 9)', resolved: 95, avgDays: 1.5, status: 'Top Performing' }
            ].map((w, idx) => (
              <div key={idx} style={{
                background: 'rgba(15, 23, 42, 0.5)',
                padding: '12px 16px',
                borderRadius: '10px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'white' }}>{w.ward}</div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Avg speed: {w.avgDays} days</div>
                </div>
                <span className="badge badge-low">{w.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
