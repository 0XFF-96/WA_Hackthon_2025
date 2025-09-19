import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BarChart3, TrendingUp, TrendingDown, Activity, Clock, AlertTriangle, CheckCircle,
  Users, Zap, Target, Brain, Stethoscope, FileText, Bot, RefreshCw, Download,
  Monitor, Cpu, HardDrive, Wifi, AlertCircle, Star, Award, DollarSign
} from 'lucide-react';
import { 
  AnalyticsDashboard, SystemPerformanceMetrics, DiagnosticAnalytics, 
  AIPerformanceMetrics, BusinessIntelligence, AnalyticsAlert, AnalyticsTimeRange 
} from '@/types/analytics';

// Mock data for demonstration
const mockAnalyticsData: AnalyticsDashboard = {
  systemPerformance: {
    responseTime: {
      average: 2.3,
      p50: 1.8,
      p95: 4.2,
      p99: 6.1,
      trend: 'improving'
    },
    throughput: {
      casesPerHour: 45,
      concurrentUsers: 23,
      peakLoad: 67,
      capacityUtilization: 78
    },
    resourceUsage: {
      cpu: { average: 45, peak: 78, current: 52 },
      memory: { average: 62, peak: 85, current: 68 },
      storage: { used: 245, total: 500, growthRate: 2.3 }
    },
    errorRates: {
      systemErrors: 0.2,
      aiErrors: 1.1,
      networkErrors: 0.3,
      totalErrors: 1.6
    }
  },
  diagnosticAnalytics: {
    accuracy: {
      overall: 96.5,
      byDiseaseType: {
        'Micro-fractures': 97.2,
        'Stress fractures': 95.8,
        'Pathological fractures': 94.1,
        'Other': 96.0
      },
      byAgeGroup: {
        '0-18': 98.1,
        '19-35': 96.8,
        '36-55': 95.9,
        '55+': 95.2
      },
      byGender: {
        'Male': 96.8,
        'Female': 96.2
      },
      trend: 'improving'
    },
    caseComplexity: {
      simple: { count: 156, averageTime: 1.2, accuracy: 98.5 },
      moderate: { count: 89, averageTime: 2.8, accuracy: 96.2 },
      complex: { count: 34, averageTime: 5.4, accuracy: 92.1 }
    },
    diagnosticTime: {
      average: 2.3,
      byComplexity: {
        'Simple': 1.2,
        'Moderate': 2.8,
        'Complex': 5.4
      },
      byAgent: {
        'Orchestrator': 0.3,
        'Diagnostician': 1.8,
        'Radiologist': 2.1,
        'Treatment Planner': 1.2
      },
      trend: 'improving'
    },
    misdiagnosis: {
      rate: 3.5,
      commonPatterns: [
        { pattern: 'Early-stage micro-fractures', frequency: 12, severity: 'medium' },
        { pattern: 'Stress vs pathological fractures', frequency: 8, severity: 'high' },
        { pattern: 'Age-related bone changes', frequency: 6, severity: 'low' }
      ],
      improvementSuggestions: [
        'Enhance early-stage detection algorithms',
        'Improve age-specific diagnostic criteria',
        'Add more training data for rare cases'
      ]
    }
  },
  aiPerformance: {
    agentCollaboration: {
      orchestrator: { coordinationTime: 0.3, successRate: 98.5, averageConfidence: 95 },
      diagnostician: { analysisTime: 1.8, accuracy: 96.2, confidence: 92 },
      radiologist: { imageAnalysisTime: 2.1, accuracy: 94.8, confidence: 88 },
      treatmentPlanner: { planningTime: 1.2, feasibility: 97.1, confidence: 90 },
      rubricEvaluator: { evaluationTime: 0.8, consistency: 99.2, confidence: 98 }
    },
    rubricTrends: {
      overall: { current: 91.4, previous: 89.2, trend: 'improving' },
      byDimension: {
        diagnosticAccuracy: 92.3,
        consultationLogic: 89.1,
        treatmentPlan: 94.2,
        empathySkills: 87.5,
        ethicsCompliance: 95.8
      },
      historicalData: [
        { date: new Date('2024-01-01'), score: 85.2, dimension: 'overall' },
        { date: new Date('2024-02-01'), score: 87.1, dimension: 'overall' },
        { date: new Date('2024-03-01'), score: 89.2, dimension: 'overall' },
        { date: new Date('2024-04-01'), score: 91.4, dimension: 'overall' }
      ]
    },
    learningCurve: {
      improvementRate: 2.1,
      milestones: [
        { date: new Date('2024-01-15'), achievement: 'Reached 85% accuracy', impact: 5.2 },
        { date: new Date('2024-02-20'), achievement: 'Improved response time by 20%', impact: 3.8 },
        { date: new Date('2024-03-25'), achievement: 'Achieved 90% rubric score', impact: 4.1 }
      ],
      nextGoals: [
        'Reach 95% overall accuracy',
        'Reduce diagnostic time by 15%',
        'Improve empathy scores to 90%'
      ]
    },
    confidenceDistribution: {
      high: 78.5,
      medium: 18.2,
      low: 3.3,
      average: 91.2,
      trend: 'improving'
    }
  },
  businessIntelligence: {
    userBehavior: {
      activeUsers: { daily: 45, weekly: 156, monthly: 423 },
      sessionDuration: { average: 23.5, median: 18.2, trend: 'increasing' },
      featureUsage: {
        'Multi-Agent Chat': { usageCount: 1247, uniqueUsers: 89, satisfaction: 4.6 },
        'Case Management': { usageCount: 892, uniqueUsers: 67, satisfaction: 4.4 },
        'AI Agents': { usageCount: 634, uniqueUsers: 45, satisfaction: 4.7 },
        'Analytics': { usageCount: 234, uniqueUsers: 23, satisfaction: 4.5 }
      },
      userRetention: { day1: 94.2, day7: 78.5, day30: 65.3 }
    },
    caseFlow: {
      dailyVolume: { current: 67, average: 58, peak: 89, trend: 'increasing' },
      seasonalPatterns: [
        { period: 'Q1 2024', volume: 45, pattern: 'Winter sports injuries' },
        { period: 'Q2 2024', volume: 52, pattern: 'Spring activity increase' },
        { period: 'Q3 2024', volume: 61, pattern: 'Summer sports peak' }
      ],
      peakHours: [
        { hour: 9, volume: 12 },
        { hour: 14, volume: 15 },
        { hour: 16, volume: 18 }
      ],
      backlog: { current: 8, averageProcessingTime: 2.3, trend: 'stable' }
    },
    efficiency: {
      timeSavings: { averagePerCase: 12.5, totalPerDay: 18.7, monthlyValue: 15600 },
      accuracyImprovement: { baseline: 89.2, current: 96.5, improvement: 7.3 },
      productivityGains: {
        casesPerDoctor: { before: 8, after: 12, improvement: 50 },
        diagnosticSpeed: { before: 15, after: 2.3, improvement: 84.7 }
      }
    },
    costBenefit: {
      systemCosts: { infrastructure: 2500, aiServices: 1800, maintenance: 800, total: 5100 },
      benefits: { timeSavings: 15600, accuracyImprovement: 8900, reducedErrors: 4200, total: 28700 },
      roi: { monthly: 463, annual: 5556, paybackPeriod: 2.1 }
    }
  },
  lastUpdated: new Date(),
  timeRange: {
    label: 'Last 30 days',
    value: '30d',
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    endDate: new Date()
  }
};

const mockAlerts: AnalyticsAlert[] = [
  {
    id: '1',
    type: 'performance',
    severity: 'medium',
    title: 'High Response Time',
    description: 'Average response time increased by 15% in the last hour',
    metric: 'Response Time',
    currentValue: 2.8,
    threshold: 2.5,
    trend: 'increasing',
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    acknowledged: false,
    recommendations: ['Scale up AI services', 'Optimize database queries']
  },
  {
    id: '2',
    type: 'accuracy',
    severity: 'low',
    title: 'Accuracy Dip',
    description: 'Diagnostic accuracy dropped slightly for complex cases',
    metric: 'Diagnostic Accuracy',
    currentValue: 92.1,
    threshold: 95.0,
    trend: 'decreasing',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    acknowledged: true,
    recommendations: ['Review complex case training data', 'Adjust confidence thresholds']
  }
];

// System Performance Card Component
function SystemPerformanceCard({ metrics }: { metrics: SystemPerformanceMetrics }) {
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'declining': return <TrendingDown className="w-4 h-4 text-red-500" />;
      default: return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Monitor className="w-5 h-5 mr-2" />
          System Performance
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Response Time */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold">Response Time</h3>
            <div className="flex items-center space-x-1">
              {getTrendIcon(metrics.responseTime.trend)}
              <span className="text-sm text-muted-foreground capitalize">
                {metrics.responseTime.trend}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="flex justify-between">
                <span>Average</span>
                <span className="font-medium">{metrics.responseTime.average}s</span>
              </div>
              <div className="flex justify-between">
                <span>P95</span>
                <span className="font-medium">{metrics.responseTime.p95}s</span>
              </div>
            </div>
            <div>
              <div className="flex justify-between">
                <span>P99</span>
                <span className="font-medium">{metrics.responseTime.p99}s</span>
              </div>
              <div className="flex justify-between">
                <span>Median</span>
                <span className="font-medium">{metrics.responseTime.p50}s</span>
              </div>
            </div>
          </div>
        </div>

        {/* Throughput */}
        <div>
          <h3 className="font-semibold mb-2">Throughput</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="flex justify-between">
                <span>Cases/Hour</span>
                <span className="font-medium">{metrics.throughput.casesPerHour}</span>
              </div>
              <div className="flex justify-between">
                <span>Concurrent Users</span>
                <span className="font-medium">{metrics.throughput.concurrentUsers}</span>
              </div>
            </div>
            <div>
              <div className="flex justify-between">
                <span>Peak Load</span>
                <span className="font-medium">{metrics.throughput.peakLoad}%</span>
              </div>
              <div className="flex justify-between">
                <span>Capacity</span>
                <span className="font-medium">{metrics.throughput.capacityUtilization}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Resource Usage */}
        <div>
          <h3 className="font-semibold mb-2">Resource Usage</h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>CPU</span>
                <span>{metrics.resourceUsage.cpu.current}%</span>
              </div>
              <Progress value={metrics.resourceUsage.cpu.current} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Memory</span>
                <span>{metrics.resourceUsage.memory.current}%</span>
              </div>
              <Progress value={metrics.resourceUsage.memory.current} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Storage</span>
                <span>{metrics.resourceUsage.storage.used}GB / {metrics.resourceUsage.storage.total}GB</span>
              </div>
              <Progress value={(metrics.resourceUsage.storage.used / metrics.resourceUsage.storage.total) * 100} className="h-2" />
            </div>
          </div>
        </div>

        {/* Error Rates */}
        <div>
          <h3 className="font-semibold mb-2">Error Rates</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="text-center p-2 bg-red-50 dark:bg-red-950/20 rounded">
              <div className="font-medium text-red-600">{metrics.errorRates.totalErrors}%</div>
              <div className="text-muted-foreground">Total</div>
            </div>
            <div className="text-center p-2 bg-orange-50 dark:bg-orange-950/20 rounded">
              <div className="font-medium text-orange-600">{metrics.errorRates.aiErrors}%</div>
              <div className="text-muted-foreground">AI Errors</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Diagnostic Analytics Card Component
function DiagnosticAnalyticsCard({ analytics }: { analytics: DiagnosticAnalytics }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Stethoscope className="w-5 h-5 mr-2" />
          Diagnostic Analytics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Accuracy */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold">Overall Accuracy</h3>
            <Badge variant="outline" className="text-green-600">
              {analytics.accuracy.overall}%
            </Badge>
          </div>
          <Progress value={analytics.accuracy.overall} className="h-3" />
        </div>

        {/* Accuracy by Category */}
        <div>
          <h3 className="font-semibold mb-2">Accuracy by Disease Type</h3>
          <div className="space-y-2">
            {Object.entries(analytics.accuracy.byDiseaseType).map(([type, accuracy]) => (
              <div key={type} className="flex justify-between text-sm">
                <span>{type}</span>
                <span className="font-medium">{accuracy}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Case Complexity */}
        <div>
          <h3 className="font-semibold mb-2">Case Complexity Analysis</h3>
          <div className="space-y-3">
            {Object.entries(analytics.caseComplexity).map(([complexity, data]) => (
              <div key={complexity} className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium capitalize">{complexity}</span>
                  <Badge variant="secondary">{data.count} cases</Badge>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>Time: {data.averageTime}min</div>
                  <div>Accuracy: {data.accuracy}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Misdiagnosis Analysis */}
        <div>
          <h3 className="font-semibold mb-2">Misdiagnosis Analysis</h3>
          <div className="p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">Misdiagnosis Rate</span>
              <Badge variant="outline" className="text-yellow-600">
                {analytics.misdiagnosis.rate}%
              </Badge>
            </div>
            <div className="text-sm text-muted-foreground">
              {analytics.misdiagnosis.commonPatterns.length} common patterns identified
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// AI Performance Card Component
function AIPerformanceCard({ metrics }: { metrics: AIPerformanceMetrics }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Brain className="w-5 h-5 mr-2" />
          AI Performance
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Agent Performance */}
        <div>
          <h3 className="font-semibold mb-2">Agent Performance</h3>
          <div className="space-y-3">
            {Object.entries(metrics.agentCollaboration).map(([agent, data]) => (
              <div key={agent} className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium capitalize">{agent}</span>
                  <Badge variant="outline">{data.successRate}%</Badge>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>Time: {data.coordinationTime || data.analysisTime || data.imageAnalysisTime || data.planningTime || data.evaluationTime}s</div>
                  <div>Confidence: {data.averageConfidence || data.confidence}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Rubric Trends */}
        <div>
          <h3 className="font-semibold mb-2">Rubric Score Trends</h3>
          <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">Overall Score</span>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold">{metrics.rubricTrends.overall.current}</span>
                <TrendingUp className="w-4 h-4 text-green-500" />
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              Previous: {metrics.rubricTrends.overall.previous} (+{metrics.rubricTrends.overall.current - metrics.rubricTrends.overall.previous})
            </div>
          </div>
        </div>

        {/* Learning Curve */}
        <div>
          <h3 className="font-semibold mb-2">Learning Progress</h3>
          <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">Improvement Rate</span>
              <Badge variant="outline" className="text-green-600">
                +{metrics.learningCurve.improvementRate}%/month
              </Badge>
            </div>
            <div className="text-sm text-muted-foreground">
              {metrics.learningCurve.milestones.length} milestones achieved
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Business Intelligence Card Component
function BusinessIntelligenceCard({ bi }: { bi: BusinessIntelligence }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <BarChart3 className="w-5 h-5 mr-2" />
          Business Intelligence
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* User Metrics */}
        <div>
          <h3 className="font-semibold mb-2">User Metrics</h3>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2 bg-blue-50 dark:bg-blue-950/20 rounded">
              <div className="font-medium">{bi.userBehavior.activeUsers.daily}</div>
              <div className="text-xs text-muted-foreground">Daily</div>
            </div>
            <div className="p-2 bg-blue-50 dark:bg-blue-950/20 rounded">
              <div className="font-medium">{bi.userBehavior.activeUsers.weekly}</div>
              <div className="text-xs text-muted-foreground">Weekly</div>
            </div>
            <div className="p-2 bg-blue-50 dark:bg-blue-950/20 rounded">
              <div className="font-medium">{bi.userBehavior.activeUsers.monthly}</div>
              <div className="text-xs text-muted-foreground">Monthly</div>
            </div>
          </div>
        </div>

        {/* Efficiency Gains */}
        <div>
          <h3 className="font-semibold mb-2">Efficiency Gains</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Time Saved/Case</span>
              <span className="font-medium">{bi.efficiency.timeSavings.averagePerCase}min</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Accuracy Improvement</span>
              <span className="font-medium">+{bi.efficiency.accuracyImprovement.improvement}%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Productivity Gain</span>
              <span className="font-medium">+{bi.efficiency.productivityGains.casesPerDoctor.improvement}%</span>
            </div>
          </div>
        </div>

        {/* ROI */}
        <div>
          <h3 className="font-semibold mb-2">Return on Investment</h3>
          <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">Monthly ROI</span>
              <Badge variant="outline" className="text-green-600">
                {bi.costBenefit.roi.monthly}%
              </Badge>
            </div>
            <div className="text-sm text-muted-foreground">
              Payback: {bi.costBenefit.roi.paybackPeriod} months
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Alerts Panel Component
function AlertsPanel({ alerts }: { alerts: AnalyticsAlert[] }) {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'high': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'low': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <AlertCircle className="w-4 h-4" />;
      case 'high': return <AlertTriangle className="w-4 h-4" />;
      case 'medium': return <AlertTriangle className="w-4 h-4" />;
      case 'low': return <CheckCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <AlertTriangle className="w-5 h-5 mr-2" />
          System Alerts
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div key={alert.id} className="p-3 border rounded-lg">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  {getSeverityIcon(alert.severity)}
                  <span className="font-medium">{alert.title}</span>
                </div>
                <Badge className={getSeverityColor(alert.severity)}>
                  {alert.severity}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-2">{alert.description}</p>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{alert.metric}: {alert.currentValue}</span>
                <span>{alert.timestamp.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default function Analytics() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsDashboard>(mockAnalyticsData);
  const [alerts, setAlerts] = useState<AnalyticsAlert[]>(mockAlerts);
  const [timeRange, setTimeRange] = useState<string>('30d');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshData = async () => {
    setIsRefreshing(true);
    // Simulate data refresh
    await new Promise(resolve => setTimeout(resolve, 1000));
    setAnalyticsData({ ...mockAnalyticsData, lastUpdated: new Date() });
    setIsRefreshing(false);
  };

  const exportData = () => {
    // Simulate data export
    console.log('Exporting analytics data...');
  };

  return (
    <div className="p-6 space-y-6" data-testid="page-analytics">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" data-testid="text-page-title">Analytics</h1>
          <p className="text-muted-foreground">
            System performance and diagnostic analytics
          </p>
        </div>
        <div className="flex space-x-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1h">Last Hour</SelectItem>
              <SelectItem value="24h">Last 24h</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={refreshData} disabled={isRefreshing}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline" onClick={exportData}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Zap className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{analyticsData.systemPerformance.responseTime.average}s</p>
                <p className="text-sm text-muted-foreground">Avg Response Time</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{analyticsData.diagnosticAnalytics.accuracy.overall}%</p>
                <p className="text-sm text-muted-foreground">Diagnostic Accuracy</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">{analyticsData.businessIntelligence.userBehavior.activeUsers.daily}</p>
                <p className="text-sm text-muted-foreground">Daily Active Users</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{analyticsData.businessIntelligence.costBenefit.roi.monthly}%</p>
                <p className="text-sm text-muted-foreground">Monthly ROI</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">System Performance</TabsTrigger>
          <TabsTrigger value="diagnostics">Diagnostic Analytics</TabsTrigger>
          <TabsTrigger value="ai">AI Performance</TabsTrigger>
          <TabsTrigger value="business">Business Intelligence</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SystemPerformanceCard metrics={analyticsData.systemPerformance} />
            <DiagnosticAnalyticsCard analytics={analyticsData.diagnosticAnalytics} />
            <AIPerformanceCard metrics={analyticsData.aiPerformance} />
            <BusinessIntelligenceCard bi={analyticsData.businessIntelligence} />
          </div>
          <AlertsPanel alerts={alerts} />
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <SystemPerformanceCard metrics={analyticsData.systemPerformance} />
        </TabsContent>

        <TabsContent value="diagnostics" className="space-y-4">
          <DiagnosticAnalyticsCard analytics={analyticsData.diagnosticAnalytics} />
        </TabsContent>

        <TabsContent value="ai" className="space-y-4">
          <AIPerformanceCard metrics={analyticsData.aiPerformance} />
        </TabsContent>

        <TabsContent value="business" className="space-y-4">
          <BusinessIntelligenceCard bi={analyticsData.businessIntelligence} />
        </TabsContent>
      </Tabs>

      {/* Last Updated */}
      <div className="text-center text-sm text-muted-foreground">
        Last updated: {analyticsData.lastUpdated.toLocaleString()}
      </div>
    </div>
  );
}
