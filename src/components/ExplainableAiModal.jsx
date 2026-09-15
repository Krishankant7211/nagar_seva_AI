import React from 'react';
import { X, Sparkles, AlertTriangle, ShieldCheck, Layers, MapPin, Users, Clock, Flame } from 'lucide-react';
import { getExplainableAiSummary } from '../services/aiEngine';

export default function ExplainableAiModal({ issue, onClose }) {
  if (!issue) return null;

  const aiSummary = getExplainableAiSummary(issue);
  const score = aiSummary.score;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="glass-panel" 
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '620px',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '28px',
          position: 'relative',
          background: 'rgba(15, 23, 42, 0.95)',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          boxShadow: '0 0 40px rgba(59, 130, 246, 0.2)'
        }}
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'rgba(255, 255, 255, 0.1)',
            border: 'none',
            color: 'white',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
            padding: '8px',
            borderRadius: '10px',
            color: 'white',
            display: 'flex'
          }}>
            <Sparkles size={22} />
          </div>
          <div>
            <span className="badge badge-purple" style={{ marginBottom: '4px' }}>
              Explainable AI Transparency (XAI)
            </span>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700 }}>Priority Score Breakdown</h3>
          </div>
        </div>

        {/* Issue Card Preview */}
        <div style={{
          background: 'rgba(30, 41, 59, 0.6)',
          padding: '14px',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          marginBottom: '20px',
          display: 'flex',
          gap: '12px',
          alignItems: 'center'
        }}>
          {issue.imageUrl && (
            <img 
              src={issue.imageUrl} 
              alt={issue.title}
              style={{ width: '64px', height: '64px', borderRadius: '8px', objectFit: 'cover' }}
            />
          )}
          <div>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Complaint ID: {issue.id}</div>
            <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'white' }}>{issue.title}</div>
            <div style={{ fontSize: '0.8rem', color: '#60a5fa', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
              <MapPin size={12} /> {issue.location?.address}
            </div>
          </div>
        </div>

        {/* Big Score Gauge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)',
          padding: '20px',
          borderRadius: '14px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          marginBottom: '24px'
        }}>
          <div>
            <div style={{ fontSize: '0.85rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Calculated AI Score
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '4px' }}>
              <span style={{
                fontSize: '2.8rem',
                fontWeight: 900,
                color: score >= 80 ? '#ef4444' : score >= 65 ? '#f97316' : score >= 45 ? '#eab308' : '#10b981'
              }}>
                {score}
              </span>
              <span style={{ fontSize: '1.2rem', color: '#64748b', fontWeight: 600 }}>/ 100</span>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span className={`badge ${score >= 80 ? 'badge-critical' : score >= 65 ? 'badge-high' : 'badge-medium'}`}>
              <Flame size={14} /> {aiSummary.severityLabel}
            </span>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '6px' }}>
              Aggregated from {issue.reportCount || 1} Citizen Reports
            </div>
          </div>
        </div>

        {/* Itemized Score Breakdown Table / Progress Bars */}
        <h4 style={{ fontSize: '0.95rem', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '14px', letterSpacing: '0.05em' }}>
          Factor Weight Allocation Breakdown
        </h4>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
          {aiSummary.breakdown.map((item, idx) => (
            <div 
              key={idx}
              style={{
                background: 'rgba(30, 41, 59, 0.4)',
                padding: '12px 16px',
                borderRadius: '10px',
                border: '1px solid rgba(255, 255, 255, 0.05)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontWeight: 600, fontSize: '0.9rem', color: '#e2e8f0' }}>
                  {item.factor}
                </span>
                <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#60a5fa' }}>
                  +{item.points} pts <span style={{ color: '#64748b', fontSize: '0.75rem' }}>(max {item.max})</span>
                </span>
              </div>

              {/* Progress Bar */}
              <div style={{
                height: '6px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '999px',
                overflow: 'hidden',
                marginBottom: '6px'
              }}>
                <div style={{
                  height: '100%',
                  width: `${(item.points / item.max) * 100}%`,
                  background: 'linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%)',
                  borderRadius: '999px',
                  transition: 'width 0.5s ease'
                }} />
              </div>

              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                {item.desc}
              </div>
            </div>
          ))}
        </div>

        {/* AI Transparency Footer Note */}
        <div style={{
          background: 'rgba(59, 130, 246, 0.1)',
          border: '1px solid rgba(59, 130, 246, 0.2)',
          borderRadius: '10px',
          padding: '12px',
          display: 'flex',
          gap: '10px',
          alignItems: 'flex-start'
        }}>
          <ShieldCheck size={18} color="#60a5fa" style={{ flexShrink: 0, marginTop: '2px' }} />
          <p style={{ fontSize: '0.8rem', color: '#93c5fd', margin: 0 }}>
            <strong>Why it matters:</strong> Municipal officials have limited teams and budget. MyCity Explainable AI eliminates guesswork by providing mathematical transparency into why an issue is flagged as top priority.
          </p>
        </div>
      </div>
    </div>
  );
}
