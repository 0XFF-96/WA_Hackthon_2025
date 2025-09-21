import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Textarea } from '@/components/ui/textarea';
import { 
  Shield, 
  Activity, 
  BarChart3,
  TrendingUp,
  Users,
  Brain,
  Scan,
  Monitor,
  Upload,
  Search,
  AlertCircle,
  Mail,
  ChevronRight,
  FileText,
  Bot,
  UserCheck,
  Clock,
  Star,
  CheckCircle,
  Eye,
  Send,
  Timer,
  Stethoscope,
  FlaskConical,
  MousePointer2,
  Check,
  X,
  Filter,
  MoreHorizontal,
  ChevronDown,
  User,
  Calendar,
  MapPin,
  Heart,
  MessageSquare,
  Phone,
  Edit,
  RefreshCw,
  Copy,
  ExternalLink,
  Info,
  HelpCircle,
  MessageCircle,
  UserX,
  ArrowRight,
  Lightbulb,
  Target,
  Zap,
  ThumbsUp,
  ThumbsDown,
  Flag
} from 'lucide-react';

// Import the workflow visualization component
import { WorkflowVisualization } from './WorkflowVisualization';

interface MTFDetectionConsoleProps {
  onCaseSelect?: (caseId: string) => void;
}

interface FlowingDot {
  id: string;
  stage: number;
  progress: number;
  speed: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

interface ProcessingStageData {
  active: number;
  total: number;
  pending: number;
}

interface ProcessingData {
  import: ProcessingStageData;
  analysis: ProcessingStageData;
  risk: ProcessingStageData;
  outreach: ProcessingStageData;
}

interface SankeyData {
  gpReferrals: number;
  specialistReferrals: number;
  monitoring: number;
  discharged: number;
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
      {/* Animated Workflow */}
      <WorkflowVisualization />

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
  const [processingData, setProcessingData] = useState<ProcessingData>({
    import: { active: 12, total: 15, pending: 3 },
    analysis: { active: 8, total: 12, pending: 4 },
    risk: { active: 5, total: 8, pending: 3 },
    outreach: { active: 3, total: 5, pending: 2 }
  });

  const [sankeyData, setSankeyData] = useState<SankeyData>({
    gpReferrals: 42,
    specialistReferrals: 18,
    monitoring: 25,
    discharged: 15
  });

  const [flowingDots, setFlowingDots] = useState<FlowingDot[]>([]);

  // Generate flowing dots based on processing data
  useEffect(() => {
    const generateDots = () => {
      const stages: (keyof ProcessingData)[] = ['import', 'analysis', 'risk', 'outreach'];
      const newDots: FlowingDot[] = [];
      
      stages.forEach((stage, stageIndex) => {
        const count = processingData[stage].active;
        for (let i = 0; i < count; i++) {
          const priorities: FlowingDot['priority'][] = ['low', 'medium', 'high', 'critical'];
          newDots.push({
            id: `${stage}-${i}`,
            stage: stageIndex,
            progress: Math.random() * 100,
            speed: 0.5 + Math.random() * 1.0,
            priority: priorities[Math.floor(Math.random() * 4)]
          });
        }
      });
      
      setFlowingDots(newDots);
    };

    generateDots();
    const interval = setInterval(generateDots, 3000);
    return () => clearInterval(interval);
  }, [processingData]);

  // Update processing data periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setProcessingData(prev => ({
        import: { 
          active: 10 + Math.floor(Math.random() * 8), 
          total: 15, 
          pending: Math.floor(Math.random() * 5) 
        },
        analysis: { 
          active: 6 + Math.floor(Math.random() * 8), 
          total: 12, 
          pending: Math.floor(Math.random() * 6) 
        },
        risk: { 
          active: 3 + Math.floor(Math.random() * 6), 
          total: 8, 
          pending: Math.floor(Math.random() * 4) 
        },
        outreach: { 
          active: 2 + Math.floor(Math.random() * 4), 
          total: 5, 
          pending: Math.floor(Math.random() * 3) 
        }
      }));

      setSankeyData(prev => ({
        gpReferrals: 35 + Math.floor(Math.random() * 15),
        specialistReferrals: 15 + Math.floor(Math.random() * 10),
        monitoring: 20 + Math.floor(Math.random() * 10),
        discharged: 10 + Math.floor(Math.random() * 10)
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* AI Processing Pipeline */}
      <Card className="border-t-4 border-t-purple-500 bg-gradient-to-r from-purple-50 to-indigo-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-600" />
            AI Processing Pipeline
            <Badge variant="secondary" className="ml-auto bg-green-100 text-green-800">
              Live Processing
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ProcessingPipeline 
            processingData={processingData} 
            flowingDots={flowingDots}
          />
        </CardContent>
      </Card>

      {/* AI Report Auto-Scanning KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { 
            icon: Scan, 
            label: "Total Reports Scanned", 
            value: 1247 + (processingData.import.active + processingData.analysis.active), 
            change: "+12%", 
            color: "text-blue-600", 
            bgColor: "bg-blue-50",
            borderColor: "border-blue-200"
          },
          { 
            icon: Shield, 
            label: "Suspected MTF Cases", 
            value: 89 + Math.floor(processingData.risk.active * 0.6), 
            change: "+8%", 
            color: "text-red-600", 
            bgColor: "bg-red-50",
            borderColor: "border-red-200"
          },
          { 
            icon: Activity, 
            label: "Processing Queue", 
            value: Object.values(processingData).reduce((sum, stage) => sum + stage.active, 0), 
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
                  <p className="text-2xl font-bold text-gray-900 animate-metric-update">{stat.value}</p>
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

      {/* Enhanced Interactive Report Table */}
      <EnhancedReportTable />
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

// Processing Pipeline Component with Flowing Dots
function ProcessingPipeline({ processingData, flowingDots }: { 
  processingData: ProcessingData; 
  flowingDots: FlowingDot[];
}) {
  const stages = [
    { id: 'import', label: 'Import', icon: Upload, color: 'blue' },
    { id: 'analysis', label: 'Analysis', icon: Bot, color: 'purple' },
    { id: 'risk', label: 'Risk', icon: AlertCircle, color: 'orange' },
    { id: 'outreach', label: 'Outreach', icon: Mail, color: 'green' }
  ];

  return (
    <div className="space-y-6">
      {/* Pipeline Stages */}
      <div className="relative">
        <div className="grid grid-cols-4 gap-4">
          {stages.map((stage, index) => {
            const data = processingData[stage.id as keyof ProcessingData];
            const progressPercentage = (data.active / data.total) * 100;
            
            return (
              <div key={stage.id} className="relative">
                {/* Connection Line */}
                {index < stages.length - 1 && (
                  <div className="absolute top-8 left-full w-4 h-0.5 bg-gray-300 z-0">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50 animate-workflow-flow"></div>
                  </div>
                )}
                
                {/* Stage Card */}
                <div className={`relative bg-white border-2 border-${stage.color}-200 rounded-lg p-4 hover:shadow-md transition-all duration-300`}>
                  {/* Flowing Dots */}
                  <div className="absolute inset-0 overflow-hidden rounded-lg">
                    {flowingDots
                      .filter(dot => dot.stage === index)
                      .slice(0, 3) // Limit visible dots
                      .map(dot => (
                        <div
                          key={dot.id}
                          className={`absolute w-2 h-2 rounded-full animate-data-flow ${
                            dot.priority === 'critical' ? 'bg-red-500' :
                            dot.priority === 'high' ? 'bg-orange-500' :
                            dot.priority === 'medium' ? 'bg-blue-500' : 'bg-green-500'
                          }`}
                          style={{
                            top: `${20 + Math.random() * 60}%`,
                            animationDelay: `${Math.random() * 2}s`,
                            animationDuration: `${2 + Math.random() * 2}s`
                          }}
                        />
                      ))
                    }
                  </div>
                  
                  {/* Stage Content */}
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-3">
                      <div className={`w-8 h-8 bg-${stage.color}-100 rounded-lg flex items-center justify-center`}>
                        <stage.icon className={`w-4 h-4 text-${stage.color}-600`} />
                      </div>
                      <span className="font-medium text-gray-900">{stage.label}</span>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Active</span>
                        <span className="font-bold text-gray-900">{data.active}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 bg-${stage.color}-500 rounded-full transition-all duration-1000 animate-progress-wave`}
                          style={{ width: `${progressPercentage}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Pending: {data.pending}</span>
                        <span>{Math.round(progressPercentage)}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mini Sankey Diagram */}
      <MiniSankeyDiagram />
    </div>
  );
}

// Mini Sankey Diagram Component
function MiniSankeyDiagram() {
  const [sankeyData, setSankeyData] = useState({
    gpReferrals: 42,
    specialistReferrals: 18,
    monitoring: 25,
    discharged: 15
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setSankeyData({
        gpReferrals: 35 + Math.floor(Math.random() * 15),
        specialistReferrals: 15 + Math.floor(Math.random() * 10),
        monitoring: 20 + Math.floor(Math.random() * 10),
        discharged: 10 + Math.floor(Math.random() * 10)
      });
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  const total = Object.values(sankeyData).reduce((sum, val) => sum + val, 0);

  return (
    <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-l-4 border-l-indigo-500">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-base">
          <div className="w-6 h-6 bg-indigo-100 rounded-lg flex items-center justify-center mr-2">
            <BarChart3 className="w-3 h-3 text-indigo-600" />
          </div>
          Case Distribution Flow
          <Badge variant="secondary" className="ml-auto text-xs">
            Real-time
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Flow Bars */}
          <div className="space-y-3">
            {[
              { key: 'gpReferrals', label: 'GP Referrals', color: 'bg-blue-500', icon: UserCheck },
              { key: 'specialistReferrals', label: 'Specialist Referrals', color: 'bg-red-500', icon: Users },
              { key: 'monitoring', label: 'Continued Monitoring', color: 'bg-yellow-500', icon: Monitor },
              { key: 'discharged', label: 'Discharged', color: 'bg-green-500', icon: Shield }
            ].map(item => {
              const value = sankeyData[item.key as keyof SankeyData];
              const percentage = (value / total) * 100;
              
              return (
                <div key={item.key} className="flex items-center gap-3">
                  <div className="w-16 text-xs text-gray-600 flex items-center gap-1">
                    <item.icon className="w-3 h-3" />
                    {item.label.split(' ')[0]}
                  </div>
                  <div className="flex-1 relative">
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className={`h-3 ${item.color} rounded-full transition-all duration-1000 relative overflow-hidden`}
                        style={{ width: `${percentage}%` }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-workflow-flow"></div>
                      </div>
                    </div>
                    <div className="absolute -top-6 right-0 text-xs font-medium text-gray-700">
                      {value} ({Math.round(percentage)}%)
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary */}
          <div className="flex justify-between items-center pt-2 border-t border-gray-200">
            <span className="text-sm font-medium text-gray-700">Total Processed</span>
            <span className="text-lg font-bold text-indigo-600 animate-metric-update">{total}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Enhanced Interactive Report Table Component
function EnhancedReportTable() {
  const [, setLocation] = useLocation();
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [isDetailPanelOpen, setIsDetailPanelOpen] = useState(false);
  const [reports, setReports] = useState([
    {
      id: 'scan_001',
      patientId: 'P001234',
      patientName: 'Sarah Johnson',
      age: 72,
      gender: 'Female',
      scanType: 'X-Ray',
      scanTime: new Date('2024-01-20T10:30:00'),
      aiPriority: 'critical',
      riskScore: 89,
      status: 'pending_review',
      isNew: true,
      // Detailed information
      reportSummary: 'Acute fracture of the distal radius with dorsal angulation. No evidence of comminution. Soft tissue swelling present.',
      fractureLocation: 'Distal Radius',
      injuryMechanism: 'Fall from standing height',
      aiConfidence: 0.94,
      riskFactors: ['Age >70', 'Female gender', 'Low trauma mechanism', 'Previous fracture history'],
      aiExplanation: [
        { type: 'positive', text: 'Age >70 years increases MTF likelihood' },
        { type: 'positive', text: 'Fall from standing height indicates minimal trauma' },
        { type: 'positive', text: 'Distal radius is common MTF location' },
        { type: 'negative', text: 'No vertebral or hip involvement detected' }
      ],
      emailStatus: 'pending',
      emailContent: null
    },
    {
      id: 'scan_002', 
      patientId: 'P001235',
      patientName: 'Michael Chen',
      age: 45,
      gender: 'Male',
      scanType: 'CT Scan',
      scanTime: new Date('2024-01-20T10:25:00'),
      aiPriority: 'high',
      riskScore: 76,
      status: 'outreach_sent',
      isNew: false,
      reportSummary: 'Multiple rib fractures (ribs 4-6) on the left side. Pneumothorax not present. Associated soft tissue contusion.',
      fractureLocation: 'Multiple Ribs (4-6)',
      injuryMechanism: 'Motor vehicle collision',
      aiConfidence: 0.82,
      riskFactors: ['Male gender', 'High-energy trauma', 'Age <50'],
      aiExplanation: [
        { type: 'negative', text: 'Motor vehicle collision indicates high-energy trauma' },
        { type: 'negative', text: 'Age <50 reduces MTF probability' },
        { type: 'negative', text: 'Rib fractures less commonly associated with osteoporosis' },
        { type: 'positive', text: 'Multiple fractures warrant bone density evaluation' }
      ],
      emailStatus: 'sent',
      emailSentTime: new Date('2024-01-20T11:15:00'),
      emailContent: {
        subject: 'Your recent scan results – Bone Health Information',
        body: `Dear Michael Chen,

Our system has reviewed your recent imaging report following your motor vehicle collision. While the findings suggest a moderate likelihood of requiring bone health evaluation, the high-energy nature of your injury makes this less likely to be related to osteoporosis.

However, we encourage you to:
• Follow up with your primary care physician regarding the rib fractures
• Discuss bone health during your recovery period
• Maintain healthy lifestyle and bone care (calcium/vitamin D, regular exercise)

If you experience persistent pain or new symptoms, please seek medical review promptly.

Regards,
Bone Health Care Team`
      }
    },
    {
      id: 'scan_003',
      patientId: 'P001236',
      patientName: 'Emma Rodriguez',
      age: 35,
      gender: 'Female',
      scanType: 'MRI',
      scanTime: new Date('2024-01-20T10:20:00'),
      aiPriority: 'medium',
      riskScore: 62,
      status: 'completed',
      isNew: false,
      reportSummary: 'No acute fracture identified. Mild bone marrow edema in the distal tibia consistent with stress reaction.',
      fractureLocation: 'None (Stress reaction)',
      injuryMechanism: 'Running/Athletic activity',
      aiConfidence: 0.71,
      riskFactors: ['Female gender', 'Athletic activity', 'Age <40'],
      aiExplanation: [
        { type: 'negative', text: 'No acute fracture detected' },
        { type: 'negative', text: 'Age <40 significantly reduces MTF risk' },
        { type: 'negative', text: 'Athletic stress reaction, not traumatic injury' },
        { type: 'positive', text: 'Female gender warrants monitoring' }
      ],
      emailStatus: 'not_required',
      emailContent: null
    }
  ]);

  // Simulate new reports arriving
  useEffect(() => {
    const interval = setInterval(() => {
      const newReport = {
        id: `scan_${Date.now()}`,
        patientId: `P00${Math.floor(Math.random() * 9999)}`,
        patientName: ['John Doe', 'Jane Smith', 'Bob Wilson', 'Alice Brown'][Math.floor(Math.random() * 4)],
        age: Math.floor(Math.random() * 60) + 20,
        gender: ['Male', 'Female'][Math.floor(Math.random() * 2)],
        scanType: ['X-Ray', 'CT Scan', 'MRI'][Math.floor(Math.random() * 3)],
        scanTime: new Date(),
        aiPriority: ['critical', 'high', 'medium', 'low'][Math.floor(Math.random() * 4)],
        riskScore: Math.floor(Math.random() * 100),
        status: 'pending_review',
        isNew: true,
        reportSummary: 'Automated scan result generated for demo purposes.',
        fractureLocation: 'To be determined',
        injuryMechanism: 'Unknown',
        aiConfidence: 0.75,
        riskFactors: ['Age factor', 'Gender factor'],
        aiExplanation: [
          { type: 'positive', text: 'Initial assessment positive' },
          { type: 'negative', text: 'Requires further review' }
        ],
        emailStatus: 'pending',
        emailContent: null
      };

      setReports(prev => [newReport, ...prev.slice(0, 9)]);
      
      // Remove new flag after animation
      setTimeout(() => {
        setReports(prev => prev.map(r => r.id === newReport.id ? { ...r, isNew: false } : r));
      }, 3000);
    }, 15000); // New report every 15 seconds

    return () => clearInterval(interval);
  }, []);

  const getRelativeTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
  };

  const getScanTypeIcon = (type: string) => {
    switch (type) {
      case 'X-Ray': return <Monitor className="w-4 h-4" />;
      case 'CT Scan': return <Scan className="w-4 h-4" />;
      case 'MRI': return <Brain className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getPriorityConfig = (priority: string) => {
    switch (priority) {
      case 'critical':
        return {
          icon: <AlertCircle className="w-3 h-3" />,
          bgClass: 'bg-red-100',
          textClass: 'text-red-800',
        };
      case 'high':
        return {
          icon: <Star className="w-3 h-3" />,
          bgClass: 'bg-orange-100',
          textClass: 'text-orange-800',
        };
      case 'medium':
        return {
          icon: <Timer className="w-3 h-3" />,
          bgClass: 'bg-yellow-100',
          textClass: 'text-yellow-800',
        };
      default:
        return {
          icon: <CheckCircle className="w-3 h-3" />,
          bgClass: 'bg-green-100',
          textClass: 'text-green-800',
        };
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'pending_review':
        return {
          icon: <Eye className="w-3 h-3" />,
          bgClass: 'bg-yellow-100',
          textClass: 'text-yellow-800',
          label: 'Pending Review'
        };
      case 'outreach_sent':
        return {
          icon: <Send className="w-3 h-3" />,
          bgClass: 'bg-blue-100',
          textClass: 'text-blue-800',
          label: 'Outreach Sent'
        };
      case 'completed':
        return {
          icon: <CheckCircle className="w-3 h-3" />,
          bgClass: 'bg-green-100',
          textClass: 'text-green-800',
          label: 'Completed'
        };
      default:
        return {
          icon: <Clock className="w-3 h-3" />,
          bgClass: 'bg-gray-100',
          textClass: 'text-gray-800',
          label: 'Processing'
        };
    }
  };

  const handleRowClick = (reportId: string) => {
    // Navigate to dedicated case detail page
    setLocation(`/case-detail/${reportId}`);
  };

  const handleRowSelect = (reportId: string) => {
    setSelectedRows(prev => 
      prev.includes(reportId) 
        ? prev.filter(id => id !== reportId)
        : [...prev, reportId]
    );
  };

  return (
    <Card className="shadow-sm overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center text-lg">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
              <Scan className="w-4 h-4 text-purple-600" />
            </div>
            Recent Scan Results
            <Badge className="ml-3 bg-green-100 text-green-700">
              Live
            </Badge>
          </CardTitle>
          
          {selectedRows.length > 0 && (
            <div className="flex items-center gap-2">
              <Badge className="bg-blue-100 text-blue-800">
                {selectedRows.length} selected
              </Badge>
              <Button size="sm" variant="outline">
                <Eye className="w-3 h-3 mr-1" />
                Review
              </Button>
              <Button size="sm" variant="outline">
                <Send className="w-3 h-3 mr-1" />
                Send Outreach
              </Button>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr className="border-b border-gray-200">
                <th className="text-left py-4 px-4 font-semibold text-gray-700">
                  <input 
                    type="checkbox" 
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedRows(reports.map(r => r.id));
                      } else {
                        setSelectedRows([]);
                      }
                    }}
                    checked={selectedRows.length === reports.length}
                  />
                </th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Patient ID
                  </div>
                </th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">
                  <div className="flex items-center gap-2">
                    <Stethoscope className="w-4 h-4" />
                    Scan Type
                  </div>
                </th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Scan Time
                  </div>
                </th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    AI Priority
                  </div>
                </th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4" />
                    Risk Score
                  </div>
                </th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4" />
                    Status
                  </div>
                </th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report, index) => {
                const priorityConfig = getPriorityConfig(report.aiPriority);
                const statusConfig = getStatusConfig(report.status);
                const isSelected = selectedRows.includes(report.id);
                
                return (
                  <tr 
                    key={report.id}
                    className={`border-b border-gray-100 transition-all duration-200 cursor-pointer
                      ${report.isNew ? 'animate-slide-in-up bg-blue-50' : ''}
                      ${isSelected ? 'bg-purple-50 border-purple-200' : 'hover:bg-gray-50'}
                      ${report.aiPriority === 'critical' ? 'border-l-4 border-l-red-500' : ''}
                      group
                    `}
                    onClick={() => handleRowClick(report.id)}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <td className="py-4 px-4" onClick={(e) => e.stopPropagation()}>
                      <input 
                        type="checkbox"
                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                        checked={isSelected}
                        onChange={() => handleRowSelect(report.id)}
                      />
                    </td>
                    
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <User className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{report.patientId}</div>
                          {report.isNew && (
                            <div className="text-xs text-blue-600 font-medium">New Case</div>
                          )}
                        </div>
                      </div>
                    </td>
                    
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                          {getScanTypeIcon(report.scanType)}
                        </div>
                        <Badge variant="outline" className="font-medium">
                          {report.scanType}
                        </Badge>
                      </div>
                    </td>
                    
                    <td className="py-4 px-4">
                      <div className="space-y-1">
                        <div className="text-sm font-medium text-gray-900">
                          {report.scanTime.toLocaleTimeString('en-US', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </div>
                        <div className="text-xs text-gray-500">
                          {getRelativeTime(report.scanTime)}
                        </div>
                      </div>
                    </td>
                    
                    <td className="py-4 px-4">
                      <Badge 
                        className={`${priorityConfig.bgClass} ${priorityConfig.textClass} font-medium`}
                      >
                        <span className="flex items-center gap-1">
                          {priorityConfig.icon}
                          {report.aiPriority.toUpperCase()}
                        </span>
                      </Badge>
                    </td>
                    
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${
                              report.riskScore >= 80 ? 'bg-red-500' :
                              report.riskScore >= 60 ? 'bg-orange-500' :
                              report.riskScore >= 40 ? 'bg-yellow-500' : 'bg-green-500'
                            }`}
                            style={{ 
                              width: `${report.riskScore}%`
                            }}
                          />
                        </div>
                        <span className={`text-sm font-bold ${
                          report.riskScore >= 80 ? 'text-red-600' :
                          report.riskScore >= 60 ? 'text-orange-600' :
                          report.riskScore >= 40 ? 'text-yellow-600' : 'text-green-600'
                        }`}>
                          {report.riskScore}
                        </span>
                      </div>
                    </td>
                    
                    <td className="py-4 px-4">
                      <Badge 
                        className={`${statusConfig.bgClass} ${statusConfig.textClass} font-medium`}
                      >
                        <span className="flex items-center gap-1">
                          {statusConfig.icon}
                          {statusConfig.label}
                        </span>
                      </Badge>
                    </td>
                    
                    <td className="py-4 px-4" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                          <Send className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>

      {/* Detail Panel - Centered Modal */}
    </Card>
  );
}

export default MTFDetectionConsole;
// helper functions used below (kept for potential future use in page-level detail)
const highlightClinicalKeywords = (text: string) => {
    const keywords = [
      'high-energy trauma', 'low-energy trauma', 'minimal trauma',
      'vertebral fracture', 'hip fracture', 'distal radius',
      'osteoporosis', 'bone density', 'DEXA scan',
      'fall from height', 'motor vehicle', 'bicycle accident'
    ];
    
    let highlightedText = text;
    keywords.forEach(keyword => {
      const regex = new RegExp(`(${keyword})`, 'gi');
      highlightedText = highlightedText.replace(regex, '<mark class="bg-yellow-200 px-1 rounded">$1</mark>');
    });
    
    return highlightedText;
  };

  const getNextStepRecommendation = (score: number, aiPriority: string) => {
    if (score >= 80) {
      return {
        action: 'refer_specialist',
        icon: <AlertCircle className="w-5 h-5 text-red-600" />,
        title: 'Refer to Specialist',
        description: 'High MTF risk requires specialist evaluation',
        color: 'border-red-200 bg-red-50'
      };
    } else if (score >= 60) {
      return {
        action: 'send_gp',
        icon: <Send className="w-5 h-5 text-orange-600" />,
        title: 'Send to GP',
        description: 'Moderate risk, GP follow-up recommended',
        color: 'border-orange-200 bg-orange-50'
      };
    } else {
      return {
        action: 'no_action',
        icon: <CheckCircle className="w-5 h-5 text-green-600" />,
        title: 'No Action Required',
        description: 'Low risk, routine monitoring sufficient',
        color: 'border-green-200 bg-green-50'
      };
    }
  };

  const getRiskFactorDefinition = (factor: string) => {
    const definitions: Record<string, string> = {
      'Age >70': 'Advanced age increases bone fragility and fracture risk',
      'Female gender': 'Post-menopausal women have higher osteoporosis risk',
      'Low trauma mechanism': 'Fractures from minimal force suggest bone weakness',
      'Previous fracture history': 'Past fractures indicate ongoing bone health issues',
      'Male gender': 'While less common, male osteoporosis is underdiagnosed',
      'High-energy trauma': 'Severe force injuries less likely related to bone fragility',
      'Age <50': 'Younger patients typically have stronger bones',
      'Athletic activity': 'Regular exercise usually strengthens bones'
    };
    return definitions[factor] || 'Clinical risk factor for bone health assessment';
  };

  // NOTE: Case detail modal was removed; the variables below are no longer needed here.
  // Keeping function utilities local to the previous modal is unnecessary; references removed.

  const getEmailStatusConfig = (status: string) => {
    switch (status) {
      case 'sent':
        return { 
          color: 'bg-green-100 text-green-800', 
          icon: <CheckCircle className="w-4 h-4" />, 
          label: 'Email Sent' 
        };
      case 'pending':
        return { 
          color: 'bg-yellow-100 text-yellow-800', 
          icon: <Clock className="w-4 h-4" />, 
          label: 'Pending Send' 
        };
      case 'failed':
        return { 
          color: 'bg-red-100 text-red-800', 
          icon: <X className="w-4 h-4" />, 
          label: 'Send Failed' 
        };
      default:
        return { 
          color: 'bg-gray-100 text-gray-800', 
          icon: <Info className="w-4 h-4" />, 
          label: 'Not Required' 
        };
    }
  };

//   return (
//     <TooltipProvider>
//       <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
//         {/* Modal Header */
//         <div className="flex-shrink-0 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white p-6 relative overflow-hidden">
//           {/* Background Pattern */}
//           <div className="absolute inset-0 opacity-10">
//             <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full -translate-x-20 -translate-y-20"></div>
//             <div className="absolute bottom-0 right-0 w-32 h-32 bg-white rounded-full translate-x-16 translate-y-16"></div>
//             <div className="absolute top-1/2 left-1/3 w-20 h-20 bg-white rounded-full -translate-y-10"></div>
//           </div>
          
//           <div className="relative z-10">
//             <DialogHeader>
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-4">
//                   <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
//                     <User className="w-7 h-7 text-white" />
//                   </div>
//                   <div>
//                     <DialogTitle className="text-3xl font-bold text-white mb-1">
//                       {report.patientName}
//                     </DialogTitle>
//                     <div className="text-white/90 text-sm font-medium">
//                       Case ID: {report.patientId} • {report.scanType} • {report.scanTime.toLocaleDateString()}
//                     </div>
//                   </div>
//                 </div>
//                 <Button variant="ghost" size="lg" onClick={onClose} className="text-white hover:bg-white/20 h-12 w-12 rounded-full">
//                   <X className="w-6 h-6" />
//                 </Button>
//               </div>
//             </DialogHeader>

//             {/* MTF Classification Banner - Integrated in Header */}
//             <div className="mt-6 flex items-center justify-between">
//               <div className={`flex items-center gap-3 px-6 py-3 rounded-full ${mtfClassification.color} shadow-xl backdrop-blur-sm`}>
//                 {mtfClassification.icon}
//                 <span className="font-bold text-xl">{mtfClassification.label}</span>
//               </div>
//               <Badge className="bg-white/20 text-white border border-white/30 backdrop-blur-sm px-4 py-2 text-sm font-medium">
//                 Triage: {mtfClassification.isMTF ? 'Eligible' : 'Not Eligible'}
//               </Badge>
//             </div>
//             <div className="mt-2 text-white/80 text-sm max-w-2xl">
//               {mtfClassification.description}
//             </div>
//           </div>
//         </div>

//         {/* Main Content Area */}
//         <div className="flex-1 overflow-y-auto">
//           <div className="p-8 space-y-8">
            
//             {/* Two-Column Layout for Better Space Utilization */}
//             <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              
//               {/* Left Column - Patient & Report Info */}
//               <div className="space-y-6">
                
//                 {/* Patient Information Card */}
//                 <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
//                   <CardHeader className="pb-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
//                     <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
//                       <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
//                         <User className="w-5 h-5 text-blue-600" />
//                       </div>
//                       Patient Information
//                     </h3>
//                   </CardHeader>
//                   <CardContent className="p-6">
//                     <div className="grid grid-cols-2 gap-6">
//                       <div className="space-y-4">
//                         <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
//                           <div className="text-xs text-blue-600 font-semibold uppercase tracking-wide mb-1">Patient Name</div>
//                           <div className="text-lg font-bold text-gray-900">{report.patientName || 'Unknown'}</div>
//                         </div>
//                         <div className="p-4 bg-green-50 rounded-xl border border-green-100">
//                           <div className="text-xs text-green-600 font-semibold uppercase tracking-wide mb-1">Age / Gender</div>
//                           <div className="text-lg font-bold text-gray-900">{report.age} / {report.gender}</div>
//                         </div>
//                       </div>
//                       <div className="space-y-4">
//                         <div className="p-4 bg-purple-50 rounded-xl border border-purple-100">
//                           <div className="text-xs text-purple-600 font-semibold uppercase tracking-wide mb-1">Scan Time</div>
//                           <div className="text-lg font-bold text-gray-900">{report.scanTime.toLocaleDateString()}</div>
//                           <div className="text-sm text-gray-500">{report.scanTime.toLocaleTimeString()}</div>
//                         </div>
//                         <div className="p-4 bg-orange-50 rounded-xl border border-orange-100">
//                           <div className="text-xs text-orange-600 font-semibold uppercase tracking-wide mb-1">Scan Type</div>
//                           <div className="text-lg font-bold text-gray-900">{report.scanType}</div>
//                         </div>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>

//                 {/* Radiology Report Card */}
//                 <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
//                   <CardHeader className="pb-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-t-lg">
//                     <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
//                       <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
//                         <FileText className="w-5 h-5 text-amber-600" />
//                       </div>
//                       Radiology Report
//                     </h3>
//                   </CardHeader>
//                   <CardContent className="p-6 space-y-6">
//                     {/* Report Text */}
//                     <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-2xl border border-amber-200">
//                       <p 
//                         className="text-base text-gray-700 italic leading-relaxed font-medium"
//                         dangerouslySetInnerHTML={{ 
//                           __html: `"${highlightClinicalKeywords(report.reportSummary)}"` 
//                         }}
//                       />
//                     </div>
                    
//                     {/* Helper Text */}
//                     <div className="flex items-center gap-2 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
//                       <Lightbulb className="w-5 h-5 text-yellow-600" />
//                       <span className="text-sm text-yellow-800 font-medium">Clinical keywords are highlighted for rapid assessment</span>
//                     </div>
                    
//                     {/* Key Details */}
//                     <div className="grid grid-cols-1 gap-4">
//                       <div className="p-4 bg-red-50 rounded-xl border border-red-100">
//                         <div className="text-xs text-red-600 font-semibold uppercase tracking-wide mb-1">Fracture Location</div>
//                         <div className="text-lg font-bold text-gray-900">{report.fractureLocation}</div>
//                       </div>
//                       <div className="p-4 bg-pink-50 rounded-xl border border-pink-100">
//                         <div className="text-xs text-pink-600 font-semibold uppercase tracking-wide mb-1">Injury Mechanism</div>
//                         <div className="text-lg font-bold text-gray-900">{report.injuryMechanism}</div>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//               </div>

//               {/* Right Column - AI Assessment & Actions */}
//               <div className="space-y-6">
                
//                 {/* AI Risk Assessment Card */}
//                 <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
//                   <CardHeader className="pb-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-t-lg">
//                     <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
//                       <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
//                         <Brain className="w-5 h-5 text-purple-600" />
//                       </div>
//                       AI Risk Assessment
//                     </h3>
//                   </CardHeader>
//                   <CardContent className="p-6 space-y-6">
//                     {/* Risk Score Display */}
//                     <div className="text-center space-y-4">
//                       <div className="text-7xl font-bold bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent">
//                         {report.riskScore}
//                       </div>
//                       <div className="text-sm text-gray-500 uppercase tracking-wider font-semibold">MTF Risk Score</div>
//                       <div className="text-2xl font-bold text-gray-900">
//                         {report.riskScore >= 80 ? 'High Risk' : 
//                          report.riskScore >= 60 ? 'Moderate Risk' : 
//                          report.riskScore >= 40 ? 'Low-Moderate Risk' : 'Low Risk'}
//                       </div>
//                     </div>

//                     {/* Enhanced Progress Bar */}
//                     <div className="space-y-4">
//                       <div className="flex justify-between text-sm text-gray-600 font-medium">
//                         <span>Low Risk</span>
//                         <span>High Risk</span>
//                       </div>
//                       <div className="relative h-6 bg-gray-200 rounded-full overflow-hidden shadow-inner">
//                         <div 
//                           className={`h-full bg-gradient-to-r ${getProgressBarColor(report.riskScore)} transition-all duration-1000 ease-out rounded-full shadow-lg`}
//                           style={{ width: `${report.riskScore}%` }}
//                         />
//                         {/* Risk threshold markers */}
//                         <div className="absolute top-0 left-[60%] w-1 h-6 bg-white opacity-80" />
//                         <div className="absolute top-0 left-[80%] w-1 h-6 bg-white opacity-80" />
//                       </div>
//                       <div className="flex justify-between text-xs text-gray-500">
//                         <span>0</span>
//                         <span className="absolute left-[60%] transform -translate-x-1/2 font-semibold">60</span>
//                         <span className="absolute left-[80%] transform -translate-x-1/2 font-semibold">80</span>
//                         <span>100</span>
//                       </div>
//                     </div>

//                     {/* AI Confidence */}
//                     <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-6 rounded-2xl border border-purple-200">
//                       <div className="flex items-center justify-between">
//                         <div>
//                           <div className="text-sm text-gray-600 flex items-center gap-2 font-medium">
//                             AI Confidence
//                             <Tooltip>
//                               <TooltipTrigger>
//                                 <HelpCircle className="w-4 h-4 text-gray-400" />
//                               </TooltipTrigger>
//                               <TooltipContent>
//                                 <p className="max-w-xs">
//                                   AI confidence indicates how certain the model is about this prediction. 
//                                   Higher confidence (&gt;90%) suggests more reliable assessment.
//                                 </p>
//                               </TooltipContent>
//                             </Tooltip>
//                           </div>
//                           <div className="text-3xl font-bold text-purple-600">
//                             {Math.round(report.aiConfidence * 100)}%
//                           </div>
//                         </div>
//                         <div className="text-right">
//                           <Badge className={`text-base px-4 py-2 ${
//                             report.aiConfidence >= 0.9 ? 'bg-green-100 text-green-800' :
//                             report.aiConfidence >= 0.8 ? 'bg-blue-100 text-blue-800' :
//                             report.aiConfidence >= 0.7 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
//                           }`}>
//                             {report.aiConfidence >= 0.9 ? 'Very High' :
//                              report.aiConfidence >= 0.8 ? 'High' :
//                              report.aiConfidence >= 0.7 ? 'Moderate' : 'Low'} Confidence
//                           </Badge>
//                         </div>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
                
//                 {/* Risk Factors Card */}
//                 <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
//                   <CardHeader className="pb-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-t-lg">
//                     <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
//                       <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
//                         <AlertCircle className="w-5 h-5 text-blue-600" />
//                       </div>
//                       Risk Factors
//                     </h3>
//                   </CardHeader>
//                   <CardContent className="p-6 space-y-4">
//                     {report.riskFactors.map((factor: string, index: number) => (
//                       <Tooltip key={index}>
//                         <TooltipTrigger asChild>
//                           <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100 rounded-xl cursor-pointer transition-all duration-200 border border-blue-200 hover:border-blue-300 group hover:shadow-lg">
//                             <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
//                               <AlertCircle className="w-5 h-5 text-blue-600" />
//                             </div>
//                             <span className="text-base font-semibold text-blue-900 flex-1">{factor}</span>
//                             <HelpCircle className="w-5 h-5 text-blue-500 opacity-70 group-hover:opacity-100 transition-opacity" />
//                           </div>
//                         </TooltipTrigger>
//                         <TooltipContent>
//                           <p className="max-w-xs">{getRiskFactorDefinition(factor)}</p>
//                         </TooltipContent>
//                       </Tooltip>
//                     ))}
//                     <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
//                       <div className="text-sm text-blue-700 flex items-center gap-2 font-medium">
//                         <Target className="w-5 h-5" />
//                         Hover over risk factors for detailed clinical explanations
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//               </div>
//             </div>
            
//             {/* Full-Width Sections */}
//             <div className="space-y-8">
              
//               {/* AI Analysis & Actions Row */}
//               <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                
//                 {/* AI Explanation */}
//                 <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm xl:col-span-2">
//                   <CardHeader className="pb-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-lg">
//                     <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
//                       <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
//                         <Brain className="w-5 h-5 text-green-600" />
//                       </div>
//                       Explainable AI Analysis
//                     </h3>
//                   </CardHeader>
//                   <CardContent className="p-6 space-y-4">
//                     {report.aiExplanation.map((explanation: any, index: number) => (
//                       <div 
//                         key={index} 
//                         className={`flex items-start gap-4 p-4 rounded-xl transition-all duration-300 border-2 ${
//                           explanation.type === 'positive' 
//                             ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 hover:border-green-300' 
//                             : 'bg-gradient-to-r from-red-50 to-pink-50 border-red-200 hover:border-red-300'
//                         }`}
//                         style={{ animationDelay: `${index * 150}ms` }}
//                       >
//                         <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
//                           explanation.type === 'positive' ? 'bg-green-100' : 'bg-red-100'
//                         }`}>
//                           {explanation.type === 'positive' ? (
//                             <CheckCircle className="w-6 h-6 text-green-600 animate-fade-in-right" />
//                           ) : (
//                             <X className="w-6 h-6 text-red-600 animate-fade-in-right" />
//                           )}
//                         </div>
//                         <span className={`text-base font-medium flex-1 ${
//                           explanation.type === 'positive' ? 'text-green-800' : 'text-red-800'
//                         }`}>
//                           {explanation.text}
//                         </span>
//                       </div>
//                     ))}
//                   </CardContent>
//                 </Card>

//                   {/* Next Steps Recommendation */}
//                   {showNextSteps && (
//                     <Card className={`shadow-xl border-0 bg-white/80 backdrop-blur-sm border-l-4 ${nextStepRecommendation.color}`}>
//                       <CardHeader className="pb-3">
//                         <div className="flex items-center justify-between">
//                           <h4 className="font-semibold text-gray-900 flex items-center gap-2">
//                             <Lightbulb className="w-5 h-5 text-yellow-600" />
//                             Next Steps
//                           </h4>
//                           <Button 
//                             variant="ghost" 
//                             size="sm" 
//                             onClick={() => setShowNextSteps(false)}
//                             className="h-8 w-8 p-0"
//                           >
//                             <X className="w-4 h-4" />
//                           </Button>
//                         </div>
//                       </CardHeader>
//                       <CardContent className="p-4">
//                         <div className="flex items-start gap-4">
//                           <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-100 to-orange-100 flex items-center justify-center">
//                             {nextStepRecommendation.icon}
//                           </div>
//                           <div className="flex-1 space-y-3">
//                             <div>
//                               <div className="font-bold text-lg text-gray-900">
//                                 {nextStepRecommendation.title}
//                               </div>
//                               <div className="text-sm text-gray-600 mt-1">
//                                 {nextStepRecommendation.description}
//                               </div>
//                             </div>
//                             <div className="flex flex-col gap-2">
//                               <Button size="sm" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
//                                 <ArrowRight className="w-4 h-4 mr-2" />
//                                 Take Action
//                               </Button>
//                               <Button size="sm" variant="outline" className="w-full">
//                                 Schedule Later
//                               </Button>
//                             </div>
//                           </div>
//                         </div>
//                       </CardContent>
//                     </Card>
//                   )}

//                   {/* Clinical Review */}
//                   <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
//                     <CardHeader className="pb-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-lg">
//                       <h4 className="font-semibold text-gray-900 flex items-center gap-2">
//                         <MessageCircle className="w-5 h-5 text-purple-600" />
//                         Clinical Review
//                       </h4>
//                     </CardHeader>
//                     <CardContent className="p-4 space-y-4">
//                       {/* AI Agreement */}
//                       <div>
//                         <div className="text-sm font-medium text-gray-700 mb-3">
//                           Do you agree with the AI assessment?
//                         </div>
//                         <div className="grid grid-cols-2 gap-2">
//                           <Button
//                             size="sm"
//                             variant={aiOverride === 'agree' ? 'default' : 'outline'}
//                             onClick={() => setAiOverride('agree')}
//                             className="flex items-center gap-2"
//                           >
//                             <ThumbsUp className="w-4 h-4" />
//                             Agree
//                           </Button>
//                           <Button
//                             size="sm"
//                             variant={aiOverride === 'disagree' ? 'destructive' : 'outline'}
//                             onClick={() => setAiOverride('disagree')}
//                             className="flex items-center gap-2"
//                           >
//                             <ThumbsDown className="w-4 h-4" />
//                             Disagree
//                           </Button>
//                         </div>
//                       </div>

//                       {/* Clinical Notes */}
//                       <div>
//                         <div className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
//                           <Edit className="w-4 h-4" />
//                           Clinical Notes
//                         </div>
//                         <Textarea
//                           placeholder="Add observations, concerns, or rationale..."
//                           value={clinicianComment}
//                           onChange={(e) => setClinicianComment(e.target.value)}
//                           className="min-h-[80px]"
//                         />
//                       </div>

//                       {/* Actions */}
//                       <div className="flex gap-2 pt-2 border-t border-gray-200">
//                         <Button size="sm" variant="outline" className="flex items-center gap-2">
//                           <Flag className="w-4 h-4" />
//                           Flag
//                         </Button>
//                         <Button size="sm" className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600">
//                           <CheckCircle className="w-4 h-4" />
//                           Save
//                         </Button>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 </div>
              
//               {/* Email Outreach - Full Width */}
//               <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
//                 <CardHeader className="pb-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-t-lg">
//                   <div className="flex items-center justify-between">
//                     <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
//                       <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
//                         <MessageSquare className="w-6 h-6 text-green-600" />
//                       </div>
//                       Patient Outreach Management
//                     </h3>
//                     <Badge className={`text-base px-4 py-2 ${getEmailStatusConfig(report.emailStatus || 'not_sent').color}`}>
//                       {getEmailStatusConfig(report.emailStatus || 'not_sent').icon}
//                       <span className="ml-2">{getEmailStatusConfig(report.emailStatus || 'not_sent').label}</span>
//                     </Badge>
//                   </div>
//                 </CardHeader>
//                 <CardContent className="p-6">
//             <div className="flex items-center justify-between mb-4">
//               <div className="flex items-center gap-3">
//                 <Badge className={getEmailStatusConfig(report.emailStatus).color}>
//                   <span className="flex items-center gap-1">
//                     {getEmailStatusConfig(report.emailStatus).icon}
//                     {getEmailStatusConfig(report.emailStatus).label}
//                   </span>
//                 </Badge>
//                 {report.emailSentTime && (
//                   <div className="text-sm text-gray-500">
//                     Sent: {report.emailSentTime.toLocaleString()}
//                   </div>
//                 )}
//               </div>
              
//               {report.emailStatus === 'sent' && (
//                 <div className="flex gap-2">
//                   <Button size="sm" variant="outline">
//                     <RefreshCw className="w-3 h-3 mr-1" />
//                     Resend
//                   </Button>
//                   <Button size="sm" variant="outline">
//                     <Edit className="w-3 h-3 mr-1" />
//                     Edit
//                   </Button>
//                 </div>
//               )}
//             </div>

//             {/* Email Content Preview */}
//             {report.emailContent && (
//               <div className="space-y-3">
//                 <div 
//                   className="border rounded-lg p-3 cursor-pointer transition-all duration-200 hover:bg-gray-50"
//                   onClick={() => setIsEmailExpanded(!isEmailExpanded)}
//                 >
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <div className="text-sm font-medium text-gray-900">
//                         Subject: {report.emailContent.subject}
//                       </div>
//                       <div className="text-xs text-gray-500 mt-1">
//                         Click to {isEmailExpanded ? 'collapse' : 'expand'} email content
//                       </div>
//                     </div>
//                     <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
//                       isEmailExpanded ? 'rotate-180' : ''
//                     }`} />
//                   </div>
//                 </div>

//                 {isEmailExpanded && (
//                   <div className="border rounded-lg p-4 bg-gray-50 animate-slide-in-up">
//                     <div className="space-y-3">
//                       <div className="flex items-center justify-between">
//                         <h5 className="font-semibold text-gray-900">Email Content</h5>
//                         <Button size="sm" variant="ghost">
//                           <Copy className="w-3 h-3 mr-1" />
//                           Copy
//                         </Button>
//                       </div>
//                       <div className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
//                         {report.emailContent.body}
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             )}

//             {report.emailStatus === 'pending' && (
//               <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
//                 <div className="flex items-center gap-2 mb-2">
//                   <Clock className="w-4 h-4 text-yellow-600" />
//                   <span className="text-sm font-medium text-yellow-800">Email Pending</span>
//                 </div>
//                 <p className="text-sm text-yellow-700">
//                   This case requires review before automated outreach can be sent.
//                 </p>
//                 <div className="flex gap-2 mt-3">
//                   <Button size="sm" className="bg-yellow-600 hover:bg-yellow-700">
//                     Generate & Send Email
//                   </Button>
//                   <Button size="sm" variant="outline">
//                     Mark as No Contact Required
//                   </Button>
//                 </div>
//               </div>
//             )}

//             {report.emailStatus === 'not_required' && (
//               <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
//                 <div className="flex items-center gap-2">
//                   <Info className="w-4 h-4 text-gray-600" />
//                   <span className="text-sm font-medium text-gray-800">No Outreach Required</span>
//                 </div>
//                 <p className="text-sm text-gray-600 mt-1">
//                   Based on the AI assessment, this case does not require patient outreach.
//                 </p>
//               </div>
//             )}
//                 </CardContent>
//               </Card>
//             </div>
//           </div>
//         </div>
//       </div>
//     </TooltipProvider>
//   );
// }

// export default MTFDetectionConsole;
