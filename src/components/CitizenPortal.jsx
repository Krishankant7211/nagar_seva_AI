import React, { useState } from 'react';
import { 
  Camera, 
  Upload, 
  MapPin, 
  Sparkles, 
  Send, 
  WifiOff, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  ThumbsUp,
  ThumbsDown,
  Layers,
  ArrowRight,
  Info
} from 'lucide-react';
import { CATEGORIES } from '../data/mockData';
import { analyzeCivicReport } from '../services/aiEngine';

export default function CitizenPortal({ 
  issues, 
  onSubmitReport, 
  onCitizenVerify, 
  isOffline, 
  onOpenExplainModal 
}) {
  const [activeSubTab, setActiveSubTab] = useState('report'); // 'report' | 'tracking'
  const [selectedPreset, setSelectedPreset] = useState(null);
  const [userDescription, setUserDescription] = useState('');
  const [userLocation, setUserLocation] = useState('Sector 15, Near St. Mary School');
  const [aiResult, setAiResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [submittedFeedback, setSubmittedFeedback] = useState(null);

  // Preset sample civic photos for easy hackathon demo testing
  const SAMPLE_PHOTOS = [
    {
      id: 'pothole',
      label: 'Pothole Photo',
      url: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&auto=format&fit=crop&q=80',
      hint: 'Pothole outside school zone'
    },
    {
      id: 'water',
      label: 'Pipe Burst Water Leak',
      url: 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=600&auto=format&fit=crop&q=80',
      hint: 'Underground drinking water main leak'
    },
    {
      id: 'garbage',
      label: 'Overflowing Waste',
      url: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=600&auto=format&fit=crop&q=80',
      hint: 'Commercial trash dump on sidewalk'
    },
    {
      id: 'streetlight',
      label: 'Dark Streetlight',
      url: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?w=600&auto=format&fit=crop&q=80',
      hint: 'Broken street lamps in residential lane'
    }
  ];

  const handlePresetSelect = (preset) => {
    setSelectedPreset(preset);
    setIsAnalyzing(true);
    setUserDescription(preset.hint);

    // Simulate AI Vision Analysis
    setTimeout(() => {
      const res = analyzeCivicReport(preset.url, preset.hint);
      setAiResult(res);
      setIsAnalyzing(false);
    }, 600);
  };

  const handleCustomTextChange = (e) => {
    const text = e.target.value;
    setUserDescription(text);
    if (text.length > 5) {
      const res = analyzeCivicReport(selectedPreset?.url || '', text);
      setAiResult(res);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!aiResult && !userDescription) return;

    const finalReport = {
      title: aiResult ? aiResult.title : 'User Reported Civic Issue',
      category: aiResult ? aiResult.category : 'pothole',
      categoryName: aiResult ? aiResult.categoryName : 'Pothole & Road Damage',
      department: aiResult ? aiResult.department : 'Public Works & Roads',
      description: userDescription || 'Reported via MyCity Mobile App',
      severity: aiResult ? aiResult.severity : 'high',
      imageUrl: selectedPreset ? selectedPreset.url : 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&auto=format&fit=crop&q=80',
      location: {
        address: userLocation,
        zone: 'North Ward Zone A',
        lat: 28.6140 + (Math.random() * 0.005),
        lng: 77.2090 + (Math.random() * 0.005)
      }
    };

    const result = onSubmitReport(finalReport);
    setSubmittedFeedback(result);

    // Reset Form
    setSelectedPreset(null);
    setUserDescription('');
    setAiResult(null);

    // Switch to tracking tab after short delay
    setTimeout(() => {
      setActiveSubTab('tracking');
    }, 2500);
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 16px' }}>
      {/* Citizen Sub-Navigation Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '24px',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Citizen Portal</h2>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
            Report issues in 2 steps — No long forms. AI auto-classifies severity & location.
          </p>
        </div>

        <div style={{
          display: 'flex',
          gap: '8px',
          background: 'rgba(30, 41, 59, 0.6)',
          padding: '4px',
          borderRadius: '10px',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <button
            onClick={() => setActiveSubTab('report')}
            style={{
              padding: '8px 18px',
              borderRadius: '8px',
              border: 'none',
              background: activeSubTab === 'report' ? '#3b82f6' : 'transparent',
              color: 'white',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Camera size={16} /> Report New Issue
          </button>
          <button
            onClick={() => setActiveSubTab('tracking')}
            style={{
              padding: '8px 18px',
              borderRadius: '8px',
              border: 'none',
              background: activeSubTab === 'tracking' ? '#3b82f6' : 'transparent',
              color: 'white',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Clock size={16} /> Track My Reports ({issues.length})
          </button>
        </div>
      </div>

      {/* Offline Mode Banner Alert if Offline */}
      {isOffline && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.15)',
          border: '1px solid rgba(239, 68, 68, 0.4)',
          borderRadius: '12px',
          padding: '14px 18px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          color: '#fca5a5'
        }}>
          <WifiOff size={22} style={{ flexShrink: 0 }} />
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Offline-First Mode Engaged</div>
            <div style={{ fontSize: '0.85rem' }}>
              Your report will be stored locally on your device and automatically synced to municipal authorities once connectivity is restored.
            </div>
          </div>
        </div>
      )}

      {/* Submission Feedback Toast / Alert */}
      {submittedFeedback && (
        <div style={{
          background: submittedFeedback.isDuplicate ? 'rgba(139, 92, 246, 0.2)' : 'rgba(16, 185, 129, 0.2)',
          border: `1px solid ${submittedFeedback.isDuplicate ? 'rgba(139, 92, 246, 0.5)' : 'rgba(16, 185, 129, 0.5)'}`,
          borderRadius: '12px',
          padding: '16px 20px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '14px'
        }}>
          <CheckCircle2 size={28} color={submittedFeedback.isDuplicate ? '#c4b5fd' : '#6ee7b7'} style={{ flexShrink: 0 }} />
          <div>
            <h4 style={{ color: 'white', fontSize: '1rem', fontWeight: 700 }}>
              {submittedFeedback.isDuplicate ? 'Duplicate Issue Smartly Merged!' : 'Complaint Successfully Registered!'}
            </h4>
            <p style={{ color: '#cbd5e1', fontSize: '0.85rem', marginTop: '2px' }}>
              {submittedFeedback.message}
            </p>
          </div>
        </div>
      )}

      {/* SubTab 1: Report New Issue Form */}
      {activeSubTab === 'report' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          
          {/* Left Column: Photo & Details Form */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Camera size={20} color="#3b82f6" /> Step 1: Upload Photo / Select Sample
            </h3>

            {/* Photo Preset Selector */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '8px' }}>
                Tap a sample civic photo to test AI recognition:
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                {SAMPLE_PHOTOS.map(photo => (
                  <div
                    key={photo.id}
                    onClick={() => handlePresetSelect(photo)}
                    style={{
                      border: selectedPreset?.id === photo.id ? '2px solid #3b82f6' : '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '10px',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      background: 'rgba(30, 41, 59, 0.5)',
                      transition: 'all 0.2s',
                      position: 'relative'
                    }}
                  >
                    <img 
                      src={photo.url} 
                      alt={photo.label}
                      style={{ width: '100%', height: '80px', objectFit: 'cover' }}
                    />
                    <div style={{ padding: '6px 8px', fontSize: '0.75rem', fontWeight: 600, color: 'white' }}>
                      {photo.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Custom Description */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#e2e8f0', display: 'block', marginBottom: '6px' }}>
                Step 2: Add Optional Description
              </label>
              <textarea
                rows={3}
                value={userDescription}
                onChange={handleCustomTextChange}
                placeholder="E.g., Pothole outside St. Mary school gate, very deep..."
                style={{
                  width: '100%',
                  background: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '10px',
                  padding: '12px',
                  color: 'white',
                  fontFamily: 'inherit',
                  fontSize: '0.9rem',
                  outline: 'none'
                }}
              />
            </div>

            {/* Location Selector */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#e2e8f0', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                <MapPin size={16} color="#06b6d4" /> Auto-Captured Location
              </label>
              <input
                type="text"
                value={userLocation}
                onChange={e => setUserLocation(e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '10px',
                  padding: '10px 12px',
                  color: 'white',
                  fontSize: '0.9rem',
                  outline: 'none'
                }}
              />
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '14px' }}
              disabled={isAnalyzing}
            >
              <Send size={18} /> {isOffline ? 'Queue Report Offline' : 'Submit Civic Report'}
            </button>
          </div>

          {/* Right Column: Instant AI Detection Preview */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={20} color="#8b5cf6" /> Live AI Vision Analysis
            </h3>

            {isAnalyzing ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: '#94a3b8' }}>
                <Sparkles size={32} className="pulse-critical" color="#3b82f6" style={{ marginBottom: '12px' }} />
                <p>AI analyzing photo pixels & classification model...</p>
              </div>
            ) : aiResult ? (
              <div style={{ background: 'rgba(30, 41, 59, 0.6)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(139, 92, 246, 0.3)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <span className="badge badge-purple">
                    <Sparkles size={12} /> {aiResult.confidence}% Confidence
                  </span>
                  <span className={`badge badge-${aiResult.severity}`}>
                    {aiResult.severity.toUpperCase()} SEVERITY
                  </span>
                </div>

                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'white', marginBottom: '8px' }}>
                  {aiResult.title}
                </h4>

                <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '16px' }}>
                  Category: <strong style={{ color: '#60a5fa' }}>{aiResult.categoryName}</strong>
                </div>

                <div style={{
                  background: 'rgba(15, 23, 42, 0.8)',
                  padding: '12px',
                  borderRadius: '8px',
                  fontSize: '0.8rem',
                  color: '#cbd5e1'
                }}>
                  <div style={{ fontWeight: 600, color: '#38bdf8', marginBottom: '4px' }}>
                    🏢 Automated Department Routing Target:
                  </div>
                  <div>{aiResult.department}</div>
                </div>
              </div>
            ) : (
              <div style={{
                textAlign: 'center',
                padding: '50px 20px',
                color: '#64748b',
                background: 'rgba(15, 23, 42, 0.4)',
                borderRadius: '12px',
                border: '1px dashed rgba(255, 255, 255, 0.1)'
              }}>
                <Info size={32} style={{ marginBottom: '10px' }} />
                <p style={{ fontSize: '0.9rem' }}>Select a sample photo or enter a description to see instant Agentic AI vision detection in action.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SubTab 2: My Reports & Tracking Timeline */}
      {activeSubTab === 'tracking' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {issues.map(issue => (
            <div key={issue.id} className="glass-panel" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span className="badge badge-cyan">{issue.id}</span>
                    <span className={`badge badge-${issue.severity}`}>Priority {issue.priorityScore}/100</span>
                    {issue.reportCount > 1 && (
                      <span className="badge badge-purple">
                        <Layers size={12} /> {issue.reportCount} Citizens Merged
                      </span>
                    )}
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'white', marginTop: '6px' }}>
                    {issue.title}
                  </h3>
                </div>

                {/* Explainable AI Trigger */}
                <button
                  onClick={() => onOpenExplainModal(issue)}
                  className="btn-secondary"
                  style={{ fontSize: '0.8rem', padding: '6px 14px' }}
                >
                  <Sparkles size={14} color="#8b5cf6" /> Why Score {issue.priorityScore}?
                </button>
              </div>

              {/* Grid with Details and Timeline */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <img 
                    src={issue.imageUrl} 
                    alt={issue.title}
                    style={{ width: '100%', height: '160px', borderRadius: '10px', objectFit: 'cover', marginBottom: '12px' }}
                  />
                  <p style={{ fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '8px' }}>{issue.description}</p>
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MapPin size={14} color="#06b6d4" /> {issue.location?.address}
                  </div>
                </div>

                {/* Interactive Resolution Timeline */}
                <div style={{
                  background: 'rgba(15, 23, 42, 0.6)',
                  padding: '16px',
                  borderRadius: '10px',
                  border: '1px solid rgba(255, 255, 255, 0.05)'
                }}>
                  <h4 style={{ fontSize: '0.85rem', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '12px' }}>
                    Live Resolution Flow
                  </h4>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {issue.timeline?.map((step, idx) => (
                      <div key={idx} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                        <div style={{
                          width: '10px',
                          height: '10px',
                          borderRadius: '50%',
                          background: idx === issue.timeline.length - 1 ? '#3b82f6' : '#10b981',
                          marginTop: '4px',
                          boxShadow: idx === issue.timeline.length - 1 ? '0 0 8px #3b82f6' : 'none'
                        }} />
                        <div>
                          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'white' }}>{step.step}</div>
                          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{step.time} — {step.note}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Citizen Verification Block if Status is Resolved */}
              {issue.status === 'Resolved' && (
                <div style={{
                  background: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  borderRadius: '12px',
                  padding: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '12px'
                }}>
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#6ee7b7' }}>
                      Authority Marked Issue as Resolved
                    </h4>
                    <p style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>
                      Please verify if the problem on ground has been properly fixed.
                    </p>
                  </div>

                  {issue.citizenFeedback ? (
                    <div className={`badge ${issue.citizenFeedback === 'fixed' ? 'badge-low' : 'badge-critical'}`}>
                      {issue.citizenFeedback === 'fixed' ? '👍 Verified Fixed by Citizen' : '👎 Reopened by Citizen'}
                    </div>
                  ) : (
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button
                        onClick={() => onCitizenVerify(issue.id, 'fixed')}
                        className="btn-emerald"
                        style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                      >
                        <ThumbsUp size={16} /> Yes, Fixed 👍
                      </button>
                      <button
                        onClick={() => onCitizenVerify(issue.id, 'reopened')}
                        style={{
                          background: 'rgba(239, 68, 68, 0.2)',
                          color: '#fca5a5',
                          border: '1px solid rgba(239, 68, 68, 0.4)',
                          padding: '8px 16px',
                          borderRadius: '8px',
                          fontSize: '0.85rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <ThumbsDown size={16} /> Still Exists 👎
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
