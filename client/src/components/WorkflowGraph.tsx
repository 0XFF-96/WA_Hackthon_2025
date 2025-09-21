import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Bot,
  Brain,
  FileText,
  Stethoscope,
  ArrowRight,
  ArrowDown,
  Play,
  Pause,
  RotateCcw,
  Zap,
  CheckCircle,
  Clock,
} from "lucide-react";

interface WorkflowNode {
  id: string;
  type: "agent" | "decision" | "data";
  name: string;
  agentType?:
    | "orchestrator"
    | "diagnostician"
    | "radiologist"
    | "treatment_planner";
  status: "idle" | "active" | "completed" | "waiting";
  position: { x: number; y: number };
  confidence?: number;
  currentTask?: string;
}

interface WorkflowEdge {
  id: string;
  from: string;
  to: string;
  label?: string;
  status: "pending" | "active" | "completed";
}

interface WorkflowGraphProps {
  caseId?: string;
  isSimulating?: boolean;
  onStartSimulation?: () => void;
  onPauseSimulation?: () => void;
  onResetSimulation?: () => void;
}

const agentIcons = {
  orchestrator: Bot,
  diagnostician: Brain,
  radiologist: FileText,
  treatment_planner: Stethoscope,
};

const statusColors = {
  idle: "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400",
  active: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
  completed:
    "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
  waiting:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
};

export function WorkflowGraph({
  caseId,
  isSimulating = false,
  onStartSimulation,
  onPauseSimulation,
  onResetSimulation,
}: WorkflowGraphProps) {
  //todo: remove mock functionality
  const [nodes, setNodes] = useState<WorkflowNode[]>([
    {
      id: "input",
      type: "data",
      name: "Patient Data Input",
      status: "completed",
      position: { x: 50, y: 50 },
    },
    {
      id: "orchestrator",
      type: "agent",
      name: "Bone Guardian Orchestrator",
      agentType: "orchestrator",
      status: isSimulating ? "active" : "idle",
      position: { x: 300, y: 150 },
      confidence: 95,
      currentTask: "Coordinating multi-agent analysis",
    },
    {
      id: "diagnostician",
      type: "agent",
      name: "Dr. Neural",
      agentType: "diagnostician",
      status: isSimulating ? "waiting" : "idle",
      position: { x: 100, y: 300 },
      confidence: 87,
      currentTask: "Primary diagnostic analysis",
    },
    {
      id: "radiologist",
      type: "agent",
      name: "RadiologyAI",
      agentType: "radiologist",
      status: isSimulating ? "waiting" : "idle",
      position: { x: 300, y: 300 },
      confidence: 91,
      currentTask: "Medical imaging analysis",
    },
    {
      id: "treatment",
      type: "agent",
      name: "TreatmentBot",
      agentType: "treatment_planner",
      status: "idle",
      position: { x: 500, y: 300 },
      confidence: 93,
      currentTask: "Treatment planning",
    },
    {
      id: "synthesis",
      type: "decision",
      name: "Analysis Synthesis",
      status: "idle",
      position: { x: 300, y: 450 },
    },
    {
      id: "output",
      type: "data",
      name: "Treatment Plan",
      status: "idle",
      position: { x: 300, y: 550 },
    },
  ]);

  const [edges] = useState<WorkflowEdge[]>([
    {
      id: "e1",
      from: "input",
      to: "orchestrator",
      label: "Patient data",
      status: "completed",
    },
    {
      id: "e2",
      from: "orchestrator",
      to: "diagnostician",
      label: "Coordinate",
      status: isSimulating ? "active" : "pending",
    },
    {
      id: "e3",
      from: "orchestrator",
      to: "radiologist",
      label: "Coordinate",
      status: isSimulating ? "active" : "pending",
    },
    {
      id: "e4",
      from: "orchestrator",
      to: "treatment",
      label: "Coordinate",
      status: "pending",
    },
    {
      id: "e5",
      from: "diagnostician",
      to: "synthesis",
      label: "Analysis",
      status: "pending",
    },
    {
      id: "e6",
      from: "radiologist",
      to: "synthesis",
      label: "Imaging",
      status: "pending",
    },
    {
      id: "e7",
      from: "treatment",
      to: "synthesis",
      label: "Plan",
      status: "pending",
    },
    {
      id: "e8",
      from: "synthesis",
      to: "output",
      label: "Final plan",
      status: "pending",
    },
  ]);

  const getNodeIcon = (node: WorkflowNode) => {
    if (node.type === "agent" && node.agentType) {
      return agentIcons[node.agentType];
    }
    switch (node.type) {
      case "decision":
        return Zap;
      case "data":
        return FileText;
      default:
        return Bot;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return Clock;
      case "completed":
        return CheckCircle;
      case "waiting":
        return Clock;
      default:
        return null;
    }
  };

  const handleNodeClick = useCallback((nodeId: string) => {
    console.log("Node clicked:", nodeId);
  }, []);

  return (
    <Card
      className="w-full h-[700px] flex flex-col"
      data-testid="card-workflow-graph"
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center text-lg">
            <Bot className="w-5 h-5 mr-2" />
            Multi-Agent Workflow
          </CardTitle>
          <div className="flex items-center space-x-2">
            {caseId && <Badge variant="secondary">Case: {caseId}</Badge>}
            <div className="flex items-center space-x-1">
              <Button
                size="sm"
                variant={isSimulating ? "secondary" : "default"}
                onClick={isSimulating ? onPauseSimulation : onStartSimulation}
                data-testid="button-simulation-toggle"
              >
                {isSimulating ? (
                  <Pause className="w-3 h-3 mr-1" />
                ) : (
                  <Play className="w-3 h-3 mr-1" />
                )}
                {isSimulating ? "Pause" : "Start"} Simulation
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={onResetSimulation}
                data-testid="button-reset-simulation"
              >
                <RotateCcw className="w-3 h-3 mr-1" />
                Reset
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 relative overflow-hidden">
        {/* SVG for connections */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-0"
          style={{ minHeight: "600px", minWidth: "600px" }}
        >
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon
                points="0 0, 10 3.5, 0 7"
                fill="hsl(var(--muted-foreground))"
                opacity="0.6"
              />
            </marker>
            <marker
              id="arrowhead-active"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill="hsl(var(--primary))" />
            </marker>
          </defs>

          {edges.map((edge) => {
            const fromNode = nodes.find((n) => n.id === edge.from);
            const toNode = nodes.find((n) => n.id === edge.to);

            if (!fromNode || !toNode) return null;

            const isActive = edge.status === "active";
            const isCompleted = edge.status === "completed";

            return (
              <g key={edge.id}>
                <line
                  x1={fromNode.position.x + 30}
                  y1={fromNode.position.y + 30}
                  x2={toNode.position.x + 30}
                  y2={toNode.position.y + 30}
                  stroke={
                    isActive
                      ? "hsl(var(--primary))"
                      : isCompleted
                      ? "hsl(var(--chart-2))"
                      : "hsl(var(--muted-foreground))"
                  }
                  strokeWidth={isActive ? "3" : "2"}
                  strokeOpacity={isActive || isCompleted ? "1" : "0.4"}
                  markerEnd={
                    isActive ? "url(#arrowhead-active)" : "url(#arrowhead)"
                  }
                  strokeDasharray={edge.status === "pending" ? "5,5" : "none"}
                >
                  {isActive && (
                    <animate
                      attributeName="stroke-opacity"
                      values="0.6;1;0.6"
                      dur="2s"
                      repeatCount="indefinite"
                    />
                  )}
                </line>
                {edge.label && (
                  <text
                    x={(fromNode.position.x + toNode.position.x) / 2 + 30}
                    y={(fromNode.position.y + toNode.position.y) / 2 + 25}
                    textAnchor="middle"
                    className="text-xs fill-muted-foreground"
                  >
                    {edge.label}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* Nodes */}
        <div
          className="relative z-10 w-full h-full"
          style={{ minHeight: "600px" }}
        >
          {nodes.map((node) => {
            const IconComponent = getNodeIcon(node);
            const StatusIcon = getStatusIcon(node.status);

            return (
              <div
                key={node.id}
                className="absolute cursor-pointer group"
                style={{
                  left: `${node.position.x}px`,
                  top: `${node.position.y}px`,
                  transform: "translate(0, 0)",
                }}
                onClick={() => handleNodeClick(node.id)}
                data-testid={`workflow-node-${node.id}`}
              >
                <Card
                  className={`w-60 hover-elevate transition-all duration-200 ${
                    node.status === "active" ? "ring-2 ring-primary" : ""
                  }`}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback
                            className={
                              node.type === "agent"
                                ? statusColors[node.status]
                                : "bg-muted"
                            }
                          >
                            <IconComponent className="w-4 h-4" />
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4
                            className="font-semibold text-xs"
                            data-testid={`node-name-${node.id}`}
                          >
                            {node.name}
                          </h4>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        {StatusIcon && (
                          <StatusIcon
                            className={`w-3 h-3 ${
                              node.status === "active"
                                ? "text-primary animate-pulse"
                                : node.status === "completed"
                                ? "text-green-600"
                                : "text-muted-foreground"
                            }`}
                          />
                        )}
                        <Badge
                          className={statusColors[node.status]}
                          data-testid={`node-status-${node.id}`}
                        >
                          {node.status}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>

                  {(node.confidence || node.currentTask) && (
                    <CardContent className="pt-0">
                      {node.confidence && (
                        <div className="text-xs text-muted-foreground mb-1">
                          Confidence:{" "}
                          <span className="font-semibold">
                            {node.confidence}%
                          </span>
                        </div>
                      )}
                      {node.currentTask && (
                        <div className="text-xs text-muted-foreground">
                          {node.currentTask}
                        </div>
                      )}
                    </CardContent>
                  )}
                </Card>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
