import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Activity, 
  Upload,
  Bot,
  AlertCircle,
  Mail,
  ChevronRight
} from 'lucide-react';

// Animated Workflow Visualization Component
export function WorkflowVisualization() {
  const [currentStep, setCurrentStep] = useState(0);

  const workflowSteps = [
    {
      id: 'import',
      title: 'Report Import',
      description: 'Upload radiology reports',
      icon: Upload,
      color: 'blue',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      iconColor: 'text-blue-600',
      processing: 12,
      total: 15,
      status: 'active'
    },
    {
      id: 'analysis',
      title: 'AI Analysis',
      description: 'NLP fracture detection',
      icon: Bot,
      color: 'purple',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      iconColor: 'text-purple-600',
      processing: 8,
      total: 12,
      status: 'processing'
    },
    {
      id: 'assessment',
      title: 'Risk Assessment',
      description: 'Calculate MTF probability',
      icon: AlertCircle,
      color: 'orange',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      iconColor: 'text-orange-600',
      processing: 5,
      total: 8,
      status: 'waiting'
    },
    {
      id: 'outreach',
      title: 'Patient Outreach',
      description: 'Generate communications',
      icon: Mail,
      color: 'green',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      iconColor: 'text-green-600',
      processing: 3,
      total: 5,
      status: 'waiting'
    }
  ];

  // Animation cycle effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % workflowSteps.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="shadow-sm border-t-4 border-t-blue-500">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center text-lg">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
            <Activity className="w-4 h-4 text-blue-600" />
          </div>
          MTF Detection Workflow
          <Badge variant="secondary" className="ml-auto">
            Real-time Processing
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Workflow Steps */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
            {workflowSteps.map((step, index) => {
              const isActive = currentStep === index;
              const isProcessing = step.status === 'processing' || isActive;
              const progressPercentage = (step.processing / step.total) * 100;

              return (
                <div key={step.id} className="relative">
                  {/* Flow Arrow */}
                  {index < workflowSteps.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-2 transform -translate-y-1/2 z-10">
                      <div className={`w-4 h-0.5 ${isActive ? 'bg-blue-500' : 'bg-gray-300'} relative overflow-hidden`}>
                        {isActive && (
                          <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white to-transparent animate-pulse"></div>
                        )}
                      </div>
                      <ChevronRight className={`w-4 h-4 ${isActive ? 'text-blue-500' : 'text-gray-400'} ${isActive ? 'animate-pulse' : ''}`} />
                    </div>
                  )}

                  {/* Step Card */}
                  <div className={`
                    relative p-4 rounded-lg border-2 transition-all duration-500 cursor-pointer
                    ${isActive ? `${step.borderColor} ${step.bgColor} shadow-lg scale-105` : 'border-gray-200 bg-white hover:border-gray-300'}
                    ${isProcessing ? 'animate-pulse' : ''}
                  `}>
                    {/* Processing Indicator */}
                    {isProcessing && (
                      <div className="absolute top-2 right-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
                      </div>
                    )}

                    {/* Step Content */}
                    <div className="flex flex-col items-center text-center space-y-3">
                      {/* Icon */}
                      <div className={`
                        w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-300
                        ${isActive ? step.bgColor : 'bg-gray-100'}
                        ${isActive ? 'scale-110' : ''}
                      `}>
                        <step.icon className={`w-6 h-6 ${isActive ? step.iconColor : 'text-gray-400'}`} />
                      </div>

                      {/* Title and Description */}
                      <div>
                        <h4 className={`font-semibold text-sm ${isActive ? 'text-gray-900' : 'text-gray-600'}`}>
                          {step.title}
                        </h4>
                        <p className={`text-xs mt-1 ${isActive ? 'text-gray-700' : 'text-gray-500'}`}>
                          {step.description}
                        </p>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full space-y-1">
                        <div className="flex justify-between text-xs text-gray-600">
                          <span>Processing</span>
                          <span>{step.processing}/{step.total}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                          <div 
                            className={`h-2 rounded-full transition-all duration-1000 ${
                              isActive ? 'animate-progress-wave bg-gradient-to-r from-blue-500 to-blue-600' : 'bg-gray-400'
                            }`}
                            style={{ 
                              width: `${progressPercentage}%`
                            }}
                          ></div>
                        </div>
                        
                        {/* Status Badge */}
                        <div className="flex justify-center mt-2">
                          <Badge 
                            variant={isActive ? "default" : "secondary"}
                            className={`text-xs ${
                              isActive ? `bg-${step.color}-600 text-white` : ''
                            }`}
                          >
                            {isActive ? 'Processing' : 
                             step.status === 'processing' ? 'Active' : 
                             step.status === 'completed' ? 'Complete' : 'Waiting'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Overall Progress */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Overall Pipeline Progress</span>
              <span className="text-sm text-gray-600">Step {currentStep + 1} of {workflowSteps.length}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div 
                className="h-3 bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 rounded-full transition-all duration-1000"
                style={{ width: `${((currentStep + 1) / workflowSteps.length) * 100}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-600 mt-2">
              <span>Import</span>
              <span>Analysis</span>
              <span>Assessment</span>
              <span>Outreach</span>
            </div>
          </div>

          {/* Live Data Flow Indicator */}
          <div className="mt-4 flex items-center justify-center space-x-2 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping"></div>
              <span>Live Data Processing</span>
            </div>
            <span>•</span>
            <span>Average Processing Time: 2.3 minutes</span>
            <span>•</span>
            <div className="flex items-center space-x-1">
              <Activity className="w-3 h-3 text-green-500" />
              <span className="text-green-600">System Active</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
