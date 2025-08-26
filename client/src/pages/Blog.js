import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import axios from 'axios';
import { 
  FaCalendar, 
  FaUser, 
  FaEye, 
  FaHeart,
  FaTag,
  FaArrowRight,
  FaSearch,
  FaSpinner
} from 'react-icons/fa';

const Blog = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [heroRef, heroInView] = useInView({ threshold: 0.3, triggerOnce: true });
  const [blogsRef, blogsInView] = useInView({ threshold: 0.3, triggerOnce: true });
  
  const [blogs, setBlogs] = useState([]);
  const [featuredBlogs, setFeaturedBlogs] = useState([]);
  const [currentBlog, setCurrentBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({});

  const categories = [
    { id: 'all', name: 'All Posts' },
    { id: 'Food Testing', name: 'Food Testing' },
    { id: 'Research', name: 'Research' },
    { id: 'Technology', name: 'Technology' },
    { id: 'Training', name: 'Training' },
    { id: 'News', name: 'News' },
    { id: 'General', name: 'General' }
  ];

  useEffect(() => {
    if (slug) {
      fetchSingleBlog(slug);
    } else {
      fetchBlogs();
    }
    fetchFeaturedBlogs();
  }, [slug, currentPage, selectedCategory, searchTerm]);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: 9,
        ...(selectedCategory !== 'all' && { category: selectedCategory }),
        ...(searchTerm && { search: searchTerm })
      };

      const response = await axios.get('/api/blogs', { params });
      
      if (response.data.success) {
        setBlogs(response.data.data.blogs);
        setPagination(response.data.data.pagination);
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSingleBlog = async (blogSlug) => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/blogs/${blogSlug}`);
      
      if (response.data.success) {
        setCurrentBlog(response.data.data.blog);
      }
    } catch (error) {
      console.error('Error fetching blog:', error);
      if (error.response?.status === 404) {
        navigate('/blog');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchFeaturedBlogs = async () => {
    try {
      const response = await axios.get('/api/blogs/featured/posts');
      
      if (response.data.success) {
        setFeaturedBlogs(response.data.data.blogs);
      }
    } catch (error) {
      console.error('Error fetching featured blogs:', error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchBlogs();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
  };

  if (slug && currentBlog) {
    // Single blog post view
    return (
      <div className="min-h-screen pt-16">
        {/* Blog Header */}
        <section className="py-20 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center space-y-6"
            >
              <div className="flex justify-center items-center space-x-4 mb-4">
                <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm font-medium">
                  {currentBlog.category}
                </span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                {currentBlog.title}
              </h1>
              
              <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                {currentBlog.excerpt}
              </p>
              
              <div className="flex justify-center items-center space-x-6 text-blue-200">
                <div className="flex items-center space-x-2">
                  <FaUser className="h-4 w-4" />
                  <span>{currentBlog.author?.username}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FaCalendar className="h-4 w-4" />
                  <span>{formatDate(currentBlog.publishDate || currentBlog.createdAt)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FaEye className="h-4 w-4" />
                  <span>{currentBlog.views} views</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Blog Content */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Featured Image */}
            {currentBlog.featuredImage && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="mb-12"
              >
                <img
                  src={`/${currentBlog.featuredImage}`}
                  alt={currentBlog.title}
                  className="w-full h-96 object-cover rounded-2xl shadow-lg"
                />
              </motion.div>
            )}

            {/* Blog Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="prose prose-lg prose-blue max-w-none"
            >
              <div dangerouslySetInnerHTML={{ __html: currentBlog.content }} />
            </motion.div>

            {/* Tags */}
            {currentBlog.tags && currentBlog.tags.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="mt-12 pt-8 border-t border-gray-200"
              >
                <div className="flex flex-wrap gap-2">
                  {currentBlog.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                    >
                      <FaTag className="h-3 w-3 mr-1" />
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Back to Blog */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-12 text-center"
            >
              <Link
                to="/blog"
                className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium"
              >
                <span>← Back to All Posts</span>
              </Link>
            </motion.div>
          </div>
        </section>
      </div>
    );
  }

  // Blog listing view
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
              Our <span className="text-blue-200">Blog</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-4xl mx-auto leading-relaxed">
              Stay updated with the latest insights, research, and developments in food testing and laboratory technology
            </p>
          </motion.div>
        </div>
      </section>

      {/* Featured Blogs */}
      {featuredBlogs.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Articles</h2>
              <p className="text-xl text-gray-600">Our most popular and informative posts</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredBlogs.map((blog, index) => (
                <motion.article
                  key={blog._id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                >
                  {blog.featuredImage && (
                    <div className="h-48 overflow-hidden">
                      <img
                        src={`/${blog.featuredImage}`}
                        alt={blog.title}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                      />
                    </div>
                  )}
                  
                  <div className="p-6">
                    <div className="flex items-center space-x-4 mb-4 text-sm text-gray-500">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                        {blog.category}
                      </span>
                      <div className="flex items-center space-x-1">
                        <FaCalendar className="h-3 w-3" />
                        <span>{formatDate(blog.publishDate || blog.createdAt)}</span>
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                      {blog.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {blog.excerpt}
                    </p>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <FaEye className="h-3 w-3" />
                          <span>{blog.views}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <FaHeart className="h-3 w-3" />
                          <span>{blog.likes}</span>
                        </div>
                      </div>
                      
                      <Link
                        to={`/blog/${blog.slug}`}
                        className="text-blue-600 hover:text-blue-700 font-medium flex items-center space-x-1"
                      >
                        <span>Read More</span>
                        <FaArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Search and Filter */}
      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Search */}
            <form onSubmit={handleSearch} className="flex-1 max-w-md">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search articles..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </form>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => {
                    setSelectedCategory(category.id);
                    setCurrentPage(1);
                  }}
                  className={`px-4 py-2 rounded-full font-medium transition-colors duration-200 ${
                    selectedCategory === category.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Blog Posts */}
      <section ref={blogsRef} className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <FaSpinner className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" />
                <p className="text-gray-600">Loading articles...</p>
              </div>
            </div>
          ) : blogs.length > 0 ? (
            <>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={blogsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {blogs.map((blog, index) => (
                  <motion.article
                    key={blog._id}
                    initial={{ opacity: 0, y: 50 }}
                    animate={blogsInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300"
                  >
                    {blog.featuredImage && (
                      <div className="h-48 overflow-hidden">
                        <img
                          src={`/${blog.featuredImage}`}
                          alt={blog.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    
                    <div className="p-6">
                      <div className="flex items-center space-x-4 mb-4 text-sm text-gray-500">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                          {blog.category}
                        </span>
                        <div className="flex items-center space-x-1">
                          <FaCalendar className="h-3 w-3" />
                          <span>{formatDate(blog.publishDate || blog.createdAt)}</span>
                        </div>
                      </div>
                      
                      <h3 className="text-xl font-bold text-gray-900 mb-3">
                        {truncateText(blog.title, 60)}
                      </h3>
                      
                      <p className="text-gray-600 mb-4">
                        {truncateText(blog.excerpt, 120)}
                      </p>
                      
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <div className="flex items-center space-x-1">
                            <FaEye className="h-3 w-3" />
                            <span>{blog.views}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <FaUser className="h-3 w-3" />
                            <span>{blog.author?.username}</span>
                          </div>
                        </div>
                        
                        <Link
                          to={`/blog/${blog.slug}`}
                          className="text-blue-600 hover:text-blue-700 font-medium flex items-center space-x-1"
                        >
                          <span>Read More</span>
                          <FaArrowRight className="h-3 w-3" />
                        </Link>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </motion.div>

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="mt-12 flex justify-center items-center space-x-4">
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={!pagination.hasPrev}
                    className={`px-4 py-2 rounded-lg font-medium ${
                      pagination.hasPrev
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    Previous
                  </button>
                  
                  <span className="text-gray-600">
                    Page {currentPage} of {pagination.pages}
                  </span>
                  
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={!pagination.hasNext}
                    className={`px-4 py-2 rounded-lg font-medium ${
                      pagination.hasNext
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No articles found matching your criteria.</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                  setCurrentPage(1);
                }}
                className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Blog;
