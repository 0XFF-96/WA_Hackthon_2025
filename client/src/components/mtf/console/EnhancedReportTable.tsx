import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Scan,
  Eye,
  Send,
  MoreHorizontal,
  User,
  Stethoscope,
  Clock,
  AlertCircle,
  BarChart3,
  Activity,
  Monitor,
  Brain,
  FileText
} from 'lucide-react';

import { ReportScanData } from '@/types/mtf-console';
import { getRiskLevelColor, getStatusColor, getStatusText, getRelativeTime } from '@/lib/mtf-utils';

export function EnhancedReportTable() {
  const [, setLocation] = useLocation();
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [reports, setReports] = useState<ReportScanData[]>([
    {
      id: 'scan_001',
      patientId: 'P001234',
      patientName: 'Sarah Johnson',
      age: 72,
      gender: 'Female',
      scanType: 'xray',
      scanTime: new Date('2024-01-20T10:30:00'),
      aiPriority: 'critical',
      riskScore: 89,
      status: 'pending_review',
      isNew: true,
      reportSummary: 'Acute fracture of the distal radius with dorsal angulation. No evidence of comminution. Soft tissue swelling present.',
      fractureLocation: 'Distal Radius',
      injuryMechanism: 'Fall from standing height',
      aiConfidence: 0.94,
      riskFactors: ['Age >70', 'Female gender', 'Low trauma mechanism', 'Previous fracture history'],
      emailStatus: 'pending',
      emailContent: undefined
    },
    {
      id: 'scan_002', 
      patientId: 'P001235',
      patientName: 'Michael Chen',
      age: 45,
      gender: 'Male',
      scanType: 'ct',
      scanTime: new Date('2024-01-20T10:25:00'),
      aiPriority: 'high',
      riskScore: 76,
      status: 'outreach_sent',
      isNew: false,
      emailStatus: 'sent',
      emailSentTime: new Date('2024-01-20T11:15:00'),
    },
    {
      id: 'scan_003',
      patientId: 'P001236',
      patientName: 'Emma Rodriguez',
      age: 35,
      gender: 'Female',
      scanType: 'mri',
      scanTime: new Date('2024-01-20T10:20:00'),
      aiPriority: 'medium',
      riskScore: 62,
      status: 'completed',
      isNew: false,
      emailStatus: 'not_required',
    }
  ]);

  // Simulate new reports arriving
  useEffect(() => {
    const interval = setInterval(() => {
      const newReport: ReportScanData = {
        id: `scan_${Date.now()}`,
        patientId: `P00${Math.floor(Math.random() * 9999)}`,
        patientName: ['John Doe', 'Jane Smith', 'Bob Wilson', 'Alice Brown'][Math.floor(Math.random() * 4)],
        age: Math.floor(Math.random() * 60) + 20,
        gender: ['Male', 'Female'][Math.floor(Math.random() * 2)],
        scanType: (['xray', 'ct', 'mri'] as const)[Math.floor(Math.random() * 3)],
        scanTime: new Date(),
        aiPriority: (['critical', 'high', 'medium', 'low'] as const)[Math.floor(Math.random() * 4)],
        riskScore: Math.floor(Math.random() * 100),
        status: 'pending_review',
        isNew: true,
        emailStatus: 'pending',
      };

      setReports(prev => [newReport, ...prev.slice(0, 9)]);
      
      // Remove new flag after animation
      setTimeout(() => {
        setReports(prev => prev.map(r => r.id === newReport.id ? { ...r, isNew: false } : r));
      }, 3000);
    }, 15000); // New report every 15 seconds

    return () => clearInterval(interval);
  }, []);

  const getScanTypeIcon = (type: string) => {
    switch (type) {
      case 'xray': return <Monitor className="w-4 h-4" />;
      case 'ct': return <Scan className="w-4 h-4" />;
      case 'mri': return <Brain className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getPriorityConfig = (priority: string) => {
    switch (priority) {
      case 'critical':
        return {
          icon: <AlertCircle className="w-3 h-3" />,
          bgClass: 'bg-red-100',
          textClass: 'text-red-800',
        };
      case 'high':
        return {
          icon: <BarChart3 className="w-3 h-3" />,
          bgClass: 'bg-orange-100',
          textClass: 'text-orange-800',
        };
      case 'medium':
        return {
          icon: <Clock className="w-3 h-3" />,
          bgClass: 'bg-yellow-100',
          textClass: 'text-yellow-800',
        };
      default:
        return {
          icon: <Activity className="w-3 h-3" />,
          bgClass: 'bg-green-100',
          textClass: 'text-green-800',
        };
    }
  };

  const handleRowClick = (reportId: string) => {
    // Navigate to dedicated case detail page
    setLocation(`/case-detail/${reportId}`);
  };

  const handleRowSelect = (reportId: string) => {
    setSelectedRows(prev => 
      prev.includes(reportId) 
        ? prev.filter(id => id !== reportId)
        : [...prev, reportId]
    );
  };

  return (
    <Card className="shadow-sm overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center text-lg">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
              <Scan className="w-4 h-4 text-purple-600" />
            </div>
            Recent Scan Results
            <Badge className="ml-3 bg-green-100 text-green-700">
              Live
            </Badge>
          </CardTitle>
          
          {selectedRows.length > 0 && (
            <div className="flex items-center gap-2">
              <Badge className="bg-blue-100 text-blue-800">
                {selectedRows.length} selected
              </Badge>
              <Button size="sm" variant="outline">
                <Eye className="w-3 h-3 mr-1" />
                Review
              </Button>
              <Button size="sm" variant="outline">
                <Send className="w-3 h-3 mr-1" />
                Send Outreach
              </Button>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr className="border-b border-gray-200">
                <th className="text-left py-4 px-4 font-semibold text-gray-700">
                  <input 
                    type="checkbox" 
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedRows(reports.map(r => r.id));
                      } else {
                        setSelectedRows([]);
                      }
                    }}
                    checked={selectedRows.length === reports.length}
                  />
                </th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Patient ID
                  </div>
                </th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">
                  <div className="flex items-center gap-2">
                    <Stethoscope className="w-4 h-4" />
                    Scan Type
                  </div>
                </th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Scan Time
                  </div>
                </th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    AI Priority
                  </div>
                </th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4" />
                    Risk Score
                  </div>
                </th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4" />
                    Status
                  </div>
                </th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report, index) => {
                const priorityConfig = getPriorityConfig(report.aiPriority);
                const isSelected = selectedRows.includes(report.id);
                
                return (
                  <tr 
                    key={report.id}
                    className={`border-b border-gray-100 transition-all duration-200 cursor-pointer
                      ${report.isNew ? 'animate-slide-in-up bg-blue-50' : ''}
                      ${isSelected ? 'bg-purple-50 border-purple-200' : 'hover:bg-gray-50'}
                      ${report.aiPriority === 'critical' ? 'border-l-4 border-l-red-500' : ''}
                      group
                    `}
                    onClick={() => handleRowClick(report.id)}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <td className="py-4 px-4" onClick={(e) => e.stopPropagation()}>
                      <input 
                        type="checkbox"
                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                        checked={isSelected}
                        onChange={() => handleRowSelect(report.id)}
                      />
                    </td>
                    
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <User className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{report.patientId}</div>
                          {report.isNew && (
                            <div className="text-xs text-blue-600 font-medium">New Case</div>
                          )}
                        </div>
                      </div>
                    </td>
                    
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                          {getScanTypeIcon(report.scanType)}
                        </div>
                        <Badge variant="outline" className="font-medium">
                          {report.scanType.toUpperCase()}
                        </Badge>
                      </div>
                    </td>
                    
                    <td className="py-4 px-4">
                      <div className="space-y-1">
                        <div className="text-sm font-medium text-gray-900">
                          {report.scanTime.toLocaleTimeString('en-US', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </div>
                        <div className="text-xs text-gray-500">
                          {getRelativeTime(report.scanTime)}
                        </div>
                      </div>
                    </td>
                    
                    <td className="py-4 px-4">
                      <Badge 
                        className={`${priorityConfig.bgClass} ${priorityConfig.textClass} font-medium`}
                      >
                        <span className="flex items-center gap-1">
                          {priorityConfig.icon}
                          {report.aiPriority.toUpperCase()}
                        </span>
                      </Badge>
                    </td>
                    
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${
                              report.riskScore >= 80 ? 'bg-red-500' :
                              report.riskScore >= 60 ? 'bg-orange-500' :
                              report.riskScore >= 40 ? 'bg-yellow-500' : 'bg-green-500'
                            }`}
                            style={{ 
                              width: `${report.riskScore}%`
                            }}
                          />
                        </div>
                        <span className={`text-sm font-bold ${
                          report.riskScore >= 80 ? 'text-red-600' :
                          report.riskScore >= 60 ? 'text-orange-600' :
                          report.riskScore >= 40 ? 'text-yellow-600' : 'text-green-600'
                        }`}>
                          {report.riskScore}
                        </span>
                      </div>
                    </td>
                    
                    <td className="py-4 px-4">
                      <Badge className={getStatusColor(report.status)}>
                        {getStatusText(report.status)}
                      </Badge>
                    </td>
                    
                    <td className="py-4 px-4" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                          <Send className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
