const mongoose = require('mongoose');
const Page = require('../models/Page');
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

const defaultPages = [
  {
    title: 'Privacy Policy',
    pageType: 'privacy-policy',
    content: `<h1>Privacy Policy</h1>
    
    <p>Effective Date: ${new Date().toLocaleDateString()}</p>
    
    <h2>Information We Collect</h2>
    <p>At Gram Tarang Food Testing Laboratory, we collect information that you provide directly to us, such as when you:</p>
    <ul>
      <li>Request our testing services</li>
      <li>Submit samples for analysis</li>
      <li>Contact us for information</li>
      <li>Apply for internships</li>
      <li>Subscribe to our newsletter</li>
    </ul>
    
    <h2>How We Use Your Information</h2>
    <p>We use the information we collect to:</p>
    <ul>
      <li>Provide laboratory testing services</li>
      <li>Process and deliver test results</li>
      <li>Communicate about our services</li>
      <li>Improve our website and services</li>
      <li>Comply with legal obligations</li>
    </ul>
    
    <h2>Information Sharing</h2>
    <p>We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy.</p>
    
    <h2>Data Security</h2>
    <p>We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>
    
    <h2>Contact Information</h2>
    <p>If you have questions about this Privacy Policy, please contact us at:</p>
    <p>Email: info@gramtarangfoodtesting.com</p>
    <p>Phone: +91-XXX-XXX-XXXX</p>`,
    metaDescription: 'Privacy Policy for Gram Tarang Food Testing Laboratory. Learn how we collect, use, and protect your personal information.',
    status: 'published'
  },
  {
    title: 'Terms of Service',
    pageType: 'terms-of-service',
    content: `<h1>Terms of Service</h1>
    
    <p>Last Updated: ${new Date().toLocaleDateString()}</p>
    
    <h2>Acceptance of Terms</h2>
    <p>By accessing and using our website and services, you accept and agree to be bound by the terms and provision of this agreement.</p>
    
    <h2>Laboratory Testing Services</h2>
    <p>Gram Tarang Food Testing Laboratory provides analytical testing services for:</p>
    <ul>
      <li>Food and agricultural products</li>
      <li>Water quality analysis</li>
      <li>Pharmaceutical testing</li>
      <li>Environmental samples</li>
      <li>Marine products</li>
    </ul>
    
    <h2>Sample Submission</h2>
    <p>Clients are responsible for:</p>
    <ul>
      <li>Proper sample collection and preservation</li>
      <li>Accurate completion of sample submission forms</li>
      <li>Timely payment of testing fees</li>
      <li>Compliance with safety regulations</li>
    </ul>
    
    <h2>Results and Reports</h2>
    <p>Test results are provided based on the samples as received. We are not responsible for sampling procedures unless specifically contracted to perform sampling.</p>
    
    <h2>Limitation of Liability</h2>
    <p>Our liability is limited to the cost of the testing services provided. We shall not be liable for any indirect, incidental, special, or consequential damages.</p>
    
    <h2>Intellectual Property</h2>
    <p>All content on this website, including text, graphics, logos, and images, is the property of Gram Tarang Food Testing Laboratory.</p>`,
    metaDescription: 'Terms of Service for Gram Tarang Food Testing Laboratory. Understanding your rights and obligations when using our services.',
    status: 'published'
  },
  {
    title: 'About Us',
    pageType: 'about-us',
    content: `<h1>About Gram Tarang Food Testing Laboratory</h1>
    
    <h2>Our Mission</h2>
    <p>To provide accurate, reliable, and timely analytical testing services that support food safety, quality assurance, and regulatory compliance across diverse industries.</p>
    
    <h2>Our Vision</h2>
    <p>To be the leading food testing laboratory in India, recognized for excellence in analytical services, innovation, and customer satisfaction.</p>
    
    <h2>Our History</h2>
    <p>Established in 2020, Gram Tarang Food Testing Laboratory has been serving the food industry with comprehensive testing solutions. Our NABL-accredited facility combines state-of-the-art technology with expert knowledge to deliver reliable results.</p>
    
    <h2>Our Services</h2>
    <ul>
      <li><strong>Food Safety Testing:</strong> Pathogen detection, contamination screening</li>
      <li><strong>Chemical Analysis:</strong> Pesticide residues, heavy metals, additives</li>
      <li><strong>Nutritional Analysis:</strong> Macro and micronutrients, vitamins</li>
      <li><strong>Microbiological Testing:</strong> Total plate count, specific pathogens</li>
      <li><strong>Water Quality Testing:</strong> Physical, chemical, and biological parameters</li>
    </ul>
    
    <h2>Quality Assurance</h2>
    <p>Our laboratory maintains strict quality control measures and is accredited by NABL (National Accreditation Board for Testing and Calibration Laboratories). We follow ISO/IEC 17025 standards to ensure the highest level of accuracy and reliability.</p>
    
    <h2>Our Team</h2>
    <p>Our experienced team of scientists, technicians, and quality assurance professionals are dedicated to providing exceptional service and maintaining the highest standards of analytical excellence.</p>`,
    metaDescription: 'Learn about Gram Tarang Food Testing Laboratory - our mission, services, and commitment to quality in food safety testing.',
    status: 'published'
  },
  {
    title: 'Contact Us',
    pageType: 'contact-us',
    content: `<h1>Contact Information</h1>
    
    <h2>Get in Touch</h2>
    <p>We're here to help with all your food testing needs. Contact us using any of the methods below:</p>
    
    <h2>Laboratory Address</h2>
    <p><strong>Gram Tarang Food Testing Laboratory</strong><br>
    Plot No. 123, Industrial Area<br>
    Bhubaneswar, Odisha 751024<br>
    India</p>
    
    <h2>Contact Details</h2>
    <p><strong>Phone:</strong> +91-XXX-XXX-XXXX<br>
    <strong>Email:</strong> info@gramtarangfoodtesting.com<br>
    <strong>Website:</strong> www.gramtarangfoodtesting.com</p>
    
    <h2>Business Hours</h2>
    <p><strong>Monday - Friday:</strong> 9:00 AM - 6:00 PM<br>
    <strong>Saturday:</strong> 9:00 AM - 2:00 PM<br>
    <strong>Sunday:</strong> Closed</p>
    
    <h2>Emergency Contact</h2>
    <p>For urgent testing requirements:</p>
    <p><strong>Emergency Hotline:</strong> +91-XXX-XXX-XXXX<br>
    <strong>Email:</strong> emergency@gramtarangfoodtesting.com</p>
    
    <h2>Sample Submission</h2>
    <p>Samples can be submitted during business hours. Please ensure proper labeling and documentation. For sample collection services, please contact us in advance.</p>
    
    <h2>Directions</h2>
    <p>Our laboratory is easily accessible by road and is located in the heart of Bhubaneswar's industrial area. Parking facilities are available on-site.</p>`,
    metaDescription: 'Contact Gram Tarang Food Testing Laboratory for all your testing needs. Find our address, phone, email, and business hours.',
    status: 'published'
  },
  {
    title: 'Disclaimer',
    pageType: 'disclaimer',
    content: `<h1>Disclaimer</h1>
    
    <h2>General Information</h2>
    <p>The information on this website is provided on an "as is" basis. To the fullest extent permitted by law, Gram Tarang Food Testing Laboratory:</p>
    <ul>
      <li>Excludes all representations and warranties relating to this website and its contents</li>
      <li>Does not warrant that the website will be constantly available or available at all</li>
      <li>Reserves the right to change, modify, or discontinue any aspect of the website</li>
    </ul>
    
    <h2>Professional Advice</h2>
    <p>The content on this website is for informational purposes only and should not be considered as professional advice. Always consult with qualified professionals for specific testing requirements and regulatory compliance.</p>
    
    <h2>Test Results</h2>
    <p>Laboratory test results are based on samples as received and tested according to specified methods. Results may not be representative of the entire batch or lot from which samples were taken.</p>
    
    <h2>External Links</h2>
    <p>This website may contain links to external websites. We have no control over the nature, content, and availability of those sites and are not responsible for their content.</p>
    
    <h2>Limitation of Liability</h2>
    <p>In no event shall Gram Tarang Food Testing Laboratory be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of this website or our services.</p>`,
    metaDescription: 'Important disclaimer information for Gram Tarang Food Testing Laboratory website and services.',
    status: 'published'
  }
];

const createDefaultPages = async () => {
  try {
    console.log('🔄 Creating default pages...');
    
    // Find an admin user to set as author
    const admin = await Admin.findOne();
    if (!admin) {
      console.error('❌ No admin user found. Please create an admin user first.');
      return;
    }
    
    // Check if pages already exist
    const existingPages = await Page.find();
    if (existingPages.length > 0) {
      console.log('ℹ️  Pages already exist. Skipping creation.');
      return;
    }
    
    // Create pages with admin as author
    const pages = defaultPages.map(page => ({
      ...page,
      author: admin._id
    }));
    
    await Page.insertMany(pages);
    
    console.log(`✅ Successfully created ${pages.length} default pages:`);
    pages.forEach(page => {
      console.log(`   - ${page.title} (${page.pageType})`);
    });
    
  } catch (error) {
    console.error('❌ Error creating default pages:', error);
  }
};

const main = async () => {
  await connectDB();
  await createDefaultPages();
  
  console.log('✅ Default pages creation completed!');
  mongoose.connection.close();
};

if (require.main === module) {
  main();
}

module.exports = { createDefaultPages };
