import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Brain,
  Activity,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  BarChart3,
  Users,
  Settings,
  RefreshCw,
  Eye,
  Star,
  Target,
  Zap,
  Shield,
  Heart,
  FileText,
  Stethoscope,
  Bot,
} from "lucide-react";
import {
  ExtendedAgentStatus,
  SystemOverview,
  ENHANCED_AGENT_CONFIG,
} from "@/types/agentChat";

// 模拟数据
const mockAgents: ExtendedAgentStatus[] = [
  {
    id: "orchestrator",
    name: "Bone Guardian Orchestrator",
    type: "orchestrator",
    status: "idle",
    lastActivity: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
    performance: {
      totalTasks: 156,
      successRate: 98.5,
      averageResponseTime: 1.2,
      confidence: 95,
      rubricScore: 92.3,
      improvementTrend: "improving",
    },
    health: {
      cpu: 15,
      memory: 45,
      uptime: 99.8,
    },
    recentEvaluations: [
      {
        diagnosticAccuracy: 5,
        consultationLogic: 4,
        treatmentPlan: 5,
        empathySkills: 4,
        ethicsCompliance: "compliant",
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
      },
    ],
  },
  {
    id: "diagnostician",
    name: "Dr. Neural",
    type: "diagnostician",
    status: "busy",
    currentTask:
      "Analyzing minimal trauma fracture patterns in Case MED-2024-0001",
    lastActivity: new Date(Date.now() - 30 * 1000), // 30 seconds ago
    performance: {
      totalTasks: 89,
      successRate: 96.2,
      averageResponseTime: 2.1,
      confidence: 92,
      rubricScore: 87.5,
      improvementTrend: "improving",
    },
    health: {
      cpu: 65,
      memory: 78,
      uptime: 99.5,
    },
    recentEvaluations: [
      {
        diagnosticAccuracy: 5,
        consultationLogic: 4,
        treatmentPlan: 4,
        empathySkills: 3,
        ethicsCompliance: "compliant",
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
      },
    ],
  },
  {
    id: "radiologist",
    name: "RadiologyAI",
    type: "radiologist",
    status: "idle",
    lastActivity: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
    performance: {
      totalTasks: 67,
      successRate: 94.8,
      averageResponseTime: 1.8,
      confidence: 88,
      rubricScore: 92.3,
      improvementTrend: "stable",
    },
    health: {
      cpu: 25,
      memory: 52,
      uptime: 99.9,
    },
    recentEvaluations: [
      {
        diagnosticAccuracy: 5,
        consultationLogic: 5,
        treatmentPlan: 4,
        empathySkills: 4,
        ethicsCompliance: "compliant",
        timestamp: new Date(Date.now() - 45 * 60 * 1000),
      },
    ],
  },
  {
    id: "treatment_planner",
    name: "TreatmentBot",
    type: "treatment_planner",
    status: "idle",
    lastActivity: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
    performance: {
      totalTasks: 45,
      successRate: 97.1,
      averageResponseTime: 1.5,
      confidence: 90,
      rubricScore: 89.1,
      improvementTrend: "improving",
    },
    health: {
      cpu: 20,
      memory: 38,
      uptime: 99.7,
    },
    recentEvaluations: [
      {
        diagnosticAccuracy: 4,
        consultationLogic: 4,
        treatmentPlan: 5,
        empathySkills: 4,
        ethicsCompliance: "compliant",
        timestamp: new Date(Date.now() - 20 * 60 * 1000),
      },
    ],
  },
  {
    id: "rubric_evaluator",
    name: "Clinical Rubric Evaluator",
    type: "rubric_evaluator",
    status: "idle",
    lastActivity: new Date(Date.now() - 1 * 60 * 1000), // 1 minute ago
    performance: {
      totalTasks: 234,
      successRate: 99.2,
      averageResponseTime: 0.8,
      confidence: 98,
      rubricScore: 95.7,
      improvementTrend: "stable",
    },
    health: {
      cpu: 10,
      memory: 25,
      uptime: 99.9,
    },
    recentEvaluations: [],
  },
];

// Agent状态卡片组件
function AgentStatusCard({ agent }: { agent: ExtendedAgentStatus }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "idle":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "busy":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      case "error":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      case "maintenance":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "idle":
        return <CheckCircle className="w-4 h-4" />;
      case "busy":
        return <Activity className="w-4 h-4" />;
      case "error":
        return <XCircle className="w-4 h-4" />;
      case "maintenance":
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "improving":
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case "declining":
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const getAgentIcon = (type: string) => {
    switch (type) {
      case "orchestrator":
        return <Bot className="w-5 h-5" />;
      case "diagnostician":
        return <Brain className="w-5 h-5" />;
      case "radiologist":
        return <FileText className="w-5 h-5" />;
      case "treatment_planner":
        return <Stethoscope className="w-5 h-5" />;
      case "rubric_evaluator":
        return <Target className="w-5 h-5" />;
      default:
        return <Brain className="w-5 h-5" />;
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              {getAgentIcon(agent.type)}
            </div>
            <div>
              <CardTitle className="text-lg">{agent.name}</CardTitle>
              <p className="text-sm text-muted-foreground capitalize">
                {agent.type}
              </p>
            </div>
          </div>
          <Badge className={getStatusColor(agent.status)}>
            <div className="flex items-center space-x-1">
              {getStatusIcon(agent.status)}
              <span className="capitalize">{agent.status}</span>
            </div>
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 当前任务 */}
        {agent.currentTask && (
          <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
            <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
              Current Task
            </p>
            <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
              {agent.currentTask}
            </p>
          </div>
        )}

        {/* 性能指标 */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Success Rate</span>
              <span className="font-medium">
                {agent.performance.successRate.toFixed(1)}%
              </span>
            </div>
            <Progress value={agent.performance.successRate} className="h-2" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Rubric Score</span>
              <span className="font-medium">
                {agent.performance.rubricScore.toFixed(1)}/100
              </span>
            </div>
            <Progress value={agent.performance.rubricScore} className="h-2" />
          </div>
        </div>

        {/* 详细指标 */}
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="text-center p-2 bg-gray-50 dark:bg-gray-900/50 rounded">
            <div className="font-medium">{agent.performance.totalTasks}</div>
            <div className="text-muted-foreground">Tasks</div>
          </div>
          <div className="text-center p-2 bg-gray-50 dark:bg-gray-900/50 rounded">
            <div className="font-medium">
              {agent.performance.averageResponseTime}s
            </div>
            <div className="text-muted-foreground">Avg Time</div>
          </div>
          <div className="text-center p-2 bg-gray-50 dark:bg-gray-900/50 rounded">
            <div className="font-medium">{agent.performance.confidence}%</div>
            <div className="text-muted-foreground">Confidence</div>
          </div>
        </div>

        {/* 改进趋势 */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            Improvement Trend
          </span>
          <div className="flex items-center space-x-1">
            {getTrendIcon(agent.performance.improvementTrend)}
            <span className="text-sm capitalize">
              {agent.performance.improvementTrend}
            </span>
          </div>
        </div>

        {/* 系统健康 */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>System Health</span>
            <span className="text-green-600 font-medium">
              {agent.health.uptime.toFixed(1)}%
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>CPU: {agent.health.cpu}%</div>
            <div>Memory: {agent.health.memory}%</div>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex space-x-2 pt-2">
          <Button variant="outline" size="sm" className="flex-1">
            <Eye className="w-3 h-3 mr-1" />
            View Details
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="w-3 h-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// 评分趋势图表组件
function RubricTrendChart({ agent }: { agent: ExtendedAgentStatus }) {
  const renderStars = (score: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-3 h-3 ${
          i < score ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  if (agent.recentEvaluations.length === 0) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        <BarChart3 className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">No recent evaluations</p>
      </div>
    );
  }

  const latest = agent.recentEvaluations[0];

  return (
    <div className="space-y-3">
      <div className="text-sm font-medium">Latest Rubric Evaluation</div>
      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span>Diagnostic</span>
            <div className="flex">{renderStars(latest.diagnosticAccuracy)}</div>
          </div>
          <div className="flex items-center justify-between">
            <span>Logic</span>
            <div className="flex">{renderStars(latest.consultationLogic)}</div>
          </div>
          <div className="flex items-center justify-between">
            <span>Treatment</span>
            <div className="flex">{renderStars(latest.treatmentPlan)}</div>
          </div>
        </div>
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span>Empathy</span>
            <div className="flex">{renderStars(latest.empathySkills)}</div>
          </div>
          <div className="flex items-center justify-between">
            <span>Ethics</span>
            <div className="flex items-center">
              {latest.ethicsCompliance === "compliant" && (
                <CheckCircle className="w-3 h-3 text-green-500" />
              )}
              {latest.ethicsCompliance === "warning" && (
                <AlertTriangle className="w-3 h-3 text-yellow-500" />
              )}
              {latest.ethicsCompliance === "risk" && (
                <XCircle className="w-3 h-3 text-red-500" />
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="text-xs text-muted-foreground">
        Last updated: {latest.timestamp.toLocaleString()}
      </div>
    </div>
  );
}

export default function AIAgents() {
  const [agents, setAgents] = useState<ExtendedAgentStatus[]>(mockAgents);
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshData = async () => {
    setIsRefreshing(true);
    // 模拟数据刷新
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  const selectedAgentData = agents.find((agent) => agent.id === selectedAgent);

  return (
    <div className="p-6 space-y-6" data-testid="page-ai-agents">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" data-testid="text-page-title">
            AI Agents
          </h1>
          <p className="text-muted-foreground">
            Monitor AI agent performance, status, and clinical rubric
            evaluations
          </p>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={refreshData}
            disabled={isRefreshing}
          >
            <RefreshCw
              className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
          <Button>
            <Settings className="w-4 h-4 mr-2" />
            Configure
          </Button>
        </div>
      </div>

      {/* 系统概览 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{agents.length}</p>
                <p className="text-sm text-muted-foreground">Active Agents</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold">
                  {
                    agents.filter(
                      (a) => a.status === "idle" || a.status === "busy"
                    ).length
                  }
                </p>
                <p className="text-sm text-muted-foreground">Healthy</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold">
                  {
                    agents.filter(
                      (a) => a.performance.improvementTrend === "improving"
                    ).length
                  }
                </p>
                <p className="text-sm text-muted-foreground">Improving</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">
                  {(
                    agents.reduce(
                      (sum, a) => sum + a.performance.rubricScore,
                      0
                    ) / agents.length
                  ).toFixed(1)}
                </p>
                <p className="text-sm text-muted-foreground">Avg Score</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 主要内容 */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="rubrics">Rubric Analysis</TabsTrigger>
          <TabsTrigger value="collaboration">Collaboration</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {agents.map((agent) => (
              <AgentStatusCard key={agent.id} agent={agent} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {agents.map((agent) => (
              <Card key={agent.id}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    {agent.name}
                    <Badge variant="outline">
                      {agent.performance.rubricScore.toFixed(1)}/100
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium mb-2">Success Rate</p>
                        <Progress
                          value={agent.performance.successRate}
                          className="h-2"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          {agent.performance.successRate.toFixed(1)}%
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium mb-2">
                          Response Time
                        </p>
                        <Progress
                          value={
                            100 - agent.performance.averageResponseTime * 20
                          }
                          className="h-2"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          {agent.performance.averageResponseTime}s avg
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="p-2 bg-gray-50 dark:bg-gray-900/50 rounded">
                        <p className="font-medium">
                          {agent.performance.totalTasks}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Total Tasks
                        </p>
                      </div>
                      <div className="p-2 bg-gray-50 dark:bg-gray-900/50 rounded">
                        <p className="font-medium">
                          {agent.performance.confidence}%
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Confidence
                        </p>
                      </div>
                      <div className="p-2 bg-gray-50 dark:bg-gray-900/50 rounded">
                        <p className="font-medium">
                          {agent.health.uptime.toFixed(1)}%
                        </p>
                        <p className="text-xs text-muted-foreground">Uptime</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="rubrics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {agents.map((agent) => (
              <Card key={agent.id}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="w-5 h-5" />
                    {agent.name} - Rubric Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RubricTrendChart agent={agent} />
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="collaboration" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Agent Collaboration Network</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Agent collaboration visualization coming soon...</p>
                <p className="text-sm mt-2">
                  This will show how agents work together in multi-agent
                  workflows
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
