import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { 
  FaFlask, 
  FaMicroscope, 
  FaCogs, 
  FaChartLine,
  FaAtom,
  FaEye,
  FaTimes,
  FaPlay,
  FaInfoCircle
} from 'react-icons/fa';

const Equipment = () => {
  const [heroRef, heroInView] = useInView({ threshold: 0.3, triggerOnce: true });
  const [equipmentRef, equipmentInView] = useInView({ threshold: 0.3, triggerOnce: true });
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Equipment', icon: FaCogs },
    { id: 'chromatography', name: 'Chromatography', icon: FaChartLine },
    { id: 'spectroscopy', name: 'Spectroscopy', icon: FaAtom },
    { id: 'microbiology', name: 'Microbiology', icon: FaMicroscope },
    { id: 'analysis', name: 'Analysis', icon: FaFlask }
  ];

  const equipment = [
    {
      id: 1,
      name: 'LC-MS/MS',
      fullName: 'Liquid Chromatography–Mass Spectrometry',
      category: 'chromatography',
      image: '/images/IMG_20250821_132458896.jpg',
      description: 'Separates complex food/pharma matrices by LC and detects compounds by tandem MS (MRM) for high specificity and sub-ppb sensitivity. Ideal for multi-residue pesticides, mycotoxins, veterinary drugs, and polar contaminants.',
      applications: [
        'Pesticide residue analysis',
        'Drug metabolite identification',
        'Food contaminant detection',
        'Pharmaceutical quality control'
      ],
      specifications: {
        'Detection Limit': 'pg/mL level',
        'Sample Volume': '1-100 μL',
        'Analysis Time': '10-30 minutes',
        'Accuracy': '±2%'
      },
      icon: FaChartLine,
      color: 'bg-blue-500'
    },
    {
      id: 2,
      name: 'GC-MS/MS',
      fullName: 'Gas Chromatography–Mass Spectrometry',
      category: 'chromatography',
      image: '/images/IMG_20250821_132516623.jpg',
      description: 'Analyzes volatile/semi-volatile contaminants with triple-quadrupole MS for selective, sensitive quantification. Used for pesticide residues, PAHs, residual solvents, flavor/fragrance profiling, and environmental volatiles.',
      applications: [
        'VOC analysis',
        'Essential oil composition',
        'Environmental contaminants',
        'Flavor and fragrance analysis'
      ],
      specifications: {
        'Temperature Range': '35-450°C',
        'Injection Volume': '0.1-2.0 μL',
        'Carrier Gas': 'Helium/Nitrogen',
        'Detection': 'Full scan & SIM modes'
      },
      icon: FaChartLine,
      color: 'bg-green-500'
    },
    {
      id: 3,
      name: 'ICP-MS',
      fullName: 'Inductively Coupled Plasma–Mass Spectrometry',
      category: 'spectroscopy',
      image: '/images/IMG_20250821_132537634.jpg',
      description: 'Quantifies trace/heavy metals at ppt–ppb levels after plasma ionization. Supports compliance testing for As, Cd, Pb, Hg and broad elemental panels in foods, water, pharma inputs, and forensic samples.',
      applications: [
        'Heavy metal analysis',
        'Trace element determination',
        'Water quality testing',
        'Food safety analysis'
      ],
      specifications: {
        'Detection Range': 'ppb to % levels',
        'Elements': '70+ elements',
        'Sample Volume': '1-10 mL',
        'Precision': '<3% RSD'
      },
      icon: FaAtom,
      color: 'bg-purple-500'
    },
    {
      id: 4,
      name: 'HPLC',
      fullName: 'High-Performance Liquid Chromatography',
      category: 'chromatography',
      image: '/images/IMG_20250821_132559084.jpg',
      description: 'Chromatographic separation with UV/FLD/RI detection for non-volatile analytes. Common for preservatives, colors, amino acids, vitamins, sugars, phenolics, and stability/assay work.',
      applications: [
        'Vitamin analysis',
        'Amino acid profiling',
        'Pharmaceutical analysis',
        'Food additive determination'
      ],
      specifications: {
        'Flow Rate': '0.1-10 mL/min',
        'Pressure': 'Up to 400 bar',
        'Temperature': '4-80°C',
        'Detection': 'UV/Vis, Fluorescence'
      },
      icon: FaChartLine,
      color: 'bg-cyan-500'
    },
    {
      id: 5,
      name: 'FTIR',
      fullName: 'Fourier Transform Infrared Spectroscopy',
      category: 'spectroscopy',
      image: '/images/IMG_20250821_132615414.jpg',
      description: 'Rapid fingerprinting of functional groups using ATR or transmission modes. Useful for identity testing, detection of adulteration in oils/fats, polymer/packaging checks, and verification against reference spectra.',
      applications: [
        'Material identification',
        'Purity assessment',
        'Contamination analysis',
        'Quality control'
      ],
      specifications: {
        'Wavelength Range': '400-4000 cm⁻¹',
        'Resolution': '0.5 cm⁻¹',
        'Sample Types': 'Solid, liquid, gas',
        'Scan Time': '1-10 seconds'
      },
      icon: FaAtom,
      color: 'bg-orange-500'
    },
    {
      id: 6,
      name: 'UV-Vis Spectrophotometer',
      fullName: 'Ultraviolet-Visible Spectrophotometer',
      category: 'spectroscopy',
      image: '/images/IMG_20250821_132650232.jpg',
      description: 'Absorbance-based quantification for routine assays (colorimetric nutrients, nitrates, phosphates, phenolics, protein by Bradford/Lowry, etc.). Supports water quality and formulation analysis.',
      applications: [
        'Concentration determination',
        'Protein analysis',
        'DNA/RNA quantification',
        'Color measurement'
      ],
      specifications: {
        'Wavelength Range': '190-1100 nm',
        'Bandwidth': '0.1-5.0 nm',
        'Accuracy': '±0.3 nm',
        'Stray Light': '<0.03%'
      },
      icon: FaAtom,
      color: 'bg-indigo-500'
    },
    {
      id: 7,
      name: 'Bomb Calorimeter',
      fullName: 'Bomb Calorimeter',
      category: 'analysis',
      image: '/images/IMG_20250821_132700981.jpg',
      description: 'Measures gross calorific value (energy) of foods, feeds, and biomass to support nutritional labeling and R&D on product reformulation.',
      applications: [
        'Food energy analysis',
        'Fuel value determination',
        'Nutritional labeling',
        'Quality assessment'
      ],
      specifications: {
        'Temperature Range': '15-35°C',
        'Pressure': 'Up to 40 atm',
        'Precision': '±0.1%',
        'Sample Weight': '0.5-1.5 g'
      },
      icon: FaFlask,
      color: 'bg-red-500'
    },
    {
      id: 8,
      name: 'Protein Analyzer',
      fullName: 'Automated Protein Analyzer',
      category: 'analysis',
      image: '/images/IMG_20250821_132720113.jpg',
      description: 'Automated Kjeldahl/Dumas nitrogen determination converted to protein content. Enables accurate protein claims and raw-material QC.',
      applications: [
        'Food protein analysis',
        'Feed quality testing',
        'Nutritional analysis',
        'Quality control'
      ],
      specifications: {
        'Method': 'Kjeldahl/Dumas',
        'Range': '0.1-40% protein',
        'Accuracy': '±0.5%',
        'Sample Size': '0.1-2.0 g'
      },
      icon: FaFlask,
      color: 'bg-teal-500'
    },
    {
      id: 9,
      name: 'Fat Analyzer',
      fullName: 'Automated Fat Analyzer',
      category: 'analysis',
      image: '/images/IMG_20250821_132737052.jpg',
      description: 'Solvent-extraction or rapid techniques to determine total fat/oil in foods and ingredients. Supports label claims, process control, and adulteration checks.',
      applications: [
        'Fat content analysis',
        'Oil extraction',
        'Nutritional labeling',
        'Quality assessment'
      ],
      specifications: {
        'Method': 'Soxhlet extraction',
        'Range': '0.1-50% fat',
        'Extraction Time': '2-8 hours',
        'Sample Capacity': '6-12 samples'
      },
      icon: FaFlask,
      color: 'bg-yellow-500'
    },
    {
      id: 10,
      name: 'Fiber Analyzer',
      fullName: 'Automated Fiber Analyzer',
      category: 'analysis',
      image: '/images/IMG_20250821_132800027.jpg',
      description: 'Determines crude fiber (and, where applicable, ADF/NDF) via standardized digestion workflows. Useful for cereals, pulses, feeds, and dietary formulations.',
      applications: [
        'Dietary fiber analysis',
        'Feed analysis',
        'Nutritional labeling',
        'Research studies'
      ],
      specifications: {
        'Method': 'Enzymatic-gravimetric',
        'Range': '0.1-95% fiber',
        'Precision': '±2%',
        'Analysis Time': '4-6 hours'
      },
      icon: FaFlask,
      color: 'bg-lime-500'
    },
    {
      id: 11,
      name: 'Microbiology Laboratory',
      fullName: 'Complete Microbiology Facility',
      category: 'microbiology',
      image: '/images/IMG_20250821_132831498.jpg',
      description: 'Controlled sterile labs for enumeration and pathogen detection per IS/FSSAI/ISO methods—TVC, coliforms/E. coli, Salmonella, yeast & mold, and hygiene/environmental monitoring—using incubators, autoclaves, biosafety cabinets, and validated media.',
      applications: [
        'Pathogen detection',
        'Contamination testing',
        'Water quality analysis',
        'Food safety testing'
      ],
      specifications: {
        'Biosafety Level': 'BSL-1/BSL-2',
        'Incubation': '4-65°C',
        'Atmosphere': 'Aerobic/Anaerobic',
        'Capacity': '100+ samples/day'
      },
      icon: FaMicroscope,
      color: 'bg-emerald-500'
    },
    {
      id: 12,
      name: 'Cell Culture Facility',
      fullName: 'Animal Cell Culture Laboratory',
      category: 'microbiology',
      image: '/images/IMG_20250821_132848228.jpg',
      description: 'CO₂ incubators, biosafety cabinets, and microscopy for sterile cell-based assays. Supports in-vitro toxicity screening, bioactivity evaluation of nutraceutical extracts, and mechanism studies under SOP-driven conditions.',
      applications: [
        'Cell line maintenance',
        'Cytotoxicity assays',
        'Drug screening',
        'Research applications'
      ],
      specifications: {
        'CO₂ Incubators': '5% CO₂, 37°C',
        'Sterility': 'HEPA filtered',
        'Monitoring': '24/7 automated',
        'Capacity': 'Multiple cell lines'
      },
      icon: FaMicroscope,
      color: 'bg-violet-500'
    },
    {
      id: 13,
      name: 'In Silico Analysis',
      fullName: 'Computational Biology & Bioinformatics',
      category: 'analysis',
      image: '/images/IMG_20250821_133004301.jpg',
      description: 'Computational pipelines for method development and risk assessment: cheminformatics/QSAR, molecular docking, ADME-tox prediction, multivariate statistics, and data visualization to complement wet-lab results.',
      applications: [
        'Molecular docking studies',
        'QSAR modeling',
        'ADME-tox prediction',
        'Data visualization'
      ],
      specifications: {
        'Software Suite': 'ChemDraw, MOE, R, Python',
        'Computing Power': 'High-performance workstations',
        'Analysis Types': 'QSAR, Docking, Statistics',
        'Output Formats': 'Reports, Visualizations'
      },
      icon: FaFlask,
      color: 'bg-indigo-500'
    }
  ];

  const filteredEquipment = selectedCategory === 'all' 
    ? equipment 
    : equipment.filter(eq => eq.category === selectedCategory);

  const openModal = (equipment) => {
    setSelectedEquipment(equipment);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setSelectedEquipment(null);
    document.body.style.overflow = 'unset';
  };

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section ref={heroRef} className="py-20 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center space-y-8"
          >
            <h1 className="text-5xl md:text-6xl font-bold">
              Laboratory <span className="text-blue-200">Equipment</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-4xl mx-auto leading-relaxed">
              State-of-the-art analytical instruments for precision testing and research
            </p>
            <div className="flex justify-center items-center space-x-8">
              <div className="flex items-center space-x-2">
                <FaCogs className="h-6 w-6 text-green-400" />
                <span className="text-sm font-medium">13+ Instruments</span>
              </div>
              <div className="flex items-center space-x-2">
                <FaAtom className="h-6 w-6 text-yellow-400" />
                <span className="text-sm font-medium">Advanced Technology</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-white sticky top-16 z-40 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                }`}
              >
                <category.icon className="h-4 w-4" />
                <span>{category.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Equipment Grid */}
      <section ref={equipmentRef} className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={equipmentInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Our <span className="text-gradient">Equipment</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Cutting-edge analytical instruments ensuring accurate and reliable results
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="wait">
              {filteredEquipment.map((item, index) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer"
                  onClick={() => openModal(item)}
                >
                  {/* Equipment Image */}
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    <div className={`absolute top-4 right-4 p-2 ${item.color} rounded-full`}>
                      <item.icon className="h-5 w-5 text-white" />
                    </div>
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="text-lg font-bold">{item.name}</h3>
                      <p className="text-sm text-gray-200">{item.fullName}</p>
                    </div>
                  </div>

                  {/* Equipment Info */}
                  <div className="p-6">
                    <p className="text-gray-600 mb-4 leading-relaxed line-clamp-3">
                      {item.description}
                    </p>
                    
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900">Key Applications:</h4>
                      <ul className="space-y-1">
                        {item.applications.slice(0, 3).map((app, appIndex) => (
                          <li key={appIndex} className="text-sm text-gray-600 flex items-center">
                            <div className="w-1 h-1 bg-blue-500 rounded-full mr-2"></div>
                            {app}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-6 flex items-center justify-between">
                      <span className="text-sm text-blue-600 font-medium">View Details</span>
                      <FaEye className="h-4 w-4 text-blue-600" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Equipment Modal */}
      <AnimatePresence>
        {selectedEquipment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50"
            onClick={closeModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="relative">
                <img 
                  src={selectedEquipment.image} 
                  alt={selectedEquipment.name}
                  className="w-full h-80 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <button
                  onClick={closeModal}
                  className="absolute top-4 right-4 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-all duration-200"
                >
                  <FaTimes className="h-5 w-5" />
                </button>
                <div className="absolute bottom-6 left-6 text-white">
                  <h2 className="text-3xl font-bold mb-2">{selectedEquipment.name}</h2>
                  <p className="text-xl text-gray-200">{selectedEquipment.fullName}</p>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Description & Applications */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                        <FaInfoCircle className="h-6 w-6 text-blue-600 mr-2" />
                        Description
                      </h3>
                      <p className="text-gray-600 leading-relaxed">{selectedEquipment.description}</p>
                    </div>

                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                        <selectedEquipment.icon className="h-6 w-6 text-green-600 mr-2" />
                        Applications
                      </h3>
                      <ul className="space-y-2">
                        {selectedEquipment.applications.map((app, index) => (
                          <li key={index} className="flex items-start space-x-3">
                            <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-gray-600">{app}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Specifications */}
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                      <FaCogs className="h-6 w-6 text-purple-600 mr-2" />
                      Specifications
                    </h3>
                    <div className="space-y-4">
                      {Object.entries(selectedEquipment.specifications).map(([key, value], index) => (
                        <div key={index} className="p-4 bg-gray-50 rounded-lg">
                          <div className="font-semibold text-gray-900">{key}</div>
                          <div className="text-gray-600">{value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <div className="mt-8 pt-8 border-t border-gray-200 text-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Need Testing Services with {selectedEquipment.name}?
                  </h3>
                  <a
                    href="/contact"
                    className={`inline-flex items-center px-8 py-3 bg-gradient-to-r ${selectedEquipment.color.replace('bg-', 'from-')} to-${selectedEquipment.color.split('-')[1]}-600 text-white font-semibold rounded-full hover:shadow-lg transition-all duration-300 transform hover:scale-105`}
                  >
                    <span>Request Quote</span>
                    <FaPlay className="h-4 w-4 ml-2" />
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Equipment <span className="text-gradient">Features</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: FaAtom,
                title: 'High Precision',
                description: 'Advanced instruments ensuring accurate and reliable results',
                color: 'text-blue-600'
              },
              {
                icon: FaCogs,
                title: 'Automated Systems',
                description: 'Fully automated processes for consistent performance',
                color: 'text-green-600'
              },
              {
                icon: FaChartLine,
                title: 'Real-time Monitoring',
                description: 'Continuous monitoring and data logging capabilities',
                color: 'text-purple-600'
              },
              {
                icon: FaEye,
                title: 'Quality Control',
                description: 'Rigorous quality control measures and validation protocols',
                color: 'text-orange-600'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center p-6"
              >
                <div className={`w-16 h-16 mx-auto mb-4 ${feature.color}`}>
                  <feature.icon className="h-16 w-16" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Equipment;
