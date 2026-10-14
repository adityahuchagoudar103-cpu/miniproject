export const BRANCHES = [
  { id: 'CSE', name: 'Computer Science Engineering (CSE)', short: 'CSE', color: '#6366f1', icon: 'Cpu', desc: 'Software engineering, cloud architecture, system design, cybersecurity' },
  { id: 'IT', name: 'Information Technology (IT)', short: 'IT', color: '#3b82f6', icon: 'Globe', desc: 'Enterprise networks, full stack development, cloud infrastructure, DevOps' },
  { id: 'AI/ML', name: 'Artificial Intelligence & Machine Learning (AI/ML)', short: 'AI/ML', color: '#8b5cf6', icon: 'Brain', desc: 'Deep learning, computer vision, natural language processing, LLMs' },
  { id: 'AI/DS', name: 'Artificial Intelligence & Data Science (AI/DS)', short: 'AI/DS', color: '#ec4899', icon: 'Database', desc: 'Big data pipelines, statistical modeling, business analytics, data mining' },
  { id: 'ECE', name: 'Electronics & Communication Engineering (ECE)', short: 'ECE', color: '#f59e0b', icon: 'Radio', desc: 'VLSI chip design, embedded firmware, IoT hardware, wireless communication' },
  { id: 'EEE', name: 'Electrical & Electronics Engineering (EEE)', short: 'EEE', color: '#10b981', icon: 'Zap', desc: 'Power electronics, smart grids, renewable energy, industrial motor drives' },
  { id: 'Mechanical', name: 'Mechanical Engineering', short: 'Mechanical', color: '#ef4444', icon: 'Settings', desc: 'CAD/CAM modeling, thermal analysis, robotics, automotive engineering' },
  { id: 'Civil', name: 'Civil Engineering', short: 'Civil', color: '#14b8a6', icon: 'Compass', desc: 'Structural BIM design, transportation networks, construction project management' },
  { id: 'Chemical', name: 'Chemical Engineering', short: 'Chemical', color: '#06b6d4', icon: 'FlaskConical', desc: 'Process simulation, refinery optimization, petrochemicals, biochemical flow' },
  { id: 'Biotechnology', name: 'Biotechnology', short: 'Biotech', color: '#84cc16', icon: 'Dna', desc: 'Bioinformatics, recombinant proteins, genomic sequencing, biopharma R&D' },
  { id: 'Other', name: 'Other branches', short: 'Other', color: '#64748b', icon: 'Layers', desc: 'Metallurgical, production, aerospace, industrial design, multidisciplinary' }
];

export const STATUS_COLORS = {
  'Applied': { bg: 'rgba(56, 189, 248, 0.15)', text: '#38bdf8', border: 'rgba(56, 189, 248, 0.3)' },
  'Under Review': { bg: 'rgba(245, 158, 11, 0.15)', text: '#fbbf24', border: 'rgba(245, 158, 11, 0.3)' },
  'Shortlisted': { bg: 'rgba(168, 85, 247, 0.15)', text: '#c084fc', border: 'rgba(168, 85, 247, 0.3)' },
  'Interview Scheduled': { bg: 'rgba(236, 72, 153, 0.15)', text: '#f472b6', border: 'rgba(236, 72, 153, 0.3)' },
  'Selected': { bg: 'rgba(16, 185, 129, 0.15)', text: '#34d399', border: 'rgba(16, 185, 129, 0.3)' },
  'Rejected': { bg: 'rgba(239, 68, 68, 0.15)', text: '#f87171', border: 'rgba(239, 68, 68, 0.3)' }
};
