import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { BRANCHES } from '../constants/branches';
import { InternshipCard } from '../components/InternshipCard';
import { Search, Filter, Sparkles, Clock, RefreshCw, X } from 'lucide-react';

export const InternshipsPage = ({
  initialBranch = 'All',
  onApply,
  onViewDetails,
  savedIds,
  appliedIds,
  onToggleSave
}) => {
  const { user } = useAuth();

  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [branch, setBranch] = useState(initialBranch || (user?.branch || 'All'));
  const [duration, setDuration] = useState('All');
  const [stipendType, setStipendType] = useState('All');
  const [workMode, setWorkMode] = useState('All');
  const [academicYear, setAcademicYear] = useState('All');

  // Synchronize when initialBranch changes from parent or navigation
  useEffect(() => {
    if (initialBranch) {
      setBranch(initialBranch);
    }
  }, [initialBranch]);

  const fetchInternships = async (overrides = {}) => {
    try {
      setLoading(true);
      const activeBranch = overrides.branch !== undefined ? overrides.branch : branch;
      const activeSearch = overrides.search !== undefined ? overrides.search : search;
      const activeDuration = overrides.duration !== undefined ? overrides.duration : duration;
      const activeStipendType = overrides.stipendType !== undefined ? overrides.stipendType : stipendType;
      const activeWorkMode = overrides.workMode !== undefined ? overrides.workMode : workMode;
      const activeYear = overrides.academicYear !== undefined ? overrides.academicYear : academicYear;

      const params = new URLSearchParams();
      if (activeBranch && activeBranch !== 'All') params.append('branch', activeBranch);
      if (activeSearch) params.append('search', activeSearch);
      if (activeDuration && activeDuration !== 'All') params.append('duration', activeDuration);
      if (activeStipendType && activeStipendType !== 'All') params.append('stipendType', activeStipendType);
      if (activeWorkMode && activeWorkMode !== 'All') params.append('workMode', activeWorkMode);
      if (activeYear && activeYear !== 'All') params.append('academicYear', activeYear);

      const res = await fetch(`/api/internships?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setInternships(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInternships();
  }, [branch, duration, stipendType, workMode, academicYear]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchInternships();
  };

  const clearFilters = () => {
    setSearch('');
    setBranch('All');
    setDuration('All');
    setStipendType('All');
    setWorkMode('All');
    setAcademicYear('All');
    fetchInternships({
      search: '',
      branch: 'All',
      duration: 'All',
      stipendType: 'All',
      workMode: 'All',
      academicYear: 'All'
    });
  };

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '2rem 1.5rem', width: '100%' }}>
      {/* Title */}
      <div style={{ marginBottom: '1.75rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#8b5cf6', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase' }}>
          <Sparkles size={16} /> Fast-Track Hands-On Experience
        </div>
        <h1 style={{ fontSize: '2.2rem', marginTop: '4px' }}>Explore Engineering Internships</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Find high-stipend summer & semester internships aligned with your department and academic year.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <form onSubmit={handleSearchSubmit} className="glass" style={{
        padding: '1.25rem',
        borderRadius: '16px',
        marginBottom: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        {/* Search Input */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <div style={{ flex: '1', minWidth: '280px', position: 'relative' }}>
            <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '2.5rem' }}
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search internships by title, company, skills (e.g. Verilog, React, AutoCAD)..."
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem', background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)' }}>
            <Search size={16} /> Search Internships
          </button>
        </div>

        {/* Filter Dropdowns */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', paddingTop: '0.5rem', borderTop: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            <Filter size={15} /> Filters:
          </div>

          {/* Duration */}
          <select
            className="form-input"
            style={{ width: 'auto', padding: '0.45rem 0.85rem', fontSize: '0.825rem' }}
            value={duration}
            onChange={e => setDuration(e.target.value)}
          >
            <option value="All">All Durations</option>
            <option value="2 Months">2 Months</option>
            <option value="3 Months">3 Months</option>
            <option value="4 Months">4 Months</option>
            <option value="6 Months">6 Months</option>
          </select>

          {/* Stipend Type */}
          <select
            className="form-input"
            style={{ width: 'auto', padding: '0.45rem 0.85rem', fontSize: '0.825rem' }}
            value={stipendType}
            onChange={e => setStipendType(e.target.value)}
          >
            <option value="All">All Stipend Types</option>
            <option value="Paid">Paid Only</option>
            <option value="Unpaid">Unpaid</option>
          </select>

          {/* Academic Year */}
          <select
            className="form-input"
            style={{ width: 'auto', padding: '0.45rem 0.85rem', fontSize: '0.825rem' }}
            value={academicYear}
            onChange={e => setAcademicYear(e.target.value)}
          >
            <option value="All">All Target Years</option>
            <option value="2nd Year">2nd Year Eligible</option>
            <option value="3rd Year">3rd Year Eligible</option>
            <option value="4th Year">4th Year Eligible</option>
          </select>

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

          {(search || branch !== 'All' || duration !== 'All' || stipendType !== 'All' || workMode !== 'All' || academicYear !== 'All') && (
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
              <X size={14} /> Clear filters
            </button>
          )}
        </div>
      </form>

      {/* Branch Selector Pills */}
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
                color: '#a855f7',
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
              background: branch === 'All' ? '#8b5cf6' : 'var(--bg-elevated)',
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
                  color: isSelected ? 'white' : (isUserBranch ? '#a855f7' : 'var(--text-secondary)'),
                  border: isUserBranch && !isSelected ? '1px solid #8b5cf6' : '1px solid var(--border-subtle)',
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
          Showing <strong>{internships.length}</strong> {internships.length === 1 ? 'internship opportunity' : 'internship opportunities'}
          {branch !== 'All' && <span> eligible for <strong>{branch}</strong> students</span>}
        </div>
        <button onClick={fetchInternships} style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem' }}>
          <RefreshCw size={13} /> Refresh
        </button>
      </div>

      {/* Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
          Loading internships...
        </div>
      ) : internships.length === 0 ? (
        <div className="glass" style={{ textAlign: 'center', padding: '3.5rem 1.5rem', borderRadius: '16px' }}>
          <Sparkles size={40} color="var(--text-muted)" style={{ margin: '0 auto 1rem' }} />
          <h3>No internships found matching your criteria</h3>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', marginBottom: '1.25rem' }}>
            Try expanding duration or work mode filters.
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
          {internships.map(intern => (
            <InternshipCard
              key={intern.id}
              internship={intern}
              isSaved={Boolean(savedIds?.has(intern.id))}
              hasApplied={Boolean(appliedIds?.has(intern.id))}
              onApply={(item) => onApply(item, 'internship')}
              onViewDetails={(item) => onViewDetails(item, 'internship')}
              onToggleSave={onToggleSave}
            />
          ))}
        </div>
      )}
    </div>
  );
};
