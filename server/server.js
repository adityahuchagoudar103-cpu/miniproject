const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS
app.use(cors());
app.use(express.json());

// Set up Multer for Resume Uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, 'uploads', 'resumes');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const sanitized = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    cb(null, `${uniqueSuffix}-${sanitized}`);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Serve uploaded files statically
app.use('/uploads/resumes', express.static(path.join(__dirname, 'uploads', 'resumes')));

// Simple Auth Middleware using custom header 'x-user-id'
const authMiddleware = (req, res, next) => {
  const userId = req.headers['x-user-id'];
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized: missing user ID header' });
  }
  const user = db.getUserById(userId);
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized: user not found' });
  }
  req.user = user;
  next();
};

const optionalAuth = (req, res, next) => {
  const userId = req.headers['x-user-id'];
  if (userId) {
    req.user = db.getUserById(userId);
  }
  next();
};

// ==========================================
// 1. AUTHENTICATION & USER PROFILE ROUTES
// ==========================================

// Register (Student, Recruiter, Admin)
app.post('/api/auth/register', (req, res) => {
  try {
    const { email, password, role, name, college, degree, academicYear, branch, skills, phone, companyName, companyWebsite, bio } = req.body;

    if (!email || !password || !name || !role) {
      return res.status(400).json({ error: 'Name, email, password, and role are required.' });
    }

    const existing = db.getUserByEmail(email);
    if (existing) {
      return res.status(409).json({ error: 'An account with this email already exists.' });
    }

    const userData = {
      role,
      name,
      email,
      password, // In a production app, use bcrypt.hash
      phone: phone || '',
      bio: bio || '',
      college: college || '',
      degree: degree || '',
      academicYear: academicYear || '1st Year',
      branch: branch || 'Other',
      skills: Array.isArray(skills) ? skills : (skills ? skills.split(',').map(s => s.trim()).filter(Boolean) : []),
      companyName: companyName || '',
      companyWebsite: companyWebsite || '',
      resumeUrl: '',
      resumeName: ''
    };

    const newUser = db.createUser(userData);

    // Send welcome notification
    db.createNotification({
      userId: newUser.id,
      title: 'Welcome to CareerNexus!',
      message: `Hi ${newUser.name}, your account has been registered successfully as a ${newUser.role}. Explore opportunities customized for your department!`,
      type: 'new_match',
      link: newUser.role === 'student' ? '/dashboard' : '/recruiter'
    });

    const { password: _, ...safeUser } = newUser;
    res.status(201).json({ user: safeUser, token: newUser.id });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Internal server error during registration.' });
  }
});

// Login
app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const user = db.getUserByEmail(email);
    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    if (role && user.role !== role) {
      return res.status(403).json({ error: `Account found, but role is '${user.role}', not '${role}'. Please switch role tabs.` });
    }

    if (user.status === 'suspended') {
      return res.status(403).json({ error: 'Your account is suspended. Contact campus admin.' });
    }

    const { password: _, ...safeUser } = user;
    res.json({ user: safeUser, token: user.id });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error during login.' });
  }
});

// Get Current User Profile
app.get('/api/auth/me', authMiddleware, (req, res) => {
  const { password: _, ...safeUser } = req.user;
  res.json({ user: safeUser });
});

// Update Profile
app.put('/api/auth/profile', authMiddleware, (req, res) => {
  try {
    const { name, phone, bio, college, degree, academicYear, branch, skills, companyName, companyWebsite } = req.body;

    const updates = {
      ...(name && { name }),
      ...(phone !== undefined && { phone }),
      ...(bio !== undefined && { bio }),
      ...(college !== undefined && { college }),
      ...(degree !== undefined && { degree }),
      ...(academicYear !== undefined && { academicYear }),
      ...(branch !== undefined && { branch }),
      ...(skills !== undefined && { skills: Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim()).filter(Boolean) }),
      ...(companyName !== undefined && { companyName }),
      ...(companyWebsite !== undefined && { companyWebsite })
    };

    const updated = db.updateUser(req.user.id, updates);
    const { password: _, ...safeUser } = updated;
    res.json({ user: safeUser });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update profile.' });
  }
});

// Upload User Resume to Profile
app.post('/api/auth/upload-resume', authMiddleware, upload.single('resume'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No resume file uploaded.' });
    }

    const resumeUrl = `/uploads/resumes/${req.file.filename}`;
    const resumeName = req.file.originalname;

    const updated = db.updateUser(req.user.id, { resumeUrl, resumeName });
    const { password: _, ...safeUser } = updated;

    res.json({
      message: 'Resume uploaded successfully',
      resumeUrl,
      resumeName,
      user: safeUser
    });
  } catch (err) {
    console.error('Resume upload error:', err);
    res.status(500).json({ error: 'Failed to process resume upload.' });
  }
});

// ==========================================
// 2. BRANCHES ROUTE
// ==========================================
app.get('/api/branches', (req, res) => {
  res.json(db.getBranches());
});

// ==========================================
// 3. JOB OPPORTUNITIES ROUTES
// ==========================================
app.get('/api/jobs', (req, res) => {
  try {
    const { branch, search, location, workMode, experienceLevel, employmentType } = req.query;
    const jobs = db.getJobs({ branch, search, location, workMode, experienceLevel, employmentType });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
});

app.get('/api/jobs/:id', (req, res) => {
  const job = db.getJobById(req.params.id);
  if (!job) return res.status(404).json({ error: 'Job not found' });
  res.json(job);
});

// Create Job (Recruiter / Admin)
app.post('/api/jobs', authMiddleware, (req, res) => {
  try {
    if (req.user.role !== 'recruiter' && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Only recruiters and administrators can post jobs.' });
    }

    const {
      title,
      company,
      description,
      responsibilities,
      requiredSkills,
      eligibleBranches,
      qualifications,
      experienceLevel,
      location,
      workMode,
      salary,
      employmentType,
      deadline
    } = req.body;

    if (!title || !description || !eligibleBranches || eligibleBranches.length === 0) {
      return res.status(400).json({ error: 'Title, description, and at least one eligible branch are required.' });
    }

    const newJob = db.createJob({
      title,
      company: company || req.user.companyName || 'Campus Partner',
      logo: (company || req.user.companyName || 'CP').substring(0, 2).toUpperCase(),
      logoColor: '#6366f1',
      description,
      responsibilities: Array.isArray(responsibilities) ? responsibilities : (responsibilities ? responsibilities.split('\n').filter(Boolean) : []),
      requiredSkills: Array.isArray(requiredSkills) ? requiredSkills : (requiredSkills ? requiredSkills.split(',').map(s => s.trim()).filter(Boolean) : []),
      eligibleBranches: Array.isArray(eligibleBranches) ? eligibleBranches : [eligibleBranches],
      qualifications: qualifications || 'B.Tech / B.E. in relevant engineering discipline',
      experienceLevel: experienceLevel || 'Fresher',
      location: location || 'Bangalore, India',
      workMode: workMode || 'Onsite',
      salary: salary || 'Competitive',
      employmentType: employmentType || 'Full-time',
      deadline: deadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      postedBy: req.user.id
    });

    // Notify students whose branch matches!
    const students = db.getUsers().filter(u => u.role === 'student');
    students.forEach(student => {
      if (newJob.eligibleBranches.includes(student.branch) || newJob.eligibleBranches.includes('All')) {
        db.createNotification({
          userId: student.id,
          title: `New Job matching your branch (${student.branch})`,
          message: `${newJob.company} is hiring: ${newJob.title}. Applications close on ${newJob.deadline}.`,
          type: 'new_match',
          link: '/jobs'
        });
      }
    });

    res.status(201).json(newJob);
  } catch (err) {
    console.error('Job creation error:', err);
    res.status(500).json({ error: 'Failed to create job.' });
  }
});

// Update Job
app.put('/api/jobs/:id', authMiddleware, (req, res) => {
  try {
    const job = db.getJobById(req.params.id);
    if (!job) return res.status(404).json({ error: 'Job not found' });

    if (req.user.role !== 'admin' && job.postedBy !== req.user.id) {
      return res.status(403).json({ error: 'You are not authorized to edit this job.' });
    }

    const updated = db.updateJob(req.params.id, req.body);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update job' });
  }
});

// Delete Job
app.delete('/api/jobs/:id', authMiddleware, (req, res) => {
  try {
    const job = db.getJobById(req.params.id);
    if (!job) return res.status(404).json({ error: 'Job not found' });

    if (req.user.role !== 'admin' && job.postedBy !== req.user.id) {
      return res.status(403).json({ error: 'You are not authorized to delete this job.' });
    }

    db.deleteJob(req.params.id);
    res.json({ message: 'Job deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete job' });
  }
});

// ==========================================
// 4. INTERNSHIP OPPORTUNITIES ROUTES
// ==========================================
app.get('/api/internships', (req, res) => {
  try {
    const { branch, search, duration, stipendType, workMode, academicYear } = req.query;
    const internships = db.getInternships({ branch, search, duration, stipendType, workMode, academicYear });
    res.json(internships);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch internships' });
  }
});

app.get('/api/internships/:id', (req, res) => {
  const intern = db.getInternshipById(req.params.id);
  if (!intern) return res.status(404).json({ error: 'Internship not found' });
  res.json(intern);
});

// Create Internship (Recruiter / Admin)
app.post('/api/internships', authMiddleware, (req, res) => {
  try {
    if (req.user.role !== 'recruiter' && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Only recruiters and administrators can post internships.' });
    }

    const {
      title,
      company,
      description,
      responsibilities,
      eligibleBranches,
      eligibleYears,
      requiredSkills,
      duration,
      stipendType,
      stipendAmount,
      workMode,
      location,
      deadline
    } = req.body;

    if (!title || !description || !eligibleBranches || eligibleBranches.length === 0) {
      return res.status(400).json({ error: 'Title, description, and eligible branches are required.' });
    }

    const newIntern = db.createInternship({
      title,
      company: company || req.user.companyName || 'Campus Partner',
      logo: (company || req.user.companyName || 'CP').substring(0, 2).toUpperCase(),
      logoColor: '#8b5cf6',
      description,
      responsibilities: Array.isArray(responsibilities) ? responsibilities : (responsibilities ? responsibilities.split('\n').filter(Boolean) : []),
      requiredSkills: Array.isArray(requiredSkills) ? requiredSkills : (requiredSkills ? requiredSkills.split(',').map(s => s.trim()).filter(Boolean) : []),
      eligibleBranches: Array.isArray(eligibleBranches) ? eligibleBranches : [eligibleBranches],
      eligibleYears: Array.isArray(eligibleYears) ? eligibleYears : ['2nd Year', '3rd Year', '4th Year'],
      duration: duration || '3 Months',
      stipendType: stipendType || 'Paid',
      stipendAmount: stipendAmount || '₹20,000 / month',
      workMode: workMode || 'Remote',
      location: location || 'Remote (Pan India)',
      deadline: deadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      postedBy: req.user.id
    });

    // Notify matching students
    const students = db.getUsers().filter(u => u.role === 'student');
    students.forEach(student => {
      if (newIntern.eligibleBranches.includes(student.branch) || newIntern.eligibleBranches.includes('All')) {
        db.createNotification({
          userId: student.id,
          title: `New Internship matching your branch (${student.branch})`,
          message: `${newIntern.company} is hiring interns: ${newIntern.title} (${newIntern.duration}). Stipend: ${newIntern.stipendAmount}.`,
          type: 'new_match',
          link: '/internships'
        });
      }
    });

    res.status(201).json(newIntern);
  } catch (err) {
    console.error('Internship creation error:', err);
    res.status(500).json({ error: 'Failed to create internship.' });
  }
});

// Update Internship
app.put('/api/internships/:id', authMiddleware, (req, res) => {
  try {
    const intern = db.getInternshipById(req.params.id);
    if (!intern) return res.status(404).json({ error: 'Internship not found' });

    if (req.user.role !== 'admin' && intern.postedBy !== req.user.id) {
      return res.status(403).json({ error: 'You are not authorized to edit this internship.' });
    }

    const updated = db.updateInternship(req.params.id, req.body);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update internship' });
  }
});

// Delete Internship
app.delete('/api/internships/:id', authMiddleware, (req, res) => {
  try {
    const intern = db.getInternshipById(req.params.id);
    if (!intern) return res.status(404).json({ error: 'Internship not found' });

    if (req.user.role !== 'admin' && intern.postedBy !== req.user.id) {
      return res.status(403).json({ error: 'You are not authorized to delete this internship.' });
    }

    db.deleteInternship(req.params.id);
    res.json({ message: 'Internship deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete internship' });
  }
});

// ==========================================
// 5. APPLICATION ROUTES (APPLY DIRECTLY)
// ==========================================

// Check if student already applied to this opportunity
app.get('/api/applications/check/:opportunityId', authMiddleware, (req, res) => {
  const hasApplied = db.hasApplied(req.user.id, req.params.opportunityId);
  res.json({ hasApplied });
});

// Apply Directly (with multipart file upload OR profile resume reuse)
app.post('/api/applications', authMiddleware, upload.single('resume'), (req, res) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({ error: 'Only student accounts can submit applications.' });
    }

    const {
      opportunityId,
      opportunityType,
      studentName,
      studentEmail,
      studentPhone,
      studentCollege,
      studentDegree,
      studentAcademicYear,
      studentBranch,
      studentSkills,
      coverLetter
    } = req.body;

    if (!opportunityId || !opportunityType) {
      return res.status(400).json({ error: 'Opportunity ID and type are required.' });
    }

    // Check duplicate application
    if (db.hasApplied(req.user.id, opportunityId)) {
      return res.status(409).json({
        error: 'You have already applied for this opportunity! Multiple submissions are prevented.'
      });
    }

    // Find the target job or internship
    let opportunity = null;
    if (opportunityType === 'job') {
      opportunity = db.getJobById(opportunityId);
    } else {
      opportunity = db.getInternshipById(opportunityId);
    }

    if (!opportunity) {
      return res.status(404).json({ error: 'Opportunity not found or no longer available.' });
    }

    // Determine Resume URL
    let resumeUrl = req.user.resumeUrl || '';
    let resumeOriginalName = req.user.resumeName || 'Student_Resume.pdf';

    if (req.file) {
      resumeUrl = `/uploads/resumes/${req.file.filename}`;
      resumeOriginalName = req.file.originalname;
      // also update user's profile with this uploaded resume
      db.updateUser(req.user.id, { resumeUrl, resumeName: resumeOriginalName });
    }

    if (!resumeUrl) {
      return res.status(400).json({ error: 'Please upload a resume or have one saved in your profile.' });
    }

    // Parse skills
    const parsedSkills = Array.isArray(studentSkills)
      ? studentSkills
      : (studentSkills ? studentSkills.split(',').map(s => s.trim()).filter(Boolean) : (req.user.skills || []));

    const application = db.createApplication({
      opportunityId,
      opportunityType,
      opportunityTitle: opportunity.title,
      company: opportunity.company,
      studentId: req.user.id,
      studentName: studentName || req.user.name,
      studentEmail: studentEmail || req.user.email,
      studentPhone: studentPhone || req.user.phone || '',
      studentBranch: studentBranch || req.user.branch || 'Other',
      studentCollege: studentCollege || req.user.college || '',
      studentDegree: studentDegree || req.user.degree || 'B.Tech',
      studentAcademicYear: studentAcademicYear || req.user.academicYear || '4th Year',
      studentSkills: parsedSkills,
      resumeUrl,
      resumeOriginalName,
      coverLetter: coverLetter || ''
    });

    // Send confirmation notification to the student
    db.createNotification({
      userId: req.user.id,
      title: `Application Confirmed (${application.id})`,
      message: `Your application for ${opportunity.title} at ${opportunity.company} has been received with Application ID ${application.id}. Track progress in your dashboard.`,
      type: 'status_update',
      link: '/applications'
    });

    // Send notification to the recruiter
    if (opportunity.postedBy) {
      db.createNotification({
        userId: opportunity.postedBy,
        title: `New Candidate: ${application.studentName} (${application.studentBranch})`,
        message: `${application.studentName} applied for ${opportunity.title}. Application ID: ${application.id}.`,
        type: 'application_received',
        link: '/recruiter'
      });
    }

    res.status(201).json({
      message: 'Application submitted successfully!',
      application
    });
  } catch (err) {
    console.error('Error in application submission:', err);
    res.status(500).json({ error: 'Failed to submit application.' });
  }
});

// Student's submitted applications
app.get('/api/applications/my', authMiddleware, (req, res) => {
  const applications = db.getApplications({ studentId: req.user.id });
  res.json(applications);
});

// Recruiter / Admin applications
app.get('/api/applications/recruiter', authMiddleware, (req, res) => {
  if (req.user.role === 'student') {
    return res.status(403).json({ error: 'Access restricted to recruiters and administrators.' });
  }

  const { status, opportunityId } = req.query;
  const filters = {
    status,
    opportunityId
  };

  // If recruiter, filter by their posted jobs; if admin, show all
  if (req.user.role === 'recruiter') {
    filters.recruiterId = req.user.id;
  }

  const applications = db.getApplications(filters);
  res.json(applications);
});

// Single application details
app.get('/api/applications/:id', authMiddleware, (req, res) => {
  const appItem = db.getApplicationById(req.params.id);
  if (!appItem) return res.status(404).json({ error: 'Application not found' });

  // Verification
  if (req.user.role === 'student' && appItem.studentId !== req.user.id) {
    return res.status(403).json({ error: 'Unauthorized to view this application' });
  }

  res.json(appItem);
});

// Update Application Status (Recruiter / Admin)
app.patch('/api/applications/:id/status', authMiddleware, (req, res) => {
  try {
    if (req.user.role !== 'recruiter' && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Only recruiters and administrators can update application statuses.' });
    }

    const { status, note, interviewDetails } = req.body;
    const validStatuses = ['Applied', 'Under Review', 'Shortlisted', 'Interview Scheduled', 'Selected', 'Rejected'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
    }

    const updated = db.updateApplicationStatus(req.params.id, status, note, interviewDetails);
    if (!updated) return res.status(404).json({ error: 'Application not found' });

    // Send automatic notification to student
    let notifTitle = `Application Status Update: ${status}`;
    let notifMsg = `Your application (${updated.id}) for ${updated.opportunityTitle} at ${updated.company} has been updated to "${status}".`;

    if (status === 'Interview Scheduled' && interviewDetails) {
      notifTitle = `Interview Invitation: ${updated.opportunityTitle}`;
      notifMsg = `Great news! An interview has been scheduled for ${interviewDetails.date || 'upcoming date'} at ${interviewDetails.time || 'scheduled time'} via ${interviewDetails.mode || 'video call'}.`;
    } else if (status === 'Selected') {
      notifTitle = `🎉 Congratulations! Selected for ${updated.opportunityTitle}`;
      notifMsg = `You have been selected for ${updated.opportunityTitle} at ${updated.company}! Check your email and dashboard for offer details.`;
    }

    db.createNotification({
      userId: updated.studentId,
      title: notifTitle,
      message: notifMsg,
      type: status === 'Interview Scheduled' ? 'interview_invite' : 'status_update',
      link: '/applications'
    });

    res.json(updated);
  } catch (err) {
    console.error('Status update error:', err);
    res.status(500).json({ error: 'Failed to update application status.' });
  }
});

// ==========================================
// 6. SAVED OPPORTUNITIES ROUTES
// ==========================================
app.get('/api/saved', authMiddleware, (req, res) => {
  const saved = db.getSavedItems(req.user.id);
  res.json(saved);
});

app.post('/api/saved/toggle', authMiddleware, (req, res) => {
  const { opportunityId, opportunityType } = req.body;
  if (!opportunityId || !opportunityType) {
    return res.status(400).json({ error: 'Opportunity ID and type are required' });
  }
  const result = db.toggleSave(req.user.id, opportunityId, opportunityType);
  res.json(result);
});

// ==========================================
// 7. NOTIFICATIONS ROUTES
// ==========================================
app.get('/api/notifications', authMiddleware, (req, res) => {
  const notifs = db.getNotifications(req.user.id);
  res.json(notifs);
});

app.patch('/api/notifications/:id/read', authMiddleware, (req, res) => {
  const updated = db.markNotificationRead(req.params.id);
  res.json(updated);
});

app.patch('/api/notifications/read-all', authMiddleware, (req, res) => {
  db.markAllNotificationsRead(req.user.id);
  res.json({ success: true });
});

// ==========================================
// 8. ADMIN & METRICS ROUTES
// ==========================================
app.get('/api/admin/metrics', authMiddleware, (req, res) => {
  if (req.user.role !== 'admin' && req.user.role !== 'recruiter') {
    return res.status(403).json({ error: 'Admin access required.' });
  }
  res.json(db.getMetrics());
});

app.get('/api/admin/users', authMiddleware, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required.' });
  }
  const safeUsers = db.getUsers().map(({ password, ...u }) => u);
  res.json(safeUsers);
});

app.patch('/api/admin/users/:id/toggle', authMiddleware, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required.' });
  }
  const user = db.getUserById(req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  const newStatus = user.status === 'active' ? 'suspended' : 'active';
  const updated = db.updateUser(req.params.id, { status: newStatus });
  const { password: _, ...safeUser } = updated;
  res.json(safeUser);
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`CareerNexus backend server is running on port ${PORT}`);
});
