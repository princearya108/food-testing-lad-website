import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { toast } from 'react-toastify';
import axios from 'axios';
import { 
  FaGraduationCap, 
  FaFlask, 
  FaMicroscope, 
  FaCertificate,
  FaCalendarAlt,
  FaRupeeSign,
  FaUsers,
  FaCheckCircle,
  FaUpload,
  FaSpinner
} from 'react-icons/fa';

const Internship = () => {
  const [heroRef, heroInView] = useInView({ threshold: 0.3, triggerOnce: true });
  const [programsRef, programsInView] = useInView({ threshold: 0.3, triggerOnce: true });
  const [applicationRef, applicationInView] = useInView({ threshold: 0.3, triggerOnce: true });
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    education: '',
    field: '',
    duration: '',
    experience: '',
    motivation: '',
    resume: null
  });

  const programs = [
    {
      duration: '15 days',
      price: '₹15,000',
      description: 'Any one instrument/facility training',
      color: 'bg-blue-500',
      popular: false,
      features: [
        'Hands-on training on selected instrument',
        'Basic analytical techniques',
        'Certificate of completion',
        'Lab safety training'
      ]
    },
    {
      duration: '1 Month',
      price: '₹25,000',
      description: 'Comprehensive introduction to multiple techniques',
      color: 'bg-green-500',
      popular: true,
      features: [
        'Multiple instrument training',
        'Sample preparation techniques',
        'Data analysis and interpretation',
        'Report writing skills',
        'Certificate of completion'
      ]
    },
    {
      duration: '3 Months',
      price: '₹40,000',
      description: 'Advanced training and research project',
      color: 'bg-purple-500',
      popular: false,
      features: [
        'All laboratory facilities access',
        'Independent research project',
        'Method development training',
        'Publication assistance',
        'Industry exposure',
        'Certificate of completion'
      ]
    },
    {
      duration: '6 Months',
      price: '₹70,000',
      description: 'Complete professional development program',
      color: 'bg-orange-500',
      popular: false,
      features: [
        'Full access to all facilities',
        'Major research project',
        'Paper publication opportunity',
        'Industry collaboration',
        'Job placement assistance',
        'Professional certificate'
      ]
    }
  ];

  const trainingAreas = [
    {
      icon: FaFlask,
      title: 'Food Testing',
      description: 'Learn comprehensive food analysis techniques including proximate composition, contaminant detection, and quality assessment.',
      techniques: ['Proximate Analysis', 'Pesticide Testing', 'Heavy Metal Analysis', 'Nutritional Labeling']
    },
    {
      icon: FaCertificate,
      title: 'Pharmaceutical Analysis',
      description: 'Master pharmaceutical testing methods including drug purity, stability studies, and quality control procedures.',
      techniques: ['Drug Purity', 'Stability Studies', 'Impurity Profiling', 'Method Validation']
    },
    {
      icon: FaMicroscope,
      title: 'Microbiology',
      description: 'Gain expertise in microbiological testing, pathogen detection, and sterile techniques.',
      techniques: ['Pathogen Detection', 'Culture Techniques', 'Identification Methods', 'Biosafety Protocols']
    },
    {
      icon: FaFlask,
      title: 'Molecular Techniques',
      description: 'Advanced molecular biology techniques including DNA/RNA analysis and protein studies.',
      techniques: ['PCR Techniques', 'Gel Electrophoresis', 'Protein Analysis', 'Gene Expression']
    },
    {
      icon: FaMicroscope,
      title: 'Animal Cell Culture',
      description: 'Learn mammalian cell culture, cancer cell lines, and various cell-based assays.',
      techniques: ['Cell Maintenance', 'Cytotoxicity Assays', 'Cell Viability', 'Protein Expression']
    },
    {
      icon: FaFlask,
      title: 'In Silico Analysis',
      description: 'Computational biology, bioinformatics, and molecular modeling techniques.',
      techniques: ['Molecular Docking', 'Bioinformatics', 'Data Mining', 'Statistical Analysis']
    }
  ];

  const eligibleFields = [
    'Food Technology',
    'Biotechnology', 
    'Analytical Chemistry',
    'Botany',
    'Biochemistry',
    'Microbiology',
    'Agricultural Sciences',
    'Fisheries',
    'Animal Sciences'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({
      ...prev,
      resume: e.target.files[0]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitData = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key]) {
          submitData.append(key, formData[key]);
        }
      });

      await axios.post('/api/internship', submitData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      toast.success('Application submitted successfully! We will contact you soon.');
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        education: '',
        field: '',
        duration: '',
        experience: '',
        motivation: '',
        resume: null
      });
    } catch (error) {
      toast.error('Failed to submit application. Please try again.');
      console.error('Error:', error);
    } finally {
      setLoading(false);
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
              Internship <span className="text-blue-200">Programs</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-4xl mx-auto leading-relaxed">
              Gain hands-on experience in analytical testing with state-of-the-art instruments and expert guidance
            </p>
            <div className="flex justify-center items-center space-x-8">
              <div className="flex items-center space-x-2">
                <FaGraduationCap className="h-6 w-6 text-green-400" />
                <span className="text-sm font-medium">Skill Development</span>
              </div>
              <div className="flex items-center space-x-2">
                <FaCertificate className="h-6 w-6 text-yellow-400" />
                <span className="text-sm font-medium">Certified Training</span>
              </div>
              <div className="flex items-center space-x-2">
                <FaUsers className="h-6 w-6 text-blue-400" />
                <span className="text-sm font-medium">Expert Mentorship</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Program Overview */}
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
              Why Choose <span className="text-gradient">GTFTL Internship?</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our comprehensive internship programs provide practical knowledge and industry exposure
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: FaFlask,
                title: 'Hands-on Training',
                description: 'Work with advanced analytical instruments and learn practical techniques'
              },
              {
                icon: FaCertificate,
                title: 'Industry Certification',
                description: 'Receive recognized certificates that enhance your professional credentials'
              },
              {
                icon: FaUsers,
                title: 'Expert Mentorship',
                description: 'Learn from experienced professionals and PhD qualified scientists'
              },
              {
                icon: FaGraduationCap,
                title: 'Career Development',
                description: 'Build skills and knowledge that boost your career prospects in analytical field'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center p-6 bg-gray-50 rounded-2xl hover:shadow-lg transition-shadow duration-300"
              >
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Training Areas */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Training <span className="text-gradient">Areas</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive training across multiple analytical domains
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {trainingAreas.map((area, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center space-x-4 mb-6">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <area.icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">{area.title}</h3>
                </div>
                
                <p className="text-gray-600 mb-6 leading-relaxed">{area.description}</p>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Key Techniques:</h4>
                  <div className="flex flex-wrap gap-2">
                    {area.techniques.map((technique, techIndex) => (
                      <span 
                        key={techIndex}
                        className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium"
                      >
                        {technique}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Program Pricing */}
      <section ref={programsRef} className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={programsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Program <span className="text-gradient">Options</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the program duration that best fits your learning goals and schedule
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {programs.map((program, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={programsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className={`relative bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 ${
                  program.popular ? 'ring-2 ring-blue-500 scale-105' : ''
                }`}
              >
                {program.popular && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-4 py-1 rounded-b-lg text-sm font-medium">
                    Most Popular
                  </div>
                )}
                
                <div className={`${program.color} p-8 text-white text-center`}>
                  <div className="flex items-center justify-center mb-4">
                    <FaCalendarAlt className="h-8 w-8 mr-3" />
                    <h3 className="text-2xl font-bold">{program.duration}</h3>
                  </div>
                  <div className="flex items-center justify-center mb-4">
                    <FaRupeeSign className="h-6 w-6 mr-1" />
                    <span className="text-3xl font-bold">{program.price.replace('₹', '')}</span>
                  </div>
                  <p className="text-white text-opacity-90">{program.description}</p>
                </div>

                <div className="p-8">
                  <ul className="space-y-3">
                    {program.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start space-x-3">
                        <FaCheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-600 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Eligibility */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Eligibility <span className="text-gradient">Criteria</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Who Can Apply?</h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  Our internship programs are open to students from various scientific backgrounds who are 
                  eager to learn analytical techniques and gain practical laboratory experience.
                </p>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Education Levels:</h4>
                <ul className="space-y-2">
                  {['B.Sc. Students', 'M.Sc. Students', 'Ph.D. Students', 'Final Year Projects'].map((level, index) => (
                    <li key={index} className="flex items-center space-x-3">
                      <FaCheckCircle className="h-5 w-5 text-green-500" />
                      <span className="text-gray-600">{level}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Eligible Fields of Study:</h4>
                <div className="grid grid-cols-2 gap-2">
                  {eligibleFields.map((field, index) => (
                    <div key={index} className="flex items-center space-x-2 p-3 bg-white rounded-lg">
                      <FaGraduationCap className="h-4 w-4 text-blue-600" />
                      <span className="text-gray-700 text-sm">{field}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section ref={applicationRef} className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={applicationInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Apply <span className="text-gradient">Now</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Fill out the application form below to start your journey with us
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={applicationInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-gray-50 rounded-3xl p-8 md:p-12"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="+91 XXXXX XXXXX"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Education Level
                  </label>
                  <select
                    name="education"
                    value={formData.education}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="">Select education level</option>
                    <option value="B.Sc.">B.Sc. (Bachelor of Science)</option>
                    <option value="M.Sc.">M.Sc. (Master of Science)</option>
                    <option value="Ph.D.">Ph.D. (Doctor of Philosophy)</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Field of Study
                  </label>
                  <select
                    name="field"
                    value={formData.field}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="">Select your field</option>
                    {eligibleFields.map((field, index) => (
                      <option key={index} value={field}>{field}</option>
                    ))}
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Duration
                  </label>
                  <select
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="">Select duration</option>
                    <option value="15 days">15 days (₹15,000)</option>
                    <option value="1 month">1 month (₹25,000)</option>
                    <option value="3 months">3 months (₹40,000)</option>
                    <option value="6 months">6 months (₹70,000)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Previous Experience (if any)
                </label>
                <textarea
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Describe any previous laboratory or research experience..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Motivation & Learning Goals *
                </label>
                <textarea
                  name="motivation"
                  value={formData.motivation}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Why do you want to join our internship program? What do you hope to learn and achieve?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Resume/CV Upload
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-blue-400 transition-colors duration-200">
                  <div className="space-y-1 text-center">
                    <FaUpload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                        <span>Upload a file</span>
                        <input
                          type="file"
                          name="resume"
                          onChange={handleFileChange}
                          accept=".pdf,.doc,.docx"
                          className="sr-only"
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PDF, DOC, DOCX up to 10MB</p>
                    {formData.resume && (
                      <p className="text-sm text-green-600 font-medium">
                        Selected: {formData.resume.name}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="text-center pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className={`bg-blue-600 text-white px-8 py-4 rounded-full font-semibold hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 ${
                    loading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <FaSpinner className="h-5 w-5 animate-spin" />
                      <span>Submitting...</span>
                    </div>
                  ) : (
                    'Submit Application'
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Payment Information */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Payment <span className="text-gradient">Information</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Complete your internship enrollment with secure payment options
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-2xl shadow-lg"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <FaRupeeSign className="h-6 w-6 text-green-600 mr-2" />
                Bank Transfer Details
              </h3>
              
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm font-medium text-gray-900">Account Name</div>
                  <div className="text-gray-600 font-semibold">Gram Tarang Food Testing Laboratories Pvt Ltd</div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm font-medium text-gray-900">Account Number</div>
                    <div className="text-gray-600 font-mono">1668102100000087</div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm font-medium text-gray-900">IFSC Code</div>
                    <div className="text-gray-600 font-mono">PUNB0049510</div>
                  </div>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm font-medium text-gray-900">Bank Name</div>
                  <div className="text-gray-600 font-semibold">Punjab National Bank</div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> Please include your full name and program duration in the transaction reference. 
                  Send payment confirmation to our email after transfer.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Quick Payment via QR Code</h3>
              <div className="bg-white p-8 rounded-2xl shadow-lg inline-block">
                <img 
                  src="/images/Qr_code.jpg" 
                  alt="Payment QR Code" 
                  className="w-64 h-64 mx-auto rounded-lg"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
                <div className="hidden bg-gray-100 w-64 h-64 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">QR Code Not Available</p>
                </div>
                <p className="text-gray-600 mt-4 text-sm">
                  Scan with any UPI app to make instant payment
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-4xl font-bold">
              Have Questions?
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Contact us for more information about our internship programs and application process
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="bg-white text-blue-600 px-8 py-4 rounded-full font-semibold hover:bg-blue-50 transition-all duration-300 transform hover:scale-105"
              >
                Contact Us
              </a>
              <a
                href="mailto:info@gtftl.com"
                className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300 transform hover:scale-105"
              >
                Email Us
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Internship;
