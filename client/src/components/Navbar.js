import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaBars, 
  FaTimes, 
  FaFlask, 
  FaHome,
  FaInfoCircle,
  FaServicestack,
  FaCogs,
  FaUsers,
  FaGraduationCap,
  FaEnvelope,
  FaBlog
} from 'react-icons/fa';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { path: '/', label: 'Home', icon: FaHome },
    { path: '/about', label: 'About', icon: FaInfoCircle },
    { path: '/services', label: 'Services', icon: FaServicestack },
    { path: '/equipment', label: 'Equipment', icon: FaCogs },
    { path: '/team', label: 'Team', icon: FaUsers },
    { path: '/blog', label: 'Blog', icon: FaBlog },
    { path: '/contact', label: 'Contact', icon: FaEnvelope },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-white shadow-lg' 
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <FaFlask className={`h-8 w-8 ${scrolled ? 'text-green-600' : 'text-white'}`} />
            <div className="flex flex-col">
              <span className={`font-bold text-lg leading-none ${
                scrolled ? 'text-gray-900' : 'text-white'
              }`}>
                GTFTL
              </span>
              <span className={`text-xs leading-none ${
                scrolled ? 'text-green-600' : 'text-green-200'
              }`}>
                Food Testing Lab
              </span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-baseline space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center space-x-1 ${
                      isActive(item.path)
                        ? scrolled
                          ? 'bg-green-100 text-green-700'
                          : 'bg-white bg-opacity-20 text-white'
                        : scrolled
                        ? 'text-gray-600 hover:text-green-600 hover:bg-green-50'
                        : 'text-gray-200 hover:text-white hover:bg-white hover:bg-opacity-10'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
            
            {/* Apply Internship Button */}
            <Link
              to="/internship"
              className={`ml-4 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 flex items-center space-x-2 ${
                scrolled
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-white bg-opacity-20 text-white hover:bg-white hover:bg-opacity-30'
              }`}
            >
              <FaGraduationCap className="h-4 w-4" />
              <span>Apply Internship</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`inline-flex items-center justify-center p-2 rounded-md transition-colors duration-200 ${
                scrolled
                  ? 'text-gray-600 hover:text-green-600 hover:bg-green-50'
                  : 'text-white hover:text-green-200 hover:bg-white hover:bg-opacity-10'
              }`}
            >
              {isOpen ? (
                <FaTimes className="h-6 w-6" />
              ) : (
                <FaBars className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-white shadow-lg"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 flex items-center space-x-2 ${
                      isActive(item.path)
                        ? 'bg-green-100 text-green-700'
                        : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}

              {/* Apply Internship Button - Mobile */}
              <Link
                to="/internship"
                onClick={() => setIsOpen(false)}
                className="mt-2 block px-3 py-2 rounded-lg text-base font-semibold bg-green-600 text-white hover:bg-green-700 transition-colors duration-200 flex items-center space-x-2"
              >
                <FaGraduationCap className="h-5 w-5" />
                <span>Apply Internship</span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
