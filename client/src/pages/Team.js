import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import axios from 'axios';
import { 
  FaLinkedin, 
  FaEnvelope, 
  FaGraduationCap,
  FaFlask,
  FaMicroscope,
  FaUserTie,
  FaCertificate,
  FaSpinner
} from 'react-icons/fa';

const Team = () => {
  const [heroRef, heroInView] = useInView({ threshold: 0.3, triggerOnce: true });
  const [boardRef, boardInView] = useInView({ threshold: 0.3, triggerOnce: true });
  const [teamRef, teamInView] = useInView({ threshold: 0.3, triggerOnce: true });
  
  // State for team data
  const [teamMembers, setTeamMembers] = useState([]);
  const [boardMembers, setBoardMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch team data from API
  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/team');
        
        if (response.data.success) {
          const allMembers = response.data.data;
          console.log('All team members received:', allMembers);
          
          // Separate board members (Management department) and technical team
          const board = allMembers.filter(member => 
            member.department === 'Management' && member.isActive
          ).sort((a, b) => a.displayOrder - b.displayOrder);
          
          const technical = allMembers.filter(member => 
            member.department !== 'Management' && member.isActive
          ).sort((a, b) => a.displayOrder - b.displayOrder);
          
          console.log('Board members filtered:', board);
          console.log('Technical members filtered:', technical);
          
          setBoardMembers(board);
          setTeamMembers(technical);
        } else {
          setError('Failed to fetch team data');
        }
      } catch (err) {
        console.error('Error fetching team data:', err);
        setError('Error loading team information');
      } finally {
        setLoading(false);
      }
    };

    fetchTeamData();
  }, []);

  // Helper function to get background color based on department
  const getDepartmentColor = (department, index) => {
    const colors = {
      'Management': ['bg-blue-500', 'bg-green-500', 'bg-purple-500'],
      'Chemical': ['bg-cyan-500', 'bg-indigo-500', 'bg-pink-500', 'bg-teal-500'],
      'Biological': ['bg-emerald-500', 'bg-orange-500', 'bg-lime-500'],
      'Research': ['bg-violet-500'],
      'Administration': ['bg-gray-500']
    };
    
    const departmentColors = colors[department] || ['bg-gray-500'];
    return departmentColors[index % departmentColors.length] || 'bg-gray-500';
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-lg text-gray-600">Loading team information...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

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
              Our <span className="text-blue-200">Team</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-4xl mx-auto leading-relaxed">
              Meet our dedicated team of experts committed to delivering excellence in analytical testing
            </p>
            <div className="flex justify-center items-center space-x-8">
              <div className="flex items-center space-x-2">
                <FaGraduationCap className="h-6 w-6 text-green-400" />
                <span className="text-sm font-medium">Highly Qualified</span>
              </div>
              <div className="flex items-center space-x-2">
                <FaFlask className="h-6 w-6 text-yellow-400" />
                <span className="text-sm font-medium">Expert Analysts</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* MD Message */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-blue-50 rounded-3xl p-8 md:p-12"
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
              <div className="text-center lg:text-left">
                <img 
                  src="/images/team/md-photo.jpg" 
                  alt="Dr. Preetha Bhadra"
                  className="w-48 h-48 rounded-full mx-auto lg:mx-0 object-cover shadow-xl"
                />
              </div>
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">From the Managing Director's Desk</h2>
                  <p className="text-blue-600 font-semibold">Dr. Preetha Bhadra, Managing Director</p>
                </div>
                <blockquote className="text-lg text-gray-600 leading-relaxed italic">
                  "It gives me immense pleasure to welcome you to Gram Tarang Food Testing Laboratory (FTL). 
                  Established with the vision of bridging the gap between academia, industry, and regulatory standards, 
                  our laboratory is committed to ensuring the highest quality in food, pharmaceutical, marine, and 
                  nutraceutical testing.
                  
                  At FTL, we believe that safety, quality, and innovation are the pillars of progress. With our 
                  NABL-accredited infrastructure, world-class instrumentation, and a dedicated team of experts, 
                  we strive to deliver accurate, reliable, and timely analytical services. Our collaboration with 
                  Centurion University of Technology and Management (CUTM) further strengthens our mission by providing 
                  opportunities for skill development, research, and hands-on training for the next generation of 
                  scientists and professionals.
                  
                  Beyond testing, FTL stands as a platform for capacity building—offering workshops, internships, and 
                  specialized training programs to students, researchers, and industry partners. By integrating Good 
                  Laboratory Practices (GLP) with a strong focus on innovation and excellence, we aspire to make a 
                  significant contribution toward ensuring public health, food safety, and industrial advancement.
                  
                  I invite you to explore our services, collaborate with our teams, and join us in building a future 
                  where science and integrity drive sustainable growth."
                </blockquote>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Board of Directors */}
      <section ref={boardRef} className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={boardInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Board of <span className="text-gradient">Directors</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Visionary leaders guiding our mission of excellence in analytical testing
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {boardMembers.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={boardInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300"
              >
                {/* Header with image */}
                <div className={`${getDepartmentColor(member.department, index)} p-8 text-white text-center`}>
                  <div className="w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden border-4 border-white shadow-lg">
                    <img 
                      src={member.profileImage ? `http://localhost:5000${member.profileImage}` : `/images/team/default-avatar.jpg`} 
                      alt={member.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&size=200&background=ffffff&color=333333&format=png`;
                      }}
                    />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{member.name}</h3>
                  <p className="text-white text-opacity-90 font-semibold">{member.position}</p>
                </div>

                {/* Content */}
                <div className="p-8 space-y-6">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="font-semibold text-gray-900">Education</div>
                      <div className="text-gray-600">{member.education}</div>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Experience</div>
                      <div className="text-gray-600">{member.experience}</div>
                    </div>
                  </div>

                  <div>
                    <div className="font-semibold text-gray-900 mb-2">Specialization</div>
                    <div className="text-gray-600 text-sm">{member.specialization}</div>
                  </div>

                  <p className="text-gray-600 text-sm leading-relaxed">{member.bio}</p>

                  {member.email && (
                    <div className="flex items-center space-x-2 text-sm text-blue-600">
                      <FaEnvelope />
                      <a href={`mailto:${member.email}`} className="hover:underline">
                        {member.email}
                      </a>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Members */}
      <section ref={teamRef} className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={teamInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Technical <span className="text-gradient">Team</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Skilled professionals ensuring accurate analysis and quality results
            </p>
            {teamMembers.length > 0 && (
              <div className="mt-6 flex justify-center items-center space-x-8">
                <div className="flex items-center space-x-2">
                  <FaFlask className="h-5 w-5 text-blue-500" />
                  <span className="text-sm font-medium text-gray-600">{teamMembers.length} Expert Analysts</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FaGraduationCap className="h-5 w-5 text-green-500" />
                  <span className="text-sm font-medium text-gray-600">Advanced Degrees</span>
                </div>
              </div>
            )}
          </motion.div>

          {teamMembers.length === 0 ? (
            <div className="text-center py-12">
              <FaFlask className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-xl text-gray-500 mb-2">No Technical Team Members Found</p>
              <p className="text-gray-400">Team information is being updated. Please check back soon.</p>
            </div>
          ) : (
            <>
              {/* Department Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                {['Chemical', 'Biological', 'Research'].map((dept) => {
                  const deptMembers = teamMembers.filter(m => m.department === dept);
                  const deptCount = deptMembers.length;
                  
                  if (deptCount === 0) return null;
                  
                  return (
                    <motion.div
                      key={dept}
                      initial={{ opacity: 0, y: 30 }}
                      animate={teamInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.6, delay: 0.2 }}
                      className={`text-center p-6 rounded-xl ${
                        dept === 'Chemical' ? 'bg-blue-50 border border-blue-200' :
                        dept === 'Biological' ? 'bg-green-50 border border-green-200' :
                        'bg-purple-50 border border-purple-200'
                      }`}
                    >
                      <div className={`w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center ${
                        dept === 'Chemical' ? 'bg-blue-500 text-white' :
                        dept === 'Biological' ? 'bg-green-500 text-white' :
                        'bg-purple-500 text-white'
                      }`}>
                        {dept === 'Chemical' ? <FaFlask className="h-6 w-6" /> :
                         dept === 'Biological' ? <FaMicroscope className="h-6 w-6" /> :
                         <FaGraduationCap className="h-6 w-6" />}
                      </div>
                      <h3 className="font-bold text-2xl text-gray-900 mb-1">{deptCount}</h3>
                      <p className="text-gray-600 font-medium">{dept} Specialists</p>
                    </motion.div>
                  );
                })}
              </div>
              
              {/* Team Member Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {teamMembers.map((member, index) => (
              <motion.div
                key={member._id || index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                animate={teamInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-8 hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200"
              >
                <div className="flex items-start space-x-6">
                  {/* Profile Image */}
                  <div className="flex-shrink-0">
                    <div className={`w-24 h-24 rounded-full overflow-hidden ${getDepartmentColor(member.department, index)} p-1`}>
                      <img 
                        src={member.profileImage ? `http://localhost:5000${member.profileImage}` : `/images/team/default-avatar.jpg`} 
                        alt={member.name}
                        className="w-full h-full object-cover rounded-full bg-white"
                        onError={(e) => {
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&size=150&background=ffffff&color=333333&format=png`;
                        }}
                      />
                    </div>
                  </div>

                  {/* Member Info */}
                  <div className="flex-1 space-y-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
                      <p className="text-blue-600 font-semibold mb-1">{member.position}</p>
                      <div className="flex items-center space-x-2">
                        <span className={`inline-block px-2 py-1 text-xs rounded-full font-medium ${
                          member.department === 'Chemical' ? 'bg-blue-100 text-blue-800' :
                          member.department === 'Biological' ? 'bg-green-100 text-green-800' :
                          member.department === 'Research' ? 'bg-purple-100 text-purple-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {member.department} Department
                        </span>
                        {member.joinDate && (
                          <span className="text-xs text-gray-500">
                            Since {new Date(member.joinDate).getFullYear()}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="font-medium text-gray-900">Education</div>
                        <div className="text-gray-600">{member.education}</div>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">Experience</div>
                        <div className="text-gray-600">{member.experience}</div>
                      </div>
                    </div>

                    <div>
                      <div className="font-medium text-gray-900 mb-2">Specialization</div>
                      <div className="text-gray-600 text-sm">{member.specialization}</div>
                    </div>

                    <div>
                      <div className="font-medium text-gray-900 mb-2">Bio</div>
                      <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">{member.bio}</p>
                    </div>

                    {/* Contact Information */}
                    <div className="flex items-center space-x-4 text-sm">
                      {member.email && (
                        <a href={`mailto:${member.email}`} className="flex items-center space-x-1 text-blue-600 hover:underline">
                          <FaEnvelope className="h-3 w-3" />
                          <span>Email</span>
                        </a>
                      )}
                      {member.phone && (
                        <span className="text-gray-600">{member.phone}</span>
                      )}
                    </div>

                    {/* Achievements */}
                    {member.achievements && member.achievements.length > 0 && (
                      <div>
                        <div className="font-medium text-gray-900 mb-2">Recent Achievements</div>
                        <div className="space-y-1">
                          {member.achievements.slice(0, 2).map((achievement, achIndex) => (
                            <div key={achIndex} className="text-sm text-gray-600">
                              <span className="font-medium">🏆 {achievement.title}</span>
                              {achievement.year && <span className="text-gray-500"> ({achievement.year})</span>}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Publications */}
                    {member.publications && member.publications.length > 0 && (
                      <div>
                        <div className="font-medium text-gray-900 mb-2">Recent Publications</div>
                        <div className="space-y-1">
                          {member.publications.slice(0, 2).map((publication, pubIndex) => (
                            <div key={pubIndex} className="text-sm text-gray-600">
                              <span className="font-medium">📄 {publication.title}</span>
                              {publication.year && <span className="text-gray-500"> ({publication.year})</span>}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
              ))}
            </div>
            </>
          )}
        </div>
      </section>

      {/* Team Values */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6">Our Team Values</h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              The principles that guide our professional conduct and service delivery
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: FaCertificate,
                title: 'Excellence',
                description: 'Commitment to the highest standards in everything we do'
              },
              {
                icon: FaUserTie,
                title: 'Integrity',
                description: 'Honest and transparent in all our professional dealings'
              },
              {
                icon: FaFlask,
                title: 'Innovation',
                description: 'Continuously improving our methods and capabilities'
              },
              {
                icon: FaMicroscope,
                title: 'Precision',
                description: 'Accurate and reliable results through meticulous work'
              }
            ].map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-16 h-16 mx-auto mb-4 text-yellow-400">
                  <value.icon className="h-16 w-16" />
                </div>
                <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                <p className="text-blue-100 leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Join Our Team CTA */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-4xl font-bold text-gray-900">
              Join Our Team
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're always looking for talented professionals to join our growing team. 
              Explore our internship programs and career opportunities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/internship"
                className="bg-blue-600 text-white px-8 py-4 rounded-full font-semibold hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
              >
                Internship Programs
              </a>
              <a
                href="/contact"
                className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-full font-semibold hover:bg-blue-600 hover:text-white transition-all duration-300 transform hover:scale-105"
              >
                Contact HR
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Team;
