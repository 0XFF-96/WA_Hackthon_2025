import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PatientCard } from "@/components/PatientCard";
import { AiAgentCard } from "@/components/AiAgentCard";
import { DiagnosisWorkflow } from "@/components/DiagnosisWorkflow";
import { DataVisualization } from "@/components/DataVisualization";
import { MTFDetectionDashboard } from "@/components/mtf/MTFDetectionDashboard";
import { ReportImportHub } from "@/components/mtf/ReportImportHub";
import {
  Search,
  Plus,
  Filter,
  Users,
  Brain,
  Activity,
  Clock,
  AlertCircle,
  Shield,
  Upload,
  TrendingUp,
  FileText,
  LayoutDashboard,
} from "lucide-react";

export default function EnhancedDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeMainTab, setActiveMainTab] = useState("overview");

  // Mock data for traditional cases
  const recentCases = [
    {
      id: "1",
      name: "Sarah Johnson",
      age: 34,
      gender: "Female",
      medicalId: "MED-2024-0001",
      caseTitle: "Suspected minimal trauma fracture in wrist",
      status: "analyzing" as const,
      priority: "high" as const,
      lastUpdate: "2 mins ago",
    },
    {
      id: "2",
      name: "Michael Chen",
      age: 28,
      gender: "Male",
      medicalId: "MED-2024-0002",
      caseTitle: "Post-workout ankle pain assessment",
      status: "diagnosed" as const,
      priority: "medium" as const,
      lastUpdate: "15 mins ago",
    },
    {
      id: "3",
      name: "Emma Rodriguez",
      age: 42,
      gender: "Female",
      medicalId: "MED-2024-0003",
      caseTitle: "Chronic knee discomfort evaluation",
      status: "pending" as const,
      priority: "low" as const,
      lastUpdate: "1 hour ago",
    },
  ];

  const activeAgents = [
    {
      id: "1",
      name: "Dr. Neural",
      role: "diagnostician" as const,
      status: "busy" as const,
      confidence: 92,
      currentTask: "Analyzing patient MED-2024-0001 X-ray patterns",
    },
    {
      id: "2",
      name: "RadiologyAI",
      role: "radiologist" as const,
      status: "active" as const,
      confidence: 89,
      currentTask: "Processing minimal trauma fracture detection algorithms",
    },
    {
      id: "3",
      name: "TreatmentBot",
      role: "treatment_planner" as const,
      status: "idle" as const,
      confidence: 95,
    },
    {
      id: "4",
      name: "MTF Scanner",
      role: "mtf_detector" as const,
      status: "active" as const,
      confidence: 94,
      currentTask: "Scanning radiology reports for minimal trauma fractures",
    },
  ];

  const systemStats = [
    {
      icon: Users,
      label: "Active Cases",
      value: "23",
      change: "+12%",
      color: "text-blue-600",
    },
    {
      icon: Shield,
      label: "MTF Detected",
      value: "8",
      change: "+25%",
      color: "text-red-600",
    },
    {
      icon: Brain,
      label: "AI Agents",
      value: "8",
      change: "0%",
      color: "text-purple-600",
    },
    {
      icon: Activity,
      label: "Diagnoses Today",
      value: "47",
      change: "+8%",
      color: "text-green-600",
    },
    {
      icon: Clock,
      label: "Avg. Processing",
      value: "2.3s",
      change: "-15%",
      color: "text-orange-600",
    },
    {
      icon: TrendingUp,
      label: "Quality Score",
      value: "94.5",
      change: "+3%",
      color: "text-indigo-600",
    },
  ];

  const handleViewCase = (id: string) => {
    console.log("View case:", id);
  };

  const handleStepClick = (stepId: string) => {
    console.log("Step clicked:", stepId);
  };

  const handleNewCase = () => {
    console.log("New case clicked");
  };

  const handleMTFCaseSelect = (caseId: string) => {
    console.log("MTF case selected:", caseId);
    // 这里可以切换到详细视图或其他操作
  };

  const handleImportComplete = (result: any) => {
    console.log("Import completed:", result);
    // 这里可以更新状态或显示成功消息
  };

  const filteredCases = recentCases.filter(
    (case_) =>
      case_.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      case_.caseTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      case_.medicalId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6" data-testid="page-enhanced-dashboard">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold" data-testid="text-page-title">
            Healthcare AI Platform - Enhanced Dashboard
          </h1>
          <p className="text-muted-foreground">
            Integrated MTF Detection & Multi-Agent Diagnosis System
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge
            variant="secondary"
            className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
          >
            <Activity className="w-3 h-3 mr-1" />
            All Systems Operational
          </Badge>
          <Button onClick={handleNewCase} data-testid="button-new-case">
            <Plus className="w-4 h-4 mr-2" />
            New Case
          </Button>
        </div>
      </div>

      {/* Enhanced System Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        {systemStats.map((stat, index) => (
          <Card key={index} data-testid={`stat-card-${index}`}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p
                    className="text-2xl font-bold"
                    data-testid={`stat-value-${index}`}
                  >
                    {stat.value}
                  </p>
                </div>
                <div className="text-right">
                  <stat.icon className={`w-5 h-5 ${stat.color} mb-1`} />
                  <Badge variant="secondary" className="text-xs">
                    {stat.change}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content with Tabs */}
      <Tabs value={activeMainTab} onValueChange={setActiveMainTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <LayoutDashboard className="w-4 h-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="mtf-detection"
            className="flex items-center gap-2"
          >
            <Shield className="w-4 h-4" />
            MTF Detection
          </TabsTrigger>
          <TabsTrigger
            value="report-import"
            className="flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            Report Import
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab - Traditional Dashboard */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Cases */}
            <div className="lg:col-span-2 space-y-4">
              <Card>
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center">
                      <Users className="w-5 h-5 mr-2" />
                      Recent Cases
                    </CardTitle>
                    <div className="flex items-center space-x-2">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          placeholder="Search cases..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-9 w-48"
                          data-testid="input-search-cases"
                        />
                      </div>
                      <Button variant="outline" size="icon">
                        <Filter className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {filteredCases.length === 0 ? (
                    <p className="text-center text-muted-foreground py-4">
                      No cases found
                    </p>
                  ) : (
                    filteredCases.map((case_) => (
                      <PatientCard
                        key={case_.id}
                        {...case_}
                        onViewCase={handleViewCase}
                      />
                    ))
                  )}
                </CardContent>
              </Card>

              {/* Current Workflow */}
              <DiagnosisWorkflow
                patientName="Sarah Johnson"
                caseId="MED-2024-0001"
                currentStep={2}
                overallProgress={65}
                onStepClick={handleStepClick}
              />
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* AI Agents */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Brain className="w-5 h-5 mr-2" />
                    AI Agents
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {activeAgents.map((agent) => (
                    <AiAgentCard key={agent.id} {...agent} />
                  ))}
                </CardContent>
              </Card>

              {/* System Alerts */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-orange-600">
                    <AlertCircle className="w-5 h-5 mr-2" />
                    System Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start space-x-3 p-3 bg-red-50 dark:bg-red-950/20 rounded-lg">
                    <Shield className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium">MTF Cases Detected</p>
                      <p className="text-xs text-muted-foreground">
                        3 critical cases require immediate attention
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg">
                    <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium">High case volume</p>
                      <p className="text-xs text-muted-foreground">
                        Processing queue at 85% capacity
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                    <Activity className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium">Model update</p>
                      <p className="text-xs text-muted-foreground">
                        New AI model deployed successfully
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* MTF Detection Tab */}
        <TabsContent value="mtf-detection">
          <MTFDetectionDashboard onCaseSelect={handleMTFCaseSelect} />
        </TabsContent>

        {/* Report Import Tab */}
        <TabsContent value="report-import">
          <ReportImportHub onImportComplete={handleImportComplete} />
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Comprehensive System Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <DataVisualization />
            </CardContent>
          </Card>

          {/* MTF-specific analytics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  MTF Detection Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">
                      Detection Accuracy
                    </span>
                    <span className="font-medium">94.2%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">
                      Processing Speed
                    </span>
                    <span className="font-medium">2.3s avg</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">
                      False Positives
                    </span>
                    <span className="font-medium">5.8%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">
                      Cases Processed Today
                    </span>
                    <span className="font-medium">47</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  Patient Outreach Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Emails Sent</span>
                    <span className="font-medium">34</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Response Rate</span>
                    <span className="font-medium">78%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">
                      SMS Notifications
                    </span>
                    <span className="font-medium">12</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">
                      Phone Calls Made
                    </span>
                    <span className="font-medium">8</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
