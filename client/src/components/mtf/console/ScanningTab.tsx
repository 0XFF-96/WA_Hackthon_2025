import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain } from 'lucide-react';

import { useMTFProcessing } from '@/hooks/useMTFProcessing';
import { ProcessingPipeline } from './ProcessingPipeline';
import { EnhancedReportTable } from './EnhancedReportTable';

export function ScanningTab() {
  const { processingData, flowingDots } = useMTFProcessing();

  return (
    <div className="space-y-6">
      {/* AI Processing Pipeline */}
      <Card className="border-t-4 border-t-purple-500 bg-gradient-to-r from-purple-50 to-indigo-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-600" />
            AI Processing Pipeline
            <Badge variant="secondary" className="ml-auto bg-green-100 text-green-800">
              Live Processing
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ProcessingPipeline 
            processingData={processingData} 
            flowingDots={flowingDots}
          />
        </CardContent>
      </Card>

      {/* AI Report Auto-Scanning KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { 
            icon: 'Scan', 
            label: "Total Reports Scanned", 
            value: 1247 + (processingData.import.active + processingData.analysis.active), 
            change: "+12%", 
            color: "text-blue-600", 
            bgColor: "bg-blue-50",
            borderColor: "border-blue-200"
          },
          { 
            icon: 'Shield', 
            label: "Suspected MTF Cases", 
            value: 89 + Math.floor(processingData.risk.active * 0.6), 
            change: "+8%", 
            color: "text-red-600", 
            bgColor: "bg-red-50",
            borderColor: "border-red-200"
          },
          { 
            icon: 'Activity', 
            label: "Processing Queue", 
            value: Object.values(processingData).reduce((sum, stage) => sum + stage.active, 0), 
            change: "+15%", 
            color: "text-orange-600", 
            bgColor: "bg-orange-50",
            borderColor: "border-orange-200"
          },
          { 
            icon: 'Brain', 
            label: "AI Confidence Avg", 
            value: "94.2%", 
            change: "+2%", 
            color: "text-purple-600", 
            bgColor: "bg-purple-50",
            borderColor: "border-purple-200"
          },
        ].map((stat, index) => (
          <Card key={index} className={`hover:shadow-lg transition-all duration-300 border-l-4 ${stat.borderColor} ${stat.bgColor}`}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 animate-metric-update">{stat.value}</p>
                  <Badge variant="secondary" className="text-xs px-2 py-0.5">
                    {stat.change}
                  </Badge>
                </div>
                <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center border ${stat.borderColor}`}>
                  <div className={`w-6 h-6 ${stat.color}`}>
                    {/* Icon placeholder - actual icons would be imported */}
                    <div className="w-full h-full bg-current opacity-70 rounded" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Enhanced Interactive Report Table */}
      <EnhancedReportTable />
    </div>
  );
}
