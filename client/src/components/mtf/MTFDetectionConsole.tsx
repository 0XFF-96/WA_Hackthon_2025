import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  Activity, 
  BarChart3,
  TrendingUp,
  Users,
  Brain,
  Scan,
  Monitor
} from 'lucide-react';

// No longer importing MTFDetectionDashboard as we're splitting the functionality

interface MTFDetectionConsoleProps {
  onCaseSelect?: (caseId: string) => void;
}

export function MTFDetectionConsole({ onCaseSelect }: MTFDetectionConsoleProps) {
  const [activeConsoleTab, setActiveConsoleTab] = useState('overview');

  return (
    <div className="space-y-6">
      {/* Console Header */}
      <Card className="border-l-4 border-l-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">MTF Detection Console</h2>
                <p className="text-gray-600">Real-time monitoring and analysis dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                <Activity className="w-3 h-3 mr-1" />
                Active
              </Badge>
              <Button size="sm" variant="outline">
                <Scan className="w-4 h-4 mr-2" />
                Full Scan
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Console Tabs */}
      <Tabs value={activeConsoleTab} onValueChange={setActiveConsoleTab}>
        <TabsList className="grid w-full grid-cols-4 h-12 bg-gray-50 rounded-xl p-1">
          <TabsTrigger value="overview" className="flex items-center justify-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <Monitor className="w-4 h-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="scanning" className="flex items-center justify-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <Scan className="w-4 h-4" />
            AI Scanning
          </TabsTrigger>
          <TabsTrigger value="cases" className="flex items-center justify-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <Users className="w-4 h-4" />
            Cases
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center justify-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <BarChart3 className="w-4 h-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab - System Stats and Workflow */}
        <TabsContent value="overview" className="mt-6">
          <OverviewTab onCaseSelect={onCaseSelect} />
        </TabsContent>

        {/* AI Scanning Tab - Batch Processing and Report Analysis */}
        <TabsContent value="scanning" className="mt-6">
          <ScanningTab />
        </TabsContent>

        {/* Cases Tab - Critical Cases and Case Management */}
        <TabsContent value="cases" className="mt-6">
          <CasesTab onCaseSelect={onCaseSelect} />
        </TabsContent>

        {/* Analytics Tab - Risk Trends and Performance */}
        <TabsContent value="analytics" className="mt-6">
          <AnalyticsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Overview Tab Component
function OverviewTab({ onCaseSelect }: { onCaseSelect?: (caseId: string) => void }) {
  return (
    <div className="space-y-6">
      {/* System Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { icon: Shield, label: "Reports Processed", value: "1,247", change: "+12%", color: "text-blue-600", bgColor: "bg-blue-50" },
          { icon: Activity, label: "MTF Detected", value: "89", change: "+8%", color: "text-red-600", bgColor: "bg-red-50" },
          { icon: Monitor, label: "Pending Review", value: "23", change: "-5%", color: "text-orange-600", bgColor: "bg-orange-50" },
          { icon: Brain, label: "Avg Confidence", value: "94.2%", change: "+2%", color: "text-purple-600", bgColor: "bg-purple-50" },
        ].map((stat, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
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

      {/* Quick Actions */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-l-blue-500">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Quick Actions</h3>
              <p className="text-gray-600">Manage MTF detection workflow and system operations</p>
            </div>
            <div className="flex items-center gap-3">
              <Button size="sm" variant="outline">
                <Scan className="w-4 h-4 mr-2" />
                Start Batch Scan
              </Button>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                <Activity className="w-4 h-4 mr-2" />
                View All Cases
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Alerts */}
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center text-base">
            <div className="w-6 h-6 bg-yellow-100 rounded-lg flex items-center justify-center mr-2">
              <Activity className="w-3 h-3 text-yellow-600" />
            </div>
            System Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              {
                type: 'warning',
                message: '2 high-priority cases require immediate attention',
                time: '5 minutes ago',
                action: 'View Cases'
              },
              {
                type: 'info',
                message: 'Batch processing completed successfully (95/100)',
                time: '15 minutes ago',
                action: 'View Report'
              },
              {
                type: 'success',
                message: 'System performance optimal - 94.2% accuracy',
                time: '1 hour ago',
                action: 'View Details'
              }
            ].map((alert, index) => (
              <div key={index} className={`p-3 rounded-lg border-l-4 ${
                alert.type === 'warning' ? 'bg-yellow-50 border-l-yellow-400' :
                alert.type === 'info' ? 'bg-blue-50 border-l-blue-400' :
                'bg-green-50 border-l-green-400'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{alert.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
                  </div>
                  <Button size="sm" variant="outline" className="text-xs">
                    {alert.action}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Scanning Tab Component  
function ScanningTab() {
  return (
    <div className="space-y-6">
      {/* AI Report Auto-Scanning KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { 
            icon: Scan, 
            label: "Total Reports Scanned", 
            value: 1247, 
            change: "+12%", 
            color: "text-blue-600", 
            bgColor: "bg-blue-50",
            borderColor: "border-blue-200"
          },
          { 
            icon: Shield, 
            label: "Suspected MTF Cases", 
            value: 89, 
            change: "+8%", 
            color: "text-red-600", 
            bgColor: "bg-red-50",
            borderColor: "border-red-200"
          },
          { 
            icon: Activity, 
            label: "Processing Queue", 
            value: 156, 
            change: "+15%", 
            color: "text-orange-600", 
            bgColor: "bg-orange-50",
            borderColor: "border-orange-200"
          },
          { 
            icon: Brain, 
            label: "AI Confidence Avg", 
            value: "94.2%", 
            change: "+2%", 
            color: "text-purple-600", 
            bgColor: "bg-purple-50",
            borderColor: "border-purple-200"
          },
        ].map((stat, index) => (
          <Card key={index} className={`hover:shadow-lg transition-all duration-300 border-l-4 ${stat.borderColor} ${stat.bgColor}`}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
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
              <Scan className="w-3 h-3 text-purple-600" />
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
                {[
                  {
                    id: 'scan_001',
                    patientId: 'P001234',
                    scanType: 'X-Ray',
                    scanTime: '10:30 AM',
                    aiPriority: 'critical',
                    riskScore: 89,
                    status: 'pending_review'
                  },
                  {
                    id: 'scan_002',
                    patientId: 'P001235',
                    scanType: 'CT Scan',
                    scanTime: '10:25 AM',
                    aiPriority: 'high',
                    riskScore: 76,
                    status: 'outreach_sent'
                  },
                  {
                    id: 'scan_003',
                    patientId: 'P001236',
                    scanType: 'MRI',
                    scanTime: '10:20 AM',
                    aiPriority: 'medium',
                    riskScore: 62,
                    status: 'completed'
                  }
                ].map((report) => (
                  <tr key={report.id} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 font-medium text-gray-900">{report.patientId}</td>
                    <td className="py-3 px-4">
                      <Badge variant="outline" className="uppercase">
                        {report.scanType}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">{report.scanTime}</td>
                    <td className="py-3 px-4">
                      <Badge className={
                        report.aiPriority === 'critical' ? 'bg-red-100 text-red-800' :
                        report.aiPriority === 'high' ? 'bg-orange-100 text-orange-800' :
                        report.aiPriority === 'medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                      }>
                        {report.aiPriority.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
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
                      <Badge className={
                        report.status === 'outreach_sent' ? 'bg-green-100 text-green-800' :
                        report.status === 'pending_review' ? 'bg-yellow-100 text-yellow-800' :
                        report.status === 'processing' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                      }>
                        {report.status === 'outreach_sent' ? 'Outreach Sent' :
                         report.status === 'pending_review' ? 'Pending Review' :
                         report.status === 'processing' ? 'Processing' : 'Completed'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Cases Tab Component
function CasesTab({ onCaseSelect }: { onCaseSelect?: (caseId: string) => void }) {
  const criticalCases = [
    {
      id: 'case_001',
      patientName: 'Margaret Johnson',
      patientId: 'P001234',
      age: 73,
      gender: 'female',
      riskScore: 89,
      riskLevel: 'critical',
      mtfSuspected: true,
      status: 'pending',
      specialistReferral: true,
      createdAt: new Date('2024-01-15T10:30:00')
    },
    {
      id: 'case_002',
      patientName: 'Robert Smith',
      patientId: 'P001235',
      age: 68,
      gender: 'male',
      riskScore: 82,
      riskLevel: 'critical',
      mtfSuspected: true,
      status: 'reviewed',
      specialistReferral: true,
      createdAt: new Date('2024-01-15T10:25:00')
    }
  ];

  return (
    <div className="space-y-6">
      {/* Critical Cases Alert */}
      <Card className="border-red-200 bg-gradient-to-r from-red-50 to-red-100 shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-red-600" />
              <span className="text-red-800 font-medium">
                <strong>{criticalCases.length} critical MTF cases</strong> require specialist evaluation within 24 hours
              </span>
            </div>
            <Button size="sm" variant="outline" className="text-red-700 border-red-300 hover:bg-red-100">
              View All Cases
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Critical Cases List */}
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center text-lg">
            <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mr-3">
              <Shield className="w-4 h-4 text-red-600" />
            </div>
            Critical Cases ({criticalCases.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {criticalCases.map((case_) => (
              <div key={case_.id} className="border-l-4 border-l-red-500 bg-gradient-to-r from-red-50 to-red-100 hover:from-red-100 hover:to-red-200 transition-all duration-200 shadow-sm rounded-lg">
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-red-200 rounded-lg flex items-center justify-center">
                          <Users className="h-4 w-4 text-red-600" />
                        </div>
                        <div>
                          <div className="font-semibold text-lg text-gray-900">{case_.patientName}</div>
                          <div className="text-sm text-gray-600">{case_.age}y {case_.gender === 'female' ? 'F' : 'M'} • {case_.patientId}</div>
                        </div>
                        <div className="flex gap-2">
                          <Badge className="bg-red-100 text-red-800 border-red-200">
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
                          <div className="text-gray-500 text-xs">Status</div>
                          <div className="font-bold text-gray-900">{case_.status}</div>
                        </div>
                        <div className="bg-white/60 p-2 rounded-lg">
                          <div className="text-gray-500 text-xs">Specialist</div>
                          <div className="font-bold text-gray-900">{case_.specialistReferral ? 'Required' : 'Not Required'}</div>
                        </div>
                        <div className="bg-white/60 p-2 rounded-lg">
                          <div className="text-gray-500 text-xs">Created</div>
                          <div className="font-bold text-gray-900">{case_.createdAt.toLocaleDateString()}</div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 ml-4">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => onCaseSelect?.(case_.id)}
                        className="text-red-700 border-red-300 hover:bg-red-50"
                      >
                        View Details
                      </Button>
                      <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white">
                        Contact Patient
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Cases */}
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center text-base">
            <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center mr-2">
              <Users className="w-3 h-3 text-blue-600" />
            </div>
            Recent Cases
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { id: 'case_003', name: 'Alice Brown', riskScore: 72, status: 'reviewed' },
              { id: 'case_004', name: 'David Wilson', riskScore: 65, status: 'contacted' },
              { id: 'case_005', name: 'Emma Davis', riskScore: 58, status: 'completed' }
            ].map((case_) => (
              <div key={case_.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Users className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{case_.name}</div>
                    <div className="text-sm text-gray-600">Risk Score: {case_.riskScore}/100</div>
                  </div>
                </div>
                <Badge variant="outline">{case_.status}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Analytics Tab Component
function AnalyticsTab() {
  return (
    <div className="space-y-6">
      {/* Trend Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Cases",
            value: 555,
            change: "+18%",
            color: "text-blue-600",
            bgColor: "bg-blue-50",
            icon: Shield
          },
          {
            label: "Critical Cases",
            value: 73,
            change: "+25%",
            color: "text-red-600",
            bgColor: "bg-red-50",
            icon: Activity
          },
          {
            label: "High Risk",
            value: 128,
            change: "+12%",
            color: "text-orange-600",
            bgColor: "bg-orange-50",
            icon: TrendingUp
          },
          {
            label: "Avg Daily",
            value: 79,
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

      {/* Weekly Pattern Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border border-gray-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center">
              <div className="w-6 h-6 bg-indigo-100 rounded-lg flex items-center justify-center mr-2">
                <BarChart3 className="w-3 h-3 text-indigo-600" />
              </div>
              Weekly Pattern Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <span className="text-sm font-medium text-blue-900">Peak Day</span>
                <span className="text-lg font-bold text-blue-600">Wednesday</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span className="text-sm font-medium text-green-900">Lowest Day</span>
                <span className="text-lg font-bold text-green-600">Saturday</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                <span className="text-sm font-medium text-purple-900">Avg Weekend</span>
                <span className="text-lg font-bold text-purple-600">45 cases</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                <span className="text-sm font-medium text-orange-900">Avg Weekday</span>
                <span className="text-lg font-bold text-orange-600">67 cases</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Risk Level Trends */}
        <Card className="border border-gray-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center">
              <div className="w-6 h-6 bg-pink-100 rounded-lg flex items-center justify-center mr-2">
                <TrendingUp className="w-3 h-3 text-pink-600" />
              </div>
              Risk Level Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { level: 'Critical', trend: '+25%', color: 'red', icon: Activity },
                { level: 'High', trend: '+12%', color: 'orange', icon: TrendingUp },
                { level: 'Medium', trend: '+8%', color: 'yellow', icon: BarChart3 },
                { level: 'Low', trend: '-5%', color: 'green', icon: Shield }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 bg-${item.color}-100 rounded-lg flex items-center justify-center`}>
                      <item.icon className={`w-4 h-4 text-${item.color}-600`} />
                    </div>
                    <span className="font-medium text-gray-900">{item.level}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-bold ${
                      item.trend.startsWith('+') ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {item.trend}
                    </span>
                    <span className="text-xs text-gray-500">vs last week</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
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
                <Activity className="w-6 h-6 text-indigo-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">Peak Risk</h4>
              <p className="text-2xl font-bold text-indigo-600 mb-1">Jan 18</p>
              <p className="text-sm text-gray-600">Predicted peak day</p>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border border-pink-200">
              <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Monitor className="w-6 h-6 text-pink-600" />
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
  );
}
