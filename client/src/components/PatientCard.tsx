import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Clock, User, AlertCircle } from "lucide-react";

interface PatientCardProps {
  id: string;
  name: string;
  age: number;
  gender: string;
  medicalId: string;
  caseTitle: string;
  status: "pending" | "analyzing" | "diagnosed" | "treated";
  priority: "low" | "medium" | "high" | "critical";
  lastUpdate: string;
  onViewCase: (id: string) => void;
}

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
  analyzing: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400", 
  diagnosed: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
  treated: "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
};

const priorityColors = {
  low: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
  medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
  high: "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400",
  critical: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
};

export function PatientCard({ 
  id, name, age, gender, medicalId, caseTitle, status, priority, lastUpdate, onViewCase 
}: PatientCardProps) {
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <Card className="hover-elevate" data-testid={`card-patient-${id}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src="" alt={name} />
            <AvatarFallback className="bg-primary/10 text-primary">
              {getInitials(name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-sm" data-testid={`text-patient-name-${id}`}>{name}</h3>
            <p className="text-xs text-muted-foreground">
              {age}y • {gender} • ID: {medicalId}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge className={priorityColors[priority]} data-testid={`badge-priority-${id}`}>
            {priority === 'critical' && <AlertCircle className="w-3 h-3 mr-1" />}
            {priority}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div>
          <h4 className="font-medium text-sm mb-1" data-testid={`text-case-title-${id}`}>{caseTitle}</h4>
          <Badge className={statusColors[status]} data-testid={`badge-status-${id}`}>
            {status}
          </Badge>
        </div>
        
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center">
            <Clock className="w-3 h-3 mr-1" />
            {lastUpdate}
          </div>
          <Button 
            size="sm" 
            onClick={() => onViewCase(id)}
            data-testid={`button-view-case-${id}`}
          >
            View Case
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}