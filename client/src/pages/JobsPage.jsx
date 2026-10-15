import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { BRANCHES } from '../constants/branches';
import { JobCard } from '../components/JobCard';
import { Search, Filter, MapPin, Briefcase, RefreshCw, Sparkles, X } from 'lucide-react';

export const JobsPage = ({
  initialBranch = 'All',
  onApply,
  onViewDetails,
  savedIds,
  appliedIds,
  onToggleSave
}) => {
  const { user } = useAuth();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [branch, setBranch] = useState(initialBranch || (user?.branch || 'All'));
  const [workMode, setWorkMode] = useState('All');
  const [experienceLevel, setExperienceLevel] = useState('All');
  const [employmentType, setEmploymentType] = useState('All');
  const [location, setLocation] = useState('');

  // Synchronize when initialBranch changes from parent or navigation
  useEffect(() => {
    if (initialBranch) {
      setBranch(initialBranch);
    }
  }, [initialBranch]);

  const fetchJobs = async (overrides = {}) => {
    try {
      setLoading(true);
      const activeBranch = overrides.branch !== undefined ? overrides.branch : branch;
      const activeSearch = overrides.search !== undefined ? overrides.search : search;
      const activeWorkMode = overrides.workMode !== undefined ? overrides.workMode : workMode;
      const activeExp = overrides.experienceLevel !== undefined ? overrides.experienceLevel : experienceLevel;
      const activeEmp = overrides.employmentType !== undefined ? overrides.employmentType : employmentType;
      const activeLocation = overrides.location !== undefined ? overrides.location : location;

      const params = new URLSearchParams();
      if (activeBranch && activeBranch !== 'All') params.append('branch', activeBranch);
      if (activeSearch) params.append('search', activeSearch);
      if (activeWorkMode && activeWorkMode !== 'All') params.append('workMode', activeWorkMode);
      if (activeExp && activeExp !== 'All') params.append('experienceLevel', activeExp);
      if (activeEmp && activeEmp !== 'All') params.append('employmentType', activeEmp);
      if (activeLocation) params.append('location', activeLocation);

      const res = await fetch(`/api/jobs?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setJobs(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [branch, workMode, experienceLevel, employmentType]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  const clearFilters = () => {
    setSearch('');
    setBranch('All');
    setWorkMode('All');
    setExperienceLevel('All');
    setEmploymentType('All');
    setLocation('');
    fetchJobs({
      search: '',
      branch: 'All',
      workMode: 'All',
      experienceLevel: 'All',
      employmentType: 'All',
      location: ''
    });
  };

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '2rem 1.5rem', width: '100%' }}>
      {/* Title Header */}
      <div style={{ marginBottom: '1.75rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--primary)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase' }}>
          <Briefcase size={16} /> Verified Full-Time Opportunities
        </div>
        <h1 style={{ fontSize: '2.2rem', marginTop: '4px' }}>Find Engineering Jobs</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Discover full-time roles with branch eligibility filtering and 1-click in-platform application.
        </p>
      </div>

      {/* Main Search & Quick Filters Bar */}
      <form onSubmit={handleSearchSubmit} className="glass" style={{
        padding: '1.25rem',
        borderRadius: '16px',
        marginBottom: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        {/* Search Row */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <div style={{ flex: '2', minWidth: '260px', position: 'relative' }}>
            <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '2.5rem' }}
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by job title, skills (e.g. React, CAD, Python), or company..."
            />
          </div>

          <div style={{ flex: '1', minWidth: '200px', position: 'relative' }}>
            <MapPin size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '2.5rem' }}
              value={location}
              onChange={e => setLocation(e.target.value)}
              placeholder="Location (e.g. Bangalore, Pune)..."
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem' }}>
            <Search size={16} /> Search Jobs
          </button>
        </div>

        {/* Filter Dropdowns Row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', paddingTop: '0.5rem', borderTop: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            <Filter size={15} /> Filters:
          </div>

          {/* Work Mode */}
          <select
            className="form-input"
            style={{ width: 'auto', padding: '0.45rem 0.85rem', fontSize: '0.825rem' }}
            value={workMode}
            onChange={e => setWorkMode(e.target.value)}
          >
            <option value="All">All Work Modes</option>
            <option value="Remote">Remote</option>
            <option value="Hybrid">Hybrid</option>
            <option value="Onsite">Onsite</option>
          </select>

          {/* Experience Level */}
          <select
            className="form-input"
            style={{ width: 'auto', padding: '0.45rem 0.85rem', fontSize: '0.825rem' }}
            value={experienceLevel}
            onChange={e => setExperienceLevel(e.target.value)}
          >
            <option value="All">All Experience Levels</option>
            <option value="Fresher">Fresher (Campus)</option>
            <option value="0-1 Years">0-1 Years</option>
            <option value="1-3 Years">1-3 Years</option>
          </select>

          {/* Employment Type */}
          <select
            className="form-input"
            style={{ width: 'auto', padding: '0.45rem 0.85rem', fontSize: '0.825rem' }}
            value={employmentType}
            onChange={e => setEmploymentType(e.target.value)}
          >
            <option value="All">All Job Types</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
          </select>

          {(search || branch !== 'All' || workMode !== 'All' || experienceLevel !== 'All' || location) && (
            <button
              type="button"
              onClick={clearFilters}
              style={{
                fontSize: '0.8rem',
                color: '#ef4444',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                marginLeft: 'auto'
              }}
            >
              <X size={14} /> Clear all filters
            </button>
          )}
        </div>
      </form>

      {/* Academic Branch Selector Pills */}
      <div style={{ marginBottom: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
            FILTER BY ACADEMIC BRANCH:
          </div>
          {user?.role === 'student' && (
            <button
              onClick={() => setBranch(user.branch)}
              style={{
                fontSize: '0.785rem',
                color: 'var(--primary)',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <Sparkles size={14} /> Select My Branch ({user.branch})
            </button>
          )}
        </div>

        <div style={{
          display: 'flex',
          gap: '0.5rem',
          overflowX: 'auto',
          paddingBottom: '0.5rem',
          scrollbarWidth: 'none'
        }}>
          <button
            onClick={() => setBranch('All')}
            style={{
              padding: '0.45rem 1rem',
              borderRadius: '9999px',
              fontSize: '0.825rem',
              fontWeight: branch === 'All' ? 700 : 500,
              background: branch === 'All' ? 'var(--primary)' : 'var(--bg-elevated)',
              color: branch === 'All' ? 'white' : 'var(--text-secondary)',
              border: '1px solid var(--border-subtle)',
              whiteSpace: 'nowrap'
            }}
          >
            All Branches
          </button>

          {BRANCHES.map(b => {
            const isSelected = branch === b.id;
            const isUserBranch = user?.branch === b.id;
            return (
              <button
                key={b.id}
                onClick={() => setBranch(b.id)}
                style={{
                  padding: '0.45rem 1rem',
                  borderRadius: '9999px',
                  fontSize: '0.825rem',
                  fontWeight: isSelected ? 700 : 500,
                  background: isSelected ? b.color : 'var(--bg-elevated)',
                  color: isSelected ? 'white' : (isUserBranch ? '#818cf8' : 'var(--text-secondary)'),
                  border: isUserBranch && !isSelected ? '1px solid #6366f1' : '1px solid var(--border-subtle)',
                  whiteSpace: 'nowrap',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
              >
                <span>{b.short}</span>
                {isUserBranch && <span style={{ fontSize: '0.65rem' }}>★</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Count Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Showing <strong>{jobs.length}</strong> {jobs.length === 1 ? 'job opportunity' : 'job opportunities'}
          {branch !== 'All' && <span> eligible for <strong>{branch}</strong> students</span>}
        </div>
        <button onClick={fetchJobs} style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem' }}>
          <RefreshCw size={13} /> Refresh
        </button>
      </div>

      {/* Job Cards Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
          Loading eligible engineering jobs...
        </div>
      ) : jobs.length === 0 ? (
        <div className="glass" style={{ textAlign: 'center', padding: '3.5rem 1.5rem', borderRadius: '16px' }}>
          <Briefcase size={40} color="var(--text-muted)" style={{ margin: '0 auto 1rem' }} />
          <h3>No jobs found matching your criteria</h3>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', marginBottom: '1.25rem' }}>
            Try resetting branch or keyword filters to see more cross-departmental opportunities.
          </p>
          <button className="btn btn-primary btn-sm" onClick={clearFilters}>
            Reset Filters
          </button>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
          gap: '1.25rem'
        }}>
          {jobs.map(job => (
            <JobCard
              key={job.id}
              job={job}
              isSaved={Boolean(savedIds?.has(job.id))}
              hasApplied={Boolean(appliedIds?.has(job.id))}
              onApply={(item) => onApply(item, 'job')}
              onViewDetails={(item) => onViewDetails(item, 'job')}
              onToggleSave={onToggleSave}
            />
          ))}
        </div>
      )}
    </div>
  );
};
