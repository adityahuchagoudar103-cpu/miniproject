import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { BRANCHES } from '../constants/branches';
import { JobCard } from '../components/JobCard';
import { InternshipCard } from '../components/InternshipCard';
import {
  Cpu,
  Globe,
  Brain,
  Database,
  Radio,
  Zap,
  Settings,
  Compass,
  FlaskConical,
  Dna,
  Layers,
  Sparkles,
  Briefcase,
  Search,
  Filter,
  CheckCircle,
  TrendingUp,
  Award
} from 'lucide-react';

const ICON_MAP = {
  Cpu: Cpu,
  Globe: Globe,
  Brain: Brain,
  Database: Database,
  Radio: Radio,
  Zap: Zap,
  Settings: Settings,
  Compass: Compass,
  FlaskConical: FlaskConical,
  Dna: Dna,
  Layers: Layers
};

export const BranchesPage = ({
  initialBranch,
  onApply,
  onViewDetails,
  savedIds,
  appliedIds,
  onToggleSave
}) => {
  const { user } = useAuth();
  const [selectedBranchId, setSelectedBranchId] = useState(initialBranch || user?.branch || 'CSE');
  const [activeTab, setActiveTab] = useState('jobs'); // 'jobs' | 'internships'
  const [search, setSearch] = useState('');

  const [jobs, setJobs] = useState([]);
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);

  const currentBranch = BRANCHES.find(b => b.id === selectedBranchId) || BRANCHES[0];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [jobsRes, internsRes] = await Promise.all([
          fetch(`/api/jobs?branch=${encodeURIComponent(selectedBranchId)}`).then(r => r.json()),
          fetch(`/api/internships?branch=${encodeURIComponent(selectedBranchId)}`).then(r => r.json())
        ]);
        setJobs(jobsRes || []);
        setInternships(internsRes || []);
      } catch (err) {
        console.error('Error fetching branch opportunities:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedBranchId]);

  const filteredJobs = jobs.filter(j =>
    j.title.toLowerCase().includes(search.toLowerCase()) ||
    j.company.toLowerCase().includes(search.toLowerCase()) ||
    (j.requiredSkills && j.requiredSkills.some(s => s.toLowerCase().includes(search.toLowerCase())))
  );

  const filteredInternships = internships.filter(i =>
    i.title.toLowerCase().includes(search.toLowerCase()) ||
    i.company.toLowerCase().includes(search.toLowerCase()) ||
    (i.requiredSkills && i.requiredSkills.some(s => s.toLowerCase().includes(search.toLowerCase())))
  );

  return (
    <div style={{ maxWidth: '1360px', margin: '0 auto', padding: '2.5rem 1.5rem 4rem', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(99, 102, 241, 0.12)',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          padding: '0.4rem 1rem',
          borderRadius: '9999px',
          color: '#818cf8',
          fontSize: '0.85rem',
          fontWeight: 700,
          marginBottom: '1rem'
        }}>
          <Sparkles size={16} />
          <span>Department-Specific Engineering Tracks</span>
        </div>
        <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', lineHeight: 1.2, marginBottom: '0.75rem' }}>
          Explore Career Opportunities by <span className="gradient-accent">Engineering Branch</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.6 }}>
          Filter through placement opportunities, core engineering roles, and industrial training curated specifically for your academic specialization.
        </p>
      </div>

      {/* Branch Selection Pills Carousel / Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '0.85rem'
      }}>
        {BRANCHES.map(b => {
          const Icon = ICON_MAP[b.icon] || Layers;
          const isSelected = b.id === selectedBranchId;
          const isUserBranch = user?.branch === b.id;

          return (
            <div
              key={b.id}
              onClick={() => setSelectedBranchId(b.id)}
              className="glass-card"
              style={{
                padding: '1rem',
                cursor: 'pointer',
                borderColor: isSelected ? b.color : (isUserBranch ? 'rgba(99, 102, 241, 0.4)' : 'var(--border-subtle)'),
                background: isSelected ? `linear-gradient(135deg, ${b.color}18 0%, rgba(18, 24, 38, 0.95) 100%)` : 'var(--bg-card)',
                boxShadow: isSelected ? `0 0 20px ${b.color}33` : 'none',
                position: 'relative',
                transition: 'all 0.25s ease'
              }}
            >
              {isUserBranch && (
                <span style={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  background: 'rgba(99, 102, 241, 0.25)',
                  color: '#818cf8',
                  padding: '2px 6px',
                  borderRadius: '4px'
                }}>
                  Your Branch
                </span>
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: `${b.color}25`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: b.color
                }}>
                  <Icon size={18} />
                </div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: isSelected ? 'white' : 'var(--text-primary)' }}>
                  {b.short}
                </div>
              </div>

              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.35, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {b.desc}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Branch Spotlight Banner */}
      <div className="glass-card" style={{
        padding: '1.75rem',
        borderRadius: '16px',
        borderLeft: `5px solid ${currentBranch.color}`,
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1.5rem',
        background: `linear-gradient(90deg, ${currentBranch.color}10 0%, var(--bg-card) 60%)`
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '14px',
            background: `${currentBranch.color}22`,
            color: currentBranch.color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {React.createElement(ICON_MAP[currentBranch.icon] || Layers, { size: 30 })}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ fontSize: '1.5rem' }}>{currentBranch.name}</h2>
              <span className="badge" style={{ background: `${currentBranch.color}25`, color: currentBranch.color, fontWeight: 700 }}>
                {currentBranch.id}
              </span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
              {currentBranch.desc}
            </p>
          </div>
        </div>

        {/* Quick Branch Stats */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: currentBranch.color }}>{jobs.length}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Active Jobs</div>
          </div>
          <div style={{ width: '1px', height: '36px', background: 'var(--border-subtle)' }} />
          <div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#a855f7' }}>{internships.length}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Internships</div>
          </div>
        </div>
      </div>

      {/* Tabs and Search Controls */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        {/* Type Tabs */}
        <div style={{
          display: 'flex',
          background: 'var(--bg-elevated)',
          padding: '4px',
          borderRadius: '10px',
          border: '1px solid var(--border-subtle)'
        }}>
          <button
            onClick={() => setActiveTab('jobs')}
            style={{
              padding: '0.55rem 1.25rem',
              borderRadius: '8px',
              fontSize: '0.875rem',
              fontWeight: 600,
              background: activeTab === 'jobs' ? 'var(--primary)' : 'transparent',
              color: activeTab === 'jobs' ? 'white' : 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Briefcase size={16} /> Full-Time Roles ({jobs.length})
          </button>
          <button
            onClick={() => setActiveTab('internships')}
            style={{
              padding: '0.55rem 1.25rem',
              borderRadius: '8px',
              fontSize: '0.875rem',
              fontWeight: 600,
              background: activeTab === 'internships' ? 'var(--primary)' : 'transparent',
              color: activeTab === 'internships' ? 'white' : 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Sparkles size={16} /> Internships ({internships.length})
          </button>
        </div>

        {/* Search */}
        <div style={{ position: 'relative', width: '320px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            className="input-field"
            style={{ paddingLeft: '2.4rem' }}
            placeholder={`Filter ${selectedBranchId} opportunities...`}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Content Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
          <div className="spinner" style={{ margin: '0 auto 1rem' }} />
          Loading opportunities for {currentBranch.name}...
        </div>
      ) : activeTab === 'jobs' ? (
        filteredJobs.length === 0 ? (
          <div className="glass-card" style={{ textAlign: 'center', padding: '3.5rem 1.5rem' }}>
            <Briefcase size={40} color="var(--text-muted)" style={{ margin: '0 auto 1rem' }} />
            <h3>No jobs found matching your criteria</h3>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
              Check back soon or explore other engineering departments above.
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1.5rem' }}>
            {filteredJobs.map(job => (
              <JobCard
                key={job.id}
                job={job}
                isSaved={savedIds.has(job.id)}
                hasApplied={appliedIds.has(job.id)}
                onApply={onApply}
                onViewDetails={onViewDetails}
                onToggleSave={onToggleSave}
              />
            ))}
          </div>
        )
      ) : (
        filteredInternships.length === 0 ? (
          <div className="glass-card" style={{ textAlign: 'center', padding: '3.5rem 1.5rem' }}>
            <Sparkles size={40} color="var(--text-muted)" style={{ margin: '0 auto 1rem' }} />
            <h3>No internships found matching your criteria</h3>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
              Check back soon or explore other engineering departments above.
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1.5rem' }}>
            {filteredInternships.map(intern => (
              <InternshipCard
                key={intern.id}
                internship={intern}
                isSaved={savedIds.has(intern.id)}
                hasApplied={appliedIds.has(intern.id)}
                onApply={onApply}
                onViewDetails={onViewDetails}
                onToggleSave={onToggleSave}
              />
            ))}
          </div>
        )
      )}
    </div>
  );
};
