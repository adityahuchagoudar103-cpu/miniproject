import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { X, Upload, FileText, CheckCircle, AlertCircle, Building, MapPin, DollarSign, Calendar } from 'lucide-react';

export const ApplyModal = ({ opportunity, type = 'job', onClose, onSuccess }) => {
  const { user } = useAuth();
  const { addToast, refreshNotifications } = useNotification();

  const [useProfileResume, setUseProfileResume] = useState(Boolean(user?.resumeUrl));
  const [resumeFile, setResumeFile] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [phone, setPhone] = useState(user?.phone || '');
  const [submitting, setSubmitting] = useState(false);
  const [submittedApp, setSubmittedApp] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  if (!user) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={e => e.stopPropagation()} style={{ padding: '2rem', textAlign: 'center' }}>
          <AlertCircle size={48} color="#f59e0b" style={{ margin: '0 auto 1rem' }} />
          <h3>Sign In Required</h3>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', marginBottom: '1.5rem' }}>
            Please log in with a student account to apply directly to this opportunity.
          </p>
          <button className="btn btn-primary" onClick={onClose}>Close</button>
        </div>
      </div>
    );
  }

  if (user.role !== 'student') {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={e => e.stopPropagation()} style={{ padding: '2rem', textAlign: 'center' }}>
          <AlertCircle size={48} color="#ef4444" style={{ margin: '0 auto 1rem' }} />
          <h3>Student Account Required</h3>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', marginBottom: '1.5rem' }}>
            You are logged in as a <strong>{user.role}</strong>. Applications can only be submitted by student accounts.
          </p>
          <button className="btn btn-secondary" onClick={onClose}>Close</button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!useProfileResume && !resumeFile) {
      setErrorMsg('Please select a resume file or use your profile resume.');
      return;
    }

    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append('opportunityId', opportunity.id);
      formData.append('opportunityType', type);
      formData.append('studentName', user.name);
      formData.append('studentEmail', user.email);
      formData.append('studentPhone', phone);
      formData.append('studentCollege', user.college || '');
      formData.append('studentDegree', user.degree || 'B.Tech');
      formData.append('studentAcademicYear', user.academicYear || '4th Year');
      formData.append('studentBranch', user.branch || 'Other');
      formData.append('studentSkills', (user.skills || []).join(', '));
      formData.append('coverLetter', coverLetter);

      if (!useProfileResume && resumeFile) {
        formData.append('resume', resumeFile);
      }

      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: {
          'x-user-id': user.id
        },
        body: formData
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit application');
      }

      setSubmittedApp(data.application);
      addToast('success', 'Application Submitted!', `Application ID: ${data.application.id}`);
      refreshNotifications();
      if (onSuccess) onSuccess(data.application);
    } catch (err) {
      setErrorMsg(err.message);
      addToast('error', 'Submission Failed', err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'var(--bg-elevated)'
        }}>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase' }}>
              Direct Application Portal
            </div>
            <h3 style={{ fontSize: '1.25rem' }}>{opportunity.title}</h3>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
              <span>{opportunity.company}</span>
              <span>•</span>
              <span>{opportunity.location}</span>
            </div>
          </div>
          <button onClick={onClose} style={{ color: 'var(--text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '1.5rem' }}>
          {submittedApp ? (
            /* Success confirmation view */
            <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'rgba(16, 185, 129, 0.15)',
                color: '#10b981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem'
              }}>
                <CheckCircle size={36} />
              </div>
              <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>Application Submitted Successfully!</h3>
              <p style={{ color: 'var(--text-secondary)', maxWidth: '420px', margin: '0 auto 1.5rem', fontSize: '0.9rem' }}>
                Your application has been received directly by the talent acquisition team at <strong>{opportunity.company}</strong>.
              </p>

              <div style={{
                background: 'var(--bg-elevated)',
                padding: '1rem',
                borderRadius: '12px',
                display: 'inline-block',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                marginBottom: '1.5rem',
                textAlign: 'left'
              }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>UNIQUE APPLICATION TRACKING ID</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary)', letterSpacing: '0.05em' }}>
                  {submittedApp.id}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  Status: <span className="badge status-applied">Applied</span>
                </div>
              </div>

              <div>
                <button className="btn btn-primary" onClick={onClose}>
                  Done & Return to Opportunities
                </button>
              </div>
            </div>
          ) : (
            /* Application Form */
            <form onSubmit={handleSubmit}>
              {errorMsg && (
                <div style={{
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  background: 'rgba(239, 68, 68, 0.12)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#ef4444',
                  fontSize: '0.85rem',
                  marginBottom: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <AlertCircle size={16} />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Verified Student Profile Summary */}
              <div style={{
                background: 'var(--bg-elevated)',
                padding: '1rem',
                borderRadius: '12px',
                border: '1px solid var(--border-subtle)',
                marginBottom: '1.25rem'
              }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                  Applicant Academic Profile (Auto-Populated)
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', fontSize: '0.85rem' }}>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Name: </span>
                    <strong>{user.name}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Email: </span>
                    <strong>{user.email}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Branch: </span>
                    <span className="badge badge-branch">{user.branch}</span>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>College: </span>
                    <span>{user.college || 'Engineering Institute'}</span>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Degree & Year: </span>
                    <span>{user.degree || 'B.Tech'}, {user.academicYear || '4th Year'}</span>
                  </div>
                </div>

                {user.skills && user.skills.length > 0 && (
                  <div style={{ marginTop: '0.75rem', display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                    {user.skills.map(s => (
                      <span key={s} className="badge badge-tag" style={{ fontSize: '0.7rem' }}>{s}</span>
                    ))}
                  </div>
                )}
              </div>

              {/* Contact Phone */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label className="form-label">Phone Number *</label>
                <input
                  type="text"
                  className="form-input"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  required
                />
              </div>

              {/* Resume Selection */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label className="form-label">Resume Document *</label>
                {user.resumeUrl ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.875rem' }}>
                      <input
                        type="radio"
                        checked={useProfileResume}
                        onChange={() => setUseProfileResume(true)}
                      />
                      <span>Use saved resume: <strong>{user.resumeName || 'Profile Resume'}</strong></span>
                    </label>

                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.875rem' }}>
                      <input
                        type="radio"
                        checked={!useProfileResume}
                        onChange={() => setUseProfileResume(false)}
                      />
                      <span>Upload a new resume file for this opportunity</span>
                    </label>
                  </div>
                ) : null}

                {(!useProfileResume || !user.resumeUrl) && (
                  <div style={{
                    border: '2px dashed var(--border-subtle)',
                    borderRadius: '12px',
                    padding: '1.25rem',
                    textAlign: 'center',
                    background: 'var(--bg-elevated)',
                    marginTop: '0.5rem'
                  }}>
                    <input
                      type="file"
                      id="resume-file"
                      accept=".pdf,.doc,.docx,.txt"
                      onChange={e => setResumeFile(e.target.files[0])}
                      style={{ display: 'none' }}
                    />
                    <label htmlFor="resume-file" style={{ cursor: 'pointer', display: 'block' }}>
                      <Upload size={28} color="var(--primary)" style={{ margin: '0 auto 6px' }} />
                      <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                        {resumeFile ? resumeFile.name : 'Click to select resume file (PDF, DOCX)'}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                        Maximum file size: 10MB
                      </div>
                    </label>
                  </div>
                )}
              </div>

              {/* Cover Letter */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label className="form-label">Cover Note / Why are you a good fit? (Optional)</label>
                <textarea
                  className="form-input"
                  rows={4}
                  value={coverLetter}
                  onChange={e => setCoverLetter(e.target.value)}
                  placeholder="Share a short note about your branch projects, skills, and excitement about this role..."
                />
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="button" className="btn btn-secondary" onClick={onClose} disabled={submitting}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Submitting Application...' : 'Submit Application Now'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
