import { useState } from "react";
import { WorkflowGraph } from "@/components/WorkflowGraph";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Bot, 
  Activity, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  BarChart3
} from "lucide-react";

export default function WorkflowVisualization() {
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationStep, setSimulationStep] = useState(0);

  //todo: remove mock functionality
  const activeCase = {
    id: "MED-2024-0001",
    patientName: "Sarah Johnson",
    status: "In Progress",
    startTime: "12:15 PM",
    estimatedCompletion: "12:45 PM"
  };

  const agentMetrics = [
    { name: "Orchestrator", status: "coordinating", tasks: 3, avgTime: "45s" },
    { name: "Dr. Neural", status: "analyzing", tasks: 1, avgTime: "2.3m" },
    { name: "RadiologyAI", status: "processing", tasks: 2, avgTime: "1.8m" },
    { name: "TreatmentBot", status: "waiting", tasks: 0, avgTime: "3.1m" }
  ];

  const recentDecisions = [
    { 
      time: "12:18 PM", 
      agent: "Orchestrator", 
      decision: "Route to diagnostic analysis", 
      confidence: 95 
    },
    { 
      time: "12:16 PM", 
      agent: "Dr. Neural", 
      decision: "Classify as micro-fracture candidate", 
      confidence: 87 
    },
    { 
      time: "12:15 PM", 
      agent: "RadiologyAI", 
      decision: "Image quality sufficient for analysis", 
      confidence: 98 
    }
  ];

  const handleStartSimulation = () => {
    console.log('Starting workflow simulation');
    setIsSimulating(true);
    setSimulationStep(1);
  };

  const handlePauseSimulation = () => {
    console.log('Pausing workflow simulation');
    setIsSimulating(false);
  };

  const handleResetSimulation = () => {
    console.log('Resetting workflow simulation');
    setIsSimulating(false);
    setSimulationStep(0);
  };

  return (
    <div className="p-6 space-y-6" data-testid="page-workflow-visualization">
      {/* Header */}
      <div className="flex flex-col space-y-4">
        <div>
          <h1 className="text-2xl font-bold" data-testid="text-page-title">Workflow Visualization</h1>
          <p className="text-muted-foreground">
            Real-time multi-agent workflow and decision tracking
          </p>
        </div>
        
        {/* Active Case Status */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center text-base">
                <Activity className="w-4 h-4 mr-2" />
                Active Workflow
              </CardTitle>
              <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                {activeCase.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Patient</p>
                <p className="font-semibold" data-testid="text-workflow-patient">
                  {activeCase.patientName}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Case ID</p>
                <p className="font-semibold">{activeCase.id}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Started</p>
                <p className="font-semibold">{activeCase.startTime}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Est. Completion</p>
                <p className="font-semibold">{activeCase.estimatedCompletion}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="graph" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="graph" data-testid="tab-graph">Workflow Graph</TabsTrigger>
          <TabsTrigger value="metrics" data-testid="tab-metrics">Agent Metrics</TabsTrigger>
          <TabsTrigger value="decisions" data-testid="tab-decisions">Decision Log</TabsTrigger>
        </TabsList>

        <TabsContent value="graph" className="space-y-4">
          <WorkflowGraph
            caseId={activeCase.id}
            isSimulating={isSimulating}
            onStartSimulation={handleStartSimulation}
            onPauseSimulation={handlePauseSimulation}
            onResetSimulation={handleResetSimulation}
          />
        </TabsContent>

        <TabsContent value="metrics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {agentMetrics.map((agent, index) => (
              <Card key={index} data-testid={`agent-metric-${index}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-2">
                    <Bot className="w-4 h-4 text-primary" />
                    <h3 className="font-semibold text-sm">{agent.name}</h3>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Status</span>
                    <Badge variant="secondary" className="capitalize">
                      {agent.status}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Active Tasks</span>
                    <span className="font-semibold">{agent.tasks}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Avg. Time</span>
                    <span className="font-semibold">{agent.avgTime}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="w-4 h-4 mr-2" />
                Performance Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center text-muted-foreground py-8">
                <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Performance charts would be displayed here</p>
                <p className="text-sm">Real-time agent performance metrics and trends</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="decisions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                Decision Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentDecisions.map((decision, index) => (
                  <div 
                    key={index} 
                    className="flex items-start space-x-3 p-3 bg-muted/30 rounded-lg"
                    data-testid={`decision-${index}`}
                  >
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-primary" />
                      </div>
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">{decision.agent}</span>
                        <span className="text-xs text-muted-foreground">{decision.time}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{decision.decision}</p>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary" className="text-xs">
                          {decision.confidence}% confidence
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertCircle className="w-4 h-4 mr-2" />
                Decision Patterns
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center text-muted-foreground py-8">
                <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Decision pattern analysis would be displayed here</p>
                <p className="text-sm">Analysis of agent decision-making patterns and reliability</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}