import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { toast } from 'react-toastify';
import axios from 'axios';
import { 
  FaMapMarkerAlt, 
  FaPhone, 
  FaEnvelope, 
  FaClock,
  FaFlask,
  FaPaperPlane,
  FaSpinner,
  FaWhatsapp,
  FaLinkedin,
  FaTwitter
} from 'react-icons/fa';

const Contact = () => {
  const [heroRef, heroInView] = useInView({ threshold: 0.3, triggerOnce: true });
  const [formRef, formInView] = useInView({ threshold: 0.3, triggerOnce: true });
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const contactInfo = [
    {
      icon: FaMapMarkerAlt,
      title: 'Our Location',
      details: [
        'Plot No.1, IDCO Industrial Estate',
        'Main Road, Paralakhemundi',
        'Gajapati, Odisha – 751200',
        'India'
      ],
      color: 'text-blue-600'
    },
    {
      icon: FaPhone,
      title: 'Phone Numbers',
      details: [
        '+91 XXXX-XXXXXX (Office)',
        '+91 XXXX-XXXXXX (Lab)',
        '+91 XXXX-XXXXXX (Emergency)',
        'Available: Mon-Sat 9AM-6PM'
      ],
      color: 'text-green-600'
    },
    {
      icon: FaEnvelope,
      title: 'Email Addresses',
      details: [
        'info@gtftl.com (General)',
        'lab@gtftl.com (Testing Services)',
        'internship@gtftl.com (Training)',
        'support@gtftl.com (Technical)'
      ],
      color: 'text-purple-600'
    },
    {
      icon: FaClock,
      title: 'Working Hours',
      details: [
        'Monday - Friday: 9:00 AM - 6:00 PM',
        'Saturday: 9:00 AM - 1:00 PM',
        'Sunday: Closed',
        'Emergency Services Available'
      ],
      color: 'text-orange-600'
    }
  ];

  const serviceTypes = [
    'Food Testing Services',
    'Pharmaceutical Analysis',
    'Marine Product Testing',
    'Microbiological Testing',
    'Forensic Analysis',
    'Nutritional Testing',
    'Internship Inquiry',
    'General Inquiry',
    'Other'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post('/api/contact', formData);
      toast.success('Message sent successfully! We will get back to you soon.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
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
              Contact <span className="text-blue-200">Us</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-4xl mx-auto leading-relaxed">
              Get in touch with our team for testing services, internship inquiries, or any questions
            </p>
            <div className="flex justify-center items-center space-x-8">
              <div className="flex items-center space-x-2">
                <FaFlask className="h-6 w-6 text-green-400" />
                <span className="text-sm font-medium">Expert Support</span>
              </div>
              <div className="flex items-center space-x-2">
                <FaClock className="h-6 w-6 text-yellow-400" />
                <span className="text-sm font-medium">Quick Response</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Information */}
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
              Get In <span className="text-gradient">Touch</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Multiple ways to reach us for all your analytical testing and training needs
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactInfo.map((info, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center p-6 bg-gray-50 rounded-2xl hover:shadow-lg transition-shadow duration-300"
              >
                <div className={`w-16 h-16 mx-auto mb-6 ${info.color}`}>
                  <info.icon className="h-16 w-16" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{info.title}</h3>
                <div className="space-y-2">
                  {info.details.map((detail, detailIndex) => (
                    <p key={detailIndex} className="text-gray-600 text-sm leading-relaxed">
                      {detail}
                    </p>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Map */}
      <section ref={formRef} className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={formInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="bg-white rounded-3xl p-8 md:p-12 shadow-lg"
            >
              <div className="mb-8">
                <h3 className="text-3xl font-bold text-gray-900 mb-4">Send us a Message</h3>
                <p className="text-gray-600 leading-relaxed">
                  Fill out the form below and we'll get back to you as soon as possible.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="+91 XXXXX XXXXX"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Service Type
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    >
                      <option value="">Select service type</option>
                      {serviceTypes.map((service, index) => (
                        <option key={index} value={service}>{service}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Please describe your requirements, questions, or how we can help you..."
                  />
                </div>

                <div className="text-center pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`bg-blue-600 text-white px-8 py-4 rounded-full font-semibold hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 ${
                      loading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {loading ? (
                      <div className="flex items-center space-x-2">
                        <FaSpinner className="h-5 w-5 animate-spin" />
                        <span>Sending...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <FaPaperPlane className="h-5 w-5" />
                        <span>Send Message</span>
                      </div>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>

            {/* Map & Additional Info */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={formInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-8"
            >
              {/* Map */}
              <div className="bg-white rounded-3xl overflow-hidden shadow-lg">
                <div className="h-64 bg-gray-200 flex items-center justify-center">
                  <div className="text-center">
                    <FaMapMarkerAlt className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 font-medium">Interactive Map</p>
                    <p className="text-sm text-gray-500">
                      Plot No.1, IDCO Industrial Estate<br />
                      Paralakhemundi, Gajapati, Odisha
                    </p>
                  </div>
                </div>
                <div className="p-6">
                  <h4 className="font-bold text-gray-900 mb-2">Visit Our Laboratory</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Our state-of-the-art facility is located in the heart of Gajapati district, 
                    easily accessible by road and public transport.
                  </p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-3xl p-8 shadow-lg">
                <h4 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h4>
                <div className="space-y-4">
                  <a
                    href="tel:+91XXXXXXXXXX"
                    className="flex items-center space-x-4 p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors duration-200"
                  >
                    <div className="p-3 bg-green-500 rounded-full">
                      <FaPhone className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Call Directly</div>
                      <div className="text-sm text-gray-600">Get immediate assistance</div>
                    </div>
                  </a>

                  <a
                    href="https://wa.me/91XXXXXXXXXX"
                    className="flex items-center space-x-4 p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors duration-200"
                  >
                    <div className="p-3 bg-green-500 rounded-full">
                      <FaWhatsapp className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">WhatsApp</div>
                      <div className="text-sm text-gray-600">Chat with our team</div>
                    </div>
                  </a>

                  <a
                    href="mailto:info@gtftl.com"
                    className="flex items-center space-x-4 p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors duration-200"
                  >
                    <div className="p-3 bg-blue-500 rounded-full">
                      <FaEnvelope className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Email Us</div>
                      <div className="text-sm text-gray-600">Send detailed inquiry</div>
                    </div>
                  </a>
                </div>
              </div>

              {/* Social Media */}
              <div className="bg-white rounded-3xl p-8 shadow-lg">
                <h4 className="text-2xl font-bold text-gray-900 mb-6">Follow Us</h4>
                <div className="flex space-x-4">
                  <a
                    href="#"
                    className="p-4 bg-blue-100 hover:bg-blue-200 rounded-full transition-colors duration-200"
                  >
                    <FaLinkedin className="h-6 w-6 text-blue-600" />
                  </a>
                  <a
                    href="#"
                    className="p-4 bg-blue-100 hover:bg-blue-200 rounded-full transition-colors duration-200"
                  >
                    <FaTwitter className="h-6 w-6 text-blue-600" />
                  </a>
                  <a
                    href="#"
                    className="p-4 bg-green-100 hover:bg-green-200 rounded-full transition-colors duration-200"
                  >
                    <FaWhatsapp className="h-6 w-6 text-green-600" />
                  </a>
                </div>
                <p className="text-gray-600 text-sm mt-4">
                  Stay updated with our latest news, services, and research activities.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Service Request CTA */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-4xl font-bold">
              Need Testing Services?
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Submit a formal service request for testing services with detailed sample information
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/services"
                className="bg-white text-blue-600 px-8 py-4 rounded-full font-semibold hover:bg-blue-50 transition-all duration-300 transform hover:scale-105"
              >
                View Services
              </a>
              <a
                href="#"
                className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300 transform hover:scale-105"
              >
                Request Quote
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Frequently Asked <span className="text-gradient">Questions</span>
            </h2>
          </motion.div>

          <div className="space-y-6">
            {[
              {
                question: "What are your testing turnaround times?",
                answer: "Turnaround times vary by test type: routine tests (3-5 days), complex analysis (7-14 days), and specialized testing (up to 21 days). We also offer express services for urgent requirements."
              },
              {
                question: "How do I submit samples for testing?",
                answer: "You can submit samples by visiting our laboratory, through courier services, or by scheduling a pickup. Please contact us for proper sample collection and submission procedures."
              },
              {
                question: "Do you provide training certificates?",
                answer: "Yes, we provide official certificates for all our internship and training programs. These certificates are recognized by academic institutions and industry employers."
              },
              {
                question: "What payment methods do you accept?",
                answer: "We accept various payment methods including bank transfers, cheques, demand drafts, and online payments. Payment terms and conditions will be provided with your service quotation."
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-8 shadow-lg"
              >
                <h4 className="text-xl font-bold text-gray-900 mb-3">{faq.question}</h4>
                <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
