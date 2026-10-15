import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { BRANCHES } from '../constants/branches';
import { X, User, Lock, Mail, Building, Phone, GraduationCap, AlertCircle, Sparkles } from 'lucide-react';

export const LoginPage = ({ onSuccess }) => {
  const { login, register, switchDemoAccount } = useAuth();
  const { addToast } = useNotification();

  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [role, setRole] = useState('student');
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

      // Call optional onSuccess (App will refresh user activity / navigate)
      if (onSuccess) onSuccess();
      // Default navigation: students -> dashboard, others -> home
      const target = mode === 'login' && role === 'student' ? '#/dashboard' : '#/home';
      window.location.hash = target;
    } catch (err) {
      setErrorMsg(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '2.5rem auto', padding: '1rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: '1rem', alignItems: 'start' }}>
        {/* Left: marketing / info */}
        <div style={{ padding: '1.25rem', borderRadius: '12px', background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '0.5rem' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <GraduationCap size={22} color="#fff" />
            </div>
            <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>CareerNexus — Sign in to continue</div>
          </div>

          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Access personalized placements, bookmark opportunities and apply with your resume. Use demo accounts for quick exploration.
          </p>

          <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button type="button" onClick={() => { switchDemoAccount('student_cse'); window.location.hash = '#/dashboard'; }} className="btn btn-secondary btn-sm" style={{ fontSize: '0.84rem' }}>🎓 Aditya (CSE)</button>
            <button type="button" onClick={() => { switchDemoAccount('student_ece'); window.location.hash = '#/dashboard'; }} className="btn btn-secondary btn-sm" style={{ fontSize: '0.84rem' }}>⚡ Pooja (ECE)</button>
            <button type="button" onClick={() => { switchDemoAccount('recruiter'); window.location.hash = '#/recruiter'; }} className="btn btn-secondary btn-sm" style={{ fontSize: '0.84rem' }}>🏢 NexaTech</button>
            <button type="button" onClick={() => { switchDemoAccount('admin'); window.location.hash = '#/admin'; }} className="btn btn-secondary btn-sm" style={{ fontSize: '0.84rem' }}>🛡️ Admin</button>
          </div>
        </div>

        {/* Right: form panel */}
        <div style={{ padding: '1.25rem', borderRadius: '12px', background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <div style={{ fontSize: '1.05rem', fontWeight: 800 }}>{mode === 'login' ? 'Sign In' : 'Register Account'}</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Full app access for demo accounts</div>
          </div>

          {errorMsg && (
            <div style={{ padding: '0.75rem', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444', fontSize: '0.85rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <AlertCircle size={16} />
              <span>{errorMsg}</span>
            </div>
          )}

          <div style={{ marginBottom: '0.8rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button type="button" onClick={() => { setMode('login'); setRole('student'); setErrorMsg(''); }} style={{ padding: '0.55rem 0.85rem', borderRadius: '8px', background: mode === 'login' ? 'var(--primary)' : 'var(--bg-elevated)', color: mode === 'login' ? 'white' : 'var(--text-secondary)', fontWeight: 700 }}>Sign In</button>
              <button type="button" onClick={() => { setMode('register'); setRole('student'); setErrorMsg(''); }} style={{ padding: '0.55rem 0.85rem', borderRadius: '8px', background: mode === 'register' ? 'var(--primary)' : 'var(--bg-elevated)', color: mode === 'register' ? 'white' : 'var(--text-secondary)', fontWeight: 700 }}>Register</button>
            </div>
          </div>

          <div style={{ marginBottom: '0.85rem' }}>
            <label className="form-label">I am joining / signing in as:</label>
            <div style={{ display: 'grid', gridTemplateColumns: mode === 'register' ? '1fr 1fr' : '1fr 1fr 1fr', gap: '0.5rem' }}>
              <button type="button" onClick={() => setRole('student')} style={{ padding: '0.6rem', borderRadius: '8px', background: role === 'student' ? 'var(--primary)' : 'var(--bg-elevated)', color: role === 'student' ? 'white' : 'var(--text-secondary)', fontWeight: 600 }}> <GraduationCap size={14} /> Student</button>
              <button type="button" onClick={() => setRole('recruiter')} style={{ padding: '0.6rem', borderRadius: '8px', background: role === 'recruiter' ? '#10b981' : 'var(--bg-elevated)', color: role === 'recruiter' ? 'white' : 'var(--text-secondary)', fontWeight: 600 }}> <Building size={14} /> Recruiter</button>
              {mode === 'login' && (
                <button type="button" onClick={() => setRole('admin')} style={{ padding: '0.6rem', borderRadius: '8px', background: role === 'admin' ? '#ef4444' : 'var(--bg-elevated)', color: role === 'admin' ? 'white' : 'var(--text-secondary)', fontWeight: 600 }}>🛡️ Admin</button>
              )}
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {mode === 'register' && (
              <div style={{ marginBottom: '0.75rem' }}>
                <label className="form-label">Full Name *</label>
                <input type="text" className="form-input" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Aditya Sharma" required />
              </div>
            )}

            <div style={{ marginBottom: '0.75rem' }}>
              <label className="form-label">Email Address *</label>
              <input type="email" className="form-input" value={email} onChange={e => setEmail(e.target.value)} placeholder="name@college.edu or name@company.com" required />
            </div>

            <div style={{ marginBottom: '0.75rem' }}>
              <label className="form-label">Password *</label>
              <input type="password" className="form-input" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
            </div>

            {mode === 'register' && role === 'student' && (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <div>
                    <label className="form-label">Academic Branch *</label>
                    <select className="form-input" value={branch} onChange={e => setBranch(e.target.value)} required>
                      {BRANCHES.map(b => (
                        <option key={b.id} value={b.id}>{b.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Academic Year *</label>
                    <select className="form-input" value={academicYear} onChange={e => setAcademicYear(e.target.value)}>
                      <option value="1st Year">1st Year</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                      <option value="4th Year">4th Year</option>
                      <option value="Graduated">Graduated / Recent Passout</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <div>
                    <label className="form-label">College / University</label>
                    <input type="text" className="form-input" value={college} onChange={e => setCollege(e.target.value)} placeholder="e.g. NIT Trichy" />
                  </div>
                  <div>
                    <label className="form-label">Degree</label>
                    <input type="text" className="form-input" value={degree} onChange={e => setDegree(e.target.value)} placeholder="B.Tech" />
                  </div>
                </div>

                <div style={{ marginBottom: '0.75rem' }}>
                  <label className="form-label">Key Technical Skills (Comma separated)</label>
                  <input type="text" className="form-input" value={skills} onChange={e => setSkills(e.target.value)} placeholder="React, Node.js, Python..." />
                </div>
              </>
            )}

            {mode === 'register' && role === 'recruiter' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <div>
                  <label className="form-label">Company / Organization *</label>
                  <input type="text" className="form-input" value={companyName} onChange={e => setCompanyName(e.target.value)} placeholder="e.g. NexaTech Innovations" required />
                </div>
                <div>
                  <label className="form-label">Company Website</label>
                  <input type="text" className="form-input" value={companyWebsite} onChange={e => setCompanyWebsite(e.target.value)} placeholder="https://company.com" />
                </div>
              </div>
            )}

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }} disabled={loading}>
              {loading ? 'Processing...' : mode === 'login' ? `Sign In as ${role.toUpperCase()}` : `Create ${role.toUpperCase()} Account`}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
