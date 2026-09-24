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
import { DuplicateWarningModal } from './components/DuplicateWarningModal';

import { AdminDashboardView } from './components/admin/AdminDashboard';
import { AdminComplaintsTable } from './components/admin/AdminComplaintsTable';
import { AdminAnalyticsPage } from './components/admin/AdminAnalyticsPage';
import { AdminLoginModal } from './components/AdminLoginModal';

// New Supabase Auth & Identity pages
import { RegisterPage } from './components/auth/RegisterPage';
import { LoginPage } from './components/auth/LoginPage';
import { IdentityVerificationPage } from './components/auth/IdentityVerificationPage';
import { WhatsAppLinkModal } from './components/auth/WhatsAppLinkModal';

import { apiService } from './services/api';
import { authService } from './services/authService';

/**
 * Determines which onboarding screen the citizen should see.
 * Returns: 'register' | 'login' | 'verify' | 'whatsapp' | null (= platform access)
 */
function getAuthScreen(user) {
  if (!user) return 'login';
  if (!user.is_aadhaar_verified) return 'verify';
  return null;
}

export default function App() {
  // Navigation & User session states
  const [activeTab, setActiveTab] = useState('home');
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeAdminTab, setActiveAdminTab] = useState('dashboard');

  const [user, setUser] = useState(null);
  const [authScreen, setAuthScreen] = useState(null); // null = logged in + verified
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [complaints, setComplaints] = useState([]);
  const [analytics, setAnalytics] = useState({
    total_complaints: 0,
    pending: 0,
    in_progress: 0,
    resolved: 0,
    rejected: 0
  });
  const [loading, setLoading] = useState(true);

  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [duplicateModal, setDuplicateModal] = useState({
    isOpen: false,
    matchedComplaint: null,
    pendingPayload: null
  });

  useEffect(() => {
    const savedUser = apiService.getCurrentUser();
    if (savedUser) {
      setUser(savedUser);
      const screen = getAuthScreen(savedUser);
      setAuthScreen(screen);
    } else {
      setAuthScreen('login');
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

  // Called after Supabase register
  const handleRegistered = (newUser) => {
    setUser(newUser);
    setAuthScreen('login');
  };

  // Called after successful login
  const handleLoggedIn = (loggedUser) => {
    setUser(loggedUser);
    const screen = getAuthScreen(loggedUser);
    setAuthScreen(screen);
  };

  // Called after Aadhaar verification
  const handleVerified = (verifiedUser) => {
    setUser(verifiedUser);
    apiService.saveCurrentUser(verifiedUser);
    // Offer WhatsApp linking if not already linked
    if (!verifiedUser.whatsapp_number) {
      setShowWhatsAppModal(true);
    }
    setAuthScreen(null);
  };

  // Called after WhatsApp linking (or skipped)
  const handleWhatsAppDone = (updatedUser) => {
    if (updatedUser) {
      setUser(updatedUser);
      apiService.saveCurrentUser(updatedUser);
    }
    setShowWhatsAppModal(false);
  };

  const handleSupport = async (complaintId) => {
    if (!user) {
      setAuthScreen('login');
      throw new Error('Please login to support');
    }
    if (!user.is_aadhaar_verified) {
      setAuthScreen('verify');
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

  const handleLogout = async () => {
    await authService.logout();
    setUser(null);
    setActiveTab('home');
    setAuthScreen('login');
  };

  const handleShowDuplicateWarning = (matchedComplaint, pendingPayload) => {
    setDuplicateModal({ isOpen: true, matchedComplaint, pendingPayload });
  };

  const handleSupportExistingFromDuplicate = async (matchedId) => {
    if (user && user.is_aadhaar_verified) {
      await apiService.supportComplaint(matchedId, user.id);
      await loadData();
    } else {
      setAuthScreen(user ? 'verify' : 'login');
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

  // ---- Onboarding Gate ----
  // Only citizen-facing screens are gated. Admin modal handles its own auth.
  if (!isAdmin && authScreen === 'register') {
    return (
      <RegisterPage
        onRegistered={handleRegistered}
        onGoToLogin={() => setAuthScreen('login')}
      />
    );
  }

  if (!isAdmin && authScreen === 'login') {
    return (
      <LoginPage
        onLoggedIn={handleLoggedIn}
        onGoToRegister={() => setAuthScreen('register')}
      />
    );
  }

  if (!isAdmin && authScreen === 'verify' && user) {
    return (
      <IdentityVerificationPage
        user={user}
        onVerified={handleVerified}
      />
    );
  }

  // ---- Main Platform ----
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
        onOpenAuth={() => setAuthScreen('login')}
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
                onOpenAuth={() => setAuthScreen('login')}
                onSelectComplaint={(c) => setSelectedComplaint(c)}
              />
            )}

            {activeTab === 'report' && (
              <ReportIssuePage
                currentUser={user}
                onOpenAuth={() => setAuthScreen('login')}
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
                onOpenAuth={() => setAuthScreen('login')}
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
                onOpenAuth={() => setAuthScreen('login')}
                onLogout={handleLogout}
                onInitiateVerification={() => setAuthScreen('verify')}
              />
            )}
          </main>
        )}
      </div>

      {/* Official Government Footer */}
      <Footer />

      {/* WhatsApp Linking Modal (post-verification) */}
      {showWhatsAppModal && user && (
        <WhatsAppLinkModal
          user={user}
          onLinked={handleWhatsAppDone}
          onSkip={() => handleWhatsAppDone(null)}
        />
      )}

      {/* Admin Login Modal */}
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
          onOpenAuth={() => setAuthScreen('login')}
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
