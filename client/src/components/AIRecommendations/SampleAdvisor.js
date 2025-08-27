import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaFlask, 
  FaLightbulb, 
  FaChartPie, 
  FaCalendarAlt,
  FaRupeeSign,
  FaClipboardList,
  FaInfoCircle,
  FaCheckCircle,
  FaExclamationTriangle,
  FaRobot,
  FaClock,
  FaThumbsUp
} from 'react-icons/fa';

const SampleAdvisor = ({ productInfo, isOpen, onClose }) => {
  const [recommendations, setRecommendations] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);

  // AI Recommendation Engine
  const generateRecommendations = (productData) => {
    setIsAnalyzing(true);
    
    setTimeout(() => {
      const advice = createSmartRecommendations(productData);
      setRecommendations(advice);
      setIsAnalyzing(false);
    }, 1500);
  };

  const createSmartRecommendations = (data) => {
    const { 
      productType, 
      intendedUse, 
      targetMarket, 
      shelfLife, 
      processingMethod,
      budget,
      urgency 
    } = data;

    // AI Decision Tree for Test Recommendations
    let testPackages = [];

    // Basic Safety Package (Always Recommended)
    testPackages.push({
      id: 'basic_safety',
      name: 'Basic Safety Package',
      priority: 'essential',
      description: 'Fundamental safety tests required for all food products',
      tests: [
        { name: 'Heavy Metal Analysis', code: 'HM-001', price: 2500, duration: '3-5 days', required: true },
        { name: 'Microbiology Panel', code: 'MB-001', price: 1800, duration: '3-7 days', required: true },
        { name: 'Basic Nutritional', code: 'NUT-001', price: 2200, duration: '4-6 days', required: true }
      ],
      totalPrice: 6500,
      estimatedTime: '5-7 days',
      compliance: ['FSSAI', 'Basic Safety Standards'],
      suitability: 95
    });

    // Market-Specific Packages
    if (targetMarket.includes('export')) {
      testPackages.push({
        id: 'export_compliance',
        name: 'Export Compliance Package',
        priority: 'recommended',
        description: 'Comprehensive testing for international market compliance',
        tests: [
          { name: 'Pesticide Residue (500+ compounds)', code: 'PR-002', price: 4500, duration: '5-7 days', required: true },
          { name: 'Aflatoxin Testing', code: 'AFL-001', price: 2200, duration: '4-6 days', required: true },
          { name: 'Food Allergen Panel', code: 'ALL-001', price: 3000, duration: '2-4 days', required: false },
          { name: 'Nutritional Complete', code: 'NUT-002', price: 3200, duration: '5-7 days', required: true }
        ],
        totalPrice: 12900,
        estimatedTime: '7-10 days',
        compliance: ['EU Standards', 'US FDA', 'Codex Alimentarius'],
        suitability: 88
      });
    }

    // Product-Specific Recommendations
    if (productType === 'dairy') {
      testPackages.push({
        id: 'dairy_specialized',
        name: 'Dairy Specialized Package',
        priority: 'recommended',
        description: 'Specialized tests for dairy products quality and safety',
        tests: [
          { name: 'Antibiotic Residue', code: 'AB-001', price: 3500, duration: '3-5 days', required: true },
          { name: 'Fat & Protein Analysis', code: 'FP-001', price: 1500, duration: '2-3 days', required: true },
          { name: 'Pasteurization Efficiency', code: 'PE-001', price: 2000, duration: '1-2 days', required: false },
          { name: 'Shelf-life Study', code: 'SLS-001', price: 8000, duration: '30 days', required: false }
        ],
        totalPrice: 15000,
        estimatedTime: '5-7 days (excluding shelf-life)',
        compliance: ['Dairy Standards', 'FSSAI Dairy Regulations'],
        suitability: 92
      });
    }

    if (productType === 'beverages') {
      testPackages.push({
        id: 'beverage_package',
        name: 'Beverage Quality Package',
        priority: 'recommended',
        description: 'Complete analysis for beverage products',
        tests: [
          { name: 'pH & Acidity', code: 'PH-001', price: 800, duration: '1 day', required: true },
          { name: 'Preservative Analysis', code: 'PRES-001', price: 2500, duration: '3-4 days', required: true },
          { name: 'Sugar Content', code: 'SUG-001', price: 1200, duration: '2 days', required: true },
          { name: 'Carbonation Level', code: 'CARB-001', price: 1000, duration: '1 day', required: false }
        ],
        totalPrice: 5500,
        estimatedTime: '3-4 days',
        compliance: ['Beverage Standards', 'Labeling Requirements'],
        suitability: 89
      });
    }

    // Budget-Optimized Package
    if (budget === 'limited') {
      testPackages.push({
        id: 'budget_essential',
        name: 'Budget Essential Package',
        priority: 'alternative',
        description: 'Cost-effective testing covering critical safety parameters',
        tests: [
          { name: 'Basic Microbiology', code: 'MB-BASIC', price: 1200, duration: '3-5 days', required: true },
          { name: 'Heavy Metals (Priority)', code: 'HM-PRIORITY', price: 1800, duration: '3-4 days', required: true },
          { name: 'Basic Nutritional', code: 'NUT-BASIC', price: 1500, duration: '3-4 days', required: true }
        ],
        totalPrice: 4500,
        estimatedTime: '4-5 days',
        compliance: ['Minimum Safety Requirements'],
        suitability: 75
      });
    }

    // Premium Comprehensive Package
    testPackages.push({
      id: 'premium_comprehensive',
      name: 'Premium Comprehensive Package',
      priority: 'premium',
      description: 'Complete analytical profile with advanced testing',
      tests: [
        { name: 'Full Pesticide Screen (750+ compounds)', code: 'PR-FULL', price: 6500, duration: '7-10 days', required: true },
        { name: 'Complete Microbiology', code: 'MB-FULL', price: 4500, duration: '5-10 days', required: true },
        { name: 'Advanced Nutritional', code: 'NUT-ADV', price: 4800, duration: '6-8 days', required: true },
        { name: 'Heavy Metals Extended', code: 'HM-EXT', price: 3500, duration: '4-6 days', required: true },
        { name: 'Vitamin Analysis', code: 'VIT-001', price: 3200, duration: '5-7 days', required: false },
        { name: 'Antioxidant Activity', code: 'AOX-001', price: 2800, duration: '3-5 days', required: false }
      ],
      totalPrice: 25300,
      estimatedTime: '10-14 days',
      compliance: ['All International Standards', 'Premium Quality Certification'],
      suitability: 96
    });

    // AI-Generated Insights
    const insights = {
      riskFactors: analyzeRiskFactors(data),
      marketInsights: generateMarketInsights(data),
      costOptimization: suggestCostOptimization(testPackages, data),
      timeline: createTimelineRecommendation(data, testPackages),
      customAdvice: generateCustomAdvice(data)
    };

    return {
      packages: testPackages,
      insights,
      confidence: 94,
      lastUpdated: new Date()
    };
  };

  const analyzeRiskFactors = (data) => {
    const risks = [];
    
    if (data.processingMethod === 'minimal') {
      risks.push({
        factor: 'Minimal Processing',
        risk: 'high',
        description: 'Higher microbial contamination risk',
        mitigation: 'Enhanced microbiology testing recommended'
      });
    }

    if (data.targetMarket.includes('children')) {
      risks.push({
        factor: 'Child Target Market',
        risk: 'high',
        description: 'Stricter safety requirements for children products',
        mitigation: 'Complete allergen and contaminant screening required'
      });
    }

    if (data.shelfLife > 12) {
      risks.push({
        factor: 'Extended Shelf Life',
        risk: 'medium',
        description: 'Preservation and stability concerns',
        mitigation: 'Shelf-life study and preservative analysis needed'
      });
    }

    return risks;
  };

  const generateMarketInsights = (data) => {
    return {
      trendingTests: ['Gluten-free verification', 'Organic certification', 'Probiotic count'],
      marketRequirements: data.targetMarket.includes('export') 
        ? 'Export markets require stricter compliance'
        : 'Domestic market focus allows cost optimization',
      competitorAnalysis: 'Similar products typically require 5-8 tests for market entry'
    };
  };

  const suggestCostOptimization = (packages, data) => {
    return {
      recommendation: 'Bundle multiple tests for 15% discount',
      savings: 'Combining packages can save ₹2,000-5,000',
      phasing: 'Consider essential tests first, then premium tests based on results'
    };
  };

  const createTimelineRecommendation = (data, packages) => {
    const urgencyMap = {
      immediate: 'Express service (+50% cost) for 24-48 hour results',
      week: 'Standard processing suitable for your timeline',
      month: 'Optimal timing for comprehensive testing and cost savings'
    };

    return urgencyMap[data.urgency] || urgencyMap.week;
  };

  const generateCustomAdvice = (data) => {
    return [
      `Based on your ${data.productType} product, microbiology testing is critical`,
      `For ${data.targetMarket.join(' and ')} markets, compliance testing is essential`,
      `Your ${data.budget} budget allows for ${data.budget === 'limited' ? 'essential' : 'comprehensive'} testing approach`,
      `Consider seasonal testing variations for consistent quality`
    ];
  };

  useEffect(() => {
    if (isOpen && productInfo && !recommendations) {
      generateRecommendations(productInfo);
    }
  }, [isOpen, productInfo, recommendations]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.95, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 20 }}
          className="bg-white rounded-xl max-w-7xl w-full max-h-[95vh] overflow-hidden shadow-2xl"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FaRobot className="w-8 h-8" />
                <div>
                  <h2 className="text-2xl font-bold">AI Sample Advisor</h2>
                  <p className="text-green-100">Intelligent testing recommendations</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors text-2xl"
              >
                ×
              </button>
            </div>
          </div>

          <div className="p-6 overflow-y-auto max-h-[calc(95vh-120px)]">
            {isAnalyzing ? (
              <div className="flex flex-col items-center justify-center py-20">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full mb-4"
                />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Analyzing Your Product</h3>
                <p className="text-gray-500">AI is creating personalized testing recommendations...</p>
              </div>
            ) : recommendations ? (
              <div className="space-y-8">
                {/* AI Confidence & Summary */}
                <div className="bg-gradient-to-r from-green-50 to-teal-50 p-6 rounded-xl border border-green-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-800 flex items-center">
                      <FaLightbulb className="w-5 h-5 text-yellow-500 mr-2" />
                      AI Recommendations
                    </h3>
                    <div className="flex items-center space-x-2">
                      <FaThumbsUp className="w-4 h-4 text-green-500" />
                      <span className="text-sm font-medium text-green-700">
                        {recommendations.confidence}% Confidence
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Custom Advice for Your Product</h4>
                      <ul className="space-y-1">
                        {recommendations.insights.customAdvice.map((advice, index) => (
                          <li key={index} className="flex items-start text-sm text-gray-600">
                            <FaInfoCircle className="w-3 h-3 text-blue-500 mr-2 mt-1 flex-shrink-0" />
                            {advice}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Market Insights</h4>
                      <p className="text-sm text-gray-600 mb-2">{recommendations.insights.marketInsights.marketRequirements}</p>
                      <p className="text-sm text-gray-600">{recommendations.insights.marketInsights.competitorAnalysis}</p>
                    </div>
                  </div>
                </div>

                {/* Risk Factors */}
                {recommendations.insights.riskFactors.length > 0 && (
                  <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                      <FaExclamationTriangle className="w-5 h-5 text-orange-500 mr-2" />
                      Risk Assessment
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {recommendations.insights.riskFactors.map((risk, index) => (
                        <div key={index} className={`p-4 rounded-lg ${
                          risk.risk === 'high' ? 'bg-red-100 border border-red-200' : 'bg-yellow-100 border border-yellow-200'
                        }`}>
                          <h4 className="font-semibold text-gray-800 mb-1">{risk.factor}</h4>
                          <p className="text-sm text-gray-600 mb-2">{risk.description}</p>
                          <p className="text-xs text-gray-700"><strong>Mitigation:</strong> {risk.mitigation}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Testing Packages */}
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                    <FaFlask className="w-5 h-5 text-blue-500 mr-2" />
                    Recommended Testing Packages
                  </h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {recommendations.packages.map((pkg) => (
                      <motion.div
                        key={pkg.id}
                        whileHover={{ scale: 1.02 }}
                        className={`border-2 rounded-xl p-6 cursor-pointer transition-all ${
                          selectedPackage === pkg.id 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-200 hover:border-gray-300'
                        } ${
                          pkg.priority === 'essential' ? 'ring-2 ring-green-200' :
                          pkg.priority === 'recommended' ? 'ring-2 ring-blue-200' :
                          pkg.priority === 'premium' ? 'ring-2 ring-purple-200' : ''
                        }`}
                        onClick={() => setSelectedPackage(selectedPackage === pkg.id ? null : pkg.id)}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center mb-2">
                              <h4 className="text-lg font-bold text-gray-800">{pkg.name}</h4>
                              <span className={`ml-3 px-2 py-1 rounded-full text-xs font-semibold ${
                                pkg.priority === 'essential' ? 'bg-green-100 text-green-800' :
                                pkg.priority === 'recommended' ? 'bg-blue-100 text-blue-800' :
                                pkg.priority === 'premium' ? 'bg-purple-100 text-purple-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {pkg.priority.toUpperCase()}
                              </span>
                            </div>
                            <p className="text-gray-600 text-sm mb-4">{pkg.description}</p>
                          </div>
                          <div className="text-right ml-4">
                            <div className="text-2xl font-bold text-gray-800">₹{pkg.totalPrice.toLocaleString()}</div>
                            <div className="text-sm text-gray-500">{pkg.estimatedTime}</div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span className="flex items-center">
                              <FaClipboardList className="w-4 h-4 mr-1" />
                              {pkg.tests.length} tests
                            </span>
                            <span className="flex items-center">
                              <FaClock className="w-4 h-4 mr-1" />
                              {pkg.estimatedTime}
                            </span>
                          </div>
                          <div className="text-right">
                            <div className={`text-sm font-medium ${
                              pkg.suitability >= 90 ? 'text-green-600' :
                              pkg.suitability >= 80 ? 'text-blue-600' : 'text-yellow-600'
                            }`}>
                              {pkg.suitability}% Match
                            </div>
                          </div>
                        </div>

                        <AnimatePresence>
                          {selectedPackage === pkg.id && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="border-t border-gray-200 pt-4 mt-4"
                            >
                              <h5 className="font-semibold text-gray-800 mb-3">Included Tests:</h5>
                              <div className="space-y-2">
                                {pkg.tests.map((test, index) => (
                                  <div key={index} className="flex items-center justify-between p-2 bg-white bg-opacity-50 rounded">
                                    <div className="flex items-center">
                                      <FaCheckCircle className={`w-4 h-4 mr-2 ${
                                        test.required ? 'text-green-500' : 'text-gray-400'
                                      }`} />
                                      <span className="text-sm font-medium text-gray-800">{test.name}</span>
                                      <span className="text-xs text-gray-500 ml-2">({test.code})</span>
                                    </div>
                                    <div className="text-right text-sm">
                                      <div className="font-medium text-gray-800">₹{test.price}</div>
                                      <div className="text-gray-500">{test.duration}</div>
                                    </div>
                                  </div>
                                ))}
                              </div>

                              <div className="mt-4 p-3 bg-gray-100 rounded">
                                <h6 className="font-medium text-gray-800 mb-1">Compliance Coverage:</h6>
                                <div className="flex flex-wrap gap-2">
                                  {pkg.compliance.map((standard, index) => (
                                    <span key={index} className="px-2 py-1 bg-white text-gray-700 rounded text-xs">
                                      {standard}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Cost Optimization */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                    <FaRupeeSign className="w-5 h-5 text-yellow-600 mr-2" />
                    Cost Optimization Tips
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Bundle Savings</h4>
                      <p className="text-sm text-gray-600">{recommendations.insights.costOptimization.recommendation}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Potential Savings</h4>
                      <p className="text-sm text-gray-600">{recommendations.insights.costOptimization.savings}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Phased Approach</h4>
                      <p className="text-sm text-gray-600">{recommendations.insights.costOptimization.phasing}</p>
                    </div>
                  </div>
                </div>

                {/* Timeline Recommendation */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                    <FaCalendarAlt className="w-5 h-5 text-blue-600 mr-2" />
                    Timeline Recommendation
                  </h3>
                  <p className="text-gray-700">{recommendations.insights.timeline}</p>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
                  <button className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
                    Save Recommendations
                  </button>
                  <button className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                    Submit Sample Request
                  </button>
                  <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Schedule Consultation
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SampleAdvisor;
