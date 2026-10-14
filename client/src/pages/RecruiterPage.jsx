import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { BRANCHES, STATUS_COLORS } from '../constants/branches';
import {
  Building2,
  Users,
  Briefcase,
  Sparkles,
  PlusCircle,
  Calendar,
  Clock,
  Video,
  ExternalLink,
  FileText,
  CheckCircle,
  AlertCircle,
  Trash2,
  Search,
  Filter,
  Check,
  X,
  Mail,
  Phone,
  GraduationCap
} from 'lucide-react';

export const RecruiterPage = () => {
  const { user } = useAuth();
  const { addToast } = useNotification();

  const [activeTab, setActiveTab] = useState('pipeline'); // 'pipeline' | 'post-job' | 'post-internship' | 'my-postings'
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pipeline Filter States
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedOppFilter, setSelectedOppFilter] = useState('All');
  const [candidateSearch, setCandidateSearch] = useState('');

  // Status Update & Interview Modal/Form state
  const [selectedApp, setSelectedApp] = useState(null);
  const [newStatus, setNewStatus] = useState('Under Review');
  const [statusNote, setStatusNote] = useState('');
  const [interviewDate, setInterviewDate] = useState('');
  const [interviewTime, setInterviewTime] = useState('14:00 IST');
  const [interviewMode, setInterviewMode] = useState('Google Meet');
  const [interviewLink, setInterviewLink] = useState('https://meet.google.com/nex-hire-tech');
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Job Posting Form State
  const [jobTitle, setJobTitle] = useState('');
  const [jobCompany, setJobCompany] = useState(user?.companyName || '');
  const [jobDescription, setJobDescription] = useState('');
  const [jobResponsibilities, setJobResponsibilities] = useState('');
  const [jobSkills, setJobSkills] = useState('');
  const [jobBranches, setJobBranches] = useState(['CSE', 'IT']);
  const [jobQualifications, setJobQualifications] = useState('B.Tech / B.E. with minimum 65% aggregate');
  const [jobExpLevel, setJobExpLevel] = useState('Fresher');
  const [jobLocation, setJobLocation] = useState('Bangalore, Karnataka');
  const [jobWorkMode, setJobWorkMode] = useState('Hybrid');
  const [jobSalary, setJobSalary] = useState('₹10,00,000 - ₹14,00,000 / annum');
  const [jobEmploymentType, setJobEmploymentType] = useState('Full-time');
  const [jobDeadline, setJobDeadline] = useState('2026-12-31');
  const [submittingJob, setSubmittingJob] = useState(false);

  // Internship Posting Form State
  const [internTitle, setInternTitle] = useState('');
  const [internCompany, setInternCompany] = useState(user?.companyName || '');
  const [internDescription, setInternDescription] = useState('');
  const [internResponsibilities, setInternResponsibilities] = useState('');
  const [internSkills, setInternSkills] = useState('');
  const [internBranches, setInternBranches] = useState(['CSE', 'IT', 'AI/ML']);
  const [internYears, setInternYears] = useState(['3rd Year', '4th Year']);
  const [internDuration, setInternDuration] = useState('6 Months');
  const [internStipendType, setInternStipendType] = useState('Paid');
  const [internStipendAmount, setInternStipendAmount] = useState('₹30,000 / month');
  const [internWorkMode, setInternWorkMode] = useState('Remote');
  const [internLocation, setInternLocation] = useState('Remote (Pan India)');
  const [internDeadline, setInternDeadline] = useState('2026-12-31');
  const [submittingIntern, setSubmittingIntern] = useState(false);

  const fetchRecruiterData = async () => {
    try {
      setLoading(true);
      const headers = user?.id ? { 'x-user-id': user.id } : {};

      const [appsRes, jobsRes, internsRes] = await Promise.all([
        fetch('/api/applications/recruiter', { headers }).then(r => r.ok ? r.json() : []),
        fetch('/api/jobs').then(r => r.json()),
        fetch('/api/internships').then(r => r.json())
      ]);

      setApplications(appsRes || []);
      // Filter for this recruiter's postings or all if admin
      setJobs(jobsRes || []);
      setInternships(internsRes || []);
    } catch (err) {
      console.error('Failed to load recruiter data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecruiterData();
  }, [user]);

  const handleBranchToggle = (branchId, isIntern = false) => {
    if (isIntern) {
      setInternBranches(prev =>
        prev.includes(branchId) ? prev.filter(b => b !== branchId) : [...prev, branchId]
      );
    } else {
      setJobBranches(prev =>
        prev.includes(branchId) ? prev.filter(b => b !== branchId) : [...prev, branchId]
      );
    }
  };

  const handleYearToggle = (year) => {
    setInternYears(prev =>
      prev.includes(year) ? prev.filter(y => y !== year) : [...prev, year]
    );
  };

  const handleCreateJob = async (e) => {
    e.preventDefault();
    if (jobBranches.length === 0) {
      addToast('error', 'Selection Required', 'Please select at least one eligible engineering branch.');
      return;
    }

    try {
      setSubmittingJob(true);
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user.id
        },
        body: JSON.stringify({
          title: jobTitle,
          company: jobCompany || user.companyName,
          description: jobDescription,
          responsibilities: jobResponsibilities,
          requiredSkills: jobSkills,
          eligibleBranches: jobBranches,
          qualifications: jobQualifications,
          experienceLevel: jobExpLevel,
          location: jobLocation,
          workMode: jobWorkMode,
          salary: jobSalary,
          employmentType: jobEmploymentType,
          deadline: jobDeadline
        })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to create job');
      }

      addToast('success', 'Job Published!', `${jobTitle} is now live and broadcast to eligible students.`);
      setJobTitle('');
      setJobDescription('');
      setJobResponsibilities('');
      setJobSkills('');
      fetchRecruiterData();
      setActiveTab('my-postings');
    } catch (err) {
      addToast('error', 'Publication Failed', err.message);
    } finally {
      setSubmittingJob(false);
    }
  };

  const handleCreateInternship = async (e) => {
    e.preventDefault();
    if (internBranches.length === 0) {
      addToast('error', 'Selection Required', 'Please select at least one eligible engineering branch.');
      return;
    }

    try {
      setSubmittingIntern(true);
      const res = await fetch('/api/internships', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user.id
        },
        body: JSON.stringify({
          title: internTitle,
          company: internCompany || user.companyName,
          description: internDescription,
          responsibilities: internResponsibilities,
          requiredSkills: internSkills,
          eligibleBranches: internBranches,
          eligibleYears: internYears,
          duration: internDuration,
          stipendType: internStipendType,
          stipendAmount: internStipendAmount,
          workMode: internWorkMode,
          location: internLocation,
          deadline: internDeadline
        })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to create internship');
      }

      addToast('success', 'Internship Published!', `${internTitle} is now open for campus student applications.`);
      setInternTitle('');
      setInternDescription('');
      setInternResponsibilities('');
      setInternSkills('');
      fetchRecruiterData();
      setActiveTab('my-postings');
    } catch (err) {
      addToast('error', 'Publication Failed', err.message);
    } finally {
      setSubmittingIntern(false);
    }
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!selectedApp) return;

    try {
      setUpdatingStatus(true);
      const payload = {
        status: newStatus,
        note: statusNote
      };

      if (newStatus === 'Interview Scheduled') {
        payload.interviewDetails = {
          date: interviewDate || new Date().toISOString().split('T')[0],
          time: interviewTime,
          mode: interviewMode,
          link: interviewLink,
          note: statusNote || 'Technical interview & portfolio evaluation'
        };
      }

      const res = await fetch(`/api/applications/${selectedApp.id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user.id
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to update status');
      }

      addToast('success', 'Candidate Updated', `Application status updated to "${newStatus}" and candidate notified.`);
      setSelectedApp(null);
      fetchRecruiterData();
    } catch (err) {
      addToast('error', 'Update Failed', err.message);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleDeletePosting = async (id, type) => {
    if (!window.confirm(`Are you sure you want to delete this ${type}?`)) return;
    try {
      const endpoint = type === 'job' ? `/api/jobs/${id}` : `/api/internships/${id}`;
      const res = await fetch(endpoint, {
        method: 'DELETE',
        headers: { 'x-user-id': user.id }
      });
      if (!res.ok) throw new Error('Failed to delete');
      addToast('success', 'Posting Removed', `The ${type} has been deleted.`);
      fetchRecruiterData();
    } catch (err) {
      addToast('error', 'Error', err.message);
    }
  };

  // Filter applications
  const filteredApps = applications.filter(a => {
    const matchesStatus = selectedStatus === 'All' || a.status === selectedStatus;
    const matchesOpp = selectedOppFilter === 'All' || a.opportunityId === selectedOppFilter;
    const matchesSearch = candidateSearch === '' ||
      a.studentName.toLowerCase().includes(candidateSearch.toLowerCase()) ||
      a.studentEmail.toLowerCase().includes(candidateSearch.toLowerCase()) ||
      a.studentBranch.toLowerCase().includes(candidateSearch.toLowerCase()) ||
      a.opportunityTitle.toLowerCase().includes(candidateSearch.toLowerCase());

    return matchesStatus && matchesOpp && matchesSearch;
  });

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '2.5rem 1.5rem 4rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Recruiter Header */}
      <div className="glass-card" style={{
        padding: '2rem',
        borderRadius: '20px',
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(99, 102, 241, 0.08) 50%, var(--bg-card) 100%)',
        border: '1px solid rgba(16, 185, 129, 0.25)',
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
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 800,
            fontSize: '1.75rem',
            boxShadow: '0 8px 20px rgba(16, 185, 129, 0.35)'
          }}>
            <Building2 size={32} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: '1.85rem' }}>{user?.companyName || 'Recruiter Portal'}</h1>
              <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', fontWeight: 700 }}>
                Hiring Partner
              </span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem', marginTop: '4px' }}>
              Logged in as <strong style={{ color: 'var(--text-primary)' }}>{user?.name}</strong> • {user?.email}
            </p>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            onClick={() => setActiveTab('post-job')}
            className="btn btn-primary"
            style={{ padding: '0.65rem 1.25rem', fontSize: '0.875rem' }}
          >
            <PlusCircle size={16} /> Post Job
          </button>
          <button
            onClick={() => setActiveTab('post-internship')}
            className="btn btn-secondary"
            style={{ padding: '0.65rem 1.25rem', fontSize: '0.875rem' }}
          >
            <Sparkles size={16} /> Post Internship
          </button>
        </div>
      </div>

      {/* Recruiter Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1.25rem'
      }}>
        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Total Applications</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, marginTop: '4px' }}>{applications.length}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Candidates across roles</div>
        </div>
        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Shortlisted</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, marginTop: '4px', color: '#c084fc' }}>
            {applications.filter(a => a.status === 'Shortlisted').length}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Passed preliminary review</div>
        </div>
        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Interviews Set</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, marginTop: '4px', color: '#f472b6' }}>
            {applications.filter(a => a.status === 'Interview Scheduled').length}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Active interview invites</div>
        </div>
        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Selected / Offers</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, marginTop: '4px', color: '#34d399' }}>
            {applications.filter(a => a.status === 'Selected').length}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Job & internship offers</div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div style={{
        display: 'flex',
        background: 'var(--bg-elevated)',
        padding: '4px',
        borderRadius: '12px',
        border: '1px solid var(--border-subtle)',
        width: 'fit-content'
      }}>
        <button
          onClick={() => setActiveTab('pipeline')}
          style={{
            padding: '0.6rem 1.25rem',
            borderRadius: '8px',
            fontSize: '0.875rem',
            fontWeight: 600,
            background: activeTab === 'pipeline' ? 'var(--primary)' : 'transparent',
            color: activeTab === 'pipeline' ? 'white' : 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Users size={16} /> Candidate Pipeline ({applications.length})
        </button>
        <button
          onClick={() => setActiveTab('post-job')}
          style={{
            padding: '0.6rem 1.25rem',
            borderRadius: '8px',
            fontSize: '0.875rem',
            fontWeight: 600,
            background: activeTab === 'post-job' ? 'var(--primary)' : 'transparent',
            color: activeTab === 'post-job' ? 'white' : 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <PlusCircle size={16} /> Post New Job
        </button>
        <button
          onClick={() => setActiveTab('post-internship')}
          style={{
            padding: '0.6rem 1.25rem',
            borderRadius: '8px',
            fontSize: '0.875rem',
            fontWeight: 600,
            background: activeTab === 'post-internship' ? 'var(--primary)' : 'transparent',
            color: activeTab === 'post-internship' ? 'white' : 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Sparkles size={16} /> Post Internship
        </button>
        <button
          onClick={() => setActiveTab('my-postings')}
          style={{
            padding: '0.6rem 1.25rem',
            borderRadius: '8px',
            fontSize: '0.875rem',
            fontWeight: 600,
            background: activeTab === 'my-postings' ? 'var(--primary)' : 'transparent',
            color: activeTab === 'my-postings' ? 'white' : 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Briefcase size={16} /> Manage Postings ({jobs.length + internships.length})
        </button>
      </div>

      {/* Tab 1: Candidate Pipeline */}
      {activeTab === 'pipeline' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Filters Bar */}
          <div className="glass-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              {['All', 'Applied', 'Under Review', 'Shortlisted', 'Interview Scheduled', 'Selected', 'Rejected'].map(s => (
                <button
                  key={s}
                  onClick={() => setSelectedStatus(s)}
                  style={{
                    padding: '0.35rem 0.85rem',
                    borderRadius: '9999px',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    background: selectedStatus === s ? 'var(--primary)' : 'var(--bg-elevated)',
                    color: selectedStatus === s ? 'white' : 'var(--text-secondary)',
                    border: selectedStatus === s ? '1px solid var(--primary)' : '1px solid var(--border-subtle)'
                  }}
                >
                  {s}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  className="input-field"
                  style={{ paddingLeft: '2.4rem' }}
                  placeholder="Search candidate by name, email, department, or skills..."
                  value={candidateSearch}
                  onChange={e => setCandidateSearch(e.target.value)}
                />
              </div>

              <select
                className="input-field"
                style={{ width: 'auto' }}
                value={selectedOppFilter}
                onChange={e => setSelectedOppFilter(e.target.value)}
              >
                <option value="All">All Opportunities</option>
                {jobs.map(j => <option key={j.id} value={j.id}>{j.title} (Job)</option>)}
                {internships.map(i => <option key={i.id} value={i.id}>{i.title} (Internship)</option>)}
              </select>
            </div>
          </div>

          {/* Candidates List */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
              <div className="spinner" style={{ margin: '0 auto 1rem' }} />
              Loading candidate applications...
            </div>
          ) : filteredApps.length === 0 ? (
            <div className="glass-card" style={{ textAlign: 'center', padding: '3.5rem 1.5rem' }}>
              <Users size={48} color="var(--text-muted)" style={{ margin: '0 auto 1rem' }} />
              <h3>No candidates found</h3>
              <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                No applications match your current status or search filters.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {filteredApps.map(app => {
                const statusCfg = STATUS_COLORS[app.status] || { bg: 'rgba(255,255,255,0.1)', text: 'white', border: 'transparent' };

                return (
                  <div
                    key={app.id}
                    className="glass-card"
                    style={{
                      padding: '1.5rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '1rem',
                      borderLeft: `5px solid ${statusCfg.text}`
                    }}
                  >
                    {/* Header */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: '12px',
                          background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          fontSize: '1.2rem'
                        }}>
                          {app.studentName.charAt(0)}
                        </div>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <h3 style={{ fontSize: '1.2rem' }}>{app.studentName}</h3>
                            <span className="badge" style={{ background: 'rgba(99, 102, 241, 0.2)', color: '#818cf8', fontWeight: 700 }}>
                              {app.studentBranch}
                            </span>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                              ID: <code>{app.id}</code>
                            </span>
                          </div>
                          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                            <span>{app.studentCollege} ({app.studentDegree} - {app.studentAcademicYear})</span>
                            <span>•</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <Mail size={13} /> {app.studentEmail}
                            </span>
                            {app.studentPhone && (
                              <>
                                <span>•</span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                  <Phone size={13} /> {app.studentPhone}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Status and Action Button */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span style={{
                          background: statusCfg.bg,
                          color: statusCfg.text,
                          border: `1px solid ${statusCfg.border}`,
                          padding: '4px 12px',
                          borderRadius: '9999px',
                          fontSize: '0.85rem',
                          fontWeight: 700
                        }}>
                          {app.status}
                        </span>

                        <button
                          onClick={() => {
                            setSelectedApp(app);
                            setNewStatus(app.status);
                            setStatusNote('');
                            if (app.interviewDetails) {
                              setInterviewDate(app.interviewDetails.date || '');
                              setInterviewTime(app.interviewDetails.time || '14:00 IST');
                              setInterviewMode(app.interviewDetails.mode || 'Google Meet');
                              setInterviewLink(app.interviewDetails.link || '');
                            }
                          }}
                          className="btn btn-primary"
                          style={{ padding: '0.45rem 0.95rem', fontSize: '0.825rem' }}
                        >
                          Update Status / Interview
                        </button>
                      </div>
                    </div>

                    {/* Applied For & Skills */}
                    <div style={{
                      background: 'var(--bg-elevated)',
                      borderRadius: '10px',
                      padding: '0.85rem 1rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '0.75rem'
                    }}>
                      <div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Applied Role</span>
                        <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{app.opportunityTitle} ({app.company})</div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                        {app.studentSkills && app.studentSkills.map(sk => (
                          <span key={sk} className="badge" style={{ background: 'rgba(255, 255, 255, 0.05)', color: 'var(--text-secondary)', fontSize: '0.75rem' }}>
                            {sk}
                          </span>
                        ))}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        {app.resumeUrl && (
                          <a
                            href={app.resumeUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="btn btn-secondary"
                            style={{ padding: '0.35rem 0.75rem', fontSize: '0.775rem' }}
                          >
                            <FileText size={14} /> View Resume ({app.resumeOriginalName || 'Resume.pdf'})
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Cover note & Interview indicator */}
                    {app.coverLetter && (
                      <div style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', fontStyle: 'italic', background: 'rgba(0,0,0,0.15)', padding: '0.5rem 0.75rem', borderRadius: '6px' }}>
                        "{app.coverLetter}"
                      </div>
                    )}

                    {app.status === 'Interview Scheduled' && app.interviewDetails && (
                      <div style={{
                        background: 'rgba(236, 72, 153, 0.1)',
                        border: '1px solid rgba(236, 72, 153, 0.3)',
                        borderRadius: '8px',
                        padding: '0.65rem 0.85rem',
                        fontSize: '0.825rem',
                        color: '#f472b6',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '0.5rem'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Video size={16} />
                          <span>Interview on <strong>{app.interviewDetails.date}</strong> at <strong>{app.interviewDetails.time}</strong> via <strong>{app.interviewDetails.mode}</strong></span>
                        </div>
                        {app.interviewDetails.link && (
                          <a href={app.interviewDetails.link} target="_blank" rel="noreferrer" style={{ color: 'white', textDecoration: 'underline' }}>
                            Open Call Link
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Post Job Form */}
      {activeTab === 'post-job' && (
        <form onSubmit={handleCreateJob} className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '850px' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem' }}>Post New Engineering Job</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Create a full-time vacancy with branch eligibility and automatic student notifications.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                Job Title *
              </label>
              <input
                type="text"
                className="input-field"
                value={jobTitle}
                onChange={e => setJobTitle(e.target.value)}
                placeholder="e.g. Associate Backend Systems Engineer"
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                Hiring Company Name *
              </label>
              <input
                type="text"
                className="input-field"
                value={jobCompany}
                onChange={e => setJobCompany(e.target.value)}
                placeholder="e.g. NexaTech Innovations"
                required
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
              Eligible Engineering Departments / Branches *
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {BRANCHES.map(b => {
                const isSelected = jobBranches.includes(b.id);
                return (
                  <button
                    type="button"
                    key={b.id}
                    onClick={() => handleBranchToggle(b.id, false)}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '8px',
                      fontSize: '0.785rem',
                      fontWeight: 600,
                      background: isSelected ? b.color : 'var(--bg-elevated)',
                      color: isSelected ? 'white' : 'var(--text-secondary)',
                      border: isSelected ? `1px solid ${b.color}` : '1px solid var(--border-subtle)'
                    }}
                  >
                    {isSelected && <Check size={12} style={{ display: 'inline', marginRight: '4px' }} />}
                    {b.short}
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                Location
              </label>
              <input
                type="text"
                className="input-field"
                value={jobLocation}
                onChange={e => setJobLocation(e.target.value)}
                placeholder="Bangalore, Karnataka"
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                Work Mode
              </label>
              <select className="input-field" value={jobWorkMode} onChange={e => setJobWorkMode(e.target.value)}>
                <option value="Onsite">Onsite</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Remote">Remote</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                CTC / Salary Range
              </label>
              <input
                type="text"
                className="input-field"
                value={jobSalary}
                onChange={e => setJobSalary(e.target.value)}
                placeholder="₹12,00,000 - ₹16,00,000 / annum"
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                Application Deadline
              </label>
              <input
                type="date"
                className="input-field"
                value={jobDeadline}
                onChange={e => setJobDeadline(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
              Required Technical Skills (comma separated)
            </label>
            <input
              type="text"
              className="input-field"
              value={jobSkills}
              onChange={e => setJobSkills(e.target.value)}
              placeholder="e.g. React, Node.js, PostgreSQL, Docker, Git"
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
              Role Overview & Summary *
            </label>
            <textarea
              className="input-field"
              rows={3}
              value={jobDescription}
              onChange={e => setJobDescription(e.target.value)}
              placeholder="Describe the mission, key projects, and team culture..."
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
              Key Responsibilities (one per line)
            </label>
            <textarea
              className="input-field"
              rows={3}
              value={jobResponsibilities}
              onChange={e => setJobResponsibilities(e.target.value)}
              placeholder="Build modular microservices&#10;Write unit & integration tests&#10;Collaborate with product designers"
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setActiveTab('pipeline')}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submittingJob}>
              {submittingJob ? 'Publishing...' : 'Publish Job & Notify Students'}
            </button>
          </div>
        </form>
      )}

      {/* Tab 3: Post Internship Form */}
      {activeTab === 'post-internship' && (
        <form onSubmit={handleCreateInternship} className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '850px' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem' }}>Post New Industrial Internship</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Reach eager 2nd, 3rd, and 4th-year engineering students for high-impact internship terms.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                Internship Title *
              </label>
              <input
                type="text"
                className="input-field"
                value={internTitle}
                onChange={e => setInternTitle(e.target.value)}
                placeholder="e.g. Embedded Firmware & IoT Intern"
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                Hiring Company Name *
              </label>
              <input
                type="text"
                className="input-field"
                value={internCompany}
                onChange={e => setInternCompany(e.target.value)}
                placeholder="e.g. SiliconSense Technologies"
                required
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
              Eligible Engineering Departments / Branches *
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {BRANCHES.map(b => {
                const isSelected = internBranches.includes(b.id);
                return (
                  <button
                    type="button"
                    key={b.id}
                    onClick={() => handleBranchToggle(b.id, true)}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '8px',
                      fontSize: '0.785rem',
                      fontWeight: 600,
                      background: isSelected ? b.color : 'var(--bg-elevated)',
                      color: isSelected ? 'white' : 'var(--text-secondary)',
                      border: isSelected ? `1px solid ${b.color}` : '1px solid var(--border-subtle)'
                    }}
                  >
                    {isSelected && <Check size={12} style={{ display: 'inline', marginRight: '4px' }} />}
                    {b.short}
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                Duration
              </label>
              <select className="input-field" value={internDuration} onChange={e => setInternDuration(e.target.value)}>
                <option value="2 Months">2 Months (Summer)</option>
                <option value="3 Months">3 Months</option>
                <option value="6 Months">6 Months (Semester)</option>
                <option value="12 Months">1 Year</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                Stipend Type
              </label>
              <select className="input-field" value={internStipendType} onChange={e => setInternStipendType(e.target.value)}>
                <option value="Paid">Paid</option>
                <option value="Unpaid">Unpaid</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                Stipend Amount
              </label>
              <input
                type="text"
                className="input-field"
                value={internStipendAmount}
                onChange={e => setInternStipendAmount(e.target.value)}
                placeholder="₹25,000 / month"
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                Work Mode
              </label>
              <select className="input-field" value={internWorkMode} onChange={e => setInternWorkMode(e.target.value)}>
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Onsite">Onsite</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
              Required Skills
            </label>
            <input
              type="text"
              className="input-field"
              value={internSkills}
              onChange={e => setInternSkills(e.target.value)}
              placeholder="e.g. Embedded C, ARM Cortex, MATLAB, RTOS"
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
              Internship Description *
            </label>
            <textarea
              className="input-field"
              rows={3}
              value={internDescription}
              onChange={e => setInternDescription(e.target.value)}
              placeholder="What will the intern learn and build during this internship?"
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setActiveTab('pipeline')}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submittingIntern}>
              {submittingIntern ? 'Publishing...' : 'Publish Internship'}
            </button>
          </div>
        </form>
      )}

      {/* Tab 4: Manage My Postings */}
      {activeTab === 'my-postings' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.35rem' }}>Active Job & Internship Postings</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              Review applicant counts and manage your company listings.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1.25rem' }}>
            {jobs.map(j => (
              <div key={j.id} className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span className="badge" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8' }}>
                      Full-Time Job
                    </span>
                    <button
                      onClick={() => handleDeletePosting(j.id, 'job')}
                      style={{ color: '#ef4444', padding: '4px' }}
                      title="Delete Posting"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <h3 style={{ fontSize: '1.15rem' }}>{j.title}</h3>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    {j.company} • {j.location} ({j.workMode})
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '6px' }}>
                    Salary: <strong>{j.salary}</strong>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem', marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.85rem', color: '#10b981', fontWeight: 700 }}>
                    {applications.filter(a => a.opportunityId === j.id).length} Applicants
                  </span>
                  <button
                    onClick={() => {
                      setSelectedOppFilter(j.id);
                      setActiveTab('pipeline');
                    }}
                    className="btn btn-secondary"
                    style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                  >
                    View Candidates
                  </button>
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
                      title="Delete Posting"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <h3 style={{ fontSize: '1.15rem' }}>{i.title}</h3>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    {i.company} • {i.location} ({i.workMode})
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '6px' }}>
                    Stipend: <strong>{i.stipendAmount}</strong>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem', marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.85rem', color: '#10b981', fontWeight: 700 }}>
                    {applications.filter(a => a.opportunityId === i.id).length} Applicants
                  </span>
                  <button
                    onClick={() => {
                      setSelectedOppFilter(i.id);
                      setActiveTab('pipeline');
                    }}
                    className="btn btn-secondary"
                    style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                  >
                    View Candidates
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Candidate Status & Interview Scheduling Modal */}
      {selectedApp && (
        <div className="modal-overlay" onClick={() => setSelectedApp(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            <div style={{
              padding: '1.25rem 1.5rem',
              borderBottom: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'var(--bg-elevated)'
            }}>
              <div>
                <h3 style={{ fontSize: '1.2rem' }}>Update Application Status</h3>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  {selectedApp.studentName} ({selectedApp.studentBranch}) • {selectedApp.opportunityTitle}
                </div>
              </div>
              <button onClick={() => setSelectedApp(null)} style={{ color: 'var(--text-muted)' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUpdateStatus} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                  New Application Status
                </label>
                <select
                  className="input-field"
                  value={newStatus}
                  onChange={e => setNewStatus(e.target.value)}
                >
                  <option value="Applied">Applied</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Shortlisted">Shortlisted</option>
                  <option value="Interview Scheduled">Interview Scheduled</option>
                  <option value="Selected">Selected (Offer Extended)</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                  Feedback Note for Candidate
                </label>
                <textarea
                  className="input-field"
                  rows={2}
                  value={statusNote}
                  onChange={e => setStatusNote(e.target.value)}
                  placeholder="e.g. Passed initial screening. Please prepare for live React and system design discussion."
                />
              </div>

              {/* Interview Form (shown if Interview Scheduled is selected) */}
              {newStatus === 'Interview Scheduled' && (
                <div style={{
                  background: 'rgba(236, 72, 153, 0.08)',
                  border: '1px solid rgba(236, 72, 153, 0.3)',
                  borderRadius: '12px',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f472b6', fontWeight: 700, fontSize: '0.9rem' }}>
                    <Video size={18} /> Interview Logistics
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                        Interview Date
                      </label>
                      <input
                        type="date"
                        className="input-field"
                        value={interviewDate}
                        onChange={e => setInterviewDate(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                        Time & Timezone
                      </label>
                      <input
                        type="text"
                        className="input-field"
                        value={interviewTime}
                        onChange={e => setInterviewTime(e.target.value)}
                        placeholder="15:00 IST"
                        required
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                        Platform / Mode
                      </label>
                      <select
                        className="input-field"
                        value={interviewMode}
                        onChange={e => setInterviewMode(e.target.value)}
                      >
                        <option value="Google Meet">Google Meet</option>
                        <option value="Zoom">Zoom</option>
                        <option value="Microsoft Teams">Microsoft Teams</option>
                        <option value="On-Campus / In-Person">On-Campus / In-Person</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                        Meeting URL
                      </label>
                      <input
                        type="url"
                        className="input-field"
                        value={interviewLink}
                        onChange={e => setInterviewLink(e.target.value)}
                        placeholder="https://meet.google.com/..."
                      />
                    </div>
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setSelectedApp(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={updatingStatus}>
                  {updatingStatus ? 'Updating...' : 'Save & Notify Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
