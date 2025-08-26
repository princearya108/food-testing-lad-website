const mongoose = require('mongoose');
const Equipment = require('../models/Equipment');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/ftl', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const defaultEquipment = [
  {
    name: 'LC-MS/MS (Liquid Chromatography–Mass Spectrometry)',
    model: 'Waters Xevo TQD',
    manufacturer: 'Waters Corporation',
    category: 'Mass Spectrometry',
    description: 'High-performance liquid chromatography coupled with tandem mass spectrometry for precise analysis of complex samples.',
    technicalSpecs: 'Separates complex food/pharma matrices by LC and detects compounds by tandem MS (MRM) for high specificity and sub-ppb sensitivity.',
    applications: 'Ideal for multi-residue pesticides, mycotoxins, veterinary drugs, and polar contaminants analysis in food and pharmaceutical samples.',
    serialNumber: 'LC-MS-001',
    operatingStatus: 'Operational',
    location: {
      building: 'Main Laboratory',
      floor: 'Ground Floor',
      room: 'Chemical Analysis Lab',
      exactLocation: 'Section A'
    },
    responsiblePerson: {
      name: 'Dr. Bhadram Kalyan Chekraverthy',
      email: 'bhadram@gtftl.com',
      phone: '+91 9876543210',
      department: 'Chemical'
    },
    displayOrder: 1,
    isPublicDisplay: true,
    featured: true,
    isActive: true
  },
  {
    name: 'GC-MS/MS (Gas Chromatography–Mass Spectrometry)',
    model: 'Agilent 7890B-7000D',
    manufacturer: 'Agilent Technologies',
    category: 'Mass Spectrometry',
    description: 'Gas chromatography coupled with triple quadrupole mass spectrometry for volatile and semi-volatile compound analysis.',
    technicalSpecs: 'Analyzes volatile/semi-volatile contaminants with triple-quadrupole MS for selective, sensitive quantification.',
    applications: 'Used for pesticide residues, PAHs, residual solvents, flavor/fragrance profiling, and environmental volatiles analysis.',
    serialNumber: 'GC-MS-001',
    operatingStatus: 'Operational',
    location: {
      building: 'Main Laboratory',
      floor: 'Ground Floor',
      room: 'Chemical Analysis Lab',
      exactLocation: 'Section B'
    },
    responsiblePerson: {
      name: 'Mr. Victor Pradhan',
      email: 'victor@gtftl.com',
      phone: '+91 9876543212',
      department: 'Chemical'
    },
    displayOrder: 2,
    isPublicDisplay: true,
    featured: true,
    isActive: true
  },
  {
    name: 'ICP-MS (Inductively Coupled Plasma–Mass Spectrometry)',
    model: 'PerkinElmer NexION 2000',
    manufacturer: 'PerkinElmer',
    category: 'Mass Spectrometry',
    description: 'Advanced plasma-based mass spectrometry for trace and heavy metals analysis.',
    technicalSpecs: 'Quantifies trace/heavy metals at ppt–ppb levels after plasma ionization.',
    applications: 'Supports compliance testing for As, Cd, Pb, Hg and broad elemental panels in foods, water, pharma inputs, and forensic samples.',
    serialNumber: 'ICP-MS-001',
    operatingStatus: 'Operational',
    location: {
      building: 'Main Laboratory',
      floor: 'Ground Floor',
      room: 'Chemical Analysis Lab',
      exactLocation: 'Section C'
    },
    responsiblePerson: {
      name: 'Ms. Debarati Nandi',
      email: 'debarati@gtftl.com',
      phone: '+91 9876543213',
      department: 'Chemical'
    },
    displayOrder: 3,
    isPublicDisplay: true,
    featured: true,
    isActive: true
  },
  {
    name: 'HPLC (High-Performance Liquid Chromatography)',
    model: 'Waters Alliance e2695',
    manufacturer: 'Waters Corporation',
    category: 'Chromatography',
    description: 'High-performance liquid chromatography system for separation and analysis of non-volatile compounds.',
    technicalSpecs: 'Chromatographic separation with UV/FLD/RI detection for non-volatile analytes.',
    applications: 'Common for preservatives, colors, amino acids, vitamins, sugars, phenolics, and stability/assay work.',
    serialNumber: 'HPLC-001',
    operatingStatus: 'Operational',
    location: {
      building: 'Main Laboratory',
      floor: 'Ground Floor',
      room: 'Chemical Analysis Lab',
      exactLocation: 'Section D'
    },
    responsiblePerson: {
      name: 'Mr. Badal Kumar Biswal',
      email: 'badal@gtftl.com',
      phone: '+91 9876543215',
      department: 'Chemical'
    },
    displayOrder: 4,
    isPublicDisplay: true,
    featured: false,
    isActive: true
  },
  {
    name: 'Microbiology Incubator',
    model: 'Thermo Scientific Heratherm',
    manufacturer: 'Thermo Fisher Scientific',
    category: 'Microbiology',
    description: 'Precision incubator for microbiological testing and culture growth.',
    technicalSpecs: 'Controlled sterile environment for enumeration and pathogen detection per IS/FSSAI/ISO methods.',
    applications: 'TVC, coliforms/E. coli, Salmonella, yeast & mold, and hygiene/environmental monitoring using validated media.',
    serialNumber: 'INCUB-001',
    operatingStatus: 'Operational',
    location: {
      building: 'Main Laboratory',
      floor: 'Ground Floor',
      room: 'Microbiology Lab',
      exactLocation: 'Section A'
    },
    responsiblePerson: {
      name: 'Dr. Pratyush Kumar Das',
      email: 'pratyush@gtftl.com',
      phone: '+91 9876543211',
      department: 'Biological'
    },
    displayOrder: 5,
    isPublicDisplay: true,
    featured: false,
    isActive: true
  },
  {
    name: 'CO₂ Incubator - Cell Culture',
    model: 'Thermo Scientific Heracell VIOS 160i',
    manufacturer: 'Thermo Fisher Scientific',
    category: 'Cell Culture',
    description: 'Advanced CO₂ incubator for animal cell culture and in-vitro analysis.',
    technicalSpecs: 'CO₂ incubators, biosafety cabinets, and microscopy for sterile cell-based assays.',
    applications: 'Supports in-vitro toxicity screening, bioactivity evaluation of nutraceutical extracts, and mechanism studies under SOP-driven conditions.',
    serialNumber: 'CO2-001',
    operatingStatus: 'Operational',
    location: {
      building: 'Main Laboratory',
      floor: 'First Floor',
      room: 'Cell Culture Lab',
      exactLocation: 'Section A'
    },
    responsiblePerson: {
      name: 'Ms. Swapna Rani Nag',
      email: 'swapna@gtftl.com',
      phone: '+91 9876543214',
      department: 'Biological'
    },
    displayOrder: 6,
    isPublicDisplay: true,
    featured: false,
    isActive: true
  }
];

const createDefaultEquipment = async () => {
  try {
    console.log('Creating default equipment...');

    // Check if equipment already exist
    const existingEquipmentCount = await Equipment.countDocuments();
    if (existingEquipmentCount > 0) {
      console.log('Default equipment already exist. Skipping creation.');
      process.exit(0);
    }

    // Create equipment
    const equipmentPromises = defaultEquipment.map(equipment => {
      const equipmentItem = new Equipment(equipment);
      return equipmentItem.save();
    });

    await Promise.all(equipmentPromises);

    console.log(`✅ Successfully created ${defaultEquipment.length} equipment items!`);

    // Display created equipment
    console.log('\nCreated equipment:');
    defaultEquipment.forEach((equipment, index) => {
      console.log(`${index + 1}. ${equipment.name} - ${equipment.category} (${equipment.operatingStatus})`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error creating default equipment:', error);
    process.exit(1);
  }
};

// Run the script
createDefaultEquipment();
