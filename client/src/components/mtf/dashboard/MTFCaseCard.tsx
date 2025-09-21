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

interface MTFCaseCardProps {
  case_: MTFCase;
  onSelect: () => void;
  compact?: boolean;
}

export function MTFCaseCard({ case_, onSelect, compact = false }: MTFCaseCardProps) {
  const getUrgencyIcon = (urgency: number) => {
    if (urgency <= 4) return <ArrowUp className="h-4 w-4 text-red-600" />;
    if (urgency <= 24) return <ArrowUp className="h-4 w-4 text-orange-600" />;
    return <ArrowDown className="h-4 w-4 text-green-600" />;
  };

  if (compact) {
    return (
      <Card className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={onSelect}>
        <CardContent className="p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <User className="h-4 w-4 text-gray-500" />
              <div>
                <div className="font-medium">{case_.patientName}</div>
                <div className="text-sm text-gray-500">{case_.age}y {case_.gender === 'female' ? 'F' : 'M'}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={getRiskLevelColor(case_.riskLevel)}>
                {case_.riskLevel.toUpperCase()}
              </Badge>
              <Badge className={getStatusColor(case_.status)}>
                {getStatusText(case_.status)}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-l-4 border-l-blue-500 hover:bg-gray-50 transition-colors">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-3">
              <User className="h-4 w-4 text-gray-500" />
              <span className="font-medium text-lg">{case_.patientName}</span>
              <Badge variant="outline">{case_.age}y {case_.gender === 'female' ? 'F' : 'M'}</Badge>
              <Badge className={getRiskLevelColor(case_.riskLevel)}>
                {case_.riskLevel.toUpperCase()}
              </Badge>
              {case_.mtfSuspected && (
                <Badge variant="destructive">MTF Suspected</Badge>
              )}
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Risk Score:</span>
                <span className="ml-2 font-medium">{case_.riskScore}/100</span>
              </div>
              <div>
                <span className="text-gray-500">Confidence:</span>
                <span className="ml-2 font-medium">{case_.confidence}%</span>
              </div>
              <div>
                <span className="text-gray-500">Report Type:</span>
                <span className="ml-2 font-medium">{case_.reportType.toUpperCase()}</span>
              </div>
              <div className="flex items-center">
                <span className="text-gray-500">Urgency:</span>
                <span className="ml-2 flex items-center gap-1">
                  {getUrgencyIcon(case_.urgency)}
                  {case_.urgency}h
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge className={getStatusColor(case_.status)}>
                {getStatusText(case_.status)}
              </Badge>
              {case_.specialistReferral && (
                <Badge variant="outline">Specialist Referral Required</Badge>
              )}
              <span className="text-xs text-gray-500">
                {case_.createdAt.toLocaleString('en-US')}
              </span>
            </div>
          </div>

          <div className="flex gap-2 ml-4">
            <Button size="sm" variant="outline" onClick={onSelect}>
              View Details
            </Button>
            {case_.status === 'pending' && (
              <>
                <Button size="sm" variant="outline">
                  <Phone className="w-4 h-4 mr-1" />
                  Contact Patient
                </Button>
                <Button size="sm">
                  <Mail className="w-4 h-4 mr-1" />
                  Send Outreach
                </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
