import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { BRANCHES } from '../constants/branches';
import { X, User, Lock, Mail, Building, Phone, GraduationCap, AlertCircle, Sparkles } from 'lucide-react';

export const AuthModal = ({ initialMode = 'login', onClose, onSuccess }) => {
  const { login, register, switchDemoAccount } = useAuth();
  const { addToast } = useNotification();

  const [mode, setMode] = useState(initialMode); // 'login' | 'register'
  const [role, setRole] = useState('student'); // 'student' | 'recruiter' | 'admin'
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [college, setCollege] = useState('');
  const [degree, setDegree] = useState('B.Tech');
  const [academicYear, setAcademicYear] = useState('4th Year');
  const [branch, setBranch] = useState('CSE');
  const [skills, setSkills] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [companyWebsite, setCompanyWebsite] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      if (mode === 'login') {
        const user = await login(email, password, role);
        addToast('success', 'Welcome Back!', `Logged in as ${user.name}`);
      } else {
        const user = await register({
          name,
          email,
          password,
          role,
          phone,
          college,
          degree,
          academicYear,
          branch,
          skills,
          companyName,
          companyWebsite
        });
        addToast('success', 'Account Registered!', `Welcome to CareerNexus, ${user.name}`);
      }
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '540px' }}>
        {/* Header Tabs */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'var(--bg-elevated)'
        }}>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              onClick={() => { setMode('login'); setErrorMsg(''); }}
              style={{
                fontSize: '1.1rem',
                fontWeight: 700,
                color: mode === 'login' ? 'var(--primary)' : 'var(--text-muted)',
                borderBottom: mode === 'login' ? '2px solid var(--primary)' : '2px solid transparent',
                paddingBottom: '4px'
              }}
            >
              Sign In
            </button>
            <button
              onClick={() => { setMode('register'); setErrorMsg(''); }}
              style={{
                fontSize: '1.1rem',
                fontWeight: 700,
                color: mode === 'register' ? 'var(--primary)' : 'var(--text-muted)',
                borderBottom: mode === 'register' ? '2px solid var(--primary)' : '2px solid transparent',
                paddingBottom: '4px'
              }}
            >
              Register Account
            </button>
          </div>
          <button onClick={onClose} style={{ color: 'var(--text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: '1.5rem' }}>
          {/* Quick Demo Fill Buttons */}
          <div style={{
            background: 'var(--bg-elevated)',
            padding: '0.85rem',
            borderRadius: '10px',
            marginBottom: '1.25rem',
            border: '1px solid rgba(99, 102, 241, 0.2)'
          }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#818cf8', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '6px' }}>
              <Sparkles size={13} /> TEST DEMO ACCOUNTS (INSTANT ACCESS)
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              <button
                type="button"
                onClick={() => { switchDemoAccount('student_cse'); onClose(); }}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem' }}
              >
                🎓 Aditya (CSE Student)
              </button>
              <button
                type="button"
                onClick={() => { switchDemoAccount('student_ece'); onClose(); }}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem' }}
              >
                ⚡ Pooja (ECE Student)
              </button>
              <button
                type="button"
                onClick={() => { switchDemoAccount('recruiter'); onClose(); }}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem' }}
              >
                🏢 NexaTech (Recruiter)
              </button>
              <button
                type="button"
                onClick={() => { switchDemoAccount('admin'); onClose(); }}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem' }}
              >
                🛡️ Campus Admin
              </button>
            </div>
          </div>

          {errorMsg && (
            <div style={{
              padding: '0.75rem',
              borderRadius: '8px',
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#ef4444',
              fontSize: '0.85rem',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <AlertCircle size={16} />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Role Selector Pill Tabs */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label className="form-label">I am joining / signing in as:</label>
            <div style={{ display: 'grid', gridTemplateColumns: mode === 'register' ? '1fr 1fr' : '1fr 1fr 1fr', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={() => setRole('student')}
                style={{
                  padding: '0.65rem',
                  borderRadius: '8px',
                  background: role === 'student' ? 'var(--primary)' : 'var(--bg-elevated)',
                  color: role === 'student' ? 'white' : 'var(--text-secondary)',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <GraduationCap size={16} /> Student
              </button>
              <button
                type="button"
                onClick={() => setRole('recruiter')}
                style={{
                  padding: '0.65rem',
                  borderRadius: '8px',
                  background: role === 'recruiter' ? '#10b981' : 'var(--bg-elevated)',
                  color: role === 'recruiter' ? 'white' : 'var(--text-secondary)',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <Building size={16} /> Recruiter
              </button>
              {mode === 'login' && (
                <button
                  type="button"
                  onClick={() => setRole('admin')}
                  style={{
                    padding: '0.65rem',
                    borderRadius: '8px',
                    background: role === 'admin' ? '#ef4444' : 'var(--bg-elevated)',
                    color: role === 'admin' ? 'white' : 'var(--text-secondary)',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  🛡️ Admin
                </button>
              )}
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {mode === 'register' && (
              <div style={{ marginBottom: '1rem' }}>
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  className="form-input"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Aditya Sharma"
                  required
                />
              </div>
            )}

            <div style={{ marginBottom: '1rem' }}>
              <label className="form-label">Email Address *</label>
              <input
                type="email"
                className="form-input"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="name@college.edu or name@company.com"
                required
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label className="form-label">Password *</label>
              <input
                type="password"
                className="form-input"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            {/* Student Specific Fields on Register */}
            {mode === 'register' && role === 'student' && (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                  <div>
                    <label className="form-label">Academic Branch *</label>
                    <select
                      className="form-input"
                      value={branch}
                      onChange={e => setBranch(e.target.value)}
                      required
                    >
                      {BRANCHES.map(b => (
                        <option key={b.id} value={b.id}>{b.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Academic Year *</label>
                    <select
                      className="form-input"
                      value={academicYear}
                      onChange={e => setAcademicYear(e.target.value)}
                    >
                      <option value="1st Year">1st Year</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                      <option value="4th Year">4th Year</option>
                      <option value="Graduated">Graduated / Recent Passout</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '0.75rem', marginBottom: '1rem' }}>
                  <div>
                    <label className="form-label">College / University</label>
                    <input
                      type="text"
                      className="form-input"
                      value={college}
                      onChange={e => setCollege(e.target.value)}
                      placeholder="e.g. NIT Trichy"
                    />
                  </div>
                  <div>
                    <label className="form-label">Degree</label>
                    <input
                      type="text"
                      className="form-input"
                      value={degree}
                      onChange={e => setDegree(e.target.value)}
                      placeholder="B.Tech"
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label className="form-label">Key Technical Skills (Comma separated)</label>
                  <input
                    type="text"
                    className="form-input"
                    value={skills}
                    onChange={e => setSkills(e.target.value)}
                    placeholder="React, Node.js, Python, SolidWorks..."
                  />
                </div>
              </>
            )}

            {/* Recruiter Specific Fields on Register */}
            {mode === 'register' && role === 'recruiter' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                <div>
                  <label className="form-label">Company / Organization *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={companyName}
                    onChange={e => setCompanyName(e.target.value)}
                    placeholder="e.g. NexaTech Innovations"
                    required
                  />
                </div>
                <div>
                  <label className="form-label">Company Website</label>
                  <input
                    type="text"
                    className="form-input"
                    value={companyWebsite}
                    onChange={e => setCompanyWebsite(e.target.value)}
                    placeholder="https://company.com"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '0.5rem' }}
              disabled={loading}
            >
              {loading
                ? 'Processing...'
                : mode === 'login'
                ? `Sign In as ${role.toUpperCase()}`
                : `Create ${role.toUpperCase()} Account`}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
