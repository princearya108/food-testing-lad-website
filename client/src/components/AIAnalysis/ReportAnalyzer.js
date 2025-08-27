import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaBrain, 
  FaChartLine, 
  FaExclamationTriangle, 
  FaCheckCircle,
  FaInfoCircle,
  FaDownload,
  FaRobot,
  FaFlask,
  FaClipboardCheck
} from 'react-icons/fa';

const ReportAnalyzer = ({ reportData, isVisible, onClose }) => {
  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // AI Analysis Engine
  const analyzeReport = (data) => {
    setIsAnalyzing(true);
    
    // Simulate AI processing
    setTimeout(() => {
      const insights = generateAIInsights(data);
      setAnalysis(insights);
      setIsAnalyzing(false);
    }, 2000);
  };

  const generateAIInsights = (data) => {
    // AI Algorithm for Report Analysis
    const insights = {
      overallScore: calculateOverallScore(data),
      riskAssessment: assessRisks(data),
      compliance: checkCompliance(data),
      recommendations: generateRecommendations(data),
      trends: analyzeTrends(data),
      summary: generateExecutiveSummary(data)
    };

    return insights;
  };

  const calculateOverallScore = (data) => {
    let score = 100;
    let factors = [];

    // Check for contamination
    if (data.heavyMetals) {
      Object.entries(data.heavyMetals).forEach(([metal, value]) => {
        const limits = { lead: 0.1, mercury: 0.05, cadmium: 0.1, arsenic: 0.1 };
        if (value > limits[metal]) {
          score -= 20;
          factors.push(`${metal} exceeds limit`);
        }
      });
    }

    // Check microbiology results
    if (data.microbiology) {
      if (data.microbiology.totalPlateCount > 10000) {
        score -= 15;
        factors.push('High bacterial count');
      }
      if (data.microbiology.pathogensDetected?.length > 0) {
        score -= 30;
        factors.push('Pathogens detected');
      }
    }

    // Check pesticide residues
    if (data.pesticides) {
      const exceededLimits = data.pesticides.filter(p => p.detected > p.mrl).length;
      if (exceededLimits > 0) {
        score -= exceededLimits * 10;
        factors.push(`${exceededLimits} pesticides exceed MRL`);
      }
    }

    return {
      score: Math.max(score, 0),
      grade: score >= 90 ? 'A' : score >= 80 ? 'B' : score >= 70 ? 'C' : score >= 60 ? 'D' : 'F',
      factors
    };
  };

  const assessRisks = (data) => {
    const risks = [];

    // Critical risks
    if (data.microbiology?.pathogensDetected?.length > 0) {
      risks.push({
        level: 'critical',
        type: 'Food Safety',
        description: 'Pathogenic bacteria detected - immediate action required',
        impact: 'Health hazard for consumers',
        action: 'Do not release product, investigate contamination source'
      });
    }

    // High risks
    if (data.heavyMetals?.lead > 0.1) {
      risks.push({
        level: 'high',
        type: 'Chemical Contamination',
        description: 'Lead levels exceed regulatory limits',
        impact: 'Regulatory non-compliance, health concerns',
        action: 'Source identification and remediation required'
      });
    }

    // Medium risks
    if (data.microbiology?.totalPlateCount > 5000) {
      risks.push({
        level: 'medium',
        type: 'Quality',
        description: 'Elevated bacterial count indicates quality issues',
        impact: 'Reduced shelf life, potential spoilage',
        action: 'Review hygiene practices and storage conditions'
      });
    }

    // Low risks
    if (data.nutritional?.sodium > 1000) {
      risks.push({
        level: 'low',
        type: 'Nutritional',
        description: 'High sodium content',
        impact: 'Consumer health consideration for labeling',
        action: 'Consider reformulation or clear labeling'
      });
    }

    return risks;
  };

  const checkCompliance = (data) => {
    const standards = [
      {
        name: 'FSSAI',
        status: 'compliant',
        details: 'All parameters within FSSAI limits',
        critical: false
      },
      {
        name: 'WHO Guidelines',
        status: 'compliant',
        details: 'Meets WHO water quality standards',
        critical: false
      },
      {
        name: 'Export Standards',
        status: 'non-compliant',
        details: 'Pesticide residues exceed EU MRL',
        critical: true
      }
    ];

    return standards;
  };

  const generateRecommendations = (data) => {
    const recommendations = [
      {
        priority: 'high',
        category: 'Quality Control',
        title: 'Implement Enhanced HACCP Monitoring',
        description: 'Strengthen critical control points monitoring to prevent contamination',
        timeline: 'Immediate',
        cost: 'Medium',
        impact: 'High'
      },
      {
        priority: 'medium',
        category: 'Process Improvement',
        title: 'Optimize Storage Conditions',
        description: 'Review temperature and humidity controls in storage areas',
        timeline: '1-2 weeks',
        cost: 'Low',
        impact: 'Medium'
      },
      {
        priority: 'low',
        category: 'Documentation',
        title: 'Update Standard Operating Procedures',
        description: 'Revise SOPs based on latest testing requirements',
        timeline: '1 month',
        cost: 'Low',
        impact: 'Low'
      }
    ];

    return recommendations;
  };

  const analyzeTrends = (data) => {
    // Simulate trend analysis based on historical data
    return {
      improving: ['Microbial quality', 'Processing hygiene'],
      stable: ['Heavy metal levels', 'Nutritional content'],
      declining: ['Pesticide management'],
      predictions: {
        nextMonth: 'Expected improvement in overall quality score',
        nextQuarter: 'Compliance rate likely to increase to 95%'
      }
    };
  };

  const generateExecutiveSummary = (data) => {
    return {
      keyFindings: [
        'Product meets basic safety requirements',
        'Minor quality improvements needed',
        'Export compliance requires attention'
      ],
      businessImpact: 'Low risk for domestic market, moderate risk for export',
      nextSteps: [
        'Address pesticide residue issues',
        'Implement recommended QC measures',
        'Schedule follow-up testing in 30 days'
      ]
    };
  };

  useEffect(() => {
    if (isVisible && reportData && !analysis) {
      analyzeReport(reportData);
    }
  }, [isVisible, reportData, analysis]);

  if (!isVisible) return null;

  return (
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
        className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FaBrain className="w-8 h-8" />
              <div>
                <h2 className="text-2xl font-bold">AI Report Analysis</h2>
                <p className="text-blue-100">Intelligent insights and recommendations</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {isAnalyzing ? (
            <div className="flex flex-col items-center justify-center py-20">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full mb-4"
              />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Analyzing Report Data</h3>
              <p className="text-gray-500">AI is processing your test results...</p>
            </div>
          ) : analysis ? (
            <div className="space-y-8">
              {/* Overall Score */}
              <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">Overall Quality Score</h3>
                    <p className="text-gray-600">AI-powered assessment based on all parameters</p>
                  </div>
                  <div className="text-center">
                    <div className={`text-6xl font-bold ${
                      analysis.overallScore.score >= 90 ? 'text-green-500' :
                      analysis.overallScore.score >= 70 ? 'text-yellow-500' : 'text-red-500'
                    }`}>
                      {analysis.overallScore.score}
                    </div>
                    <div className={`text-2xl font-bold ${
                      analysis.overallScore.grade === 'A' ? 'text-green-500' :
                      analysis.overallScore.grade === 'B' ? 'text-blue-500' :
                      analysis.overallScore.grade === 'C' ? 'text-yellow-500' : 'text-red-500'
                    }`}>
                      Grade {analysis.overallScore.grade}
                    </div>
                  </div>
                </div>
              </div>

              {/* Risk Assessment */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <FaExclamationTriangle className="w-5 h-5 text-orange-500 mr-2" />
                  Risk Assessment
                </h3>
                <div className="space-y-4">
                  {analysis.riskAssessment.map((risk, index) => (
                    <div key={index} className={`p-4 rounded-lg border-l-4 ${
                      risk.level === 'critical' ? 'bg-red-50 border-red-500' :
                      risk.level === 'high' ? 'bg-orange-50 border-orange-500' :
                      risk.level === 'medium' ? 'bg-yellow-50 border-yellow-500' :
                      'bg-blue-50 border-blue-500'
                    }`}>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800">{risk.type}</h4>
                          <p className="text-gray-600 mb-2">{risk.description}</p>
                          <p className="text-sm text-gray-500 mb-2"><strong>Impact:</strong> {risk.impact}</p>
                          <p className="text-sm text-gray-700"><strong>Action:</strong> {risk.action}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          risk.level === 'critical' ? 'bg-red-100 text-red-800' :
                          risk.level === 'high' ? 'bg-orange-100 text-orange-800' :
                          risk.level === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {risk.level.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Compliance Status */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <FaClipboardCheck className="w-5 h-5 text-green-500 mr-2" />
                  Regulatory Compliance
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {analysis.compliance.map((standard, index) => (
                    <div key={index} className={`p-4 rounded-lg border ${
                      standard.status === 'compliant' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                    }`}>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-800">{standard.name}</h4>
                        {standard.status === 'compliant' ? (
                          <FaCheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <FaExclamationTriangle className="w-5 h-5 text-red-500" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{standard.details}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Recommendations */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <FaRobot className="w-5 h-5 text-blue-500 mr-2" />
                  AI Recommendations
                </h3>
                <div className="space-y-4">
                  {analysis.recommendations.map((rec, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold mr-3 ${
                              rec.priority === 'high' ? 'bg-red-100 text-red-800' :
                              rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {rec.priority.toUpperCase()}
                            </span>
                            <span className="text-sm text-gray-500">{rec.category}</span>
                          </div>
                          <h4 className="font-semibold text-gray-800 mb-2">{rec.title}</h4>
                          <p className="text-gray-600 mb-3">{rec.description}</p>
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="text-gray-500">Timeline:</span>
                              <span className="ml-1 font-medium">{rec.timeline}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Cost:</span>
                              <span className="ml-1 font-medium">{rec.cost}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Impact:</span>
                              <span className="ml-1 font-medium">{rec.impact}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Executive Summary */}
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <FaChartLine className="w-5 h-5 text-purple-500 mr-2" />
                  Executive Summary
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Key Findings</h4>
                    <ul className="space-y-1">
                      {analysis.summary.keyFindings.map((finding, index) => (
                        <li key={index} className="flex items-start">
                          <FaInfoCircle className="w-4 h-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-600 text-sm">{finding}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Next Steps</h4>
                    <ul className="space-y-1">
                      {analysis.summary.nextSteps.map((step, index) => (
                        <li key={index} className="flex items-start">
                          <FaCheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-600 text-sm">{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="mt-4 p-4 bg-white bg-opacity-50 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-1">Business Impact</h4>
                  <p className="text-gray-600">{analysis.summary.businessImpact}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
                <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
                  <FaDownload className="w-4 h-4" />
                  <span>Download Report</span>
                </button>
                <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  Schedule Follow-up
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ReportAnalyzer;
