// MTF Detection Console - Shared Types
export interface MTFDetectionConsoleProps {
  onCaseSelect?: (caseId: string) => void;
}

export interface FlowingDot {
  id: string;
  stage: number;
  progress: number;
  speed: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

export interface ProcessingStageData {
  active: number;
  total: number;
  pending: number;
}

export interface ProcessingData {
  import: ProcessingStageData;
  analysis: ProcessingStageData;
  risk: ProcessingStageData;
  outreach: ProcessingStageData;
}

export interface SankeyData {
  gpReferrals: number;
  specialistReferrals: number;
  monitoring: number;
  discharged: number;
}

export interface ReportScanData {
  id: string;
  patientId: string;
  patientName?: string;
  age?: number;
  gender?: string;
  scanType: 'xray' | 'ct' | 'mri' | 'ultrasound';
  scanTime: Date;
  aiPriority: 'critical' | 'high' | 'medium' | 'low';
  riskScore: number;
  status: 'outreach_sent' | 'pending_review' | 'processing' | 'completed';
  isNew?: boolean;
  reportSummary?: string;
  fractureLocation?: string;
  injuryMechanism?: string;
  aiConfidence?: number;
  riskFactors?: string[];
  aiExplanation?: AIExplanation[];
  emailStatus?: 'pending' | 'sent' | 'failed' | 'not_required';
  emailContent?: EmailContent;
  emailSentTime?: Date;
}

export interface AIExplanation {
  type: 'positive' | 'negative';
  text: string;
}

export interface EmailContent {
  subject: string;
  body: string;
}

export interface MTFCase {
  id: string;
  patientId: string;
  patientName: string;
  age: number;
  gender: string;
  riskScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  mtfSuspected: boolean;
  confidence: number;
  reportType: string;
  createdAt: Date;
  status: 'pending' | 'reviewed' | 'contacted' | 'completed';
  urgency: number;
  specialistReferral: boolean;
}

export interface SystemStats {
  totalProcessed: number;
  mtfDetected: number;
  pendingReview: number;
  averageProcessingTime: number;
  averageConfidence: number;
  qualityScore: number;
}

export interface WorkflowStep {
  id: number;
  title: string;
  description: string;
  icon: any;
  status: 'pending' | 'in_progress' | 'completed' | 'disabled';
  color: string;
}

export interface KPIData {
  totalReportsScanned: number;
  suspectedMTFCases: number;
  outreachEmailsSent: number;
  pendingDoctorReview: number;
}

export interface BatchProcessingData {
  currentBatch: number;
  totalBatches: number;
  priorityDistribution: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  processingStats: {
    totalProcessed: number;
    successRate: number;
    averageProcessingTime: number;
    errors: number;
    queueSize: number;
  };
  batchHistory: BatchHistoryItem[];
  realTimeMetrics: {
    currentThroughput: number;
    peakThroughput: number;
    averageLatency: number;
    memoryUsage: number;
    cpuUsage: number;
  };
}

export interface BatchHistoryItem {
  batchId: string;
  startTime: string;
  endTime?: string;
  status: 'processing' | 'completed' | 'failed';
  processedCount: number;
  errorCount: number;
  duration?: number;
}

export interface RiskTrendData {
  date: string;
  critical: number;
  high: number;
  medium: number;
  low: number;
}
