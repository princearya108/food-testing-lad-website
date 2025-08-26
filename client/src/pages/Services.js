import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { toast } from 'react-toastify';
import axios from 'axios';
import { 
  FaFlask, 
  FaMicroscope, 
  FaCertificate, 
  FaFish,
  FaSearch,
  FaSeedling,
  FaDna,
  FaVial,
  FaCheckCircle,
  FaArrowRight,
  FaPlus,
  FaMinus,
  FaTimes,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaBuilding,
  FaPills,
  FaBug,
  FaDesktop,
  FaPaperPlane,
  FaQuoteLeft
} from 'react-icons/fa';

const Services = () => {
  const [heroRef, heroInView] = useInView({ threshold: 0.3, triggerOnce: true });
  const [servicesRef, servicesInView] = useInView({ threshold: 0.3, triggerOnce: true });
  const [expandedService, setExpandedService] = useState(null);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [selectedService, setSelectedService] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    serviceType: '',
    urgency: 'Medium',
    sampleDetails: '',
    requirements: '',
    additionalNotes: ''
  });

  const services = [
    {
      id: 'food-testing',
      icon: FaFlask,
      title: 'Food Testing',
      subtitle: 'Comprehensive Food Safety & Quality Analysis',
      description: 'Complete analysis of food safety, quality parameters, nutritional labeling, and compliance with regulatory standards.',
      color: 'bg-blue-500',
      gradient: 'from-blue-500 to-blue-600',
      tests: [
        'Proximate composition analysis',
        'Pesticide residues detection',
        'Heavy metals analysis',
        'Mycotoxins testing',
        'Nutritional labeling verification',
        'Food adulterant detection',
        'Shelf life studies',
        'Preservative analysis'
      ],
      applications: [
        'Food manufacturers',
        'Export-import companies',
        'Restaurants and food chains',
        'Government agencies',
        'Research institutions'
      ],
      turnaround: '3-7 working days',
      accreditation: 'NABL Accredited'
    },
    {
      id: 'pharma-testing',
      icon: FaCertificate,
      title: 'Pharmaceutical Testing',
      subtitle: 'Drug Purity & Quality Assurance',
      description: 'Comprehensive pharmaceutical analysis including drug purity, contamination checks, and excipient analysis.',
      color: 'bg-green-500',
      gradient: 'from-green-500 to-green-600',
      tests: [
        'Drug purity analysis',
        'Contamination checks',
        'Excipient analysis',
        'Dissolution testing',
        'Stability studies',
        'Impurity profiling',
        'Assay determination',
        'Related substances'
      ],
      applications: [
        'Pharmaceutical companies',
        'Drug manufacturers',
        'Research laboratories',
        'Regulatory bodies',
        'Clinical research organizations'
      ],
      turnaround: '5-10 working days',
      accreditation: 'ISO Certified'
    },
    {
      id: 'marine-testing',
      icon: FaFish,
      title: 'Marine Products Testing',
      subtitle: 'Seafood Safety & Freshness Analysis',
      description: 'Specialized testing for marine products ensuring safety, quality, and freshness indicators.',
      color: 'bg-cyan-500',
      gradient: 'from-cyan-500 to-cyan-600',
      tests: [
        'Microbiological safety',
        'Antibiotic residues',
        'Freshness indicators',
        'Heavy metals in seafood',
        'Histamine levels',
        'Pathogen detection',
        'Chemical preservatives',
        'Marine toxins'
      ],
      applications: [
        'Seafood exporters',
        'Fish processing units',
        'Aquaculture farms',
        'Marine product distributors',
        'Quality control labs'
      ],
      turnaround: '2-5 working days',
      accreditation: 'Export Approved'
    },
    {
      id: 'forensic-testing',
      icon: FaSearch,
      title: 'Forensic Material Testing',
      subtitle: 'Toxicity & Trace Chemical Analysis',
      description: 'Advanced forensic analysis for toxicity assessment and trace chemical detection.',
      color: 'bg-purple-500',
      gradient: 'from-purple-500 to-purple-600',
      tests: [
        'Toxicity analysis',
        'Trace chemical detection',
        'Unknown substance identification',
        'Poison analysis',
        'Drug screening',
        'Alcohol content determination',
        'Fiber analysis',
        'Paint and coating analysis'
      ],
      applications: [
        'Law enforcement agencies',
        'Legal firms',
        'Insurance companies',
        'Forensic laboratories',
        'Judicial system'
      ],
      turnaround: '7-14 working days',
      accreditation: 'Court Approved'
    },
    {
      id: 'nutritional-testing',
      icon: FaSeedling,
      title: 'Nutritional & Nutraceutical Testing',
      subtitle: 'Vitamins, Minerals & Bioactive Compounds',
      description: 'Comprehensive analysis of nutritional components and bioactive compounds in foods and supplements.',
      color: 'bg-orange-500',
      gradient: 'from-orange-500 to-orange-600',
      tests: [
        'Vitamin analysis (A, B, C, D, E, K)',
        'Mineral content determination',
        'Bioactive compounds',
        'Antioxidant capacity',
        'Fatty acid profile',
        'Amino acid composition',
        'Dietary fiber analysis',
        'Probiotic viability'
      ],
      applications: [
        'Nutraceutical companies',
        'Supplement manufacturers',
        'Health food producers',
        'Research institutions',
        'Regulatory bodies'
      ],
      turnaround: '5-8 working days',
      accreditation: 'FSSAI Approved'
    },
    {
      id: 'microbiological-testing',
      icon: FaMicroscope,
      title: 'Microbiological Testing',
      subtitle: 'Pathogen Detection & Microbial Safety',
      description: 'Complete microbiological analysis for food safety and quality assurance.',
      color: 'bg-red-500',
      gradient: 'from-red-500 to-red-600',
      tests: [
        'Total Plate Count (TPC)',
        'Yeast & Mold count',
        'Coliform detection',
        'Salmonella testing',
        'E. coli identification',
        'Listeria monocytogenes',
        'Staphylococcus aureus',
        'Pathogen screening'
      ],
      applications: [
        'Food manufacturers',
        'Dairy industries',
        'Water treatment plants',
        'Hospitals and clinics',
        'Environmental agencies'
      ],
      turnaround: '3-5 working days',
      accreditation: 'NABL Accredited'
    },
    {
      id: 'cell-culture',
      icon: FaDna,
      title: 'Animal Cell Culture',
      subtitle: 'In Vitro Analysis & Cell-Based Assays',
      description: 'Advanced cell culture services including mammalian and cancer cell cultures with various assays.',
      color: 'bg-indigo-500',
      gradient: 'from-indigo-500 to-indigo-600',
      tests: [
        'Mammalian cell culture',
        'Cancer cell culture',
        'Cell viability assays',
        'Cytotoxicity testing',
        'Drug dosage analysis',
        'Cell proliferation studies',
        'Apoptosis analysis',
        'Protein expression'
      ],
      applications: [
        'Pharmaceutical research',
        'Biotech companies',
        'Academic research',
        'Drug development',
        'Toxicology studies'
      ],
      turnaround: '7-21 working days',
      accreditation: 'Research Grade'
    },
    {
      id: 'insilico-analysis',
      icon: FaVial,
      title: 'In Silico Analysis',
      subtitle: 'Computational Biology & Bioinformatics',
      description: 'Computer-based biological analysis and molecular modeling services.',
      color: 'bg-pink-500',
      gradient: 'from-pink-500 to-pink-600',
      tests: [
        'Molecular docking studies',
        'Protein structure analysis',
        'Drug design and optimization',
        'Bioinformatics analysis',
        'Genome analysis',
        'Phylogenetic studies',
        'QSAR modeling',
        'Virtual screening'
      ],
      applications: [
        'Drug discovery',
        'Academic research',
        'Biotechnology companies',
        'Pharmaceutical R&D',
        'Computational biology'
      ],
      turnaround: '5-15 working days',
      accreditation: 'Research Validated'
    }
  ];

  const toggleService = (serviceId) => {
    setExpandedService(expandedService === serviceId ? null : serviceId);
  };

  const openQuoteModal = (serviceTitle) => {
    setSelectedService(serviceTitle);
    setFormData(prev => ({ ...prev, serviceType: serviceTitle }));
    setShowQuoteModal(true);
  };

  const closeQuoteModal = () => {
    setShowQuoteModal(false);
    setSelectedService('');
    setFormData({
      name: '',
      email: '',
      phone: '',
      company: '',
      serviceType: '',
      urgency: 'Medium',
      sampleDetails: '',
      requirements: '',
      additionalNotes: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      console.log('Submitting service request:', formData);
      const response = await axios.post('/api/service-request', formData);
      console.log('Service request response:', response.data);
      toast.success('Service request submitted successfully! We will contact you soon.');
      closeQuoteModal();
    } catch (error) {
      console.error('Error submitting service request:', error);
      const errorMessage = error.response?.data?.message || 'Failed to submit service request. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
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
              Our <span className="text-blue-200">Services</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-4xl mx-auto leading-relaxed">
              Comprehensive analytical testing services with state-of-the-art equipment and expert professionals
            </p>
            <div className="flex justify-center items-center space-x-8">
              <div className="flex items-center space-x-2">
                <FaCheckCircle className="h-6 w-6 text-green-400" />
                <span className="text-sm font-medium">NABL Accredited</span>
              </div>
              <div className="flex items-center space-x-2">
                <FaCheckCircle className="h-6 w-6 text-yellow-400" />
                <span className="text-sm font-medium">ISO Certified</span>
              </div>
              <div className="flex items-center space-x-2">
                <FaCheckCircle className="h-6 w-6 text-blue-400" />
                <span className="text-sm font-medium">Expert Team</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section ref={servicesRef} className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={servicesInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Comprehensive <span className="text-gradient">Testing Solutions</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Professional analytical services across multiple domains with quick turnaround times and accurate results
            </p>
          </motion.div>

          <div className="space-y-6">
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 50 }}
                animate={servicesInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                {/* Service Header */}
                <div 
                  className={`bg-gradient-to-r ${service.gradient} p-6 cursor-pointer`}
                  onClick={() => toggleService(service.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-white bg-opacity-20 rounded-full">
                        <service.icon className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-white">{service.title}</h3>
                        <p className="text-white text-opacity-90">{service.subtitle}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right text-white text-sm">
                        <div className="font-medium">Turnaround</div>
                        <div className="text-white text-opacity-90">{service.turnaround}</div>
                      </div>
                      <div className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors duration-200">
                        {expandedService === service.id ? (
                          <FaMinus className="h-5 w-5 text-white" />
                        ) : (
                          <FaPlus className="h-5 w-5 text-white" />
                        )}
                      </div>
                    </div>
                  </div>
                  <p className="text-white text-opacity-90 mt-3 leading-relaxed">
                    {service.description}
                  </p>
                </div>

                {/* Expandable Content */}
                <AnimatePresence>
                  {expandedService === service.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="p-6 border-t border-gray-100"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Tests Performed */}
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            <FaVial className="h-5 w-5 text-blue-600 mr-2" />
                            Tests Performed
                          </h4>
                          <ul className="space-y-2">
                            {service.tests.map((test, testIndex) => (
                              <li key={testIndex} className="flex items-start space-x-2">
                                <FaCheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                                <span className="text-gray-600 text-sm">{test}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Applications */}
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            <FaCertificate className="h-5 w-5 text-green-600 mr-2" />
                            Applications
                          </h4>
                          <ul className="space-y-2">
                            {service.applications.map((application, appIndex) => (
                              <li key={appIndex} className="flex items-start space-x-2">
                                <FaArrowRight className="h-4 w-4 text-blue-500 mt-1 flex-shrink-0" />
                                <span className="text-gray-600 text-sm">{application}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Service Details */}
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            <FaSearch className="h-5 w-5 text-purple-600 mr-2" />
                            Service Details
                          </h4>
                          <div className="space-y-3">
                            <div className="p-3 bg-gray-50 rounded-lg">
                              <div className="text-sm font-medium text-gray-900">Accreditation</div>
                              <div className="text-sm text-gray-600">{service.accreditation}</div>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-lg">
                              <div className="text-sm font-medium text-gray-900">Turnaround Time</div>
                              <div className="text-sm text-gray-600">{service.turnaround}</div>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-lg">
                              <div className="text-sm font-medium text-gray-900">Sample Requirements</div>
                              <div className="text-sm text-gray-600">Contact for specific requirements</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* CTA Button */}
                      <div className="mt-8 text-center">
                        <button
                          onClick={() => openQuoteModal(service.title)}
                          className={`inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-full hover:shadow-lg transition-all duration-300 transform hover:scale-105`}
                        >
                          <FaQuoteLeft className="h-4 w-4 mr-2" />
                          <span>Request Quote for {service.title}</span>
                          <FaArrowRight className="h-4 w-4 ml-2" />
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
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
              Why Choose <span className="text-gradient">GTFTL?</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: FaCertificate,
                title: 'NABL Accredited',
                description: 'Nationally recognized testing standards and procedures',
                color: 'text-blue-600'
              },
              {
                icon: FaFlask,
                title: 'Advanced Equipment',
                description: 'State-of-the-art instruments for precise analysis',
                color: 'text-green-600'
              },
              {
                icon: FaMicroscope,
                title: 'Expert Team',
                description: 'Highly qualified professionals with extensive experience',
                color: 'text-purple-600'
              },
              {
                icon: FaCheckCircle,
                title: 'Quick Turnaround',
                description: 'Fast and reliable results without compromising quality',
                color: 'text-orange-600'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center p-6 rounded-2xl hover:shadow-lg transition-shadow duration-300"
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

      {/* Contact CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-4xl font-bold">
              Need Testing Services?
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Contact us today for professional analytical testing services and get accurate results with quick turnaround times
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="bg-white text-blue-600 px-8 py-4 rounded-full font-semibold hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 inline-flex items-center justify-center"
              >
                <span>Get Quote</span>
                <FaArrowRight className="h-4 w-4 ml-2" />
              </a>
              <a
                href="tel:+91-XXXXXXXXXX"
                className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300 transform hover:scale-105"
              >
                Call Now
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Service Request Modal */}
      <AnimatePresence>
        {showQuoteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={closeQuoteModal}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Request Quote</h2>
                    <p className="text-green-600 font-medium">{selectedService}</p>
                  </div>
                  <button
                    onClick={closeQuoteModal}
                    className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  >
                    <FaTimes className="h-6 w-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <FaUser className="inline h-4 w-4 mr-2" />
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <FaEnvelope className="inline h-4 w-4 mr-2" />
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Enter your email"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <FaPhone className="inline h-4 w-4 mr-2" />
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Enter your phone number"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <FaBuilding className="inline h-4 w-4 mr-2" />
                        Company/Organization
                      </label>
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Enter company name (optional)"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Priority Level
                    </label>
                    <select
                      name="urgency"
                      value={formData.urgency}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="Low">Low Priority</option>
                      <option value="Medium">Medium Priority</option>
                      <option value="High">High Priority</option>
                      <option value="Urgent">Urgent</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sample Details *
                    </label>
                    <textarea
                      name="sampleDetails"
                      value={formData.sampleDetails}
                      onChange={handleInputChange}
                      required
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Describe your samples: type, quantity, origin, etc..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Testing Requirements *
                    </label>
                    <textarea
                      name="requirements"
                      value={formData.requirements}
                      onChange={handleInputChange}
                      required
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Specify testing requirements, parameters to be tested, standards to follow..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Additional Notes
                    </label>
                    <textarea
                      name="additionalNotes"
                      value={formData.additionalNotes}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Any additional information or special requirements..."
                    />
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={closeQuoteModal}
                      className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center justify-center"
                    >
                      {isSubmitting ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <FaPaperPlane className="h-4 w-4 mr-2" />
                          Submit Request
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Services;
