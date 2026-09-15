import React from 'react';
import { 
  Building2, 
  Smartphone, 
  MessageSquare, 
  ShieldAlert, 
  Sparkles, 
  Wifi, 
  WifiOff, 
  TrendingUp,
  MapPin,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  isOffline, 
  setIsOffline, 
  offlineQueueCount, 
  onSyncOffline,
  totalActiveIssues 
}) {
  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'rgba(11, 15, 25, 0.85)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      padding: '12px 24px'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        {/* Brand Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => setActiveTab('citizen')}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 15px rgba(59, 130, 246, 0.5)'
          }}>
            <Building2 size={24} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '1.4rem', fontWeight: 800, background: 'linear-gradient(90deg, #ffffff 0%, #60a5fa 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                MyCity AI
              </h1>
              <span className="badge badge-purple">
                <Sparkles size={12} /> Agentic Platform
              </span>
            </div>
            <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Nagar Seva Smart Civic Resolution Engine</p>
          </div>
        </div>

        {/* View Mode Selector Tabs */}
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          background: 'rgba(15, 23, 42, 0.6)',
          padding: '4px',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <button
            onClick={() => setActiveTab('citizen')}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              background: activeTab === 'citizen' ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' : 'transparent',
              color: activeTab === 'citizen' ? '#ffffff' : '#94a3b8',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s'
            }}
          >
            <Smartphone size={16} /> Citizen App
          </button>

          <button
            onClick={() => setActiveTab('whatsapp')}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              background: activeTab === 'whatsapp' ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'transparent',
              color: activeTab === 'whatsapp' ? '#ffffff' : '#94a3b8',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s'
            }}
          >
            <MessageSquare size={16} /> WhatsApp Bot
          </button>

          <button
            onClick={() => setActiveTab('authority')}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              background: activeTab === 'authority' ? 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)' : 'transparent',
              color: activeTab === 'authority' ? '#ffffff' : '#94a3b8',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s'
            }}
          >
            <ShieldAlert size={16} /> Authority Command
            {totalActiveIssues > 0 && (
              <span style={{
                background: '#ef4444',
                color: 'white',
                fontSize: '0.7rem',
                borderRadius: '999px',
                padding: '1px 6px',
                fontWeight: 700
              }}>
                {totalActiveIssues}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('predictive')}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              background: activeTab === 'predictive' ? 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)' : 'transparent',
              color: activeTab === 'predictive' ? '#ffffff' : '#94a3b8',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s'
            }}
          >
            <Sparkles size={16} /> Predictive AI
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              background: activeTab === 'analytics' ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' : 'transparent',
              color: activeTab === 'analytics' ? '#ffffff' : '#94a3b8',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s'
            }}
          >
            <TrendingUp size={16} /> Analytics
          </button>
        </nav>

        {/* Offline Mode Simulator Toggle & Sync Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(15, 23, 42, 0.6)',
            padding: '6px 12px',
            borderRadius: '10px',
            border: `1px solid ${isOffline ? 'rgba(239, 68, 68, 0.4)' : 'rgba(16, 185, 129, 0.4)'}`
          }}>
            <button
              onClick={() => setIsOffline(!isOffline)}
              style={{
                background: 'transparent',
                border: 'none',
                color: isOffline ? '#fca5a5' : '#6ee7b7',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.8rem'
              }}
              title="Toggle to simulate network connectivity loss"
            >
              {isOffline ? <WifiOff size={16} color="#ef4444" /> : <Wifi size={16} color="#10b981" />}
              {isOffline ? 'Offline Mode Active' : 'Online Mode'}
            </button>
          </div>

          {offlineQueueCount > 0 && (
            <button
              onClick={onSyncOffline}
              style={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: 'white',
                border: 'none',
                padding: '6px 14px',
                borderRadius: '8px',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 0 10px rgba(16, 185, 129, 0.4)'
              }}
            >
              <RefreshCw size={14} /> Sync {offlineQueueCount} Queued
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
