import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaRobot, 
  FaTimes, 
  FaPaperPlane, 
  FaMicrophone, 
  FaStop,
  FaVolumeUp,
  FaUser,
  FaFlask,
  FaQuestionCircle,
  FaPhoneAlt,
  FaEnvelope
} from 'react-icons/fa';
import { toast } from 'react-toastify';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm GTFL AI Assistant. I can help you with:\n• Laboratory testing information\n• Service pricing and procedures\n• Sample submission guidelines\n• Report status updates\n• General inquiries\n\nHow can I assist you today?",
      sender: 'bot',
      timestamp: new Date(),
      type: 'welcome'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef(null);

  // Quick action buttons
  const quickActions = [
    { text: "Testing Services", icon: FaFlask, action: "services" },
    { text: "Sample Submission", icon: FaQuestionCircle, action: "submission" },
    { text: "Pricing Information", icon: FaEnvelope, action: "pricing" },
    { text: "Contact Support", icon: FaPhoneAlt, action: "contact" }
  ];

  // AI Knowledge Base
  const knowledgeBase = {
    services: {
      keywords: ['test', 'testing', 'service', 'analysis', 'laboratory', 'lab'],
      response: `🔬 **Our Laboratory Testing Services:**

**Chemical Analysis:**
• Heavy Metal Detection (₹2,500/sample)
• Pesticide Residue Analysis (₹4,500/sample)
• Nutritional Analysis (₹3,200/sample)

**Microbiological Testing:**
• Pathogen Detection (₹1,800/parameter)
• Shelf-life Studies
• HACCP Support

**Water Quality Testing:**
• Complete water analysis (₹2,800/sample)
• WHO & IS 10500 compliance

**Specialized Tests:**
• Aflatoxin Testing (₹2,200/sample)
• Food Allergen Detection (₹1,500/allergen)
• Pharmaceutical Testing (₹3,500/parameter)

Would you like detailed information about any specific test?`
    },
    submission: {
      keywords: ['sample', 'submit', 'submission', 'how to', 'procedure'],
      response: `📋 **Sample Submission Guidelines:**

**Sample Collection:**
• Use sterile containers provided by our lab
• Follow proper sampling techniques
• Maintain cold chain for perishable samples
• Label samples clearly with unique identifiers

**Documentation Required:**
• Sample submission form (completely filled)
• Test requirements specification
• Contact information for report delivery

**Delivery Options:**
• Drop-off at our laboratory (Mon-Fri: 9AM-6PM)
• Home collection service available
• Courier service for distant locations

**Sample Requirements:**
• Minimum sample size varies by test type
• Fresh samples preferred for microbiological testing
• Proper preservation for chemical analysis

Need help with specific sample types or collection procedures?`
    },
    pricing: {
      keywords: ['price', 'cost', 'rate', 'charge', 'fee', 'payment'],
      response: `💰 **Pricing Information:**

**Popular Tests:**
• Heavy Metal Analysis: ₹2,500 per sample
• Pesticide Residue: ₹4,500 per sample  
• Microbiology Panel: ₹1,800 per parameter
• Water Quality: ₹2,800 per sample
• Nutritional Analysis: ₹3,200 per sample

**Bulk Discounts:**
• 10+ samples: 10% discount
• 25+ samples: 15% discount
• 50+ samples: 20% discount

**Express Service:**
• 50% surcharge for rush delivery
• Results within 24-48 hours

**Payment Options:**
• Cash/Card at laboratory
• Online payment portal
• Bank transfer
• Corporate credit facilities

Contact us for custom pricing on large projects!`
    },
    contact: {
      keywords: ['contact', 'phone', 'email', 'address', 'support'],
      response: `📞 **Contact Information:**

**Laboratory Address:**
Gram Tarang Food Testing Laboratory
Plot No. 123, Industrial Area
Bhubaneswar, Odisha 751024

**Contact Details:**
📱 Phone: +91-XXX-XXX-XXXX
📧 Email: info@gramtarangfoodtesting.com
🌐 Website: www.gramtarangfoodtesting.com

**Business Hours:**
Monday - Friday: 9:00 AM - 6:00 PM
Saturday: 9:00 AM - 2:00 PM
Sunday: Closed

**Emergency Contact:**
🚨 Emergency Hotline: +91-XXX-XXX-XXXX
📧 Urgent: emergency@gramtarangfoodtesting.com

**Follow Us:**
🔗 LinkedIn | Facebook | Twitter

Our customer support team is ready to help you!`
    },
    reports: {
      keywords: ['report', 'result', 'status', 'ready', 'certificate'],
      response: `📊 **Test Reports & Results:**

**Report Delivery:**
• Email delivery (PDF format)
• WhatsApp notifications available
• Hard copy on request

**Report Features:**
• NABL accredited certificates
• Detailed methodology
• Quality control data
• Regulatory compliance status

**Turnaround Times:**
• Chemical Analysis: 3-7 business days
• Microbiology: 3-10 business days
• Water Testing: 3-5 business days
• Rush service: 24-48 hours

**Report Status Check:**
To check your report status, please provide:
• Sample ID or reference number
• Date of sample submission
• Contact number used during submission

Would you like me to help you track a specific report?`
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // AI Response Generation
  const generateAIResponse = (userMessage) => {
    const message = userMessage.toLowerCase();
    
    // Check for specific keywords and return appropriate response
    for (const [category, data] of Object.entries(knowledgeBase)) {
      if (data.keywords.some(keyword => message.includes(keyword))) {
        return {
          text: data.response,
          type: 'information',
          category: category
        };
      }
    }

    // Greeting responses
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      return {
        text: "Hello! Welcome to Gram Tarang Food Testing Laboratory. I'm here to help you with any questions about our testing services, procedures, or laboratory information. What would you like to know?",
        type: 'greeting'
      };
    }

    // Thank you responses
    if (message.includes('thank') || message.includes('thanks')) {
      return {
        text: "You're welcome! I'm glad I could help. If you have any other questions about our laboratory services or need assistance with anything else, please feel free to ask. Have a great day!",
        type: 'gratitude'
      };
    }

    // Default response with suggestions
    return {
      text: `I understand you're asking about "${userMessage}". While I don't have specific information on that topic, I can help you with:

🔬 Laboratory testing services and procedures
💰 Pricing and payment information  
📋 Sample submission guidelines
📊 Report status and delivery
📞 Contact information and support

Could you please rephrase your question or choose from the quick action buttons below?`,
      type: 'clarification'
    };
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI processing delay
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputText);
      const botMessage = {
        id: Date.now() + 1,
        text: aiResponse.text,
        sender: 'bot',
        timestamp: new Date(),
        type: aiResponse.type || 'response',
        category: aiResponse.category
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleQuickAction = (action) => {
    const response = knowledgeBase[action];
    if (response) {
      const botMessage = {
        id: Date.now(),
        text: response.response,
        sender: 'bot',
        timestamp: new Date(),
        type: 'quick_action',
        category: action
      };
      setMessages(prev => [...prev, botMessage]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Voice Recognition (if supported)
  const startListening = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
        toast.error('Voice recognition failed. Please try typing instead.');
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } else {
      toast.error('Voice recognition not supported in this browser.');
    }
  };

  // Text-to-Speech
  const speakMessage = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text.replace(/[#*•]/g, ''));
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-gradient-to-r from-green-500 to-blue-600 text-white p-5 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
        >
          {isOpen ? <FaTimes className="w-7 h-7" /> : <FaRobot className="w-7 h-7" />}
        </button>
      </motion.div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-3 md:right-6 w-[95vw] md:w-[420px] h-[70vh] md:h-[600px] max-w-[420px] bg-white rounded-lg shadow-2xl z-40 flex flex-col overflow-hidden border border-gray-200"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <FaRobot className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-semibold">GTFL AI Assistant</h3>
                  <p className="text-xs opacity-90">Online • Ready to help</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white hover:bg-opacity-20 p-1 rounded"
              >
                <FaTimes className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-sm lg:max-w-lg px-4 py-3 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-white text-gray-800 shadow-md border'
                  }`}>
                    {message.sender === 'bot' && (
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <FaRobot className="w-4 h-4 text-green-500" />
                          <span className="text-xs font-medium text-gray-600">AI Assistant</span>
                        </div>
                        <button
                          onClick={() => speakMessage(message.text)}
                          className="text-gray-400 hover:text-green-500 transition-colors"
                        >
                          <FaVolumeUp className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                    <p className="text-sm whitespace-pre-line">{message.text}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </p>
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-white text-gray-800 shadow-md border px-4 py-2 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <FaRobot className="w-4 h-4 text-green-500" />
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions */}
            <div className="p-3 bg-white border-t">
              <div className="grid grid-cols-2 gap-2">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickAction(action.action)}
                    className="flex items-center space-x-2 p-3 text-xs bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    <action.icon className="w-4 h-4 text-gray-600" />
                    <span className="text-gray-700 text-xs md:text-sm">{action.text}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t flex items-center space-x-2">
              <div className="flex-1 relative">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="w-full p-3 border border-gray-300 rounded-lg resize-none text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  rows="2"
                />
              </div>
              <button
                onClick={startListening}
                disabled={isListening}
                className={`p-2 rounded-lg transition-colors ${
                  isListening 
                    ? 'bg-red-500 text-white' 
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }`}
              >
                {isListening ? <FaStop className="w-4 h-4" /> : <FaMicrophone className="w-4 h-4" />}
              </button>
              <button
                onClick={handleSendMessage}
                disabled={!inputText.trim()}
                className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaPaperPlane className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatBot;
