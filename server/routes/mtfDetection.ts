import express from 'express';
import { enhancedReportScanningService } from '../services/enhancedReportScanningService';
import { riskAssessmentService } from '../services/riskAssessmentService';
import { intelligentOutreachService } from '../services/intelligentOutreachService';
import { z } from 'zod';

const router = express.Router();

// 输入验证 Schema
const reportScanSchema = z.object({
  reportText: z.string().min(10, 'Report text must be at least 10 characters'),
  reportType: z.enum(['xray', 'mri', 'ct', 'discharge_summary', 'gp_notes']),
  patientContext: z.object({
    patientId: z.string(),
    age: z.number().min(0).max(150),
    gender: z.enum(['male', 'female', 'other']),
    medicalHistory: z.string().optional()
  }),
  metadata: z.object({
    facility: z.string().optional(),
    orderingPhysician: z.string().optional(),
    reportDate: z.string()
  })
});

const riskAssessmentSchema = z.object({
  scanResult: z.object({
    patientId: z.string(),
    riskScore: z.number().min(0).max(100),
    riskLevel: z.enum(['low', 'medium', 'high', 'critical']),
    keyFindings: z.object({
      fractures: z.array(z.object({
        location: z.string(),
        type: z.string(),
        severity: z.enum(['mild', 'moderate', 'severe']),
        mechanism: z.string(),
        isMinimalTrauma: z.boolean()
      })),
      riskFactors: z.array(z.string()),
      recommendations: z.array(z.string()),
      followUpRequired: z.boolean()
    }),
    mtfSuspected: z.boolean(),
    confidence: z.number().min(0).max(100),
    processingTime: z.number()
  }),
  patientContext: z.object({
    age: z.number().min(0).max(150),
    gender: z.string(),
    medicalHistory: z.string().optional(),
    previousFractures: z.number().optional(),
    medications: z.array(z.string()).optional(),
    familyHistory: z.array(z.string()).optional(),
    lifestyle: z.object({
      smoking: z.boolean(),
      alcohol: z.boolean(),
      exercise: z.boolean(),
      calciumIntake: z.boolean()
    }).optional()
  })
});

const outreachGenerationSchema = z.object({
  patient: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string().email(),
    phone: z.string().optional(),
    address: z.string().optional(),
    age: z.number().min(0).max(150),
    gender: z.string(),
    preferredLanguage: z.string().optional(),
    communicationPreferences: z.array(z.string()).optional(),
    educationLevel: z.enum(['basic', 'intermediate', 'advanced']).optional()
  }),
  scanResult: z.any(), // 使用上面的scanResult schema
  riskAssessment: z.any() // 使用风险评估结果
});

/**
 * 阶段1：AI自动扫描报告
 * POST /api/mtf/scan-report
 */
router.post('/scan-report', async (req, res) => {
  try {
    console.log('MTF report scanning request received');
    
    // 验证请求数据
    const validationResult = reportScanSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request data',
        details: validationResult.error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
      });
    }
    
    const reportData = validationResult.data;
    
    // 执行AI扫描
    const scanResult = await enhancedReportScanningService.scanRadiologyReport(reportData);
    
    // 质量检查
    const qualityCheck = await enhancedReportScanningService.qualityCheck(scanResult);
    
    // 记录扫描结果到数据库（这里应该添加数据库操作）
    console.log('Scan completed for patient:', reportData.patientContext.patientId);
    
    res.json({
      success: true,
      data: {
        scanResult,
        qualityCheck,
        timestamp: new Date().toISOString(),
        processedBy: 'enhanced_report_scanner'
      }
    });
    
  } catch (error) {
    console.error('Report scanning error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to scan radiology report',
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
});

/**
 * 阶段2：风险评估生成
 * POST /api/mtf/risk-assessment
 */
router.post('/risk-assessment', async (req, res) => {
  try {
    console.log('Risk assessment request received');
    
    // 验证请求数据
    const validationResult = riskAssessmentSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request data',
        details: validationResult.error.errors
      });
    }
    
    const { scanResult, patientContext } = validationResult.data;
    
    // 生成风险评估
    const riskAssessment = await riskAssessmentService.generateRiskAssessment(
      scanResult,
      patientContext
    );
    
    // 生成评估摘要
    const assessmentSummary = riskAssessmentService.generateAssessmentSummary(
      riskAssessment,
      scanResult
    );
    
    res.json({
      success: true,
      data: {
        riskAssessment,
        assessmentSummary,
        adjustedRiskScore: scanResult.riskScore,
        timestamp: new Date().toISOString()
      }
    });
    
  } catch (error) {
    console.error('Risk assessment error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate risk assessment',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * 阶段3：自动外联生成
 * POST /api/mtf/generate-outreach
 */
router.post('/generate-outreach', async (req, res) => {
  try {
    console.log('Outreach generation request received');
    
    // 验证请求数据
    const validationResult = outreachGenerationSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request data',
        details: validationResult.error.errors
      });
    }
    
    const { patient, scanResult, riskAssessment } = validationResult.data;
    
    // 生成个性化外联内容
    const outreachGeneration = await intelligentOutreachService.generatePersonalizedOutreach(
      patient,
      scanResult,
      riskAssessment
    );
    
    res.json({
      success: true,
      data: {
        outreachGeneration,
        patient: {
          id: patient.id,
          name: patient.name,
          preferredChannels: patient.communicationPreferences || ['email']
        },
        priority: riskAssessment.priority,
        urgency: riskAssessment.urgency,
        timestamp: new Date().toISOString()
      }
    });
    
  } catch (error) {
    console.error('Outreach generation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate patient outreach',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * 完整工作流程：从报告扫描到外联生成
 * POST /api/mtf/complete-workflow
 */
router.post('/complete-workflow', async (req, res) => {
  try {
    console.log('Complete MTF workflow request received');
    
    const { reportData, patientContext, patient } = req.body;
    
    if (!reportData || !patientContext || !patient) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: reportData, patientContext, and patient'
      });
    }
    
    // 步骤1：AI扫描报告
    console.log('Step 1: Scanning report...');
    const scanResult = await enhancedReportScanningService.scanRadiologyReport({
      ...reportData,
      patientContext
    });
    
    // 步骤2：风险评估
    console.log('Step 2: Generating risk assessment...');
    const riskAssessment = await riskAssessmentService.generateRiskAssessment(
      scanResult,
      patientContext
    );
    
    // 步骤3：生成外联内容
    console.log('Step 3: Generating outreach content...');
    const outreachGeneration = await intelligentOutreachService.generatePersonalizedOutreach(
      patient,
      scanResult,
      riskAssessment
    );
    
    // 步骤4：质量检查
    const qualityCheck = await enhancedReportScanningService.qualityCheck(scanResult);
    
    // 生成工作流程摘要
    const workflowSummary = {
      patientId: patient.id,
      patientName: patient.name,
      mtfSuspected: scanResult.mtfSuspected,
      riskLevel: scanResult.riskLevel,
      priority: riskAssessment.priority,
      urgency: riskAssessment.urgency,
      specialistReferral: riskAssessment.specialistReferral,
      estimatedCost: riskAssessment.estimatedCost,
      processingTime: scanResult.processingTime,
      qualityScore: qualityCheck.qualityScore,
      nextSteps: [
        'Review AI analysis results',
        'Validate clinical findings',
        riskAssessment.specialistReferral ? 'Schedule specialist consultation' : 'Schedule follow-up',
        'Send patient outreach communication',
        'Monitor patient response'
      ]
    };
    
    res.json({
      success: true,
      data: {
        scanResult,
        riskAssessment,
        outreachGeneration,
        qualityCheck,
        workflowSummary,
        timestamp: new Date().toISOString(),
        processingTimeMs: scanResult.processingTime
      }
    });
    
  } catch (error) {
    console.error('Complete workflow error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to complete MTF workflow',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * 批量处理报告
 * POST /api/mtf/batch-scan
 */
router.post('/batch-scan', async (req, res) => {
  try {
    console.log('Batch scan request received');
    
    const { reports } = req.body;
    
    if (!Array.isArray(reports) || reports.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Reports array is required and must not be empty'
      });
    }
    
    if (reports.length > 10) {
      return res.status(400).json({
        success: false,
        error: 'Maximum 10 reports per batch request'
      });
    }
    
    // 批量扫描报告
    const scanResults = await enhancedReportScanningService.batchScanReports(reports);
    
    // 生成统计报告
    const statistics = await enhancedReportScanningService.generateScanStatistics(scanResults);
    
    res.json({
      success: true,
      data: {
        scanResults,
        statistics,
        batchSize: reports.length,
        timestamp: new Date().toISOString()
      }
    });
    
  } catch (error) {
    console.error('Batch scan error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process batch scan',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * 获取患者的扫描历史
 * GET /api/mtf/patient/:patientId/scan-history
 */
router.get('/patient/:patientId/scan-history', async (req, res) => {
  try {
    const { patientId } = req.params;
    const { limit = 10, offset = 0 } = req.query;
    
    // 这里应该从数据库获取患者的扫描历史
    // 现在返回模拟数据
    const mockHistory = {
      patientId,
      totalScans: 3,
      scans: [
        {
          id: 'scan_001',
          reportType: 'xray',
          scanDate: '2024-01-15T10:30:00Z',
          riskScore: 75,
          riskLevel: 'high',
          mtfSuspected: true,
          status: 'completed'
        },
        {
          id: 'scan_002',
          reportType: 'mri',
          scanDate: '2024-01-10T14:15:00Z',
          riskScore: 45,
          riskLevel: 'medium',
          mtfSuspected: false,
          status: 'completed'
        }
      ],
      riskTrend: 'increasing',
      lastScan: '2024-01-15T10:30:00Z'
    };
    
    res.json({
      success: true,
      data: mockHistory
    });
    
  } catch (error) {
    console.error('Get scan history error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get scan history'
    });
  }
});

/**
 * 获取系统统计信息
 * GET /api/mtf/statistics
 */
router.get('/statistics', async (req, res) => {
  try {
    const { timeframe = '7d' } = req.query;
    
    // 这里应该从数据库获取真实统计数据
    // 现在返回模拟数据
    const mockStatistics = {
      timeframe,
      totalReportsProcessed: 150,
      mtfCasesDetected: 23,
      riskDistribution: {
        low: 45,
        medium: 67,
        high: 28,
        critical: 10
      },
      averageProcessingTime: 2.3, // seconds
      averageConfidence: 89.2,
      qualityMetrics: {
        averageQualityScore: 94.5,
        lowConfidenceCases: 8,
        manualReviewRequired: 5
      },
      outreachMetrics: {
        emailsSent: 150,
        smssSent: 45,
        phoneCallsMade: 23,
        assessmentsCompleted: 89,
        responseRate: 0.73
      },
      systemPerformance: {
        uptime: 99.8,
        apiLatency: 145, // ms
        errorRate: 0.2
      }
    };
    
    res.json({
      success: true,
      data: mockStatistics,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Get statistics error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get statistics'
    });
  }
});

/**
 * 健康检查端点
 * GET /api/mtf/health
 */
router.get('/health', async (req, res) => {
  try {
    const healthStatus = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        reportScanning: 'operational',
        riskAssessment: 'operational',
        outreachGeneration: 'operational',
        database: 'operational',
        aiService: process.env.OPENAI_API_KEY ? 'operational' : 'degraded'
      },
      version: '1.0.0',
      uptime: process.uptime()
    };
    
    res.json(healthStatus);
    
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({
      status: 'unhealthy',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
});

export default router;
