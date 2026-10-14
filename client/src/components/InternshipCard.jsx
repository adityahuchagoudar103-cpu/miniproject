import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Sparkles, MapPin, Clock, DollarSign, Calendar, Bookmark, CheckCircle2 } from 'lucide-react';

export const InternshipCard = ({ internship, isSaved, hasApplied, onApply, onViewDetails, onToggleSave }) => {
  const { user } = useAuth();

  const isBranchMatch = user && user.role === 'student' && (
    internship.eligibleBranches.includes(user.branch) || internship.eligibleBranches.includes('All')
  );

  return (
    <div className="glass-card" style={{ padding: '1.4rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem', marginBottom: '0.9rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              background: `linear-gradient(135deg, ${internship.logoColor || '#8b5cf6'} 0%, #6d28d9 100%)`,
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '1.1rem',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
            }}>
              {internship.logo || 'INT'}
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', lineHeight: 1.25 }}>{internship.title}</h3>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                <span style={{ fontWeight: 600 }}>{internship.company}</span>
                <span>•</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                  <MapPin size={13} /> {internship.location}
                </span>
              </div>
            </div>
          </div>

          {/* Bookmark */}
          {user && (
            <button
              onClick={() => onToggleSave(internship.id, 'internship')}
              style={{
                background: isSaved ? 'rgba(99, 102, 241, 0.2)' : 'var(--bg-elevated)',
                border: '1px solid var(--border-subtle)',
                color: isSaved ? 'var(--primary)' : 'var(--text-muted)',
                width: '34px',
                height: '34px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s'
              }}
              title={isSaved ? 'Remove from Saved' : 'Save for Later'}
            >
              <Bookmark size={16} fill={isSaved ? 'currentColor' : 'none'} />
            </button>
          )}
        </div>

        {/* Branch Match Banner */}
        {isBranchMatch && (
          <div style={{
            background: 'linear-gradient(90deg, rgba(16, 185, 129, 0.12) 0%, rgba(6, 182, 212, 0.12) 100%)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '8px',
            padding: '0.35rem 0.65rem',
            fontSize: '0.785rem',
            fontWeight: 700,
            color: '#34d399',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            marginBottom: '0.85rem'
          }}>
            <Sparkles size={14} />
            Recommended for your branch ({user.branch})
          </div>
        )}

        {/* Description */}
        <p style={{
          fontSize: '0.865rem',
          color: 'var(--text-secondary)',
          marginBottom: '1rem',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {internship.description}
        </p>

        {/* Highlights row: Duration, Stipend, Eligible Years */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '0.85rem' }}>
          <span className="badge" style={{ background: 'rgba(99, 102, 241, 0.12)', color: '#818cf8', border: '1px solid rgba(99, 102, 241, 0.25)' }}>
            <Clock size={12} /> {internship.duration}
          </span>
          <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.12)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.25)' }}>
            {internship.stipendAmount}
          </span>
          <span className="badge" style={{ background: 'var(--bg-elevated)', color: 'var(--text-secondary)' }}>
            {internship.workMode}
          </span>
        </div>

        {/* Eligible Branches */}
        <div style={{ marginBottom: '0.75rem' }}>
          <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>
            Eligible Branches
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
            {internship.eligibleBranches.map(branch => {
              const isMatch = user?.branch === branch || branch === 'All';
              return (
                <span
                  key={branch}
                  className="badge"
                  style={{
                    background: isMatch ? 'rgba(139, 92, 246, 0.2)' : 'var(--bg-elevated)',
                    color: isMatch ? '#c084fc' : 'var(--text-secondary)',
                    border: isMatch ? '1px solid rgba(139, 92, 246, 0.4)' : '1px solid var(--border-subtle)',
                    fontSize: '0.725rem',
                    fontWeight: isMatch ? 700 : 500
                  }}
                >
                  {branch}
                </span>
              );
            })}
          </div>
        </div>

        {/* Skills */}
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
            {internship.requiredSkills.slice(0, 4).map(skill => (
              <span key={skill} className="badge badge-tag" style={{ fontSize: '0.7rem' }}>
                {skill}
              </span>
            ))}
            {internship.requiredSkills.length > 4 && (
              <span className="badge badge-tag" style={{ fontSize: '0.7rem' }}>
                +{internship.requiredSkills.length - 4} more
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ paddingTop: '0.9rem', borderTop: '1px solid var(--border-subtle)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.825rem', marginBottom: '0.85rem' }}>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.785rem' }}>
            Target: {internship.eligibleYears.join(', ')}
          </span>
          <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.785rem' }}>
            <Calendar size={13} /> Closes: {internship.deadline}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            className="btn btn-secondary btn-sm"
            style={{ flex: 1 }}
            onClick={() => onViewDetails(internship)}
          >
            Details
          </button>

          {hasApplied ? (
            <button
              className="btn btn-sm"
              style={{
                flex: 1.3,
                background: 'rgba(16, 185, 129, 0.15)',
                color: '#34d399',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                cursor: 'default'
              }}
              disabled
            >
              <CheckCircle2 size={14} /> Applied
            </button>
          ) : (
            <button
              className="btn btn-primary btn-sm"
              style={{ flex: 1.3, background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)' }}
              onClick={() => onApply(internship)}
            >
              Apply Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
