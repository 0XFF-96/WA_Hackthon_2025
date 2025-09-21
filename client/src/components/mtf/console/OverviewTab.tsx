import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  Activity, 
  Monitor, 
  Brain,
  Scan
} from 'lucide-react';

import { WorkflowVisualization } from '../WorkflowVisualization';

interface OverviewTabProps {
  onCaseSelect?: (caseId: string) => void;
}

export function OverviewTab({ onCaseSelect }: OverviewTabProps) {
  return (
    <div className="space-y-6">
      {/* Animated Workflow */}
      <WorkflowVisualization />

      {/* System Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { icon: Shield, label: "Reports Processed", value: "1,247", change: "+12%", color: "text-blue-600", bgColor: "bg-blue-50" },
          { icon: Activity, label: "MTF Detected", value: "89", change: "+8%", color: "text-red-600", bgColor: "bg-red-50" },
          { icon: Monitor, label: "Pending Review", value: "23", change: "-5%", color: "text-orange-600", bgColor: "bg-orange-50" },
          { icon: Brain, label: "Avg Confidence", value: "94.2%", change: "+2%", color: "text-purple-600", bgColor: "bg-purple-50" },
        ].map((stat, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <Badge variant="secondary" className="text-xs px-2 py-0.5">
                    {stat.change}
                  </Badge>
                </div>
                <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-l-blue-500">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Quick Actions</h3>
              <p className="text-gray-600">Manage MTF detection workflow and system operations</p>
            </div>
            <div className="flex items-center gap-3">
              <Button size="sm" variant="outline">
                <Scan className="w-4 h-4 mr-2" />
                Start Batch Scan
              </Button>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                <Activity className="w-4 h-4 mr-2" />
                View All Cases
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Alerts */}
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center text-base">
            <div className="w-6 h-6 bg-yellow-100 rounded-lg flex items-center justify-center mr-2">
              <Activity className="w-3 h-3 text-yellow-600" />
            </div>
            System Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              {
                type: 'warning',
                message: '2 high-priority cases require immediate attention',
                time: '5 minutes ago',
                action: 'View Cases'
              },
              {
                type: 'info',
                message: 'Batch processing completed successfully (95/100)',
                time: '15 minutes ago',
                action: 'View Report'
              },
              {
                type: 'success',
                message: 'System performance optimal - 94.2% accuracy',
                time: '1 hour ago',
                action: 'View Details'
              }
            ].map((alert, index) => (
              <div key={index} className={`p-3 rounded-lg border-l-4 ${
                alert.type === 'warning' ? 'bg-yellow-50 border-l-yellow-400' :
                alert.type === 'info' ? 'bg-blue-50 border-l-blue-400' :
                'bg-green-50 border-l-green-400'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{alert.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
                  </div>
                  <Button size="sm" variant="outline" className="text-xs">
                    {alert.action}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
