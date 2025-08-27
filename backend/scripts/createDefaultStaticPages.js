const mongoose = require('mongoose');
const Page = require('../models/Page');
const connectDB = require('../config/database');

const defaultPages = [
  {
    title: 'Privacy Policy',
    slug: 'privacy-policy',
    pageType: 'privacy-policy',
    status: 'published',
    content: `<h1>Privacy Policy</h1>

<p><strong>Effective Date:</strong> January 1, 2024</p>

<h2>1. Introduction</h2>
<p>Gram Tarang Food Testing Laboratory ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.</p>

<h2>2. Information We Collect</h2>
<h3>2.1 Personal Information</h3>
<ul>
<li>Name, email address, phone number</li>
<li>Company information and job title</li>
<li>Billing and shipping addresses</li>
<li>Payment information (processed securely through third-party providers)</li>
</ul>

<h3>2.2 Technical Information</h3>
<ul>
<li>IP address and browser information</li>
<li>Device type and operating system</li>
<li>Website usage patterns and preferences</li>
<li>Cookies and similar tracking technologies</li>
</ul>

<h2>3. How We Use Your Information</h2>
<p>We use collected information to:</p>
<ul>
<li>Provide and improve our testing services</li>
<li>Process orders and manage customer accounts</li>
<li>Send service updates and promotional communications</li>
<li>Comply with legal and regulatory requirements</li>
<li>Enhance website functionality and user experience</li>
</ul>

<h2>4. Information Sharing</h2>
<p>We do not sell, trade, or rent your personal information. We may share information with:</p>
<ul>
<li>Service providers and business partners</li>
<li>Legal authorities when required by law</li>
<li>Third parties with your explicit consent</li>
</ul>

<h2>5. Data Security</h2>
<p>We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no internet transmission is 100% secure.</p>

<h2>6. Your Rights</h2>
<p>You have the right to:</p>
<ul>
<li>Access and update your personal information</li>
<li>Request deletion of your data</li>
<li>Opt-out of marketing communications</li>
<li>Lodge complaints with relevant authorities</li>
</ul>

<h2>7. Cookies Policy</h2>
<p>Our website uses cookies to enhance user experience. You can control cookie preferences through your browser settings.</p>

<h2>8. Contact Information</h2>
<p>For privacy-related questions or concerns, contact us at:</p>
<ul>
<li>Email: privacy@gramtarangfoodtesting.com</li>
<li>Phone: +91-XXX-XXX-XXXX</li>
<li>Address: Gram Tarang Food Testing Laboratory, Bhubaneswar, Odisha</li>
</ul>

<h2>9. Policy Updates</h2>
<p>We may update this Privacy Policy periodically. Changes will be posted on this page with an updated effective date.</p>`,
    metaDescription: 'Privacy Policy for Gram Tarang Food Testing Laboratory. Learn how we collect, use, and protect your personal information.',
    isIndexable: true,
    author: null // Will be set to admin user
  },
  {
    title: 'Terms of Service',
    slug: 'terms-of-service',
    pageType: 'terms-of-service',
    status: 'published',
    content: `<h1>Terms of Service</h1>

<p><strong>Effective Date:</strong> January 1, 2024</p>

<h2>1. Agreement to Terms</h2>
<p>By accessing and using Gram Tarang Food Testing Laboratory's website and services, you agree to be bound by these Terms of Service and all applicable laws and regulations.</p>

<h2>2. Description of Services</h2>
<p>Gram Tarang Food Testing Laboratory provides:</p>
<ul>
<li>Food safety testing and analysis</li>
<li>Microbiological testing services</li>
<li>Chemical analysis and contamination testing</li>
<li>Nutritional analysis and labeling support</li>
<li>Regulatory compliance consulting</li>
</ul>

<h2>3. User Responsibilities</h2>
<h3>3.1 Account Information</h3>
<ul>
<li>Provide accurate and complete information</li>
<li>Maintain the security of account credentials</li>
<li>Notify us immediately of unauthorized use</li>
</ul>

<h3>3.2 Sample Submission</h3>
<ul>
<li>Follow proper sampling and labeling procedures</li>
<li>Provide accurate sample information</li>
<li>Ensure samples are safe to handle</li>
</ul>

<h2>4. Payment Terms</h2>
<h3>4.1 Pricing</h3>
<ul>
<li>All prices are in Indian Rupees (INR)</li>
<li>Prices may change without prior notice</li>
<li>Additional charges may apply for expedited services</li>
</ul>

<h3>4.2 Payment Methods</h3>
<ul>
<li>Cash, bank transfer, or online payment</li>
<li>Payment due before sample testing begins</li>
<li>Corporate accounts available with credit terms</li>
</ul>

<h2>5. Service Delivery</h2>
<h3>5.1 Turnaround Times</h3>
<ul>
<li>Standard turnaround: 3-7 business days</li>
<li>Express service available for urgent requests</li>
<li>Times may vary based on test complexity</li>
</ul>

<h3>5.2 Report Delivery</h3>
<ul>
<li>Reports delivered via email in PDF format</li>
<li>Hard copies available upon request</li>
<li>Reports remain confidential to authorized personnel</li>
</ul>

<h2>6. Limitation of Liability</h2>
<p>Our liability is limited to the cost of testing services. We are not responsible for:</p>
<ul>
<li>Decisions made based on test results</li>
<li>Consequential or indirect damages</li>
<li>Delays due to circumstances beyond our control</li>
</ul>

<h2>7. Quality Assurance</h2>
<ul>
<li>NABL accredited testing procedures</li>
<li>ISO-certified quality management</li>
<li>Regular proficiency testing participation</li>
<li>Continuous training and certification</li>
</ul>

<h2>8. Intellectual Property</h2>
<p>All website content, testing methods, and reports remain our intellectual property. Unauthorized reproduction is prohibited.</p>

<h2>9. Termination</h2>
<p>We reserve the right to terminate services for:</p>
<ul>
<li>Violation of these terms</li>
<li>Non-payment of fees</li>
<li>Fraudulent or illegal activities</li>
</ul>

<h2>10. Governing Law</h2>
<p>These terms are governed by Indian law and subject to the jurisdiction of Odisha courts.</p>

<h2>11. Contact Information</h2>
<p>For questions about these terms, contact:</p>
<ul>
<li>Email: legal@gramtarangfoodtesting.com</li>
<li>Phone: +91-XXX-XXX-XXXX</li>
<li>Address: Gram Tarang Food Testing Laboratory, Bhubaneswar, Odisha</li>
</ul>`,
    metaDescription: 'Terms of Service for Gram Tarang Food Testing Laboratory. Read our service terms, payment policies, and user responsibilities.',
    isIndexable: true,
    author: null
  },
  {
    title: 'Sitemap',
    slug: 'sitemap',
    pageType: 'sitemap',
    status: 'published',
    content: `<h1>Sitemap</h1>

<p>Find all pages and sections of the Gram Tarang Food Testing Laboratory website:</p>

<h2>Main Pages</h2>
<ul>
<li><a href="/">Home</a> - Welcome to our laboratory</li>
<li><a href="/about">About Us</a> - Learn about our mission and expertise</li>
<li><a href="/services">Services</a> - Comprehensive testing services</li>
<li><a href="/equipment">Equipment</a> - State-of-the-art testing equipment</li>
<li><a href="/team">Team</a> - Our expert professionals</li>
<li><a href="/blog">Blog</a> - Latest news and insights</li>
<li><a href="/contact">Contact</a> - Get in touch with us</li>
</ul>

<h2>Services</h2>
<ul>
<li><a href="/services#chemical-analysis">Chemical Analysis</a></li>
<li><a href="/services#microbiological-testing">Microbiological Testing</a></li>
<li><a href="/services#nutritional-analysis">Nutritional Analysis</a></li>
<li><a href="/services#water-testing">Water Quality Testing</a></li>
<li><a href="/services#pesticide-testing">Pesticide Residue Analysis</a></li>
<li><a href="/services#heavy-metals">Heavy Metal Detection</a></li>
</ul>

<h2>Testing Categories</h2>
<ul>
<li>Food Safety Testing</li>
<li>Pharmaceutical Analysis</li>
<li>Marine Product Testing</li>
<li>Agricultural Product Testing</li>
<li>Environmental Testing</li>
<li>Industrial Testing</li>
</ul>

<h2>Resources</h2>
<ul>
<li><a href="/blog">Technical Articles</a></li>
<li><a href="/equipment">Laboratory Equipment</a></li>
<li><a href="/team">Expert Profiles</a></li>
<li>Sample Submission Guidelines</li>
<li>Testing Procedures</li>
<li>Quality Certifications</li>
</ul>

<h2>Career & Training</h2>
<ul>
<li><a href="/internship">Internship Programs</a></li>
<li>Training Workshops</li>
<li>Career Opportunities</li>
<li>Student Projects</li>
</ul>

<h2>Support</h2>
<ul>
<li><a href="/contact">Contact Form</a></li>
<li>Service Request</li>
<li>Technical Support</li>
<li>Billing Inquiries</li>
<li>Report Status</li>
</ul>

<h2>Legal</h2>
<ul>
<li><a href="/privacy-policy">Privacy Policy</a></li>
<li><a href="/terms-of-service">Terms of Service</a></li>
<li>Disclaimer</li>
<li>Refund Policy</li>
</ul>

<h2>AI Features</h2>
<ul>
<li>AI ChatBot Support</li>
<li>Smart Testing Recommendations</li>
<li>Intelligent Report Analysis</li>
<li>Automated Quality Insights</li>
</ul>

<h2>Accreditations</h2>
<ul>
<li>NABL Accreditation</li>
<li>ISO Certification</li>
<li>Quality Standards</li>
<li>Compliance Certificates</li>
</ul>

<p><strong>Last Updated:</strong> January 2024</p>
<p>For additional information or if you cannot find what you're looking for, please <a href="/contact">contact us</a>.</p>`,
    metaDescription: 'Complete sitemap of Gram Tarang Food Testing Laboratory website. Find all pages, services, and resources easily.',
    isIndexable: true,
    author: null
  }
];

const createDefaultPages = async () => {
  try {
    console.log('🔄 Connecting to database...');
    await connectDB();

    // Find admin user to set as author
    const Admin = require('../models/Admin');
    const adminUser = await Admin.findOne({ role: 'super_admin' });
    
    if (!adminUser) {
      console.log('❌ No admin user found. Please create an admin user first.');
      return;
    }

    console.log(`👤 Using admin user: ${adminUser.username}`);

    // Set author for all pages
    defaultPages.forEach(page => {
      page.author = adminUser._id;
    });

    console.log('📄 Creating default static pages...');

    for (const pageData of defaultPages) {
      try {
        // Check if page already exists
        const existingPage = await Page.findOne({ slug: pageData.slug });
        
        if (existingPage) {
          console.log(`⚠️  Page "${pageData.title}" already exists, skipping...`);
          continue;
        }

        // Create new page
        const page = new Page(pageData);
        await page.save();
        console.log(`✅ Created page: ${pageData.title}`);
      } catch (error) {
        console.error(`❌ Error creating page "${pageData.title}":`, error.message);
      }
    }

    console.log('🎉 Default pages creation completed!');
    
    // List all pages
    const allPages = await Page.find({}).select('title slug pageType status');
    console.log('\n📋 Current pages in database:');
    allPages.forEach(page => {
      console.log(`  • ${page.title} (/${page.slug}) - ${page.status}`);
    });

  } catch (error) {
    console.error('❌ Error creating default pages:', error);
  } finally {
    process.exit(0);
  }
};

// Run the script
if (require.main === module) {
  createDefaultPages();
}

module.exports = createDefaultPages;
