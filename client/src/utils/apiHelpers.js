// API Helper functions for better error handling and timeout management

import api from '../api/config';
import { toast } from 'react-toastify';

// Wrapper function with timeout and retry logic
export const apiWithTimeout = async (apiCall, timeout = 5000, retries = 2) => {
  let attempt = 0;
  
  while (attempt < retries) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);
      
      const response = await Promise.race([
        apiCall({ signal: controller.signal }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Request timeout')), timeout)
        )
      ]);
      
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      attempt++;
      console.warn(`API call attempt ${attempt} failed:`, error.message);
      
      if (attempt >= retries) {
        if (error.message === 'Request timeout') {
          toast.error('Request timed out. Please check your connection.');
        } else if (error.response?.status >= 500) {
          toast.error('Server error. Please try again later.');
        } else if (error.code === 'NETWORK_ERROR') {
          toast.error('Network error. Please check your connection.');
        }
        throw error;
      }
      
      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
    }
  }
};

// Safe API calls for admin operations
export const adminAPI = {
  // Get all data with fallback
  fetchAllData: async () => {
    try {
      const endpoints = [
        '/api/admin/contacts/admin',
        '/api/admin/internships/admin', 
        '/api/admin/service-requests/admin',
        '/api/admin/blogs/admin/all',
        '/api/admin/team/admin/all',
        '/api/admin/equipment/admin/all',
        '/api/admin/pages/admin/all',
        '/api/admin/internships/admin/all',
        '/api/admin/services/admin/all'
      ];

      const results = await Promise.allSettled(
        endpoints.map(endpoint => 
          apiWithTimeout(() => api.get(endpoint), 3000, 1)
        )
      );

      const data = {};
      const endpointNames = [
        'contacts', 'internships', 'serviceRequests', 'blogs', 
        'team', 'equipment', 'pages', 'internshipPrograms', 'labServices'
      ];

      results.forEach((result, index) => {
        const key = endpointNames[index];
        if (result.status === 'fulfilled') {
          data[key] = result.value.data.data || result.value.data || [];
        } else {
          console.warn(`Failed to fetch ${key}:`, result.reason.message);
          data[key] = [];
        }
      });

      return data;
    } catch (error) {
      console.error('Error fetching admin data:', error);
      return {
        contacts: [],
        internships: [],
        serviceRequests: [],
        blogs: [],
        team: [],
        equipment: [],
        pages: [],
        internshipPrograms: [],
        labServices: []
      };
    }
  },

  // Create operations with timeout
  createBlog: async (blogData) => {
    return apiWithTimeout(() => api.post('/api/admin/blogs/admin', blogData));
  },

  createPage: async (pageData) => {
    return apiWithTimeout(() => api.post('/api/admin/pages/admin', pageData));
  },

  createInternship: async (internshipData) => {
    return apiWithTimeout(() => api.post('/api/admin/internships/admin', internshipData));
  },

  createService: async (serviceData) => {
    return apiWithTimeout(() => api.post('/api/admin/services/admin', serviceData));
  },

  createTeamMember: async (teamData) => {
    return apiWithTimeout(() => api.post('/api/admin/team/admin', teamData));
  },

  createEquipment: async (equipmentData) => {
    return apiWithTimeout(() => api.post('/api/admin/equipment/admin', equipmentData));
  }
};

// Connection status checker
export const checkBackendConnection = async () => {
  try {
    const response = await apiWithTimeout(() => api.get('/api/health'), 2000, 1);
    return response.status === 200;
  } catch (error) {
    console.warn('Backend connection check failed:', error.message);
    return false;
  }
};

// Database connection status
export const checkDatabaseConnection = async () => {
  try {
    const response = await apiWithTimeout(() => api.get('/api/admin/contacts/admin'), 2000, 1);
    return response.status === 200;
  } catch (error) {
    if (error.response?.status === 503) {
      toast.warn('Database connection issues detected. Some features may be limited.');
    }
    return false;
  }
};
