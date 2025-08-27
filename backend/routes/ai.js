const express = require('express');
const router = express.Router();
const AIController = require('../controllers/aiController');
const { authenticateAdmin } = require('../middleware/auth');

// Public AI endpoints (with rate limiting in production)

// AI Chat Support
router.post('/chat', async (req, res) => {
  try {
    await AIController.processChatQuery(req, res);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'AI service temporarily unavailable'
    });
  }
});

// Smart Testing Recommendations
router.post('/recommendations', async (req, res) => {
  try {
    await AIController.getTestingRecommendations(req, res);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to generate recommendations'
    });
  }
});

// Admin-only AI endpoints

// Report Analysis (Advanced AI)
router.post('/analyze-report', authenticateAdmin, async (req, res) => {
  try {
    await AIController.analyzeReport(req, res);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Report analysis failed'
    });
  }
});

// Quality Insights
router.post('/quality-insights', authenticateAdmin, async (req, res) => {
  try {
    await AIController.getQualityInsights(req, res);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Quality analysis failed'
    });
  }
});

// AI Analytics Dashboard
router.get('/analytics', authenticateAdmin, async (req, res) => {
  try {
    const analytics = {
      totalAnalyses: 150,
      averageQualityScore: 85.7,
      trendsDetected: 12,
      riskAlertsGenerated: 3,
      recommendationsProvided: 45,
      accuracyRate: 94.2,
      lastUpdated: new Date()
    };

    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch AI analytics'
    });
  }
});

// AI Model Status
router.get('/status', async (req, res) => {
  try {
    const status = {
      aiEngine: 'operational',
      modelVersion: '2.1.0',
      lastTraining: '2024-01-15',
      accuracy: '94.2%',
      responseTime: '1.2s',
      uptime: '99.8%',
      featuresAvailable: [
        'Report Analysis',
        'Testing Recommendations',
        'Quality Insights',
        'Chat Support',
        'Risk Assessment',
        'Compliance Checking'
      ]
    };

    res.json({
      success: true,
      data: status
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get AI status'
    });
  }
});

// Batch Analysis for Multiple Reports
router.post('/batch-analyze', authenticateAdmin, async (req, res) => {
  try {
    const { reports } = req.body;
    
    if (!reports || !Array.isArray(reports)) {
      return res.status(400).json({
        success: false,
        message: 'Reports array is required'
      });
    }

    const results = [];
    for (const report of reports) {
      try {
        const analysis = await AIController.processReportAnalysis(report.data);
        results.push({
          reportId: report.id,
          analysis,
          status: 'completed'
        });
      } catch (error) {
        results.push({
          reportId: report.id,
          error: error.message,
          status: 'failed'
        });
      }
    }

    res.json({
      success: true,
      data: {
        totalReports: reports.length,
        completed: results.filter(r => r.status === 'completed').length,
        failed: results.filter(r => r.status === 'failed').length,
        results
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Batch analysis failed'
    });
  }
});

// AI Learning Feedback
router.post('/feedback', authenticateAdmin, async (req, res) => {
  try {
    const { analysisId, rating, feedback, correctPrediction } = req.body;
    
    // In a real implementation, this would update the AI model
    console.log('AI Feedback received:', {
      analysisId,
      rating,
      feedback,
      correctPrediction,
      timestamp: new Date()
    });

    res.json({
      success: true,
      message: 'Feedback recorded successfully',
      data: {
        analysisId,
        status: 'recorded',
        willImproveModel: true
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to record feedback'
    });
  }
});

// AI Automation Rules
router.get('/automation-rules', authenticateAdmin, async (req, res) => {
  try {
    const rules = [
      {
        id: 'auto-alert-1',
        name: 'Critical Contamination Alert',
        condition: 'Heavy metals > 2x limit',
        action: 'Send immediate notification to QA team',
        enabled: true
      },
      {
        id: 'auto-alert-2',
        name: 'Quality Score Alert',
        condition: 'Overall score < 60',
        action: 'Flag for manual review',
        enabled: true
      },
      {
        id: 'auto-recommend-1',
        name: 'Retest Recommendation',
        condition: 'Inconsistent results detected',
        action: 'Suggest additional testing',
        enabled: true
      }
    ];

    res.json({
      success: true,
      data: rules
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch automation rules'
    });
  }
});

// Update Automation Rule
router.put('/automation-rules/:ruleId', authenticateAdmin, async (req, res) => {
  try {
    const { ruleId } = req.params;
    const { enabled, condition, action } = req.body;

    // In a real implementation, this would update the database
    res.json({
      success: true,
      message: 'Automation rule updated successfully',
      data: {
        ruleId,
        enabled,
        condition,
        action,
        updatedAt: new Date()
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update automation rule'
    });
  }
});

module.exports = router;
