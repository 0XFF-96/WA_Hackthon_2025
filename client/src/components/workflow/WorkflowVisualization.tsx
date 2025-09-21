import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  Brain,
  Activity,
  MessageSquare,
  Clock,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Play,
  Pause,
  RotateCcw,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import {
  WorkflowExecution,
  WorkflowStep,
  Agent,
  AgentInteraction,
} from "@/types/workflow";

interface WorkflowVisualizationProps {
  caseId?: string;
  onWorkflowComplete?: (execution: WorkflowExecution) => void;
}

export function WorkflowVisualization({
  caseId,
  onWorkflowComplete,
}: WorkflowVisualizationProps) {
  const [currentExecution, setCurrentExecution] =
    useState<WorkflowExecution | null>(null);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [interactions, setInteractions] = useState<AgentInteraction[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Mock agents
  useEffect(() => {
    const mockAgents: Agent[] = [
      {
        id: "orchestrator",
        name: "Bone Guardian Orchestrator",
        type: "orchestrator",
        status: "idle",
        lastActivity: new Date(),
        performance: {
          totalTasks: 156,
          successRate: 98.5,
          averageResponseTime: 1.2,
          confidence: 95,
        },
      },
      {
        id: "diagnostician",
        name: "Dr. Neural",
        type: "diagnostician",
        status: "idle",
        lastActivity: new Date(),
        performance: {
          totalTasks: 89,
          successRate: 96.2,
          averageResponseTime: 2.1,
          confidence: 92,
        },
      },
      {
        id: "radiologist",
        name: "RadiologyAI",
        type: "radiologist",
        status: "idle",
        lastActivity: new Date(),
        performance: {
          totalTasks: 67,
          successRate: 94.8,
          averageResponseTime: 1.8,
          confidence: 88,
        },
      },
      {
        id: "treatment_planner",
        name: "TreatmentBot",
        type: "treatment_planner",
        status: "idle",
        lastActivity: new Date(),
        performance: {
          totalTasks: 45,
          successRate: 97.1,
          averageResponseTime: 1.5,
          confidence: 90,
        },
      },
    ];
    setAgents(mockAgents);
  }, []);

  const startWorkflow = () => {
    const newExecution: WorkflowExecution = {
      id: `workflow-${Date.now()}`,
      caseId: caseId || "case-123",
      status: "running",
      steps: [],
      startTime: new Date(),
    };

    setCurrentExecution(newExecution);
    setIsRunning(true);
    setIsPaused(false);
    simulateWorkflow(newExecution);
  };

  const pauseWorkflow = () => {
    setIsPaused(!isPaused);
  };

  const resetWorkflow = () => {
    setCurrentExecution(null);
    setIsRunning(false);
    setIsPaused(false);
    setInteractions([]);
  };

  const simulateWorkflow = (execution: WorkflowExecution) => {
    const workflowSteps = [
      {
        agentId: "orchestrator",
        agentName: "Bone Guardian Orchestrator",
        action: "Analyze patient case and coordinate workflow",
        input: {
          caseId: execution.caseId,
          symptoms: "Pain in left hip, difficulty walking",
        },
        duration: 2000,
      },
      {
        agentId: "diagnostician",
        agentName: "Dr. Neural",
        action: "Perform differential diagnosis analysis",
        input: {
          symptoms: "Pain in left hip, difficulty walking",
          age: 65,
          history: "Previous fall",
        },
        duration: 3000,
      },
      {
        agentId: "radiologist",
        agentName: "RadiologyAI",
        action: "Analyze imaging data for minimal trauma fractures",
        input: { imagingType: "X-ray", bodyPart: "left hip" },
        duration: 2500,
      },
      {
        agentId: "treatment_planner",
        agentName: "TreatmentBot",
        action: "Generate comprehensive treatment plan",
        input: {
          diagnosis: "Suspected minimal trauma fracture",
          riskFactors: ["age", "previous fall"],
        },
        duration: 2000,
      },
      {
        agentId: "orchestrator",
        agentName: "Bone Guardian Orchestrator",
        action: "Synthesize findings and provide final recommendations",
        input: { allFindings: "Combined analysis from all agents" },
        duration: 1500,
      },
    ];

    let stepIndex = 0;
    const processStep = () => {
      if (isPaused || stepIndex >= workflowSteps.length) {
        if (stepIndex >= workflowSteps.length) {
          // Workflow complete
          const completedExecution = {
            ...execution,
            status: "completed" as const,
            endTime: new Date(),
            totalDuration: Date.now() - execution.startTime.getTime(),
          };
          setCurrentExecution(completedExecution);
          setIsRunning(false);
          onWorkflowComplete?.(completedExecution);
        }
        return;
      }

      const stepConfig = workflowSteps[stepIndex];

      // Create new step
      const newStep: WorkflowStep = {
        id: `step-${stepIndex}`,
        agentId: stepConfig.agentId,
        agentName: stepConfig.agentName,
        action: stepConfig.action,
        input: stepConfig.input,
        output: null,
        status: "in_progress",
        startTime: new Date(),
        confidence: Math.random() * 20 + 80, // 80-100%
      };

      // Update execution
      setCurrentExecution((prev) =>
        prev
          ? {
              ...prev,
              steps: [...prev.steps, newStep],
            }
          : null
      );

      // Update agent status
      setAgents((prev) =>
        prev.map((agent) =>
          agent.id === stepConfig.agentId
            ? { ...agent, status: "busy", currentTask: stepConfig.action }
            : agent
        )
      );

      // Simulate processing
      setTimeout(() => {
        // Complete step
        const completedStep = {
          ...newStep,
          status: "completed" as const,
          endTime: new Date(),
          duration: Date.now() - newStep.startTime.getTime(),
          output: generateStepOutput(stepConfig.agentId),
          confidence: Math.random() * 20 + 80,
        };

        setCurrentExecution((prev) =>
          prev
            ? {
                ...prev,
                steps: prev.steps.map((step) =>
                  step.id === newStep.id ? completedStep : step
                ),
              }
            : null
        );

        // Update agent status
        setAgents((prev) =>
          prev.map((agent) =>
            agent.id === stepConfig.agentId
              ? {
                  ...agent,
                  status: "idle",
                  currentTask: undefined,
                  lastActivity: new Date(),
                }
              : agent
          )
        );

        // Add interaction
        const interaction: AgentInteraction = {
          id: `interaction-${Date.now()}`,
          fromAgent: stepConfig.agentId,
          toAgent:
            stepIndex < workflowSteps.length - 1
              ? workflowSteps[stepIndex + 1].agentId
              : "system",
          message: `Completed: ${stepConfig.action}`,
          data: completedStep.output,
          timestamp: new Date(),
          type: "response",
        };

        setInteractions((prev) => [interaction, ...prev.slice(0, 9)]); // Keep last 10 interactions

        stepIndex++;
        setTimeout(processStep, 1000); // 1 second delay between steps
      }, stepConfig.duration);
    };

    processStep();
  };

  const generateStepOutput = (agentId: string) => {
    const outputs = {
      orchestrator: { coordination: "Workflow initiated", priority: "high" },
      diagnostician: {
        diagnosis: "Suspected minimal trauma fracture",
        confidence: 87,
        differential: ["stress fracture", "bone bruise"],
      },
      radiologist: {
        findings: "Subtle cortical irregularity",
        recommendation: "Follow-up MRI",
      },
      treatment_planner: {
        plan: "Conservative management",
        medications: ["pain relief"],
        followUp: "2 weeks",
      },
    };
    return outputs[agentId as keyof typeof outputs] || {};
  };

  const getAgentStatusColor = (status: string) => {
    switch (status) {
      case "busy":
        return "bg-blue-100 text-blue-800";
      case "idle":
        return "bg-green-100 text-green-800";
      case "error":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStepStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "in_progress":
        return <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />;
      case "failed":
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getOverallProgress = () => {
    if (!currentExecution || currentExecution.steps.length === 0) return 0;
    const completedSteps = currentExecution.steps.filter(
      (s) => s.status === "completed"
    ).length;
    return (completedSteps / 5) * 100; // 5 total expected steps
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Multi-Agent Workflow</h2>
          <p className="text-gray-600">
            Real-time AI agent collaboration and decision tracking
          </p>
        </div>
        <div className="flex gap-2">
          {!isRunning ? (
            <Button
              onClick={startWorkflow}
              className="bg-primary hover:bg-primary/90"
            >
              <Play className="w-4 h-4 mr-2" />
              Start Workflow
            </Button>
          ) : (
            <>
              <Button onClick={pauseWorkflow} variant="outline">
                {isPaused ? (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Resume
                  </>
                ) : (
                  <>
                    <Pause className="w-4 h-4 mr-2" />
                    Pause
                  </>
                )}
              </Button>
              <Button onClick={resetWorkflow} variant="outline">
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Progress Overview */}
      {currentExecution && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Workflow Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span>Overall Progress</span>
                <span>{Math.round(getOverallProgress())}%</span>
              </div>
              <Progress value={getOverallProgress()} className="h-3" />

              <div className="grid grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Execution ID:</span>
                  <p className="font-mono text-xs">{currentExecution.id}</p>
                </div>
                <div>
                  <span className="text-gray-600">Status:</span>
                  <Badge
                    className={
                      currentExecution.status === "completed"
                        ? "bg-green-100 text-green-800"
                        : "bg-blue-100 text-blue-800"
                    }
                  >
                    {currentExecution.status}
                  </Badge>
                </div>
                <div>
                  <span className="text-gray-600">Steps:</span>
                  <p>{currentExecution.steps.length}/5</p>
                </div>
                <div>
                  <span className="text-gray-600">Duration:</span>
                  <p>
                    {currentExecution.totalDuration
                      ? `${(currentExecution.totalDuration / 1000).toFixed(1)}s`
                      : "Running..."}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Agent Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Agent Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {agents.map((agent) => (
              <div key={agent.id} className="p-4 border rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <Brain className="w-6 h-6 text-primary" />
                  <div>
                    <h3 className="font-semibold text-sm">{agent.name}</h3>
                    <Badge className={getAgentStatusColor(agent.status)}>
                      {agent.status}
                    </Badge>
                  </div>
                </div>
                {agent.currentTask && (
                  <p className="text-xs text-gray-600 mb-2">
                    {agent.currentTask}
                  </p>
                )}
                <div className="space-y-1 text-xs text-gray-500">
                  <div>
                    Success: {agent.performance.successRate.toFixed(1)}%
                  </div>
                  <div>Avg Time: {agent.performance.averageResponseTime}s</div>
                  <div>Confidence: {agent.performance.confidence}%</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Workflow Steps */}
      {currentExecution && currentExecution.steps.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Workflow Steps
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {currentExecution.steps.map((step, index) => (
                <div
                  key={step.id}
                  className="flex items-start gap-4 p-4 border rounded-lg"
                >
                  <div className="flex-shrink-0">
                    {getStepStatusIcon(step.status)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{step.agentName}</h3>
                      <Badge variant="outline" className="text-xs">
                        {step.confidence?.toFixed(0)}% confidence
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{step.action}</p>
                    {step.output && (
                      <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                        {Object.entries(step.output).map(([key, value]) => (
                          <div key={key}>
                            <span className="font-medium">{key}:</span>{" "}
                            {JSON.stringify(value)}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="text-right text-xs text-gray-500">
                    {step.duration && (
                      <div>{(step.duration / 1000).toFixed(1)}s</div>
                    )}
                    <div>{step.startTime.toLocaleTimeString()}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Interactions */}
      {interactions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Recent Agent Interactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {interactions.slice(0, 5).map((interaction) => (
                <div
                  key={interaction.id}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                >
                  <MessageSquare className="w-4 h-4 text-gray-600" />
                  <div className="flex-1">
                    <div className="text-sm">
                      <span className="font-medium">
                        {interaction.fromAgent}
                      </span>
                      <span className="text-gray-500"> → </span>
                      <span className="font-medium">{interaction.toAgent}</span>
                    </div>
                    <div className="text-xs text-gray-600">
                      {interaction.message}
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    {interaction.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
