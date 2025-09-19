export interface AssessmentData {
  // Step 1: Symptom Scoring
  painLocation: string[];
  painSeverity: number; // 0-10
  painStartDate: string;
  
  // Step 2: Functional Check
  painWhenWalking: boolean;
  painWhenClimbing: boolean;
  limpingOrImbalance: boolean;
  
  // Step 3: Risk Factors
  ageGroup: 'under-30' | '30-50' | '50-70' | 'over-70';
  osteoporosisHistory: boolean;
  previousFractures: boolean;
  smoking: boolean;
  lowCalciumIntake: boolean;
  highImpactActivity: boolean;
  
  // Step 4: Recent Event
  recentFall: boolean;
  recentJump: boolean;
  recentImpact: boolean;
  impactDescription?: string;
}

export interface AssessmentResult {
  riskLevel: 'low' | 'medium' | 'high';
  riskScore: number; // 0-100
  recommendations: string[];
  summary: string;
  nextSteps: string[];
}

export type AssessmentStep = 
  | 'landing'
  | 'symptoms'
  | 'functional'
  | 'risk-factors'
  | 'recent-event'
  | 'results';

export interface AssessmentState {
  currentStep: AssessmentStep;
  data: Partial<AssessmentData>;
  isCompleted: boolean;
}
