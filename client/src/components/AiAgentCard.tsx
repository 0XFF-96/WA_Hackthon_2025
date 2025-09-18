import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bot, Brain, Stethoscope, UserCheck, Activity } from "lucide-react";

interface AiAgentCardProps {
  id: string;
  name: string;
  role: "diagnostician" | "radiologist" | "treatment_planner" | "triage";
  status: "active" | "busy" | "idle";
  confidence: number;
  currentTask?: string;
}

const roleIcons = {
  diagnostician: Brain,
  radiologist: Activity,
  treatment_planner: UserCheck,
  triage: Stethoscope,
};

const roleColors = {
  diagnostician: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
  radiologist: "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400",
  treatment_planner: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
  triage: "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400",
};

const statusColors = {
  active: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
  busy: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
  idle: "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400",
};

export function AiAgentCard({ id, name, role, status, confidence, currentTask }: AiAgentCardProps) {
  const IconComponent = roleIcons[role];
  
  return (
    <Card className="hover-elevate" data-testid={`card-agent-${id}`}>
      <CardHeader className="flex flex-row items-center space-y-0 pb-3">
        <Avatar className="h-10 w-10 mr-3">
          <AvatarFallback className="bg-primary/10">
            <Bot className="h-5 w-5 text-primary" />
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h3 className="font-semibold text-sm" data-testid={`text-agent-name-${id}`}>{name}</h3>
          <Badge className={roleColors[role]} data-testid={`badge-role-${id}`}>
            <IconComponent className="w-3 h-3 mr-1" />
            {role.replace('_', ' ')}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <Badge className={statusColors[status]} data-testid={`badge-status-${id}`}>
            {status}
          </Badge>
          <div className="text-right">
            <div className="text-xs text-muted-foreground">Confidence</div>
            <div className="text-sm font-semibold" data-testid={`text-confidence-${id}`}>
              {confidence}%
            </div>
          </div>
        </div>
        
        {currentTask && (
          <div className="text-xs text-muted-foreground" data-testid={`text-current-task-${id}`}>
            <div className="font-medium">Current Task:</div>
            <div>{currentTask}</div>
          </div>
        )}
        
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${confidence}%` }}
            data-testid={`progress-confidence-${id}`}
          />
        </div>
      </CardContent>
    </Card>
  );
}