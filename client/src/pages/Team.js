import React, { useState, useEffect } from 'react';
import { FaEnvelope, FaFlask, FaMicroscope } from 'react-icons/fa';
import api, { API_BASE_URL } from '../api/config';

const Team = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [boardMembers, setBoardMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fallback hardcoded team data
  const fallbackBoardMembers = [
    {
      _id: '1',
      name: 'Dr. Preetha Bhadra',
      position: 'Managing Director',
      department: 'Management',
      email: 'preetha@gtftl.com',
      education: 'Ph.D. in Analytical Chemistry',
      experience: '15+ years in laboratory management',
      specialization: 'Laboratory Management, Quality Systems',
      bio: 'Leading expert in analytical chemistry and laboratory management with over 15 years of experience.',
      isActive: true
    },
    {
      _id: '2',
      name: 'Prof. Supriya Pattanaik',
      position: 'Director',
      department: 'Management',
      email: 'supriya@gtftl.com',
      education: 'PhD (RMIT University), MPhil (NIMHANS), MA (TISS)',
      experience: '25+ years in strategic leadership',
      specialization: 'Strategic Leadership, Social Development',
      bio: 'Strategic leader with extensive experience in quality systems and academic management.',
      isActive: true
    },
    {
      _id: '3',
      name: 'Prof. D. N. Rao',
      position: 'Director',
      department: 'Management',
      email: 'dnrao@gtftl.com',
      education: 'Civil Engineering (Osmania University), PGDM (IIM Calcutta)',
      experience: '20+ years in strategic planning',
      specialization: 'Strategic Planning, Enterprise Development',
      bio: 'Strategic planning expert with strong background in technology and enterprise development.',
      isActive: true
    }
  ];

  const fallbackTeamMembers = [
    {
      _id: '4',
      name: 'Dr. Bhadram Kalyan Chekraverthy',
      position: 'Senior Analyst',
      department: 'Chemical',
      email: 'bhadram@gtftl.com',
      education: 'Ph.D. Chemistry',
      experience: '10+ years in chemical analysis',
      specialization: 'Chemical Analysis, Instrumentation',
      bio: 'Expert in advanced chemical analysis and instrumental techniques.',
      isActive: true
    },
    {
      _id: '5',
      name: 'Dr. Pratyush Kumar Das',
      position: 'Microbiologist',
      department: 'Biological',
      email: 'pratyush@gtftl.com',
      education: 'Ph.D. Microbiology',
      experience: '8+ years in microbiology',
      specialization: 'Food Microbiology, Pathogen Detection',
      bio: 'Specialist in food microbiology and pathogen detection methods.',
      isActive: true
    },
    {
      _id: '6',
      name: 'Mr. Victor Pradhan',
      position: 'Chemical Analyst',
      department: 'Chemical',
      email: 'victor@gtftl.com',
      education: 'M.Sc. Chemistry',
      experience: '6+ years in analytical chemistry',
      specialization: 'Analytical Chemistry, Quality Control',
      bio: 'Experienced analytical chemist with focus on quality control procedures.',
      isActive: true
    },
    {
      _id: '7',
      name: 'Ms. Debarati Nandi',
      position: 'Research Analyst',
      department: 'Chemical',
      email: 'debarati@gtftl.com',
      education: 'M.Sc. Chemistry',
      experience: '4+ years in research',
      specialization: 'Research Analytics, Method Development',
            bio: 'Research analyst specializing in analytical method development.',
      isActive: true
    }
   ];

  // Fetch team data from API
  useEffect(() => {
    const fetchTeamData = async (retryCount = 0) => {
      try {
        setLoading(true);
        console.log(`Fetching team data from API... (Attempt ${retryCount + 1})`);
        
        // Use the correct public team endpoint
        const response = await api.get('/api/team');
        
        if (response.data.success && response.data.data) {
          const allMembers = response.data.data;
          console.log('✅ API Success - Total members:', allMembers.length);
          
          // Separate board members (Management) and technical team
          const board = allMembers.filter(member => 
            member.department === 'Management' && member.isActive
          ).sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
          
          const technical = allMembers.filter(member => 
            member.department !== 'Management' && member.isActive
          ).sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
          
          console.log('Board members:', board.length);
          console.log('Technical members:', technical.length);
          
          // Use real data if available, otherwise fallback
          setBoardMembers(board.length > 0 ? board : fallbackBoardMembers);
          setTeamMembers(technical.length > 0 ? technical : fallbackTeamMembers);
          setError(null); // Clear any previous errors
          
        } else {
          throw new Error(`API returned: ${JSON.stringify(response.data)}`);
        }
      } catch (err) {
        console.error('❌ Team API Error:', err.message);
        
        // Retry logic - retry up to 2 times
        if (retryCount < 2) {
          console.log(`Retrying in 2 seconds... (${retryCount + 1}/2)`);
          setTimeout(() => fetchTeamData(retryCount + 1), 2000);
          return;
        }
        
        // After all retries failed, use fallback data
        console.log('All retries failed, using fallback data...');
        setBoardMembers(fallbackBoardMembers);
        setTeamMembers(fallbackTeamMembers);
        setError(null); // Don't show error to users, just use fallback silently
        
      } finally {
        setLoading(false);
      }
    };

    fetchTeamData();
  }, []);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-center">
          <FaFlask className="h-12 w-12 animate-pulse text-blue-600 mx-auto mb-4" />
          <p className="text-lg text-gray-600">Loading team information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8">
            <h1 className="text-5xl md:text-6xl font-bold">
              Our <span className="text-blue-200">Team</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-4xl mx-auto leading-relaxed">
              Meet our dedicated team of {teamMembers.length + boardMembers.length} experts committed to delivering excellence in analytical testing
            </p>
            <div className="flex justify-center items-center space-x-8">
              <div className="flex items-center space-x-2">
                <FaFlask className="h-6 w-6 text-green-400" />
                <span className="text-sm font-medium">Highly Qualified</span>
              </div>
              <div className="flex items-center space-x-2">
                <FaMicroscope className="h-6 w-6 text-yellow-400" />
                <span className="text-sm font-medium">Expert Analysts</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Board of Directors */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Board of <span className="text-blue-600">Directors</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Visionary leaders guiding our mission of excellence in analytical testing
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {boardMembers.map((member, index) => (
              <div key={member._id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300">
                                 <div className={`h-32 bg-gradient-to-r ${index % 3 === 0 ? 'from-blue-500 to-blue-600' : index % 3 === 1 ? 'from-green-500 to-green-600' : 'from-purple-500 to-purple-600'}`}>
                   <div className="flex items-center justify-center h-full">
                     <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center overflow-hidden">
                       {member.profileImage ? (
                         <img 
                           src={`${API_BASE_URL}${member.profileImage}`} 
                           alt={member.name}
                           className="w-full h-full object-cover"
                           onError={(e) => {
                             e.target.style.display = 'none';
                             e.target.nextSibling.style.display = 'flex';
                           }}
                         />
                       ) : null}
                       <span 
                         className="text-2xl font-bold text-gray-700 flex items-center justify-center w-full h-full"
                         style={{display: member.profileImage ? 'none' : 'flex'}}
                       >
                         {member.name.split(' ').map(n => n[0]).join('')}
                       </span>
                     </div>
                   </div>
                 </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                  <p className="text-blue-600 font-semibold mb-4">{member.position}</p>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="font-semibold text-gray-900 mb-1">Education</div>
                      <div className="text-gray-600 text-sm">{member.education}</div>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 mb-1">Experience</div>
                      <div className="text-gray-600 text-sm">{member.experience}</div>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 mb-1">Specialization</div>
                      <div className="text-gray-600 text-sm">{member.specialization}</div>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm leading-relaxed mt-4">{member.bio}</p>

                  {member.email && (
                    <div className="flex items-center space-x-2 text-sm text-blue-600 mt-4">
                      <FaEnvelope />
                      <a href={`mailto:${member.email}`} className="hover:underline">
                        {member.email}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technical Team */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Technical <span className="text-blue-600">Team</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Skilled professionals ensuring accurate analysis and quality results
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {teamMembers.map((member, index) => (
              <div key={member._id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100">
                                 <div className={`h-24 bg-gradient-to-r ${member.department === 'Chemical' ? 'from-blue-400 to-blue-500' : 'from-green-400 to-green-500'}`}>
                   <div className="flex items-center justify-center h-full">
                     <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center overflow-hidden">
                       {member.profileImage ? (
                         <img 
                           src={`${API_BASE_URL}${member.profileImage}`} 
                           alt={member.name}
                           className="w-full h-full object-cover"
                           onError={(e) => {
                             e.target.style.display = 'none';
                             e.target.nextSibling.style.display = 'flex';
                           }}
                         />
                       ) : null}
                       <span 
                         className="text-lg font-bold text-gray-700 flex items-center justify-center w-full h-full"
                         style={{display: member.profileImage ? 'none' : 'flex'}}
                       >
                         {member.name.split(' ').map(n => n[0]).join('')}
                       </span>
                     </div>
                   </div>
                 </div>
                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-blue-600 font-semibold text-sm mb-2">{member.position}</p>
                  <div className="text-xs text-gray-500 mb-3">
                    <span className={`px-2 py-1 rounded-full ${member.department === 'Chemical' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                      {member.department}
                    </span>
                  </div>
                  
                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="font-semibold text-gray-900">Education:</span>
                      <div className="text-gray-600">{member.education}</div>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-900">Experience:</span>
                      <div className="text-gray-600">{member.experience}</div>
                    </div>
                  </div>

                  {member.email && (
                    <div className="flex items-center space-x-1 text-xs text-blue-600 mt-3">
                      <FaEnvelope />
                      <a href={`mailto:${member.email}`} className="hover:underline">
                        {member.email}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Join Our Team CTA */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-8">
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
          </div>
        </div>
      </section>
    </div>
  );
};

export default Team;
