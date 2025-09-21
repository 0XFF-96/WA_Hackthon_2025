import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield, 
  AlertTriangle, 
  Clock, 
  User, 
  FileText, 
  TrendingUp,
  Brain,
  BarChart3,
  CheckCircle,
  Search,
  Filter,
  Scan,
  AlertCircle,
  Eye,
  FileCheck,
  Mail
} from 'lucide-react';

import { MTFDetectionConsoleProps } from '@/types/mtf-console';
import { useMTFData, useKPIData, useBatchProcessing, useRiskTrendData, useReportScanData } from '@/hooks/useMTFData';
import { filterCases, sortCasesByPriority } from '@/lib/mtf-utils';
import { WorkflowProgress } from './dashboard/WorkflowProgress';
import { AnimatedCounter } from './dashboard/AnimatedCounter';
import { ReportTableRow } from './dashboard/ReportTableRow';
import { CriticalCaseCard } from './dashboard/CriticalCaseCard';
import { MTFCaseCard } from './dashboard/MTFCaseCard';
import { BatchProcessingMonitor } from './dashboard/BatchProcessingMonitor';

export function MTFDetectionDashboard({ onCaseSelect }: MTFDetectionConsoleProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentWorkflowStep, setCurrentWorkflowStep] = useState(1);
  const [showAlert, setShowAlert] = useState(false);

  const { mtfCases, systemStats, isLoading } = useMTFData();
  const { kpiData } = useKPIData();
  const { batchProcessingData } = useBatchProcessing();
  const { riskTrendData } = useRiskTrendData();
  const { reportScanData } = useReportScanData();

  // Filter and sort cases
  const filteredCases = filterCases(mtfCases, searchQuery);
  const criticalCases = filteredCases.filter(c => c.riskLevel === 'critical' || c.mtfSuspected);
  const pendingCases = filteredCases.filter(c => c.status === 'pending');
  const sortedCriticalCases = sortCasesByPriority(criticalCases);

  useEffect(() => {
    // Show alert after data loads
    setTimeout(() => {
      setShowAlert(true);
    }, 1200);
  }, []);

  const handleWorkflowStepClick = (stepId: number) => {
    if (stepId <= currentWorkflowStep + 1) {
      setCurrentWorkflowStep(stepId);
      console.log('Workflow step clicked:', stepId);
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
      <WorkflowProgress 
        currentWorkflowStep={currentWorkflowStep}
        onWorkflowStepClick={handleWorkflowStepClick}
      />

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
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Batch Processing Monitor */}
        <BatchProcessingMonitor batchProcessingData={batchProcessingData} />

        {/* Risk Trend Section */}
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center text-base">
                <div className="w-6 h-6 bg-emerald-100 rounded-lg flex items-center justify-center mr-2">
                  <TrendingUp className="w-3 h-3 text-emerald-600" />
                </div>
                Risk Trend Analysis
              </CardTitle>
              <div className="flex items-center gap-2">
                <select 
                  className="px-3 py-1 text-sm border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  defaultValue="7days"
                >
                  <option value="7days">Last 7 Days</option>
                  <option value="30days">Last 30 Days</option>
                  <option value="90days">Last 90 Days</option>
                  <option value="1year">Last Year</option>
                </select>
                <Button size="sm" variant="outline" className="text-gray-600 border-gray-300 hover:bg-gray-50">
                  <BarChart3 className="w-4 h-4 mr-1" />
                  Export
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Trend Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  {
                    label: "Total Cases",
                    value: riskTrendData.reduce((sum, day) => sum + day.critical + day.high + day.medium + day.low, 0),
                    change: "+18%",
                    color: "text-blue-600",
                    bgColor: "bg-blue-50",
                    icon: FileText
                  },
                  {
                    label: "Critical Cases",
                    value: riskTrendData.reduce((sum, day) => sum + day.critical, 0),
                    change: "+25%",
                    color: "text-red-600",
                    bgColor: "bg-red-50",
                    icon: AlertTriangle
                  },
                  {
                    label: "High Risk",
                    value: riskTrendData.reduce((sum, day) => sum + day.high, 0),
                    change: "+12%",
                    color: "text-orange-600",
                    bgColor: "bg-orange-50",
                    icon: TrendingUp
                  },
                  {
                    label: "Avg Daily",
                    value: Math.round(riskTrendData.reduce((sum, day) => sum + day.critical + day.high + day.medium + day.low, 0) / riskTrendData.length),
                    change: "+8%",
                    color: "text-green-600",
                    bgColor: "bg-green-50",
                    icon: BarChart3
                  }
                ].map((stat, index) => (
                  <div key={index} className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 font-medium">{stat.label}</p>
                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                        <Badge variant="secondary" className="text-xs mt-1">
                          {stat.change}
                        </Badge>
                      </div>
                      <div className={`w-10 h-10 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                        <stat.icon className={`w-5 h-5 ${stat.color}`} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Peak Detection Alert */}
              <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-amber-900">Peak Detection Alert</h4>
                    <p className="text-sm text-amber-800">
                      Highest risk day detected: <strong>January 12, 2024</strong> with 100 total cases
                    </p>
                  </div>
                  <Button size="sm" variant="outline" className="text-amber-700 border-amber-300 hover:bg-amber-100">
                    View Details
                  </Button>
                </div>
              </div>

              {/* AI Predictive Analysis */}
              <Card className="border border-purple-200 bg-gradient-to-br from-purple-50 to-indigo-50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center">
                    <div className="w-6 h-6 bg-purple-100 rounded-lg flex items-center justify-center mr-2">
                      <Brain className="w-3 h-3 text-purple-600" />
                    </div>
                    AI Predictive Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-white rounded-lg border border-purple-200">
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <TrendingUp className="w-6 h-6 text-purple-600" />
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-1">Next 7 Days</h4>
                      <p className="text-2xl font-bold text-purple-600 mb-1">+15%</p>
                      <p className="text-sm text-gray-600">Expected increase</p>
                    </div>
                    <div className="text-center p-4 bg-white rounded-lg border border-indigo-200">
                      <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <AlertTriangle className="w-6 h-6 text-indigo-600" />
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-1">Peak Risk</h4>
                      <p className="text-2xl font-bold text-indigo-600 mb-1">Jan 18</p>
                      <p className="text-sm text-gray-600">Predicted peak day</p>
                    </div>
                    <div className="text-center p-4 bg-white rounded-lg border border-pink-200">
                      <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Brain className="w-6 h-6 text-pink-600" />
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-1">Confidence</h4>
                      <p className="text-2xl font-bold text-pink-600 mb-1">87%</p>
                      <p className="text-sm text-gray-600">Prediction accuracy</p>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-white rounded-lg border border-gray-200">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Brain className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <h5 className="font-semibold text-gray-900 mb-1">AI Recommendation</h5>
                        <p className="text-sm text-gray-700">
                          Based on current trends and historical patterns, we recommend increasing 
                          staffing levels for the week of January 15-21 to handle the predicted 
                          15% increase in MTF cases. Consider pre-scheduling additional specialist 
                          consultations for high-risk patients.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
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
                sortedCriticalCases.map((case_) => (
                  <CriticalCaseCard 
                    key={case_.id} 
                    case_={case_} 
                    onSelect={() => onCaseSelect?.(case_.id)}
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