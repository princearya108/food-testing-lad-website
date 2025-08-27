import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import api from '../api/config';
import { API_BASE_URL } from '../api/config';
import RichTextEditor from '../components/RichTextEditor';
import BlogContent from '../components/BlogContent';
import ReportAnalyzer from '../components/AIAnalysis/ReportAnalyzer';
import { 
  FaUsers, 
  FaEnvelope, 
  FaGraduationCap,
  FaChartBar,
  FaEye,
  FaEdit,
  FaTrash,
  FaDownload,
  FaSearch,
  FaCog,
  FaSignOutAlt,
  FaBlog,
  FaPlus,
  FaUser,
  FaFlask,
  FaBrain
} from 'react-icons/fa';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [contacts, setContacts] = useState([]);
  const [internships, setInternships] = useState([]);
  const [serviceRequests, setServiceRequests] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [team, setTeam] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [adminUser, setAdminUser] = useState(null);
  const [showBlogPreview, setShowBlogPreview] = useState(false);
  const [previewBlog, setPreviewBlog] = useState(null);
  
  // New feature states
  const [pages, setPages] = useState([]);
  const [internshipPrograms, setInternshipPrograms] = useState([]);
  const [labServices, setLabServices] = useState([]);
  
  // AI Analysis states
  const [showReportAnalyzer, setShowReportAnalyzer] = useState(false);
  const [currentReportData, setCurrentReportData] = useState(null);

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: FaChartBar },
    { id: 'contacts', label: 'Contact Forms', icon: FaEnvelope },
    { id: 'internships', label: 'Internship Applications', icon: FaGraduationCap },
    { id: 'internship-manage', label: 'Internship Management', icon: FaGraduationCap },
    { id: 'services', label: 'Service Requests', icon: FaCog },
    { id: 'service-manage', label: 'Service Management', icon: FaCog },
    { id: 'blogs', label: 'Blog Management', icon: FaBlog },
    { id: 'pages', label: 'Pages Management', icon: FaBlog },
    { id: 'team', label: 'Team Management', icon: FaUsers },
    { id: 'equipment', label: 'Equipment Management', icon: FaFlask },
    { id: 'profile', label: 'Profile', icon: FaUser }
  ];

  useEffect(() => {
    checkAuthentication();
    fetchData();
  }, []);

  const checkAuthentication = () => {
    const token = localStorage.getItem('adminToken');
    const user = localStorage.getItem('adminUser');
    
    if (!token || !user) {
      navigate('/admin/login');
      return;
    }

    try {
      setAdminUser(JSON.parse(user));
    } catch (error) {
      console.error('Error parsing user data:', error);
      handleLogout();
    }
  };

  const fetchData = async () => {
    setLoading(true);
    const token = localStorage.getItem('adminToken');
    
    if (!token) {
      navigate('/admin/login');
      return;
    }

    try {
      console.log('Fetching admin data with token:', token ? token.substring(0, 20) + '...' : 'No token');
      
      const [contactsRes, internshipsRes, serviceRequestsRes, blogsRes, teamRes, equipmentRes, pagesRes, internshipProgramsRes, servicesRes] = await Promise.all([
        api.get('/api/admin/contacts/admin').catch(err => {
          console.error('Contacts fetch error:', err.response?.data || err.message);
          return { data: { success: false, data: [] } };
        }),
        api.get('/api/admin/internships/admin').catch(err => {
          console.error('Internships fetch error:', err.response?.data || err.message);
          return { data: { success: false, data: [] } };
        }),
        api.get('/api/admin/service-requests/admin').catch(err => {
          console.error('Service requests fetch error:', err.response?.data || err.message);
          console.error('Service requests fetch error status:', err.response?.status);
          console.error('Service requests fetch error headers:', err.response?.headers);
          return { data: { success: false, data: [] } };
        }),
        api.get('/api/admin/blogs/admin/all').catch(err => {
          console.error('Blogs fetch error:', err.response?.data || err.message);
          console.error('Blogs fetch error status:', err.response?.status);
          console.error('Blogs fetch error headers:', err.response?.headers);
          return { data: { success: false, data: { blogs: [] } } };
        }),
        api.get('/api/admin/team/admin/all').catch(err => {
          console.error('Team fetch error:', err.response?.data || err.message);
          console.error('Team fetch error status:', err.response?.status);
          console.error('Team fetch error headers:', err.response?.headers);
          return { data: { success: false, data: { team: [] } } };
        }),
        api.get('/api/admin/equipment/admin/all').catch(err => {
          console.error('Equipment fetch error:', err.response?.data || err.message);
          console.error('Equipment fetch error status:', err.response?.status);
          console.error('Equipment fetch error headers:', err.response?.headers);
          return { data: { success: false, data: { equipment: [] } } };
        }),
        api.get('/api/admin/pages/admin/all').catch(err => {
          console.error('Pages fetch error:', err.response?.data || err.message);
          return { data: { success: false, data: [] } };
        }),
        api.get('/api/admin/internships/admin/all').catch(err => {
          console.error('Internship Programs fetch error:', err.response?.data || err.message);
          return { data: { success: false, data: [] } };
        }),
        api.get('/api/admin/services/admin/all').catch(err => {
          console.error('Services fetch error:', err.response?.data || err.message);
          return { data: { success: false, data: [] } };
        })
      ]);
      
      console.log('API Responses:', {
        contacts: contactsRes.data,
        internships: internshipsRes.data,
        serviceRequests: serviceRequestsRes.data,
        blogs: blogsRes.data,
        team: teamRes.data,
        equipment: equipmentRes.data
      });
      
      if (contactsRes.data.success) {
        setContacts(contactsRes.data.data || []);
      }
      if (internshipsRes.data.success) {
        setInternships(internshipsRes.data.data || []);
      }
      if (serviceRequestsRes.data.success) {
        console.log('Setting service requests:', serviceRequestsRes.data.data);
        setServiceRequests(serviceRequestsRes.data.data || []);
      } else {
        console.log('Service requests fetch failed:', serviceRequestsRes.data);
      }
      if (blogsRes.data.success) {
        console.log('Setting blogs:', blogsRes.data.data?.blogs);
        setBlogs(blogsRes.data.data?.blogs || []);
      } else {
        console.log('Blogs fetch failed:', blogsRes.data);
      }
      if (teamRes.data.success) {
        console.log('Setting team:', teamRes.data.data?.team);
        setTeam(teamRes.data.data?.team || []);
      } else {
        console.log('Team fetch failed:', teamRes.data);
      }
      if (equipmentRes.data.success) {
        console.log('Setting equipment:', equipmentRes.data.data?.equipment);
        setEquipment(equipmentRes.data.data?.equipment || []);
      } else {
        console.log('Equipment fetch failed:', equipmentRes.data);
      }
      
      // Set new feature data
      if (pagesRes.data.success) {
        setPages(pagesRes.data.data || []);
      }
      if (internshipProgramsRes.data.success) {
        setInternshipPrograms(internshipProgramsRes.data.data || []);
      }
      if (servicesRes.data.success) {
        setLabServices(servicesRes.data.data || []);
      }
      
    } catch (error) {
      console.error('General fetch error:', error);
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again.');
        handleLogout();
      } else {
        toast.error(`Failed to fetch admin data: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin/login');
  };

  const handleStatusUpdate = async (type, id, newStatus) => {
    const token = localStorage.getItem('adminToken');

    try {
      await api.patch(`/api/admin/${type}/${id}`, { status: newStatus });
      toast.success(`${type} status updated successfully`);
      fetchData();
    } catch (error) {
      toast.error(`Failed to update ${type} status`);
    }
  };

  const handleDelete = async (type, id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;

    const token = localStorage.getItem('adminToken');

    try {
      await api.delete(`/api/admin/${type}/${id}`);
      toast.success(`${type} deleted successfully`);
      fetchData();
    } catch (error) {
      toast.error(`Failed to delete ${type}`);
    }
  };

  const viewDetails = (type, item) => {
    // For now, just show an alert with details
    // Later can be enhanced with a modal
    alert(`${type} Details:\n${JSON.stringify(item, null, 2)}`);
  };

  const handleEdit = (type, item) => {
    // For now, just show an alert
    // Later can be enhanced with a modal form
    alert(`Edit ${type}:\n${JSON.stringify(item, null, 2)}`);
  };

  const updateStatus = async (type, id, status) => {
    const token = localStorage.getItem('adminToken');
    
    try {
      await api.patch(`/api/admin/${type}/${id}`, { status });
      toast.success('Status updated successfully');
      fetchData();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const exportData = (data, filename) => {
    const csv = convertToCSV(data);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
  };

  const convertToCSV = (data) => {
    if (!data.length) return '';
    
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(obj => 
      Object.values(obj).map(val => 
        typeof val === 'string' && val.includes(',') ? `"${val}"` : val
      ).join(',')
    );
    
    return [headers, ...rows].join('\n');
  };

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || contact.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const filteredInternships = internships.filter(internship => {
    const matchesSearch = internship.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         internship.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || internship.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const DashboardStats = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-6 rounded-xl shadow-lg"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Total Contacts</p>
            <p className="text-2xl font-bold text-gray-900">{contacts.length}</p>
          </div>
          <div className="p-3 bg-blue-100 rounded-full">
            <FaEnvelope className="h-6 w-6 text-blue-600" />
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white p-6 rounded-xl shadow-lg"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Internship Applications</p>
            <p className="text-2xl font-bold text-gray-900">{internships.length}</p>
          </div>
          <div className="p-3 bg-green-100 rounded-full">
            <FaGraduationCap className="h-6 w-6 text-green-600" />
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white p-6 rounded-xl shadow-lg"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Service Requests</p>
            <p className="text-2xl font-bold text-gray-900">{serviceRequests.length}</p>
          </div>
          <div className="p-3 bg-cyan-100 rounded-full">
            <FaCog className="h-6 w-6 text-cyan-600" />
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white p-6 rounded-xl shadow-lg"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Blog Posts</p>
            <p className="text-2xl font-bold text-gray-900">{blogs.length}</p>
          </div>
          <div className="p-3 bg-purple-100 rounded-full">
            <FaBlog className="h-6 w-6 text-purple-600" />
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white p-6 rounded-xl shadow-lg"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Team Members</p>
            <p className="text-2xl font-bold text-gray-900">{team.length}</p>
          </div>
          <div className="p-3 bg-indigo-100 rounded-full">
            <FaUsers className="h-6 w-6 text-indigo-600" />
          </div>
        </div>
      </motion.div>
      
      {/* Second row for new features */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white p-6 rounded-xl shadow-lg"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Pages</p>
            <p className="text-2xl font-bold text-gray-900">{pages.length}</p>
          </div>
          <div className="p-3 bg-yellow-100 rounded-full">
            <FaBlog className="h-6 w-6 text-yellow-600" />
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white p-6 rounded-xl shadow-lg"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Internship Programs</p>
            <p className="text-2xl font-bold text-gray-900">{internshipPrograms.length}</p>
          </div>
          <div className="p-3 bg-emerald-100 rounded-full">
            <FaGraduationCap className="h-6 w-6 text-emerald-600" />
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-white p-6 rounded-xl shadow-lg"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Lab Services</p>
            <p className="text-2xl font-bold text-gray-900">{labServices.length}</p>
          </div>
          <div className="p-3 bg-pink-100 rounded-full">
            <FaFlask className="h-6 w-6 text-pink-600" />
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-white p-6 rounded-xl shadow-lg"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Lab Equipment</p>
            <p className="text-2xl font-bold text-gray-900">{equipment.length}</p>
          </div>
          <div className="p-3 bg-teal-100 rounded-full">
            <FaFlask className="h-6 w-6 text-teal-600" />
          </div>
        </div>
      </motion.div>
    </div>
  );

  const ContactsTable = () => (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h3 className="text-xl font-bold text-gray-900">Contact Form Submissions</h3>
          <div className="flex space-x-4">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search contacts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="resolved">Resolved</option>
            </select>
            <button
              onClick={() => exportData(filteredContacts, 'contacts.csv')}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              <FaDownload className="h-4 w-4" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subject</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredContacts.map((contact) => (
              <tr key={contact._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {contact.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {contact.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {contact.subject || 'General Inquiry'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {new Date(contact.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={contact.status}
                    onChange={(e) => updateStatus('contacts', contact._id, e.target.value)}
                    className={`text-xs px-2 py-1 rounded-full border-0 ${
                      contact.status === 'new' ? 'bg-yellow-100 text-yellow-800' :
                      contact.status === 'contacted' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                    }`}
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button className="text-blue-600 hover:text-blue-900">
                    <FaEye className="h-4 w-4" />
                  </button>
                  <button className="text-red-600 hover:text-red-900">
                    <FaTrash className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // Internship Applications Management
  const InternshipTable = () => {
    const filteredInternships = internships.filter(internship => {
      const matchesSearch = internship.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           internship.email?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterStatus === 'all' || internship.status === filterStatus;
      return matchesSearch && matchesFilter;
    });

    return (
      <div className="bg-white rounded-xl shadow-lg">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h3 className="text-xl font-semibold text-gray-900">Internship Applications</h3>
            <div className="flex gap-3">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search applications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applicant Info</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Program Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Education</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredInternships.map((internship) => (
                <tr key={internship._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{internship.fullName}</div>
                      <div className="text-sm text-gray-500">{internship.email}</div>
                      <div className="text-sm text-gray-500">{internship.phone}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">Duration: {internship.duration}</div>
                    <div className="text-sm text-gray-500">Field: {internship.field}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{internship.education}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(internship.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={internship.status}
                      onChange={(e) => handleStatusUpdate('internships', internship._id, e.target.value)}
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        internship.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        internship.status === 'approved' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}
                    >
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => viewDetails('internship', internship)}
                        className="text-blue-600 hover:text-blue-900"
                        title="View Details"
                      >
                        <FaEye className="h-4 w-4" />
                      </button>
                      {internship.resume && (
                        <a
                          href={`/uploads/resumes/${internship.resume}`}
                          download
                          className="text-green-600 hover:text-green-900"
                          title="Download Resume"
                        >
                          <FaDownload className="h-4 w-4" />
                        </a>
                      )}
                      <button
                        onClick={() => handleDelete('internships', internship._id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete"
                      >
                        <FaTrash className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // Service Requests Management
  const ServiceRequestsTable = () => {
    const filteredRequests = serviceRequests.filter(request => {
      const matchesSearch = request.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           request.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           request.serviceType?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterStatus === 'all' || request.status === filterStatus;
      return matchesSearch && matchesFilter;
    });

    return (
      <div className="bg-white rounded-xl shadow-lg">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h3 className="text-xl font-semibold text-gray-900">Service Requests</h3>
            <div className="flex gap-3">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search requests..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="new">New</option>
                <option value="reviewed">Reviewed</option>
                <option value="quoted">Quoted</option>
                <option value="accepted">Accepted</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client Info</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Urgency</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRequests.map((request) => (
                <tr key={request._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{request.name}</div>
                      <div className="text-sm text-gray-500">{request.email}</div>
                      <div className="text-sm text-gray-500">{request.phone}</div>
                      {request.company && <div className="text-sm text-gray-500">{request.company}</div>}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{request.serviceType}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      request.urgency === 'Urgent' ? 'bg-red-100 text-red-800' :
                      request.urgency === 'High' ? 'bg-orange-100 text-orange-800' :
                      request.urgency === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {request.urgency}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(request.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={request.status}
                      onChange={(e) => handleStatusUpdate('service-requests', request._id, e.target.value)}
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        request.status === 'new' ? 'bg-yellow-100 text-yellow-800' :
                        request.status === 'reviewed' ? 'bg-blue-100 text-blue-800' :
                        request.status === 'quoted' ? 'bg-purple-100 text-purple-800' :
                        request.status === 'accepted' ? 'bg-green-100 text-green-800' :
                        request.status === 'in_progress' ? 'bg-cyan-100 text-cyan-800' :
                        request.status === 'completed' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}
                    >
                      <option value="new">New</option>
                      <option value="reviewed">Reviewed</option>
                      <option value="quoted">Quoted</option>
                      <option value="accepted">Accepted</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => viewDetails('service-request', request)}
                        className="text-blue-600 hover:text-blue-900"
                        title="View Details"
                      >
                        <FaEye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleEdit('service-request', request)}
                        className="text-green-600 hover:text-green-900"
                        title="Edit"
                      >
                        <FaEdit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete('service-requests', request._id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete"
                      >
                        <FaTrash className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // Profile Management Component
  const ProfileManagement = () => {
    const [profileData, setProfileData] = useState({
      username: adminUser?.username || '',
      email: adminUser?.email || '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });

    const handleProfileUpdate = async (e) => {
      e.preventDefault();
      const token = localStorage.getItem('adminToken');


      if (profileData.newPassword && profileData.newPassword !== profileData.confirmPassword) {
        toast.error('New passwords do not match');
        return;
      }

      try {
        const updateData = {
          username: profileData.username,
          email: profileData.email
        };

        if (profileData.newPassword) {
          if (!profileData.currentPassword) {
            toast.error('Current password is required to change password');
            return;
          }
          updateData.currentPassword = profileData.currentPassword;
          updateData.newPassword = profileData.newPassword;
        }

        console.log('Updating profile with data:', updateData);
        
        const response = await api.put('/api/auth/profile', updateData);
        console.log('Profile update response:', response.data);
        
        toast.success('Profile updated successfully');
        
        // Update local storage
        const updatedUser = { ...adminUser, username: profileData.username, email: profileData.email };
        localStorage.setItem('adminUser', JSON.stringify(updatedUser));
        setAdminUser(updatedUser);
        
        // Clear password fields
        setProfileData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }));
      } catch (error) {
        console.error('Profile update error:', error);
        const errorMessage = error.response?.data?.message || 'Failed to update profile';
        toast.error(errorMessage);
      }
    };

    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Profile Settings</h2>
          
          <form onSubmit={handleProfileUpdate} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={profileData.username}
                  onChange={(e) => setProfileData(prev => ({...prev, username: e.target.value}))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData(prev => ({...prev, email: e.target.value}))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Change Password</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={profileData.currentPassword}
                    onChange={(e) => setProfileData(prev => ({...prev, currentPassword: e.target.value}))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={profileData.newPassword}
                      onChange={(e) => setProfileData(prev => ({...prev, newPassword: e.target.value}))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={profileData.confirmPassword}
                      onChange={(e) => setProfileData(prev => ({...prev, confirmPassword: e.target.value}))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
              >
                <span>Save Changes</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Team Management Component
  const TeamManagement = () => {
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [editingMember, setEditingMember] = useState(null);
    const [memberForm, setMemberForm] = useState({
      name: '',
      position: '',
      email: '',
      phone: '',
      bio: '',
      education: '',
      experience: '',
      specialization: '',
      department: 'Chemical',
      displayOrder: 0,
      joinDate: '',
      isActive: true,
      profileImage: null,
      socialLinks: {
        linkedin: '',
        twitter: '',
        researchGate: '',
        orcid: ''
      },
      achievements: [],
      publications: []
    });
    const [imagePreview, setImagePreview] = useState(null);

    const filteredTeam = team.filter(member => {
      const matchesSearch = member.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           member.position?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           member.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           member.specialization?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = filterStatus === 'all' || 
                          (filterStatus === 'active' && member.isActive) ||
                          (filterStatus === 'inactive' && !member.isActive);
      
      return matchesSearch && matchesStatus;
    });

    const handleImageChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        setMemberForm(prev => ({ ...prev, profileImage: file }));
        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result);
        reader.readAsDataURL(file);
      }
    };

    const resetForm = () => {
      setMemberForm({
        name: '',
        position: '',
        email: '',
        phone: '',
        bio: '',
        education: '',
        experience: '',
        specialization: '',
        department: 'Chemical',
        displayOrder: 0,
        joinDate: '',
        isActive: true,
        profileImage: null,
        socialLinks: {
          linkedin: '',
          twitter: '',
          researchGate: '',
          orcid: ''
        },
        achievements: [],
        publications: []
      });
      setImagePreview(null);
      setEditingMember(null);
      setShowCreateForm(false);
    };

    const handleCreateMember = async (e) => {
      e.preventDefault();
      const token = localStorage.getItem('adminToken');

      try {
        console.log('Creating team member with form data:', memberForm);

        // Validate required fields
        if (!memberForm.name || !memberForm.position) {
          toast.error('Name and position are required');
          return;
        }

        const formData = new FormData();
        formData.append('name', memberForm.name.trim());
        formData.append('position', memberForm.position.trim());
        formData.append('department', memberForm.department);
        formData.append('displayOrder', memberForm.displayOrder);
        formData.append('isActive', memberForm.isActive);
        
        if (memberForm.email) formData.append('email', memberForm.email);
        if (memberForm.phone) formData.append('phone', memberForm.phone);
        if (memberForm.bio) formData.append('bio', memberForm.bio);
        if (memberForm.education) formData.append('education', memberForm.education);
        if (memberForm.experience) formData.append('experience', memberForm.experience);
        if (memberForm.specialization) formData.append('specialization', memberForm.specialization);
        if (memberForm.joinDate) formData.append('joinDate', memberForm.joinDate);
        
        if (memberForm.profileImage) {
          formData.append('profileImage', memberForm.profileImage);
          console.log('Added profile image to form data:', memberForm.profileImage.name);
        }

        formData.append('socialLinks', JSON.stringify(memberForm.socialLinks));
        formData.append('achievements', JSON.stringify(memberForm.achievements));
        formData.append('publications', JSON.stringify(memberForm.publications));

        console.log('Sending team member creation request...');
        
        const response = await api.post('/api/admin/team/admin/create', formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });

        console.log('Team member creation response:', response.data);

        if (response.data.success) {
          toast.success('Team member created successfully!');
          resetForm();
          fetchData();
        } else {
          toast.error(response.data.message || 'Failed to create team member');
        }

      } catch (error) {
        console.error('Error creating team member:', error);
        console.error('Error response:', error.response?.data);
        toast.error(error.response?.data?.message || 'Failed to create team member');
      }
    };

    const handleEditMember = (member) => {
      console.log('Editing team member:', member);
      setEditingMember(member);
      setMemberForm({
        name: member.name || '',
        position: member.position || '',
        email: member.email || '',
        phone: member.phone || '',
        bio: member.bio || '',
        education: member.education || '',
        experience: member.experience || '',
        specialization: member.specialization || '',
        department: member.department || 'Chemical',
        displayOrder: member.displayOrder || 0,
        joinDate: member.joinDate ? new Date(member.joinDate).toISOString().split('T')[0] : '',
        isActive: member.isActive !== undefined ? member.isActive : true,
        profileImage: null,
        socialLinks: member.socialLinks || {
          linkedin: '',
          twitter: '',
          researchGate: '',
          orcid: ''
        },
        achievements: member.achievements || [],
        publications: member.publications || []
      });
      
      if (member.profileImage) {
        setImagePreview(`http://localhost:5000${member.profileImage}`);
      }
      
      setShowCreateForm(true);
    };

    const handleUpdateMember = async (e) => {
      e.preventDefault();
      const token = localStorage.getItem('adminToken');

      try {
        console.log('Updating team member:', editingMember._id);
        console.log('Update form data:', memberForm);

        const formData = new FormData();
        formData.append('name', memberForm.name);
        formData.append('position', memberForm.position);
        formData.append('department', memberForm.department);
        formData.append('displayOrder', memberForm.displayOrder);
        formData.append('isActive', memberForm.isActive);
        
        if (memberForm.email) formData.append('email', memberForm.email);
        if (memberForm.phone) formData.append('phone', memberForm.phone);
        if (memberForm.bio) formData.append('bio', memberForm.bio);
        if (memberForm.education) formData.append('education', memberForm.education);
        if (memberForm.experience) formData.append('experience', memberForm.experience);
        if (memberForm.specialization) formData.append('specialization', memberForm.specialization);
        if (memberForm.joinDate) formData.append('joinDate', memberForm.joinDate);
        
        if (memberForm.profileImage) {
          formData.append('profileImage', memberForm.profileImage);
        }

        formData.append('socialLinks', JSON.stringify(memberForm.socialLinks));
        formData.append('achievements', JSON.stringify(memberForm.achievements));
        formData.append('publications', JSON.stringify(memberForm.publications));

        await api.put(`/api/admin/team/admin/${editingMember._id}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });

        toast.success('Team member updated successfully!');
        resetForm();
        fetchData();

      } catch (error) {
        console.error('Error updating team member:', error);
        console.error('Error response:', error.response?.data);
        toast.error(error.response?.data?.message || 'Failed to update team member');
      }
    };

    const handleDeleteMember = async (memberId) => {
      if (!window.confirm('Are you sure you want to delete this team member?')) return;

      const token = localStorage.getItem('adminToken');

      try {
        await api.delete(`/api/admin/team/admin/${memberId}`, {

        });

        toast.success('Team member deleted successfully!');
        fetchData();

      } catch (error) {
        console.error('Error deleting team member:', error);
        toast.error('Failed to delete team member');
      }
    };

    const handleToggleStatus = async (memberId) => {
      const token = localStorage.getItem('adminToken');

      try {
        await api.patch(`/api/admin/team/admin/${memberId}/toggle-status`, {}, {

        });

        toast.success('Team member status updated!');
        fetchData();

      } catch (error) {
        console.error('Error toggling member status:', error);
        toast.error('Failed to update member status');
      }
    };

    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-900">Team Management</h2>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2"
          >
            <FaPlus />
            <span>Add Team Member</span>
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-1">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search team members..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex space-x-4">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* Team Members Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Member
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Position
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTeam.map((member) => (
                  <tr key={member._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {member.profileImage ? (
                            <img 
                              className="h-10 w-10 rounded-full object-cover" 
                              src={`http://localhost:5000${member.profileImage}`} 
                              alt={member.name}
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                              <FaUser className="text-gray-600" />
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {member.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            Order: {member.displayOrder}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{member.position}</div>
                      {member.specialization && (
                        <div className="text-sm text-gray-500">{member.specialization}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {member.department}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{member.email}</div>
                      <div className="text-sm text-gray-500">{member.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        member.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {member.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleEditMember(member)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleToggleStatus(member._id)}
                        className="text-yellow-600 hover:text-yellow-900"
                      >
                        <FaEye />
                      </button>
                      <button
                        onClick={() => handleDeleteMember(member._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Create/Edit Member Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-900">
                  {editingMember ? 'Edit Team Member' : 'Add New Team Member'}
                </h3>
                <button
                  onClick={resetForm}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={editingMember ? handleUpdateMember : handleCreateMember} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <h4 className="text-md font-semibold text-gray-800">Basic Information</h4>
                    
                    <input
                      type="text"
                      placeholder="Full Name *"
                      value={memberForm.name}
                      onChange={(e) => setMemberForm(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />

                    <input
                      type="text"
                      placeholder="Position *"
                      value={memberForm.position}
                      onChange={(e) => setMemberForm(prev => ({ ...prev, position: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />

                    <select
                      value={memberForm.department}
                      onChange={(e) => setMemberForm(prev => ({ ...prev, department: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="Chemical">Chemical</option>
                      <option value="Biological">Biological</option>
                      <option value="Administration">Administration</option>
                      <option value="Management">Management</option>
                      <option value="Research">Research</option>
                    </select>

                    <input
                      type="email"
                      placeholder="Email"
                      value={memberForm.email}
                      onChange={(e) => setMemberForm(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />

                    <input
                      type="tel"
                      placeholder="Phone"
                      value={memberForm.phone}
                      onChange={(e) => setMemberForm(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />

                    <input
                      type="number"
                      placeholder="Display Order"
                      value={memberForm.displayOrder}
                      onChange={(e) => setMemberForm(prev => ({ ...prev, displayOrder: parseInt(e.target.value) || 0 }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />

                    <input
                      type="date"
                      placeholder="Join Date"
                      value={memberForm.joinDate}
                      onChange={(e) => setMemberForm(prev => ({ ...prev, joinDate: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  {/* Profile Image & Status */}
                  <div className="space-y-4">
                    <h4 className="text-md font-semibold text-gray-800">Profile Image & Status</h4>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Profile Image</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                      {imagePreview && (
                        <div className="mt-2">
                          <img 
                            src={imagePreview} 
                            alt="Preview" 
                            className="h-20 w-20 object-cover rounded-lg"
                          />
                        </div>
                      )}
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="isActive"
                        checked={memberForm.isActive}
                        onChange={(e) => setMemberForm(prev => ({ ...prev, isActive: e.target.checked }))}
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      />
                      <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                        Active Status
                      </label>
                    </div>
                  </div>
                </div>

                {/* Professional Details */}
                <div className="space-y-4">
                  <h4 className="text-md font-semibold text-gray-800">Professional Details</h4>
                  
                  <textarea
                    placeholder="Bio/Description"
                    value={memberForm.bio}
                    onChange={(e) => setMemberForm(prev => ({ ...prev, bio: e.target.value }))}
                    rows="3"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <textarea
                      placeholder="Education"
                      value={memberForm.education}
                      onChange={(e) => setMemberForm(prev => ({ ...prev, education: e.target.value }))}
                      rows="2"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />

                    <textarea
                      placeholder="Experience"
                      value={memberForm.experience}
                      onChange={(e) => setMemberForm(prev => ({ ...prev, experience: e.target.value }))}
                      rows="2"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  <input
                    type="text"
                    placeholder="Specialization"
                    value={memberForm.specialization}
                    onChange={(e) => setMemberForm(prev => ({ ...prev, specialization: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                {/* Social Links */}
                <div className="space-y-4">
                  <h4 className="text-md font-semibold text-gray-800">Social Links</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="url"
                      placeholder="LinkedIn URL"
                      value={memberForm.socialLinks.linkedin}
                      onChange={(e) => setMemberForm(prev => ({ 
                        ...prev, 
                        socialLinks: { ...prev.socialLinks, linkedin: e.target.value }
                      }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />

                    <input
                      type="url"
                      placeholder="ResearchGate URL"
                      value={memberForm.socialLinks.researchGate}
                      onChange={(e) => setMemberForm(prev => ({ 
                        ...prev, 
                        socialLinks: { ...prev.socialLinks, researchGate: e.target.value }
                      }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />

                    <input
                      type="url"
                      placeholder="Twitter URL"
                      value={memberForm.socialLinks.twitter}
                      onChange={(e) => setMemberForm(prev => ({ 
                        ...prev, 
                        socialLinks: { ...prev.socialLinks, twitter: e.target.value }
                      }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />

                    <input
                      type="url"
                      placeholder="ORCID URL"
                      value={memberForm.socialLinks.orcid}
                      onChange={(e) => setMemberForm(prev => ({ 
                        ...prev, 
                        socialLinks: { ...prev.socialLinks, orcid: e.target.value }
                      }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end space-x-4 pt-4 border-t">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    {editingMember ? 'Update Member' : 'Create Member'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Equipment Management Component
  const EquipmentManagement = () => {
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [editingEquipment, setEditingEquipment] = useState(null);
    const [equipmentForm, setEquipmentForm] = useState({
      name: '',
      model: '',
      manufacturer: '',
      category: 'Spectroscopy',
      description: '',
      technicalSpecs: '',
      applications: '',
      serialNumber: '',
      purchaseDate: '',
      warrantyExpiry: '',
      operatingStatus: 'Operational',
      location: {
        building: '',
        floor: '',
        room: '',
        exactLocation: ''
      },
      responsiblePerson: {
        name: '',
        email: '',
        phone: '',
        department: ''
      },
      cost: {
        purchasePrice: '',
        currency: 'INR',
        annualMaintenanceCost: ''
      },
      tags: [],
      displayOrder: 0,
      isPublicDisplay: true,
      featured: false,
      equipmentImages: [],
      manuals: [],
      maintenanceSchedule: {
        frequency: 'Monthly',
        lastMaintenance: '',
        nextMaintenance: '',
        maintenanceNotes: ''
      }
    });
    const [imagePreview, setImagePreview] = useState([]);
    const [manualFiles, setManualFiles] = useState([]);

    console.log('Equipment state in EquipmentManagement:', equipment);
    console.log('Equipment length:', equipment.length);
    
    const filteredEquipment = equipment.filter(item => {
      const matchesSearch = item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.manufacturer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.serialNumber?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = filterStatus === 'all' || 
                          (filterStatus === 'operational' && item.operatingStatus === 'Operational') ||
                          (filterStatus === 'maintenance' && item.operatingStatus === 'Under Maintenance') ||
                          (filterStatus === 'out-of-order' && item.operatingStatus === 'Out of Order') ||
                          (filterStatus === 'retired' && item.operatingStatus === 'Retired');
      
      return matchesSearch && matchesStatus;
    });
    
    console.log('Filtered equipment length:', filteredEquipment.length);

    const handleImageChange = (e) => {
      const files = Array.from(e.target.files);
      if (files.length > 0) {
        setEquipmentForm(prev => ({ ...prev, equipmentImages: files }));
        
        // Create previews
        const previews = [];
        files.forEach(file => {
          const reader = new FileReader();
          reader.onloadend = () => {
            previews.push(reader.result);
            setImagePreview([...previews]);
          };
          reader.readAsDataURL(file);
        });
      }
    };

    const handleManualChange = (e) => {
      const files = Array.from(e.target.files);
      if (files.length > 0) {
        setEquipmentForm(prev => ({ ...prev, manuals: files }));
        setManualFiles(files);
      }
    };

    const resetForm = () => {
      setEquipmentForm({
        name: '',
        model: '',
        manufacturer: '',
        category: 'Spectroscopy',
        description: '',
        technicalSpecs: '',
        applications: '',
        serialNumber: '',
        purchaseDate: '',
        warrantyExpiry: '',
        operatingStatus: 'Operational',
        location: {
          building: '',
          floor: '',
          room: '',
          exactLocation: ''
        },
        responsiblePerson: {
          name: '',
          email: '',
          phone: '',
          department: ''
        },
        cost: {
          purchasePrice: '',
          currency: 'INR',
          annualMaintenanceCost: ''
        },
        tags: [],
        displayOrder: 0,
        isPublicDisplay: true,
        featured: false,
        equipmentImages: [],
        manuals: [],
        maintenanceSchedule: {
          frequency: 'Monthly',
          lastMaintenance: '',
          nextMaintenance: '',
          maintenanceNotes: ''
        }
      });
      setImagePreview([]);
      setManualFiles([]);
      setEditingEquipment(null);
      setShowCreateForm(false);
    };

    const handleCreateEquipment = async (e) => {
      e.preventDefault();
      const token = localStorage.getItem('adminToken');

      try {
        console.log('Creating equipment with form data:', equipmentForm);

        const formData = new FormData();
        formData.append('name', equipmentForm.name);
        formData.append('category', equipmentForm.category);
        formData.append('operatingStatus', equipmentForm.operatingStatus);
        formData.append('displayOrder', equipmentForm.displayOrder);
        formData.append('isPublicDisplay', equipmentForm.isPublicDisplay);
        formData.append('featured', equipmentForm.featured);
        
        if (equipmentForm.model) formData.append('model', equipmentForm.model);
        if (equipmentForm.manufacturer) formData.append('manufacturer', equipmentForm.manufacturer);
        if (equipmentForm.description) formData.append('description', equipmentForm.description);
        if (equipmentForm.technicalSpecs) formData.append('technicalSpecs', equipmentForm.technicalSpecs);
        if (equipmentForm.applications) formData.append('applications', equipmentForm.applications);
        if (equipmentForm.serialNumber) formData.append('serialNumber', equipmentForm.serialNumber);
        if (equipmentForm.purchaseDate) formData.append('purchaseDate', equipmentForm.purchaseDate);
        if (equipmentForm.warrantyExpiry) formData.append('warrantyExpiry', equipmentForm.warrantyExpiry);
        
        formData.append('location', JSON.stringify(equipmentForm.location));
        formData.append('responsiblePerson', JSON.stringify(equipmentForm.responsiblePerson));
        formData.append('cost', JSON.stringify(equipmentForm.cost));
        formData.append('maintenanceSchedule', JSON.stringify(equipmentForm.maintenanceSchedule));
        formData.append('tags', JSON.stringify(equipmentForm.tags));

        // Add images
        if (equipmentForm.equipmentImages && equipmentForm.equipmentImages.length > 0) {
          equipmentForm.equipmentImages.forEach(image => {
            formData.append('equipmentImages', image);
          });
        }

        // Add manuals
        if (equipmentForm.manuals && equipmentForm.manuals.length > 0) {
          equipmentForm.manuals.forEach(manual => {
            formData.append('manuals', manual);
          });
        }

        console.log('Sending equipment creation request...');
        
        const response = await api.post('/api/admin/equipment/admin/create', formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });

        console.log('Equipment creation response:', response.data);

        if (response.data.success) {
          toast.success('Equipment created successfully!');
          resetForm();
          fetchData();
        } else {
          toast.error(response.data.message || 'Failed to create equipment');
        }

      } catch (error) {
        console.error('Error creating equipment:', error);
        console.error('Error response:', error.response?.data);
        toast.error(error.response?.data?.message || 'Failed to create equipment');
      }
    };

    const handleEditEquipment = (item) => {
      console.log('Editing equipment:', item);
      setEditingEquipment(item);
      setEquipmentForm({
        name: item.name || '',
        model: item.model || '',
        manufacturer: item.manufacturer || '',
        category: item.category || 'Spectroscopy',
        description: item.description || '',
        technicalSpecs: item.technicalSpecs || '',
        applications: item.applications || '',
        serialNumber: item.serialNumber || '',
        purchaseDate: item.purchaseDate ? new Date(item.purchaseDate).toISOString().split('T')[0] : '',
        warrantyExpiry: item.warrantyExpiry ? new Date(item.warrantyExpiry).toISOString().split('T')[0] : '',
        operatingStatus: item.operatingStatus || 'Operational',
        location: item.location || {
          building: '',
          floor: '',
          room: '',
          exactLocation: ''
        },
        responsiblePerson: item.responsiblePerson || {
          name: '',
          email: '',
          phone: '',
          department: ''
        },
        cost: item.cost || {
          purchasePrice: '',
          currency: 'INR',
          annualMaintenanceCost: ''
        },
        tags: item.tags || [],
        displayOrder: item.displayOrder || 0,
        isPublicDisplay: item.isPublicDisplay !== undefined ? item.isPublicDisplay : true,
        featured: item.featured || false,
        equipmentImages: [],
        manuals: [],
        maintenanceSchedule: item.maintenanceSchedule || {
          frequency: 'Monthly',
          lastMaintenance: '',
          nextMaintenance: '',
          maintenanceNotes: ''
        }
      });
      
      if (item.equipmentImages && item.equipmentImages.length > 0) {
        setImagePreview(item.equipmentImages.map(img => `http://localhost:5000${img}`));
      }
      
      setShowCreateForm(true);
    };

    const handleUpdateEquipment = async (e) => {
      e.preventDefault();
      const token = localStorage.getItem('adminToken');

      try {
        console.log('Updating equipment:', editingEquipment._id);
        console.log('Update form data:', equipmentForm);

        const formData = new FormData();
        formData.append('name', equipmentForm.name);
        formData.append('category', equipmentForm.category);
        formData.append('operatingStatus', equipmentForm.operatingStatus);
        formData.append('displayOrder', equipmentForm.displayOrder);
        formData.append('isPublicDisplay', equipmentForm.isPublicDisplay);
        formData.append('featured', equipmentForm.featured);
        
        if (equipmentForm.model) formData.append('model', equipmentForm.model);
        if (equipmentForm.manufacturer) formData.append('manufacturer', equipmentForm.manufacturer);
        if (equipmentForm.description) formData.append('description', equipmentForm.description);
        if (equipmentForm.technicalSpecs) formData.append('technicalSpecs', equipmentForm.technicalSpecs);
        if (equipmentForm.applications) formData.append('applications', equipmentForm.applications);
        if (equipmentForm.serialNumber) formData.append('serialNumber', equipmentForm.serialNumber);
        if (equipmentForm.purchaseDate) formData.append('purchaseDate', equipmentForm.purchaseDate);
        if (equipmentForm.warrantyExpiry) formData.append('warrantyExpiry', equipmentForm.warrantyExpiry);
        
        formData.append('location', JSON.stringify(equipmentForm.location));
        formData.append('responsiblePerson', JSON.stringify(equipmentForm.responsiblePerson));
        formData.append('cost', JSON.stringify(equipmentForm.cost));
        formData.append('maintenanceSchedule', JSON.stringify(equipmentForm.maintenanceSchedule));
        formData.append('tags', JSON.stringify(equipmentForm.tags));

        // Add new images if selected
        if (equipmentForm.equipmentImages && equipmentForm.equipmentImages.length > 0) {
          equipmentForm.equipmentImages.forEach(image => {
            formData.append('equipmentImages', image);
          });
        }

        // Add new manuals if selected
        if (equipmentForm.manuals && equipmentForm.manuals.length > 0) {
          equipmentForm.manuals.forEach(manual => {
            formData.append('manuals', manual);
          });
        }

        await api.put(`/api/admin/equipment/admin/${editingEquipment._id}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });

        toast.success('Equipment updated successfully!');
        resetForm();
        fetchData();

      } catch (error) {
        console.error('Error updating equipment:', error);
        console.error('Error response:', error.response?.data);
        toast.error(error.response?.data?.message || 'Failed to update equipment');
      }
    };

    const handleDeleteEquipment = async (equipmentId) => {
      if (!window.confirm('Are you sure you want to delete this equipment?')) return;

      const token = localStorage.getItem('adminToken');

      try {
        await api.delete(`/api/admin/equipment/admin/${equipmentId}`, {

        });

        toast.success('Equipment deleted successfully!');
        fetchData();

      } catch (error) {
        console.error('Error deleting equipment:', error);
        toast.error('Failed to delete equipment');
      }
    };

    const handleToggleStatus = async (equipmentId) => {
      const token = localStorage.getItem('adminToken');

      try {
        await api.patch(`/api/admin/equipment/admin/${equipmentId}/toggle-status`, {}, {

        });

        toast.success('Equipment status updated!');
        fetchData();

      } catch (error) {
        console.error('Error toggling equipment status:', error);
        toast.error('Failed to update equipment status');
      }
    };

    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-900">Equipment Management</h2>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2"
          >
            <FaPlus />
            <span>Add Equipment</span>
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-1">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search equipment..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex space-x-4">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="operational">Operational</option>
                <option value="maintenance">Under Maintenance</option>
                <option value="out-of-order">Out of Order</option>
                <option value="retired">Retired</option>
              </select>
            </div>
          </div>
        </div>

        {/* Equipment Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Equipment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEquipment.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                      <div className="flex flex-col items-center">
                        <FaFlask className="h-12 w-12 text-gray-300 mb-4" />
                        <p className="text-lg font-medium text-gray-600">No equipment found</p>
                        <p className="text-sm text-gray-500">
                          {equipment.length === 0 
                            ? "No equipment has been added yet. Click 'Add Equipment' to get started."
                            : "No equipment matches your current search criteria."
                          }
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredEquipment.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {item.equipmentImages && item.equipmentImages.length > 0 ? (
                            <img 
                              className="h-10 w-10 rounded-lg object-cover" 
                              src={`${API_BASE_URL}${item.equipmentImages[0]}`} 
                              alt={item.name}
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-lg bg-gray-300 flex items-center justify-center">
                              <FaFlask className="text-gray-600" />
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {item.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {item.model} {item.manufacturer && `- ${item.manufacturer}`}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        item.operatingStatus === 'Operational' ? 'bg-green-100 text-green-800' :
                        item.operatingStatus === 'Under Maintenance' ? 'bg-yellow-100 text-yellow-800' :
                        item.operatingStatus === 'Out of Order' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {item.operatingStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">SN: {item.serialNumber || 'N/A'}</div>
                      <div className="text-sm text-gray-500">Order: {item.displayOrder}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleEditEquipment(item)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleToggleStatus(item._id)}
                        className="text-yellow-600 hover:text-yellow-900"
                      >
                        <FaEye />
                      </button>
                      <button
                        onClick={() => handleDeleteEquipment(item._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Create/Edit Equipment Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-10 mx-auto p-5 border w-11/12 max-w-5xl shadow-lg rounded-md bg-white max-h-screen overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-900">
                  {editingEquipment ? 'Edit Equipment' : 'Add New Equipment'}
                </h3>
                <button
                  onClick={resetForm}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={editingEquipment ? handleUpdateEquipment : handleCreateEquipment} className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="text-md font-semibold text-gray-800">Basic Information</h4>
                    
                    <input
                      type="text"
                      placeholder="Equipment Name *"
                      value={equipmentForm.name}
                      onChange={(e) => setEquipmentForm(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />

                    <input
                      type="text"
                      placeholder="Model"
                      value={equipmentForm.model}
                      onChange={(e) => setEquipmentForm(prev => ({ ...prev, model: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />

                    <input
                      type="text"
                      placeholder="Manufacturer"
                      value={equipmentForm.manufacturer}
                      onChange={(e) => setEquipmentForm(prev => ({ ...prev, manufacturer: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />

                    <select
                      value={equipmentForm.category}
                      onChange={(e) => setEquipmentForm(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="Spectroscopy">Spectroscopy</option>
                      <option value="Chromatography">Chromatography</option>
                      <option value="Mass Spectrometry">Mass Spectrometry</option>
                      <option value="Analytical Balance">Analytical Balance</option>
                      <option value="Sample Preparation">Sample Preparation</option>
                      <option value="Microbiology">Microbiology</option>
                      <option value="Cell Culture">Cell Culture</option>
                      <option value="General Laboratory">General Laboratory</option>
                      <option value="Safety Equipment">Safety Equipment</option>
                      <option value="Environmental Control">Environmental Control</option>
                    </select>

                    <input
                      type="text"
                      placeholder="Serial Number"
                      value={equipmentForm.serialNumber}
                      onChange={(e) => setEquipmentForm(prev => ({ ...prev, serialNumber: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-md font-semibold text-gray-800">Status & Display</h4>
                    
                    <select
                      value={equipmentForm.operatingStatus}
                      onChange={(e) => setEquipmentForm(prev => ({ ...prev, operatingStatus: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="Operational">Operational</option>
                      <option value="Under Maintenance">Under Maintenance</option>
                      <option value="Out of Order">Out of Order</option>
                      <option value="Retired">Retired</option>
                    </select>

                    <input
                      type="number"
                      placeholder="Display Order"
                      value={equipmentForm.displayOrder}
                      onChange={(e) => setEquipmentForm(prev => ({ ...prev, displayOrder: parseInt(e.target.value) || 0 }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />

                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="isPublicDisplay"
                          checked={equipmentForm.isPublicDisplay}
                          onChange={(e) => setEquipmentForm(prev => ({ ...prev, isPublicDisplay: e.target.checked }))}
                          className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                        />
                        <label htmlFor="isPublicDisplay" className="ml-2 block text-sm text-gray-900">
                          Public Display
                        </label>
                      </div>

                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="featured"
                          checked={equipmentForm.featured}
                          onChange={(e) => setEquipmentForm(prev => ({ ...prev, featured: e.target.checked }))}
                          className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                        />
                        <label htmlFor="featured" className="ml-2 block text-sm text-gray-900">
                          Featured
                        </label>
                      </div>
                    </div>

                    <input
                      type="date"
                      placeholder="Purchase Date"
                      value={equipmentForm.purchaseDate}
                      onChange={(e) => setEquipmentForm(prev => ({ ...prev, purchaseDate: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />

                    <input
                      type="date"
                      placeholder="Warranty Expiry"
                      value={equipmentForm.warrantyExpiry}
                      onChange={(e) => setEquipmentForm(prev => ({ ...prev, warrantyExpiry: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Description & Specifications */}
                <div className="space-y-4">
                  <h4 className="text-md font-semibold text-gray-800">Description & Specifications</h4>
                  
                  <textarea
                    placeholder="Description"
                    value={equipmentForm.description}
                    onChange={(e) => setEquipmentForm(prev => ({ ...prev, description: e.target.value }))}
                    rows="3"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />

                  <textarea
                    placeholder="Technical Specifications"
                    value={equipmentForm.technicalSpecs}
                    onChange={(e) => setEquipmentForm(prev => ({ ...prev, technicalSpecs: e.target.value }))}
                    rows="4"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />

                  <textarea
                    placeholder="Applications"
                    value={equipmentForm.applications}
                    onChange={(e) => setEquipmentForm(prev => ({ ...prev, applications: e.target.value }))}
                    rows="3"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                {/* Files */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Equipment Images</label>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                    {imagePreview.length > 0 && (
                      <div className="mt-2 flex space-x-2">
                        {imagePreview.map((preview, index) => (
                          <img 
                            key={index}
                            src={preview} 
                            alt="Preview" 
                            className="h-16 w-16 object-cover rounded-lg"
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Manuals</label>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.txt"
                      multiple
                      onChange={handleManualChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                    {manualFiles.length > 0 && (
                      <div className="mt-2">
                        {manualFiles.map((file, index) => (
                          <div key={index} className="text-sm text-gray-600">
                            📄 {file.name}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end space-x-4 pt-4 border-t">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    {editingEquipment ? 'Update Equipment' : 'Create Equipment'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Pages Management Component
  const PagesManagement = () => {
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [editingPage, setEditingPage] = useState(null);
    const [pageForm, setPageForm] = useState({
      title: '',
      slug: '',
      content: '',
      metaDescription: '',
      status: 'published',
      pageType: 'static'
    });

    const pageTypes = [
      { value: 'privacy-policy', label: 'Privacy Policy' },
      { value: 'terms-of-service', label: 'Terms of Service' },
      { value: 'about-us', label: 'About Us' },
      { value: 'contact-us', label: 'Contact Us' },
      { value: 'sitemap', label: 'Sitemap' },
      { value: 'disclaimer', label: 'Disclaimer' },
      { value: 'refund-policy', label: 'Refund Policy' },
      { value: 'static', label: 'Static Page' }
    ];

    const resetPageForm = () => {
      setEditingPage(null);
      setShowCreateForm(false);
      setPageForm({
        title: '',
        slug: '',
        content: '',
        metaDescription: '',
        status: 'published',
        pageType: 'static'
      });
    };

    const handleCreatePage = async (e) => {
      e.preventDefault();
      setLoading(true);
      
      // Enhanced validation
      if (!pageForm.title.trim()) {
        toast.error('Page title is required');
        setLoading(false);
        return;
      }

      if (!pageForm.content.trim()) {
        toast.error('Page content is required');
        setLoading(false);
        return;
      }

      if (pageForm.title.length < 3) {
        toast.error('Page title must be at least 3 characters long');
        setLoading(false);
        return;
      }

      try {
        const pageData = {
          ...pageForm,
          slug: pageForm.slug || pageForm.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
          title: pageForm.title.trim(),
          content: pageForm.content.trim(),
          metaDescription: pageForm.metaDescription.trim()
        };

        console.log('Creating page with data:', pageData);
        const response = await api.post('/api/admin/pages/admin', pageData);
        
        if (response.data.success) {
          toast.success('Page created successfully!');
          resetPageForm();
          setShowCreateForm(false);
          fetchData(); // Refresh all data including pages
        } else {
          toast.error(response.data.message || 'Failed to create page');
        }
      } catch (error) {
        console.error('Error creating page:', error);
        
        // Enhanced error handling
        if (error.response) {
          const errorData = error.response.data;
          
          if (error.response.status === 400) {
            if (errorData.errors && Array.isArray(errorData.errors)) {
              errorData.errors.forEach(err => toast.error(err));
            } else {
              toast.error(errorData.message || 'Validation failed');
            }
          } else if (error.response.status === 401) {
            toast.error('Authentication failed. Please login again.');
            navigate('/admin/login');
          } else if (error.response.status === 409) {
            toast.error('Page with this slug already exists');
          } else if (error.response.status === 503) {
            toast.error('Database connection error. Please try again.');
          } else {
            toast.error(errorData.message || 'Failed to create page');
          }
        } else if (error.request) {
          toast.error('Network error. Please check your connection.');
        } else {
          toast.error('Something went wrong. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    const handleUpdatePage = async (e) => {
      e.preventDefault();
      
      try {
        await api.put(`/api/admin/pages/${editingPage._id}`, pageForm);
        toast.success('Page updated successfully!');
        resetPageForm();
        fetchData();
      } catch (error) {
        console.error('Error updating page:', error);
        toast.error(error.response?.data?.message || 'Failed to update page');
      }
    };

    const handleDeletePage = async (pageId) => {
      if (!window.confirm('Are you sure you want to delete this page?')) return;

      try {
        await api.delete(`/api/admin/pages/${pageId}`);
        toast.success('Page deleted successfully!');
        fetchData();
      } catch (error) {
        console.error('Error deleting page:', error);
        toast.error('Failed to delete page');
      }
    };

    const startEditPage = (page) => {
      setEditingPage(page);
      setPageForm({
        title: page.title,
        slug: page.slug,
        content: page.content,
        metaDescription: page.metaDescription || '',
        status: page.status,
        pageType: page.pageType
      });
      setShowCreateForm(true);
    };

    const fetchPages = async () => {
      try {
        const response = await api.get('/api/admin/pages');
        setPages(response.data.data || []);
      } catch (error) {
        console.error('Error fetching pages:', error);
      }
    };

    // Data already fetched in main component

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold text-gray-900">Pages Management</h2>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
          >
            <FaPlus className="h-4 w-4" />
            <span>Create New Page</span>
          </button>
        </div>

        {/* Create/Edit Form */}
        {showCreateForm && (
          <div className="bg-white p-8 rounded-lg shadow-lg border">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                {editingPage ? 'Edit Page' : 'Create New Page'}
              </h3>
              <button
                onClick={resetPageForm}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTrash className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={editingPage ? handleUpdatePage : handleCreatePage} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Page Title</label>
                  <input
                    type="text"
                    value={pageForm.title}
                    onChange={(e) => setPageForm(prev => ({...prev, title: e.target.value}))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter page title"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Page Type</label>
                  <select
                    value={pageForm.pageType}
                    onChange={(e) => setPageForm(prev => ({...prev, pageType: e.target.value}))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {pageTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">URL Slug</label>
                  <input
                    type="text"
                    value={pageForm.slug}
                    onChange={(e) => setPageForm(prev => ({...prev, slug: e.target.value}))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="page-url-slug"
                  />
                  <p className="text-xs text-gray-500 mt-1">Leave empty to auto-generate from title</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={pageForm.status}
                    onChange={(e) => setPageForm(prev => ({...prev, status: e.target.value}))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                    <option value="private">Private</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Meta Description</label>
                <textarea
                  value={pageForm.metaDescription}
                  onChange={(e) => setPageForm(prev => ({...prev, metaDescription: e.target.value}))}
                  rows={2}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="SEO meta description"
                  maxLength={160}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Page Content</label>
                <RichTextEditor
                  value={pageForm.content}
                  onChange={(content) => setPageForm(prev => ({...prev, content}))}
                  placeholder="Write your page content here..."
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={resetPageForm}
                  className="px-6 py-3 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  {editingPage ? 'Update Page' : 'Create Page'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Pages List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Slug</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Updated</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pages.map((page) => (
                  <tr key={page._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{page.title}</div>
                      <div className="text-sm text-gray-500">{page.metaDescription || 'No description'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                        {pageTypes.find(t => t.value === page.pageType)?.label || page.pageType}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <code className="text-sm text-gray-600">/{page.slug}</code>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        page.status === 'published' ? 'bg-green-100 text-green-800' :
                        page.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {page.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(page.updatedAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => startEditPage(page)}
                          className="text-green-600 hover:text-green-900"
                          title="Edit"
                        >
                          <FaEdit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeletePage(page._id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
                        >
                          <FaTrash className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // Internship Management Component
  const InternshipManagement = () => {
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [editingInternship, setEditingInternship] = useState(null);
    const [internshipForm, setInternshipForm] = useState({
      title: '',
      description: '',
      requirements: '',
      duration: '',
      stipend: '',
      location: 'Bhubaneswar',
      category: 'Technical',
      positions: 1,
      deadline: '',
      status: 'active',
      skills: '',
      benefits: ''
    });

    const categories = ['Technical', 'Research', 'Administrative', 'Field Work', 'Laboratory'];
    const locations = ['Bhubaneswar', 'Remote', 'On-site', 'Hybrid'];

    const handleCreateInternship = async (e) => {
      e.preventDefault();
      
      if (!internshipForm.title.trim() || !internshipForm.description.trim()) {
        toast.error('Title and description are required');
        return;
      }

      try {
        const internshipData = {
          ...internshipForm,
          skills: internshipForm.skills.split(',').map(s => s.trim()).filter(s => s),
          benefits: internshipForm.benefits.split(',').map(s => s.trim()).filter(s => s)
        };

        await api.post('/api/admin/internships/admin', internshipData);
        toast.success('Internship created successfully!');
        resetInternshipForm();
        fetchData();
      } catch (error) {
        console.error('Error creating internship:', error);
        toast.error(error.response?.data?.message || 'Failed to create internship');
      }
    };

    const handleUpdateInternship = async (e) => {
      e.preventDefault();
      
      try {
        const internshipData = {
          ...internshipForm,
          skills: internshipForm.skills.split(',').map(s => s.trim()).filter(s => s),
          benefits: internshipForm.benefits.split(',').map(s => s.trim()).filter(s => s)
        };

        await api.put(`/api/admin/internships/admin/${editingInternship._id}`, internshipData);
        toast.success('Internship updated successfully!');
        resetInternshipForm();
        fetchData();
      } catch (error) {
        console.error('Error updating internship:', error);
        toast.error(error.response?.data?.message || 'Failed to update internship');
      }
    };

    const handleDeleteInternship = async (internshipId) => {
      if (!window.confirm('Are you sure you want to delete this internship?')) return;

      try {
        await api.delete(`/api/admin/internships/admin/${internshipId}`);
        toast.success('Internship deleted successfully!');
        fetchData();
      } catch (error) {
        console.error('Error deleting internship:', error);
        toast.error('Failed to delete internship');
      }
    };

    const startEditInternship = (internship) => {
      setEditingInternship(internship);
      setInternshipForm({
        title: internship.title,
        description: internship.description,
        requirements: internship.requirements,
        duration: internship.duration,
        stipend: internship.stipend || '',
        location: internship.location,
        category: internship.category,
        positions: internship.positions,
        deadline: internship.deadline ? new Date(internship.deadline).toISOString().split('T')[0] : '',
        status: internship.status,
        skills: internship.skills ? internship.skills.join(', ') : '',
        benefits: internship.benefits ? internship.benefits.join(', ') : ''
      });
      setShowCreateForm(true);
    };

    const resetInternshipForm = () => {
      setEditingInternship(null);
      setShowCreateForm(false);
      setInternshipForm({
        title: '',
        description: '',
        requirements: '',
        duration: '',
        stipend: '',
        location: 'Bhubaneswar',
        category: 'Technical',
        positions: 1,
        deadline: '',
        status: 'active',
        skills: '',
        benefits: ''
      });
    };

    const fetchInternships = async () => {
      try {
        const response = await api.get('/api/admin/internships/admin/all');
        setInternshipPrograms(response.data.data || []);
      } catch (error) {
        console.error('Error fetching internships:', error);
      }
    };

    // Data already fetched in main component

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold text-gray-900">Internship Management</h2>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 flex items-center space-x-2"
          >
            <FaPlus className="h-4 w-4" />
            <span>Add New Internship</span>
          </button>
        </div>

        {/* Create/Edit Form */}
        {showCreateForm && (
          <div className="bg-white p-8 rounded-lg shadow-lg border">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                {editingInternship ? 'Edit Internship' : 'Create New Internship'}
              </h3>
              <button
                onClick={resetInternshipForm}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTrash className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={editingInternship ? handleUpdateInternship : handleCreateInternship} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={internshipForm.title}
                    onChange={(e) => setInternshipForm(prev => ({...prev, title: e.target.value}))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="e.g., Food Safety Research Intern"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={internshipForm.category}
                    onChange={(e) => setInternshipForm(prev => ({...prev, category: e.target.value}))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <RichTextEditor
                  value={internshipForm.description}
                  onChange={(content) => setInternshipForm(prev => ({...prev, description: content}))}
                  placeholder="Describe the internship role and responsibilities..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Requirements</label>
                <RichTextEditor
                  value={internshipForm.requirements}
                  onChange={(content) => setInternshipForm(prev => ({...prev, requirements: content}))}
                  placeholder="List the qualifications and requirements..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                  <input
                    type="text"
                    value={internshipForm.duration}
                    onChange={(e) => setInternshipForm(prev => ({...prev, duration: e.target.value}))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="e.g., 3 months"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Stipend</label>
                  <input
                    type="text"
                    value={internshipForm.stipend}
                    onChange={(e) => setInternshipForm(prev => ({...prev, stipend: e.target.value}))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="e.g., ₹10,000/month"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Positions</label>
                  <input
                    type="number"
                    value={internshipForm.positions}
                    onChange={(e) => setInternshipForm(prev => ({...prev, positions: parseInt(e.target.value) || 1}))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    min="1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <select
                    value={internshipForm.location}
                    onChange={(e) => setInternshipForm(prev => ({...prev, location: e.target.value}))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    {locations.map(loc => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Application Deadline</label>
                  <input
                    type="date"
                    value={internshipForm.deadline}
                    onChange={(e) => setInternshipForm(prev => ({...prev, deadline: e.target.value}))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={internshipForm.status}
                    onChange={(e) => setInternshipForm(prev => ({...prev, status: e.target.value}))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="active">Active</option>
                    <option value="paused">Paused</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Required Skills</label>
                  <textarea
                    value={internshipForm.skills}
                    onChange={(e) => setInternshipForm(prev => ({...prev, skills: e.target.value}))}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Separate skills with commas"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Benefits</label>
                  <textarea
                    value={internshipForm.benefits}
                    onChange={(e) => setInternshipForm(prev => ({...prev, benefits: e.target.value}))}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Separate benefits with commas"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={resetInternshipForm}
                  className="px-6 py-3 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                >
                  {editingInternship ? 'Update Internship' : 'Create Internship'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Internships List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Positions</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {internshipPrograms.map((internship) => (
                  <tr key={internship._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{internship.title}</div>
                      <div className="text-sm text-gray-500">{internship.stipend || 'Unpaid'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                        {internship.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{internship.duration}</div>
                      <div className="text-sm text-gray-500">{internship.location}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{internship.positions} position(s)</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        internship.status === 'active' ? 'bg-green-100 text-green-800' :
                        internship.status === 'paused' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {internship.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => startEditInternship(internship)}
                          className="text-green-600 hover:text-green-900"
                          title="Edit"
                        >
                          <FaEdit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteInternship(internship._id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
                        >
                          <FaTrash className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // Service Management Component
  const ServiceManagement = () => {
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [editingService, setEditingService] = useState(null);
    const [serviceForm, setServiceForm] = useState({
      name: '',
      description: '',
      category: 'Chemical Analysis',
      price: '',
      duration: '',
      features: '',
      requirements: '',
      status: 'active',
      featured: false
    });

    const serviceCategories = [
      'Chemical Analysis',
      'Microbiological Testing', 
      'Nutritional Analysis',
      'Contaminant Detection',
      'Quality Control',
      'Pharmaceutical Testing',
      'Marine Products Testing',
      'Consultation Services'
    ];

    const handleCreateService = async (e) => {
      e.preventDefault();
      
      if (!serviceForm.name.trim() || !serviceForm.description.trim()) {
        toast.error('Service name and description are required');
        return;
      }

      try {
        const serviceData = {
          ...serviceForm,
          features: serviceForm.features.split(',').map(s => s.trim()).filter(s => s),
          requirements: serviceForm.requirements.split(',').map(s => s.trim()).filter(s => s)
        };

        await api.post('/api/admin/services/admin', serviceData);
        toast.success('Service created successfully!');
        resetServiceForm();
        fetchData();
      } catch (error) {
        console.error('Error creating service:', error);
        toast.error(error.response?.data?.message || 'Failed to create service');
      }
    };

    const handleUpdateService = async (e) => {
      e.preventDefault();
      
      try {
        const serviceData = {
          ...serviceForm,
          features: serviceForm.features.split(',').map(s => s.trim()).filter(s => s),
          requirements: serviceForm.requirements.split(',').map(s => s.trim()).filter(s => s)
        };

        await api.put(`/api/admin/services/admin/${editingService._id}`, serviceData);
        toast.success('Service updated successfully!');
        resetServiceForm();
        fetchData();
      } catch (error) {
        console.error('Error updating service:', error);
        toast.error(error.response?.data?.message || 'Failed to update service');
      }
    };

    const handleDeleteService = async (serviceId) => {
      if (!window.confirm('Are you sure you want to delete this service?')) return;

      try {
        await api.delete(`/api/admin/services/admin/${serviceId}`);
        toast.success('Service deleted successfully!');
        fetchData();
      } catch (error) {
        console.error('Error deleting service:', error);
        toast.error('Failed to delete service');
      }
    };

    const startEditService = (service) => {
      setEditingService(service);
      setServiceForm({
        name: service.name,
        description: service.description,
        category: service.category,
        price: service.price || '',
        duration: service.duration || '',
        features: service.features ? service.features.join(', ') : '',
        requirements: service.requirements ? service.requirements.join(', ') : '',
        status: service.status,
        featured: service.featured || false
      });
      setShowCreateForm(true);
    };

    const resetServiceForm = () => {
      setEditingService(null);
      setShowCreateForm(false);
      setServiceForm({
        name: '',
        description: '',
        category: 'Chemical Analysis',
        price: '',
        duration: '',
        features: '',
        requirements: '',
        status: 'active',
        featured: false
      });
    };

    const fetchServices = async () => {
      try {
        const response = await api.get('/api/admin/services/admin/all');
        setLabServices(response.data.data || []);
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    };

    // Data already fetched in main component

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold text-gray-900">Service Management</h2>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 flex items-center space-x-2"
          >
            <FaPlus className="h-4 w-4" />
            <span>Add New Service</span>
          </button>
        </div>

        {/* Create/Edit Form */}
        {showCreateForm && (
          <div className="bg-white p-8 rounded-lg shadow-lg border">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                {editingService ? 'Edit Service' : 'Create New Service'}
              </h3>
              <button
                onClick={resetServiceForm}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTrash className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={editingService ? handleUpdateService : handleCreateService} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Service Name</label>
                  <input
                    type="text"
                    value={serviceForm.name}
                    onChange={(e) => setServiceForm(prev => ({...prev, name: e.target.value}))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="e.g., Heavy Metal Analysis"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={serviceForm.category}
                    onChange={(e) => setServiceForm(prev => ({...prev, category: e.target.value}))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    {serviceCategories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <RichTextEditor
                  value={serviceForm.description}
                  onChange={(content) => setServiceForm(prev => ({...prev, description: content}))}
                  placeholder="Describe the service in detail..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                  <input
                    type="text"
                    value={serviceForm.price}
                    onChange={(e) => setServiceForm(prev => ({...prev, price: e.target.value}))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="e.g., ₹2,500/sample"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                  <input
                    type="text"
                    value={serviceForm.duration}
                    onChange={(e) => setServiceForm(prev => ({...prev, duration: e.target.value}))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="e.g., 3-5 business days"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={serviceForm.status}
                    onChange={(e) => setServiceForm(prev => ({...prev, status: e.target.value}))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="maintenance">Under Maintenance</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Features</label>
                  <textarea
                    value={serviceForm.features}
                    onChange={(e) => setServiceForm(prev => ({...prev, features: e.target.value}))}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Separate features with commas"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Requirements</label>
                  <textarea
                    value={serviceForm.requirements}
                    onChange={(e) => setServiceForm(prev => ({...prev, requirements: e.target.value}))}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Separate requirements with commas"
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="featured"
                  checked={serviceForm.featured}
                  onChange={(e) => setServiceForm(prev => ({...prev, featured: e.target.checked}))}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <label htmlFor="featured" className="ml-2 block text-sm text-gray-900">
                  Mark as featured service
                </label>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={resetServiceForm}
                  className="px-6 py-3 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700"
                >
                  {editingService ? 'Update Service' : 'Create Service'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Services List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {labServices.map((service) => (
                  <tr key={service._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{service.name}</div>
                      {service.featured && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          Featured
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                        {service.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{service.price || 'Contact for pricing'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{service.duration || 'Variable'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        service.status === 'active' ? 'bg-green-100 text-green-800' :
                        service.status === 'inactive' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {service.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => startEditService(service)}
                          className="text-purple-600 hover:text-purple-900"
                          title="Edit"
                        >
                          <FaEdit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteService(service._id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
                        >
                          <FaTrash className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // Blog Management Component
  const BlogManagement = () => {
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [editingBlog, setEditingBlog] = useState(null);
    const [blogForm, setBlogForm] = useState({
      title: '',
      excerpt: '',
      content: '',
      category: '',
      tags: '',
      status: 'draft',
      featuredImage: null
    });
    const [imagePreview, setImagePreview] = useState(null);

    const filteredBlogs = blogs.filter(blog => {
      const matchesSearch = blog.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           blog.category?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterStatus === 'all' || blog.status === filterStatus;
      return matchesSearch && matchesFilter;
    });

    const handleCreateBlog = async (e) => {
      e.preventDefault();
      const token = localStorage.getItem('adminToken');

      // Validate required fields
      if (!blogForm.title.trim()) {
        toast.error('Title is required');
        return;
      }
      if (!blogForm.excerpt.trim()) {
        toast.error('Excerpt is required');
        return;
      }
      if (!blogForm.content.trim()) {
        toast.error('Content is required');
        return;
      }
      if (!blogForm.category.trim()) {
        toast.error('Category is required');
        return;
      }

      try {
        console.log('Creating blog with form data:', blogForm);
        
        const formData = new FormData();
        formData.append('title', blogForm.title.trim());
        formData.append('excerpt', blogForm.excerpt.trim());
        formData.append('content', blogForm.content.trim());
        formData.append('category', blogForm.category.trim());
        formData.append('tags', blogForm.tags.trim());
        formData.append('status', blogForm.status || 'draft');
        
        if (blogForm.featuredImage) {
          formData.append('featuredImage', blogForm.featuredImage);
          console.log('Added featured image to form data:', blogForm.featuredImage.name);
        }

        console.log('Sending blog creation request...');
        
        const response = await api.post('/api/admin/blogs/admin/create', formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });

        console.log('Blog creation response:', response.data);

        toast.success('Blog post created successfully');
        setShowCreateForm(false);
        setBlogForm({
          title: '',
          excerpt: '',
          content: '',
          category: '',
          tags: '',
          status: 'draft',
          featuredImage: null
        });
        setImagePreview(null);
        fetchData();
      } catch (error) {
        console.error('Error creating blog:', error);
        const errorMessage = error.response?.data?.message || 'Failed to create blog post';
        toast.error(errorMessage);
      }
    };

    const handleEditBlog = async (e) => {
      e.preventDefault();
      const token = localStorage.getItem('adminToken');

      try {
        const formData = new FormData();
        formData.append('title', blogForm.title);
        formData.append('excerpt', blogForm.excerpt);
        formData.append('content', blogForm.content);
        formData.append('category', blogForm.category);
        formData.append('tags', blogForm.tags);
        formData.append('status', blogForm.status);
        
        if (blogForm.featuredImage) {
          formData.append('featuredImage', blogForm.featuredImage);
        }

        await api.put(`/api/admin/blogs/admin/${editingBlog._id}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });

        toast.success('Blog post updated successfully');
        setEditingBlog(null);
        setBlogForm({
          title: '',
          excerpt: '',
          content: '',
          category: '',
          tags: '',
          status: 'draft',
          featuredImage: null
        });
        setImagePreview(null);
        fetchData();
      } catch (error) {
        console.error('Error updating blog:', error);
        const errorMessage = error.response?.data?.message || 'Failed to update blog post';
        toast.error(errorMessage);
      }
    };

    const handleImageChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        setBlogForm(prev => ({ ...prev, featuredImage: file }));
        
        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
      }
    };

    const startEdit = (blog) => {
      setEditingBlog(blog);
      setBlogForm({
        title: blog.title,
        excerpt: blog.excerpt,
        content: blog.content,
        category: blog.category,
        tags: blog.tags ? blog.tags.join(', ') : '',
        status: blog.status,
        featuredImage: null
      });
      setImagePreview(blog.featuredImage ? `/uploads/blog-images/${blog.featuredImage}` : null);
      setShowCreateForm(true);
    };

    const cancelEdit = () => {
      setEditingBlog(null);
      setShowCreateForm(false);
      setBlogForm({
        title: '',
        excerpt: '',
        content: '',
        category: '',
        tags: '',
        status: 'draft',
        featuredImage: null
      });
      setImagePreview(null);
    };

    const openBlogPreview = (blog) => {
      setPreviewBlog(blog);
      setShowBlogPreview(true);
    };

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold text-gray-900">Blog Management</h2>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
          >
            <FaPlus className="h-4 w-4" />
            <span>Create New Post</span>
          </button>
        </div>

        {/* Create/Edit Form */}
        {showCreateForm && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">
                {editingBlog ? 'Edit Blog Post' : 'Create New Blog Post'}
              </h3>
              <button
                onClick={cancelEdit}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTrash className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={editingBlog ? handleEditBlog : handleCreateBlog} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={blogForm.title}
                    onChange={(e) => setBlogForm(prev => ({...prev, title: e.target.value}))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={blogForm.category}
                    onChange={(e) => setBlogForm(prev => ({...prev, category: e.target.value}))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="Food Testing">Food Testing</option>
                    <option value="Research">Research</option>
                    <option value="Technology">Technology</option>
                    <option value="Training">Training</option>
                    <option value="News">News</option>
                    <option value="General">General</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Excerpt</label>
                <textarea
                  value={blogForm.excerpt}
                  onChange={(e) => setBlogForm(prev => ({...prev, excerpt: e.target.value}))}
                  rows={2}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  maxLength={300}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                <RichTextEditor
                  value={blogForm.content}
                  onChange={(content) => setBlogForm(prev => ({...prev, content}))}
                  placeholder="Write your detailed blog content here. Use the toolbar above for formatting..."
                />
              </div>
              
              {/* Featured Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Featured Image</label>
                <div className="flex items-center space-x-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  {imagePreview && (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-20 h-20 object-cover rounded-lg border border-gray-300"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setBlogForm(prev => ({...prev, featuredImage: null}));
                          setImagePreview(null);
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-1">Upload an image for your blog post (JPG, PNG, WebP)</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tags (comma separated)</label>
                  <input
                    type="text"
                    value={blogForm.tags}
                    onChange={(e) => setBlogForm(prev => ({...prev, tags: e.target.value}))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="tag1, tag2, tag3"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={blogForm.status}
                    onChange={(e) => setBlogForm(prev => ({...prev, status: e.target.value}))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="px-6 py-3 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  {editingBlog ? 'Update Post' : 'Create Post'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Blog Posts Table */}
        <div className="bg-white rounded-xl shadow-lg">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h3 className="text-xl font-semibold text-gray-900">Blog Posts</h3>
              <div className="flex gap-3">
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search posts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Views</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBlogs.map((blog) => (
                  <tr key={blog._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{blog.title}</div>
                      <div className="text-sm text-gray-500 max-w-xs truncate">{blog.excerpt}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                        {blog.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{blog.author?.username || 'Unknown'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(blog.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        blog.status === 'published' ? 'bg-green-100 text-green-800' :
                        blog.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {blog.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{blog.views || 0}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openBlogPreview(blog)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Preview Blog"
                        >
                          <FaEye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => startEdit(blog)}
                          className="text-green-600 hover:text-green-900"
                          title="Edit"
                        >
                          <FaEdit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete('blogs', blog._id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
                        >
                          <FaTrash className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Blog Preview Modal */}
        {showBlogPreview && previewBlog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
                <h3 className="text-2xl font-bold text-gray-900">Blog Preview</h3>
                <button
                  onClick={() => {
                    setShowBlogPreview(false);
                    setPreviewBlog(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FaTrash className="h-6 w-6" />
                </button>
              </div>
              
              <div className="p-6">
                {/* Blog Header */}
                <div className="mb-8">
                  {previewBlog.featuredImage && (
                    <img 
                      src={`${API_BASE_URL}/uploads/blog-images/${previewBlog.featuredImage}`}
                      alt={previewBlog.title}
                      className="w-full h-64 object-cover rounded-lg mb-6"
                    />
                  )}
                  
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full font-medium">
                        {previewBlog.category}
                      </span>
                      <span>{new Date(previewBlog.createdAt).toLocaleDateString()}</span>
                      <span>By {previewBlog.author?.username || 'Admin'}</span>
                      <span>{previewBlog.views || 0} views</span>
                    </div>
                    
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                      {previewBlog.title}
                    </h1>
                    
                    <p className="text-lg text-gray-600 leading-relaxed">
                      {previewBlog.excerpt}
                    </p>
                    
                    {previewBlog.tags && previewBlog.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {previewBlog.tags.map((tag, index) => (
                          <span 
                            key={index}
                            className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Blog Content */}
                <div className="prose prose-lg max-w-none">
                  <BlogContent content={previewBlog.content} />
                </div>
                
                {/* Action Buttons */}
                <div className="mt-8 pt-6 border-t border-gray-200 flex justify-between">
                  <div className="text-sm text-gray-500">
                    Status: <span className={`font-medium ${
                      previewBlog.status === 'published' ? 'text-green-600' :
                      previewBlog.status === 'draft' ? 'text-yellow-600' :
                      'text-gray-600'
                    }`}>
                      {previewBlog.status}
                    </span>
                  </div>
                  
                  <div className="flex space-x-3">
                    <button
                      onClick={() => {
                        setShowBlogPreview(false);
                        startEdit(previewBlog);
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                    >
                      <FaEdit className="h-4 w-4" />
                      <span>Edit</span>
                    </button>
                    
                    <button
                      onClick={() => setShowBlogPreview(false)}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return (
          <div>
            <div className="bg-green-50 p-4 rounded-lg mb-6 border border-green-200">
              <h3 className="text-lg font-semibold text-green-800 mb-2">✅ All Systems Working!</h3>
              <p className="text-green-700">Admin panel fully operational. Create and manage: Pages, Internships, Services, Blogs, Team, Equipment & more.</p>
            </div>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Admin Dashboard</h2>
              {adminUser && (
                <div className="text-right">
                  <p className="text-gray-600">Welcome back,</p>
                  <p className="font-semibold text-gray-900">{adminUser.username}</p>
                </div>
              )}
            </div>
            <DashboardStats />
            {/* AI Features Demo */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 rounded-xl shadow-lg mb-8">
              <div className="flex items-center justify-between">
                <div className="text-white">
                  <h3 className="text-xl font-bold mb-2">🤖 AI-Powered Laboratory Management</h3>
                  <p className="text-purple-100 mb-4">Experience intelligent report analysis and automated insights</p>
                </div>
                <button
                  onClick={() => {
                    // Demo report data
                    setCurrentReportData({
                      heavyMetals: { lead: 0.05, mercury: 0.02, cadmium: 0.03, arsenic: 0.08 },
                      microbiology: { 
                        totalPlateCount: 1200, 
                        pathogensDetected: [],
                        yeastMold: 50 
                      },
                      pesticides: [
                        { name: 'Chlorpyrifos', detected: 0.02, mrl: 0.05 },
                        { name: 'Malathion', detected: 0.01, mrl: 0.02 }
                      ],
                      nutritional: { protein: 12.5, fat: 8.2, carbs: 65.1, sodium: 450 }
                    });
                    setShowReportAnalyzer(true);
                  }}
                  className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center space-x-2"
                >
                  <FaBrain className="w-5 h-5" />
                  <span>Try AI Report Analysis</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Contacts</h3>
                <div className="space-y-3">
                  {contacts.slice(0, 5).map((contact) => (
                    <div key={contact._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{contact.name}</p>
                        <p className="text-sm text-gray-600">{contact.email}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        contact.status === 'new' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {contact.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Blog Posts</h3>
                <div className="space-y-3">
                  {blogs.slice(0, 5).map((blog) => (
                    <div key={blog._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{blog.title}</p>
                        <p className="text-sm text-gray-600">{blog.category}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        blog.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {blog.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      case 'contacts':
        return (
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Contact Form Management</h2>
            <ContactsTable />
          </div>
        );
      case 'internships':
        return (
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Internship Applications</h2>
            <InternshipTable />
          </div>
        );
      case 'services':
        return (
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Service Requests Management</h2>
            <ServiceRequestsTable />
          </div>
        );
      case 'blogs':
        return <BlogManagement />;
      case 'pages':
        return <PagesManagement />;
      case 'internship-manage':
        return <InternshipManagement />;
      case 'service-manage':
        return <ServiceManagement />;
      case 'team':
        return <TeamManagement />;
      case 'equipment':
        return <EquipmentManagement />;
      case 'profile':
        return <ProfileManagement />;
      default:
        return (
          <div className="text-center py-12">
            <p className="text-gray-600">Feature coming soon...</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center border border-white border-opacity-30">
                  <span className="text-white font-bold text-sm">GT</span>
                </div>
                <div>
                  <span className="font-bold text-white text-lg">GTFTL Admin</span>
                  <p className="text-blue-100 text-xs">Management Panel</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              {adminUser && (
                <div className="text-right">
                  <p className="text-sm text-white font-medium">{adminUser.username}</p>
                  <p className="text-xs text-blue-200">{adminUser.email}</p>
                  <p className="text-xs text-yellow-300 font-medium">{adminUser.role}</p>
                </div>
              )}
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-white hover:text-red-300 transition-colors duration-200 bg-white bg-opacity-10 px-4 py-2 rounded-lg hover:bg-opacity-20"
              >
                <FaSignOutAlt className="h-4 w-4" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full lg:w-64">
            <nav className="bg-white rounded-xl shadow-lg p-4 border border-gray-200">
              <div className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md transform scale-105'
                        : 'text-gray-600 hover:bg-blue-50 hover:text-blue-700'
                    }`}
                  >
                    <tab.icon className="h-5 w-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                ))}
              </div>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              {renderContent()}
            </motion.div>
          </div>
        </div>
      </div>

      {/* AI Report Analyzer */}
      <ReportAnalyzer
        reportData={currentReportData}
        isVisible={showReportAnalyzer}
        onClose={() => setShowReportAnalyzer(false)}
      />
    </div>
  );
};

export default AdminDashboard;
