import React from 'react';
import { X, MapPin, DollarSign, Calendar, Clock, CheckCircle2, Building, Sparkles } from 'lucide-react';

export const OpportunityDetailsModal = ({ opportunity, type = 'job', hasApplied, onClose, onApply }) => {
  if (!opportunity) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '750px' }}>
        {/* Header */}
        <div style={{
          padding: '1.5rem',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          background: 'var(--bg-elevated)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '14px',
              background: `linear-gradient(135deg, ${opportunity.logoColor || '#6366f1'} 0%, #4338ca 100%)`,
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '1.4rem'
            }}>
              {opportunity.logo || (type === 'job' ? 'JOB' : 'INT')}
            </div>
            <div>
              <span className="badge" style={{
                background: type === 'job' ? 'rgba(99, 102, 241, 0.15)' : 'rgba(139, 92, 246, 0.15)',
                color: type === 'job' ? '#818cf8' : '#c084fc',
                marginBottom: '4px'
              }}>
                {type === 'job' ? 'Full-Time Engineering Role' : `Internship (${opportunity.duration})`}
              </span>
              <h2 style={{ fontSize: '1.45rem', lineHeight: 1.2 }}>{opportunity.title}</h2>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontWeight: 600 }}>{opportunity.company}</span>
                <span>•</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <MapPin size={14} /> {opportunity.location} ({opportunity.workMode})
                </span>
              </div>
            </div>
          </div>
          <button onClick={onClose} style={{ color: 'var(--text-muted)' }}>
            <X size={22} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Key Metrics Banner */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1rem',
            padding: '1rem',
            background: 'var(--bg-elevated)',
            borderRadius: '12px',
            border: '1px solid var(--border-subtle)'
          }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                {type === 'job' ? 'Annual Compensation' : 'Monthly Stipend'}
              </div>
              <div style={{ fontWeight: 700, fontSize: '1.05rem', color: '#10b981', marginTop: '2px' }}>
                {type === 'job' ? opportunity.salary : opportunity.stipendAmount}
              </div>
            </div>

            {type === 'internship' && (
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Duration</div>
                <div style={{ fontWeight: 700, fontSize: '1.05rem', marginTop: '2px' }}>
                  {opportunity.duration}
                </div>
              </div>
            )}

            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Work Mode</div>
              <div style={{ fontWeight: 700, fontSize: '1.05rem', marginTop: '2px' }}>
                {opportunity.workMode}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Application Deadline</div>
              <div style={{ fontWeight: 700, fontSize: '1.05rem', color: '#f59e0b', marginTop: '2px' }}>
                {opportunity.deadline}
              </div>
            </div>
          </div>

          {/* Eligible Branches & Requirements */}
          <div>
            <h4 style={{ fontSize: '1.05rem', marginBottom: '0.65rem' }}>Eligible Academic Branches</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {opportunity.eligibleBranches.map(b => (
                <span key={b} className="badge badge-branch" style={{ fontSize: '0.85rem', padding: '0.35rem 0.85rem' }}>
                  🎓 {b}
                </span>
              ))}
            </div>
            {opportunity.qualifications && (
              <div style={{ marginTop: '0.65rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                <strong>Qualifications:</strong> {opportunity.qualifications}
              </div>
            )}
            {opportunity.eligibleYears && (
              <div style={{ marginTop: '0.4rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                <strong>Target Academic Years:</strong> {opportunity.eligibleYears.join(', ')}
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <h4 style={{ fontSize: '1.05rem', marginBottom: '0.5rem' }}>About this Opportunity</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem', whiteSpace: 'pre-line' }}>
              {opportunity.description}
            </p>
          </div>

          {/* Responsibilities */}
          {opportunity.responsibilities && opportunity.responsibilities.length > 0 && (
            <div>
              <h4 style={{ fontSize: '1.05rem', marginBottom: '0.5rem' }}>Key Responsibilities</h4>
              <ul style={{ paddingLeft: '1.25rem', color: 'var(--text-secondary)', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {opportunity.responsibilities.map((resp, i) => (
                  <li key={i}>{resp}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Required Skills */}
          <div>
            <h4 style={{ fontSize: '1.05rem', marginBottom: '0.65rem' }}>Required Technical & Core Skills</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {opportunity.requiredSkills.map(skill => (
                <span key={skill} className="badge badge-tag" style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: '0.75rem',
          background: 'var(--bg-elevated)'
        }}>
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
          {hasApplied ? (
            <button
              className="btn"
              style={{
                background: 'rgba(16, 185, 129, 0.15)',
                color: '#34d399',
                border: '1px solid rgba(16, 185, 129, 0.3)'
              }}
              disabled
            >
              <CheckCircle2 size={16} /> Application Already Submitted
            </button>
          ) : (
            <button
              className="btn btn-primary"
              onClick={() => {
                onClose();
                onApply(opportunity);
              }}
            >
              Apply Directly for this Role
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
