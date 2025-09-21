import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Upload, 
  Brain, 
  Target, 
  Phone,
  BarChart3,
  ArrowRight
} from 'lucide-react';

import { WorkflowStep } from '@/types/mtf-console';

interface WorkflowProgressProps {
  currentWorkflowStep: number;
  onWorkflowStepClick: (stepId: number) => void;
}

export function WorkflowProgress({ currentWorkflowStep, onWorkflowStepClick }: WorkflowProgressProps) {
  const workflowSteps: WorkflowStep[] = [
    {
      id: 1,
      title: 'Report Import',
      description: 'Upload or input radiology reports',
      icon: Upload,
      status: currentWorkflowStep >= 1 ? 'completed' : 'pending',
      color: 'blue'
    },
    {
      id: 2,
      title: 'AI Analysis',
      description: 'AI-powered MTF detection & risk assessment',
      icon: Brain,
      status: currentWorkflowStep >= 2 ? 'completed' : currentWorkflowStep === 1 ? 'in_progress' : 'pending',
      color: 'purple'
    },
    {
      id: 3,
      title: 'Risk Assessment',
      description: 'Generate personalized risk evaluation',
      icon: Target,
      status: currentWorkflowStep >= 3 ? 'completed' : currentWorkflowStep === 2 ? 'in_progress' : 'pending',
      color: 'orange'
    },
    {
      id: 4,
      title: 'Patient Outreach',
      description: 'Automated personalized communication',
      icon: Phone,
      status: currentWorkflowStep >= 4 ? 'completed' : currentWorkflowStep === 3 ? 'in_progress' : 'disabled',
      color: 'green'
    }
  ];

  return (
    <Card className="border-t-4 border-t-blue-500 shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <BarChart3 className="h-5 w-5 text-blue-600" />
          MTF Detection Workflow
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center">
          <div className="flex items-center space-x-4">
            {workflowSteps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div 
                          className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 cursor-pointer ${
                            step.status === 'completed' 
                              ? 'bg-green-100 text-green-600 shadow-md border-2 border-green-200 hover:bg-green-200' :
                            step.status === 'in_progress' 
                              ? 'bg-blue-100 text-blue-600 shadow-md border-2 border-blue-200 animate-pulse' :
                            step.status === 'disabled'
                              ? 'bg-gray-100 text-gray-400 border-2 border-gray-200 cursor-not-allowed' :
                              `bg-gray-50 text-gray-400 border-2 border-gray-200 hover:bg-${step.color}-50 hover:text-${step.color}-500 cursor-pointer`
                          }`}
                          onClick={() => step.status !== 'disabled' && onWorkflowStepClick(step.id)}
                        >
                          <step.icon className="w-5 h-5" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{step.title}: {step.description}</p>
                        {step.status === 'disabled' && (
                          <p className="text-xs text-gray-500 mt-1">Complete previous steps first</p>
                        )}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <div className="text-center mt-2 max-w-20">
                    <div className="font-semibold text-xs text-gray-900">{step.title}</div>
                    <div className="text-xs text-gray-600 mt-1 leading-tight">{step.description}</div>
                  </div>
                </div>
                {index < workflowSteps.length - 1 && (
                  <div className="flex items-center mx-4">
                    <ArrowRight className="w-4 h-4 text-gray-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
