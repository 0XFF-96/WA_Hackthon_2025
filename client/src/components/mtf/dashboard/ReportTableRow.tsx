import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';

import { ReportScanData } from '@/types/mtf-console';
import { getRiskLevelColor, getStatusColor, getStatusText } from '@/lib/mtf-utils';

interface ReportTableRowProps {
  report: ReportScanData;
  index: number;
}

export function ReportTableRow({ report, index }: ReportTableRowProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, index * 100); // Staggered animation

    return () => clearTimeout(timer);
  }, [index]);

  const isCritical = report.aiPriority === 'critical';

  return (
    <tr 
      className={`border-b hover:bg-gray-50 transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
      } ${isCritical ? 'bg-red-50 border-red-200' : ''}`}
      style={{
        animationDelay: `${index * 100}ms`,
        animation: isCritical ? 'blink 2s ease-in-out' : 'none'
      }}
    >
      <td className="py-3 px-4 font-medium text-gray-900">{report.patientId}</td>
      <td className="py-3 px-4">
        <Badge variant="outline" className="uppercase">
          {report.scanType}
        </Badge>
      </td>
      <td className="py-3 px-4 text-sm text-gray-600">
        {report.scanTime.toLocaleString('en-US')}
      </td>
      <td className="py-3 px-4">
        <Badge className={getRiskLevelColor(report.aiPriority)}>
          {report.aiPriority.toUpperCase()}
        </Badge>
      </td>
      <td className="py-3 px-4">
        <div className="flex items-center gap-2">
          <div className="w-16 bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-1000 ${
                report.riskScore >= 80 ? 'bg-red-500' :
                report.riskScore >= 60 ? 'bg-orange-500' :
                report.riskScore >= 40 ? 'bg-yellow-500' : 'bg-green-500'
              }`}
              style={{ width: `${report.riskScore}%` }}
            />
          </div>
          <span className="text-sm font-medium">{report.riskScore}</span>
        </div>
      </td>
      <td className="py-3 px-4">
        <Badge className={getStatusColor(report.status)}>
          {getStatusText(report.status)}
        </Badge>
      </td>
    </tr>
  );
}
