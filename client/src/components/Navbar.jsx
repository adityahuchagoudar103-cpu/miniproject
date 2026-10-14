import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import {
  Briefcase,
  GraduationCap,
  Layers,
  FileCheck,
  Bookmark,
  Bell,
  User,
  LogOut,
  ChevronDown,
  Sparkles,
  ShieldAlert,
  Building2,
  Check,
  ExternalLink
} from 'lucide-react';

export const Navbar = ({ activePage, setActivePage, selectedBranch, setSelectedBranch, openAuthModal }) => {
  const { user, logout, switchDemoAccount } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotification();

  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showDemoMenu, setShowDemoMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="glass" style={{ position: 'sticky', top: 0, zIndex: 100, borderBottom: '1px solid var(--border-subtle)' }}>
      {/* Top Banner with Quick Role Switcher */}
      <div style={{
        background: 'linear-gradient(90deg, rgba(99, 102, 241, 0.15) 0%, rgba(139, 92, 246, 0.15) 100%)',
        borderBottom: '1px solid rgba(99, 102, 241, 0.2)',
        padding: '0.4rem 1.5rem',
        fontSize: '0.8rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sparkles size={14} color="#818cf8" />
          <span style={{ color: '#c7d2fe', fontWeight: 600 }}>Active Role Mode:</span>
          <span style={{
            background: user ? (user.role === 'admin' ? '#ef4444' : user.role === 'recruiter' ? '#f59e0b' : '#6366f1') : '#64748b',
            color: 'white',
            padding: '2px 8px',
            borderRadius: '9999px',
            fontSize: '0.75rem',
            fontWeight: 700,
            textTransform: 'uppercase'
          }}>
            {user ? `${user.role} ${user.branch ? `(${user.branch})` : ''}` : 'Guest'}
          </span>
          {user && (
            <span style={{ color: 'var(--text-secondary)' }}>
              Logged in as <strong style={{ color: 'var(--text-primary)' }}>{user.name}</strong>
            </span>
          )}
        </div>

        {/* Demo Account Switcher Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ color: 'var(--text-muted)' }}>1-Click Role Switch:</span>
          <button
            onClick={() => { switchDemoAccount('student_cse'); setActivePage('dashboard'); }}
            style={{
              padding: '2px 8px',
              fontSize: '0.725rem',
              borderRadius: '4px',
              background: user?.id === 'usr_student_1' ? '#6366f1' : 'var(--bg-elevated)',
              color: 'white',
              fontWeight: 600
            }}
          >
            🎓 Student (CSE)
          </button>
          <button
            onClick={() => { switchDemoAccount('student_ece'); setActivePage('dashboard'); }}
            style={{
              padding: '2px 8px',
              fontSize: '0.725rem',
              borderRadius: '4px',
              background: user?.id === 'usr_student_2' ? '#f59e0b' : 'var(--bg-elevated)',
              color: 'white',
              fontWeight: 600
            }}
          >
            ⚡ Student (ECE)
          </button>
          <button
            onClick={() => { switchDemoAccount('recruiter'); setActivePage('recruiter'); }}
            style={{
              padding: '2px 8px',
              fontSize: '0.725rem',
              borderRadius: '4px',
              background: user?.role === 'recruiter' ? '#10b981' : 'var(--bg-elevated)',
              color: 'white',
              fontWeight: 600
            }}
          >
            🏢 Recruiter
          </button>
          <button
            onClick={() => { switchDemoAccount('admin'); setActivePage('admin'); }}
            style={{
              padding: '2px 8px',
              fontSize: '0.725rem',
              borderRadius: '4px',
              background: user?.role === 'admin' ? '#ef4444' : 'var(--bg-elevated)',
              color: 'white',
              fontWeight: 600
            }}
          >
            🛡️ Admin
          </button>
        </div>
      </div>

      {/* Main Header Bar */}
      <div style={{
        maxWidth: '1440px',
        margin: '0 auto',
        padding: '0.75rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem'
      }}>
        {/* Brand Logo */}
        <div
          onClick={() => setActivePage('home')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}
        >
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)'
          }}>
            <GraduationCap size={24} color="#ffffff" />
          </div>
          <div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span>Career</span>
              <span className="gradient-accent">Nexus</span>
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Branch-Smart Placement Platform
            </div>
          </div>
        </div>

        {/* Primary Navigation Menu */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <button
            onClick={() => setActivePage('home')}
            style={{
              padding: '0.55rem 0.9rem',
              borderRadius: '8px',
              fontSize: '0.875rem',
              fontWeight: activePage === 'home' ? 700 : 500,
              color: activePage === 'home' ? 'var(--primary)' : 'var(--text-secondary)',
              background: activePage === 'home' ? 'var(--primary-light)' : 'transparent'
            }}
          >
            Home
          </button>

          <button
            onClick={() => setActivePage('jobs')}
            style={{
              padding: '0.55rem 0.9rem',
              borderRadius: '8px',
              fontSize: '0.875rem',
              fontWeight: activePage === 'jobs' ? 700 : 500,
              color: activePage === 'jobs' ? 'var(--primary)' : 'var(--text-secondary)',
              background: activePage === 'jobs' ? 'var(--primary-light)' : 'transparent',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Briefcase size={16} />
            Find Jobs
          </button>

          <button
            onClick={() => setActivePage('internships')}
            style={{
              padding: '0.55rem 0.9rem',
              borderRadius: '8px',
              fontSize: '0.875rem',
              fontWeight: activePage === 'internships' ? 700 : 500,
              color: activePage === 'internships' ? 'var(--primary)' : 'var(--text-secondary)',
              background: activePage === 'internships' ? 'var(--primary-light)' : 'transparent',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Sparkles size={16} />
            Find Internships
          </button>

          <button
            onClick={() => setActivePage('branches')}
            style={{
              padding: '0.55rem 0.9rem',
              borderRadius: '8px',
              fontSize: '0.875rem',
              fontWeight: activePage === 'branches' ? 700 : 500,
              color: activePage === 'branches' ? 'var(--primary)' : 'var(--text-secondary)',
              background: activePage === 'branches' ? 'var(--primary-light)' : 'transparent',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Layers size={16} />
            Browse by Branch
          </button>

          {/* Student Specific Links */}
          {user?.role === 'student' && (
            <>
              <button
                onClick={() => setActivePage('dashboard')}
                style={{
                  padding: '0.55rem 0.9rem',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  fontWeight: activePage === 'dashboard' ? 700 : 500,
                  color: activePage === 'dashboard' ? 'var(--primary)' : 'var(--text-secondary)',
                  background: activePage === 'dashboard' ? 'var(--primary-light)' : 'transparent'
                }}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActivePage('applications')}
                style={{
                  padding: '0.55rem 0.9rem',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  fontWeight: activePage === 'applications' ? 700 : 500,
                  color: activePage === 'applications' ? 'var(--primary)' : 'var(--text-secondary)',
                  background: activePage === 'applications' ? 'var(--primary-light)' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <FileCheck size={16} />
                My Applications
              </button>
              <button
                onClick={() => setActivePage('saved')}
                style={{
                  padding: '0.55rem 0.9rem',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  fontWeight: activePage === 'saved' ? 700 : 500,
                  color: activePage === 'saved' ? 'var(--primary)' : 'var(--text-secondary)',
                  background: activePage === 'saved' ? 'var(--primary-light)' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Bookmark size={16} />
                Saved
              </button>
            </>
          )}

          {/* Recruiter Specific Link */}
          {user?.role === 'recruiter' && (
            <button
              onClick={() => setActivePage('recruiter')}
              style={{
                padding: '0.55rem 0.9rem',
                borderRadius: '8px',
                fontSize: '0.875rem',
                fontWeight: activePage === 'recruiter' ? 700 : 500,
                color: activePage === 'recruiter' ? '#10b981' : 'var(--text-secondary)',
                background: activePage === 'recruiter' ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Building2 size={16} />
              Recruiter Hub
            </button>
          )}

          {/* Admin Specific Link */}
          {user?.role === 'admin' && (
            <button
              onClick={() => setActivePage('admin')}
              style={{
                padding: '0.55rem 0.9rem',
                borderRadius: '8px',
                fontSize: '0.875rem',
                fontWeight: activePage === 'admin' ? 700 : 500,
                color: activePage === 'admin' ? '#ef4444' : 'var(--text-secondary)',
                background: activePage === 'admin' ? 'rgba(239, 68, 68, 0.15)' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <ShieldAlert size={16} />
              Admin Panel
            </button>
          )}
        </nav>

        {/* Action Controls & Profile Menu */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', position: 'relative' }}>
          {/* Notification Bell Dropdown */}
          {user && (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => {
                  setShowNotifMenu(!showNotifMenu);
                  setShowUserMenu(false);
                }}
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: 'var(--bg-elevated)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  border: '1px solid var(--border-subtle)',
                  color: showNotifMenu ? 'var(--primary)' : 'var(--text-secondary)'
                }}
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '-3px',
                    right: '-3px',
                    background: '#ef4444',
                    color: 'white',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Popup Dropdown */}
              {showNotifMenu && (
                <div className="glass" style={{
                  position: 'absolute',
                  top: '48px',
                  right: 0,
                  width: '360px',
                  borderRadius: '14px',
                  padding: '1rem',
                  boxShadow: 'var(--shadow-lg)',
                  zIndex: 200,
                  maxHeight: '420px',
                  overflowY: 'auto'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Notifications ({unreadCount} new)</div>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600 }}
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  {notifications.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '1.5rem 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      No notifications yet
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {notifications.map(n => (
                        <div
                          key={n.id}
                          onClick={() => {
                            markAsRead(n.id);
                            if (n.link) {
                              if (n.link.includes('applications')) setActivePage('applications');
                              else if (n.link.includes('jobs')) setActivePage('jobs');
                              else if (n.link.includes('internships')) setActivePage('internships');
                              else if (n.link.includes('recruiter')) setActivePage('recruiter');
                              setShowNotifMenu(false);
                            }
                          }}
                          style={{
                            padding: '0.65rem',
                            borderRadius: '8px',
                            background: n.isRead ? 'transparent' : 'rgba(99, 102, 241, 0.08)',
                            border: n.isRead ? '1px solid transparent' : '1px solid rgba(99, 102, 241, 0.2)',
                            cursor: 'pointer'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ fontWeight: n.isRead ? 500 : 700, fontSize: '0.85rem', color: n.isRead ? 'var(--text-primary)' : '#818cf8' }}>
                              {n.title}
                            </div>
                            {!n.isRead && (
                              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--primary)' }} />
                            )}
                          </div>
                          <div style={{ fontSize: '0.785rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                            {n.message}
                          </div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                            {new Date(n.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* User Profile or Login Button */}
          {user ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => {
                  setShowUserMenu(!showUserMenu);
                  setShowNotifMenu(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.35rem 0.75rem',
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '10px'
                }}
              >
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  color: 'white'
                }}>
                  {user.name.charAt(0)}
                </div>
                <div style={{ textAlign: 'left', lineHeight: 1.2 }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{user.name.split(' ')[0]}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{user.role}</div>
                </div>
                <ChevronDown size={14} color="var(--text-muted)" />
              </button>

              {/* User Dropdown */}
              {showUserMenu && (
                <div className="glass" style={{
                  position: 'absolute',
                  top: '45px',
                  right: 0,
                  width: '220px',
                  borderRadius: '12px',
                  padding: '0.5rem',
                  boxShadow: 'var(--shadow-lg)',
                  zIndex: 200
                }}>
                  <div style={{ padding: '0.5rem', borderBottom: '1px solid var(--border-subtle)', marginBottom: '0.35rem' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>{user.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {user.email}
                    </div>
                  </div>

                  {user.role === 'student' && (
                    <button
                      onClick={() => { setActivePage('dashboard'); setShowUserMenu(false); }}
                      style={{
                        width: '100%',
                        padding: '0.5rem 0.75rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '0.85rem',
                        color: 'var(--text-secondary)',
                        borderRadius: '6px',
                        textAlign: 'left'
                      }}
                    >
                      <User size={15} /> Student Profile & Resume
                    </button>
                  )}

                  {user.role === 'recruiter' && (
                    <button
                      onClick={() => { setActivePage('recruiter'); setShowUserMenu(false); }}
                      style={{
                        width: '100%',
                        padding: '0.5rem 0.75rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '0.85rem',
                        color: 'var(--text-secondary)',
                        borderRadius: '6px',
                        textAlign: 'left'
                      }}
                    >
                      <Building2 size={15} /> Manage Job Postings
                    </button>
                  )}

                  {user.role === 'admin' && (
                    <button
                      onClick={() => { setActivePage('admin'); setShowUserMenu(false); }}
                      style={{
                        width: '100%',
                        padding: '0.5rem 0.75rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '0.85rem',
                        color: 'var(--text-secondary)',
                        borderRadius: '6px',
                        textAlign: 'left'
                      }}
                    >
                      <ShieldAlert size={15} /> Admin Dashboard
                    </button>
                  )}

                  <button
                    onClick={() => {
                      logout();
                      setShowUserMenu(false);
                      setActivePage('home');
                    }}
                    style={{
                      width: '100%',
                      padding: '0.5rem 0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '0.85rem',
                      color: '#ef4444',
                      borderRadius: '6px',
                      textAlign: 'left',
                      marginTop: '0.25rem'
                    }}
                  >
                    <LogOut size={15} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => openAuthModal('login')}
              className="btn btn-primary btn-sm"
              style={{ gap: '6px' }}
            >
              <User size={15} /> Sign In / Register
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
