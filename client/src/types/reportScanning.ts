// AI Report Scanning Types

export interface RadiologyReport {
  id: string;
  patientId: string;
  caseId?: string;
  reportType: 'xray' | 'mri' | 'ct' | 'discharge_summary' | 'gp_notes';
  originalText: string;
  reportDate: Date;
  facility?: string;
  orderingPhysician?: string;
  status: 'pending' | 'processing' | 'analyzed' | 'error';
  createdAt: Date;
}

export interface KeyFindings {
  fractures: {
    location: string;
    type: string;
    severity: 'mild' | 'moderate' | 'severe';
    mechanism: string;
    isMinimalTrauma: boolean;
  }[];
  riskFactors: string[];
  recommendations: string[];
  followUpRequired: boolean;
}

export interface FractureAnalysis {
  fractureType: 'vertebral' | 'hip' | 'wrist' | 'other';
  isMinimalTrauma: boolean;
  fallHeight: 'standing' | 'low' | 'moderate' | 'high';
  mechanism: string;
  osteoporosisRisk: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
}

export interface ReportAnalysis {
  id: string;
  reportId: string;
  agentType: 'report_scanner' | 'mtf_detector' | 'risk_assessor';
  riskScore: number; // 0-100
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  keyFindings: KeyFindings;
  fractureAnalysis?: FractureAnalysis;
  mtfSuspected: boolean;
  confidence: number; // 0-100
  processingTime: number; // milliseconds
  recommendations: string[];
  createdAt: Date;
}

export interface ReportScanResult {
  patientId: string;
  riskScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  keyFindings: KeyFindings;
  mtfSuspected: boolean;
  confidence: number;
  processingTime: number;
}

// AI Agent Configuration for Report Scanning
export interface ReportScannerConfig {
  name: string;
  role: string;
  specialty: string;
  medicalCriteria: {
    mtfKeywords: string[];
    riskFactorKeywords: string[];
    fractureTypes: string[];
    severityIndicators: string[];
  };
  confidenceThresholds: {
    low: number;
    medium: number;
    high: number;
    critical: number;
  };
}

export const REPORT_SCANNER_CONFIG: ReportScannerConfig = {
  name: "Report Scanner AI",
  role: "Radiology Report Analysis and MTF Detection",
  specialty: "Medical Report NLP and Risk Assessment",
  medicalCriteria: {
    mtfKeywords: [
      'fall from standing height',
      'low energy trauma',
      'minimal trauma',
      'fragility fracture',
      'osteoporotic fracture',
      'insufficiency fracture'
    ],
    riskFactorKeywords: [
      'osteoporosis',
      'bone density',
      'previous fracture',
      'family history',
      'smoking',
      'corticosteroid',
      'age >70',
      'postmenopausal'
    ],
    fractureTypes: [
      'vertebral compression',
      'hip fracture',
      'wrist fracture',
      'humerus fracture',
      'rib fracture'
    ],
    severityIndicators: [
      'severe',
      'significant',
      'marked',
      'extensive',
      'displaced',
      'comminuted'
    ]
  },
  confidenceThresholds: {
    low: 30,
    medium: 50,
    high: 70,
    critical: 85
  }
};
