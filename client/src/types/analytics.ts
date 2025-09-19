// Analytics types for system performance and diagnostic analytics

export interface SystemPerformanceMetrics {
  // Response Time Metrics
  responseTime: {
    average: number; // seconds
    p50: number; // median
    p95: number; // 95th percentile
    p99: number; // 99th percentile
    trend: 'improving' | 'stable' | 'declining';
  };
  
  // Throughput Metrics
  throughput: {
    casesPerHour: number;
    concurrentUsers: number;
    peakLoad: number;
    capacityUtilization: number; // percentage
  };
  
  // Resource Usage
  resourceUsage: {
    cpu: {
      average: number;
      peak: number;
      current: number;
    };
    memory: {
      average: number;
      peak: number;
      current: number;
    };
    storage: {
      used: number; // GB
      total: number; // GB
      growthRate: number; // GB/day
    };
  };
  
  // Error Rates
  errorRates: {
    systemErrors: number; // percentage
    aiErrors: number; // percentage
    networkErrors: number; // percentage
    totalErrors: number; // percentage
  };
}

export interface DiagnosticAnalytics {
  // Accuracy Metrics
  accuracy: {
    overall: number; // percentage
    byDiseaseType: Record<string, number>;
    byAgeGroup: Record<string, number>;
    byGender: Record<string, number>;
    trend: 'improving' | 'stable' | 'declining';
  };
  
  // Case Complexity Analysis
  caseComplexity: {
    simple: {
      count: number;
      averageTime: number; // minutes
      accuracy: number; // percentage
    };
    moderate: {
      count: number;
      averageTime: number;
      accuracy: number;
    };
    complex: {
      count: number;
      averageTime: number;
      accuracy: number;
    };
  };
  
  // Diagnostic Time Analysis
  diagnosticTime: {
    average: number; // minutes
    byComplexity: Record<string, number>;
    byAgent: Record<string, number>;
    trend: 'improving' | 'stable' | 'declining';
  };
  
  // Misdiagnosis Analysis
  misdiagnosis: {
    rate: number; // percentage
    commonPatterns: Array<{
      pattern: string;
      frequency: number;
      severity: 'low' | 'medium' | 'high';
    }>;
    improvementSuggestions: string[];
  };
}

export interface AIPerformanceMetrics {
  // Multi-Agent Collaboration
  agentCollaboration: {
    orchestrator: {
      coordinationTime: number; // seconds
      successRate: number; // percentage
      averageConfidence: number; // percentage
    };
    diagnostician: {
      analysisTime: number;
      accuracy: number;
      confidence: number;
    };
    radiologist: {
      imageAnalysisTime: number;
      accuracy: number;
      confidence: number;
    };
    treatmentPlanner: {
      planningTime: number;
      feasibility: number; // percentage
      confidence: number;
    };
    rubricEvaluator: {
      evaluationTime: number;
      consistency: number; // percentage
      confidence: number;
    };
  };
  
  // Rubric Score Trends
  rubricTrends: {
    overall: {
      current: number;
      previous: number;
      trend: 'improving' | 'stable' | 'declining';
    };
    byDimension: {
      diagnosticAccuracy: number;
      consultationLogic: number;
      treatmentPlan: number;
      empathySkills: number;
      ethicsCompliance: number;
    };
    historicalData: Array<{
      date: Date;
      score: number;
      dimension: string;
    }>;
  };
  
  // Learning Curve Analysis
  learningCurve: {
    improvementRate: number; // percentage per month
    milestones: Array<{
      date: Date;
      achievement: string;
      impact: number; // percentage improvement
    }>;
    nextGoals: string[];
  };
  
  // Confidence Distribution
  confidenceDistribution: {
    high: number; // >80%
    medium: number; // 60-80%
    low: number; // <60%
    average: number;
    trend: 'improving' | 'stable' | 'declining';
  };
}

export interface BusinessIntelligence {
  // User Behavior Analysis
  userBehavior: {
    activeUsers: {
      daily: number;
      weekly: number;
      monthly: number;
    };
    sessionDuration: {
      average: number; // minutes
      median: number;
      trend: 'increasing' | 'stable' | 'decreasing';
    };
    featureUsage: Record<string, {
      usageCount: number;
      uniqueUsers: number;
      satisfaction: number; // 1-5 rating
    }>;
    userRetention: {
      day1: number; // percentage
      day7: number;
      day30: number;
    };
  };
  
  // Case Flow Analysis
  caseFlow: {
    dailyVolume: {
      current: number;
      average: number;
      peak: number;
      trend: 'increasing' | 'stable' | 'decreasing';
    };
    seasonalPatterns: Array<{
      period: string;
      volume: number;
      pattern: string;
    }>;
    peakHours: Array<{
      hour: number;
      volume: number;
    }>;
    backlog: {
      current: number;
      averageProcessingTime: number; // hours
      trend: 'increasing' | 'stable' | 'decreasing';
    };
  };
  
  // Efficiency Metrics
  efficiency: {
    timeSavings: {
      averagePerCase: number; // minutes saved
      totalPerDay: number; // hours saved
      monthlyValue: number; // estimated cost savings
    };
    accuracyImprovement: {
      baseline: number; // percentage
      current: number;
      improvement: number;
    };
    productivityGains: {
      casesPerDoctor: {
        before: number;
        after: number;
        improvement: number; // percentage
      };
      diagnosticSpeed: {
        before: number; // minutes
        after: number;
        improvement: number; // percentage
      };
    };
  };
  
  // Cost-Benefit Analysis
  costBenefit: {
    systemCosts: {
      infrastructure: number; // monthly
      aiServices: number;
      maintenance: number;
      total: number;
    };
    benefits: {
      timeSavings: number; // monthly value
      accuracyImprovement: number; // monthly value
      reducedErrors: number; // monthly value
      total: number;
    };
    roi: {
      monthly: number; // percentage
      annual: number;
      paybackPeriod: number; // months
    };
  };
}

export interface AnalyticsTimeRange {
  label: string;
  value: '1h' | '24h' | '7d' | '30d' | '90d' | '1y';
  startDate: Date;
  endDate: Date;
}

export interface AnalyticsDashboard {
  systemPerformance: SystemPerformanceMetrics;
  diagnosticAnalytics: DiagnosticAnalytics;
  aiPerformance: AIPerformanceMetrics;
  businessIntelligence: BusinessIntelligence;
  lastUpdated: Date;
  timeRange: AnalyticsTimeRange;
}

export interface AnalyticsAlert {
  id: string;
  type: 'performance' | 'accuracy' | 'error' | 'capacity' | 'trend';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  metric: string;
  currentValue: number;
  threshold: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  timestamp: Date;
  acknowledged: boolean;
  recommendations: string[];
}

export interface AnalyticsChartData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    backgroundColor?: string;
    borderColor?: string;
    fill?: boolean;
  }>;
}

export interface PerformanceComparison {
  metric: string;
  current: number;
  previous: number;
  benchmark: number;
  improvement: number; // percentage
  status: 'excellent' | 'good' | 'average' | 'poor' | 'critical';
}
