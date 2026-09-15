import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import CitizenPortal from './components/CitizenPortal';
import WhatsAppSimulator from './components/WhatsAppSimulator';
import AuthorityDashboard from './components/AuthorityDashboard';
import PredictiveAiView from './components/PredictiveAiView';
import AnalyticsView from './components/AnalyticsView';
import ExplainableAiModal from './components/ExplainableAiModal';

import { 
  getStoredIssues, 
  saveStoredIssues, 
  getOfflineQueue, 
  addToOfflineQueue, 
  clearOfflineQueue 
} from './services/storageService';

import { 
  computePriorityScore, 
  findDuplicateIssue 
} from './services/aiEngine';

import { PREDICTIVE_HOTSPOTS } from './data/mockData';

export default function App() {
  const [activeTab, setActiveTab] = useState('citizen'); // 'citizen' | 'whatsapp' | 'authority' | 'predictive' | 'analytics'
  const [issues, setIssues] = useState([]);
  const [predictiveHotspots, setPredictiveHotspots] = useState(PREDICTIVE_HOTSPOTS);
  const [isOffline, setIsOffline] = useState(false);
  const [offlineQueue, setOfflineQueue] = useState([]);
  const [explainModalIssue, setExplainModalIssue] = useState(null);

  // Initialize data on mount
  useEffect(() => {
    const loadedIssues = getStoredIssues();
    setIssues(loadedIssues);
    setOfflineQueue(getOfflineQueue());
  }, []);

  // Save changes to localStorage whenever issues change
  const updateIssuesState = (newIssues) => {
    setIssues(newIssues);
    saveStoredIssues(newIssues);
  };

  // Submit Report Handler (with AI Duplicate Aggregation & Priority Scoring)
  const handleSubmitReport = (newReport) => {
    // 1. Offline Mode Queueing
    if (isOffline) {
      const queueCount = addToOfflineQueue(newReport);
      setOfflineQueue(getOfflineQueue());
      return {
        isDuplicate: false,
        message: `Offline mode active! Report queued locally. (${queueCount} items in offline queue)`
      };
    }

    // 2. AI Duplicate Report Detection
    const duplicateCheck = findDuplicateIssue(
      newReport.location.lat,
      newReport.location.lng,
      newReport.category,
      issues
    );

    if (duplicateCheck.isDuplicate) {
      // Merge into existing Master Issue
      const matched = duplicateCheck.matchedIssue;
      const updatedIssues = issues.map(iss => {
        if (iss.id === matched.id) {
          const newCount = (iss.reportCount || 1) + 1;
          const updated = {
            ...iss,
            reportCount: newCount,
            updatedAt: new Date().toISOString()
          };
          const { priorityScore } = computePriorityScore(updated);
          updated.priorityScore = priorityScore;
          updated.timeline.push({
            step: 'Duplicate Report Merged',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            note: `Verified citizen report #${newCount} merged at ${duplicateCheck.distanceMeters}m distance`
          });
          return updated;
        }
        return iss;
      });

      updateIssuesState(updatedIssues);
      return {
        isDuplicate: true,
        message: `AI detected a duplicate pothole/issue within ${duplicateCheck.distanceMeters}m! Your report has been merged into Master Issue ${matched.id}. Total citizen reports merged: ${matched.reportCount + 1}.`
      };
    }

    // 3. Register New Master Issue
    const compId = `MYC-${Math.floor(1000 + Math.random() * 9000)}`;
    const issueToScore = {
      id: compId,
      ...newReport,
      reportCount: 1,
      status: 'Reported',
      assignedTo: 'Unassigned',
      assignedTeam: 'Pending Dispatch',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      timeline: [
        {
          step: 'Reported',
          time: 'Just now',
          note: `Registered via ${activeTab === 'whatsapp' ? 'WhatsApp AI Bot' : 'MyCity Web App'}`
        },
        {
          step: 'AI Analysis',
          time: 'Just now',
          note: `AI Multimodal Vision confirmed ${newReport.categoryName}. Priority calculated.`
        }
      ]
    };

    const { priorityScore } = computePriorityScore(issueToScore);
    issueToScore.priorityScore = priorityScore;

    const nextIssues = [issueToScore, ...issues];
    updateIssuesState(nextIssues);

    return {
      isDuplicate: false,
      message: `Report successfully registered! Generated Complaint ID: ${compId}. AI Priority Score: ${priorityScore}/100.`
    };
  };

  // Sync Offline Queue Handler
  const handleSyncOffline = () => {
    const queue = getOfflineQueue();
    if (queue.length === 0) return;

    queue.forEach(item => {
      handleSubmitReport(item);
    });

    clearOfflineQueue();
    setOfflineQueue([]);
    setIsOffline(false);
  };

  // Authority Status Update Handler
  const handleUpdateStatus = (issueId, newStatus) => {
    const updated = issues.map(iss => {
      if (iss.id === issueId) {
        const item = { ...iss, status: newStatus, updatedAt: new Date().toISOString() };
        item.timeline.push({
          step: newStatus,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          note: `Status updated by Municipal Authority to ${newStatus}`
        });
        return item;
      }
      return iss;
    });
    updateIssuesState(updated);
  };

  // Citizen Resolution Verification Feedback Handler
  const handleCitizenVerify = (issueId, feedbackType) => {
    const updated = issues.map(iss => {
      if (iss.id === issueId) {
        const item = { ...iss, citizenFeedback: feedbackType };
        if (feedbackType === 'reopened') {
          item.status = 'In Progress';
          item.priorityScore = Math.min(100, item.priorityScore + 15);
          item.timeline.push({
            step: 'Issue Reopened',
            time: 'Just now',
            note: 'Citizen reported issue still exists on ground. Priority score elevated by +15.'
          });
        } else {
          item.timeline.push({
            step: 'Citizen Verified',
            time: 'Just now',
            note: 'Citizen confirmed resolution 👍'
          });
        }
        return item;
      }
      return iss;
    });
    updateIssuesState(updated);
  };

  const totalActiveIssues = issues.filter(i => i.status !== 'Resolved').length;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOffline={isOffline}
        setIsOffline={setIsOffline}
        offlineQueueCount={offlineQueue.length}
        onSyncOffline={handleSyncOffline}
        totalActiveIssues={totalActiveIssues}
      />

      {/* Main Content Area */}
      <main style={{ flex: 1, paddingBottom: '40px' }}>
        {activeTab === 'citizen' && (
          <CitizenPortal
            issues={issues}
            onSubmitReport={handleSubmitReport}
            onCitizenVerify={handleCitizenVerify}
            isOffline={isOffline}
            onOpenExplainModal={setExplainModalIssue}
          />
        )}

        {activeTab === 'whatsapp' && (
          <WhatsAppSimulator
            onSubmitReport={handleSubmitReport}
          />
        )}

        {activeTab === 'authority' && (
          <AuthorityDashboard
            issues={issues}
            predictiveHotspots={predictiveHotspots}
            onUpdateStatus={handleUpdateStatus}
            onOpenExplainModal={setExplainModalIssue}
          />
        )}

        {activeTab === 'predictive' && (
          <PredictiveAiView
            predictiveHotspots={predictiveHotspots}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsView
            issues={issues}
          />
        )}
      </main>

      {/* Explainable AI Modal */}
      {explainModalIssue && (
        <ExplainableAiModal
          issue={explainModalIssue}
          onClose={() => setExplainModalIssue(null)}
        />
      )}

      {/* Footer */}
      <footer style={{
        textAlign: 'center',
        padding: '20px',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        color: '#64748b',
        fontSize: '0.8rem'
      }}>
        MyCity AI / Nagar Seva AI Platform • Powered by Multimodal Computer Vision & Explainable AI Engine
      </footer>
    </div>
  );
}
