import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  Upload,
  Scissors,
  Brain,
  Database,
  Search,
  FileText,
  ArrowRight,
  CheckCircle,
  Clock,
  AlertTriangle,
  RefreshCw,
  Zap
} from 'lucide-react';
import { DataFlowStep, DataFlowExecution } from '@/types/workflow';

interface DataFlowViewProps {
  executionId?: string;
  onExecutionComplete?: (execution: DataFlowExecution) => void;
}

export function DataFlowView({ executionId, onExecutionComplete }: DataFlowViewProps) {
  const [currentExecution, setCurrentExecution] = useState<DataFlowExecution | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const flowSteps = [
    {
      id: 'upload',
      name: 'File Upload',
      icon: Upload,
      description: 'Upload medical documents and case files',
      color: 'bg-blue-500'
    },
    {
      id: 'chunk',
      name: 'Text Chunking',
      icon: Scissors,
      description: 'Split documents into manageable chunks',
      color: 'bg-green-500'
    },
    {
      id: 'embed',
      name: 'Vectorization',
      icon: Brain,
      description: 'Convert text to vector embeddings',
      color: 'bg-purple-500'
    },
    {
      id: 'store',
      name: 'Vector Storage',
      icon: Database,
      description: 'Store embeddings in Pinecone database',
      color: 'bg-orange-500'
    },
    {
      id: 'search',
      name: 'Similarity Search',
      icon: Search,
      description: 'Find relevant chunks for queries',
      color: 'bg-pink-500'
    },
    {
      id: 'generate',
      name: 'AI Generation',
      icon: FileText,
      description: 'Generate care plans using retrieved context',
      color: 'bg-indigo-500'
    }
  ];

  const startNewExecution = () => {
    const newExecution: DataFlowExecution = {
      id: `exec-${Date.now()}`,
      steps: flowSteps.map(step => ({
        id: step.id,
        name: step.name,
        type: step.id as any,
        status: 'pending',
        timestamp: new Date(),
        metadata: {}
      })),
      startTime: new Date(),
      status: 'running'
    };

    setCurrentExecution(newExecution);
    setIsRunning(true);
    simulateExecution(newExecution);
  };

  const simulateExecution = (execution: DataFlowExecution) => {
    let stepIndex = 0;
    
    const processStep = () => {
      if (stepIndex >= execution.steps.length) {
        // Execution complete
        const completedExecution = {
          ...execution,
          status: 'completed' as const,
          endTime: new Date(),
          totalDuration: Date.now() - execution.startTime.getTime()
        };
        
        setCurrentExecution(completedExecution);
        setIsRunning(false);
        onExecutionComplete?.(completedExecution);
        return;
      }

      // Update current step to processing
      const updatedSteps = [...execution.steps];
      updatedSteps[stepIndex] = {
        ...updatedSteps[stepIndex],
        status: 'processing',
        timestamp: new Date()
      };

      setCurrentExecution({
        ...execution,
        steps: updatedSteps
      });

      // Simulate processing time
      setTimeout(() => {
        // Mark step as completed
        const completedSteps = [...updatedSteps];
        completedSteps[stepIndex] = {
          ...completedSteps[stepIndex],
          status: 'completed',
          duration: Math.random() * 2000 + 500, // 0.5-2.5 seconds
          output: generateStepOutput(stepIndex)
        };

        setCurrentExecution({
          ...execution,
          steps: completedSteps
        });

        stepIndex++;
        setTimeout(processStep, 500); // Small delay between steps
      }, Math.random() * 3000 + 1000); // 1-4 seconds processing time
    };

    processStep();
  };

  const generateStepOutput = (stepIndex: number) => {
    const outputs = [
      { files: 3, size: '2.5 MB' },
      { chunks: 1250, avgSize: '200 tokens' },
      { vectors: 1250, dimensions: 1536 },
      { stored: 1250, index: 'medical-knowledge' },
      { results: 5, avgScore: 0.87 },
      { plan: 'Generated care plan with 3 recommendations' }
    ];
    return outputs[stepIndex] || {};
  };

  const getStepStatus = (stepId: string) => {
    if (!currentExecution) return 'pending';
    const step = currentExecution.steps.find(s => s.id === stepId);
    return step?.status || 'pending';
  };

  const getStepIcon = (status: string, Icon: any) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-6 h-6 text-green-600" />;
      case 'processing':
        return <RefreshCw className="w-6 h-6 text-blue-600 animate-spin" />;
      case 'error':
        return <AlertTriangle className="w-6 h-6 text-red-600" />;
      default:
        return <Icon className="w-6 h-6 text-gray-400" />;
    }
  };

  const getStepColor = (status: string, defaultColor: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'processing':
        return 'bg-blue-500';
      case 'error':
        return 'bg-red-500';
      default:
        return defaultColor;
    }
  };

  const getOverallProgress = () => {
    if (!currentExecution) return 0;
    const completedSteps = currentExecution.steps.filter(s => s.status === 'completed').length;
    return (completedSteps / currentExecution.steps.length) * 100;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Data Flow Visualization</h2>
          <p className="text-gray-600">Real-time RAG pipeline execution tracking</p>
        </div>
        <Button 
          onClick={startNewExecution} 
          disabled={isRunning}
          className="bg-primary hover:bg-primary/90"
        >
          {isRunning ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Running...
            </>
          ) : (
            <>
              <Zap className="w-4 h-4 mr-2" />
              Start New Flow
            </>
          )}
        </Button>
      </div>

      {/* Progress Overview */}
      {currentExecution && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Execution Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span>Overall Progress</span>
                <span>{Math.round(getOverallProgress())}%</span>
              </div>
              <Progress value={getOverallProgress()} className="h-3" />
              
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Execution ID:</span>
                  <p className="font-mono">{currentExecution.id}</p>
                </div>
                <div>
                  <span className="text-gray-600">Status:</span>
                  <Badge className={currentExecution.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}>
                    {currentExecution.status}
                  </Badge>
                </div>
                <div>
                  <span className="text-gray-600">Duration:</span>
                  <p>{currentExecution.totalDuration ? `${(currentExecution.totalDuration / 1000).toFixed(1)}s` : 'Running...'}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Flow Steps */}
      <div className="space-y-4">
        {flowSteps.map((step, index) => {
          const status = getStepStatus(step.id);
          const stepData = currentExecution?.steps.find(s => s.id === step.id);
          
          return (
            <Card key={step.id} className="relative">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  {/* Step Icon */}
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getStepColor(status, step.color)}`}>
                    {getStepIcon(status, step.icon)}
                  </div>

                  {/* Step Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{step.name}</h3>
                      <Badge variant="outline" className={status === 'completed' ? 'text-green-600 border-green-200' : status === 'processing' ? 'text-blue-600 border-blue-200' : 'text-gray-600 border-gray-200'}>
                        {status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{step.description}</p>
                    
                    {stepData?.output && (
                      <div className="text-xs text-gray-500">
                        {Object.entries(stepData.output).map(([key, value]) => (
                          <span key={key} className="mr-4">
                            {key}: {value}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Duration */}
                  {stepData?.duration && (
                    <div className="text-right">
                      <div className="text-sm font-medium">
                        {(stepData.duration / 1000).toFixed(1)}s
                      </div>
                    </div>
                  )}
                </div>

                {/* Arrow to next step */}
                {index < flowSteps.length - 1 && (
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Knowledge Base Learning */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <Brain className="w-8 h-8 text-blue-600" />
            <div>
              <h3 className="font-semibold text-blue-900">Continuous Learning</h3>
              <p className="text-sm text-blue-700">
                Each query and interaction updates the knowledge base, making the system smarter over time.
                The RAG pipeline learns from every user interaction to improve future responses.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
