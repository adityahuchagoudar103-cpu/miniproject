import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { JobCard } from '../components/JobCard';
import { InternshipCard } from '../components/InternshipCard';
import { STATUS_COLORS } from '../constants/branches';
import {
  GraduationCap,
  Briefcase,
  FileCheck,
  Calendar,
  Sparkles,
  ArrowRight,
  Video,
  Clock,
  CheckCircle,
  AlertCircle,
  Bookmark,
  ExternalLink,
  ChevronRight,
  UserCheck
} from 'lucide-react';

export const StudentDashboardPage = ({
  setActivePage,
  onApply,
  onViewDetails,
  savedIds,
  appliedIds,
  onToggleSave,
  openProfileModal
}) => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [recommendedInternships, setRecommendedInternships] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const headers = user?.id ? { 'x-user-id': user.id } : {};

        const [appsRes, jobsRes, internsRes] = await Promise.all([
          fetch('/api/applications/my', { headers }).then(r => r.ok ? r.json() : []),
          fetch(`/api/jobs?branch=${encodeURIComponent(user?.branch || 'All')}`).then(r => r.json()),
          fetch(`/api/internships?branch=${encodeURIComponent(user?.branch || 'All')}`).then(r => r.json())
        ]);

        setApplications(appsRes || []);
        setRecommendedJobs((jobsRes || []).slice(0, 3));
        setRecommendedInternships((internsRes || []).slice(0, 3));
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  // Derive stats
  const totalApplied = applications.length;
  const underReviewCount = applications.filter(a => a.status === 'Under Review' || a.status === 'Applied').length;
  const shortlistedCount = applications.filter(a => a.status === 'Shortlisted').length;
  const interviewScheduledList = applications.filter(a => a.status === 'Interview Scheduled' && a.interviewDetails);
  const selectedCount = applications.filter(a => a.status === 'Selected').length;

  return (
    <div style={{ maxWidth: '1360px', margin: '0 auto', padding: '2.5rem 1.5rem 4rem', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      {/* Welcome Banner */}
      <div className="glass-card" style={{
        padding: '2rem',
        borderRadius: '20px',
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(168, 85, 247, 0.08) 50%, var(--bg-card) 100%)',
        border: '1px solid rgba(99, 102, 241, 0.25)',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 800,
            fontSize: '1.75rem',
            boxShadow: '0 8px 20px rgba(99, 102, 241, 0.35)'
          }}>
            {user?.name ? user.name.charAt(0) : 'S'}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: '1.85rem' }}>Welcome back, {user?.name || 'Student'}!</h1>
              <span className="badge" style={{ background: 'rgba(99, 102, 241, 0.2)', color: '#818cf8', fontWeight: 700 }}>
                {user?.branch || 'CSE'}
              </span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem', marginTop: '4px' }}>
              {user?.college || 'Engineering Institute'} • {user?.degree || 'B.Tech'} • {user?.academicYear || '4th Year'}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            onClick={openProfileModal}
            className="btn btn-secondary"
            style={{ padding: '0.65rem 1.25rem', fontSize: '0.875rem' }}
          >
            Edit Profile & Resume
          </button>
          <button
            onClick={() => setActivePage('jobs')}
            className="btn btn-primary"
            style={{ padding: '0.65rem 1.25rem', fontSize: '0.875rem' }}
          >
            Browse New Jobs <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1.25rem'
      }}>
        {/* Total Applications */}
        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
              Applications
            </span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FileCheck size={18} />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800 }}>{totalApplied}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Submitted placement bids
          </div>
        </div>

        {/* Shortlisted */}
        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
              Shortlisted
            </span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(168, 85, 247, 0.15)', color: '#c084fc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sparkles size={18} />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#c084fc' }}>{shortlistedCount}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Cleared initial screening
          </div>
        </div>

        {/* Interviews Scheduled */}
        <div className="glass-card" style={{
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          borderColor: interviewScheduledList.length > 0 ? 'rgba(236, 72, 153, 0.5)' : 'var(--border-subtle)',
          boxShadow: interviewScheduledList.length > 0 ? '0 0 25px rgba(236, 72, 153, 0.2)' : 'none'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.85rem', color: '#f472b6', fontWeight: 700, textTransform: 'uppercase' }}>
              Interviews
            </span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(236, 72, 153, 0.2)', color: '#f472b6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Video size={18} />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#f472b6' }}>{interviewScheduledList.length}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Active interview invites
          </div>
        </div>

        {/* Offers / Selected */}
        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
              Offers Made
            </span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle size={18} />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#34d399' }}>{selectedCount}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Final selection offers
          </div>
        </div>
      </div>

      {/* Next Upcoming Interview Alert Box (if available) */}
      {interviewScheduledList.length > 0 && (
        <div className="glass-card" style={{
          padding: '1.5rem',
          borderRadius: '16px',
          border: '1px solid rgba(236, 72, 153, 0.4)',
          background: 'linear-gradient(90deg, rgba(236, 72, 153, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.25rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              background: '#ec4899',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              flexShrink: 0,
              boxShadow: '0 4px 14px rgba(236, 72, 153, 0.4)'
            }}>
              <Video size={24} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="badge" style={{ background: 'rgba(236, 72, 153, 0.25)', color: '#f472b6', fontWeight: 700 }}>
                  Upcoming Interview
                </span>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Application #{interviewScheduledList[0].id}
                </span>
              </div>
              <h3 style={{ fontSize: '1.25rem', marginTop: '4px' }}>
                {interviewScheduledList[0].opportunityTitle} @ {interviewScheduledList[0].company}
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '6px', fontSize: '0.85rem', color: 'var(--text-secondary)', flexWrap: 'wrap' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Calendar size={14} color="#f472b6" /> {interviewScheduledList[0].interviewDetails.date}
                </span>
                <span>•</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={14} color="#f472b6" /> {interviewScheduledList[0].interviewDetails.time}
                </span>
                <span>•</span>
                <span>Mode: <strong>{interviewScheduledList[0].interviewDetails.mode}</strong></span>
              </div>
              {interviewScheduledList[0].interviewDetails.note && (
                <div style={{ fontSize: '0.8rem', color: '#c7d2fe', marginTop: '6px', background: 'rgba(0,0,0,0.2)', padding: '4px 8px', borderRadius: '4px' }}>
                  Note: {interviewScheduledList[0].interviewDetails.note}
                </div>
              )}
            </div>
          </div>

          <div>
            {interviewScheduledList[0].interviewDetails.link ? (
              <a
                href={interviewScheduledList[0].interviewDetails.link}
                target="_blank"
                rel="noreferrer"
                className="btn btn-primary"
                style={{
                  background: 'linear-gradient(135deg, #ec4899 0%, #a855f7 100%)',
                  padding: '0.75rem 1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 14px rgba(236, 72, 153, 0.4)'
                }}
              >
                <Video size={18} /> Join Meeting <ExternalLink size={16} />
              </a>
            ) : (
              <button
                onClick={() => setActivePage('applications')}
                className="btn btn-secondary"
              >
                View Interview Details
              </button>
            )}
          </div>
        </div>
      )}

      {/* Recent Applications Section */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.35rem' }}>Your Application Statuses</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              Track the progress of your submitted placement applications
            </p>
          </div>
          <button
            onClick={() => setActivePage('applications')}
            style={{ color: 'var(--primary)', fontSize: '0.875rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            View All ({applications.length}) <ChevronRight size={16} />
          </button>
        </div>

        {applications.length === 0 ? (
          <div className="glass-card" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
            <FileCheck size={40} color="var(--text-muted)" style={{ margin: '0 auto 1rem' }} />
            <h3>No applications submitted yet</h3>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', marginBottom: '1.25rem' }}>
              Explore opportunities open for your branch and submit your first application.
            </p>
            <button className="btn btn-primary" onClick={() => setActivePage('jobs')}>
              Explore Jobs for {user?.branch || 'CSE'}
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {applications.slice(0, 4).map(app => {
              const statusCfg = STATUS_COLORS[app.status] || { bg: 'rgba(255,255,255,0.1)', text: 'white', border: 'transparent' };
              return (
                <div
                  key={app.id}
                  className="glass-card"
                  style={{
                    padding: '1.15rem 1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '1rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '10px',
                      background: 'var(--bg-elevated)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--primary)',
                      border: '1px solid var(--border-subtle)',
                      fontWeight: 700
                    }}>
                      {app.company.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '1rem' }}>{app.opportunityTitle}</div>
                      <div style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
                        {app.company} • Applied on {new Date(app.appliedAt).toLocaleDateString()} • ID: <code>{app.id}</code>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span
                      style={{
                        background: statusCfg.bg,
                        color: statusCfg.text,
                        border: `1px solid ${statusCfg.border}`,
                        padding: '4px 12px',
                        borderRadius: '9999px',
                        fontSize: '0.825rem',
                        fontWeight: 700
                      }}
                    >
                      {app.status}
                    </span>

                    <button
                      onClick={() => setActivePage('applications')}
                      className="btn btn-secondary"
                      style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem' }}
                    >
                      Track
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Recommended For Your Branch */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.35rem' }}>
              Recommended Jobs for <span className="gradient-accent">{user?.branch || 'Your Branch'}</span> Students
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              Full-time roles matching your engineering department and coursework
            </p>
          </div>
          <button
            onClick={() => setActivePage('jobs')}
            style={{ color: 'var(--primary)', fontSize: '0.875rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            View All Jobs <ChevronRight size={16} />
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
          {recommendedJobs.map(job => (
            <JobCard
              key={job.id}
              job={job}
              isSaved={Boolean(savedIds?.has(job.id))}
              hasApplied={Boolean(appliedIds?.has(job.id))}
              onApply={(j) => onApply(j, 'job')}
              onViewDetails={(j) => onViewDetails(j, 'job')}
              onToggleSave={onToggleSave}
            />
          ))}
        </div>

        {recommendedInternships.length > 0 && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div>
                <h2 style={{ fontSize: '1.35rem' }}>
                  Recommended Internships for <span className="gradient-accent">{user?.branch || 'Your Branch'}</span> Students
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                  Fast-track summer & semester internships open for your academic year
                </p>
              </div>
              <button
                onClick={() => setActivePage('internships')}
                style={{ color: '#a855f7', fontSize: '0.875rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                View All Internships <ChevronRight size={16} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1.5rem' }}>
              {recommendedInternships.map(intern => (
                <InternshipCard
                  key={intern.id}
                  internship={intern}
                  isSaved={Boolean(savedIds?.has(intern.id))}
                  hasApplied={Boolean(appliedIds?.has(intern.id))}
                  onApply={(i) => onApply(i, 'internship')}
                  onViewDetails={(i) => onViewDetails(i, 'internship')}
                  onToggleSave={onToggleSave}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
