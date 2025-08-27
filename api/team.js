// Vercel serverless function to proxy team data
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    // For now, return hardcoded team data since backend is not deployed
    const teamData = [
      {
        _id: '1',
        name: 'Dr. Preetha Bhadra',
        position: 'Managing Director',
        department: 'Management',
        email: 'preetha@gtftl.com',
        education: 'Ph.D. in Analytical Chemistry',
        experience: '15+ years in laboratory management',
        specialization: 'Laboratory Management, Quality Systems',
        bio: 'Leading expert in analytical chemistry and laboratory management with over 15 years of experience.',
        isActive: true,
        displayOrder: 1
      },
      {
        _id: '2',
        name: 'Prof. Supriya Pattanaik',
        position: 'Director',
        department: 'Management',
        email: 'supriya@gtftl.com',
        education: 'PhD (RMIT University), MPhil (NIMHANS), MA (TISS)',
        experience: '25+ years in strategic leadership',
        specialization: 'Strategic Leadership, Social Development',
        bio: 'Strategic leader with extensive experience in quality systems and academic management.',
        isActive: true,
        displayOrder: 2
      },
      {
        _id: '3',
        name: 'Prof. D. N. Rao',
        position: 'Director',
        department: 'Management',
        email: 'dnrao@gtftl.com',
        education: 'Civil Engineering (Osmania University), PGDM (IIM Calcutta)',
        experience: '20+ years in strategic planning',
        specialization: 'Strategic Planning, Enterprise Development',
        bio: 'Strategic planning expert with strong background in technology and enterprise development.',
        isActive: true,
        displayOrder: 3
      },
      {
        _id: '4',
        name: 'Dr. Rashmi Sharma',
        position: 'Senior Analytical Chemist',
        department: 'Chemical',
        email: 'rashmi@gtftl.com',
        education: 'Ph.D. in Analytical Chemistry, M.Sc. Chemistry',
        experience: '12+ years in analytical testing',
        specialization: 'HPLC, GC-MS, Spectroscopy',
        bio: 'Expert in advanced analytical techniques with focus on food safety testing.',
        isActive: true,
        displayOrder: 4
      },
      {
        _id: '5',
        name: 'Mr. Arjun Kumar',
        position: 'Laboratory Manager',
        department: 'Administration',
        email: 'arjun@gtftl.com',
        education: 'M.Sc. Microbiology, Laboratory Management Certification',
        experience: '10+ years in lab operations',
        specialization: 'Laboratory Operations, Quality Control',
        bio: 'Experienced laboratory manager ensuring smooth operations and quality standards.',
        isActive: true,
        displayOrder: 5
      },
      {
        _id: '6',
        name: 'Dr. Meera Patel',
        position: 'Microbiologist',
        department: 'Biological',
        email: 'meera@gtftl.com',
        education: 'Ph.D. Microbiology, M.Sc. Biotechnology',
        experience: '8+ years in microbial testing',
        specialization: 'Food Microbiology, Pathogen Detection',
        bio: 'Specialist in food microbiology and pathogen detection with extensive research background.',
        isActive: true,
        displayOrder: 6
      },
      {
        _id: '7',
        name: 'Mr. Vijay Singh',
        position: 'Research Analyst',
        department: 'Research',
        email: 'vijay@gtftl.com',
        education: 'M.Sc. Food Technology, Research Methodology',
        experience: '6+ years in food research',
        specialization: 'Method Development, Research Analysis',
        bio: 'Research analyst specializing in analytical method development.',
        isActive: true,
        displayOrder: 7
      }
    ];

    res.status(200).json({
      success: true,
      data: teamData,
      count: teamData.length
    });

  } catch (error) {
    console.error('Team API Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching team members'
    });
  }
}
