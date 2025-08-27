const mongoose = require('mongoose');
const Internship = require('../models/Internship');
const Admin = require('../models/Admin');
require('dotenv').config();

const connectDB = async () => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://princetech:<password>@cluster0.vvpkt.mongodb.net/food_testing_lab?retryWrites=true&w=majority';
    
    // URL encode the password if it contains special characters
    const encodedURI = MONGODB_URI.replace('<password>', encodeURIComponent('Prince@2005'));
    
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(encodedURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

const defaultInternships = [
  {
    title: 'Food Safety Research Intern',
    description: `<p>Join our dynamic research team to gain hands-on experience in food safety testing and analysis. This internship offers exposure to cutting-edge laboratory techniques and real-world food testing scenarios.</p>
    
    <h3>Key Responsibilities:</h3>
    <ul>
      <li>Assist in microbiological and chemical analysis of food samples</li>
      <li>Support research projects on food contamination and safety</li>
      <li>Learn NABL-compliant testing procedures</li>
      <li>Prepare detailed laboratory reports</li>
      <li>Participate in quality control activities</li>
    </ul>`,
    requirements: `<h3>Educational Requirements:</h3>
    <ul>
      <li>Currently pursuing B.Sc/M.Sc in Food Technology, Microbiology, or related field</li>
      <li>Minimum 60% aggregate in current studies</li>
      <li>Basic knowledge of laboratory techniques</li>
    </ul>
    
    <h3>Preferred Skills:</h3>
    <ul>
      <li>Familiarity with analytical instruments</li>
      <li>Knowledge of HACCP principles</li>
      <li>Good communication skills</li>
      <li>Attention to detail and accuracy</li>
    </ul>`,
    duration: '3 months',
    stipend: '₹8,000 per month',
    location: 'Bhubaneswar',
    category: 'Research',
    positions: 2,
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    status: 'active',
    skills: ['Laboratory Techniques', 'Data Analysis', 'Report Writing', 'Food Safety'],
    benefits: ['Certificate of Completion', 'Hands-on Training', 'Mentorship', 'Networking Opportunities'],
    featured: true,
    department: 'Research & Development',
    contactEmail: 'internships@gramtarangfoodtesting.com',
    contactPhone: '+91-XXX-XXX-XXXX'
  },
  {
    title: 'Chemical Analysis Laboratory Intern',
    description: `<p>Gain practical experience in chemical analysis and instrumentation in our state-of-the-art laboratory. Learn advanced analytical techniques used in food testing.</p>
    
    <h3>What You'll Learn:</h3>
    <ul>
      <li>HPLC and GC-MS operations</li>
      <li>Sample preparation techniques</li>
      <li>Method validation procedures</li>
      <li>Data interpretation and reporting</li>
      <li>Laboratory safety protocols</li>
    </ul>`,
    requirements: `<h3>Academic Background:</h3>
    <ul>
      <li>B.Sc/M.Sc in Chemistry, Analytical Chemistry, or Food Science</li>
      <li>Knowledge of chromatographic techniques</li>
      <li>Computer literacy (MS Office, data analysis software)</li>
    </ul>
    
    <h3>Skills Required:</h3>
    <ul>
      <li>Analytical thinking</li>
      <li>Problem-solving abilities</li>
      <li>Time management</li>
      <li>Team collaboration</li>
    </ul>`,
    duration: '6 months',
    stipend: '₹10,000 per month',
    location: 'Bhubaneswar',
    category: 'Technical',
    positions: 1,
    deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days from now
    status: 'active',
    skills: ['HPLC', 'GC-MS', 'Sample Preparation', 'Data Analysis', 'Method Validation'],
    benefits: ['Industry Exposure', 'Equipment Training', 'Certification', 'Performance Bonus'],
    featured: true,
    department: 'Chemical Analysis',
    contactEmail: 'chemistry@gramtarangfoodtesting.com'
  },
  {
    title: 'Quality Assurance Intern',
    description: `<p>Support our quality assurance team in maintaining the highest standards of laboratory operations and ensuring compliance with regulatory requirements.</p>
    
    <h3>Role Overview:</h3>
    <ul>
      <li>Assist in quality control procedures</li>
      <li>Document review and maintenance</li>
      <li>Audit support activities</li>
      <li>Calibration and maintenance records</li>
      <li>NABL compliance monitoring</li>
    </ul>`,
    requirements: `<h3>Qualification:</h3>
    <ul>
      <li>B.Tech/M.Tech in any engineering field or B.Sc in Science</li>
      <li>Understanding of quality management systems</li>
      <li>Knowledge of ISO standards (preferred)</li>
    </ul>
    
    <h3>Personal Attributes:</h3>
    <ul>
      <li>Detail-oriented approach</li>
      <li>Good documentation skills</li>
      <li>Process improvement mindset</li>
      <li>Ethical and professional conduct</li>
    </ul>`,
    duration: '4 months',
    stipend: '₹9,000 per month',
    location: 'Bhubaneswar',
    category: 'Administrative',
    positions: 1,
    deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
    status: 'active',
    skills: ['Quality Management', 'Documentation', 'Process Improvement', 'Compliance'],
    benefits: ['QMS Training', 'Audit Experience', 'Professional Development', 'Certificate'],
    department: 'Quality Assurance',
    contactEmail: 'qa@gramtarangfoodtesting.com'
  },
  {
    title: 'Environmental Testing Intern',
    description: `<p>Join our environmental testing division to learn about water quality analysis, environmental monitoring, and sustainability practices in laboratory operations.</p>
    
    <h3>Learning Opportunities:</h3>
    <ul>
      <li>Water quality parameter testing</li>
      <li>Environmental sample analysis</li>
      <li>Pollution monitoring techniques</li>
      <li>Sustainability reporting</li>
      <li>Regulatory compliance for environmental standards</li>
    </ul>`,
    requirements: `<h3>Educational Background:</h3>
    <ul>
      <li>B.Sc/M.Sc in Environmental Science, Chemistry, or Biology</li>
      <li>Interest in environmental protection and sustainability</li>
      <li>Basic laboratory experience</li>
    </ul>
    
    <h3>Desired Skills:</h3>
    <ul>
      <li>Environmental regulations knowledge</li>
      <li>Analytical testing experience</li>
      <li>Data collection and analysis</li>
      <li>Report preparation</li>
    </ul>`,
    duration: '3 months',
    stipend: '₹7,500 per month',
    location: 'Bhubaneswar',
    category: 'Field Work',
    positions: 2,
    deadline: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000), // 40 days from now
    status: 'active',
    skills: ['Environmental Testing', 'Water Analysis', 'Data Collection', 'Sustainability'],
    benefits: ['Field Experience', 'Environmental Awareness', 'Research Exposure', 'Certificate'],
    department: 'Environmental Division',
    contactEmail: 'environment@gramtarangfoodtesting.com'
  },
  {
    title: 'Laboratory Operations Intern',
    description: `<p>Gain comprehensive exposure to laboratory operations, equipment maintenance, and workflow optimization in a professional testing environment.</p>
    
    <h3>Responsibilities:</h3>
    <ul>
      <li>Support daily laboratory operations</li>
      <li>Equipment calibration and maintenance</li>
      <li>Sample tracking and management</li>
      <li>Laboratory safety compliance</li>
      <li>Workflow optimization projects</li>
    </ul>`,
    requirements: `<h3>Academic Requirements:</h3>
    <ul>
      <li>B.Tech in Mechanical/Electrical Engineering or B.Sc in Science</li>
      <li>Understanding of laboratory equipment</li>
      <li>Basic maintenance and troubleshooting skills</li>
    </ul>
    
    <h3>Skills Needed:</h3>
    <ul>
      <li>Technical aptitude</li>
      <li>Problem-solving skills</li>
      <li>Safety consciousness</li>
      <li>Process documentation</li>
    </ul>`,
    duration: '6 months',
    stipend: '₹9,500 per month',
    location: 'Bhubaneswar',
    category: 'Laboratory',
    positions: 1,
    deadline: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000), // 35 days from now
    status: 'active',
    skills: ['Equipment Maintenance', 'Laboratory Operations', 'Safety Protocols', 'Process Optimization'],
    benefits: ['Technical Training', 'Equipment Exposure', 'Operations Experience', 'Professional Growth'],
    department: 'Laboratory Operations',
    contactEmail: 'operations@gramtarangfoodtesting.com'
  }
];

const createDefaultInternships = async () => {
  try {
    console.log('🔄 Creating default internship programs...');
    
    // Find an admin user to set as creator
    const admin = await Admin.findOne();
    if (!admin) {
      console.error('❌ No admin user found. Please create an admin user first.');
      return;
    }
    
    // Check if internships already exist
    const existingInternships = await Internship.find();
    if (existingInternships.length > 0) {
      console.log('ℹ️  Internship programs already exist. Skipping creation.');
      return;
    }
    
    // Create internships with admin as creator
    const internships = defaultInternships.map(internship => ({
      ...internship,
      createdBy: admin._id
    }));
    
    await Internship.insertMany(internships);
    
    console.log(`✅ Successfully created ${internships.length} default internship programs:`);
    internships.forEach(internship => {
      console.log(`   - ${internship.title} (${internship.category})`);
    });
    
  } catch (error) {
    console.error('❌ Error creating default internships:', error);
  }
};

const main = async () => {
  await connectDB();
  await createDefaultInternships();
  
  console.log('✅ Default internship programs creation completed!');
  mongoose.connection.close();
};

if (require.main === module) {
  main();
}

module.exports = { createDefaultInternships };
