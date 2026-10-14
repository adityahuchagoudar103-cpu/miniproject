import React, { useState, useEffect, useCallback } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider, useNotification } from './context/NotificationContext';
import { Navbar } from './components/Navbar';
import { ToastContainer } from './components/Toast';
import { HomePage } from './pages/HomePage';
import { JobsPage } from './pages/JobsPage';
import { InternshipsPage } from './pages/InternshipsPage';
import { BranchesPage } from './pages/BranchesPage';
import { StudentDashboardPage } from './pages/StudentDashboardPage';
import { ApplicationsPage } from './pages/ApplicationsPage';
import { SavedOpportunitiesPage } from './pages/SavedOpportunitiesPage';
import { RecruiterPage } from './pages/RecruiterPage';
import { AdminPage } from './pages/AdminPage';
import { OpportunityDetailsModal } from './components/OpportunityDetailsModal';
import { ApplyModal } from './components/ApplyModal';
import { AuthModal } from './components/AuthModal';
import { ProfileModal } from './components/ProfileModal';
import { BRANCHES } from './constants/branches';
import { GraduationCap, Sparkles, Heart, Shield, Code, ArrowUp } from 'lucide-react';

function MainApp() {
  const { user } = useAuth();
  const { addToast } = useNotification();

  const [activePage, setActivePage] = useState('home');
  const [selectedBranch, setSelectedBranch] = useState(user?.branch || 'All');

  // Modals state
  const [detailsModal, setDetailsModal] = useState({ isOpen: false, opportunity: null, type: 'job' });
  const [applyModal, setApplyModal] = useState({ isOpen: false, opportunity: null, type: 'job' });
  const [authModal, setAuthModal] = useState({ isOpen: false, mode: 'login' });
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  // User saved & applied items tracking sets
  const [savedIds, setSavedIds] = useState(new Set());
  const [appliedIds, setAppliedIds] = useState(new Set());

  // Fetch saved & applied IDs for the user
  const fetchUserActivity = useCallback(async () => {
    if (!user) {
      setSavedIds(new Set());
      setAppliedIds(new Set());
      return;
    }
    try {
      const headers = { 'x-user-id': user.id };
      const [savedRes, appsRes] = await Promise.all([
        fetch('/api/saved', { headers }).then(r => r.ok ? r.json() : []),
        fetch('/api/applications/my', { headers }).then(r => r.ok ? r.json() : [])
      ]);

      const sSet = new Set((savedRes || []).map(s => s.opportunityId));
      const aSet = new Set((appsRes || []).map(a => a.opportunityId));
      setSavedIds(sSet);
      setAppliedIds(aSet);
    } catch (err) {
      console.error('Failed to sync user activity state:', err);
    }
  }, [user]);

  useEffect(() => {
    fetchUserActivity();
  }, [fetchUserActivity]);

  // Handle Save / Bookmark toggle
  const handleToggleSave = async (opportunityId, opportunityType) => {
    if (!user) {
      setAuthModal({ isOpen: true, mode: 'login' });
      addToast('error', 'Sign In Required', 'Please sign in to bookmark opportunities.');
      return;
    }

    try {
      const res = await fetch('/api/saved/toggle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user.id
        },
        body: JSON.stringify({ opportunityId, opportunityType })
      });

      if (res.ok) {
        const data = await res.json();
        setSavedIds(prev => {
          const next = new Set(prev);
          if (data.saved) {
            next.add(opportunityId);
            addToast('success', 'Saved!', 'Opportunity added to your bookmarks.');
          } else {
            next.delete(opportunityId);
            addToast('info', 'Removed', 'Opportunity removed from bookmarks.');
          }
          return next;
        });
      }
    } catch (err) {
      console.error(err);
      addToast('error', 'Action Failed', 'Could not update saved status.');
    }
  };

  // Open apply modal handler
  const handleApply = (opportunity, type) => {
    if (!user) {
      setAuthModal({ isOpen: true, mode: 'login' });
      addToast('info', 'Login Required', 'Please sign in to submit your job application.');
      return;
    }
    if (user.role !== 'student') {
      addToast('error', 'Student Account Needed', `You are logged in as a ${user.role}. Only student accounts can apply.`);
      return;
    }
    setApplyModal({ isOpen: true, opportunity, type: type || 'job' });
  };

  // Open opportunity details modal
  const handleViewDetails = (opportunity, type) => {
    setDetailsModal({ isOpen: true, opportunity, type: type || 'job' });
  };

  // Scroll to top helper
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Navigation Header */}
      <Navbar
        activePage={activePage}
        setActivePage={page => {
          setActivePage(page);
          scrollToTop();
        }}
        selectedBranch={selectedBranch}
        setSelectedBranch={setSelectedBranch}
        openAuthModal={mode => setAuthModal({ isOpen: true, mode: mode || 'login' })}
      />

      {/* Main Content Area */}
      <main style={{ flex: 1 }}>
        {activePage === 'home' && (
          <HomePage
            setActivePage={setActivePage}
            onApply={handleApply}
            onViewDetails={handleViewDetails}
            savedIds={savedIds}
            appliedIds={appliedIds}
            onToggleSave={handleToggleSave}
          />
        )}

        {activePage === 'jobs' && (
          <JobsPage
            initialBranch={selectedBranch}
            onApply={handleApply}
            onViewDetails={handleViewDetails}
            savedIds={savedIds}
            appliedIds={appliedIds}
            onToggleSave={handleToggleSave}
          />
        )}

        {activePage === 'internships' && (
          <InternshipsPage
            initialBranch={selectedBranch}
            onApply={handleApply}
            onViewDetails={handleViewDetails}
            savedIds={savedIds}
            appliedIds={appliedIds}
            onToggleSave={handleToggleSave}
          />
        )}

        {activePage === 'branches' && (
          <BranchesPage
            initialBranch={selectedBranch}
            onApply={handleApply}
            onViewDetails={handleViewDetails}
            savedIds={savedIds}
            appliedIds={appliedIds}
            onToggleSave={handleToggleSave}
          />
        )}

        {activePage === 'dashboard' && (
          <StudentDashboardPage
            setActivePage={setActivePage}
            onApply={handleApply}
            onViewDetails={handleViewDetails}
            savedIds={savedIds}
            appliedIds={appliedIds}
            onToggleSave={handleToggleSave}
            openProfileModal={() => setProfileModalOpen(true)}
          />
        )}

        {activePage === 'applications' && (
          <ApplicationsPage
            setActivePage={setActivePage}
            onViewDetails={handleViewDetails}
          />
        )}

        {activePage === 'saved' && (
          <SavedOpportunitiesPage
            setActivePage={setActivePage}
            onApply={handleApply}
            onViewDetails={handleViewDetails}
            savedIds={savedIds}
            appliedIds={appliedIds}
            onToggleSave={handleToggleSave}
          />
        )}

        {activePage === 'recruiter' && (
          <RecruiterPage />
        )}

        {activePage === 'admin' && (
          <AdminPage />
        )}
      </main>

      {/* Modals Container */}
      {detailsModal.isOpen && detailsModal.opportunity && (
        <OpportunityDetailsModal
          opportunity={detailsModal.opportunity}
          type={detailsModal.type}
          hasApplied={appliedIds.has(detailsModal.opportunity.id)}
          onClose={() => setDetailsModal({ isOpen: false, opportunity: null, type: 'job' })}
          onApply={() => {
            const opp = detailsModal.opportunity;
            const t = detailsModal.type;
            setDetailsModal({ isOpen: false, opportunity: null, type: 'job' });
            handleApply(opp, t);
          }}
        />
      )}

      {applyModal.isOpen && applyModal.opportunity && (
        <ApplyModal
          opportunity={applyModal.opportunity}
          type={applyModal.type}
          onClose={() => setApplyModal({ isOpen: false, opportunity: null, type: 'job' })}
          onSuccess={() => {
            setAppliedIds(prev => new Set(prev).add(applyModal.opportunity.id));
            fetchUserActivity();
          }}
        />
      )}

      {authModal.isOpen && (
        <AuthModal
          initialMode={authModal.mode}
          onClose={() => setAuthModal({ isOpen: false, mode: 'login' })}
          onSuccess={() => {
            fetchUserActivity();
          }}
        />
      )}

      {profileModalOpen && (
        <ProfileModal
          onClose={() => setProfileModalOpen(false)}
        />
      )}

      {/* Floating Global Toasts */}
      <ToastContainer />

      {/* Footer */}
      <footer style={{
        background: 'var(--bg-secondary)',
        borderTop: '1px solid var(--border-subtle)',
        padding: '3.5rem 1.5rem 2rem',
        marginTop: 'auto'
      }}>
        <div style={{ maxWidth: '1440px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2rem' }}>
            {/* Brand column */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <GraduationCap size={20} color="#ffffff" />
                </div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>
                  Career<span className="gradient-accent">Nexus</span>
                </div>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>
                Unified Campus Placement & Internship Management Engine. Connecting engineering talent from all departments with high-growth technology pioneers and industry leaders.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.9rem', color: 'var(--text-primary)' }}>
                Platform Navigation
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                <li><button onClick={() => { setActivePage('jobs'); scrollToTop(); }} style={{ color: 'inherit' }}>Engineering Jobs</button></li>
                <li><button onClick={() => { setActivePage('internships'); scrollToTop(); }} style={{ color: 'inherit' }}>Industry Internships</button></li>
                <li><button onClick={() => { setActivePage('branches'); scrollToTop(); }} style={{ color: 'inherit' }}>Department Portals</button></li>
                {user?.role === 'student' && (
                  <li><button onClick={() => { setActivePage('applications'); scrollToTop(); }} style={{ color: 'inherit' }}>My Applications Tracker</button></li>
                )}
                {user?.role === 'recruiter' && (
                  <li><button onClick={() => { setActivePage('recruiter'); scrollToTop(); }} style={{ color: 'inherit' }}>Recruiter Hub</button></li>
                )}
                {user?.role === 'admin' && (
                  <li><button onClick={() => { setActivePage('admin'); scrollToTop(); }} style={{ color: 'inherit' }}>Campus Administrator</button></li>
                )}
              </ul>
            </div>

            {/* Department Hubs */}
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.9rem', color: 'var(--text-primary)' }}>
                Engineering Hubs
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {BRANCHES.slice(0, 8).map(b => (
                  <button
                    key={b.id}
                    onClick={() => {
                      setSelectedBranch(b.id);
                      setActivePage('branches');
                      scrollToTop();
                    }}
                    style={{
                      padding: '3px 8px',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      background: 'var(--bg-elevated)',
                      color: 'var(--text-secondary)',
                      border: '1px solid var(--border-subtle)'
                    }}
                  >
                    {b.short}
                  </button>
                ))}
              </div>
            </div>

            {/* Demo Accounts Quick Guide */}
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.9rem', color: 'var(--text-primary)' }}>
                Demo Personas
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', lineHeight: 1.5, marginBottom: '0.75rem' }}>
                Test all full-stack flows with 1-click role switcher in the top banner:
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                <div>• <strong>Student (CSE / ECE)</strong>: Browse, bookmark & apply with resumes</div>
                <div>• <strong>Recruiter</strong>: Manage candidates & schedule Meet/Zoom interviews</div>
                <div>• <strong>Admin</strong>: Placement metrics & student moderation</div>
              </div>
            </div>
          </div>

          <div style={{
            borderTop: '1px solid var(--border-subtle)',
            paddingTop: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            fontSize: '0.8rem',
            color: 'var(--text-muted)'
          }}>
            <div>
              © 2026 CareerNexus. All rights reserved. Engineered for Indian Engineering Campuses.
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span>Privacy Policy</span>
              <span>Terms of Placement</span>
              <span>Compliance</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <MainApp />
      </NotificationProvider>
    </AuthProvider>
  );
}
