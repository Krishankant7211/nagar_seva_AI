import React, { useState, useEffect } from 'react';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { AdminSidebar } from './components/layout/AdminSidebar';

import { HomePage } from './components/citizen/HomePage';
import { ReportIssuePage } from './components/citizen/ReportIssuePage';
import { CommunityFeedPage } from './components/citizen/CommunityFeedPage';
import { ComplaintDetailPage } from './components/citizen/ComplaintDetailPage';
import { MyReportsPage } from './components/citizen/MyReportsPage';
import { ProfilePage } from './components/citizen/ProfilePage';
import { AuthModal } from './components/AuthModal';
import { DuplicateWarningModal } from './components/DuplicateWarningModal';

import { AdminDashboardView } from './components/admin/AdminDashboard';
import { AdminComplaintsTable } from './components/admin/AdminComplaintsTable';
import { AdminAnalyticsPage } from './components/admin/AdminAnalyticsPage';
import { AdminLoginModal } from './components/AdminLoginModal';

import { apiService } from './services/api';

export default function App() {
  // Navigation & User session states
  const [activeTab, setActiveTab] = useState('home'); // home | report | community | my-reports | profile
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeAdminTab, setActiveAdminTab] = useState('dashboard'); // dashboard | complaints | analytics

  const [user, setUser] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [analytics, setAnalytics] = useState({
    total_complaints: 0,
    pending: 0,
    in_progress: 0,
    resolved: 0,
    rejected: 0
  });
  const [loading, setLoading] = useState(true);

  // Modals & detail view states
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [duplicateModal, setDuplicateModal] = useState({
    isOpen: false,
    matchedComplaint: null,
    pendingPayload: null
  });

  useEffect(() => {
    // 1. Restore persistent user session
    const savedUser = apiService.getCurrentUser();
    if (savedUser) {
      setUser(savedUser);
    }
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await apiService.getComplaints();
      setComplaints(data);
      const stats = await apiService.getAdminAnalytics();
      setAnalytics(stats);
    } catch (e) {
      console.error('Data load error:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleSupport = async (complaintId) => {
    if (!user) {
      setIsAuthOpen(true);
      throw new Error('Please login to support');
    }
    if (!user.is_verified) {
      setIsAuthOpen(true);
      throw new Error('Aadhaar verification required');
    }
    const res = await apiService.supportComplaint(complaintId, user.id);
    await loadData();
    return res;
  };

  const handleAdminToggle = (targetState) => {
    if (targetState && !isAdmin) {
      setIsAdminLoginOpen(true);
    } else {
      setIsAdmin(false);
    }
  };

  const handleLogout = () => {
    apiService.logoutUser();
    setUser(null);
    setActiveTab('home');
  };

  const handleShowDuplicateWarning = (matchedComplaint, pendingPayload) => {
    setDuplicateModal({
      isOpen: true,
      matchedComplaint,
      pendingPayload
    });
  };

  const handleSupportExistingFromDuplicate = async (matchedId) => {
    if (user && user.is_verified) {
      await apiService.supportComplaint(matchedId, user.id);
      await loadData();
    } else {
      setIsAuthOpen(true);
    }
  };

  const handleSubmitAnywayFromDuplicate = async (pendingPayload) => {
    await apiService.createComplaint(pendingPayload);
    await loadData();
  };

  const handleUpdateStatus = async (id, newStatus) => {
    await apiService.updateStatus(id, newStatus);
    await loadData();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      
      {/* Header Bar */}
      <Header
        activeTab={activeTab}
        onNavigate={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        user={user}
        isAdmin={isAdmin}
        onOpenAuth={() => setIsAuthOpen(true)}
        onToggleAdmin={handleAdminToggle}
        onLogout={handleLogout}
      />

      {/* Main View Area */}
      <div className="flex-1 flex">
        
        {/* Admin Interface Layout with Sidebar */}
        {isAdmin ? (
          <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto">
            <AdminSidebar
              activeAdminTab={activeAdminTab}
              onAdminTabChange={setActiveAdminTab}
              onExitAdmin={() => setIsAdmin(false)}
            />
            
            <main className="flex-1 p-6 md:p-8 bg-slate-50 min-w-0">
              {activeAdminTab === 'dashboard' && (
                <AdminDashboardView
                  analytics={analytics}
                  complaints={complaints}
                  onSelectComplaint={(c) => setSelectedComplaint(c)}
                  onNavigateToTab={setActiveAdminTab}
                />
              )}

              {activeAdminTab === 'complaints' && (
                <AdminComplaintsTable
                  complaints={complaints}
                  onUpdateStatus={handleUpdateStatus}
                  onSelectComplaint={(c) => setSelectedComplaint(c)}
                />
              )}

              {activeAdminTab === 'analytics' && (
                <AdminAnalyticsPage
                  analytics={analytics}
                  complaints={complaints}
                />
              )}
            </main>
          </div>
        ) : (
          /* Citizen View Layout */
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {activeTab === 'home' && (
              <HomePage
                complaints={complaints}
                analytics={analytics}
                onNavigate={setActiveTab}
                currentUser={user}
                onSupport={handleSupport}
                onOpenAuth={() => setIsAuthOpen(true)}
                onSelectComplaint={(c) => setSelectedComplaint(c)}
              />
            )}

            {activeTab === 'report' && (
              <ReportIssuePage
                currentUser={user}
                onOpenAuth={() => setIsAuthOpen(true)}
                onShowDuplicateWarning={handleShowDuplicateWarning}
                onSubmitSuccess={() => loadData()}
                onNavigate={setActiveTab}
              />
            )}

            {activeTab === 'community' && (
              <CommunityFeedPage
                complaints={complaints}
                currentUser={user}
                onSupport={handleSupport}
                onOpenAuth={() => setIsAuthOpen(true)}
                onNavigate={setActiveTab}
                onSelectComplaint={(c) => setSelectedComplaint(c)}
                loading={loading}
              />
            )}

            {activeTab === 'my-reports' && (
              <MyReportsPage
                complaints={complaints}
                currentUser={user}
                onNavigate={setActiveTab}
                onSelectComplaint={(c) => setSelectedComplaint(c)}
              />
            )}

            {activeTab === 'profile' && (
              <ProfilePage
                currentUser={user}
                onOpenAuth={() => setIsAuthOpen(true)}
                onLogout={handleLogout}
              />
            )}
          </main>
        )}
      </div>

      {/* Official Government Footer */}
      <Footer />

      {/* Modals & Dialogs */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        existingUser={user}
        onAuthSuccess={(u) => setUser(u)}
      />

      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onAdminLoginSuccess={() => setIsAdmin(true)}
      />

      {selectedComplaint && (
        <ComplaintDetailPage
          complaint={selectedComplaint}
          onClose={() => setSelectedComplaint(null)}
          allComplaints={complaints}
          currentUser={user}
          onSupport={handleSupport}
          onOpenAuth={() => setIsAuthOpen(true)}
          onSelectComplaint={(c) => setSelectedComplaint(c)}
        />
      )}

      <DuplicateWarningModal
        isOpen={duplicateModal.isOpen}
        onClose={() => setDuplicateModal({ isOpen: false, matchedComplaint: null, pendingPayload: null })}
        matchedComplaint={duplicateModal.matchedComplaint}
        pendingPayload={duplicateModal.pendingPayload}
        onSupportExisting={handleSupportExistingFromDuplicate}
        onSubmitAnyway={handleSubmitAnywayFromDuplicate}
        currentUser={user}
      />
    </div>
  );
}
