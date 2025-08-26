import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { 
  FaFlask, 
  FaCertificate, 
  FaUsers, 
  FaGraduationCap,
  FaAward,
  FaHandshake,
  FaEye,
  FaBullseye,
  FaRocket
} from 'react-icons/fa';

const About = () => {
  const [heroRef, heroInView] = useInView({ threshold: 0.3, triggerOnce: true });
  const [missionRef, missionInView] = useInView({ threshold: 0.3, triggerOnce: true });
  const [valuesRef, valuesInView] = useInView({ threshold: 0.3, triggerOnce: true });
  const [partnershipsRef, partnershipsInView] = useInView({ threshold: 0.3, triggerOnce: true });

  const values = [
    {
      icon: FaCertificate,
      title: 'Quality Excellence',
      description: 'We maintain the highest standards in all our testing procedures and follow strict quality control measures.',
      color: 'bg-blue-500'
    },
    {
      icon: FaUsers,
      title: 'Professional Integrity',
      description: 'Our team upholds ethical practices and provides honest, transparent reporting in all our services.',
      color: 'bg-green-500'
    },
    {
      icon: FaRocket,
      title: 'Innovation',
      description: 'We continuously adopt cutting-edge technologies and methodologies to improve our testing capabilities.',
      color: 'bg-purple-500'
    },
    {
      icon: FaGraduationCap,
      title: 'Knowledge Sharing',
      description: 'We believe in educating and training the next generation of scientists and researchers.',
      color: 'bg-orange-500'
    },
    {
      icon: FaHandshake,
      title: 'Collaborative Approach',
      description: 'We work closely with our clients to understand their needs and provide tailored solutions.',
      color: 'bg-red-500'
    },
    {
      icon: FaAward,
      title: 'Continuous Improvement',
      description: 'We strive for excellence by continuously improving our processes and expanding our capabilities.',
      color: 'bg-indigo-500'
    }
  ];

  const milestones = [
    { year: '2022', event: 'GTFTL Established', description: 'Founded as a NABL-accredited analytical testing laboratory' },
    { year: '2022', event: 'NABL Accreditation', description: 'Received official NABL accreditation for analytical testing' },
    { year: '2023', event: 'Equipment Expansion', description: 'Installed advanced LC-MS/MS and GC-MS/MS systems' },
    { year: '2023', event: 'Partnership with CUTM', description: 'Strengthened collaboration with Centurion University' },
    { year: '2024', event: 'Service Expansion', description: 'Extended services to marine products and forensic testing' },
    { year: '2024', event: 'Training Programs', description: 'Launched comprehensive internship and training programs' }
  ];

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
              About <span className="text-blue-200">GTFTL</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-4xl mx-auto leading-relaxed">
              Leading the way in analytical testing and scientific education since 2022
            </p>
          </motion.div>
        </div>
      </section>

      {/* Company Overview */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="text-4xl font-bold text-gray-900">
                Excellence in <span className="text-gradient">Testing & Training</span>
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Gram Tarang Foods Testing Pvt. Ltd. (FTL) was established in 2022 as a NABL-accredited 
                analytical testing laboratory. Located in the heart of Odisha, we specialize in food, 
                pharmaceutical, marine products, and forensic sample analysis.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Our laboratory serves as both a commercial testing facility and a skill development hub, 
                providing opportunities for students, researchers, and industry professionals to gain 
                hands-on experience with cutting-edge analytical techniques.
              </p>
              
              <div className="grid grid-cols-2 gap-4 mt-8">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <FaFlask className="h-10 w-10 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-blue-600">8+</div>
                  <div className="text-sm text-gray-600">Testing Categories</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <FaCertificate className="h-10 w-10 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-600">NABL</div>
                  <div className="text-sm text-gray-600">Accredited</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="grid grid-cols-2 gap-4">
                <img 
                  src="/images/IMG_20250821_132516623.jpg" 
                  alt="Laboratory Equipment" 
                  className="rounded-lg shadow-lg h-48 w-full object-cover"
                />
                <img 
                  src="/images/IMG_20250821_132537634.jpg" 
                  alt="Testing Facility" 
                  className="rounded-lg shadow-lg h-48 w-full object-cover"
                />
                <img 
                  src="/images/IMG_20250821_132559084.jpg" 
                  alt="Analysis Equipment" 
                  className="rounded-lg shadow-lg h-48 w-full object-cover"
                />
                <img 
                  src="/images/IMG_20250821_132615414.jpg" 
                  alt="Lab Instruments" 
                  className="rounded-lg shadow-lg h-48 w-full object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section ref={missionRef} className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={missionInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Our <span className="text-gradient">Mission & Vision</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={missionInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-center p-8 bg-white rounded-2xl shadow-lg"
            >
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaBullseye className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Mission</h3>
              <p className="text-gray-600 leading-relaxed">
                To bridge the gap between academia, industry, and regulatory standards by providing 
                accurate, reliable, and timely analytical services while fostering scientific education 
                and skill development.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={missionInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-center p-8 bg-white rounded-2xl shadow-lg"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaEye className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Vision</h3>
              <p className="text-gray-600 leading-relaxed">
                To be a leading analytical testing laboratory that contributes significantly to public health, 
                food safety, and industrial advancement through scientific excellence and innovation.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={missionInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-center p-8 bg-white rounded-2xl shadow-lg"
            >
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaAward className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Excellence</h3>
              <p className="text-gray-600 leading-relaxed">
                We strive for excellence by maintaining the highest quality standards, continuous improvement, 
                and integrating Good Laboratory Practices with innovative methodologies.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section ref={valuesRef} className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={valuesInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Our Core <span className="text-gradient">Values</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The principles that guide our work and define our commitment to excellence
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={valuesInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="text-center p-6 rounded-2xl hover:shadow-lg transition-shadow duration-300"
              >
                <div className={`w-16 h-16 ${value.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <value.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
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
              Our <span className="text-gradient">Journey</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Key milestones in our growth and development
            </p>
          </motion.div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-blue-200 hidden md:block"></div>
            
            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className={`flex items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                >
                  <div className={`w-full md:w-1/2 ${index % 2 === 0 ? 'md:pr-8' : 'md:pl-8'}`}>
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                      <div className="text-2xl font-bold text-blue-600 mb-2">{milestone.year}</div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{milestone.event}</h3>
                      <p className="text-gray-600">{milestone.description}</p>
                    </div>
                  </div>
                  
                  {/* Timeline Dot */}
                  <div className="hidden md:block w-4 h-4 bg-blue-600 rounded-full absolute left-1/2 transform -translate-x-1/2 border-4 border-white shadow-lg"></div>
                  
                  <div className="w-full md:w-1/2"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Partnership Section */}
      <section ref={partnershipsRef} className="py-20 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={partnershipsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h2 className="text-4xl font-bold mb-6">Partnership with CUTM</h2>
            <p className="text-xl text-blue-100 max-w-4xl mx-auto leading-relaxed mb-12">
              Our collaboration with Centurion University of Technology and Management strengthens our mission 
              by providing opportunities for skill development, research, and hands-on training for students and professionals.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={partnershipsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="text-center"
              >
                <FaGraduationCap className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-3">Academic Integration</h3>
                <p className="text-blue-100">
                  Integrated into CUTM's food processing program for comprehensive education
                </p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={partnershipsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-center"
              >
                <FaUsers className="h-16 w-16 text-green-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-3">Skill Development</h3>
                <p className="text-blue-100">
                  Practical training in food processing, preservation, and analytical techniques
                </p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={partnershipsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-center"
              >
                <FaHandshake className="h-16 w-16 text-purple-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-3">Industry Collaboration</h3>
                <p className="text-blue-100">
                  Bridge between academic learning and real-world industry applications
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;
