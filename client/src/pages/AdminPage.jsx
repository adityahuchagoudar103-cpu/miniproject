import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { BRANCHES } from '../constants/branches';
import {
  ShieldAlert,
  Users,
  Briefcase,
  Sparkles,
  FileCheck,
  TrendingUp,
  UserCheck,
  UserX,
  Search,
  Trash2,
  ExternalLink,
  Building,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

export const AdminPage = () => {
  const { user } = useAuth();
  const { addToast } = useNotification();

  const [metrics, setMetrics] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);

  // Tab & Filters
  const [activeTab, setActiveTab] = useState('metrics'); // 'metrics' | 'users' | 'postings'
  const [userRoleFilter, setUserRoleFilter] = useState('All');
  const [userSearch, setUserSearch] = useState('');

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const headers = { 'x-user-id': user.id };

      const [metricsRes, usersRes, jobsRes, internsRes] = await Promise.all([
        fetch('/api/admin/metrics', { headers }).then(r => r.ok ? r.json() : null),
        fetch('/api/admin/users', { headers }).then(r => r.ok ? r.json() : []),
        fetch('/api/jobs').then(r => r.json()),
        fetch('/api/internships').then(r => r.json())
      ]);

      setMetrics(metricsRes);
      setUsersList(usersRes || []);
      setJobs(jobsRes || []);
      setInternships(internsRes || []);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, [user]);

  const handleToggleUserStatus = async (userId, currentStatus) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}/toggle`, {
        method: 'PATCH',
        headers: { 'x-user-id': user.id }
      });
      if (!res.ok) throw new Error('Failed to toggle status');
      const updated = await res.json();
      addToast(
        updated.status === 'active' ? 'success' : 'error',
        'User Status Changed',
        `User ${updated.name} has been set to "${updated.status}".`
      );
      setUsersList(prev => prev.map(u => u.id === userId ? { ...u, status: updated.status } : u));
    } catch (err) {
      addToast('error', 'Action Failed', err.message);
    }
  };

  const handleDeletePosting = async (id, type) => {
    if (!window.confirm(`Are you sure you want to remove this ${type}?`)) return;
    try {
      const endpoint = type === 'job' ? `/api/jobs/${id}` : `/api/internships/${id}`;
      const res = await fetch(endpoint, {
        method: 'DELETE',
        headers: { 'x-user-id': user.id }
      });
      if (!res.ok) throw new Error('Failed to delete');
      addToast('success', 'Posting Removed', `The ${type} has been deleted from the campus platform.`);
      fetchAdminData();
    } catch (err) {
      addToast('error', 'Error', err.message);
    }
  };

  const filteredUsers = usersList.filter(u => {
    const matchesRole = userRoleFilter === 'All' || u.role === userRoleFilter;
    const matchesSearch = userSearch === '' ||
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      (u.college && u.college.toLowerCase().includes(userSearch.toLowerCase())) ||
      (u.branch && u.branch.toLowerCase().includes(userSearch.toLowerCase())) ||
      (u.companyName && u.companyName.toLowerCase().includes(userSearch.toLowerCase()));

    return matchesRole && matchesSearch;
  });

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '2.5rem 1.5rem 4rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Admin Header */}
      <div className="glass-card" style={{
        padding: '2rem',
        borderRadius: '20px',
        background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.12) 0%, rgba(168, 85, 247, 0.08) 50%, var(--bg-card) 100%)',
        border: '1px solid rgba(239, 68, 68, 0.25)',
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
            background: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 800,
            fontSize: '1.75rem',
            boxShadow: '0 8px 20px rgba(239, 68, 68, 0.35)'
          }}>
            <ShieldAlert size={34} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: '1.85rem' }}>Campus Placement Administrator</h1>
              <span className="badge" style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#f87171', fontWeight: 700 }}>
                Super Admin
              </span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem', marginTop: '4px' }}>
              Global platform controls, multi-department analytics, and placement compliance.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Status:</span>
          <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', fontWeight: 700 }}>
            Operational • Healthy
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        background: 'var(--bg-elevated)',
        padding: '4px',
        borderRadius: '12px',
        border: '1px solid var(--border-subtle)',
        width: 'fit-content'
      }}>
        <button
          onClick={() => setActiveTab('metrics')}
          style={{
            padding: '0.6rem 1.25rem',
            borderRadius: '8px',
            fontSize: '0.875rem',
            fontWeight: 600,
            background: activeTab === 'metrics' ? 'var(--primary)' : 'transparent',
            color: activeTab === 'metrics' ? 'white' : 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <TrendingUp size={16} /> Placement Analytics
        </button>
        <button
          onClick={() => setActiveTab('users')}
          style={{
            padding: '0.6rem 1.25rem',
            borderRadius: '8px',
            fontSize: '0.875rem',
            fontWeight: 600,
            background: activeTab === 'users' ? 'var(--primary)' : 'transparent',
            color: activeTab === 'users' ? 'white' : 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Users size={16} /> User Management ({usersList.length})
        </button>
        <button
          onClick={() => setActiveTab('postings')}
          style={{
            padding: '0.6rem 1.25rem',
            borderRadius: '8px',
            fontSize: '0.875rem',
            fontWeight: 600,
            background: activeTab === 'postings' ? 'var(--primary)' : 'transparent',
            color: activeTab === 'postings' ? 'white' : 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Briefcase size={16} /> All Platform Opportunities ({jobs.length + internships.length})
        </button>
      </div>

      {/* Tab 1: Placement Metrics */}
      {activeTab === 'metrics' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Key Metric Numbers */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.25rem'
          }}>
            <div className="glass-card" style={{ padding: '1.5rem' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
                Students Registered
              </div>
              <div style={{ fontSize: '2.4rem', fontWeight: 800, marginTop: '4px', color: '#6366f1' }}>
                {metrics?.totalStudents || usersList.filter(u => u.role === 'student').length}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Across all departments</div>
            </div>

            <div className="glass-card" style={{ padding: '1.5rem' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
                Corporate Partners
              </div>
              <div style={{ fontSize: '2.4rem', fontWeight: 800, marginTop: '4px', color: '#10b981' }}>
                {metrics?.totalRecruiters || usersList.filter(u => u.role === 'recruiter').length}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Active hiring companies</div>
            </div>

            <div className="glass-card" style={{ padding: '1.5rem' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
                Active Opportunities
              </div>
              <div style={{ fontSize: '2.4rem', fontWeight: 800, marginTop: '4px', color: '#a855f7' }}>
                {jobs.length + internships.length}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                {jobs.length} Jobs • {internships.length} Internships
              </div>
            </div>

            <div className="glass-card" style={{ padding: '1.5rem' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
                Applications Handled
              </div>
              <div style={{ fontSize: '2.4rem', fontWeight: 800, marginTop: '4px', color: '#38bdf8' }}>
                {metrics?.totalApplications || 0}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Placement cycle submissions</div>
            </div>
          </div>

          {/* Department Breakdown Cards */}
          <div>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '1rem' }}>Departmental Opportunity Matrix</h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '1rem'
            }}>
              {BRANCHES.map(b => {
                const branchJobs = jobs.filter(j => j.eligibleBranches.includes(b.id) || j.eligibleBranches.includes('All'));
                const branchInterns = internships.filter(i => i.eligibleBranches.includes(b.id) || i.eligibleBranches.includes('All'));
                const studentCount = usersList.filter(u => u.role === 'student' && u.branch === b.id).length;

                return (
                  <div key={b.id} className="glass-card" style={{ padding: '1.25rem', borderLeft: `4px solid ${b.color}` }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span style={{ fontWeight: 700, fontSize: '1rem' }}>{b.short}</span>
                      <span className="badge" style={{ background: `${b.color}22`, color: b.color, fontWeight: 700 }}>
                        {studentCount} Students
                      </span>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                      {b.name}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.5rem', fontSize: '0.8rem' }}>
                      <span>Jobs Open: <strong>{branchJobs.length}</strong></span>
                      <span>Internships: <strong>{branchInterns.length}</strong></span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: User Management */}
      {activeTab === 'users' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* User Filter & Search */}
          <div className="glass-card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {['All', 'student', 'recruiter', 'admin'].map(r => (
                <button
                  key={r}
                  onClick={() => setUserRoleFilter(r)}
                  style={{
                    padding: '0.4rem 0.9rem',
                    borderRadius: '8px',
                    fontSize: '0.825rem',
                    fontWeight: 600,
                    textTransform: 'capitalize',
                    background: userRoleFilter === r ? 'var(--primary)' : 'var(--bg-elevated)',
                    color: userRoleFilter === r ? 'white' : 'var(--text-secondary)',
                    border: userRoleFilter === r ? '1px solid var(--primary)' : '1px solid var(--border-subtle)'
                  }}
                >
                  {r === 'All' ? 'All Roles' : `${r}s`}
                </button>
              ))}
            </div>

            <div style={{ position: 'relative', width: '320px' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                className="input-field"
                style={{ paddingLeft: '2.4rem' }}
                placeholder="Search user by name, email, or college..."
                value={userSearch}
                onChange={e => setUserSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Users Table */}
          <div className="glass-card" style={{ overflowX: 'auto', padding: '0.5rem' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)', fontSize: '0.785rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '0.75rem 1rem' }}>User</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Role</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Department / Company</th>
                  <th style={{ padding: '0.75rem 1rem' }}>College / Org</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Status</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(u => (
                  <tr key={u.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <div style={{ fontWeight: 700 }}>{u.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{u.email}</div>
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span className="badge" style={{
                        background: u.role === 'admin' ? 'rgba(239, 68, 68, 0.15)' : u.role === 'recruiter' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(99, 102, 241, 0.15)',
                        color: u.role === 'admin' ? '#f87171' : u.role === 'recruiter' ? '#34d399' : '#818cf8',
                        textTransform: 'capitalize'
                      }}>
                        {u.role}
                      </span>
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      {u.role === 'student' ? (
                        <span className="badge" style={{ background: 'var(--bg-elevated)', color: 'var(--text-secondary)' }}>
                          {u.branch || 'N/A'}
                        </span>
                      ) : (
                        <span>{u.companyName || 'Campus Administration'}</span>
                      )}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                      {u.college || u.companyWebsite || '-'}
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span style={{
                        color: u.status === 'active' ? '#10b981' : '#ef4444',
                        fontWeight: 700,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: u.status === 'active' ? '#10b981' : '#ef4444' }} />
                        {u.status || 'active'}
                      </span>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                      {u.role !== 'admin' && (
                        <button
                          onClick={() => handleToggleUserStatus(u.id, u.status)}
                          className={u.status === 'active' ? 'btn btn-secondary' : 'btn btn-primary'}
                          style={{
                            padding: '0.35rem 0.75rem',
                            fontSize: '0.75rem',
                            color: u.status === 'active' ? '#ef4444' : '#10b981'
                          }}
                        >
                          {u.status === 'active' ? 'Suspend' : 'Activate'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: All Postings Management */}
      {activeTab === 'postings' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.35rem' }}>All Campus Postings Directory</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              Inspect and moderate all full-time jobs and internships uploaded across all recruiters.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1.25rem' }}>
            {jobs.map(j => (
              <div key={j.id} className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span className="badge" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8' }}>
                      Job • {j.employmentType}
                    </span>
                    <button
                      onClick={() => handleDeletePosting(j.id, 'job')}
                      style={{ color: '#ef4444', padding: '4px' }}
                      title="Remove Listing"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <h3 style={{ fontSize: '1.15rem' }}>{j.title}</h3>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    {j.company} • {j.location} ({j.workMode})
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Salary: <strong>{j.salary}</strong> • Deadline: {j.deadline}
                  </div>
                </div>

                <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem', marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                    {j.eligibleBranches.map(eb => (
                      <span key={eb} className="badge" style={{ fontSize: '0.65rem' }}>{eb}</span>
                    ))}
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {j.applicantsCount || 0} Applicants
                  </span>
                </div>
              </div>
            ))}

            {internships.map(i => (
              <div key={i.id} className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span className="badge" style={{ background: 'rgba(168, 85, 247, 0.15)', color: '#c084fc' }}>
                      Internship ({i.duration})
                    </span>
                    <button
                      onClick={() => handleDeletePosting(i.id, 'internship')}
                      style={{ color: '#ef4444', padding: '4px' }}
                      title="Remove Listing"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <h3 style={{ fontSize: '1.15rem' }}>{i.title}</h3>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    {i.company} • {i.location} ({i.workMode})
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Stipend: <strong>{i.stipendAmount}</strong> • Deadline: {i.deadline}
                  </div>
                </div>

                <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem', marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                    {i.eligibleBranches.map(eb => (
                      <span key={eb} className="badge" style={{ fontSize: '0.65rem' }}>{eb}</span>
                    ))}
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {i.applicantsCount || 0} Applicants
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
