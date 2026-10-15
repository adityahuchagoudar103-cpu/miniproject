import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { BRANCHES } from '../constants/branches';
import { JobCard } from '../components/JobCard';
import { InternshipCard } from '../components/InternshipCard';
import {
  GraduationCap,
  Briefcase,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Search,
  Building,
  CheckCircle,
  Users,
  Target,
  FileCheck,
  ChevronRight
} from 'lucide-react';

export const HomePage = ({
  setActivePage,
  onApply,
  onViewDetails,
  savedIds,
  appliedIds,
  onToggleSave
}) => {
  const { user } = useAuth();
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [featuredInternships, setFeaturedInternships] = useState([]);
  const [selectedBranchTab, setSelectedBranchTab] = useState(user?.branch || 'All');

  useEffect(() => {
    // Fetch initial opportunities
    const fetchOpportunities = async () => {
      try {
        const [jobsRes, internsRes] = await fetchAll();
        if (jobsRes) setFeaturedJobs(jobsRes.slice(0, 4));
        if (internsRes) setFeaturedInternships(internsRes.slice(0, 4));
      } catch (err) {
        console.error(err);
      }
    };
    fetchOpportunities();
  }, []);

  const fetchAll = async () => {
    const [j, i] = await Promise.all([
      fetch('/api/jobs').then(r => r.json()),
      fetch('/api/internships').then(r => r.json())
    ]);
    return [j, i];
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3.5rem', paddingBottom: '4rem' }}>
      {/* Hero Section */}
      <section style={{
        position: 'relative',
        padding: '4.5rem 1.5rem 3.5rem',
        maxWidth: '1360px',
        margin: '0 auto',
        width: '100%',
        textAlign: 'center'
      }}>
        {/* Decorative backdrop glow */}
        <div style={{
          position: 'absolute',
          top: '20%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '600px',
          height: '240px',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.22) 0%, rgba(168, 85, 247, 0.12) 50%, transparent 80%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
          zIndex: -1
        }} />

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
          marginBottom: '1.25rem'
        }}>
          <Sparkles size={16} />
          <span>Next-Generation Branch-Smart Career & Placement Engine</span>
        </div>

        <h1 style={{
          fontSize: 'clamp(2.3rem, 5vw, 3.8rem)',
          lineHeight: 1.15,
          marginBottom: '1.25rem',
          maxWidth: '920px',
          margin: '0 auto 1.25rem'
        }}>
          Search, Filter, & Apply for Opportunities Tailored to Your{' '}
          <span className="gradient-accent">Academic Branch</span>
        </h1>

        <p style={{
          fontSize: '1.15rem',
          color: 'var(--text-secondary)',
          maxWidth: '720px',
          margin: '0 auto 2.25rem',
          lineHeight: 1.6
        }}>
          No more wading through generic listings. CareerNexus matches engineering students directly with verified jobs and internships based on departmental coursework, academic year, and core technical skills.
        </p>

        {/* Action CTAs */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setActivePage('jobs')}
            className="btn btn-primary btn-lg"
            style={{ gap: '8px' }}
          >
            <Briefcase size={20} />
            Explore Eligible Jobs
            <ArrowRight size={18} />
          </button>

          <button
            onClick={() => setActivePage('internships')}
            className="btn btn-secondary btn-lg"
            style={{ gap: '8px' }}
          >
            <Sparkles size={20} color="#a855f7" />
            Find Internships
          </button>

          <button
            onClick={() => setActivePage('branches')}
            className="btn btn-outline btn-lg"
            style={{ gap: '8px' }}
          >
            Browse by Department
          </button>
        </div>

        {/* Quick Stats Counter Row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.5rem',
          marginTop: '3.5rem',
          padding: '1.75rem',
          background: 'var(--bg-card)',
          borderRadius: '16px',
          border: '1px solid var(--border-subtle)'
        }}>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#6366f1' }}>11+</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Academic Engineering Branches</div>
          </div>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#10b981' }}>100%</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Direct In-Platform Applications</div>
          </div>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#f59e0b' }}>Live</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Real-Time Status Tracking</div>
          </div>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#ec4899' }}>₹35k/mo</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Top Internship Stipends</div>
          </div>
        </div>
      </section>

      {/* Explore by Academic Branch Section */}
      <section style={{ maxWidth: '1360px', margin: '0 auto', width: '100%', padding: '0 1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '1.75rem' }}>
          <div>
            <div style={{ color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Departmental Ecosystem
            </div>
            <h2 style={{ fontSize: '1.85rem' }}>Select Your Academic Branch</h2>
          </div>
          <button
            onClick={() => setActivePage('branches')}
            style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            View all branch guides <ChevronRight size={16} />
          </button>
        </div>

        {/* Branch Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: '1rem'
        }}>
          {BRANCHES.map(b => {
            const isUserBranch = user?.branch === b.id;
            return (
              <div
                key={b.id}
                onClick={() => {
                  setSelectedBranchTab(b.id);
                  setActivePage('jobs');
                }}
                className="glass-card"
                style={{
                  padding: '1.25rem',
                  cursor: 'pointer',
                  border: isUserBranch ? '2px solid #6366f1' : '1px solid var(--border-subtle)',
                  background: isUserBranch ? 'rgba(99, 102, 241, 0.08)' : 'var(--bg-card)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <span
                    className="badge"
                    style={{
                      background: `rgba(${b.color === '#6366f1' ? '99, 102, 241' : '139, 92, 246'}, 0.15)`,
                      color: b.color,
                      fontWeight: 800
                    }}
                  >
                    {b.short}
                  </span>
                  {isUserBranch && (
                    <span style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 700 }}>
                      ● YOUR BRANCH
                    </span>
                  )}
                </div>
                <h4 style={{ fontSize: '1rem', marginBottom: '0.35rem' }}>{b.name}</h4>
                <p style={{ fontSize: '0.785rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                  {b.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section style={{ maxWidth: '1360px', margin: '0 auto', width: '100%', padding: '0 1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '1.75rem' }}>
          <div>
            <div style={{ color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase' }}>
              Full-Time Openings
            </div>
            <h2 style={{ fontSize: '1.85rem' }}>Featured Engineering Jobs</h2>
          </div>
          <button
            onClick={() => setActivePage('jobs')}
            className="btn btn-outline btn-sm"
          >
            View All Jobs ({featuredJobs.length}+)
          </button>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '1.25rem'
        }}>
          {featuredJobs.map(job => (
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
      </section>

      {/* Featured Internships Section */}
      <section style={{ maxWidth: '1360px', margin: '0 auto', width: '100%', padding: '0 1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '1.75rem' }}>
          <div>
            <div style={{ color: '#8b5cf6', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase' }}>
              Fast-Track Learning
            </div>
            <h2 style={{ fontSize: '1.85rem' }}>High-Impact Internships</h2>
          </div>
          <button
            onClick={() => setActivePage('internships')}
            className="btn btn-outline btn-sm"
          >
            View All Internships
          </button>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '1.25rem'
        }}>
          {featuredInternships.map(intern => (
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
      </section>

      {/* How it Works Walkthrough */}
      <section style={{
        maxWidth: '1360px',
        margin: '0 auto',
        width: '100%',
        padding: '2.5rem 1.5rem',
        background: 'var(--bg-secondary)',
        borderRadius: '24px',
        border: '1px solid var(--border-subtle)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase' }}>
            Seamless Placement Journey
          </div>
          <h2 style={{ fontSize: '2rem' }}>How CareerNexus Empowers You</h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1.75rem'
        }}>
          <div style={{ padding: '1.25rem', background: 'var(--bg-card)', borderRadius: '14px', border: '1px solid var(--border-subtle)' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '10px',
              background: 'rgba(99, 102, 241, 0.15)',
              color: '#6366f1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '1.2rem',
              marginBottom: '1rem'
            }}>
              1
            </div>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Set Your Branch & Skills</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              Register your verified engineering department (CSE, ECE, Mechanical, Civil, etc.) and save your resume to unlock custom matching.
            </p>
          </div>

          <div style={{ padding: '1.25rem', background: 'var(--bg-card)', borderRadius: '14px', border: '1px solid var(--border-subtle)' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '10px',
              background: 'rgba(168, 85, 247, 0.15)',
              color: '#a855f7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '1.2rem',
              marginBottom: '1rem'
            }}>
              2
            </div>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Discover Branch Matches</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              Filter by compensation, duration, work mode, or academic year with automatic branch eligibility checking.
            </p>
          </div>

          <div style={{ padding: '1.25rem', background: 'var(--bg-card)', borderRadius: '14px', border: '1px solid var(--border-subtle)' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '10px',
              background: 'rgba(16, 185, 129, 0.15)',
              color: '#10b981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '1.2rem',
              marginBottom: '1rem'
            }}>
              3
            </div>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Direct In-Platform Apply</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              No third-party redirection. Submit your application instantly with your resume and obtain a unique tracking ID (e.g. APP-2026-XXXX).
            </p>
          </div>

          <div style={{ padding: '1.25rem', background: 'var(--bg-card)', borderRadius: '14px', border: '1px solid var(--border-subtle)' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '10px',
              background: 'rgba(245, 158, 11, 0.15)',
              color: '#f59e0b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '1.2rem',
              marginBottom: '1rem'
            }}>
              4
            </div>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Live Status Tracking</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              Track real-time progress through Under Review, Shortlisted, Interview Scheduled, and Offer states with in-app notifications.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
