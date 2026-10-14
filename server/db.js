const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, 'data.json');
const UPLOADS_DIR = path.join(__dirname, 'uploads', 'resumes');

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Initial seed data with branches and realistic opportunities
const getInitialData = () => {
  const branches = [
    { id: 'CSE', name: 'Computer Science Engineering (CSE)', icon: 'Cpu', color: '#6366f1', description: 'Software dev, cloud, systems, cyber security' },
    { id: 'IT', name: 'Information Technology (IT)', icon: 'Globe', color: '#3b82f6', description: 'Web, networking, enterprise IT, DevOps' },
    { id: 'AI/ML', name: 'Artificial Intelligence & Machine Learning (AI/ML)', icon: 'Brain', color: '#8b5cf6', description: 'Deep learning, NLP, computer vision, LLMs' },
    { id: 'AI/DS', name: 'Artificial Intelligence & Data Science (AI/DS)', icon: 'Database', color: '#ec4899', description: 'Big data, predictive modeling, business intelligence' },
    { id: 'ECE', name: 'Electronics & Communication Engineering (ECE)', icon: 'Radio', color: '#f59e0b', description: 'VLSI, embedded systems, IoT, telecom' },
    { id: 'EEE', name: 'Electrical & Electronics Engineering (EEE)', icon: 'Zap', color: '#10b981', description: 'Power systems, smart grids, renewable energy, control systems' },
    { id: 'Mechanical', name: 'Mechanical Engineering', icon: 'Settings', color: '#ef4444', description: 'CAD/CAM, robotics, thermal, automotive, manufacturing' },
    { id: 'Civil', name: 'Civil Engineering', icon: 'Compass', color: '#14b8a6', description: 'Structural, BIM, construction, geotechnical, transportation' },
    { id: 'Chemical', name: 'Chemical Engineering', icon: 'FlaskConical', color: '#06b6d4', description: 'Petrochemical, process design, pharmaceuticals, materials' },
    { id: 'Biotechnology', name: 'Biotechnology', icon: 'Dna', color: '#84cc16', description: 'Bioinformatics, biopharma, genetic engineering, clinical' },
    { id: 'Other', name: 'Other branches', icon: 'Layers', color: '#64748b', description: 'Interdisciplinary, industrial, production, metallurgy' }
  ];

  const users = [
    {
      id: 'usr_student_1',
      role: 'student',
      name: 'Aditya Sharma',
      email: 'aditya.student@nexus.edu',
      password: 'password123',
      college: 'National Institute of Technology, Trichy',
      degree: 'B.Tech',
      academicYear: '4th Year',
      branch: 'CSE',
      skills: ['React', 'Node.js', 'Python', 'AWS', 'Docker', 'PostgreSQL', 'Git'],
      phone: '+91 98765 43210',
      bio: 'Enthusiastic full-stack engineer and open source contributor passionate about high performance scalable web applications.',
      resumeUrl: '/uploads/resumes/sample-resume-aditya.pdf',
      resumeName: 'Aditya_Sharma_Resume.pdf',
      status: 'active',
      createdAt: '2026-09-01T10:00:00.000Z'
    },
    {
      id: 'usr_student_2',
      role: 'student',
      name: 'Pooja Iyer',
      email: 'pooja.ece@nexus.edu',
      password: 'password123',
      college: 'Indian Institute of Technology, Madras',
      degree: 'B.Tech',
      academicYear: '3rd Year',
      branch: 'ECE',
      skills: ['Verilog', 'Embedded C', 'MATLAB', 'ARM Cortex', 'IoT', 'PCB Design'],
      phone: '+91 98765 12345',
      bio: 'Hardware-software co-design enthusiast with hands-on experience in FPGA prototyping and microcontroller firmware.',
      resumeUrl: '/uploads/resumes/sample-resume-pooja.pdf',
      resumeName: 'Pooja_Iyer_Resume.pdf',
      status: 'active',
      createdAt: '2026-09-10T11:00:00.000Z'
    },
    {
      id: 'usr_student_3',
      role: 'student',
      name: 'Vikram Joshi',
      email: 'vikram.mech@nexus.edu',
      password: 'password123',
      college: 'Birla Institute of Technology and Science, Pilani',
      degree: 'B.E.',
      academicYear: '4th Year',
      branch: 'Mechanical',
      skills: ['SolidWorks', 'ANSYS FEA', 'AutoCAD', 'Python', 'Robotics', 'Thermodynamics'],
      phone: '+91 98450 67890',
      bio: 'Aspiring mechanical design engineer specializing in CAE simulations and additive manufacturing systems.',
      resumeUrl: '',
      resumeName: '',
      status: 'active',
      createdAt: '2026-09-15T09:30:00.000Z'
    },
    {
      id: 'usr_recruiter_1',
      role: 'recruiter',
      name: 'Sarah Jenkins',
      email: 'recruiter@nexatech.com',
      password: 'password123',
      companyName: 'NexaTech Innovations',
      companyWebsite: 'https://nexatech.example.com',
      phone: '+91 91234 56789',
      bio: 'Lead Technical Talent Partner at NexaTech. Hiring top engineering minds across India.',
      status: 'active',
      createdAt: '2026-08-15T08:00:00.000Z'
    },
    {
      id: 'usr_recruiter_2',
      role: 'recruiter',
      name: 'Karan Mehra',
      email: 'karan@deepvision.ai',
      password: 'password123',
      companyName: 'DeepVision AI Labs',
      companyWebsite: 'https://deepvision.example.ai',
      phone: '+91 98111 22334',
      bio: 'Head of People Operations at DeepVision AI Labs.',
      status: 'active',
      createdAt: '2026-08-20T10:00:00.000Z'
    },
    {
      id: 'usr_admin_1',
      role: 'admin',
      name: 'Campus Director (Admin)',
      email: 'admin@careernexus.edu',
      password: 'adminpassword',
      phone: '+91 99999 00000',
      bio: 'Platform Administrator & Placement Cell Coordinator.',
      status: 'active',
      createdAt: '2026-08-01T00:00:00.000Z'
    }
  ];

  const jobs = [
    {
      id: 'job_1',
      title: 'Full Stack Software Engineer',
      company: 'NexaTech Innovations',
      logo: 'NT',
      logoColor: '#6366f1',
      description: 'Join our flagship core engineering team building scalable microservices and lightning-fast web applications. You will collaborate with product designers, architect cloud components, and ship mission-critical code to millions of end-users worldwide.',
      responsibilities: [
        'Design, build, and maintain efficient, reusable, and reliable front-end & back-end code',
        'Integrate user-facing elements with server-side logic and cloud databases',
        'Participate in sprint planning, code reviews, and architecture discussions',
        'Optimize applications for maximum speed, security, and scalability'
      ],
      requiredSkills: ['React', 'Node.js', 'PostgreSQL', 'Docker', 'RESTful APIs', 'Git'],
      eligibleBranches: ['CSE', 'IT', 'AI/ML', 'AI/DS'],
      qualifications: 'B.Tech / B.E. in CSE, IT, or allied computing disciplines with minimum 65% aggregate.',
      experienceLevel: 'Fresher',
      location: 'Bangalore, Karnataka',
      workMode: 'Hybrid',
      salary: '₹12,00,000 - ₹16,00,000 / annum',
      employmentType: 'Full-time',
      deadline: '2026-11-30',
      postedBy: 'usr_recruiter_1',
      status: 'active',
      applicantsCount: 4,
      createdAt: '2026-10-01T08:00:00.000Z'
    },
    {
      id: 'job_2',
      title: 'Machine Learning & NLP Engineer',
      company: 'DeepVision AI Labs',
      logo: 'DV',
      logoColor: '#8b5cf6',
      description: 'Develop next-generation generative AI solutions and natural language understanding models. We are seeking talented engineers who understand transformer architectures, fine-tuning, and scalable inference deployment.',
      responsibilities: [
        'Research, train, and deploy transformer-based LLMs and computer vision models',
        'Fine-tune multimodal models on domain-specific corpora using PyTorch',
        'Build high-throughput inference endpoints with ONNX / TensorRT',
        'Conduct benchmark experiments and publish empirical performance reports'
      ],
      requiredSkills: ['Python', 'PyTorch', 'Transformers', 'NLP', 'TensorFlow', 'MLOps'],
      eligibleBranches: ['AI/ML', 'AI/DS', 'CSE', 'IT'],
      qualifications: 'B.Tech / M.Tech in AI/ML, AI/DS, or CSE with strong foundational coursework in linear algebra and deep learning.',
      experienceLevel: 'Fresher',
      location: 'Hyderabad, Telangana',
      workMode: 'Remote',
      salary: '₹14,50,000 - ₹19,00,000 / annum',
      employmentType: 'Full-time',
      deadline: '2026-12-15',
      postedBy: 'usr_recruiter_2',
      status: 'active',
      applicantsCount: 6,
      createdAt: '2026-10-02T09:15:00.000Z'
    },
    {
      id: 'job_3',
      title: 'Embedded Systems & IoT Firmware Engineer',
      company: 'SiliconSense Technologies',
      logo: 'SS',
      logoColor: '#f59e0b',
      description: 'SiliconSense is pioneering industrial smart meters and connected automotive sensors. We are hiring proactive embedded developers to write low-level firmware, configure communication protocols (CAN, SPI, I2C), and optimize RTOS task execution.',
      responsibilities: [
        'Write efficient C/C++ firmware for ARM Cortex-M microcontrollers and RISC-V targets',
        'Interface hardware peripherals: SPI, I2C, UART, ADC, and BLE/Zigbee radio modules',
        'Debug boards using digital oscilloscopes, logic analyzers, and JTAG emulators',
        'Perform static analysis, memory profiling, and MISRA-C compliance checks'
      ],
      requiredSkills: ['Embedded C', 'ARM Cortex', 'FreeRTOS', 'SPI/I2C/CAN', 'PCB Debugging'],
      eligibleBranches: ['ECE', 'EEE', 'CSE'],
      qualifications: 'B.Tech in Electronics & Communication or Electrical Engineering with solid understanding of microcontrollers.',
      experienceLevel: 'Fresher',
      location: 'Pune, Maharashtra',
      workMode: 'Onsite',
      salary: '₹8,50,000 - ₹12,00,000 / annum',
      employmentType: 'Full-time',
      deadline: '2026-11-25',
      postedBy: 'usr_recruiter_1',
      status: 'active',
      applicantsCount: 3,
      createdAt: '2026-10-03T11:30:00.000Z'
    },
    {
      id: 'job_4',
      title: 'Mechanical Design & CAE Simulation Engineer',
      company: 'AeroDyn Dynamics',
      logo: 'AD',
      logoColor: '#ef4444',
      description: 'Contribute to lightweight chassis design, structural stress evaluations, and aerodynamic simulations for electric vehicle systems. Hands-on experience with parametric CAD and FEA tools is strongly required.',
      responsibilities: [
        'Generate detailed 3D CAD assemblies and 2D fabrication drawings in SolidWorks / CATIA',
        'Perform structural, modal, and thermal simulations in ANSYS Workbench',
        'Coordinate with toolmakers and stamping suppliers for DFM / DFA optimization',
        'Analyze prototype failure modes and execute mechanical testing rigs'
      ],
      requiredSkills: ['SolidWorks', 'ANSYS FEA', 'GD&T', 'AutoCAD', 'Material Selection'],
      eligibleBranches: ['Mechanical', 'Other'],
      qualifications: 'B.Tech / B.E. in Mechanical Engineering with certified CAD/CAE coursework or project portfolio.',
      experienceLevel: 'Fresher',
      location: 'Chennai, Tamil Nadu',
      workMode: 'Onsite',
      salary: '₹7,50,000 - ₹10,50,000 / annum',
      employmentType: 'Full-time',
      deadline: '2026-12-05',
      postedBy: 'usr_recruiter_1',
      status: 'active',
      applicantsCount: 2,
      createdAt: '2026-10-04T14:00:00.000Z'
    },
    {
      id: 'job_5',
      title: 'Structural BIM & Infrastructure Engineer',
      company: 'Apex Infrastructure & Metro Works',
      logo: 'AI',
      logoColor: '#14b8a6',
      description: 'Lead digital structural modeling and coordination for urban metro viaducts and smart transit terminals. Collaborate with structural architects, MEP engineers, and site coordinators using modern BIM standards.',
      responsibilities: [
        'Develop parametric 3D structural models in Autodesk Revit and Navisworks',
        'Conduct structural analysis and load calculation according to IS / Eurocodes',
        'Perform clash detection between structural elements and MEP conduits',
        'Prepare bar bending schedules (BBS) and structural shop drawings'
      ],
      requiredSkills: ['Autodesk Revit', 'STAAD.Pro', 'AutoCAD', 'BIM Coordination', 'Structural Analysis'],
      eligibleBranches: ['Civil'],
      qualifications: 'B.Tech in Civil Engineering with strong proficiency in STAAD.Pro and Revit.',
      experienceLevel: 'Fresher',
      location: 'Mumbai, Maharashtra',
      workMode: 'Hybrid',
      salary: '₹7,00,000 - ₹9,50,000 / annum',
      employmentType: 'Full-time',
      deadline: '2026-11-20',
      postedBy: 'usr_recruiter_2',
      status: 'active',
      applicantsCount: 1,
      createdAt: '2026-10-05T10:00:00.000Z'
    },
    {
      id: 'job_6',
      title: 'Process Automation & Control Engineer',
      company: 'PetroCore Energy & Chemicals',
      logo: 'PC',
      logoColor: '#06b6d4',
      description: 'Support continuous refinery optimization, chemical reactor control loops, and environmental compliance systems. Excellent exposure to P&ID diagrams, mass-energy balances, and Aspen Plus simulations.',
      responsibilities: [
        'Model continuous distillation columns and kinetic reactor units in Aspen Plus / HYSYS',
        'Design control schematics, safety interlocks, and HAZOP documentation',
        'Monitor operational KPIs and reduce energy footprint across heat exchangers',
        'Collaborate with DCS engineers to tune PID controllers'
      ],
      requiredSkills: ['Aspen Plus', 'P&ID Interpretation', 'Process Simulation', 'Chemical Kinetics', 'MATLAB'],
      eligibleBranches: ['Chemical', 'Mechanical'],
      qualifications: 'B.Tech / B.E. in Chemical Engineering or Petrochemical Engineering.',
      experienceLevel: '0-1 Years',
      location: 'Vadodara, Gujarat',
      workMode: 'Onsite',
      salary: '₹8,00,000 - ₹11,00,000 / annum',
      employmentType: 'Full-time',
      deadline: '2026-12-10',
      postedBy: 'usr_recruiter_1',
      status: 'active',
      applicantsCount: 2,
      createdAt: '2026-10-06T12:00:00.000Z'
    },
    {
      id: 'job_7',
      title: 'Bioinformatics & Computational Biologist',
      company: 'GeneTech Therapeutics',
      logo: 'GT',
      logoColor: '#84cc16',
      description: 'Harness high-throughput genomic data, single-cell RNA-sequencing pipelines, and protein-ligand docking tools to discover therapeutic molecular targets for autoimmune oncology therapies.',
      responsibilities: [
        'Analyze NGS genomic data, variant calling, and transcriptomic datasets',
        'Execute molecular docking simulations and molecular dynamics trajectories (GROMACS)',
        'Maintain automated bioinformatic workflows using Nextflow and Docker',
        'Coordinate with wet-lab assays to validate target gene candidates'
      ],
      requiredSkills: ['Python / R', 'Bioinformatics', 'NGS Analysis', 'Molecular Docking', 'Biostatistics'],
      eligibleBranches: ['Biotechnology', 'Chemical', 'AI/ML', 'AI/DS'],
      qualifications: 'B.Tech / M.Tech in Biotechnology, Bioinformatics, or Computational Life Sciences.',
      experienceLevel: 'Fresher',
      location: 'Bangalore, Karnataka',
      workMode: 'Hybrid',
      salary: '₹9,00,000 - ₹13,00,000 / annum',
      employmentType: 'Full-time',
      deadline: '2026-12-20',
      postedBy: 'usr_recruiter_2',
      status: 'active',
      applicantsCount: 3,
      createdAt: '2026-10-07T08:30:00.000Z'
    },
    {
      id: 'job_8',
      title: 'Power Systems & Renewable Energy Specialist',
      company: 'VoltGrid CleanTech',
      logo: 'VG',
      logoColor: '#10b981',
      description: 'Work on smart microgrids, solar inverter integrations, battery energy storage systems (BESS), and high-voltage grid stability models for national transmission networks.',
      responsibilities: [
        'Simulate grid transients and power flow dynamics using PSCAD / ETAP',
        'Design protection relay schemes and harmonic mitigation filters for solar farms',
        'Perform power quality assessments and grid code compliance verifications',
        'Evaluate battery charging telemetry and energy dispatch algorithms'
      ],
      requiredSkills: ['MATLAB/Simulink', 'ETAP', 'Power Electronics', 'Renewable Integration', 'Protection Relays'],
      eligibleBranches: ['EEE', 'ECE'],
      qualifications: 'B.Tech in Electrical & Electronics Engineering with minimum 7.0 CGPA.',
      experienceLevel: 'Fresher',
      location: 'Noida, Uttar Pradesh',
      workMode: 'Onsite',
      salary: '₹8,20,000 - ₹11,50,000 / annum',
      employmentType: 'Full-time',
      deadline: '2026-12-01',
      postedBy: 'usr_recruiter_1',
      status: 'active',
      applicantsCount: 1,
      createdAt: '2026-10-08T09:00:00.000Z'
    },
    {
      id: 'job_9',
      title: 'Graduate Technical Trainee (Cross-Discipline)',
      company: 'Tata Advanced Systems',
      logo: 'TA',
      logoColor: '#2563eb',
      description: 'Prestigious fast-track graduate engineer trainee program spanning robotics, embedded controllers, aerospace structures, quality engineering, and digital manufacturing.',
      responsibilities: [
        'Rotate across precision manufacturing, hardware QA, systems engineering, and IT divisions',
        'Solve real-world industrial optimization problems during 6-month modular rotations',
        'Undergo hands-on leadership training and direct executive mentorship',
        'Contribute to ISO-9001 and AS9100 aerospace quality verification'
      ],
      requiredSkills: ['Problem Solving', 'Engineering Fundamentals', 'Python / C', 'Data Analysis', 'Technical Documentation'],
      eligibleBranches: ['All'],
      qualifications: 'B.Tech / B.E. in ANY engineering discipline with first class or distinction.',
      experienceLevel: 'Fresher',
      location: 'Hyderabad, Telangana',
      workMode: 'Onsite',
      salary: '₹9,50,000 - ₹12,00,000 / annum',
      employmentType: 'Full-time',
      deadline: '2026-12-31',
      postedBy: 'usr_recruiter_1',
      status: 'active',
      applicantsCount: 8,
      createdAt: '2026-10-09T07:00:00.000Z'
    }
  ];

  const internships = [
    {
      id: 'intern_1',
      title: 'Frontend React & UI/UX Developer Intern',
      company: 'WebCraft Studios',
      logo: 'WC',
      logoColor: '#6366f1',
      description: 'Create ultra-smooth responsive web interfaces, interactive dashboards, and design component libraries using React, TypeScript, and modern CSS. You will collaborate with product designers and senior engineers.',
      responsibilities: [
        'Build modular, accessible UI components in React and CSS',
        'Connect front-end state with REST & GraphQL APIs',
        'Optimize client-side performance, Core Web Vitals, and responsive layouts',
        'Participate in daily standups and weekly design critique sessions'
      ],
      eligibleBranches: ['CSE', 'IT', 'AI/DS', 'ECE'],
      eligibleYears: ['2nd Year', '3rd Year', '4th Year'],
      requiredSkills: ['React', 'JavaScript', 'HTML/CSS', 'Git', 'Responsive Design'],
      duration: '6 Months',
      stipendType: 'Paid',
      stipendAmount: '₹30,000 / month',
      workMode: 'Remote',
      location: 'Remote (Pan India)',
      deadline: '2026-11-20',
      postedBy: 'usr_recruiter_1',
      status: 'active',
      applicantsCount: 5,
      createdAt: '2026-10-01T10:00:00.000Z'
    },
    {
      id: 'intern_2',
      title: 'Data Science & Predictive Analytics Intern',
      company: 'Alpha Insights Group',
      logo: 'AI',
      logoColor: '#8b5cf6',
      description: 'Clean, parse, and analyze multi-terabyte transactional datasets. Build customer churn predictors, time-series forecasting models, and interactive visual reporting dashboards.',
      responsibilities: [
        'Execute exploratory data analysis (EDA) using Pandas, NumPy, and Seaborn',
        'Build and tune gradient boosted decision trees (XGBoost / LightGBM)',
        'Engineer feature pipelines and query relational data with complex SQL',
        'Present actionable data summaries to stakeholders and product leads'
      ],
      eligibleBranches: ['AI/DS', 'AI/ML', 'CSE', 'IT'],
      eligibleYears: ['3rd Year', '4th Year'],
      requiredSkills: ['Python', 'SQL', 'Pandas', 'Scikit-Learn', 'PowerBI'],
      duration: '3 Months',
      stipendType: 'Paid',
      stipendAmount: '₹35,000 / month',
      workMode: 'Hybrid',
      location: 'Bangalore, Karnataka',
      deadline: '2026-11-28',
      postedBy: 'usr_recruiter_2',
      status: 'active',
      applicantsCount: 4,
      createdAt: '2026-10-02T11:00:00.000Z'
    },
    {
      id: 'intern_3',
      title: 'VLSI Chip Verification & FPGA Intern',
      company: 'ChipCraft Semiconductors',
      logo: 'CC',
      logoColor: '#f59e0b',
      description: 'Step into semiconductor chip development! Write SystemVerilog testbenches, perform UVM verification simulations, and assist in synthesis runs for next-generation RISC-V compute cores.',
      responsibilities: [
        'Design directed and constrained-random testbenches in SystemVerilog',
        'Simulate RTL designs in ModelSim / QuestaSim and debug waveform traces',
        'Verify functional and code coverage metrics against specifications',
        'Assist physical design engineers in timing constraint synthesis'
      ],
      eligibleBranches: ['ECE', 'EEE'],
      eligibleYears: ['3rd Year', '4th Year'],
      requiredSkills: ['SystemVerilog', 'Digital Design', 'Verilog', 'FPGA', 'Linux Shell'],
      duration: '6 Months',
      stipendType: 'Paid',
      stipendAmount: '₹32,000 / month',
      workMode: 'Onsite',
      location: 'Bangalore, Karnataka',
      deadline: '2026-12-10',
      postedBy: 'usr_recruiter_1',
      status: 'active',
      applicantsCount: 3,
      createdAt: '2026-10-03T12:00:00.000Z'
    },
    {
      id: 'intern_4',
      title: 'Automotive CAD Modeling & Simulation Intern',
      company: 'TorqueMotors R&D',
      logo: 'TM',
      logoColor: '#ef4444',
      description: 'Assist in designing electric scooter suspension linkages, battery pack thermal enclosures, and ergonomic handlebar brackets using CATIA and SolidWorks.',
      responsibilities: [
        'Model 3D parametric components and generate 2D manufacturing drawings',
        'Perform static linear stress evaluations using ANSYS Mechanical',
        'Assist senior prototype engineers during physical drop and vibration testing',
        'Maintain bill of materials (BOM) and revision logs in PDM'
      ],
      eligibleBranches: ['Mechanical', 'Other'],
      eligibleYears: ['2nd Year', '3rd Year', '4th Year'],
      requiredSkills: ['SolidWorks', 'AutoCAD', 'ANSYS', 'GD&T Basics'],
      duration: '4 Months',
      stipendType: 'Paid',
      stipendAmount: '₹22,000 / month',
      workMode: 'Onsite',
      location: 'Pune, Maharashtra',
      deadline: '2026-11-25',
      postedBy: 'usr_recruiter_1',
      status: 'active',
      applicantsCount: 2,
      createdAt: '2026-10-04T13:00:00.000Z'
    },
    {
      id: 'intern_5',
      title: 'Civil Site Survey & Smart Construction Intern',
      company: 'BuildCon Infrastructure',
      logo: 'BC',
      logoColor: '#14b8a6',
      description: 'Hands-on site engineering internship covering digital total station surveys, concrete mix design testing, quality audits, and contractor coordination for high-rise commercial structures.',
      responsibilities: [
        'Assist site project managers in day-to-day quality inspection and concrete cube testing',
        'Review architectural drawings against on-site structural execution',
        'Maintain site measurement books and quantity surveying spreadsheets',
        'Observe safety protocol compliance and draft daily site progress logs'
      ],
      eligibleBranches: ['Civil'],
      eligibleYears: ['3rd Year', '4th Year'],
      requiredSkills: ['AutoCAD', 'Quantity Surveying', 'Site Planning', 'MS Excel'],
      duration: '3 Months',
      stipendType: 'Paid',
      stipendAmount: '₹18,000 / month',
      workMode: 'Onsite',
      location: 'Hyderabad, Telangana',
      deadline: '2026-11-30',
      postedBy: 'usr_recruiter_2',
      status: 'active',
      applicantsCount: 2,
      createdAt: '2026-10-05T14:30:00.000Z'
    },
    {
      id: 'intern_6',
      title: 'Bioprocess & Fermentation R&D Intern',
      company: 'SynBio Labs',
      logo: 'SB',
      logoColor: '#84cc16',
      description: 'Assist in optimizing microbial fermentation runs, media formulation, down-stream protein purification (HPLC, FPLC), and assay quantification for recombinant enzymes.',
      responsibilities: [
        'Prepare microbial culture media, inoculate shake flasks, and monitor optical density',
        'Operate benchtop fermenters and log pH, dissolved oxygen, and agitation levels',
        'Perform SDS-PAGE electrophoresis and Bradford protein quantitation',
        'Maintain GLP laboratory notebooks and follow biosafety standards'
      ],
      eligibleBranches: ['Biotechnology', 'Chemical'],
      eligibleYears: ['3rd Year', '4th Year'],
      requiredSkills: ['Microbiology', 'Fermentation Basics', 'SDS-PAGE', 'Aseptic Technique'],
      duration: '6 Months',
      stipendType: 'Paid',
      stipendAmount: '₹24,000 / month',
      workMode: 'Onsite',
      location: 'Ahmedabad, Gujarat',
      deadline: '2026-12-15',
      postedBy: 'usr_recruiter_2',
      status: 'active',
      applicantsCount: 2,
      createdAt: '2026-10-06T15:00:00.000Z'
    },
    {
      id: 'intern_7',
      title: 'Cybersecurity Analyst & Threat Hunting Intern',
      company: 'ShieldSec CyberGuard',
      logo: 'SG',
      logoColor: '#0ea5e9',
      description: 'Assist our SOC team in analyzing network traffic captures (Wireshark), investigating vulnerability scans, tracking CVE databases, and crafting penetration test reports.',
      responsibilities: [
        'Review SIEM log alerts and identify anomalous network behaviors',
        'Perform basic vulnerability assessments using Nessus and Nmap',
        'Draft threat remediation guidance for engineering teams',
        'Participate in internal capture-the-flag (CTF) security exercises'
      ],
      eligibleBranches: ['CSE', 'IT', 'AI/DS'],
      eligibleYears: ['2nd Year', '3rd Year', '4th Year'],
      requiredSkills: ['Linux', 'Networking (TCP/IP)', 'Wireshark', 'Python Scripting', 'Security Fundamentals'],
      duration: '3 Months',
      stipendType: 'Paid',
      stipendAmount: '₹28,000 / month',
      workMode: 'Remote',
      location: 'Remote (Pan India)',
      deadline: '2026-11-22',
      postedBy: 'usr_recruiter_1',
      status: 'active',
      applicantsCount: 6,
      createdAt: '2026-10-07T16:00:00.000Z'
    },
    {
      id: 'intern_8',
      title: 'Smart Energy & Battery Management Intern',
      company: 'EcoVolt Power Systems',
      logo: 'EV',
      logoColor: '#10b981',
      description: 'Assist in testing Lithium-ion battery pack telemetry, designing balancing circuits, and writing state-of-charge (SoC) estimation algorithms for solar storage.',
      responsibilities: [
        'Test battery cell charge/discharge curves in temperature-controlled chambers',
        'Simulate cell balancing circuits in MATLAB Simulink and LTSpice',
        'Log thermal telemetry and evaluate passive heat dissipation fins',
        'Assist with assembly of test prototype BMS boards'
      ],
      eligibleBranches: ['EEE', 'ECE', 'Mechanical'],
      eligibleYears: ['3rd Year', '4th Year'],
      requiredSkills: ['Circuit Design', 'MATLAB', 'Battery Chemistry Basics', 'Multimeter / Oscilloscope'],
      duration: '6 Months',
      stipendType: 'Paid',
      stipendAmount: '₹25,000 / month',
      workMode: 'Hybrid',
      location: 'Bengaluru, Karnataka',
      deadline: '2026-12-05',
      postedBy: 'usr_recruiter_1',
      status: 'active',
      applicantsCount: 3,
      createdAt: '2026-10-08T11:00:00.000Z'
    }
  ];

  const applications = [
    {
      id: 'APP-2026-84102',
      opportunityId: 'job_1',
      opportunityType: 'job',
      opportunityTitle: 'Full Stack Software Engineer',
      company: 'NexaTech Innovations',
      studentId: 'usr_student_1',
      studentName: 'Aditya Sharma',
      studentEmail: 'aditya.student@nexus.edu',
      studentPhone: '+91 98765 43210',
      studentBranch: 'CSE',
      studentCollege: 'National Institute of Technology, Trichy',
      studentDegree: 'B.Tech',
      studentAcademicYear: '4th Year',
      studentSkills: ['React', 'Node.js', 'Python', 'AWS', 'Docker', 'PostgreSQL'],
      resumeUrl: '/uploads/resumes/sample-resume-aditya.pdf',
      resumeOriginalName: 'Aditya_Sharma_Resume.pdf',
      coverLetter: 'I am excited to apply for the Full Stack Engineer role at NexaTech. With 2 years of active MERN stack and cloud experience, I look forward to contributing to your microservices architecture.',
      status: 'Shortlisted',
      statusHistory: [
        { status: 'Applied', date: '2026-10-02T10:00:00.000Z', note: 'Application submitted successfully.' },
        { status: 'Under Review', date: '2026-10-04T14:30:00.000Z', note: 'Resume reviewed by technical hiring panel.' },
        { status: 'Shortlisted', date: '2026-10-07T09:15:00.000Z', note: 'Shortlisted for round 1 technical interview.' }
      ],
      interviewDetails: {
        date: '2026-10-18',
        time: '14:00 IST',
        mode: 'Google Meet',
        link: 'https://meet.google.com/abc-wxyz-nex',
        note: 'Please be ready with a coding environment and share your screen.'
      },
      appliedAt: '2026-10-02T10:00:00.000Z'
    },
    {
      id: 'APP-2026-92814',
      opportunityId: 'intern_1',
      opportunityType: 'internship',
      opportunityTitle: 'Frontend React & UI/UX Developer Intern',
      company: 'WebCraft Studios',
      studentId: 'usr_student_1',
      studentName: 'Aditya Sharma',
      studentEmail: 'aditya.student@nexus.edu',
      studentPhone: '+91 98765 43210',
      studentBranch: 'CSE',
      studentCollege: 'National Institute of Technology, Trichy',
      studentDegree: 'B.Tech',
      studentAcademicYear: '4th Year',
      studentSkills: ['React', 'JavaScript', 'HTML/CSS', 'Git'],
      resumeUrl: '/uploads/resumes/sample-resume-aditya.pdf',
      resumeOriginalName: 'Aditya_Sharma_Resume.pdf',
      coverLetter: 'I love crafting pixel-perfect, accessible user interfaces and animations. Looking forward to learning and delivering with the WebCraft team!',
      status: 'Interview Scheduled',
      statusHistory: [
        { status: 'Applied', date: '2026-10-03T11:00:00.000Z', note: 'Application submitted.' },
        { status: 'Under Review', date: '2026-10-05T12:00:00.000Z', note: 'Profile cleared screening.' },
        { status: 'Shortlisted', date: '2026-10-06T15:00:00.000Z', note: 'Selected for direct interview.' },
        { status: 'Interview Scheduled', date: '2026-10-08T10:00:00.000Z', note: 'Technical discussion scheduled.' }
      ],
      interviewDetails: {
        date: '2026-10-15',
        time: '16:30 IST',
        mode: 'Zoom',
        link: 'https://zoom.us/j/9876543210',
        note: 'Portfolio walkthrough and live React coding challenge.'
      },
      appliedAt: '2026-10-03T11:00:00.000Z'
    },
    {
      id: 'APP-2026-73591',
      opportunityId: 'job_3',
      opportunityType: 'job',
      opportunityTitle: 'Embedded Systems & IoT Firmware Engineer',
      company: 'SiliconSense Technologies',
      studentId: 'usr_student_2',
      studentName: 'Pooja Iyer',
      studentEmail: 'pooja.ece@nexus.edu',
      studentPhone: '+91 98765 12345',
      studentBranch: 'ECE',
      studentCollege: 'Indian Institute of Technology, Madras',
      studentDegree: 'B.Tech',
      studentAcademicYear: '3rd Year',
      studentSkills: ['Embedded C', 'ARM Cortex', 'FreeRTOS', 'SPI/I2C/CAN'],
      resumeUrl: '/uploads/resumes/sample-resume-pooja.pdf',
      resumeOriginalName: 'Pooja_Iyer_Resume.pdf',
      coverLetter: 'Passionate about firmware reliability and real-time scheduling. Excited to contribute to SiliconSense sensor architectures.',
      status: 'Under Review',
      statusHistory: [
        { status: 'Applied', date: '2026-10-05T09:00:00.000Z', note: 'Application submitted.' },
        { status: 'Under Review', date: '2026-10-07T11:00:00.000Z', note: 'Under technical review.' }
      ],
      appliedAt: '2026-10-05T09:00:00.000Z'
    }
  ];

  const saved_items = [
    { id: 'save_1', userId: 'usr_student_1', opportunityId: 'job_2', opportunityType: 'job', savedAt: '2026-10-05T12:00:00.000Z' },
    { id: 'save_2', userId: 'usr_student_1', opportunityId: 'intern_7', opportunityType: 'internship', savedAt: '2026-10-06T15:30:00.000Z' }
  ];

  const notifications = [
    {
      id: 'notif_1',
      userId: 'usr_student_1',
      title: 'Interview Scheduled: Frontend React Intern',
      message: 'WebCraft Studios has scheduled your technical interview for Oct 15, 2026 at 16:30 IST. Check details in your dashboard.',
      type: 'interview_invite',
      isRead: false,
      link: '/applications',
      createdAt: '2026-10-08T10:00:00.000Z'
    },
    {
      id: 'notif_2',
      userId: 'usr_student_1',
      title: 'Status Update: Full Stack Software Engineer',
      message: 'Your application APP-2026-84102 at NexaTech Innovations has been moved to Shortlisted!',
      type: 'status_update',
      isRead: false,
      link: '/applications',
      createdAt: '2026-10-07T09:15:00.000Z'
    },
    {
      id: 'notif_3',
      userId: 'usr_student_1',
      title: 'New CSE Opportunity Posted',
      message: 'Tata Advanced Systems posted a Graduate Technical Trainee role open for CSE students.',
      type: 'new_match',
      isRead: true,
      link: '/jobs',
      createdAt: '2026-10-09T07:05:00.000Z'
    },
    {
      id: 'notif_4',
      userId: 'usr_recruiter_1',
      title: 'New Application Received',
      message: 'Aditya Sharma (CSE) submitted an application for Full Stack Software Engineer.',
      type: 'application_received',
      isRead: false,
      link: '/recruiter',
      createdAt: '2026-10-02T10:00:00.000Z'
    }
  ];

  return {
    branches,
    users,
    jobs,
    internships,
    applications,
    saved_items,
    notifications
  };
};

class Database {
  constructor() {
    this.data = null;
    this.init();
  }

  init() {
    if (!fs.existsSync(DB_FILE)) {
      this.data = getInitialData();
      this.save();
    } else {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        this.data = JSON.parse(raw);
      } catch (err) {
        console.error('Error reading DB, re-initializing seed data:', err);
        this.data = getInitialData();
        this.save();
      }
    }

    // Ensure sample resume file exists
    const sampleResumePath = path.join(UPLOADS_DIR, 'sample-resume-aditya.pdf');
    if (!fs.existsSync(sampleResumePath)) {
      fs.writeFileSync(sampleResumePath, 'Sample Resume Content for Aditya Sharma - NIT Trichy CSE graduate.');
    }
    const sampleResumePath2 = path.join(UPLOADS_DIR, 'sample-resume-pooja.pdf');
    if (!fs.existsSync(sampleResumePath2)) {
      fs.writeFileSync(sampleResumePath2, 'Sample Resume Content for Pooja Iyer - IIT Madras ECE graduate.');
    }
  }

  save() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to write to database:', err);
    }
  }

  // Branch Helpers
  getBranches() {
    return this.data.branches;
  }

  // User Helpers
  getUsers() {
    return this.data.users;
  }

  getUserById(id) {
    return this.data.users.find(u => u.id === id);
  }

  getUserByEmail(email) {
    return this.data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  createUser(userData) {
    const newUser = {
      id: `usr_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      createdAt: new Date().toISOString(),
      status: 'active',
      ...userData
    };
    this.data.users.push(newUser);
    this.save();
    return newUser;
  }

  updateUser(id, updates) {
    const idx = this.data.users.findIndex(u => u.id === id);
    if (idx === -1) return null;
    this.data.users[idx] = { ...this.data.users[idx], ...updates, updatedAt: new Date().toISOString() };
    this.save();
    return this.data.users[idx];
  }

  // Job Helpers
  getJobs(filters = {}) {
    let result = [...this.data.jobs];

    if (filters.branch && filters.branch !== 'All') {
      result = result.filter(j => 
        j.eligibleBranches.includes(filters.branch) || 
        j.eligibleBranches.includes('All')
      );
    }

    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(j => 
        j.title.toLowerCase().includes(q) ||
        j.company.toLowerCase().includes(q) ||
        j.description.toLowerCase().includes(q) ||
        j.requiredSkills.some(s => s.toLowerCase().includes(q))
      );
    }

    if (filters.location) {
      const loc = filters.location.toLowerCase();
      result = result.filter(j => j.location.toLowerCase().includes(loc));
    }

    if (filters.workMode && filters.workMode !== 'All') {
      result = result.filter(j => j.workMode.toLowerCase() === filters.workMode.toLowerCase());
    }

    if (filters.experienceLevel && filters.experienceLevel !== 'All') {
      result = result.filter(j => j.experienceLevel.toLowerCase() === filters.experienceLevel.toLowerCase());
    }

    if (filters.employmentType && filters.employmentType !== 'All') {
      result = result.filter(j => j.employmentType.toLowerCase() === filters.employmentType.toLowerCase());
    }

    if (filters.status) {
      result = result.filter(j => j.status === filters.status);
    }

    return result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  getJobById(id) {
    return this.data.jobs.find(j => j.id === id);
  }

  createJob(jobData) {
    const newJob = {
      id: `job_${Date.now()}`,
      applicantsCount: 0,
      status: 'active',
      createdAt: new Date().toISOString(),
      ...jobData
    };
    this.data.jobs.unshift(newJob);
    this.save();
    return newJob;
  }

  updateJob(id, updates) {
    const idx = this.data.jobs.findIndex(j => j.id === id);
    if (idx === -1) return null;
    this.data.jobs[idx] = { ...this.data.jobs[idx], ...updates, updatedAt: new Date().toISOString() };
    this.save();
    return this.data.jobs[idx];
  }

  deleteJob(id) {
    const idx = this.data.jobs.findIndex(j => j.id === id);
    if (idx === -1) return false;
    this.data.jobs.splice(idx, 1);
    this.save();
    return true;
  }

  // Internship Helpers
  getInternships(filters = {}) {
    let result = [...this.data.internships];

    if (filters.branch && filters.branch !== 'All') {
      result = result.filter(i => 
        i.eligibleBranches.includes(filters.branch) || 
        i.eligibleBranches.includes('All')
      );
    }

    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(i => 
        i.title.toLowerCase().includes(q) ||
        i.company.toLowerCase().includes(q) ||
        i.description.toLowerCase().includes(q) ||
        i.requiredSkills.some(s => s.toLowerCase().includes(q))
      );
    }

    if (filters.duration && filters.duration !== 'All') {
      result = result.filter(i => i.duration.toLowerCase().includes(filters.duration.toLowerCase()));
    }

    if (filters.workMode && filters.workMode !== 'All') {
      result = result.filter(i => i.workMode.toLowerCase() === filters.workMode.toLowerCase());
    }

    if (filters.stipendType && filters.stipendType !== 'All') {
      result = result.filter(i => i.stipendType.toLowerCase() === filters.stipendType.toLowerCase());
    }

    if (filters.academicYear && filters.academicYear !== 'All') {
      result = result.filter(i => i.eligibleYears.includes(filters.academicYear));
    }

    if (filters.status) {
      result = result.filter(i => i.status === filters.status);
    }

    return result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  getInternshipById(id) {
    return this.data.internships.find(i => i.id === id);
  }

  createInternship(internshipData) {
    const newInternship = {
      id: `intern_${Date.now()}`,
      applicantsCount: 0,
      status: 'active',
      createdAt: new Date().toISOString(),
      ...internshipData
    };
    this.data.internships.unshift(newInternship);
    this.save();
    return newInternship;
  }

  updateInternship(id, updates) {
    const idx = this.data.internships.findIndex(i => i.id === id);
    if (idx === -1) return null;
    this.data.internships[idx] = { ...this.data.internships[idx], ...updates, updatedAt: new Date().toISOString() };
    this.save();
    return this.data.internships[idx];
  }

  deleteInternship(id) {
    const idx = this.data.internships.findIndex(i => i.id === id);
    if (idx === -1) return false;
    this.data.internships.splice(idx, 1);
    this.save();
    return true;
  }

  // Application Helpers
  getApplications(filters = {}) {
    let result = [...this.data.applications];

    if (filters.studentId) {
      result = result.filter(a => a.studentId === filters.studentId);
    }

    if (filters.opportunityId) {
      result = result.filter(a => a.opportunityId === filters.opportunityId);
    }

    if (filters.recruiterId) {
      // Find jobs and internships posted by recruiter
      const recruiterJobs = this.data.jobs.filter(j => j.postedBy === filters.recruiterId).map(j => j.id);
      const recruiterInternships = this.data.internships.filter(i => i.postedBy === filters.recruiterId).map(i => i.id);
      const recruiterOppIds = new Set([...recruiterJobs, ...recruiterInternships]);
      result = result.filter(a => recruiterOppIds.has(a.opportunityId));
    }

    if (filters.status && filters.status !== 'All') {
      result = result.filter(a => a.status === filters.status);
    }

    return result.sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt));
  }

  getApplicationById(id) {
    return this.data.applications.find(a => a.id === id);
  }

  hasApplied(studentId, opportunityId) {
    return this.data.applications.some(
      a => a.studentId === studentId && a.opportunityId === opportunityId
    );
  }

  createApplication(appData) {
    const uniqueId = `APP-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
    const newApp = {
      id: uniqueId,
      status: 'Applied',
      statusHistory: [
        {
          status: 'Applied',
          date: new Date().toISOString(),
          note: 'Application submitted successfully on CareerNexus platform.'
        }
      ],
      appliedAt: new Date().toISOString(),
      ...appData
    };
    this.data.applications.unshift(newApp);

    // Increment applicantsCount on target opportunity
    if (newApp.opportunityType === 'job') {
      const job = this.getJobById(newApp.opportunityId);
      if (job) job.applicantsCount = (job.applicantsCount || 0) + 1;
    } else {
      const intern = this.getInternshipById(newApp.opportunityId);
      if (intern) intern.applicantsCount = (intern.applicantsCount || 0) + 1;
    }

    this.save();
    return newApp;
  }

  updateApplicationStatus(id, newStatus, note = '', interviewDetails = null) {
    const app = this.data.applications.find(a => a.id === id);
    if (!app) return null;

    app.status = newStatus;
    if (!app.statusHistory) app.statusHistory = [];
    app.statusHistory.push({
      status: newStatus,
      date: new Date().toISOString(),
      note: note || `Application status updated to ${newStatus}`
    });

    if (interviewDetails) {
      app.interviewDetails = interviewDetails;
    }

    this.save();
    return app;
  }

  // Saved Items Helpers
  getSavedItems(userId) {
    return this.data.saved_items.filter(s => s.userId === userId);
  }

  toggleSave(userId, opportunityId, opportunityType) {
    const idx = this.data.saved_items.findIndex(
      s => s.userId === userId && s.opportunityId === opportunityId
    );

    if (idx !== -1) {
      this.data.saved_items.splice(idx, 1);
      this.save();
      return { saved: false };
    } else {
      const newItem = {
        id: `save_${Date.now()}`,
        userId,
        opportunityId,
        opportunityType,
        savedAt: new Date().toISOString()
      };
      this.data.saved_items.push(newItem);
      this.save();
      return { saved: true, item: newItem };
    }
  }

  // Notification Helpers
  getNotifications(userId) {
    return this.data.notifications
      .filter(n => n.userId === userId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  createNotification(notifData) {
    const newNotif = {
      id: `notif_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      isRead: false,
      createdAt: new Date().toISOString(),
      ...notifData
    };
    this.data.notifications.unshift(newNotif);
    this.save();
    return newNotif;
  }

  markNotificationRead(id) {
    const notif = this.data.notifications.find(n => n.id === id);
    if (notif) {
      notif.isRead = true;
      this.save();
    }
    return notif;
  }

  markAllNotificationsRead(userId) {
    this.data.notifications.forEach(n => {
      if (n.userId === userId) n.isRead = true;
    });
    this.save();
    return true;
  }

  // Platform Metrics
  getMetrics() {
    const totalStudents = this.data.users.filter(u => u.role === 'student').length;
    const totalRecruiters = this.data.users.filter(u => u.role === 'recruiter').length;
    const totalJobs = this.data.jobs.length;
    const totalInternships = this.data.internships.length;
    const totalApplications = this.data.applications.length;

    // Applications by Branch
    const branchCounts = {};
    this.data.branches.forEach(b => { branchCounts[b.id] = 0; });
    this.data.applications.forEach(a => {
      if (a.studentBranch) {
        branchCounts[a.studentBranch] = (branchCounts[a.studentBranch] || 0) + 1;
      }
    });

    // Applications by Status
    const statusCounts = {
      'Applied': 0,
      'Under Review': 0,
      'Shortlisted': 0,
      'Interview Scheduled': 0,
      'Selected': 0,
      'Rejected': 0
    };
    this.data.applications.forEach(a => {
      if (statusCounts[a.status] !== undefined) {
        statusCounts[a.status]++;
      }
    });

    return {
      totalStudents,
      totalRecruiters,
      totalJobs,
      totalInternships,
      totalApplications,
      branchCounts,
      statusCounts
    };
  }
}

module.exports = new Database();
