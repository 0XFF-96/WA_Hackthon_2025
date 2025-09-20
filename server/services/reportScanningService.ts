import OpenAI from "openai";
import { ReportScanResult, KeyFindings, FractureAnalysis } from "@shared/types/reportScanning";

const openai = process.env.OPENAI_API_KEY 
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

export class ReportScanningService {
  
  async scanRadiologyReport(
    reportText: string, 
    patientContext: {
      patientId: string;
      age: number;
      gender: string;
      medicalHistory?: string;
    }
  ): Promise<ReportScanResult> {
    
    if (!openai) {
      // Fallback mock response for development
      return this.getMockScanResult(patientContext.patientId);
    }

    try {
      const startTime = Date.now();
      
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are a specialized AI medical report scanner for minimal trauma fracture (MTF) detection and osteoporosis risk assessment.

Your task:
1. Extract ALL fracture information from the radiology report
2. Classify each fracture as MTF (minimal trauma) or non-MTF
3. Assess osteoporosis risk based on fracture patterns and patient context
4. Filter out non-relevant fractures (trauma, cancer, hand/foot)

MTF Criteria:
- Fall from standing height or lower
- Low-energy mechanism
- Age >50 years with risk factors
- Osteoporosis-related fracture patterns

Respond in JSON format with detailed analysis.`
          },
          {
            role: "user",
            content: `Analyze this radiology report for MTF detection:

REPORT TEXT:
${reportText}

PATIENT CONTEXT:
- Patient ID: ${patientContext.patientId}
- Age: ${patientContext.age}
- Gender: ${patientContext.gender}
- Medical History: ${patientContext.medicalHistory || 'Not provided'}

Please provide:
1. Risk score (0-100)
2. Risk level (low/medium/high/critical)
3. Key findings including all fractures
4. MTF suspicion (true/false)
5. Confidence level (0-100)
6. Processing recommendations`
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.1 // Low temperature for medical accuracy
      });

      const analysis = JSON.parse(response.choices[0].message.content || '{}');
      const processingTime = Date.now() - startTime;

      return {
        patientId: patientContext.patientId,
        riskScore: analysis.riskScore || 0,
        riskLevel: analysis.riskLevel || 'low',
        keyFindings: analysis.keyFindings || { fractures: [], riskFactors: [], recommendations: [], followUpRequired: false },
        mtfSuspected: analysis.mtfSuspected || false,
        confidence: analysis.confidence || 0,
        processingTime
      };

    } catch (error) {
      console.error('Report Scanning Error:', error);
      throw new Error(`Failed to scan radiology report: ${error.message}`);
    }
  }

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
        riskFactors: ['age >70', 'previous fracture', 'osteoporosis'],
        recommendations: ['DEXA scan', 'specialist referral', 'fall prevention assessment'],
        followUpRequired: true
      },
      mtfSuspected: true,
      confidence: 87,
      processingTime: 1200
    };
  }

  async generateRiskAssessment(
    scanResult: ReportScanResult,
    patientContext: any
  ): Promise<{
    priority: 'low' | 'medium' | 'high' | 'critical';
    recommendations: string[];
    followUpRequired: boolean;
    estimatedUrgency: number; // hours
  }> {
    
    const { riskScore, mtfSuspected, keyFindings } = scanResult;
    
    let priority: 'low' | 'medium' | 'high' | 'critical' = 'low';
    let estimatedUrgency = 72; // default 3 days
    
    if (riskScore >= 85 || mtfSuspected) {
      priority = 'critical';
      estimatedUrgency = 4; // 4 hours
    } else if (riskScore >= 70) {
      priority = 'high';
      estimatedUrgency = 24; // 24 hours
    } else if (riskScore >= 50) {
      priority = 'medium';
      estimatedUrgency = 48; // 48 hours
    }
    
    const recommendations = [
      ...keyFindings.recommendations,
      ...(mtfSuspected ? ['Immediate specialist review', 'Osteoporosis assessment'] : []),
      ...(riskScore >= 70 ? ['Urgent follow-up required'] : [])
    ];
    
    return {
      priority,
      recommendations,
      followUpRequired: keyFindings.followUpRequired || mtfSuspected,
      estimatedUrgency
    };
  }
}

export const reportScanningService = new ReportScanningService();
