import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3,
  UserCheck,
  Users,
  Monitor,
  Shield
} from 'lucide-react';

import { SankeyData } from '@/types/mtf-console';

export function MiniSankeyDiagram() {
  const [sankeyData, setSankeyData] = useState<SankeyData>({
    gpReferrals: 42,
    specialistReferrals: 18,
    monitoring: 25,
    discharged: 15
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setSankeyData({
        gpReferrals: 35 + Math.floor(Math.random() * 15),
        specialistReferrals: 15 + Math.floor(Math.random() * 10),
        monitoring: 20 + Math.floor(Math.random() * 10),
        discharged: 10 + Math.floor(Math.random() * 10)
      });
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  const total = Object.values(sankeyData).reduce((sum, val) => sum + val, 0);

  return (
    <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-l-4 border-l-indigo-500">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-base">
          <div className="w-6 h-6 bg-indigo-100 rounded-lg flex items-center justify-center mr-2">
            <BarChart3 className="w-3 h-3 text-indigo-600" />
          </div>
          Case Distribution Flow
          <Badge variant="secondary" className="ml-auto text-xs">
            Real-time
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Flow Bars */}
          <div className="space-y-3">
            {[
              { key: 'gpReferrals', label: 'GP Referrals', color: 'bg-blue-500', icon: UserCheck },
              { key: 'specialistReferrals', label: 'Specialist Referrals', color: 'bg-red-500', icon: Users },
              { key: 'monitoring', label: 'Continued Monitoring', color: 'bg-yellow-500', icon: Monitor },
              { key: 'discharged', label: 'Discharged', color: 'bg-green-500', icon: Shield }
            ].map(item => {
              const value = sankeyData[item.key as keyof SankeyData];
              const percentage = (value / total) * 100;
              
              return (
                <div key={item.key} className="flex items-center gap-3">
                  <div className="w-16 text-xs text-gray-600 flex items-center gap-1">
                    <item.icon className="w-3 h-3" />
                    {item.label.split(' ')[0]}
                  </div>
                  <div className="flex-1 relative">
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className={`h-3 ${item.color} rounded-full transition-all duration-1000 relative overflow-hidden`}
                        style={{ width: `${percentage}%` }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-workflow-flow"></div>
                      </div>
                    </div>
                    <div className="absolute -top-6 right-0 text-xs font-medium text-gray-700">
                      {value} ({Math.round(percentage)}%)
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary */}
          <div className="flex justify-between items-center pt-2 border-t border-gray-200">
            <span className="text-sm font-medium text-gray-700">Total Processed</span>
            <span className="text-lg font-bold text-indigo-600 animate-metric-update">{total}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
