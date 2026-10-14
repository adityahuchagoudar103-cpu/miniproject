import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const DEMO_ACCOUNTS = {
  student_cse: {
    id: 'usr_student_1',
    role: 'student',
    name: 'Aditya Sharma',
    email: 'aditya.student@nexus.edu',
    college: 'National Institute of Technology, Trichy',
    degree: 'B.Tech',
    academicYear: '4th Year',
    branch: 'CSE',
    skills: ['React', 'Node.js', 'Python', 'AWS', 'Docker', 'PostgreSQL', 'Git'],
    phone: '+91 98765 43210',
    bio: 'Enthusiastic full-stack engineer and open source contributor passionate about high performance scalable web applications.',
    resumeUrl: '/uploads/resumes/sample-resume-aditya.pdf',
    resumeName: 'Aditya_Sharma_Resume.pdf'
  },
  student_ece: {
    id: 'usr_student_2',
    role: 'student',
    name: 'Pooja Iyer',
    email: 'pooja.ece@nexus.edu',
    college: 'Indian Institute of Technology, Madras',
    degree: 'B.Tech',
    academicYear: '3rd Year',
    branch: 'ECE',
    skills: ['Verilog', 'Embedded C', 'MATLAB', 'ARM Cortex', 'IoT', 'PCB Design'],
    phone: '+91 98765 12345',
    bio: 'Hardware-software co-design enthusiast with hands-on experience in FPGA prototyping and microcontroller firmware.',
    resumeUrl: '/uploads/resumes/sample-resume-pooja.pdf',
    resumeName: 'Pooja_Iyer_Resume.pdf'
  },
  recruiter: {
    id: 'usr_recruiter_1',
    role: 'recruiter',
    name: 'Sarah Jenkins',
    email: 'recruiter@nexatech.com',
    companyName: 'NexaTech Innovations',
    companyWebsite: 'https://nexatech.example.com',
    phone: '+91 91234 56789',
    bio: 'Lead Technical Talent Partner at NexaTech. Hiring top engineering minds across India.'
  },
  admin: {
    id: 'usr_admin_1',
    role: 'admin',
    name: 'Campus Director (Admin)',
    email: 'admin@careernexus.edu',
    phone: '+91 99999 00000',
    bio: 'Platform Administrator & Placement Cell Coordinator.'
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('career_nexus_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    // Default to student_cse demo user
    return DEMO_ACCOUNTS.student_cse;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('career_nexus_token') || 'usr_student_1';
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('career_nexus_user', JSON.stringify(user));
      localStorage.setItem('career_nexus_token', user.id);
      setToken(user.id);
    } else {
      localStorage.removeItem('career_nexus_user');
      localStorage.removeItem('career_nexus_token');
      setToken('');
    }
  }, [user]);

  const login = async (email, password, role) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, role })
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to login');
    }
    setUser(data.user);
    setToken(data.token);
    return data.user;
  };

  const register = async (formData) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to register');
    }
    setUser(data.user);
    setToken(data.token);
    return data.user;
  };

  const logout = () => {
    setUser(null);
    setToken('');
  };

  const updateProfile = async (updates) => {
    const res = await fetch('/api/auth/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': user.id
      },
      body: JSON.stringify(updates)
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to update profile');
    }
    setUser(data.user);
    return data.user;
  };

  const uploadResume = async (file) => {
    const formData = new FormData();
    formData.append('resume', file);
    const res = await fetch('/api/auth/upload-resume', {
      method: 'POST',
      headers: { 'x-user-id': user.id },
      body: formData
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to upload resume');
    }
    setUser(data.user);
    return data;
  };

  const switchDemoAccount = (key) => {
    if (DEMO_ACCOUNTS[key]) {
      setUser(DEMO_ACCOUNTS[key]);
      setToken(DEMO_ACCOUNTS[key].id);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        register,
        logout,
        updateProfile,
        uploadResume,
        switchDemoAccount,
        DEMO_ACCOUNTS
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
