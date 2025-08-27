import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import api from '../api/config';
import { API_BASE_URL } from '../api/config';
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
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const categories = [
    { id: 'all', name: 'All Equipment', icon: FaCogs },
    { id: 'Chromatography', name: 'Chromatography', icon: FaChartLine },
    { id: 'Spectroscopy', name: 'Spectroscopy', icon: FaAtom },
    { id: 'Microbiology', name: 'Microbiology', icon: FaMicroscope },
    { id: 'Cell Culture', name: 'Cell Culture', icon: FaMicroscope },
    { id: 'Mass Spectrometry', name: 'Mass Spectrometry', icon: FaAtom },
    { id: 'General Laboratory', name: 'General Lab', icon: FaFlask }
  ];

  // Fetch equipment from API
  useEffect(() => {
    fetchEquipment();
  }, []);

  const fetchEquipment = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.get('/api/equipment');
      console.log('Equipment API response:', response.data);
      
      if (response.data.success) {
        const equipmentData = response.data.data.map(item => ({
          id: item._id,
          name: item.name,
          fullName: item.model ? `${item.name} - ${item.model}` : item.name,
          category: item.category,
          image: item.equipmentImages && item.equipmentImages.length > 0 
            ? `${API_BASE_URL}${item.equipmentImages[0]}` 
            : getDefaultEquipmentImage(item.name),
          description: item.description || 'No description available',
          applications: item.applications ? item.applications.split('\n').filter(app => app.trim()) : [],
          specifications: {
            'Model': item.model || 'N/A',
            'Manufacturer': item.manufacturer || 'N/A',
            'Serial Number': item.serialNumber || 'N/A',
            'Status': item.operatingStatus || 'Unknown'
          },
          icon: getCategoryIcon(item.category),
          color: getCategoryColor(item.category),
          featured: item.featured,
          operatingStatus: item.operatingStatus
        }));
        
        setEquipment(equipmentData);
      }
    } catch (error) {
      console.error('Error fetching equipment:', error);
      setError('Failed to load equipment data');
      
      // Fallback to minimal static data on error
      setEquipment([]);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Chromatography':
      case 'Mass Spectrometry':
        return FaChartLine;
      case 'Spectroscopy':
        return FaAtom;
      case 'Microbiology':
      case 'Cell Culture':
        return FaMicroscope;
      default:
        return FaFlask;
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Chromatography':
        return 'bg-blue-500';
      case 'Spectroscopy':
        return 'bg-purple-500';
      case 'Mass Spectrometry':
        return 'bg-green-500';
      case 'Microbiology':
        return 'bg-emerald-500';
      case 'Cell Culture':
        return 'bg-violet-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getDefaultEquipmentImage = (equipmentName) => {
    const name = equipmentName.toLowerCase();
    if (name.includes('lc-ms') || name.includes('lcms')) {
      return '/images/IMG_20250821_132458896.jpg';
    } else if (name.includes('gc-ms') || name.includes('gcms')) {
      return '/images/IMG_20250821_132516623.jpg';
    } else if (name.includes('icp-ms') || name.includes('icpms')) {
      return '/images/IMG_20250821_132537634.jpg';
    } else if (name.includes('hplc')) {
      return '/images/IMG_20250821_132559084.jpg';
    } else if (name.includes('ftir')) {
      return '/images/IMG_20250821_132615414.jpg';
    } else if (name.includes('uv') || name.includes('spectrophotometer')) {
      return '/images/IMG_20250821_132650232.jpg';
    } else if (name.includes('calorimeter')) {
      return '/images/IMG_20250821_132700981.jpg';
    } else if (name.includes('protein')) {
      return '/images/IMG_20250821_132720113.jpg';
    } else if (name.includes('fat')) {
      return '/images/IMG_20250821_132737052.jpg';
    } else if (name.includes('fiber')) {
      return '/images/IMG_20250821_132800027.jpg';
    } else if (name.includes('microbiology')) {
      return '/images/IMG_20250821_132831498.jpg';
    } else if (name.includes('cell culture')) {
      return '/images/IMG_20250821_132848228.jpg';
    } else if (name.includes('silico') || name.includes('computational')) {
      return '/images/IMG_20250821_133004301.jpg';
    } else {
      return '/images/default-equipment.jpg';
    }
  };

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
                <span className="text-sm font-medium">
                  {loading ? 'Loading...' : `${equipment.length} Instruments`}
                </span>
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

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <span className="ml-4 text-lg text-gray-600">Loading equipment...</span>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <div className="text-red-600 text-lg mb-4">{error}</div>
              <button
                onClick={fetchEquipment}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Retry
              </button>
            </div>
          ) : filteredEquipment.length === 0 ? (
            <div className="text-center py-20">
              <FaFlask className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No Equipment Found</h3>
              <p className="text-gray-500">No equipment matches your current filter.</p>
            </div>
          ) : (
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
          )}
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
