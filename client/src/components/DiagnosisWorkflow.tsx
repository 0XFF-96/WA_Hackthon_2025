import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Circle, Clock, Upload, Brain, FileText, Stethoscope } from "lucide-react";

interface WorkflowStep {
  id: string;
  title: string;
  description: string;
  status: "completed" | "current" | "pending";
  icon: React.ComponentType<any>;
}

interface DiagnosisWorkflowProps {
  patientName: string;
  caseId: string;
  currentStep: number;
  overallProgress: number;
  onStepClick: (stepId: string) => void;
}

export function DiagnosisWorkflow({ 
  patientName, 
  caseId, 
  currentStep, 
  overallProgress, 
  onStepClick 
}: DiagnosisWorkflowProps) {
  //todo: remove mock functionality
  const steps: WorkflowStep[] = [
    {
      id: "upload",
      title: "Image Upload",
      description: "Upload and validate medical imaging",
      status: currentStep > 0 ? "completed" : "current",
      icon: Upload,
    },
    {
      id: "ai_analysis",
      title: "AI Analysis",
      description: "Multi-agent AI system processes images",
      status: currentStep > 1 ? "completed" : currentStep === 1 ? "current" : "pending",
      icon: Brain,
    },
    {
      id: "diagnosis",
      title: "Diagnosis Review",
      description: "AI findings and confidence assessment", 
      status: currentStep > 2 ? "completed" : currentStep === 2 ? "current" : "pending",
      icon: FileText,
    },
    {
      id: "treatment",
      title: "Treatment Planning",
      description: "Generate personalized treatment plan",
      status: currentStep > 3 ? "completed" : currentStep === 3 ? "current" : "pending",
      icon: Stethoscope,
    },
  ];

  const getStepIcon = (step: WorkflowStep) => {
    if (step.status === "completed") return CheckCircle;
    if (step.status === "current") return Clock;
    return Circle;
  };

  const getStepColor = (step: WorkflowStep) => {
    switch (step.status) {
      case "completed": return "text-green-600 dark:text-green-400";
      case "current": return "text-primary";
      default: return "text-muted-foreground";
    }
  };

  return (
    <Card data-testid="card-diagnosis-workflow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg" data-testid="text-patient-workflow">
              {patientName} - Case {caseId}
            </CardTitle>
            <p className="text-sm text-muted-foreground">Diagnosis Workflow</p>
          </div>
          <Badge variant="secondary" data-testid="badge-workflow-progress">
            {Math.round(overallProgress)}% Complete
          </Badge>
        </div>
        <Progress value={overallProgress} className="mt-2" data-testid="progress-workflow" />
      </CardHeader>
      
      <CardContent className="space-y-4">
        {steps.map((step, index) => {
          const StepIcon = getStepIcon(step);
          const IconComponent = step.icon;
          
          return (
            <div 
              key={step.id}
              className="flex items-start space-x-3 p-3 rounded-lg hover-elevate cursor-pointer"
              onClick={() => onStepClick(step.id)}
              data-testid={`step-${step.id}`}
            >
              <div className="relative flex-shrink-0">
                <div className={`w-8 h-8 rounded-full bg-background border-2 flex items-center justify-center ${
                  step.status === 'completed' ? 'border-green-600 bg-green-50 dark:bg-green-950' :
                  step.status === 'current' ? 'border-primary bg-primary/10' :
                  'border-muted-foreground/30'
                }`}>
                  <StepIcon className={`w-4 h-4 ${getStepColor(step)}`} />
                </div>
                {index < steps.length - 1 && (
                  <div className={`absolute top-8 left-4 w-0.5 h-8 -ml-px ${
                    step.status === 'completed' ? 'bg-green-600' : 'bg-muted-foreground/30'
                  }`} />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <IconComponent className={`w-4 h-4 ${getStepColor(step)}`} />
                  <h4 className={`font-medium text-sm ${getStepColor(step)}`} data-testid={`text-step-title-${step.id}`}>
                    {step.title}
                  </h4>
                </div>
                <p className="text-xs text-muted-foreground" data-testid={`text-step-description-${step.id}`}>
                  {step.description}
                </p>
                
                {step.status === 'current' && (
                  <Button size="sm" className="mt-2" data-testid={`button-continue-${step.id}`}>
                    Continue Step
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}