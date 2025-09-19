// Enhanced Agent Chat Types with Rubric Evaluation System

export interface Message {
  id: string;
  type: 'user' | 'agent';
  agentType?: 'diagnostician' | 'radiologist' | 'treatment_planner' | 'orchestrator' | 'rubric_evaluator';
  agentName?: string;
  content: string;
  timestamp: Date;
  confidence?: number;
}

export interface RubricEvaluation {
  id: string;
  messageId: string;
  agentType: string;
  scores: {
    diagnosticAccuracy: number; // 1-5 stars
    consultationLogic: number; // 1-5 stars  
    treatmentPlan: number; // 1-5 stars
    empathySkills: number; // 1-5 stars
    ethicsCompliance: 'compliant' | 'warning' | 'risk'; // ✅ ⚠️ ❌
  };
  totalScore: number; // 0-100
  feedback: {
    strengths: string[];
    improvements: string[];
    recommendations: string[];
  };
  timestamp: Date;
}

export interface EnhancedMessage extends Message {
  evaluation?: RubricEvaluation;
  isEvaluated: boolean;
}

export interface AgentPerformance {
  agentType: string;
  averageScore: number;
  totalInteractions: number;
  improvementTrend: 'improving' | 'stable' | 'declining';
  lastUpdated: Date;
}

export interface MultiAgentChatProps {
  caseId?: string;
  patientName?: string;
}

// Clinical Rubric Criteria
export interface RubricCriteria {
  diagnosticAccuracy: {
    weight: number;
    description: string;
    criteria: string[];
  };
  consultationLogic: {
    weight: number;
    description: string;
    criteria: string[];
  };
  treatmentPlan: {
    weight: number;
    description: string;
    criteria: string[];
  };
  empathySkills: {
    weight: number;
    description: string;
    criteria: string[];
  };
  ethicsCompliance: {
    weight: number;
    description: string;
    criteria: string[];
  };
}

// Pre-defined Clinical Rubric for Micro-fracture Cases
export const MICRO_FRACTURE_RUBRIC: RubricCriteria = {
  diagnosticAccuracy: {
    weight: 0.3,
    description: "Accuracy in identifying micro-fracture patterns and risk factors",
    criteria: [
      "Correctly identifies key symptoms (pain location, severity, onset)",
      "Considers appropriate differential diagnoses",
      "Assesses risk factors (age, osteoporosis, activity level)",
      "Follows evidence-based diagnostic criteria"
    ]
  },
  consultationLogic: {
    weight: 0.25,
    description: "Logical flow of questions and clinical reasoning",
    criteria: [
      "Asks relevant follow-up questions",
      "Builds on previous information logically",
      "Considers patient's specific context",
      "Demonstrates systematic approach"
    ]
  },
  treatmentPlan: {
    weight: 0.25,
    description: "Comprehensive and practical treatment recommendations",
    criteria: [
      "Provides evidence-based treatment options",
      "Considers patient's lifestyle and preferences",
      "Includes appropriate follow-up schedule",
      "Addresses pain management and recovery"
    ]
  },
  empathySkills: {
    weight: 0.1,
    description: "Patient-centered communication and emotional support",
    criteria: [
      "Uses clear, understandable language",
      "Shows concern for patient's well-being",
      "Addresses patient's concerns and fears",
      "Provides reassurance and support"
    ]
  },
  ethicsCompliance: {
    weight: 0.1,
    description: "Adherence to medical ethics and safety standards",
    criteria: [
      "Maintains patient confidentiality",
      "Provides appropriate disclaimers",
      "Avoids giving dangerous advice",
      "Recommends professional medical consultation"
    ]
  }
};

// Agent Configuration with Enhanced Roles
export interface AgentConfig {
  name: string;
  icon: any;
  color: string;
  role: string;
  specialty: string;
  evaluationWeight: number;
}

export const ENHANCED_AGENT_CONFIG: Record<string, AgentConfig> = {
  orchestrator: {
    name: "HealthAI Orchestrator",
    icon: "Bot",
    color: "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400",
    role: "Coordinates multi-agent analysis",
    specialty: "Workflow Management",
    evaluationWeight: 0.1
  },
  diagnostician: {
    name: "Dr. Neural",
    icon: "Brain",
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
    role: "Primary diagnostic analysis",
    specialty: "Clinical Diagnosis",
    evaluationWeight: 0.3
  },
  radiologist: {
    name: "RadiologyAI",
    icon: "FileText",
    color: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
    role: "Medical imaging specialist",
    specialty: "Imaging Analysis",
    evaluationWeight: 0.25
  },
  treatment_planner: {
    name: "TreatmentBot",
    icon: "Stethoscope",
    color: "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400",
    role: "Treatment planning and recommendations",
    specialty: "Care Planning",
    evaluationWeight: 0.25
  },
  rubric_evaluator: {
    name: "Clinical Rubric Evaluator",
    icon: "BarChart3",
    color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
    role: "Evaluates clinical performance and provides feedback",
    specialty: "Quality Assurance",
    evaluationWeight: 0.1
  }
};

// 扩展的Agent状态接口
export interface ExtendedAgentStatus {
  id: string;
  name: string;
  type: string;
  status: 'idle' | 'busy' | 'error' | 'maintenance';
  currentTask?: string;
  lastActivity: Date;
  performance: {
    totalTasks: number;
    successRate: number;
    averageResponseTime: number;
    confidence: number;
    rubricScore: number;
    improvementTrend: 'improving' | 'stable' | 'declining';
  };
  health: {
    cpu: number;
    memory: number;
    uptime: number;
  };
  recentEvaluations: {
    diagnosticAccuracy: number;
    consultationLogic: number;
    treatmentPlan: number;
    empathySkills: number;
    ethicsCompliance: 'compliant' | 'warning' | 'risk';
    timestamp: Date;
  }[];
}

// 系统概览统计
export interface SystemOverview {
  totalAgents: number;
  healthyAgents: number;
  improvingAgents: number;
  averageScore: number;
  totalTasks: number;
  systemUptime: number;
}
