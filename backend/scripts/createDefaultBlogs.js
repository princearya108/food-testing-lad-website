const mongoose = require('mongoose');
const Admin = require('../models/Admin');
const Blog = require('../models/Blog');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/ftl', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Function to generate slug from title
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-zA-Z0-9 ]/g, '')
    .replace(/\s+/g, '-')
    .trim();
}

const defaultBlogs = [
  {
    title: "Advanced Food Safety Testing: Ensuring Quality at Every Step",
    slug: "advanced-food-safety-testing-ensuring-quality-at-every-step",
    excerpt: "Discover how comprehensive food testing protects consumers and maintains industry standards through rigorous analytical procedures.",
    content: `# Advanced Food Safety Testing: Ensuring Quality at Every Step

Food safety testing is the cornerstone of public health protection and industry compliance. At Gram Tarang Food Testing Laboratory, we understand that every bite matters, and our comprehensive testing protocols ensure that food products meet the highest safety standards.

## Why Food Testing Matters

Food contamination can occur at any stage of the supply chain, from farm to fork. Our NABL-accredited laboratory employs state-of-the-art technology to detect:

- **Pesticide residues** that may pose health risks
- **Heavy metals** including lead, mercury, and cadmium
- **Mycotoxins** produced by harmful fungi
- **Pathogenic microorganisms** that cause foodborne illnesses
- **Chemical contaminants** from processing or packaging

## Our Testing Capabilities

### Proximate Analysis
We determine the basic nutritional composition including moisture, protein, fat, fiber, and ash content to ensure accurate labeling and nutritional claims.

### Microbiological Testing
Our microbiology facility tests for:
- Total Plate Count (TPC)
- E. coli and Coliforms
- Salmonella detection
- Yeast and Mold counts
- Pathogen identification

### Chemical Analysis
Using advanced instrumentation like LC-MS/MS and GC-MS/MS, we detect trace levels of contaminants with exceptional accuracy and precision.

## Industry Applications

Our food testing services cater to:
- Food manufacturers and processors
- Agricultural producers
- Import/export companies
- Retail chains and restaurants
- Government regulatory bodies

## Quality Assurance

Every test follows strict quality control protocols, ensuring reliable and reproducible results. Our experienced team maintains the highest standards of analytical excellence.

Contact us today to discuss your food testing requirements and ensure your products meet regulatory standards while protecting consumer health.`,
    category: "Food Testing",
    tags: ["food safety", "quality control", "NABL accredited", "testing"],
    status: "published"
  },
  {
    title: "Breakthrough Research in Analytical Chemistry and Food Science",
    slug: "breakthrough-research-in-analytical-chemistry-and-food-science",
    excerpt: "Explore cutting-edge research methodologies and innovations that are transforming food analysis and safety protocols.",
    content: `# Breakthrough Research in Analytical Chemistry and Food Science

The field of analytical chemistry is constantly evolving, with new techniques and methodologies revolutionizing how we analyze food products. Our research initiatives focus on developing innovative solutions for complex analytical challenges.

## Current Research Projects

### Method Development and Validation
We are continuously developing new analytical methods for emerging contaminants and novel food ingredients. Our research includes:

- **Multi-residue pesticide analysis** using advanced chromatographic techniques
- **Rapid screening methods** for allergen detection
- **Novel biomarkers** for food authenticity testing
- **Green chemistry approaches** to reduce environmental impact

### Emerging Contaminants
Our research team investigates:
- Microplastics in food products
- Pharmaceutical residues in agricultural products
- Novel food additives and their metabolites
- Environmental pollutants in the food chain

## Collaborative Research

### Academic Partnerships
We collaborate with leading universities and research institutions to advance scientific knowledge and develop practical solutions for industry challenges.

### Industry Collaborations
Working closely with food manufacturers, we develop customized testing protocols and quality assurance programs tailored to specific product categories.

## Research Facilities

### Advanced Instrumentation
Our research is supported by cutting-edge equipment including:
- High-resolution mass spectrometry
- Nuclear magnetic resonance (NMR) spectroscopy
- Advanced chromatographic systems
- Molecular biology techniques

### Data Analysis and Modeling
We employ sophisticated statistical methods and computational tools to analyze complex datasets and develop predictive models.

## Publication and Knowledge Sharing

Our research findings are regularly published in peer-reviewed journals and presented at international conferences, contributing to the global knowledge base in food science and analytical chemistry.

## Future Directions

We are exploring:
- Artificial intelligence in food analysis
- Portable testing devices for field applications
- Sustainability in analytical chemistry
- Personalized nutrition and food safety

Join us in advancing the frontiers of food science research and creating safer, more sustainable food systems for the future.`,
    category: "Research",
    tags: ["analytical chemistry", "food science", "innovation", "research"],
    status: "published"
  },
  {
    title: "Technology Revolution in Modern Food Testing Laboratories",
    slug: "technology-revolution-in-modern-food-testing-laboratories",
    excerpt: "How advanced instrumentation and automation are transforming food analysis capabilities and improving testing efficiency.",
    content: `# Technology Revolution in Modern Food Testing Laboratories

The integration of advanced technology in food testing laboratories has dramatically improved our ability to detect, quantify, and characterize food components and contaminants with unprecedented accuracy and speed.

## Cutting-Edge Instrumentation

### Mass Spectrometry Technologies
Modern mass spectrometry systems provide exceptional sensitivity and specificity:

- **LC-MS/MS** for pesticide residue analysis
- **GC-MS/MS** for volatile compound detection
- **ICP-MS** for trace metal analysis
- **High-resolution MS** for unknown compound identification

### Chromatographic Advances
Advanced separation techniques enable complex mixture analysis:
- Ultra-high-performance liquid chromatography (UHPLC)
- Two-dimensional gas chromatography
- Supercritical fluid chromatography
- Ion chromatography for anion analysis

## Automation and Robotics

### Sample Preparation
Automated systems improve reproducibility and efficiency:
- Robotic sample extraction systems
- Automated solid-phase extraction
- Programmable liquid handling stations
- Intelligent sample tracking systems

### Data Management
Modern laboratory information management systems (LIMS) provide:
- Real-time data acquisition
- Automated report generation
- Quality control monitoring
- Regulatory compliance tracking

## Emerging Technologies

### Portable Testing Devices
Field-deployable instruments enable on-site analysis:
- Handheld spectroscopic devices
- Rapid pathogen detection systems
- Colorimetric test strips
- Smartphone-based analytical tools

### Artificial Intelligence
AI and machine learning applications include:
- Pattern recognition in spectral data
- Predictive modeling for food safety
- Automated method optimization
- Quality control decision support

## Benefits of Technology Integration

### Enhanced Capabilities
- Lower detection limits
- Faster turnaround times
- Improved accuracy and precision
- Expanded analytical scope

### Operational Efficiency
- Reduced manual labor
- Minimized human error
- Optimized resource utilization
- Streamlined workflows

## Future Trends

### Digital Transformation
The laboratory of the future will feature:
- Cloud-based data management
- Remote instrument monitoring
- Virtual reality training systems
- Blockchain for data integrity

### Sustainability
Green technology initiatives include:
- Reduced solvent consumption
- Energy-efficient instruments
- Waste minimization strategies
- Sustainable laboratory practices

## Implementation Strategies

### Technology Adoption
Successful technology integration requires:
- Staff training and education
- Method validation and verification
- Quality assurance protocols
- Continuous improvement processes

### Cost-Benefit Analysis
Technology investments should consider:
- Initial capital costs
- Operational savings
- Productivity improvements
- Quality enhancements

Stay ahead of the curve by embracing technological innovations that enhance analytical capabilities while maintaining the highest standards of accuracy and reliability.`,
    category: "Technology",
    tags: ["laboratory technology", "automation", "instrumentation", "innovation"],
    status: "published"
  },
  {
    title: "Professional Training Programs in Food Testing and Quality Assurance",
    slug: "professional-training-programs-in-food-testing-and-quality-assurance",
    excerpt: "Comprehensive training programs designed to build expertise in food analysis, quality control, and laboratory management.",
    content: `# Professional Training Programs in Food Testing and Quality Assurance

At Gram Tarang Food Testing Laboratory, we believe that skilled professionals are the foundation of quality analytical services. Our comprehensive training programs are designed to develop expertise across all aspects of food testing and quality assurance.

## Training Program Overview

### Internship Programs
Our structured internship programs offer hands-on experience in:
- **Duration**: 15 days to 6 months
- **Target Audience**: B.Sc., M.Sc., and Ph.D. students
- **Fields**: Food Technology, Biotechnology, Analytical Chemistry, Microbiology

### Specialized Workshops
Short-term intensive workshops covering:
- Analytical method development
- Instrument operation and maintenance
- Quality control procedures
- Regulatory compliance

## Core Training Areas

### Analytical Chemistry
**Chromatographic Techniques**
- HPLC method development and optimization
- GC-MS applications in food analysis
- LC-MS/MS for trace contaminant detection
- Sample preparation techniques

**Spectroscopic Methods**
- FTIR spectroscopy for food authentication
- UV-Vis spectrophotometry applications
- ICP-MS for elemental analysis
- Data interpretation and method validation

### Microbiological Testing
**Basic Microbiology**
- Sterile technique and laboratory safety
- Culture media preparation
- Bacterial identification methods
- Pathogen detection protocols

**Advanced Techniques**
- Molecular biology methods
- PCR-based pathogen detection
- Environmental monitoring
- Hygiene assessment procedures

### Quality Assurance
**Laboratory Management**
- NABL accreditation requirements
- ISO/IEC 17025 implementation
- Document control systems
- Internal audit procedures

**Good Laboratory Practices**
- Sample handling and chain of custody
- Equipment calibration and maintenance
- Data integrity and record keeping
- Proficiency testing participation

## Practical Training Components

### Hands-On Experience
Trainees work directly with:
- State-of-the-art analytical instruments
- Real food samples from various industries
- Method validation protocols
- Quality control procedures

### Project-Based Learning
Individual projects focus on:
- Method development for specific analytes
- Troubleshooting analytical problems
- Process optimization studies
- Research and development initiatives

## Industry Collaboration

### Partnership with Universities
We collaborate with academic institutions to provide:
- Student exchange programs
- Joint research projects
- Curriculum development support
- Faculty training opportunities

### Industry Training
Customized programs for:
- Food manufacturing companies
- Quality control laboratories
- Regulatory agencies
- Consulting organizations

## Training Outcomes

### Technical Skills
Participants develop expertise in:
- Analytical method execution
- Instrument operation and maintenance
- Data analysis and interpretation
- Problem-solving capabilities

### Professional Development
Training includes:
- Scientific communication skills
- Laboratory safety protocols
- Regulatory knowledge
- Ethical considerations in testing

## Certification and Recognition

### Completion Certificates
All participants receive:
- Training completion certificates
- Skill assessment reports
- Professional recommendations
- Continuing education credits

### Career Advancement
Our training programs prepare professionals for:
- Laboratory analyst positions
- Quality assurance roles
- Research and development careers
- Regulatory compliance positions

## Training Facilities

### Modern Infrastructure
- Fully equipped analytical laboratories
- Dedicated training rooms
- Computer facilities for data analysis
- Library and reference materials

### Expert Faculty
Training delivered by:
- Experienced laboratory professionals
- Industry experts
- Academic researchers
- Regulatory specialists

## Application Process

### Eligibility Criteria
- Educational background in relevant fields
- Basic laboratory experience (preferred)
- Commitment to complete the program
- Professional references

### Application Requirements
- Completed application form
- Academic transcripts
- Statement of purpose
- Recommendation letters

Invest in your professional development with our comprehensive training programs and join the next generation of food testing professionals who ensure food safety and quality for consumers worldwide.`,
    category: "Training",
    tags: ["professional training", "internship", "skill development", "education"],
    status: "published"
  },
  {
    title: "NABL Accreditation Achievement: Milestone in Quality Excellence",
    slug: "nabl-accreditation-achievement-milestone-in-quality-excellence",
    excerpt: "Celebrating our NABL accreditation and what it means for our laboratory's commitment to international quality standards.",
    content: `# NABL Accreditation Achievement: Milestone in Quality Excellence

We are proud to announce that Gram Tarang Food Testing Laboratory has achieved NABL (National Accreditation Board for Testing and Calibration Laboratories) accreditation, marking a significant milestone in our commitment to delivering the highest quality analytical services.

## What is NABL Accreditation?

NABL accreditation is a formal recognition that our laboratory meets international standards for technical competence and quality management systems. This accreditation is based on:

- **ISO/IEC 17025:2017** - General requirements for testing and calibration laboratories
- **Rigorous assessment** by technical experts
- **Continuous compliance** monitoring
- **Regular surveillance** audits

## Accreditation Scope

Our NABL accreditation covers a comprehensive range of testing parameters:

### Food Testing
- Proximate analysis (moisture, protein, fat, fiber, ash)
- Pesticide residue analysis
- Heavy metal detection
- Mycotoxin analysis
- Nutritional labeling parameters

### Microbiological Testing
- Total Plate Count (TPC)
- Coliform and E. coli detection
- Salmonella identification
- Yeast and mold enumeration
- Pathogen screening

### Chemical Analysis
- Preservatives and additives
- Contaminant analysis
- Nutritional components
- Authenticity testing

## Benefits of NABL Accreditation

### For Our Clients
**Enhanced Confidence**
- Internationally recognized quality standards
- Reliable and accurate test results
- Reduced risk of product recalls
- Regulatory compliance assurance

**Market Access**
- Global acceptance of test reports
- Export certification support
- Regulatory approval facilitation
- Supply chain validation

### For Our Laboratory
**Continuous Improvement**
- Systematic quality management
- Regular performance monitoring
- Technical competence validation
- Best practice implementation

**Professional Recognition**
- Industry credibility enhancement
- Expert technical staff validation
- Quality system certification
- Competitive advantage

## Quality Management System

### Document Control
Our quality system includes:
- Comprehensive procedure manuals
- Work instruction documents
- Quality control protocols
- Record maintenance systems

### Personnel Competency
- Technical qualification requirements
- Regular training programs
- Competency assessment procedures
- Continuing education initiatives

### Equipment Management
- Calibration and maintenance schedules
- Performance verification protocols
- Equipment qualification procedures
- Environmental monitoring systems

## Accreditation Process

### Preparation Phase
- Quality system development
- Staff training and competency assessment
- Equipment calibration and validation
- Documentation preparation

### Assessment Process
- Technical assessment by NABL experts
- Quality system evaluation
- Proficiency testing participation
- Corrective action implementation

### Maintenance Requirements
- Annual surveillance audits
- Proficiency testing participation
- Continuous improvement initiatives
- Complaint handling procedures

## Impact on Services

### Enhanced Capabilities
NABL accreditation enables us to:
- Provide legally defensible test reports
- Support regulatory submissions
- Facilitate international trade
- Ensure consistent quality delivery

### Client Benefits
Our accredited status provides:
- Increased confidence in results
- Reduced testing costs through acceptance
- Faster regulatory approvals
- Global market access support

## Commitment to Excellence

### Continuous Improvement
We are committed to:
- Regular method validation and verification
- Staff development and training
- Technology upgrades and modernization
- Quality system enhancement

### Future Goals
Our ongoing objectives include:
- Scope expansion for additional parameters
- International accreditation recognition
- Research and development initiatives
- Sustainable laboratory practices

## Industry Recognition

Our NABL accreditation represents:
- Technical competence validation
- Quality system certification
- International standard compliance
- Professional excellence recognition

## Client Assurance

With NABL accreditation, our clients can be confident that:
- Test results are accurate and reliable
- Quality standards are consistently maintained
- International requirements are met
- Regulatory compliance is ensured

This achievement reflects our unwavering commitment to excellence and positions us as a trusted partner in food safety and quality assurance. We thank our dedicated team and valued clients for their support in reaching this important milestone.`,
    category: "News",
    tags: ["NABL accreditation", "quality standards", "achievement", "certification"],
    status: "published"
  },
  {
    title: "Laboratory Services Overview: Comprehensive Testing Solutions",
    slug: "laboratory-services-overview-comprehensive-testing-solutions",
    excerpt: "A complete guide to our laboratory services, capabilities, and how we support various industries with analytical testing needs.",
    content: `# Laboratory Services Overview: Comprehensive Testing Solutions

Gram Tarang Food Testing Laboratory provides comprehensive analytical testing services to support food safety, quality assurance, and regulatory compliance across diverse industries. Our NABL-accredited facility combines advanced technology with expert knowledge to deliver reliable results.

## Service Categories

### Food and Agricultural Products
**Fresh Produce**
- Pesticide residue analysis
- Heavy metal testing
- Nutritional composition
- Microbiological safety

**Processed Foods**
- Preservative analysis
- Additive identification
- Contamination screening
- Shelf-life studies

**Beverages**
- Alcohol content determination
- Adulterant detection
- Microbiological testing
- Chemical analysis

### Pharmaceutical Testing
**Raw Materials**
- Identity and purity testing
- Impurity analysis
- Moisture content determination
- Microbiological limits

**Finished Products**
- Potency assays
- Dissolution testing
- Stability studies
- Contamination screening

### Marine Products
**Fresh Seafood**
- Freshness indicators
- Histamine analysis
- Heavy metal content
- Microbiological safety

**Processed Marine Products**
- Antibiotic residues
- Preservative analysis
- Nutritional labeling
- Quality parameters

## Testing Methodologies

### Chromatographic Analysis
**High-Performance Liquid Chromatography (HPLC)**
- Vitamin analysis
- Preservative determination
- Amino acid profiling
- Sugar content analysis

**Liquid Chromatography-Mass Spectrometry (LC-MS/MS)**
- Multi-residue pesticide analysis
- Mycotoxin detection
- Veterinary drug residues
- Contaminant identification

**Gas Chromatography-Mass Spectrometry (GC-MS/MS)**
- Volatile compound analysis
- Fatty acid profiling
- Residual solvent testing
- Aroma compound identification

### Spectroscopic Techniques
**Inductively Coupled Plasma-Mass Spectrometry (ICP-MS)**
- Trace metal analysis
- Heavy metal screening
- Elemental composition
- Nutritional minerals

**Fourier Transform Infrared Spectroscopy (FTIR)**
- Functional group identification
- Adulterant detection
- Structural analysis
- Quality assessment

### Microbiological Testing
**Pathogen Detection**
- Salmonella identification
- E. coli enumeration
- Listeria detection
- Campylobacter screening

**Indicator Organisms**
- Total Plate Count
- Coliform bacteria
- Yeast and mold
- Enterobacteriaceae

## Quality Assurance

### Method Validation
All analytical methods undergo rigorous validation to ensure:
- Accuracy and precision
- Sensitivity and specificity
- Robustness and ruggedness
- Measurement uncertainty evaluation

### Quality Control
Comprehensive QC procedures include:
- Reference material analysis
- Blank sample testing
- Duplicate sample analysis
- Proficiency testing participation

### Accreditation Compliance
Our laboratory maintains:
- NABL accreditation status
- ISO/IEC 17025 compliance
- Regular audit procedures
- Continuous improvement initiatives

## Sample Management

### Sample Receipt
Professional sample handling includes:
- Chain of custody documentation
- Proper sample identification
- Storage condition verification
- Integrity assessment

### Sample Preparation
Standardized procedures for:
- Homogenization and extraction
- Cleanup and concentration
- Derivatization when required
- Quality control integration

### Sample Storage
Appropriate storage conditions:
- Temperature-controlled environments
- Humidity monitoring
- Light protection
- Security measures

## Reporting and Documentation

### Test Reports
Comprehensive reports include:
- Detailed analytical results
- Method references
- Quality control data
- Uncertainty statements

### Documentation
Complete documentation package:
- Chain of custody records
- Analytical worksheets
- Quality control charts
- Calibration certificates

### Data Management
Secure data handling through:
- Electronic laboratory notebooks
- Database backup systems
- Access control measures
- Data integrity protocols

## Industry Applications

### Food Manufacturing
- Raw material testing
- Process monitoring
- Final product verification
- Regulatory compliance

### Agriculture
- Crop safety assessment
- Soil and water analysis
- Pesticide residue monitoring
- Export certification

### Regulatory Agencies
- Surveillance testing
- Investigation support
- Method development
- Training services

### Research Institutions
- Collaborative studies
- Method validation
- Technology development
- Educational support

## Client Services

### Consultation
Expert guidance on:
- Testing requirements
- Regulatory compliance
- Method selection
- Result interpretation

### Training
Educational programs for:
- Laboratory personnel
- Quality assurance staff
- Regulatory professionals
- Industry stakeholders

### Technical Support
Ongoing assistance with:
- Sample collection guidance
- Method troubleshooting
- Data interpretation
- Regulatory updates

Choose Gram Tarang Food Testing Laboratory for reliable, accurate, and timely analytical services that support your quality assurance objectives and regulatory compliance requirements.`,
    category: "General",
    tags: ["laboratory services", "testing solutions", "quality assurance", "analytical chemistry"],
    status: "published"
  }
];

async function createDefaultBlogs() {
  try {
    console.log('Creating default blog articles...');
    
    // Find admin user to assign as author
    const admin = await Admin.findOne();
    if (!admin) {
      console.error('No admin user found. Please create an admin user first.');
      process.exit(1);
    }
    
    console.log(`Found admin user: ${admin.username}`);

    // Check if blogs already exist
    const existingBlogs = await Blog.find({});
    if (existingBlogs.length > 0) {
      console.log('Default blogs already exist. Skipping creation.');
      process.exit(0);
    }

    // Create blogs
    for (const blogData of defaultBlogs) {
      const blog = new Blog({
        ...blogData,
        author: admin._id,
        publishDate: new Date(),
        tags: blogData.tags
      });
      
      await blog.save();
      console.log(`✅ Created blog: ${blog.title}`);
    }

    console.log(`\n🎉 Successfully created ${defaultBlogs.length} default blog articles!`);
    console.log('\nBlog Categories Created:');
    console.log('- Food Testing (1 article)');
    console.log('- Research (1 article)');
    console.log('- Technology (1 article)');
    console.log('- Training (1 article)');
    console.log('- News (1 article)');
    console.log('- General (1 article)');
    
  } catch (error) {
    console.error('Error creating default blogs:', error);
  } finally {
    mongoose.connection.close();
  }
}

createDefaultBlogs();
