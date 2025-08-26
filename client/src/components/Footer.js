import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaFlask, 
  FaMapMarkerAlt, 
  FaPhone, 
  FaEnvelope, 
  FaClock,
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaInstagram,
  FaCertificate
} from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <FaFlask className="h-8 w-8 text-blue-500" />
              <div>
                <h3 className="font-bold text-lg">GTFTL</h3>
                <p className="text-sm text-gray-400">Food Testing Lab</p>
              </div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              NABL-accredited analytical testing laboratory specializing in food, 
              pharmaceutical, marine products, and forensic sample analysis since 2022.
            </p>
            <div className="flex items-center space-x-2 text-sm text-gray-300">
              <FaCertificate className="h-4 w-4 text-green-500" />
              <span>NABL Accredited</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { path: '/', label: 'Home' },
                { path: '/about', label: 'About Us' },
                { path: '/services', label: 'Our Services' },
                { path: '/equipment', label: 'Equipment' },
                { path: '/team', label: 'Our Team' },
                { path: '/internship', label: 'Internships' },
                { path: '/contact', label: 'Contact' },
              ].map((link) => (
                <li key={link.path}>
                  <Link 
                    to={link.path} 
                    className="text-gray-300 hover:text-blue-400 transition-colors duration-200 text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Our Services</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>Food Testing</li>
              <li>Pharmaceutical Testing</li>
              <li>Marine Products Testing</li>
              <li>Forensic Material Testing</li>
              <li>Nutritional Testing</li>
              <li>Microbiological Testing</li>
              <li>Animal Cell Culture</li>
              <li>In Silico Analysis</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3 text-sm">
                <FaMapMarkerAlt className="h-4 w-4 text-blue-500 mt-1 flex-shrink-0" />
                <div className="text-gray-300">
                  <p>Plot No.1, IDCO Industrial Estate,</p>
                  <p>Main Road, Paralakhemundi,</p>
                  <p>Gajapati, Odisha – 751200</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 text-sm">
                <FaPhone className="h-4 w-4 text-green-500" />
                <span className="text-gray-300">+91 XXXX-XXXXXX</span>
              </div>
              
              <div className="flex items-center space-x-3 text-sm">
                <FaEnvelope className="h-4 w-4 text-red-500" />
                <span className="text-gray-300">info@gtftl.com</span>
              </div>
              
              <div className="flex items-start space-x-3 text-sm">
                <FaClock className="h-4 w-4 text-yellow-500 mt-1" />
                <div className="text-gray-300">
                  <p>Mon - Fri: 9:00 AM - 6:00 PM</p>
                  <p>Sat: 9:00 AM - 1:00 PM</p>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="mt-6">
              <h5 className="font-medium mb-3">Follow Us</h5>
              <div className="flex space-x-3">
                <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors duration-200">
                  <FaFacebook className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-200">
                  <FaTwitter className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors duration-200">
                  <FaLinkedin className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-pink-500 transition-colors duration-200">
                  <FaInstagram className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
            <div className="mb-2 md:mb-0">
              <p>&copy; 2024 Gram Tarang Food Testing Lab. All rights reserved.</p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="hover:text-white transition-colors duration-200">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors duration-200">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors duration-200">Sitemap</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
