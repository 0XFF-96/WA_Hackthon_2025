import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  Bot, 
  AlertCircle, 
  Mail,
  BarChart3,
  UserCheck,
  Users,
  Monitor,
  Shield
} from 'lucide-react';

import { ProcessingData, FlowingDot, SankeyData } from '@/types/mtf-console';
import { MiniSankeyDiagram } from './MiniSankeyDiagram';

interface ProcessingPipelineProps {
  processingData: ProcessingData;
  flowingDots: FlowingDot[];
}

export function ProcessingPipeline({ processingData, flowingDots }: ProcessingPipelineProps) {
  const stages = [
    { id: 'import', label: 'Import', icon: Upload, color: 'blue' },
    { id: 'analysis', label: 'Analysis', icon: Bot, color: 'purple' },
    { id: 'risk', label: 'Risk', icon: AlertCircle, color: 'orange' },
    { id: 'outreach', label: 'Outreach', icon: Mail, color: 'green' }
  ];

  return (
    <div className="space-y-6">
      {/* Pipeline Stages */}
      <div className="relative">
        <div className="grid grid-cols-4 gap-4">
          {stages.map((stage, index) => {
            const data = processingData[stage.id as keyof ProcessingData];
            const progressPercentage = (data.active / data.total) * 100;
            
            return (
              <div key={stage.id} className="relative">
                {/* Connection Line */}
                {index < stages.length - 1 && (
                  <div className="absolute top-8 left-full w-4 h-0.5 bg-gray-300 z-0">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50 animate-workflow-flow"></div>
                  </div>
                )}
                
                {/* Stage Card */}
                <div className={`relative bg-white border-2 border-${stage.color}-200 rounded-lg p-4 hover:shadow-md transition-all duration-300`}>
                  {/* Flowing Dots */}
                  <div className="absolute inset-0 overflow-hidden rounded-lg">
                    {flowingDots
                      .filter(dot => dot.stage === index)
                      .slice(0, 3) // Limit visible dots
                      .map(dot => (
                        <div
                          key={dot.id}
                          className={`absolute w-2 h-2 rounded-full animate-data-flow ${
                            dot.priority === 'critical' ? 'bg-red-500' :
                            dot.priority === 'high' ? 'bg-orange-500' :
                            dot.priority === 'medium' ? 'bg-blue-500' : 'bg-green-500'
                          }`}
                          style={{
                            top: `${20 + Math.random() * 60}%`,
                            animationDelay: `${Math.random() * 2}s`,
                            animationDuration: `${2 + Math.random() * 2}s`
                          }}
                        />
                      ))
                    }
                  </div>
                  
                  {/* Stage Content */}
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-3">
                      <div className={`w-8 h-8 bg-${stage.color}-100 rounded-lg flex items-center justify-center`}>
                        <stage.icon className={`w-4 h-4 text-${stage.color}-600`} />
                      </div>
                      <span className="font-medium text-gray-900">{stage.label}</span>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Active</span>
                        <span className="font-bold text-gray-900">{data.active}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 bg-${stage.color}-500 rounded-full transition-all duration-1000 animate-progress-wave`}
                          style={{ width: `${progressPercentage}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Pending: {data.pending}</span>
                        <span>{Math.round(progressPercentage)}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mini Sankey Diagram */}
      <MiniSankeyDiagram />
    </div>
  );
}
