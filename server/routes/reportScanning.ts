import express from 'express';
import { reportScanningService } from '../services/reportScanningService';
import { patientOutreachService } from '../services/patientOutreachService';

const router = express.Router();

// 阶段1：AI自动扫描报告
router.post('/api/reports/scan', async (req, res) => {
  try {
    const { reportText, patientContext } = req.body;
    
    if (!reportText || !patientContext?.patientId) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: reportText and patientContext'
      });
    }
    
    // 扫描报告
    const scanResult = await reportScanningService.scanRadiologyReport(
      reportText,
      patientContext
    );
    
    // 生成风险评估
    const riskAssessment = await reportScanningService.generateRiskAssessment(
      scanResult,
      patientContext
    );
    
    res.json({
      success: true,
      data: {
        scanResult,
        riskAssessment,
        timestamp: new Date().toISOString()
      }
    });
    
  } catch (error) {
    console.error('Report scanning error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to scan radiology report',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// 阶段2：生成患者外联内容
router.post('/api/outreach/generate', async (req, res) => {
  try {
    const { patient, scanResult, riskAssessment } = req.body;
    
    if (!patient || !scanResult) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: patient and scanResult'
      });
    }
    
    // 生成个性化邮件
    const emailContent = await patientOutreachService.generatePersonalizedEmail(
      patient,
      scanResult,
      riskAssessment
    );
    
    // 生成自评表单
    const selfAssessmentForm = await patientOutreachService.generateSelfAssessmentForm(
      patient.id,
      scanResult
    );
    
    res.json({
      success: true,
      data: {
        emailContent,
        selfAssessmentForm,
        outreachType: 'email',
        priority: riskAssessment.priority,
        estimatedUrgency: riskAssessment.estimatedUrgency
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

// 获取报告扫描历史
router.get('/api/reports/:patientId/scan-history', async (req, res) => {
  try {
    const { patientId } = req.params;
    
    // 这里应该从数据库获取扫描历史
    // 暂时返回模拟数据
    res.json({
      success: true,
      data: {
        patientId,
        scanHistory: [],
        totalScans: 0
      }
    });
    
  } catch (error) {
    console.error('Get scan history error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get scan history'
    });
  }
});

export default router;
