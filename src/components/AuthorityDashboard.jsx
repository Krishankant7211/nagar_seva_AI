import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Sparkles, 
  MapPin, 
  CheckCircle2, 
  Layers, 
  TrendingUp, 
  Building, 
  AlertTriangle, 
  Filter, 
  Search, 
  ArrowUpDown,
  Upload,
  UserCheck
} from 'lucide-react';
import SmartCityMap from './SmartCityMap';
import { CATEGORIES } from '../data/mockData';

export default function AuthorityDashboard({ 
  issues, 
  predictiveHotspots, 
  onUpdateStatus, 
  onOpenExplainModal 
}) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIssueForAction, setSelectedIssueForAction] = useState(null);

  // Executive Metric Calculations
  const totalReportsAggregated = issues.reduce((sum, i) => sum + (i.reportCount || 1), 0);
  const activeCount = issues.filter(i => i.status !== 'Resolved').length;
  const criticalCount = issues.filter(i => i.priorityScore >= 80 && i.status !== 'Resolved').length;
  const resolvedCount = issues.filter(i => i.status === 'Resolved').length;
  const duplicateCompressionRatio = Math.round(((totalReportsAggregated - issues.length) / totalReportsAggregated) * 100) || 0;

  // Filtered Issues
  const filteredIssues = issues.filter(issue => {
    const matchesCat = selectedCategory === 'all' || issue.category === selectedCategory;
    const matchesSearch = issue.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          issue.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          issue.location.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  }).sort((a, b) => b.priorityScore - a.priorityScore); // Sorted by AI Priority Score descending!

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '24px 16px' }}>
      
      {/* Header Banner */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '24px'
      }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShieldAlert size={28} color="#8b5cf6" /> Municipal Authority Control Center
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
            AI-Prioritized Dispatch & Intelligent Duplicate Aggregation Command Panel
          </p>
        </div>

        <div className="badge badge-purple" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
          <Sparkles size={16} /> AI Duplicate Compression: {duplicateCompressionRatio}% Fewer Tasks for Crew
        </div>
      </div>

      {/* Executive Metrics Bar */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '16px',
        marginBottom: '24px'
      }}>
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase' }}>Citizen Reports Logged</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#38bdf8', marginTop: '4px' }}>
            {totalReportsAggregated}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>
            Aggregated into {issues.length} Master Tasks
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase' }}>Active Action Items</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#f59e0b', marginTop: '4px' }}>
            {activeCount}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#fcd34d', marginTop: '4px' }}>
            Assigned across municipal departments
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
          <div style={{ fontSize: '0.8rem', color: '#fca5a5', textTransform: 'uppercase' }}>Critical Priority (80+)</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#ef4444', marginTop: '4px' }}>
            {criticalCount}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#f87171', marginTop: '4px' }}>
            Immediate dispatch required
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase' }}>Successfully Resolved</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#10b981', marginTop: '4px' }}>
            {resolvedCount}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#6ee7b7', marginTop: '4px' }}>
            Verified by citizen feedback loop
          </div>
        </div>
      </div>

      {/* Smart City Map Section */}
      <div style={{ marginBottom: '32px' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <MapPin size={20} color="#3b82f6" /> Smart City Live Incident Map & Predictive Hotspots
        </h3>
        <SmartCityMap 
          issues={issues} 
          predictiveHotspots={predictiveHotspots} 
          onSelectIssue={setSelectedIssueForAction}
          onOpenExplainModal={onOpenExplainModal}
        />
      </div>

      {/* AI Action Queue Header & Filter Controls */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '16px'
      }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={20} color="#8b5cf6" /> AI-Ranked Recommended Actions Queue
        </h3>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {/* Search Box */}
          <div style={{ position: 'relative' }}>
            <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search by ID, sector, title..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                background: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                padding: '8px 12px 8px 36px',
                color: 'white',
                fontSize: '0.85rem',
                outline: 'none'
              }}
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            style={{
              background: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              padding: '8px 12px',
              color: 'white',
              fontSize: '0.85rem',
              outline: 'none'
            }}
          >
            <option value="all">All Departments</option>
            {CATEGORIES.map(c => (
              <option key={c.id} value={c.id}>{c.dept}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Action Items List Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {filteredIssues.map(issue => (
          <div 
            key={issue.id} 
            className="glass-panel"
            style={{
              padding: '20px',
              borderLeft: `6px solid ${issue.priorityScore >= 80 ? '#ef4444' : issue.priorityScore >= 65 ? '#f97316' : '#eab308'}`
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
              
              {/* Left Column: Title & Info */}
              <div style={{ flex: 1, minWidth: '280px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                  <span className="badge badge-cyan">{issue.id}</span>
                  <span className={`badge ${issue.priorityScore >= 80 ? 'badge-critical' : issue.priorityScore >= 65 ? 'badge-high' : 'badge-medium'}`}>
                    Priority {issue.priorityScore}/100
                  </span>
                  {issue.reportCount > 1 && (
                    <span className="badge badge-purple">
                      <Layers size={12} /> {issue.reportCount} Reports Merged
                    </span>
                  )}
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                    Dept: <strong style={{ color: '#60a5fa' }}>{issue.department}</strong>
                  </span>
                </div>

                <h4 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'white', marginBottom: '6px' }}>
                  {issue.title}
                </h4>

                <p style={{ fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '10px' }}>
                  {issue.description}
                </p>

                <div style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MapPin size={14} color="#06b6d4" /> {issue.location?.address} ({issue.location?.zone})
                </div>
              </div>

              {/* Right Column: Actions & Status Manager */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'flex-end', minWidth: '200px' }}>
                
                {/* Explainable AI Trigger Button */}
                <button
                  onClick={() => onOpenExplainModal(issue)}
                  className="btn-secondary"
                  style={{ fontSize: '0.8rem', padding: '6px 12px' }}
                >
                  <Sparkles size={14} color="#8b5cf6" /> Why Score {issue.priorityScore}?
                </button>

                {/* Status Dropdown / Transition Buttons */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  {issue.status !== 'In Progress' && issue.status !== 'Resolved' && (
                    <button
                      onClick={() => onUpdateStatus(issue.id, 'In Progress')}
                      className="btn-primary"
                      style={{ fontSize: '0.8rem', padding: '6px 14px' }}
                    >
                      Dispatch & In Progress
                    </button>
                  )}

                  {issue.status !== 'Resolved' && (
                    <button
                      onClick={() => onUpdateStatus(issue.id, 'Resolved')}
                      className="btn-emerald"
                      style={{ fontSize: '0.8rem', padding: '6px 14px' }}
                    >
                      <CheckCircle2 size={14} /> Mark Resolved
                    </button>
                  )}

                  {issue.status === 'Resolved' && (
                    <span className="badge badge-low" style={{ padding: '6px 12px' }}>
                      <CheckCircle2 size={14} /> Resolved
                    </span>
                  )}
                </div>

                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  Assigned: {issue.assignedTo || 'Unassigned'}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
