import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { BRANCHES } from '../constants/branches';
import {
  X,
  User,
  Mail,
  Phone,
  Building,
  GraduationCap,
  FileText,
  Upload,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Plus
} from 'lucide-react';

export const ProfileModal = ({ onClose }) => {
  const { user, updateProfile } = useAuth();
  const { addToast } = useNotification();

  const [loading, setLoading] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);

  // Form fields
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [college, setCollege] = useState(user?.college || '');
  const [degree, setDegree] = useState(user?.degree || 'B.Tech');
  const [academicYear, setAcademicYear] = useState(user?.academicYear || '4th Year');
  const [branch, setBranch] = useState(user?.branch || 'CSE');
  const [skills, setSkills] = useState(user?.skills || []);
  const [newSkill, setNewSkill] = useState('');

  // Recruiter fields
  const [companyName, setCompanyName] = useState(user?.companyName || '');
  const [companyWebsite, setCompanyWebsite] = useState(user?.companyWebsite || '');

  // Resume state
  const [resumeUrl, setResumeUrl] = useState(user?.resumeUrl || '');
  const [resumeName, setResumeName] = useState(user?.resumeName || '');

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (!newSkill.trim()) return;
    if (!skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
    }
    setNewSkill('');
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('resume', file);

    try {
      setUploadingResume(true);
      const res = await fetch('/api/auth/upload-resume', {
        method: 'POST',
        headers: {
          'x-user-id': user.id
        },
        body: formData
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to upload resume');
      }

      const data = await res.json();
      setResumeUrl(data.resumeUrl);
      setResumeName(data.resumeName);
      addToast('success', 'Resume Uploaded!', `${data.resumeName} is now saved to your profile.`);
    } catch (err) {
      addToast('error', 'Upload Failed', err.message);
    } finally {
      setUploadingResume(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await updateProfile({
        name,
        phone,
        bio,
        college,
        degree,
        academicYear,
        branch,
        skills,
        companyName,
        companyWebsite
      });
      addToast('success', 'Profile Updated', 'Your profile details have been saved.');
      onClose();
    } catch (err) {
      addToast('error', 'Update Failed', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '650px', maxHeight: '90vh', overflowY: 'auto' }}>
        {/* Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'var(--bg-elevated)',
          position: 'sticky',
          top: 0,
          zIndex: 10
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 700
            }}>
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem' }}>Edit Profile</h2>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                {user?.email} • <span style={{ textTransform: 'capitalize', color: 'var(--primary)', fontWeight: 600 }}>{user?.role}</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} style={{ color: 'var(--text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Basic Info */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                Full Name
              </label>
              <input
                type="text"
                className="input-field"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                Contact Phone
              </label>
              <input
                type="text"
                className="input-field"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
              Bio / Professional Summary
            </label>
            <textarea
              className="input-field"
              rows={2}
              value={bio}
              onChange={e => setBio(e.target.value)}
              placeholder="Brief overview of your engineering passions, technical interests, or career goals..."
            />
          </div>

          {/* Student Specific Fields */}
          {user?.role === 'student' && (
            <>
              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem' }}>
                <h4 style={{ fontSize: '0.95rem', marginBottom: '0.85rem', color: '#818cf8', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <GraduationCap size={16} /> Academic Credentials
                </h4>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                      College / University Name
                    </label>
                    <input
                      type="text"
                      className="input-field"
                      value={college}
                      onChange={e => setCollege(e.target.value)}
                      placeholder="e.g. NIT Trichy, IIT Bombay"
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                      Engineering Department / Branch
                    </label>
                    <select
                      className="input-field"
                      value={branch}
                      onChange={e => setBranch(e.target.value)}
                    >
                      {BRANCHES.map(b => (
                        <option key={b.id} value={b.id}>{b.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                      Degree Program
                    </label>
                    <select
                      className="input-field"
                      value={degree}
                      onChange={e => setDegree(e.target.value)}
                    >
                      <option value="B.Tech">B.Tech (Bachelor of Technology)</option>
                      <option value="B.E.">B.E. (Bachelor of Engineering)</option>
                      <option value="M.Tech">M.Tech / M.S.</option>
                      <option value="Dual Degree">Dual Degree (B.Tech + M.Tech)</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                      Academic Year
                    </label>
                    <select
                      className="input-field"
                      value={academicYear}
                      onChange={e => setAcademicYear(e.target.value)}
                    >
                      <option value="1st Year">1st Year</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                      <option value="4th Year">4th Year</option>
                      <option value="Recent Graduate">Recent Graduate</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Technical Skills */}
              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                  Technical Skills & Competencies
                </label>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <input
                    type="text"
                    className="input-field"
                    value={newSkill}
                    onChange={e => setNewSkill(e.target.value)}
                    placeholder="Add skill (e.g. React, Python, SolidWorks, Verilog)"
                    onKeyDown={e => { if (e.key === 'Enter') { handleAddSkill(e); } }}
                  />
                  <button
                    type="button"
                    onClick={handleAddSkill}
                    className="btn btn-secondary"
                    style={{ flexShrink: 0 }}
                  >
                    <Plus size={16} /> Add
                  </button>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {skills.map(s => (
                    <span
                      key={s}
                      className="badge"
                      style={{
                        background: 'rgba(99, 102, 241, 0.15)',
                        color: '#c7d2fe',
                        border: '1px solid rgba(99, 102, 241, 0.3)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '4px 10px',
                        fontSize: '0.8rem'
                      }}
                    >
                      {s}
                      <X
                        size={12}
                        onClick={() => handleRemoveSkill(s)}
                        style={{ cursor: 'pointer', color: '#94a3b8' }}
                      />
                    </span>
                  ))}
                  {skills.length === 0 && (
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>No skills added yet.</span>
                  )}
                </div>
              </div>

              {/* Master Resume Upload */}
              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                  Master Resume File (PDF / DOC)
                </label>
                <div style={{
                  background: 'var(--bg-elevated)',
                  border: '1px dashed var(--border-subtle)',
                  borderRadius: '10px',
                  padding: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '0.75rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '8px',
                      background: resumeUrl ? 'rgba(16, 185, 129, 0.15)' : 'rgba(99, 102, 241, 0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: resumeUrl ? '#10b981' : '#6366f1'
                    }}>
                      <FileText size={20} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                        {resumeName || (resumeUrl ? 'Uploaded_Resume.pdf' : 'No master resume uploaded')}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {resumeUrl ? 'Ready for 1-click application submissions' : 'Upload your PDF resume to auto-attach to job applications'}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {resumeUrl && (
                      <a
                        href={resumeUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-secondary"
                        style={{ padding: '0.4rem 0.75rem', fontSize: '0.75rem' }}
                      >
                        <ExternalLink size={14} /> View
                      </a>
                    )}

                    <label className="btn btn-primary" style={{ padding: '0.4rem 0.85rem', fontSize: '0.75rem', cursor: 'pointer' }}>
                      <Upload size={14} /> {uploadingResume ? 'Uploading...' : (resumeUrl ? 'Replace' : 'Upload')}
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        style={{ display: 'none' }}
                        onChange={handleResumeUpload}
                        disabled={uploadingResume}
                      />
                    </label>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Recruiter Specific Fields */}
          {user?.role === 'recruiter' && (
            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem' }}>
              <h4 style={{ fontSize: '0.95rem', marginBottom: '0.85rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Building size={16} /> Company Details
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                    Company / Organization Name
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    value={companyName}
                    onChange={e => setCompanyName(e.target.value)}
                    placeholder="e.g. Google, NexaTech"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                    Company Career Website
                  </label>
                  <input
                    type="url"
                    className="input-field"
                    value={companyWebsite}
                    onChange={e => setCompanyWebsite(e.target.value)}
                    placeholder="https://company.com/careers"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Footer actions */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '0.75rem',
            marginTop: '0.5rem',
            borderTop: '1px solid var(--border-subtle)',
            paddingTop: '1rem'
          }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
