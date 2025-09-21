import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  Users, 
  User,
  Phone,
  Mail
} from 'lucide-react';

import { MTFCase } from '@/types/mtf-console';
import { getRiskLevelColor, getStatusColor, getStatusText } from '@/lib/mtf-utils';

interface CasesTabProps {
  onCaseSelect?: (caseId: string) => void;
}

export function CasesTab({ onCaseSelect }: CasesTabProps) {
  const criticalCases: MTFCase[] = [
    {
      id: 'case_001',
      patientName: 'Margaret Johnson',
      patientId: 'P001234',
      age: 73,
      gender: 'female',
      riskScore: 89,
      riskLevel: 'critical',
      mtfSuspected: true,
      confidence: 94,
      reportType: 'xray',
      status: 'pending',
      urgency: 4,
      specialistReferral: true,
      createdAt: new Date('2024-01-15T10:30:00')
    },
    {
      id: 'case_002',
      patientName: 'Robert Smith',
      patientId: 'P001235',
      age: 68,
      gender: 'male',
      riskScore: 82,
      riskLevel: 'critical',
      mtfSuspected: true,
      confidence: 87,
      reportType: 'ct',
      status: 'reviewed',
      urgency: 12,
      specialistReferral: true,
      createdAt: new Date('2024-01-15T10:25:00')
    }
  ];

  return (
    <div className="space-y-6">
      {/* Critical Cases Alert */}
      <Card className="border-red-200 bg-gradient-to-r from-red-50 to-red-100 shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-red-600" />
              <span className="text-red-800 font-medium">
                <strong>{criticalCases.length} critical MTF cases</strong> require specialist evaluation within 24 hours
              </span>
            </div>
            <Button size="sm" variant="outline" className="text-red-700 border-red-300 hover:bg-red-100">
              View All Cases
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Critical Cases List */}
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center text-lg">
            <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mr-3">
              <Shield className="w-4 h-4 text-red-600" />
            </div>
            Critical Cases ({criticalCases.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {criticalCases.map((case_) => (
              <div key={case_.id} className="border-l-4 border-l-red-500 bg-gradient-to-r from-red-50 to-red-100 hover:from-red-100 hover:to-red-200 transition-all duration-200 shadow-sm rounded-lg">
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-red-200 rounded-lg flex items-center justify-center">
                          <Users className="h-4 w-4 text-red-600" />
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
                          <div className="text-gray-500 text-xs">Status</div>
                          <div className="font-bold text-gray-900">{getStatusText(case_.status)}</div>
                        </div>
                        <div className="bg-white/60 p-2 rounded-lg">
                          <div className="text-gray-500 text-xs">Specialist</div>
                          <div className="font-bold text-gray-900">{case_.specialistReferral ? 'Required' : 'Not Required'}</div>
                        </div>
                        <div className="bg-white/60 p-2 rounded-lg">
                          <div className="text-gray-500 text-xs">Created</div>
                          <div className="font-bold text-gray-900">{case_.createdAt.toLocaleDateString()}</div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 ml-4">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => onCaseSelect?.(case_.id)}
                        className="text-red-700 border-red-300 hover:bg-red-50"
                      >
                        View Details
                      </Button>
                      <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white">
                        <Phone className="w-3 h-3 mr-1" />
                        Contact Patient
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Cases */}
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center text-base">
            <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center mr-2">
              <Users className="w-3 h-3 text-blue-600" />
            </div>
            Recent Cases
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { id: 'case_003', name: 'Alice Brown', riskScore: 72, status: 'reviewed' },
              { id: 'case_004', name: 'David Wilson', riskScore: 65, status: 'contacted' },
              { id: 'case_005', name: 'Emma Davis', riskScore: 58, status: 'completed' }
            ].map((case_) => (
              <div key={case_.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <User className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{case_.name}</div>
                    <div className="text-sm text-gray-600">Risk Score: {case_.riskScore}/100</div>
                  </div>
                </div>
                <Badge variant="outline">{getStatusText(case_.status)}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
