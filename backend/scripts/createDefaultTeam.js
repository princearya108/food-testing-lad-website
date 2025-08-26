const mongoose = require('mongoose');
const Team = require('../models/Team');
const Admin = require('../models/Admin');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/ftl', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const defaultTeamMembers = [
  // Board of Directors
  {
    name: 'Dr. Preetha Bhadra',
    position: 'Managing Director',
    email: 'preetha@gtftl.com',
    department: 'Management',
    bio: 'Dr. Preetha Bhadra is the Managing Director of Gram Tarang Food Testing Laboratory (GTFTL), Parlakhemundi, Odisha. She leads strategy, operations, and quality systems across food, pharmaceutical, and forensic testing, with a strong focus on NABL (ISO/IEC 17025) accreditation, method validation, and regulatory compliance to FSSAI and BIS standards. At GTFTL she oversees a multidisciplinary team operating advanced instrumentation (ICP-MS, LC-MS/MS, GC-MS/MS, HPLC, FTIR, UV-Vis, and core proximate analyzers) to deliver reliable, timely results. A champion of industry–academia collaboration, Dr. Bhadra drives hands-on training programs, workforce skilling, and client-centric service, upholding data integrity and public-health impact across the agri-food ecosystem.',
    education: 'Ph.D. in Analytical Chemistry',
    experience: 'Laboratory Management, Quality Systems, NABL Accreditation',
    specialization: 'Laboratory Management, Quality Systems, NABL Accreditation',
    profileImage: '/images/team/md.jpg',
    isActive: true,
    displayOrder: 1,
    isPublicDisplay: true,
    featured: true,
    socialLinks: {
      linkedin: '',
      twitter: '',
      researchGate: '',
      orcid: ''
    }
  },
  {
    name: 'Prof. Supriya Pattanaik',
    position: 'Director',
    email: 'supriya@gtftl.com',
    department: 'Management',
    bio: 'Prof. Supriya Pattanayak is the Director of Gram Tarang Foods Testing Laboratory (GTFTL), where she leads strategy, quality systems, and partnerships across food, pharma, and forensic testing. A social-development scholar-practitioner with 25+ years of leadership, she previously served as Vice-Chancellor of Centurion University of Technology and Management and State Representative (Odisha) for DFID India. She holds a PhD from RMIT University, an MPhil from NIMHANS, and an MA from TISS. At GTFTL, she champions rigorous compliance, workforce development, and translational projects that strengthen public health and the agri-food ecosystem.',
    education: 'PhD (RMIT University), MPhil (NIMHANS), MA (TISS)',
    experience: 'Strategic Leadership, Social Development, Academic Management',
    specialization: 'Strategic Leadership, Social Development, Academic Management',
    profileImage: '/images/team/director1.jpg',
    isActive: true,
    displayOrder: 2,
    isPublicDisplay: true,
    featured: true,
    socialLinks: {
      linkedin: '',
      twitter: '',
      researchGate: '',
      orcid: ''
    }
  },
  {
    name: 'Prof. D. N. Rao',
    position: 'Director',
    email: 'dnrao@gtftl.com',
    department: 'Management',
    bio: 'Prof. D. N. Rao is the Director of Gram Tarang Foods Testing Laboratory (FTL), steering strategy, accreditation, and industry partnerships across food, pharma, and forensic testing. A civil engineer (Osmania University) with a PGDM from IIM Calcutta, he is Co-Founder & Vice President of Centurion University and a co-promoter of the Gram Tarang institutions. Previously leading CENDERET at XIMB, he brings deep expertise in project design and enterprise development. At FTL, he champions technology-driven quality systems, workforce skilling, and client-centric service delivery.',
    education: 'Civil Engineering (Osmania University), PGDM (IIM Calcutta)',
    experience: 'Strategic Planning, Enterprise Development, Technology Systems',
    specialization: 'Strategic Planning, Enterprise Development, Technology Systems',
    profileImage: '/images/team/director2.jpg',
    isActive: true,
    displayOrder: 3,
    isPublicDisplay: true,
    featured: true,
    socialLinks: {
      linkedin: '',
      twitter: '',
      researchGate: '',
      orcid: ''
    }
  },

  // Technical Team
  {
    name: 'Dr. Bhadram Kalyan Chekraverthy',
    position: 'Technical Manager (Chemical)',
    email: 'bhadram@gtftl.com',
    phone: '+91 9876543210',
    department: 'Chemical',
    bio: 'Dr. Bhadram holds a PhD in Pharmaceutical Analysis from JSS College of Pharmacy, Ooty, specializes in advanced analytical instrumentation. At Gram Tarang Food Testing Lab, he manages the Chemical Department and performs quality control testing of diverse food and pharmaceutical products ensuring the reliability and accuracy. His expertise includes method development and validation, nutrikinetics, and QC standardization of herbal and food products.',
    education: 'Ph.D. in Pharmaceutical Analysis from JSS College of Pharmacy, Ooty',
    experience: 'Chemical Analysis, Method Development, Pharmaceutical Analysis',
    specialization: 'Chemical Analysis, Method Development, Pharmaceutical Analysis',
    profileImage: '/images/team/technical_manager_chem.jpg',
    isActive: true,
    displayOrder: 4,
    isPublicDisplay: true,
    featured: false,
    socialLinks: {
      linkedin: '',
      twitter: '',
      researchGate: '',
      orcid: ''
    },
    achievements: [
      {
        title: 'Chemical Testing Operations Leadership',
        description: 'Successfully manages chemical testing operations with advanced analytical instrumentation',
        year: 2023
      },
      {
        title: 'Method Development Expertise',
        description: 'Specialized in method development and validation for pharmaceutical and food products',
        year: 2022
      }
    ]
  },
  {
    name: 'Dr. Pratyush Kumar Das',
    position: 'Technical Manager (Biological)',
    email: 'pratyush@gtftl.com',
    phone: '+91 9876543211',
    department: 'Biological',
    bio: 'Dr. Pratyush Kumar Das is Technical Manager (Biological) at Gram Tarang Food Testing Laboratory, Paralakhemundi. A biotechnologist (Ph.D., SOA 2022; M.Sc./B.Sc., Utkal), he specializes in microbial testing to IS & FSSAI standards, microbial genomics, and environmental/plant biotechnology (nanoparticles, polymers, heavy-metal remediation). He has 30+ papers, three books, and editorial roles, with awards from DBT, CSIR, DST, Springer, and the Publons Global Peer Review Award. In 2023, he won the DBT-ILS Innovation Challenge for polymer-functionalized bio-beads reducing Cr(VI) in rice.',
    education: 'Ph.D. (SOA 2022), M.Sc./B.Sc. (Utkal University)',
    experience: 'Microbiology, Biotechnology, Environmental Sciences',
    specialization: 'Microbiology, Biotechnology, Environmental Sciences',
    profileImage: '/images/team/technical_manager_bio.jpg',
    isActive: true,
    displayOrder: 5,
    isPublicDisplay: true,
    featured: false,
    socialLinks: {
      linkedin: '',
      twitter: '',
      researchGate: '',
      orcid: ''
    },
    achievements: [
      {
        title: 'DBT-ILS Innovation Challenge Winner',
        description: 'Won the DBT-ILS Innovation Challenge for polymer-functionalized bio-beads reducing Cr(VI) in rice',
        year: 2023
      },
      {
        title: 'Publons Global Peer Review Award',
        description: 'Received the prestigious Publons Global Peer Review Award for outstanding contribution',
        year: 2022
      }
    ],
    publications: [
      {
        title: 'Environmental Biotechnology Applications',
        journal: 'Journal of Environmental Sciences',
        year: 2023,
        url: ''
      },
      {
        title: 'Microbial Genomics in Food Safety',
        journal: 'Food Microbiology International',
        year: 2022,
        url: ''
      }
    ]
  },
  {
    name: 'Mr. Victor Pradhan',
    position: 'Senior Analyst (Chemical)',
    email: 'victor@gtftl.com',
    phone: '+91 9876543212',
    department: 'Chemical',
    bio: 'M.Tech in Biotechnology from OUTR with expertise in method development, validation, and operation of advanced analytical instruments including ICP-MS, LC-MS/MS, HPLC, and GC-MS/MS. Contributing to high-precision analytical testing at Gram Tarang Food Testing Laboratories Pvt. Ltd., funded by MoFPI, Government of India.',
    education: 'M.Tech in Biotechnology from OUTR',
    experience: 'Instrumental Analysis, Method Development, Advanced Analytics',
    specialization: 'Instrumental Analysis, Method Development, Advanced Analytics',
    profileImage: '/images/team/senior_analyst_chem.jpg',
    isActive: true,
    displayOrder: 6,
    isPublicDisplay: true,
    featured: false,
    socialLinks: {
      linkedin: '',
      twitter: '',
      researchGate: '',
      orcid: ''
    }
  },
  {
    name: 'Ms. Debarati Nandi',
    position: 'Senior Analyst (Chemical)',
    email: 'debarati@gtftl.com',
    phone: '+91 9876543213',
    department: 'Chemical',
    bio: 'Mrs. Debarati Nandi is a Senior Analyst in the Chemical Department at Gram Tarang Food Testing Laboratory, Paralakhemundi. She specializes in analytical instrumentation and quality control of food products, with strong expertise in HPLC, GC-MS/MS, and ICP-MS. Her work focuses on method development and validation to ensure accurate, reliable, and regulatory-compliant testing for food safety and quality assurance.',
    education: 'M.Sc. in Food Technology',
    experience: 'Analytical Instrumentation, Food Quality Control',
    specialization: 'Analytical Instrumentation, Food Quality Control',
    profileImage: '/images/team/senior_analyst_chem2.jpg',
    isActive: true,
    displayOrder: 7,
    isPublicDisplay: true,
    featured: false,
    socialLinks: {
      linkedin: '',
      twitter: '',
      researchGate: '',
      orcid: ''
    }
  },
  {
    name: 'Ms. Swapna Rani Nag',
    position: 'Senior Analyst (Biological)',
    email: 'swapna@gtftl.com',
    phone: '+91 9876543214',
    department: 'Biological',
    bio: 'Ms. Swapna Rani Nag, M.Sc. in Biotechnology is a Senior Analyst in the Biological Department at Gram Tarang Food Testing Laboratory, Paralakhemundi. She specialized in microbiological testing and food quality control, with expertise in microbial identification, pathogen detection, and method validation. Her work ensures that food products meet regulatory standards (FSSAI, IS) and supports food safety, quality assurance, and consumer protection through accurate and reliable microbiological analysis.',
    education: 'M.Sc. in Biotechnology',
    experience: 'Microbiological Testing, Food Safety',
    specialization: 'Microbiological Testing, Food Safety',
    profileImage: '/images/team/senior_analyst_bio.jpg',
    isActive: true,
    displayOrder: 8,
    isPublicDisplay: true,
    featured: false,
    socialLinks: {
      linkedin: '',
      twitter: '',
      researchGate: '',
      orcid: ''
    }
  },
  {
    name: 'Mr. Badal Kumar Biswal',
    position: 'Junior Analyst (Chemical)',
    email: 'badal@gtftl.com',
    phone: '+91 9876543215',
    department: 'Chemical',
    bio: 'B.Tech in Agriculture from CUTM with hands-on experience in analytical testing and instrument handling. Currently working as a Junior Analyst at Gram Tarang Food Testing Laboratories Pvt. Ltd., funded by MoFPI, Government of India, supporting quality analysis and standardization processes.',
    education: 'B.Tech in Agriculture from CUTM',
    experience: 'Analytical Testing, Instrument Handling',
    specialization: 'Analytical Testing, Instrument Handling',
    profileImage: '/images/badal_kumar_biswal.jpg',
    isActive: true,
    displayOrder: 9,
    isPublicDisplay: true,
    featured: false,
    socialLinks: {
      linkedin: '',
      twitter: '',
      researchGate: '',
      orcid: ''
    }
  },
  {
    name: 'Mr. Sanket Bhowmik',
    position: 'Junior Analyst (Biological)',
    email: 'sanket@gtftl.com',
    phone: '+91 9876543216',
    department: 'Biological',
    bio: 'Mr. Sanket Bhowmik, appointed as a Junior Analyst (Biological) at Gram Tarang Foods Testing Laboratories Private Limited. He holds a background in biological sciences with hands-on knowledge of microbiological techniques, food safety standards, and quality analysis. In his role, he assists in conducting biological examinations of food samples, ensuring compliance with regulatory requirements and maintaining high laboratory standards. His keen attention to detail and commitment to accuracy contribute to reliable testing outcomes that support public health and food safety.',
    education: 'B.Sc. in Biological Sciences',
    experience: 'Microbiological Techniques, Food Safety',
    specialization: 'Microbiological Techniques, Food Safety',
    profileImage: '/images/team/junior_analyst_bio.jpg',
    isActive: true,
    displayOrder: 10,
    isPublicDisplay: true,
    featured: false,
    socialLinks: {
      linkedin: '',
      twitter: '',
      researchGate: '',
      orcid: ''
    }
  }
];

const createDefaultTeam = async () => {
  try {
    console.log('Creating default team members...');

    // Check if team members already exist
    const existingTeamCount = await Team.countDocuments();
    if (existingTeamCount > 0) {
      console.log('Default team members already exist. Skipping creation.');
      process.exit(0);
    }

    // Find admin user to associate with team
    const admin = await Admin.findOne({ username: 'admin' });
    if (!admin) {
      console.log('Admin user not found. Please create admin first.');
      process.exit(1);
    }

    console.log('Found admin user:', admin.username);

    // Create team members
    const teamPromises = defaultTeamMembers.map(member => {
      const teamMember = new Team(member);
      return teamMember.save();
    });

    await Promise.all(teamPromises);

    console.log(`✅ Successfully created ${defaultTeamMembers.length} team members!`);

    // Display created team members
    console.log('\nCreated team members:');
    defaultTeamMembers.forEach((member, index) => {
      console.log(`${index + 1}. ${member.name} - ${member.position} (${member.department})`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error creating default team members:', error);
    process.exit(1);
  }
};

// Run the script
createDefaultTeam();
