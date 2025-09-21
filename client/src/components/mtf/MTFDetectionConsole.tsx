import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  Activity, 
  Monitor,
  Scan,
  Users,
  BarChart3
} from 'lucide-react';

import { MTFDetectionConsoleProps } from '@/types/mtf-console';
import { OverviewTab } from './console/OverviewTab';
import { ScanningTab } from './console/ScanningTab';
import { CasesTab } from './console/CasesTab';
import { AnalyticsTab } from './console/AnalyticsTab';

export function MTFDetectionConsole({ onCaseSelect }: MTFDetectionConsoleProps) {
  const [activeConsoleTab, setActiveConsoleTab] = useState('overview');

  return (
    <div className="space-y-6">
      {/* Console Header */}
      <Card className="border-l-4 border-l-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">MTF Detection Console</h2>
                <p className="text-gray-600">Real-time monitoring and analysis dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                <Activity className="w-3 h-3 mr-1" />
                Active
              </Badge>
              <Button size="sm" variant="outline">
                <Scan className="w-4 h-4 mr-2" />
                Full Scan
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Console Tabs */}
      <Tabs value={activeConsoleTab} onValueChange={setActiveConsoleTab}>
        <TabsList className="grid w-full grid-cols-4 h-12 bg-gray-50 rounded-xl p-1">
          <TabsTrigger value="overview" className="flex items-center justify-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <Monitor className="w-4 h-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="scanning" className="flex items-center justify-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <Scan className="w-4 h-4" />
            AI Scanning
          </TabsTrigger>
          <TabsTrigger value="cases" className="flex items-center justify-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <Users className="w-4 h-4" />
            Cases
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center justify-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <BarChart3 className="w-4 h-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        {/* Tab Contents */}
        <TabsContent value="overview" className="mt-6">
          <OverviewTab onCaseSelect={onCaseSelect} />
        </TabsContent>

        <TabsContent value="scanning" className="mt-6">
          <ScanningTab />
        </TabsContent>

        <TabsContent value="cases" className="mt-6">
          <CasesTab onCaseSelect={onCaseSelect} />
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <AnalyticsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default MTFDetectionConsole;