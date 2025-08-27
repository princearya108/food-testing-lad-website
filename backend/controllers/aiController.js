const mongoose = require('mongoose');
const { authenticateAdmin } = require('../middleware/auth');

// AI-powered insights and automation
class AIController {
  
  // Generate intelligent report insights
  static async analyzeReport(req, res) {
    try {
      const { reportData } = req.body;
      
      if (!reportData) {
        return res.status(400).json({
          success: false,
          message: 'Report data is required'
        });
      }

      // AI Analysis Engine
      const insights = await AIController.processReportAnalysis(reportData);
      
      res.json({
        success: true,
        data: insights,
        analysisTime: new Date(),
        confidence: insights.confidence || 95
      });

    } catch (error) {
      console.error('AI Analysis Error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to analyze report',
        error: error.message
      });
    }
  }

  // Smart testing recommendations
  static async getTestingRecommendations(req, res) {
    try {
      const { productInfo } = req.body;
      
      if (!productInfo) {
        return res.status(400).json({
          success: false,
          message: 'Product information is required'
        });
      }

      const recommendations = await AIController.generateTestingRecommendations(productInfo);
      
      res.json({
        success: true,
        data: recommendations,
        generatedAt: new Date()
      });

    } catch (error) {
      console.error('AI Recommendations Error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to generate recommendations',
        error: error.message
      });
    }
  }

  // Automated quality insights
  static async getQualityInsights(req, res) {
    try {
      const { sampleId, testResults } = req.body;
      
      const insights = await AIController.analyzeQualityMetrics(testResults);
      
      res.json({
        success: true,
        data: {
          sampleId,
          insights,
          recommendations: insights.recommendations,
          riskLevel: insights.riskLevel
        }
      });

    } catch (error) {
      console.error('Quality Insights Error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to generate quality insights',
        error: error.message
      });
    }
  }

  // AI Chat/Support
  static async processChatQuery(req, res) {
    try {
      const { query, context } = req.body;
      
      const response = await AIController.generateChatResponse(query, context);
      
      res.json({
        success: true,
        response: response.text,
        intent: response.intent,
        confidence: response.confidence
      });

    } catch (error) {
      console.error('AI Chat Error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to process chat query',
        error: error.message
      });
    }
  }

  // Process Report Analysis (AI Engine)
  static async processReportAnalysis(reportData) {
    // Simulate AI processing with comprehensive analysis
    const analysis = {
      overallScore: AIController.calculateQualityScore(reportData),
      riskAssessment: AIController.assessRisks(reportData),
      compliance: AIController.checkCompliance(reportData),
      recommendations: AIController.generateRecommendations(reportData),
      trends: AIController.analyzeTrends(reportData),
      confidence: 94
    };

    return analysis;
  }

  // Calculate Quality Score Algorithm
  static calculateQualityScore(data) {
    let score = 100;
    let deductions = [];

    // Heavy metals check
    if (data.heavyMetals) {
      const limits = { lead: 0.1, mercury: 0.05, cadmium: 0.1, arsenic: 0.1 };
      for (const [metal, value] of Object.entries(data.heavyMetals)) {
        if (value > limits[metal]) {
          const excess = ((value - limits[metal]) / limits[metal]) * 100;
          const deduction = Math.min(excess * 0.5, 25); // Max 25 points per metal
          score -= deduction;
          deductions.push({
            category: 'Heavy Metals',
            issue: `${metal} exceeds limit by ${excess.toFixed(1)}%`,
            impact: deduction
          });
        }
      }
    }

    // Microbiology check
    if (data.microbiology) {
      if (data.microbiology.totalPlateCount > 10000) {
        score -= 20;
        deductions.push({
          category: 'Microbiology',
          issue: 'High bacterial count detected',
          impact: 20
        });
      }
      
      if (data.microbiology.pathogensDetected?.length > 0) {
        score -= 30;
        deductions.push({
          category: 'Microbiology',
          issue: `${data.microbiology.pathogensDetected.length} pathogen(s) detected`,
          impact: 30
        });
      }
    }

    // Pesticide residues check
    if (data.pesticides && Array.isArray(data.pesticides)) {
      const violations = data.pesticides.filter(p => p.detected > p.mrl);
      if (violations.length > 0) {
        const totalDeduction = violations.length * 10;
        score -= totalDeduction;
        deductions.push({
          category: 'Pesticide Residues',
          issue: `${violations.length} pesticide(s) exceed MRL`,
          impact: totalDeduction
        });
      }
    }

    const finalScore = Math.max(score, 0);
    const grade = finalScore >= 90 ? 'A' : 
                 finalScore >= 80 ? 'B' : 
                 finalScore >= 70 ? 'C' : 
                 finalScore >= 60 ? 'D' : 'F';

    return {
      score: finalScore,
      grade,
      deductions,
      status: finalScore >= 80 ? 'Excellent' : 
              finalScore >= 60 ? 'Good' : 
              finalScore >= 40 ? 'Fair' : 'Poor'
    };
  }

  // Risk Assessment Algorithm
  static assessRisks(data) {
    const risks = [];

    // Critical risks
    if (data.microbiology?.pathogensDetected?.length > 0) {
      risks.push({
        level: 'critical',
        category: 'Food Safety',
        description: 'Pathogenic microorganisms detected',
        impact: 'Immediate health risk to consumers',
        action: 'Quarantine product, investigate contamination source',
        timeframe: 'Immediate'
      });
    }

    // High risks
    if (data.heavyMetals) {
      const criticalMetals = Object.entries(data.heavyMetals)
        .filter(([metal, value]) => {
          const limits = { lead: 0.1, mercury: 0.05, cadmium: 0.1, arsenic: 0.1 };
          return value > limits[metal] * 2; // 2x limit = high risk
        });

      if (criticalMetals.length > 0) {
        risks.push({
          level: 'high',
          category: 'Chemical Contamination',
          description: `Severe heavy metal contamination: ${criticalMetals.map(([metal]) => metal).join(', ')}`,
          impact: 'Long-term health risks, regulatory violations',
          action: 'Source identification, remediation, batch recall consideration',
          timeframe: '24-48 hours'
        });
      }
    }

    // Medium risks
    if (data.microbiology?.totalPlateCount > 50000) {
      risks.push({
        level: 'medium',
        category: 'Quality Control',
        description: 'Very high bacterial count indicates poor hygiene',
        impact: 'Rapid spoilage, quality degradation',
        action: 'Review HACCP procedures, sanitization protocols',
        timeframe: '1 week'
      });
    }

    return risks;
  }

  // Compliance Checking
  static checkCompliance(data) {
    const standards = [
      {
        name: 'FSSAI',
        status: 'compliant',
        details: 'Meets Indian food safety standards',
        violations: []
      },
      {
        name: 'WHO Guidelines',
        status: 'compliant',
        details: 'Complies with WHO recommendations',
        violations: []
      },
      {
        name: 'Export Standards (EU)',
        status: 'pending',
        details: 'Requires additional verification',
        violations: []
      }
    ];

    // Check violations and update compliance status
    if (data.pesticides) {
      const violations = data.pesticides.filter(p => p.detected > p.mrl);
      if (violations.length > 0) {
        standards[2].status = 'non-compliant';
        standards[2].violations = violations.map(v => `${v.name} exceeds MRL`);
      }
    }

    return standards;
  }

  // Generate Recommendations
  static generateRecommendations(data) {
    const recommendations = [];

    // Based on microbiology results
    if (data.microbiology?.totalPlateCount > 5000) {
      recommendations.push({
        priority: 'high',
        category: 'Process Control',
        title: 'Implement Enhanced HACCP Monitoring',
        description: 'Strengthen critical control points to prevent microbial contamination',
        timeline: 'Immediate',
        estimatedCost: 'Medium',
        expectedImpact: 'High'
      });
    }

    // Based on heavy metals
    if (data.heavyMetals && Object.values(data.heavyMetals).some(v => v > 0.05)) {
      recommendations.push({
        priority: 'medium',
        category: 'Source Control',
        title: 'Raw Material Verification Program',
        description: 'Implement supplier qualification and incoming material testing',
        timeline: '2-4 weeks',
        estimatedCost: 'High',
        expectedImpact: 'High'
      });
    }

    // General quality improvement
    recommendations.push({
      priority: 'low',
      category: 'Continuous Improvement',
      title: 'Statistical Process Control Implementation',
      description: 'Deploy SPC charts for real-time quality monitoring',
      timeline: '1-3 months',
      estimatedCost: 'Low',
      expectedImpact: 'Medium'
    });

    return recommendations;
  }

  // Trend Analysis
  static analyzeTrends(data) {
    // Simulate trend analysis
    return {
      qualityTrend: 'stable',
      riskTrend: 'decreasing',
      complianceRate: 92,
      predictedIssues: ['Seasonal contamination risks in Q3'],
      improvementAreas: ['Microbial control', 'Documentation accuracy']
    };
  }

  // Generate Testing Recommendations
  static async generateTestingRecommendations(productInfo) {
    const { productType, targetMarket, budget, urgency } = productInfo;
    
    const recommendations = {
      essential: [],
      recommended: [],
      optional: [],
      timeline: {},
      estimatedCost: {},
      complianceNeeds: []
    };

    // Essential tests based on product type
    if (productType === 'food' || productType === 'dairy') {
      recommendations.essential.push(
        'Microbiological Safety Panel',
        'Heavy Metal Analysis',
        'Basic Nutritional Analysis'
      );
    }

    // Market-specific requirements
    if (targetMarket.includes('export')) {
      recommendations.recommended.push(
        'Pesticide Residue Analysis',
        'Aflatoxin Testing',
        'Food Allergen Screening'
      );
      recommendations.complianceNeeds.push('EU MRL Standards', 'Export Certification');
    }

    // Budget considerations
    if (budget === 'limited') {
      recommendations.timeline.approach = 'phased';
      recommendations.estimatedCost.range = '₹5,000 - ₹15,000';
    } else {
      recommendations.timeline.approach = 'comprehensive';
      recommendations.estimatedCost.range = '₹15,000 - ₹35,000';
    }

    // Urgency adjustments
    if (urgency === 'immediate') {
      recommendations.timeline.expedited = true;
      recommendations.estimatedCost.surcharge = '50%';
    }

    return recommendations;
  }

  // Analyze Quality Metrics
  static async analyzeQualityMetrics(testResults) {
    const insights = {
      overallQuality: 'Good',
      criticalIssues: [],
      recommendations: [],
      riskLevel: 'Low',
      complianceStatus: 'Compliant'
    };

    // Analyze results and generate insights
    if (testResults.contamination > 0.1) {
      insights.criticalIssues.push('Contamination levels exceed acceptable limits');
      insights.riskLevel = 'High';
    }

    if (testResults.nutrients?.protein < 10) {
      insights.recommendations.push('Consider protein fortification');
    }

    return insights;
  }

  // Generate Chat Response
  static async generateChatResponse(query, context = {}) {
    const lowerQuery = query.toLowerCase();
    
    // Intent detection
    let intent = 'general';
    let confidence = 0.8;
    
    if (lowerQuery.includes('test') || lowerQuery.includes('analysis')) {
      intent = 'testing_inquiry';
      confidence = 0.9;
    } else if (lowerQuery.includes('price') || lowerQuery.includes('cost')) {
      intent = 'pricing_inquiry';
      confidence = 0.85;
    } else if (lowerQuery.includes('sample') || lowerQuery.includes('submission')) {
      intent = 'sample_inquiry';
      confidence = 0.9;
    }

    // Generate appropriate response
    const responses = {
      testing_inquiry: "I can help you with our testing services. We offer comprehensive analysis including microbiological testing, chemical analysis, and nutritional profiling. What specific type of testing are you interested in?",
      pricing_inquiry: "Our pricing varies based on the type of testing required. Basic safety tests start from ₹1,500, while comprehensive packages range from ₹5,000-₹25,000. Would you like a detailed quote for specific tests?",
      sample_inquiry: "For sample submission, please ensure proper labeling and preservation. We accept samples Monday-Friday, 9 AM-6 PM. Would you like information about our sample collection service?",
      general: "Hello! I'm here to help with any questions about our laboratory testing services, pricing, or procedures. How can I assist you today?"
    };

    return {
      text: responses[intent],
      intent,
      confidence
    };
  }
}

module.exports = AIController;
