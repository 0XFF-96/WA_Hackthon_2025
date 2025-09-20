import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Shield, 
  AlertTriangle, 
  Clock, 
  User, 
  FileText, 
  TrendingUp,
  Phone,
  Mail,
  Brain,
  BarChart3,
  CheckCircle,
  XCircle,
  ArrowUp,
  ArrowDown,
  Upload,
  Target,
  ArrowRight,
  Plus,
  Filter,
  Search,
  AlertCircle,
  Activity,
  Zap,
  Eye,
  FileCheck,
  Scan,
  TrendingDown
} from 'lucide-react';

interface MTFDetectionDashboardProps {
  onCaseSelect?: (caseId: string) => void;
}

interface MTFCase {
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

interface SystemStats {
  totalProcessed: number;
  mtfDetected: number;
  pendingReview: number;
  averageProcessingTime: number;
  averageConfidence: number;
  qualityScore: number;
}

interface WorkflowStep {
  id: number;
  title: string;
  description: string;
  icon: any;
  status: 'pending' | 'in_progress' | 'completed' | 'disabled';
  color: string;
}

interface ReportScanData {
  id: string;
  patientId: string;
  scanType: 'xray' | 'ct' | 'mri' | 'ultrasound';
  scanTime: Date;
  aiPriority: 'critical' | 'high' | 'medium' | 'low';
  riskScore: number;
  status: 'outreach_sent' | 'pending_review' | 'processing' | 'completed';
}

interface KPIData {
  totalReportsScanned: number;
  suspectedMTFCases: number;
  outreachEmailsSent: number;
  pendingDoctorReview: number;
}

interface BatchProcessingData {
  currentBatch: number;
  totalBatches: number;
  priorityDistribution: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
}

interface RiskTrendData {
  date: string;
  critical: number;
  high: number;
  medium: number;
  low: number;
}

export function MTFDetectionDashboard({ onCaseSelect }: MTFDetectionDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentWorkflowStep, setCurrentWorkflowStep] = useState(1);
  const [systemStats, setSystemStats] = useState<SystemStats>({
    totalProcessed: 0,
    mtfDetected: 0,
    pendingReview: 0,
    averageProcessingTime: 0,
    averageConfidence: 0,
    qualityScore: 0
  });
  const [mtfCases, setMtfCases] = useState<MTFCase[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [reportScanData, setReportScanData] = useState<ReportScanData[]>([]);
  const [kpiData, setKpiData] = useState<KPIData>({
    totalReportsScanned: 0,
    suspectedMTFCases: 0,
    outreachEmailsSent: 0,
    pendingDoctorReview: 0
  });
  const [batchProcessingData, setBatchProcessingData] = useState<BatchProcessingData>({
    currentBatch: 0,
    totalBatches: 0,
    priorityDistribution: { critical: 0, high: 0, medium: 0, low: 0 }
  });
  const [riskTrendData, setRiskTrendData] = useState<RiskTrendData[]>([]);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    fetchSystemStats();
    fetchMTFCases();
    fetchReportScanData();
    fetchKPIData();
    fetchBatchProcessingData();
    fetchRiskTrendData();
  }, []);

  const fetchSystemStats = async () => {
    try {
      const response = await fetch('/api/mtf/statistics');
      const data = await response.json();
      if (data.success) {
        setSystemStats({
          totalProcessed: data.data.totalReportsProcessed,
          mtfDetected: data.data.mtfCasesDetected,
          pendingReview: data.data.qualityMetrics.manualReviewRequired,
          averageProcessingTime: data.data.averageProcessingTime,
          averageConfidence: data.data.averageConfidence,
          qualityScore: data.data.qualityMetrics.averageQualityScore
        });
      }
    } catch (error) {
      console.error('Failed to fetch system stats:', error);
    }
  };

  const fetchMTFCases = async () => {
    try {
      setIsLoading(true);
      // Mock data - should fetch from API in real application
      const mockCases: MTFCase[] = [
        {
          id: 'case_001',
          patientId: 'patient_001',
          patientName: 'Margaret Johnson',
          age: 73,
          gender: 'female',
          riskScore: 89,
          riskLevel: 'critical',
          mtfSuspected: true,
          confidence: 94,
          reportType: 'xray',
          createdAt: new Date('2024-01-15T10:30:00'),
          status: 'pending',
          urgency: 4,
          specialistReferral: true
        },
        {
          id: 'case_002',
          patientId: 'patient_002',
          patientName: 'Robert Chen',
          age: 68,
          gender: 'male',
          riskScore: 76,
          riskLevel: 'high',
          mtfSuspected: true,
          confidence: 87,
          reportType: 'ct',
          createdAt: new Date('2024-01-15T09:15:00'),
          status: 'reviewed',
          urgency: 12,
          specialistReferral: true
        },
        {
          id: 'case_003',
          patientId: 'patient_003',
          patientName: 'Susan Lee',
          age: 65,
          gender: 'female',
          riskScore: 62,
          riskLevel: 'medium',
          mtfSuspected: false,
          confidence: 82,
          reportType: 'mri',
          createdAt: new Date('2024-01-15T08:45:00'),
          status: 'contacted',
          urgency: 48,
          specialistReferral: false
        }
      ];
      setMtfCases(mockCases);
    } catch (error) {
      console.error('Failed to fetch MTF cases:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-red-100 text-red-800';
      case 'reviewed': return 'bg-yellow-100 text-yellow-800';
      case 'contacted': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getUrgencyIcon = (urgency: number) => {
    if (urgency <= 4) return <ArrowUp className="h-4 w-4 text-red-600" />;
    if (urgency <= 24) return <ArrowUp className="h-4 w-4 text-orange-600" />;
    return <ArrowDown className="h-4 w-4 text-green-600" />;
  };

  // Workflow steps definition
  const workflowSteps: WorkflowStep[] = [
    {
      id: 1,
      title: 'Report Import',
      description: 'Upload or input radiology reports',
      icon: Upload,
      status: currentWorkflowStep >= 1 ? 'completed' : 'pending',
      color: 'blue'
    },
    {
      id: 2,
      title: 'AI Analysis',
      description: 'AI-powered MTF detection & risk assessment',
      icon: Brain,
      status: currentWorkflowStep >= 2 ? 'completed' : currentWorkflowStep === 1 ? 'in_progress' : 'pending',
      color: 'purple'
    },
    {
      id: 3,
      title: 'Risk Assessment',
      description: 'Generate personalized risk evaluation',
      icon: Target,
      status: currentWorkflowStep >= 3 ? 'completed' : currentWorkflowStep === 2 ? 'in_progress' : 'pending',
      color: 'orange'
    },
    {
      id: 4,
      title: 'Patient Outreach',
      description: 'Automated personalized communication',
      icon: Phone,
      status: currentWorkflowStep >= 4 ? 'completed' : currentWorkflowStep === 3 ? 'in_progress' : 'disabled',
      color: 'green'
    }
  ];

  // Filter cases based on search query
  const filteredCases = mtfCases.filter(case_ => 
    case_.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    case_.patientId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    case_.reportType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const criticalCases = filteredCases.filter(c => c.riskLevel === 'critical' || c.mtfSuspected);
  const pendingCases = filteredCases.filter(c => c.status === 'pending');

  const handleWorkflowStepClick = (stepId: number) => {
    if (stepId <= currentWorkflowStep + 1) {
      setCurrentWorkflowStep(stepId);
      console.log('Workflow step clicked:', stepId);
    }
  };

  const fetchReportScanData = async () => {
    try {
      // Mock data - should fetch from API in real application
      const mockData: ReportScanData[] = [
        {
          id: 'scan_001',
          patientId: 'P001234',
          scanType: 'xray',
          scanTime: new Date('2024-01-15T10:30:00'),
          aiPriority: 'critical',
          riskScore: 89,
          status: 'pending_review'
        },
        {
          id: 'scan_002',
          patientId: 'P001235',
          scanType: 'ct',
          scanTime: new Date('2024-01-15T10:25:00'),
          aiPriority: 'high',
          riskScore: 76,
          status: 'outreach_sent'
        },
        {
          id: 'scan_003',
          patientId: 'P001236',
          scanType: 'mri',
          scanTime: new Date('2024-01-15T10:20:00'),
          aiPriority: 'medium',
          riskScore: 62,
          status: 'completed'
        },
        {
          id: 'scan_004',
          patientId: 'P001237',
          scanType: 'xray',
          scanTime: new Date('2024-01-15T10:15:00'),
          aiPriority: 'low',
          riskScore: 34,
          status: 'processing'
        },
        {
          id: 'scan_005',
          patientId: 'P001238',
          scanType: 'ct',
          scanTime: new Date('2024-01-15T10:10:00'),
          aiPriority: 'critical',
          riskScore: 92,
          status: 'pending_review'
        }
      ];
      setReportScanData(mockData);
    } catch (error) {
      console.error('Failed to fetch report scan data:', error);
    }
  };

  const fetchKPIData = async () => {
    try {
      // Simulate API call with animation
      setTimeout(() => {
        setKpiData({
          totalReportsScanned: 1247,
          suspectedMTFCases: 89,
          outreachEmailsSent: 156,
          pendingDoctorReview: 23
        });
      }, 500);
    } catch (error) {
      console.error('Failed to fetch KPI data:', error);
    }
  };

  const fetchBatchProcessingData = async () => {
    try {
      setTimeout(() => {
        setBatchProcessingData({
          currentBatch: 82,
          totalBatches: 100,
          priorityDistribution: {
            critical: 12,
            high: 28,
            medium: 35,
            low: 25
          }
        });
      }, 800);
    } catch (error) {
      console.error('Failed to fetch batch processing data:', error);
    }
  };

  const fetchRiskTrendData = async () => {
    try {
      const mockTrendData: RiskTrendData[] = [
        { date: '2024-01-09', critical: 8, high: 15, medium: 22, low: 18 },
        { date: '2024-01-10', critical: 12, high: 18, medium: 25, low: 20 },
        { date: '2024-01-11', critical: 6, high: 12, medium: 28, low: 22 },
        { date: '2024-01-12', critical: 15, high: 22, medium: 30, low: 25 },
        { date: '2024-01-13', critical: 9, high: 16, medium: 26, low: 19 },
        { date: '2024-01-14', critical: 11, high: 20, medium: 32, low: 24 },
        { date: '2024-01-15', critical: 12, high: 25, medium: 35, low: 28 }
      ];
      setRiskTrendData(mockTrendData);
      
      // Show alert after data loads
      setTimeout(() => {
        setShowAlert(true);
      }, 1200);
    } catch (error) {
      console.error('Failed to fetch risk trend data:', error);
    }
  };

  const handleNewCase = () => {
    console.log('New case clicked');
  };

  return (
    <div className="p-6 space-y-6" data-testid="mtf-detection-dashboard">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold" data-testid="text-page-title">MTF Detection Console</h1>
          <p className="text-muted-foreground">Minimal trauma fracture detection and patient outreach management system</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
            <Shield className="w-3 h-3 mr-1" />
            AI Detection Active
          </Badge>
          <Button variant="outline" onClick={handleNewCase} data-testid="button-import-reports">
            <FileText className="w-4 h-4 mr-2" />
            Import Reports
          </Button>
          <Button onClick={handleNewCase} data-testid="button-batch-scan">
            <Shield className="w-4 h-4 mr-2" />
            Batch Scan
          </Button>
        </div>
      </div>

      {/* Workflow Progress */}
      <Card className="border-t-4 border-t-blue-500 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <BarChart3 className="h-5 w-5 text-blue-600" />
            MTF Detection Workflow
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-4">
              {workflowSteps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div 
                            className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 cursor-pointer ${
                              step.status === 'completed' 
                                ? 'bg-green-100 text-green-600 shadow-md border-2 border-green-200 hover:bg-green-200' :
                              step.status === 'in_progress' 
                                ? 'bg-blue-100 text-blue-600 shadow-md border-2 border-blue-200 animate-pulse' :
                              step.status === 'disabled'
                                ? 'bg-gray-100 text-gray-400 border-2 border-gray-200 cursor-not-allowed' :
                                `bg-gray-50 text-gray-400 border-2 border-gray-200 hover:bg-${step.color}-50 hover:text-${step.color}-500 cursor-pointer`
                            }`}
                            onClick={() => step.status !== 'disabled' && handleWorkflowStepClick(step.id)}
                          >
                            <step.icon className="w-5 h-5" />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{step.title}: {step.description}</p>
                          {step.status === 'disabled' && (
                            <p className="text-xs text-gray-500 mt-1">Complete previous steps first</p>
                          )}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <div className="text-center mt-2 max-w-20">
                      <div className="font-semibold text-xs text-gray-900">{step.title}</div>
                      <div className="text-xs text-gray-600 mt-1 leading-tight">{step.description}</div>
                    </div>
                  </div>
                  {index < workflowSteps.length - 1 && (
                    <div className="flex items-center mx-4">
                      <ArrowRight className="w-4 h-4 text-gray-300" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Report Auto-Scanning Section */}
      <div className="space-y-6">
        {/* Section Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Scan className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">AI Report Auto-Scanning</h2>
              <p className="text-sm text-gray-600">Real-time radiology report analysis and MTF detection</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              Auto-Scanning Active
            </div>
          </div>
        </div>

        {/* KPI Cards with Animated Counters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { 
              icon: FileCheck, 
              label: "Total Reports Scanned", 
              value: kpiData.totalReportsScanned, 
              change: "+12%", 
              color: "text-blue-600", 
              bgColor: "bg-blue-50",
              borderColor: "border-blue-200"
            },
            { 
              icon: AlertTriangle, 
              label: "Suspected MTF Cases", 
              value: kpiData.suspectedMTFCases, 
              change: "+8%", 
              color: "text-red-600", 
              bgColor: "bg-red-50",
              borderColor: "border-red-200"
            },
            { 
              icon: Mail, 
              label: "Outreach Emails Sent", 
              value: kpiData.outreachEmailsSent, 
              change: "+15%", 
              color: "text-green-600", 
              bgColor: "bg-green-50",
              borderColor: "border-green-200"
            },
            { 
              icon: Eye, 
              label: "Pending Doctor Review", 
              value: kpiData.pendingDoctorReview, 
              change: "-5%", 
              color: "text-orange-600", 
              bgColor: "bg-orange-50",
              borderColor: "border-orange-200"
            },
          ].map((stat, index) => (
            <Card key={index} className={`hover:shadow-lg transition-all duration-300 border-l-4 ${stat.borderColor} ${stat.bgColor}`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                    <AnimatedCounter value={stat.value} />
                    <Badge variant="secondary" className="text-xs px-2 py-0.5">
                      {stat.change}
                    </Badge>
                  </div>
                  <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center border ${stat.borderColor}`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Report Table */}
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-lg">
              <div className="w-6 h-6 bg-purple-100 rounded-lg flex items-center justify-center mr-2">
                <FileText className="w-3 h-3 text-purple-600" />
              </div>
              Recent Scan Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Patient ID</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Scan Type</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Scan Time</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">AI Priority</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Risk Score</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {reportScanData.map((report, index) => (
                    <ReportTableRow 
                      key={report.id} 
                      report={report} 
                      index={index}
                      getRiskLevelColor={getRiskLevelColor}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Batch Processing Monitor */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-base">
                <div className="w-6 h-6 bg-indigo-100 rounded-lg flex items-center justify-center mr-2">
                  <Activity className="w-3 h-3 text-indigo-600" />
                </div>
                Batch Processing Monitor
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Current Batch Progress</span>
                    <span className="font-medium">{batchProcessingData.currentBatch}/{batchProcessingData.totalBatches}</span>
                  </div>
                  <Progress 
                    value={(batchProcessingData.currentBatch / batchProcessingData.totalBatches) * 100} 
                    className="h-2"
                  />
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-indigo-600">
                    {Math.round((batchProcessingData.currentBatch / batchProcessingData.totalBatches) * 100)}%
                  </div>
                  <div className="text-sm text-gray-600">Complete</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-base">
                <div className="w-6 h-6 bg-pink-100 rounded-lg flex items-center justify-center mr-2">
                  <BarChart3 className="w-3 h-3 text-pink-600" />
                </div>
                Priority Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(batchProcessingData.priorityDistribution).map(([priority, count]) => (
                  <div key={priority} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${
                        priority === 'critical' ? 'bg-red-500' :
                        priority === 'high' ? 'bg-orange-500' :
                        priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                      }`}></div>
                      <span className="capitalize text-sm font-medium">{priority}</span>
                    </div>
                    <span className="font-bold text-lg">{count}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Risk Trend Section */}
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-base">
              <div className="w-6 h-6 bg-emerald-100 rounded-lg flex items-center justify-center mr-2">
                <TrendingUp className="w-3 h-3 text-emerald-600" />
              </div>
              Risk Trend Analysis (Last 7 Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">Risk trend chart will be displayed here</p>
                <p className="text-sm text-gray-500">Integration with Recharts coming soon</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Alert Card */}
        {showAlert && (
          <div className="animate-fade-in-right">
            <Alert className="border-orange-200 bg-gradient-to-r from-orange-50 to-yellow-50 shadow-sm">
              <TrendingUp className="h-5 w-5 text-orange-600" />
              <AlertDescription className="text-orange-800 font-medium">
                <div className="flex items-center justify-between">
                  <span>
                    <strong>+12 Critical cases today</strong> (↑25% vs yesterday)
                  </span>
                  <Button size="sm" variant="outline" className="text-orange-700 border-orange-300 hover:bg-orange-100">
                    View Details
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          </div>
        )}
      </div>

      {/* System Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { icon: FileText, label: "Reports Processed", value: systemStats.totalProcessed.toString(), change: "+12%", color: "text-blue-600", bgColor: "bg-blue-50" },
          { icon: Shield, label: "MTF Detected", value: systemStats.mtfDetected.toString(), change: "+8%", color: "text-red-600", bgColor: "bg-red-50" },
          { icon: Clock, label: "Pending Review", value: pendingCases.length.toString(), change: "-5%", color: "text-orange-600", bgColor: "bg-orange-50" },
          { icon: Brain, label: "Avg Confidence", value: `${systemStats.averageConfidence.toFixed(1)}%`, change: "+2%", color: "text-purple-600", bgColor: "bg-purple-50" },
        ].map((stat, index) => (
          <Card key={index} data-testid={`stat-card-${index}`} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900" data-testid={`stat-value-${index}`}>{stat.value}</p>
                  <Badge variant="secondary" className="text-xs px-2 py-0.5">
                    {stat.change}
                  </Badge>
                </div>
                <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Critical Cases Alert */}
      {criticalCases.length > 0 && (
        <Alert className="border-red-200 bg-gradient-to-r from-red-50 to-red-100 shadow-sm">
          <AlertTriangle className="h-5 w-5 text-red-600" />
          <AlertDescription className="text-red-800 font-medium">
            <div className="flex items-center justify-between">
              <span>
                <strong>{criticalCases.length} critical MTF cases</strong> require specialist evaluation within 24 hours
              </span>
              <Button size="sm" variant="outline" className="text-red-700 border-red-300 hover:bg-red-100">
                View Cases
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Critical Cases List */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center text-lg">
                  <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                  </div>
                  Critical Cases ({criticalCases.length})
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      placeholder="Search cases..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 w-48 h-9 px-3 py-1 text-sm border border-input bg-background rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      data-testid="input-search-cases"
                    />
                  </div>
                  <Button variant="outline" size="icon" className="hover:bg-gray-50">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {criticalCases.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-muted-foreground font-medium">No critical cases found</p>
                  <p className="text-sm text-muted-foreground mt-1">All cases are being processed normally</p>
                </div>
              ) : (
                criticalCases.map((case_) => (
                  <CriticalCaseCard 
                    key={case_.id} 
                    case_={case_} 
                    onSelect={() => onCaseSelect?.(case_.id)}
                    getRiskLevelColor={getRiskLevelColor}
                    getStatusColor={getStatusColor}
                    getUrgencyIcon={getUrgencyIcon}
                  />
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Recent Cases */}
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-base">
                <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center mr-2">
                  <User className="w-3 h-3 text-blue-600" />
                </div>
                Recent Cases
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {filteredCases.slice(0, 3).map((case_) => (
                <MTFCaseCard 
                  key={case_.id} 
                  case_={case_} 
                  onSelect={() => onCaseSelect?.(case_.id)}
                  getRiskLevelColor={getRiskLevelColor}
                  getStatusColor={getStatusColor}
                  getUrgencyIcon={getUrgencyIcon}
                  compact={true}
                />
              ))}
              {filteredCases.length === 0 && (
                <div className="text-center py-4">
                  <p className="text-sm text-muted-foreground">No recent cases</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* System Alerts */}
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-base text-orange-600">
                <div className="w-6 h-6 bg-orange-100 rounded-lg flex items-center justify-center mr-2">
                  <AlertCircle className="w-3 h-3 text-orange-600" />
                </div>
                System Alerts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-yellow-800">High case volume</p>
                  <p className="text-xs text-yellow-700">Processing queue at 85% capacity</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <Brain className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-blue-800">AI Model Updated</p>
                  <p className="text-xs text-blue-700">New MTF detection model deployed</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

    </div>
  );
}

// Animated Counter Component
interface AnimatedCounterProps {
  value: number;
  duration?: number;
}

function AnimatedCounter({ value, duration = 2000 }: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      setDisplayValue(Math.floor(progress * value));
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [value, duration]);

  return (
    <span className="text-2xl font-bold text-gray-900">
      {displayValue.toLocaleString()}
    </span>
  );
}

// Report Table Row Component
interface ReportTableRowProps {
  report: ReportScanData;
  index: number;
  getRiskLevelColor: (level: string) => string;
}

function ReportTableRow({ report, index, getRiskLevelColor }: ReportTableRowProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, index * 100); // Staggered animation

    return () => clearTimeout(timer);
  }, [index]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'outreach_sent': return 'bg-green-100 text-green-800';
      case 'pending_review': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'outreach_sent': return 'Outreach Sent';
      case 'pending_review': return 'Pending Review';
      case 'processing': return 'Processing';
      case 'completed': return 'Completed';
      default: return status;
    }
  };

  const isCritical = report.aiPriority === 'critical';

  return (
    <tr 
      className={`border-b hover:bg-gray-50 transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
      } ${isCritical ? 'bg-red-50 border-red-200' : ''}`}
      style={{
        animationDelay: `${index * 100}ms`,
        animation: isCritical ? 'blink 2s ease-in-out' : 'none'
      }}
    >
      <td className="py-3 px-4 font-medium text-gray-900">{report.patientId}</td>
      <td className="py-3 px-4">
        <Badge variant="outline" className="uppercase">
          {report.scanType}
        </Badge>
      </td>
      <td className="py-3 px-4 text-sm text-gray-600">
        {report.scanTime.toLocaleString('en-US')}
      </td>
      <td className="py-3 px-4">
        <Badge className={getRiskLevelColor(report.aiPriority)}>
          {report.aiPriority.toUpperCase()}
        </Badge>
      </td>
      <td className="py-3 px-4">
        <div className="flex items-center gap-2">
          <div className="w-16 bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-1000 ${
                report.riskScore >= 80 ? 'bg-red-500' :
                report.riskScore >= 60 ? 'bg-orange-500' :
                report.riskScore >= 40 ? 'bg-yellow-500' : 'bg-green-500'
              }`}
              style={{ width: `${report.riskScore}%` }}
            ></div>
          </div>
          <span className="text-sm font-medium">{report.riskScore}</span>
        </div>
      </td>
      <td className="py-3 px-4">
        <Badge className={getStatusColor(report.status)}>
          {getStatusText(report.status)}
        </Badge>
      </td>
    </tr>
  );
}

// Critical Case Card Component
interface CriticalCaseCardProps {
  case_: MTFCase;
  onSelect: () => void;
  getRiskLevelColor: (level: string) => string;
  getStatusColor: (status: string) => string;
  getUrgencyIcon: (urgency: number) => React.ReactNode;
}

function CriticalCaseCard({ case_, onSelect, getRiskLevelColor, getStatusColor, getUrgencyIcon }: CriticalCaseCardProps) {
  return (
    <Card className="border-l-4 border-l-red-500 bg-gradient-to-r from-red-50 to-red-100 hover:from-red-100 hover:to-red-200 transition-all duration-200 shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="space-y-3 flex-1">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-red-200 rounded-lg flex items-center justify-center">
                <User className="h-4 w-4 text-red-600" />
              </div>
              <div>
                <div className="font-semibold text-lg text-gray-900">{case_.patientName}</div>
                <div className="text-sm text-gray-600">{case_.age}y {case_.gender === 'female' ? 'F' : 'M'} • {case_.patientId}</div>
              </div>
              <div className="flex gap-2">
                <Badge className={getRiskLevelColor(case_.riskLevel)}>
                  {case_.riskLevel.toUpperCase()}
                </Badge>
                {case_.mtfSuspected && (
                  <Badge variant="destructive">MTF Suspected</Badge>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="bg-white/60 p-2 rounded-lg">
                <div className="text-gray-500 text-xs">Risk Score</div>
                <div className="font-bold text-red-600">{case_.riskScore}/100</div>
              </div>
              <div className="bg-white/60 p-2 rounded-lg">
                <div className="text-gray-500 text-xs">Confidence</div>
                <div className="font-bold text-gray-900">{case_.confidence}%</div>
              </div>
              <div className="bg-white/60 p-2 rounded-lg">
                <div className="text-gray-500 text-xs">Report Type</div>
                <div className="font-bold text-gray-900">{case_.reportType.toUpperCase()}</div>
              </div>
              <div className="bg-white/60 p-2 rounded-lg">
                <div className="text-gray-500 text-xs">Urgency</div>
                <div className="font-bold text-gray-900 flex items-center gap-1">
                  {getUrgencyIcon(case_.urgency)}
                  {case_.urgency}h
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge className={getStatusColor(case_.status)}>
                  {case_.status === 'pending' ? 'Pending' : 
                   case_.status === 'reviewed' ? 'Reviewed' :
                   case_.status === 'contacted' ? 'Contacted' : 'Completed'}
                </Badge>
                {case_.specialistReferral && (
                  <Badge variant="outline" className="border-red-300 text-red-700">
                    Specialist Referral Required
                  </Badge>
                )}
              </div>
              <div className="text-xs text-gray-500">
                {case_.createdAt.toLocaleString('en-US')}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 ml-4">
            <Button size="sm" variant="outline" onClick={onSelect} className="text-red-700 border-red-300 hover:bg-red-50">
              View Details
            </Button>
            <Button size="sm" variant="outline" className="text-red-700 border-red-300 hover:bg-red-50">
              <Phone className="w-3 h-3 mr-1" />
              Contact
            </Button>
            <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white">
              <Mail className="w-3 h-3 mr-1" />
              Outreach
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// MTF病例卡片组件
interface MTFCaseCardProps {
  case_: MTFCase;
  onSelect: () => void;
  getRiskLevelColor: (level: string) => string;
  getStatusColor: (status: string) => string;
  getUrgencyIcon: (urgency: number) => React.ReactNode;
  compact?: boolean;
}

function MTFCaseCard({ case_, onSelect, getRiskLevelColor, getStatusColor, getUrgencyIcon, compact = false }: MTFCaseCardProps) {
  if (compact) {
    return (
      <Card className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={onSelect}>
        <CardContent className="p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <User className="h-4 w-4 text-gray-500" />
              <div>
                <div className="font-medium">{case_.patientName}</div>
                <div className="text-sm text-gray-500">{case_.age}y {case_.gender === 'female' ? 'F' : 'M'}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={getRiskLevelColor(case_.riskLevel)}>
                {case_.riskLevel.toUpperCase()}
              </Badge>
              <Badge className={getStatusColor(case_.status)}>
                {case_.status === 'pending' ? 'Pending' : 
                 case_.status === 'reviewed' ? 'Reviewed' :
                 case_.status === 'contacted' ? 'Contacted' : 'Completed'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-l-4 border-l-blue-500 hover:bg-gray-50 transition-colors">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-3">
              <User className="h-4 w-4 text-gray-500" />
              <span className="font-medium text-lg">{case_.patientName}</span>
              <Badge variant="outline">{case_.age}y {case_.gender === 'female' ? 'F' : 'M'}</Badge>
              <Badge className={getRiskLevelColor(case_.riskLevel)}>
                {case_.riskLevel.toUpperCase()}
              </Badge>
              {case_.mtfSuspected && (
                <Badge variant="destructive">MTF Suspected</Badge>
              )}
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Risk Score:</span>
                <span className="ml-2 font-medium">{case_.riskScore}/100</span>
              </div>
              <div>
                <span className="text-gray-500">Confidence:</span>
                <span className="ml-2 font-medium">{case_.confidence}%</span>
              </div>
              <div>
                <span className="text-gray-500">Report Type:</span>
                <span className="ml-2 font-medium">{case_.reportType.toUpperCase()}</span>
              </div>
              <div className="flex items-center">
                <span className="text-gray-500">Urgency:</span>
                <span className="ml-2 flex items-center gap-1">
                  {getUrgencyIcon(case_.urgency)}
                  {case_.urgency}h
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge className={getStatusColor(case_.status)}>
                {case_.status === 'pending' ? 'Pending' : 
                 case_.status === 'reviewed' ? 'Reviewed' :
                 case_.status === 'contacted' ? 'Contacted' : 'Completed'}
              </Badge>
              {case_.specialistReferral && (
                <Badge variant="outline">Specialist Referral Required</Badge>
              )}
              <span className="text-xs text-gray-500">
                {case_.createdAt.toLocaleString('en-US')}
              </span>
            </div>
          </div>

          <div className="flex gap-2 ml-4">
            <Button size="sm" variant="outline" onClick={onSelect}>
              View Details
            </Button>
            {case_.status === 'pending' && (
              <>
                <Button size="sm" variant="outline">
                  <Phone className="w-4 h-4 mr-1" />
                  Contact Patient
                </Button>
                <Button size="sm">
                  <Mail className="w-4 h-4 mr-1" />
                  Send Outreach
                </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

