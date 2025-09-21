import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Phone, 
  Mail,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

import { MTFCase } from '@/types/mtf-console';
import { getRiskLevelColor, getStatusColor, getStatusText } from '@/lib/mtf-utils';

interface CriticalCaseCardProps {
  case_: MTFCase;
  onSelect: () => void;
}

export function CriticalCaseCard({ case_, onSelect }: CriticalCaseCardProps) {
  const getUrgencyIcon = (urgency: number) => {
    if (urgency <= 4) return <ArrowUp className="h-4 w-4 text-red-600" />;
    if (urgency <= 24) return <ArrowUp className="h-4 w-4 text-orange-600" />;
    return <ArrowDown className="h-4 w-4 text-green-600" />;
  };

  return (
    <Card className="border-l-4 border-l-red-500 bg-gradient-to-r from-red-50 to-red-100 hover:from-red-100 hover:to-red-200 transition-all duration-200 shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="space-y-3 flex-1">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-red-200 rounded-lg flex items-center justify-center">
                <User className="h-4 w-4 text-red-600" />
              </div>
              <div>
                <div className="font-semibold text-lg text-gray-900">{case_.patientName}</div>
                <div className="text-sm text-gray-600">{case_.age}y {case_.gender === 'female' ? 'F' : 'M'} • {case_.patientId}</div>
              </div>
              <div className="flex gap-2">
                <Badge className={getRiskLevelColor(case_.riskLevel)}>
                  {case_.riskLevel.toUpperCase()}
                </Badge>
                {case_.mtfSuspected && (
                  <Badge variant="destructive">MTF Suspected</Badge>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="bg-white/60 p-2 rounded-lg">
                <div className="text-gray-500 text-xs">Risk Score</div>
                <div className="font-bold text-red-600">{case_.riskScore}/100</div>
              </div>
              <div className="bg-white/60 p-2 rounded-lg">
                <div className="text-gray-500 text-xs">Confidence</div>
                <div className="font-bold text-gray-900">{case_.confidence}%</div>
              </div>
              <div className="bg-white/60 p-2 rounded-lg">
                <div className="text-gray-500 text-xs">Report Type</div>
                <div className="font-bold text-gray-900">{case_.reportType.toUpperCase()}</div>
              </div>
              <div className="bg-white/60 p-2 rounded-lg">
                <div className="text-gray-500 text-xs">Urgency</div>
                <div className="font-bold text-gray-900 flex items-center gap-1">
                  {getUrgencyIcon(case_.urgency)}
                  {case_.urgency}h
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge className={getStatusColor(case_.status)}>
                  {getStatusText(case_.status)}
                </Badge>
                {case_.specialistReferral && (
                  <Badge variant="outline" className="border-red-300 text-red-700">
                    Specialist Referral Required
                  </Badge>
                )}
              </div>
              <div className="text-xs text-gray-500">
                {case_.createdAt.toLocaleString('en-US')}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 ml-4">
            <Button size="sm" variant="outline" onClick={onSelect} className="text-red-700 border-red-300 hover:bg-red-50">
              View Details
            </Button>
            <Button size="sm" variant="outline" className="text-red-700 border-red-300 hover:bg-red-50">
              <Phone className="w-3 h-3 mr-1" />
              Contact
            </Button>
            <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white">
              <Mail className="w-3 h-3 mr-1" />
              Outreach
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
