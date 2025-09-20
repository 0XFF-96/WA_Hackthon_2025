import OpenAI from "openai";
import { ReportScanResult, KeyFindings, FractureAnalysis } from "../../client/src/types/reportScanning";

const openai = process.env.OPENAI_API_KEY 
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

export class EnhancedReportScanningService {
  
  /**
   * 扫描放射学报告，检测潜在的微创骨折
   */
  async scanRadiologyReport(
    reportData: {
      reportText: string;
      reportType: string;
      patientContext: {
        patientId: string;
        age: number;
        gender: string;
        medicalHistory?: string;
      };
      metadata: {
        facility?: string;
        orderingPhysician?: string;
        reportDate: string;
      };
    }
  ): Promise<ReportScanResult> {
    
    if (!openai) {
      console.log('OpenAI API key not available, using mock data');
      return this.getMockScanResult(reportData.patientContext.patientId);
    }

    try {
      const startTime = Date.now();
      
      // 根据报告类型调整AI提示
      const systemPrompt = this.getSystemPrompt(reportData.reportType);
      const analysisPrompt = this.getAnalysisPrompt(reportData);
      
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user",
            content: analysisPrompt
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.1, // 低温度确保医疗准确性
        max_tokens: 2000
      });

      const analysis = JSON.parse(response.choices[0].message.content || '{}');
      const processingTime = Date.now() - startTime;

      // 验证和清理AI响应
      const validatedAnalysis = this.validateAnalysis(analysis);
      
      return {
        patientId: reportData.patientContext.patientId,
        riskScore: validatedAnalysis.riskScore || 0,
        riskLevel: validatedAnalysis.riskLevel || 'low',
        keyFindings: validatedAnalysis.keyFindings || { 
          fractures: [], 
          riskFactors: [], 
          recommendations: [], 
          followUpRequired: false 
        },
        mtfSuspected: validatedAnalysis.mtfSuspected || false,
        confidence: validatedAnalysis.confidence || 0,
        processingTime
      };

    } catch (error) {
      console.error('Enhanced report scanning error:', error);
      throw new Error(`Failed to scan radiology report: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * 根据报告类型生成系统提示
   */
  private getSystemPrompt(reportType: string): string {
    const basePrompt = `You are a specialized AI medical report scanner for minimal trauma fracture (MTF) detection and osteoporosis risk assessment.

Your expertise includes:
- Radiology report interpretation
- Fracture pattern recognition
- Osteoporosis risk assessment
- Clinical decision support

Your task:
1. Extract ALL fracture information from the report
2. Classify each fracture as MTF (minimal trauma) or non-MTF
3. Assess osteoporosis risk based on fracture patterns and patient context
4. Filter out non-relevant fractures (high-energy trauma, pathological fractures, hand/foot injuries)
5. Provide evidence-based clinical recommendations

MTF Criteria:
- Fall from standing height or lower (≤1 meter)
- Low-energy mechanism of injury
- Age >50 years with additional risk factors
- Fragility/osteoporotic fracture patterns
- Common locations: vertebrae, hip, wrist, humerus, ribs

Risk Factors to Consider:
- Advanced age (>70 years)
- Female gender, especially post-menopausal
- Previous fracture history
- Family history of osteoporosis
- Smoking, alcohol use
- Corticosteroid medication
- Low bone density/osteoporosis diagnosis
- Certain medical conditions (hyperparathyroidism, rheumatoid arthritis)

Respond in JSON format with detailed analysis.`;

    // 根据报告类型添加特定指导
    switch (reportType) {
      case 'xray':
        return basePrompt + '\n\nFocus on: bone density, fracture lines, cortical thinning, trabecular pattern changes, alignment abnormalities.';
      case 'mri':
        return basePrompt + '\n\nFocus on: bone marrow edema, soft tissue involvement, detailed fracture characterization, occult fractures.';
      case 'ct':
        return basePrompt + '\n\nFocus on: 3D fracture patterns, bone density measurements (Hounsfield units), cortical disruption, trabecular microarchitecture.';
      case 'discharge_summary':
        return basePrompt + '\n\nFocus on: mechanism of injury, clinical history, treatments provided, discharge recommendations, follow-up plans.';
      case 'gp_notes':
        return basePrompt + '\n\nFocus on: patient symptoms, clinical examination findings, pain patterns, functional limitations, referral decisions.';
      default:
        return basePrompt;
    }
  }

  /**
   * 生成分析提示
   */
  private getAnalysisPrompt(reportData: any): string {
    return `Analyze this ${reportData.reportType} report for MTF detection:

REPORT TEXT:
${reportData.reportText}

PATIENT CONTEXT:
- Patient ID: ${reportData.patientContext.patientId}
- Age: ${reportData.patientContext.age}
- Gender: ${reportData.patientContext.gender}
- Medical History: ${reportData.patientContext.medicalHistory || 'Not provided'}

METADATA:
- Facility: ${reportData.metadata.facility || 'Not specified'}
- Ordering Physician: ${reportData.metadata.orderingPhysician || 'Not specified'}
- Report Date: ${reportData.metadata.reportDate}

Please provide a comprehensive analysis in JSON format with:

{
  "riskScore": number (0-100),
  "riskLevel": "low|medium|high|critical",
  "mtfSuspected": boolean,
  "confidence": number (0-100),
  "keyFindings": {
    "fractures": [
      {
        "location": "specific anatomical location",
        "type": "fracture type/pattern",
        "severity": "mild|moderate|severe",
        "mechanism": "injury mechanism description",
        "isMinimalTrauma": boolean
      }
    ],
    "riskFactors": ["list of identified risk factors"],
    "recommendations": ["list of clinical recommendations"],
    "followUpRequired": boolean
  },
  "reasoning": "detailed explanation of the analysis and decision-making process"
}`;
  }

  /**
   * 验证AI分析结果
   */
  private validateAnalysis(analysis: any): any {
    // 验证风险评分
    if (typeof analysis.riskScore !== 'number' || analysis.riskScore < 0 || analysis.riskScore > 100) {
      analysis.riskScore = 0;
    }

    // 验证风险等级
    const validRiskLevels = ['low', 'medium', 'high', 'critical'];
    if (!validRiskLevels.includes(analysis.riskLevel)) {
      analysis.riskLevel = 'low';
    }

    // 验证置信度
    if (typeof analysis.confidence !== 'number' || analysis.confidence < 0 || analysis.confidence > 100) {
      analysis.confidence = 0;
    }

    // 验证MTF疑似状态
    if (typeof analysis.mtfSuspected !== 'boolean') {
      analysis.mtfSuspected = false;
    }

    // 验证关键发现
    if (!analysis.keyFindings || typeof analysis.keyFindings !== 'object') {
      analysis.keyFindings = { 
        fractures: [], 
        riskFactors: [], 
        recommendations: [], 
        followUpRequired: false 
      };
    }

    // 确保骨折数组存在且格式正确
    if (!Array.isArray(analysis.keyFindings.fractures)) {
      analysis.keyFindings.fractures = [];
    }

    // 验证每个骨折的必需字段
    analysis.keyFindings.fractures = analysis.keyFindings.fractures.map((fracture: any) => ({
      location: fracture.location || 'Unknown',
      type: fracture.type || 'Unspecified fracture',
      severity: ['mild', 'moderate', 'severe'].includes(fracture.severity) ? fracture.severity : 'moderate',
      mechanism: fracture.mechanism || 'Unknown mechanism',
      isMinimalTrauma: typeof fracture.isMinimalTrauma === 'boolean' ? fracture.isMinimalTrauma : false
    }));

    return analysis;
  }

  /**
   * 生成模拟扫描结果（开发用）
   */
  private getMockScanResult(patientId: string): ReportScanResult {
    return {
      patientId,
      riskScore: 75,
      riskLevel: 'high',
      keyFindings: {
        fractures: [
          {
            location: 'L1 vertebral body',
            type: 'compression fracture',
            severity: 'moderate',
            mechanism: 'fall from standing height',
            isMinimalTrauma: true
          }
        ],
        riskFactors: ['age >70', 'previous fracture', 'postmenopausal', 'low bone density'],
        recommendations: [
          'DEXA scan for bone density assessment',
          'Orthopedic specialist referral',
          'Fall prevention assessment',
          'Calcium and vitamin D supplementation evaluation'
        ],
        followUpRequired: true
      },
      mtfSuspected: true,
      confidence: 87,
      processingTime: 1200
    };
  }

  /**
   * 批量扫描多个报告
   */
  async batchScanReports(reports: any[]): Promise<ReportScanResult[]> {
    const results: ReportScanResult[] = [];
    
    // 并发处理多个报告（限制并发数量以避免API限制）
    const batchSize = 3;
    for (let i = 0; i < reports.length; i += batchSize) {
      const batch = reports.slice(i, i + batchSize);
      const batchPromises = batch.map(async (report) => {
        try {
          return await this.scanRadiologyReport(report);
        } catch (error) {
          console.error(`Failed to scan report for patient ${report.patientContext.patientId}:`, error);
          return {
            patientId: report.patientContext.patientId,
            riskScore: 0,
            riskLevel: 'low' as const,
            keyFindings: { fractures: [], riskFactors: [], recommendations: [], followUpRequired: false },
            mtfSuspected: false,
            confidence: 0,
            processingTime: 0
          };
        }
      });
      
      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);
    }
    
    return results;
  }

  /**
   * 质量检查AI分析结果
   */
  async qualityCheck(scanResult: ReportScanResult): Promise<{
    qualityScore: number;
    issues: string[];
    recommendations: string[];
  }> {
    const issues: string[] = [];
    const recommendations: string[] = [];
    let qualityScore = 100;

    // 检查置信度
    if (scanResult.confidence < 70) {
      issues.push('Low confidence score (<70%)');
      recommendations.push('Consider manual radiologist review');
      qualityScore -= 20;
    }

    // 检查风险评分与MTF疑似的一致性
    if (scanResult.mtfSuspected && scanResult.riskScore < 50) {
      issues.push('Inconsistent MTF suspicion with low risk score');
      recommendations.push('Review AI analysis logic and patient context');
      qualityScore -= 15;
    }

    // 检查关键发现的完整性
    if (scanResult.keyFindings.fractures.length === 0 && scanResult.mtfSuspected) {
      issues.push('MTF suspected but no fractures identified');
      recommendations.push('Verify fracture detection algorithm');
      qualityScore -= 25;
    }

    // 检查推荐措施的适当性
    if (scanResult.riskLevel === 'high' && scanResult.keyFindings.recommendations.length < 2) {
      issues.push('High risk case with insufficient recommendations');
      recommendations.push('Enhance recommendation generation logic');
      qualityScore -= 10;
    }

    // 检查处理时间
    if (scanResult.processingTime > 5000) {
      issues.push('Slow processing time (>5 seconds)');
      recommendations.push('Optimize AI processing pipeline');
      qualityScore -= 5;
    }

    return {
      qualityScore: Math.max(0, qualityScore),
      issues,
      recommendations
    };
  }

  /**
   * 生成扫描统计报告
   */
  async generateScanStatistics(scanResults: ReportScanResult[]): Promise<{
    totalScanned: number;
    mtfCases: number;
    riskDistribution: Record<string, number>;
    averageConfidence: number;
    averageProcessingTime: number;
    qualityMetrics: any;
  }> {
    const totalScanned = scanResults.length;
    const mtfCases = scanResults.filter(r => r.mtfSuspected).length;
    
    const riskDistribution = scanResults.reduce((acc, result) => {
      acc[result.riskLevel] = (acc[result.riskLevel] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const averageConfidence = scanResults.reduce((sum, r) => sum + r.confidence, 0) / totalScanned;
    const averageProcessingTime = scanResults.reduce((sum, r) => sum + r.processingTime, 0) / totalScanned;

    // 计算质量指标
    const qualityChecks = await Promise.all(scanResults.map(r => this.qualityCheck(r)));
    const averageQualityScore = qualityChecks.reduce((sum, q) => sum + q.qualityScore, 0) / qualityChecks.length;

    return {
      totalScanned,
      mtfCases,
      riskDistribution,
      averageConfidence: Math.round(averageConfidence * 100) / 100,
      averageProcessingTime: Math.round(averageProcessingTime),
      qualityMetrics: {
        averageQualityScore: Math.round(averageQualityScore * 100) / 100,
        issuesCount: qualityChecks.reduce((sum, q) => sum + q.issues.length, 0),
        lowConfidenceCases: scanResults.filter(r => r.confidence < 70).length
      }
    };
  }
}

export const enhancedReportScanningService = new EnhancedReportScanningService();
