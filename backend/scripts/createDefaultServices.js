const mongoose = require('mongoose');
const Service = require('../models/Service');
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

const defaultServices = [
  {
    name: 'Heavy Metal Analysis',
    description: `<p>Comprehensive heavy metal testing to ensure food safety and regulatory compliance. Our advanced ICP-MS technology provides accurate detection of toxic metals in food products.</p>
    
    <h3>What We Test:</h3>
    <ul>
      <li>Lead (Pb) - Detection limit: 0.01 ppm</li>
      <li>Mercury (Hg) - Detection limit: 0.005 ppm</li>
      <li>Cadmium (Cd) - Detection limit: 0.01 ppm</li>
      <li>Arsenic (As) - Detection limit: 0.01 ppm</li>
      <li>Chromium (Cr) - Detection limit: 0.05 ppm</li>
    </ul>
    
    <h3>Applications:</h3>
    <p>Food products, beverages, dietary supplements, infant foods, export compliance, regulatory submissions.</p>`,
    category: 'Chemical Analysis',
    price: '₹2,500 per sample',
    duration: '3-5 business days',
    features: ['ICP-MS Technology', 'NABL Accredited', 'Regulatory Compliance', 'Detailed Reports'],
    requirements: ['Minimum 100g sample', 'Proper labeling', 'Chain of custody'],
    methodology: 'Inductively Coupled Plasma Mass Spectrometry (ICP-MS)',
    instruments: ['ICP-MS', 'Microwave Digestion System'],
    standards: ['IS 11464', 'AOAC Methods', 'FSSAI Guidelines'],
    sampleTypes: ['Food Products', 'Beverages', 'Supplements', 'Raw Materials'],
    parameters: ['Lead', 'Mercury', 'Cadmium', 'Arsenic', 'Chromium'],
    status: 'active',
    featured: true,
    popular: true,
    tags: ['heavy metals', 'ICP-MS', 'food safety', 'regulatory'],
    certification: {
      nabl: true,
      iso: true
    },
    turnaroundTime: '3-5 business days',
    homeCollection: true,
    emergencyService: true
  },
  {
    name: 'Pesticide Residue Analysis',
    description: `<p>Multi-residue pesticide analysis using LC-MS/MS and GC-MS/MS technologies. Comprehensive screening for over 500 pesticides to ensure food safety.</p>
    
    <h3>Scope of Testing:</h3>
    <ul>
      <li>Organochlorines (OCPs)</li>
      <li>Organophosphates (OPPs)</li>
      <li>Carbamates</li>
      <li>Pyrethroids</li>
      <li>Neonicotinoids</li>
      <li>Triazoles and other fungicides</li>
    </ul>
    
    <h3>Regulatory Compliance:</h3>
    <p>Testing according to FSSAI, EU MRL, Codex standards for domestic and export requirements.</p>`,
    category: 'Chemical Analysis',
    price: '₹4,500 per sample',
    duration: '5-7 business days',
    features: ['LC-MS/MS & GC-MS/MS', '500+ Pesticides', 'MRL Compliance', 'Export Certification'],
    requirements: ['Minimum 500g sample', 'Fresh samples preferred', 'Proper storage'],
    methodology: 'Liquid Chromatography-Tandem Mass Spectrometry (LC-MS/MS), Gas Chromatography-Tandem Mass Spectrometry (GC-MS/MS)',
    instruments: ['LC-MS/MS', 'GC-MS/MS', 'QuEChERS Extraction'],
    standards: ['FSSAI Guidelines', 'EU MRL', 'Codex Alimentarius'],
    sampleTypes: ['Fruits', 'Vegetables', 'Cereals', 'Pulses', 'Spices'],
    parameters: ['Multi-residue Pesticides', 'MRL Compliance'],
    status: 'active',
    featured: true,
    popular: true,
    tags: ['pesticides', 'LC-MS/MS', 'GC-MS/MS', 'MRL', 'export'],
    certification: {
      nabl: true,
      iso: true
    },
    turnaroundTime: '5-7 business days',
    homeCollection: true
  },
  {
    name: 'Microbiological Testing',
    description: `<p>Comprehensive microbiological analysis to ensure food safety and shelf-life determination. Testing for pathogenic and spoilage microorganisms.</p>
    
    <h3>Pathogen Testing:</h3>
    <ul>
      <li>Salmonella spp.</li>
      <li>E. coli O157:H7</li>
      <li>Listeria monocytogenes</li>
      <li>Campylobacter spp.</li>
      <li>Clostridium perfringens</li>
    </ul>
    
    <h3>Indicator Organisms:</h3>
    <ul>
      <li>Total Plate Count (TPC)</li>
      <li>Coliform bacteria</li>
      <li>Yeast and Mold count</li>
      <li>Enterobacteriaceae</li>
    </ul>`,
    category: 'Microbiological Testing',
    price: '₹1,800 per parameter',
    duration: '3-7 business days',
    features: ['Pathogen Detection', 'Shelf-life Studies', 'HACCP Support', 'Rapid Methods'],
    requirements: ['Sterile sampling', 'Cold chain maintenance', 'Quick delivery'],
    methodology: 'Culture-based methods, Rapid detection systems, PCR techniques',
    instruments: ['Incubators', 'Autoclave', 'PCR System', 'VITEK System'],
    standards: ['IS 5887', 'AOAC Methods', 'FDA BAM'],
    sampleTypes: ['Ready-to-eat Foods', 'Raw Materials', 'Water', 'Environmental Swabs'],
    parameters: ['Pathogens', 'Indicator Organisms', 'Spoilage Bacteria'],
    status: 'active',
    featured: true,
    tags: ['microbiology', 'pathogens', 'food safety', 'HACCP'],
    certification: {
      nabl: true,
      iso: true
    },
    turnaroundTime: '3-7 business days',
    homeCollection: true,
    emergencyService: true
  },
  {
    name: 'Nutritional Analysis',
    description: `<p>Complete nutritional profiling for food labeling and regulatory compliance. Accurate determination of macro and micronutrients.</p>
    
    <h3>Macronutrients:</h3>
    <ul>
      <li>Protein content</li>
      <li>Total fat and fatty acid profile</li>
      <li>Carbohydrates and dietary fiber</li>
      <li>Energy value calculation</li>
    </ul>
    
    <h3>Micronutrients:</h3>
    <ul>
      <li>Vitamins (A, C, E, B-complex)</li>
      <li>Minerals (Ca, Fe, Zn, Na, K)</li>
      <li>Antioxidants</li>
    </ul>`,
    category: 'Nutritional Analysis',
    price: '₹3,200 per sample',
    duration: '5-7 business days',
    features: ['Complete Nutrition Profile', 'Label Compliance', 'Health Claims Support', 'Calorie Calculation'],
    requirements: ['Representative sample', 'Minimum 200g', 'Nutritional information'],
    methodology: 'AOAC Official Methods, Spectrophotometry, HPLC',
    instruments: ['HPLC', 'UV-Vis Spectrophotometer', 'Kjeldahl Apparatus'],
    standards: ['AOAC Methods', 'FSSAI Guidelines', 'IS Standards'],
    sampleTypes: ['Packaged Foods', 'Supplements', 'Baby Foods', 'Functional Foods'],
    parameters: ['Protein', 'Fat', 'Carbohydrates', 'Vitamins', 'Minerals'],
    status: 'active',
    featured: true,
    tags: ['nutrition', 'labeling', 'vitamins', 'minerals'],
    certification: {
      nabl: true,
      iso: true
    },
    turnaroundTime: '5-7 business days'
  },
  {
    name: 'Water Quality Analysis',
    description: `<p>Comprehensive water testing for drinking water, industrial water, and wastewater analysis according to IS 10500 and WHO guidelines.</p>
    
    <h3>Physical Parameters:</h3>
    <ul>
      <li>pH, turbidity, conductivity</li>
      <li>Total dissolved solids (TDS)</li>
      <li>Color and odor</li>
    </ul>
    
    <h3>Chemical Parameters:</h3>
    <ul>
      <li>Heavy metals</li>
      <li>Chlorine and fluoride</li>
      <li>Hardness and alkalinity</li>
      <li>Nitrates and sulfates</li>
    </ul>
    
    <h3>Biological Parameters:</h3>
    <ul>
      <li>Total coliform</li>
      <li>E. coli</li>
      <li>Fecal coliform</li>
    </ul>`,
    category: 'Quality Control',
    price: '₹2,800 per sample',
    duration: '3-5 business days',
    features: ['WHO Compliance', 'IS 10500 Standards', 'Potability Assessment', 'Regulatory Approval'],
    requirements: ['Sterile bottles', 'Proper sampling technique', 'Cold storage'],
    methodology: 'Standard Methods for Water Analysis, IS 3025',
    instruments: ['ICP-MS', 'Ion Chromatography', 'pH Meter', 'Turbidimeter'],
    standards: ['IS 10500', 'WHO Guidelines', 'CPCB Standards'],
    sampleTypes: ['Drinking Water', 'Groundwater', 'Surface Water', 'Treated Water'],
    parameters: ['Physical', 'Chemical', 'Biological'],
    status: 'active',
    featured: true,
    tags: ['water quality', 'drinking water', 'WHO', 'IS 10500'],
    certification: {
      nabl: true,
      iso: true
    },
    turnaroundTime: '3-5 business days',
    homeCollection: true
  },
  {
    name: 'Aflatoxin Testing',
    description: `<p>Precise determination of aflatoxins (B1, B2, G1, G2) in food products using HPLC with fluorescence detection. Critical for export and food safety compliance.</p>
    
    <h3>Aflatoxins Tested:</h3>
    <ul>
      <li>Aflatoxin B1 (most toxic)</li>
      <li>Aflatoxin B2</li>
      <li>Aflatoxin G1</li>
      <li>Aflatoxin G2</li>
      <li>Total Aflatoxins</li>
    </ul>
    
    <h3>Applications:</h3>
    <p>Cereals, nuts, spices, dried fruits, animal feed, and processed foods.</p>`,
    category: 'Contaminant Detection',
    price: '₹2,200 per sample',
    duration: '4-6 business days',
    features: ['HPLC-FLD Method', 'EU Standards', 'Export Compliance', 'Low Detection Limits'],
    requirements: ['Minimum 250g sample', 'Representative sampling', 'Dry storage'],
    methodology: 'High Performance Liquid Chromatography with Fluorescence Detection (HPLC-FLD)',
    instruments: ['HPLC-FLD', 'Immunoaffinity Columns'],
    standards: ['AOAC 991.31', 'EN 14123', 'FSSAI Guidelines'],
    sampleTypes: ['Cereals', 'Nuts', 'Spices', 'Dried Fruits', 'Animal Feed'],
    parameters: ['Aflatoxin B1', 'Aflatoxin B2', 'Aflatoxin G1', 'Aflatoxin G2'],
    status: 'active',
    featured: true,
    popular: true,
    tags: ['aflatoxins', 'mycotoxins', 'export', 'HPLC'],
    certification: {
      nabl: true,
      iso: true
    },
    turnaroundTime: '4-6 business days',
    emergencyService: true
  },
  {
    name: 'Food Allergen Testing',
    description: `<p>Detection and quantification of major food allergens to ensure product safety and accurate labeling for allergic consumers.</p>
    
    <h3>Allergens Tested:</h3>
    <ul>
      <li>Gluten (wheat, barley, rye, oats)</li>
      <li>Milk proteins (casein, whey)</li>
      <li>Egg proteins</li>
      <li>Soy proteins</li>
      <li>Peanuts</li>
      <li>Tree nuts</li>
      <li>Crustaceans</li>
      <li>Fish proteins</li>
    </ul>
    
    <h3>Methods:</h3>
    <p>ELISA-based immunoassays and PCR techniques for accurate detection and quantification.</p>`,
    category: 'Contaminant Detection',
    price: '₹1,500 per allergen',
    duration: '2-4 business days',
    features: ['ELISA & PCR Methods', 'Quantitative Results', 'Label Verification', 'Cross-contamination Detection'],
    requirements: ['Minimum 50g sample', 'Ingredient information', 'Processing details'],
    methodology: 'Enzyme-Linked Immunosorbent Assay (ELISA), Polymerase Chain Reaction (PCR)',
    instruments: ['ELISA Reader', 'PCR System', 'Extraction Equipment'],
    standards: ['AOAC Methods', 'FDA Guidelines', 'EU Regulations'],
    sampleTypes: ['Processed Foods', 'Baked Goods', 'Snacks', 'Ready Meals'],
    parameters: ['Major Allergens', 'Cross-contamination'],
    status: 'active',
    featured: true,
    tags: ['allergens', 'ELISA', 'PCR', 'labeling'],
    certification: {
      nabl: true,
      iso: true
    },
    turnaroundTime: '2-4 business days'
  },
  {
    name: 'Pharmaceutical Testing',
    description: `<p>Comprehensive pharmaceutical analysis for raw materials, finished products, and stability studies according to pharmacopeial standards.</p>
    
    <h3>Testing Services:</h3>
    <ul>
      <li>Identity and purity testing</li>
      <li>Assay and related substances</li>
      <li>Dissolution testing</li>
      <li>Microbiological limits</li>
      <li>Heavy metals and residual solvents</li>
      <li>Stability studies</li>
    </ul>
    
    <h3>Compliance:</h3>
    <p>Indian Pharmacopoeia (IP), United States Pharmacopoeia (USP), European Pharmacopoeia (EP), British Pharmacopoeia (BP).</p>`,
    category: 'Pharmaceutical Testing',
    price: '₹3,500 per parameter',
    duration: '5-10 business days',
    features: ['Pharmacopeial Compliance', 'Stability Studies', 'Method Development', 'Regulatory Support'],
    requirements: ['COA information', 'Specifications', 'Stability conditions'],
    methodology: 'HPLC, GC, UV-Vis Spectrophotometry, Titrimetry',
    instruments: ['HPLC', 'GC', 'UV-Vis', 'Dissolution Apparatus', 'Stability Chambers'],
    standards: ['IP', 'USP', 'EP', 'BP', 'ICH Guidelines'],
    sampleTypes: ['APIs', 'Tablets', 'Capsules', 'Injectables', 'Topicals'],
    parameters: ['Identity', 'Purity', 'Assay', 'Dissolution', 'Microbiology'],
    status: 'active',
    featured: false,
    tags: ['pharmaceuticals', 'APIs', 'USP', 'stability'],
    certification: {
      nabl: true,
      iso: true
    },
    turnaroundTime: '5-10 business days'
  }
];

const createDefaultServices = async () => {
  try {
    console.log('🔄 Creating default services...');
    
    // Find an admin user to set as creator
    const admin = await Admin.findOne();
    if (!admin) {
      console.error('❌ No admin user found. Please create an admin user first.');
      return;
    }
    
    // Check if services already exist
    const existingServices = await Service.find();
    if (existingServices.length > 0) {
      console.log('ℹ️  Services already exist. Skipping creation.');
      return;
    }
    
    // Create services with admin as creator
    const services = defaultServices.map(service => ({
      ...service,
      createdBy: admin._id,
      lastUpdatedBy: admin._id
    }));
    
    await Service.insertMany(services);
    
    console.log(`✅ Successfully created ${services.length} default services:`);
    services.forEach(service => {
      console.log(`   - ${service.name} (${service.category})`);
    });
    
  } catch (error) {
    console.error('❌ Error creating default services:', error);
  }
};

const main = async () => {
  await connectDB();
  await createDefaultServices();
  
  console.log('✅ Default services creation completed!');
  mongoose.connection.close();
};

if (require.main === module) {
  main();
}

module.exports = { createDefaultServices };
