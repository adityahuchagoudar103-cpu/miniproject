import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { STATUS_COLORS } from '../constants/branches';
import {
  FileCheck,
  Building,
  Calendar,
  Clock,
  Video,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Search,
  CheckCircle2,
  AlertCircle,
  FileText,
  ArrowRight,
  Filter
} from 'lucide-react';

const STAGES = ['Applied', 'Under Review', 'Shortlisted', 'Interview Scheduled', 'Selected'];

export const ApplicationsPage = ({ setActivePage, onViewDetails }) => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [expandedTimelines, setExpandedTimelines] = useState({});

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const headers = user?.id ? { 'x-user-id': user.id } : {};
        const res = await fetch('/api/applications/my', { headers });
        if (res.ok) {
          const data = await res.json();
          setApplications(data);
        }
      } catch (err) {
        console.error('Error fetching applications:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [user]);

  const toggleTimeline = (id) => {
    setExpandedTimelines(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const filteredApplications = applications.filter(app => {
    const matchesStatus = statusFilter === 'All' || app.status === statusFilter;
    const matchesType = typeFilter === 'All' || app.opportunityType === typeFilter;
    const matchesSearch = search === '' ||
      app.opportunityTitle.toLowerCase().includes(search.toLowerCase()) ||
      app.company.toLowerCase().includes(search.toLowerCase()) ||
      app.id.toLowerCase().includes(search.toLowerCase());

    return matchesStatus && matchesType && matchesSearch;
  });

  const getStageIndex = (currentStatus) => {
    if (currentStatus === 'Rejected') return -1;
    return STAGES.indexOf(currentStatus);
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2.5rem 1.5rem 4rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(99, 102, 241, 0.12)', border: '1px solid rgba(99, 102, 241, 0.3)', padding: '0.4rem 1rem', borderRadius: '9999px', color: '#818cf8', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.75rem' }}>
          <FileCheck size={16} />
          <span>Real-Time Placement Tracking</span>
        </div>
        <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', lineHeight: 1.2 }}>
          My Applications Tracker
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginTop: '4px' }}>
          Monitor your recruitment stages, interview links, and hiring team responses in real time.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {/* Status Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          {['All', 'Applied', 'Under Review', 'Shortlisted', 'Interview Scheduled', 'Selected', 'Rejected'].map(s => {
            const isSelected = statusFilter === s;
            const count = s === 'All' ? applications.length : applications.filter(a => a.status === s).length;
            return (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                style={{
                  padding: '0.4rem 0.85rem',
                  borderRadius: '9999px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  background: isSelected ? 'var(--primary)' : 'var(--bg-elevated)',
                  color: isSelected ? 'white' : 'var(--text-secondary)',
                  border: isSelected ? '1px solid var(--primary)' : '1px solid var(--border-subtle)',
                  transition: 'all 0.2s'
                }}
              >
                {s} ({count})
              </button>
            );
          })}
        </div>

        {/* Search & Type filter */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              className="input-field"
              style={{ paddingLeft: '2.4rem' }}
              placeholder="Search by job title, company, or Application ID..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Type:</span>
            <select
              className="input-field"
              style={{ width: 'auto', padding: '0.5rem 1rem' }}
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value)}
            >
              <option value="All">All Types</option>
              <option value="job">Jobs Only</option>
              <option value="internship">Internships Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Applications List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
          <div className="spinner" style={{ margin: '0 auto 1rem' }} />
          Loading your applications...
        </div>
      ) : filteredApplications.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '4rem 1.5rem' }}>
          <FileCheck size={48} color="var(--text-muted)" style={{ margin: '0 auto 1.25rem' }} />
          <h3>No applications found</h3>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', marginBottom: '1.5rem' }}>
            {statusFilter !== 'All' ? `You have no applications currently marked as "${statusFilter}".` : "You haven't submitted any job or internship applications yet."}
          </p>
          <button className="btn btn-primary" onClick={() => setActivePage('jobs')}>
            Browse Available Roles
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {filteredApplications.map(app => {
            const statusCfg = STATUS_COLORS[app.status] || { bg: 'rgba(255,255,255,0.1)', text: 'white', border: 'transparent' };
            const currentStageIdx = getStageIndex(app.status);
            const isExpanded = Boolean(expandedTimelines[app.id]);

            return (
              <div
                key={app.id}
                className="glass-card"
                style={{
                  padding: '1.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.5rem',
                  borderLeft: `5px solid ${statusCfg.text}`
                }}
              >
                {/* Header row */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                    <div style={{
                      width: '52px',
                      height: '52px',
                      borderRadius: '12px',
                      background: 'var(--bg-elevated)',
                      border: '1px solid var(--border-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '1.2rem',
                      color: 'var(--primary)'
                    }}>
                      {app.company.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <span className="badge" style={{
                          background: app.opportunityType === 'job' ? 'rgba(99, 102, 241, 0.15)' : 'rgba(139, 92, 246, 0.15)',
                          color: app.opportunityType === 'job' ? '#818cf8' : '#c084fc'
                        }}>
                          {app.opportunityType === 'job' ? 'Job' : 'Internship'}
                        </span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          Application ID: <code>{app.id}</code>
                        </span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          • Applied {new Date(app.appliedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <h2 style={{ fontSize: '1.35rem', marginTop: '4px' }}>{app.opportunityTitle}</h2>
                      <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                        {app.company}
                      </div>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div>
                    <span style={{
                      background: statusCfg.bg,
                      color: statusCfg.text,
                      border: `1px solid ${statusCfg.border}`,
                      padding: '6px 16px',
                      borderRadius: '9999px',
                      fontSize: '0.875rem',
                      fontWeight: 800,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: statusCfg.text }} />
                      {app.status}
                    </span>
                  </div>
                </div>

                {/* Progress Stepper (if not rejected) */}
                {app.status !== 'Rejected' ? (
                  <div style={{ padding: '0.5rem 0' }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      position: 'relative'
                    }}>
                      {/* Connector Line */}
                      <div style={{
                        position: 'absolute',
                        top: '14px',
                        left: '4%',
                        right: '4%',
                        height: '3px',
                        background: 'var(--bg-elevated)',
                        zIndex: 1
                      }} />
                      <div style={{
                        position: 'absolute',
                        top: '14px',
                        left: '4%',
                        width: `${Math.max(0, (currentStageIdx / (STAGES.length - 1)) * 92)}%`,
                        height: '3px',
                        background: 'linear-gradient(90deg, #6366f1 0%, #10b981 100%)',
                        zIndex: 2,
                        transition: 'width 0.4s ease'
                      }} />

                      {STAGES.map((stage, idx) => {
                        const isDone = idx < currentStageIdx;
                        const isCurrent = idx === currentStageIdx;

                        return (
                          <div key={stage} style={{ position: 'relative', zIndex: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', width: '90px' }}>
                            <div style={{
                              width: '30px',
                              height: '30px',
                              borderRadius: '50%',
                              background: isDone ? '#10b981' : (isCurrent ? 'var(--primary)' : 'var(--bg-secondary)'),
                              border: isCurrent ? '3px solid #818cf8' : '2px solid var(--border-subtle)',
                              color: 'white',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              marginBottom: '6px',
                              boxShadow: isCurrent ? '0 0 14px rgba(99, 102, 241, 0.5)' : 'none'
                            }}>
                              {isDone ? <CheckCircle2 size={16} /> : idx + 1}
                            </div>
                            <span style={{
                              fontSize: '0.75rem',
                              fontWeight: isCurrent ? 700 : 500,
                              color: isCurrent ? 'white' : (isDone ? 'var(--text-secondary)' : 'var(--text-muted)')
                            }}>
                              {stage}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div style={{
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    borderRadius: '10px',
                    padding: '0.85rem 1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    color: '#f87171',
                    fontSize: '0.85rem'
                  }}>
                    <AlertCircle size={18} />
                    <span>Application status has been marked as <strong>Rejected</strong>. We encourage you to apply for other matching engineering positions!</span>
                  </div>
                )}

                {/* Interview Invitation Box (if interview scheduled) */}
                {app.status === 'Interview Scheduled' && app.interviewDetails && (
                  <div style={{
                    background: 'rgba(236, 72, 153, 0.12)',
                    border: '1px solid rgba(236, 72, 153, 0.35)',
                    borderRadius: '12px',
                    padding: '1.25rem',
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem'
                  }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#f472b6', fontWeight: 700, fontSize: '0.9rem' }}>
                        <Video size={18} /> Technical Interview Invitation
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginTop: '6px', fontSize: '0.875rem', color: 'var(--text-primary)', flexWrap: 'wrap' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Calendar size={14} color="#f472b6" /> Date: <strong>{app.interviewDetails.date}</strong>
                        </span>
                        <span>•</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Clock size={14} color="#f472b6" /> Time: <strong>{app.interviewDetails.time}</strong>
                        </span>
                        <span>•</span>
                        <span>Platform: <strong>{app.interviewDetails.mode}</strong></span>
                      </div>
                      {app.interviewDetails.note && (
                        <div style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginTop: '6px' }}>
                          Note: {app.interviewDetails.note}
                        </div>
                      )}
                    </div>

                    {app.interviewDetails.link && (
                      <a
                        href={app.interviewDetails.link}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-primary"
                        style={{
                          background: 'linear-gradient(135deg, #ec4899 0%, #a855f7 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <Video size={16} /> Join Video Call <ExternalLink size={14} />
                      </a>
                    )}
                  </div>
                )}

                {/* Footer row: Resume and Timeline Expandable */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderTop: '1px solid var(--border-subtle)',
                  paddingTop: '1rem',
                  fontSize: '0.85rem',
                  color: 'var(--text-secondary)',
                  flexWrap: 'wrap',
                  gap: '0.75rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <FileText size={16} color="var(--primary)" />
                      Resume attached: <strong>{app.resumeOriginalName || 'Resume.pdf'}</strong>
                    </span>
                    {app.resumeUrl && (
                      <a
                        href={app.resumeUrl}
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: 'var(--primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}
                      >
                        Preview <ExternalLink size={13} />
                      </a>
                    )}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button
                      onClick={() => toggleTimeline(app.id)}
                      style={{
                        color: 'var(--text-secondary)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '0.825rem',
                        fontWeight: 600
                      }}
                    >
                      Audit Trail ({app.statusHistory ? app.statusHistory.length : 1} updates)
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                  </div>
                </div>

                {/* Expandable Timeline Details */}
                {isExpanded && (
                  <div style={{
                    background: 'var(--bg-elevated)',
                    borderRadius: '10px',
                    padding: '1rem 1.25rem',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.85rem'
                  }}>
                    <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-primary)' }}>
                      Application Timeline History
                    </div>
                    {app.statusHistory && app.statusHistory.map((h, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', position: 'relative' }}>
                        <div style={{
                          width: '10px',
                          height: '10px',
                          borderRadius: '50%',
                          background: 'var(--primary)',
                          marginTop: '6px',
                          flexShrink: 0
                        }} />
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <strong style={{ fontSize: '0.85rem' }}>{h.status}</strong>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                              {new Date(h.date).toLocaleString()}
                            </span>
                          </div>
                          {h.note && (
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                              {h.note}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}

                    {app.coverLetter && (
                      <div style={{ marginTop: '0.5rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.5rem' }}>
                        <div style={{ fontSize: '0.785rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '2px' }}>
                          Submitted Cover Note:
                        </div>
                        <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                          "{app.coverLetter}"
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
