import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { JobCard } from '../components/JobCard';
import { InternshipCard } from '../components/InternshipCard';
import { Bookmark, Briefcase, Sparkles, ArrowRight, Search } from 'lucide-react';

export const SavedOpportunitiesPage = ({
  setActivePage,
  onApply,
  onViewDetails,
  savedIds,
  appliedIds,
  onToggleSave
}) => {
  const { user } = useAuth();
  const [filterType, setFilterType] = useState('All'); // 'All' | 'job' | 'internship'
  const [savedOpportunities, setSavedOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSavedData = async () => {
      try {
        setLoading(true);
        const headers = user?.id ? { 'x-user-id': user.id } : {};
        const [savedRes, allJobs, allInterns] = await Promise.all([
          fetch('/api/saved', { headers }).then(r => r.ok ? r.json() : []),
          fetch('/api/jobs').then(r => r.json()),
          fetch('/api/internships').then(r => r.json())
        ]);

        const items = [];
        (savedRes || []).forEach(s => {
          if (s.opportunityType === 'job') {
            const found = (allJobs || []).find(j => j.id === s.opportunityId);
            if (found) items.push({ ...found, _type: 'job' });
          } else {
            const found = (allInterns || []).find(i => i.id === s.opportunityId);
            if (found) items.push({ ...found, _type: 'internship' });
          }
        });

        setSavedOpportunities(items);
      } catch (err) {
        console.error('Failed to load saved opportunities:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedData();
  }, [user, savedIds]);

  const filtered = savedOpportunities.filter(item => {
    if (filterType === 'All') return true;
    return item._type === filterType;
  });

  return (
    <div style={{ maxWidth: '1360px', margin: '0 auto', padding: '2.5rem 1.5rem 4rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(99, 102, 241, 0.12)', border: '1px solid rgba(99, 102, 241, 0.3)', padding: '0.4rem 1rem', borderRadius: '9999px', color: '#818cf8', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.75rem' }}>
            <Bookmark size={16} />
            <span>Saved Bookmarks</span>
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', lineHeight: 1.2 }}>
            Saved Opportunities ({savedOpportunities.length})
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginTop: '4px' }}>
            Review and submit applications for the engineering positions you bookmarked.
          </p>
        </div>

        {/* Filter controls */}
        <div style={{
          display: 'flex',
          background: 'var(--bg-elevated)',
          padding: '4px',
          borderRadius: '10px',
          border: '1px solid var(--border-subtle)'
        }}>
          <button
            onClick={() => setFilterType('All')}
            style={{
              padding: '0.45rem 1rem',
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontWeight: 600,
              background: filterType === 'All' ? 'var(--primary)' : 'transparent',
              color: filterType === 'All' ? 'white' : 'var(--text-secondary)'
            }}
          >
            All ({savedOpportunities.length})
          </button>
          <button
            onClick={() => setFilterType('job')}
            style={{
              padding: '0.45rem 1rem',
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontWeight: 600,
              background: filterType === 'job' ? 'var(--primary)' : 'transparent',
              color: filterType === 'job' ? 'white' : 'var(--text-secondary)'
            }}
          >
            Jobs ({savedOpportunities.filter(i => i._type === 'job').length})
          </button>
          <button
            onClick={() => setFilterType('internship')}
            style={{
              padding: '0.45rem 1rem',
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontWeight: 600,
              background: filterType === 'internship' ? 'var(--primary)' : 'transparent',
              color: filterType === 'internship' ? 'white' : 'var(--text-secondary)'
            }}
          >
            Internships ({savedOpportunities.filter(i => i._type === 'internship').length})
          </button>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
          <div className="spinner" style={{ margin: '0 auto 1rem' }} />
          Loading your bookmarks...
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '4rem 1.5rem' }}>
          <Bookmark size={48} color="var(--text-muted)" style={{ margin: '0 auto 1.25rem' }} />
          <h3>No saved opportunities yet</h3>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', marginBottom: '1.5rem', maxWidth: '480px', margin: '0.5rem auto 1.5rem' }}>
            Click the bookmark icon on any job or internship card to save it here for quick access later.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
            <button className="btn btn-primary" onClick={() => setActivePage('jobs')}>
              <Briefcase size={16} /> Explore Jobs
            </button>
            <button className="btn btn-secondary" onClick={() => setActivePage('internships')}>
              <Sparkles size={16} /> Explore Internships
            </button>
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1.5rem' }}>
          {filtered.map(item => {
            if (item._type === 'job') {
              return (
                <JobCard
                  key={item.id}
                  job={item}
                  isSaved={true}
                  hasApplied={appliedIds.has(item.id)}
                  onApply={onApply}
                  onViewDetails={onViewDetails}
                  onToggleSave={onToggleSave}
                />
              );
            }
            return (
              <InternshipCard
                key={item.id}
                internship={item}
                isSaved={true}
                hasApplied={appliedIds.has(item.id)}
                onApply={onApply}
                onViewDetails={onViewDetails}
                onToggleSave={onToggleSave}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};
