import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaSpinner, FaExclamationTriangle } from 'react-icons/fa';
import api from '../api/config';

const StaticPage = () => {
  const { slug } = useParams();
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get the slug from the current path if useParams doesn't work
        const currentSlug = slug || window.location.pathname.substring(1);
        console.log('Component mounted, slug from useParams:', slug);
        console.log('Current path:', window.location.pathname);
        console.log('Extracted slug:', currentSlug);
        
        if (!currentSlug) {
          setError('Invalid page URL');
          return;
        }
        
        console.log('Making API call to:', `/api/pages/${currentSlug}`);
        const response = await api.get(`/api/pages/${currentSlug}`);
        console.log('Full API response:', response);
        
        if (response.data && response.data.success) {
          console.log('Page data received:', response.data.data);
          setPage(response.data.data);
        } else {
          console.log('API returned unsuccessful response:', response.data);
          setError('Page not found');
        }
      } catch (error) {
        console.error('Detailed error information:', {
          message: error.message,
          response: error.response,
          status: error.response?.status,
          data: error.response?.data
        });
        setError(error.response?.data?.message || error.message || 'Failed to load page');
      } finally {
        setLoading(false);
      }
    };

    console.log('useEffect triggered with slug:', slug);
    fetchPage();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading page...</p>
          <p className="text-sm text-gray-500 mt-2">Debug: slug = {slug}</p>
          <p className="text-sm text-gray-500">Path = {window.location.pathname}</p>
        </div>
      </div>
    );
  }

  if (error || (!loading && !page)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <FaExclamationTriangle className="w-16 h-16 text-red-500 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Page Not Found</h1>
          <p className="text-gray-600 mb-6">
            {error || 'The page you are looking for does not exist.'}
          </p>
          <div className="bg-gray-100 p-4 rounded mb-4 text-sm">
            <p><strong>Debug Info:</strong></p>
            <p>Slug: {slug}</p>
            <p>Path: {window.location.pathname}</p>
            <p>Error: {error}</p>
            <p>Page loaded: {page ? 'Yes' : 'No'}</p>
            <p>Loading: {loading ? 'Yes' : 'No'}</p>
          </div>
          <a
            href="/"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {page.title}
            </h1>
            {page.metaDescription && (
              <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                {page.metaDescription}
              </p>
            )}
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg p-8 md:p-12"
        >
          <div 
            className="prose prose-lg max-w-none static-page-content"
            dangerouslySetInnerHTML={{ __html: page.content }}
            style={{
              lineHeight: '1.8',
              color: '#374151'
            }}
          />
          
          <style jsx>{`
            .static-page-content h1 {
              color: #1f2937;
              font-size: 2.5rem;
              font-weight: 700;
              margin-bottom: 1.5rem;
              padding-bottom: 0.5rem;
              border-bottom: 3px solid #10b981;
            }
            
            .static-page-content h2 {
              color: #374151;
              font-size: 1.875rem;
              font-weight: 600;
              margin: 2rem 0 1rem 0;
              padding-left: 1rem;
              border-left: 4px solid #3b82f6;
            }
            
            .static-page-content h3 {
              color: #4b5563;
              font-size: 1.5rem;
              font-weight: 600;
              margin: 1.5rem 0 0.75rem 0;
            }
            
            .static-page-content ul {
              margin: 1rem 0;
              padding-left: 1.5rem;
            }
            
            .static-page-content li {
              margin: 0.5rem 0;
              color: #6b7280;
            }
            
            .static-page-content p {
              margin: 1rem 0;
              color: #4b5563;
              line-height: 1.75;
            }
            
            .static-page-content a {
              color: #3b82f6;
              text-decoration: underline;
            }
            
            .static-page-content a:hover {
              color: #1d4ed8;
            }
            
            .static-page-content strong {
              color: #1f2937;
              font-weight: 600;
            }
          `}</style>
          
          {/* Page Footer */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
              <div>
                <p>
                  <strong>Page Type:</strong> {page.pageType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </p>
              </div>
              <div className="mt-2 md:mt-0">
                <p>
                  <strong>Last Updated:</strong> {new Date(page.updatedAt).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Contact CTA */}
        {page.pageType !== 'sitemap' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8 bg-gradient-to-r from-green-500 to-blue-600 rounded-xl p-8 text-white text-center"
          >
            <h3 className="text-2xl font-bold mb-4">Need More Information?</h3>
            <p className="text-green-100 mb-6 max-w-2xl mx-auto">
              If you have questions about our policies or services, our team is here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Contact Us
              </a>
              <a
                href="/services"
                className="bg-green-600 bg-opacity-20 border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors"
              >
                Our Services
              </a>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default StaticPage;
