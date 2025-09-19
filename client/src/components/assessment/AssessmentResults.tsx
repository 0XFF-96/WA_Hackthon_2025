import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  Download,
  Send,
  RefreshCw,
  Heart,
  Shield,
  FileText,
  Phone,
  Activity
} from 'lucide-react';
import { AssessmentData, AssessmentResult } from '@/types/assessment';
import { MonitoringEntry } from '@/components/monitoring/MonitoringEntry';
import { MonitoringDashboard } from '@/components/monitoring/MonitoringDashboard';

interface AssessmentResultsProps {
  data: AssessmentData;
  result: AssessmentResult;
  onRestart: () => void;
  onClose?: () => void;
}

export function AssessmentResults({ data, result, onRestart, onClose }: AssessmentResultsProps) {
  const [showMonitoringEntry, setShowMonitoringEntry] = useState(false);
  const [showMonitoringDashboard, setShowMonitoringDashboard] = useState(false);
  const getRiskLevelConfig = (level: string) => {
    switch (level) {
      case 'low':
        return {
          color: 'bg-green-100 text-green-800 border-green-200',
          icon: CheckCircle,
          bgColor: 'bg-green-50',
          textColor: 'text-green-900'
        };
      case 'medium':
        return {
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          icon: AlertTriangle,
          bgColor: 'bg-yellow-50',
          textColor: 'text-yellow-900'
        };
      case 'high':
        return {
          color: 'bg-red-100 text-red-800 border-red-200',
          icon: XCircle,
          bgColor: 'bg-red-50',
          textColor: 'text-red-900'
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: Heart,
          bgColor: 'bg-gray-50',
          textColor: 'text-gray-900'
        };
    }
  };

  const config = getRiskLevelConfig(result.riskLevel);

  const handleDownloadPDF = () => {
    // In a real app, this would generate and download a PDF
    console.log('Downloading PDF report...');
    alert('PDF download functionality would be implemented here');
  };

  const handleSendToDoctor = () => {
    // In a real app, this would send the report to a doctor
    console.log('Sending report to doctor...');
    alert('Send to doctor functionality would be implemented here');
  };

  const handleCallEmergency = () => {
    // In a real app, this would initiate emergency contact
    console.log('Calling emergency services...');
    alert('Emergency contact functionality would be implemented here');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className={`w-20 h-20 ${config.bgColor} rounded-full flex items-center justify-center`}>
            <config.icon className={`w-10 h-10 ${config.textColor}`} />
          </div>
        </div>
        
        <h2 className="text-3xl font-bold">Assessment Complete</h2>
        
        <Badge className={`${config.color} text-lg px-4 py-2`}>
          {result.riskLevel.toUpperCase()} RISK
        </Badge>
      </div>

      {/* Risk Score */}
      <Card className={`${config.bgColor} border-2 ${config.color.split(' ')[2]}`}>
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <h3 className="text-xl font-semibold">Risk Score</h3>
            <div className="text-4xl font-bold">{result.riskScore}/100</div>
            <Progress value={result.riskScore} className="h-3" />
            <p className="text-sm opacity-80">{result.summary}</p>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {result.recommendations.map((recommendation, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                  {index + 1}
                </div>
                <p className="text-sm">{recommendation}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Next Steps
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {result.nextSteps.map((step, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                  {index + 1}
                </div>
                <p className="text-sm">{step}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Monitoring Entry */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Activity className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                Keep Tracking Your Recovery
              </h3>
              <p className="text-blue-700 text-sm mb-4">
                Daily monitoring helps you and your doctor better understand your condition and track improvements over time.
              </p>
              <Button 
                onClick={() => setShowMonitoringEntry(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Activity className="w-4 h-4 mr-2" />
                Enable Daily Monitoring
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Button 
          onClick={handleDownloadPDF}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Download PDF Report
        </Button>
        
        <Button 
          onClick={handleSendToDoctor}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Send className="w-4 h-4" />
          Send to Doctor
        </Button>
      </div>

      {/* Emergency Contact */}
      {result.riskLevel === 'high' && (
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-red-600" />
              <div>
                <h4 className="font-semibold text-red-900">Need Immediate Help?</h4>
                <p className="text-sm text-red-700">
                  If you're experiencing severe pain or emergency symptoms, contact emergency services.
                </p>
              </div>
              <Button 
                onClick={handleCallEmergency}
                className="bg-red-600 hover:bg-red-700 text-white ml-auto"
              >
                Call Emergency
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Disclaimer */}
      <Card className="bg-gray-50">
        <CardContent className="p-4">
          <p className="text-xs text-gray-600 text-center">
            <strong>Disclaimer:</strong> This assessment is for informational purposes only and does not replace professional medical advice. 
            Always consult with a qualified healthcare provider for proper diagnosis and treatment.
          </p>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={onRestart}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Take Assessment Again
        </Button>
        
        {onClose && (
          <Button onClick={onClose} className="bg-primary hover:bg-primary/90">
            Close
          </Button>
        )}
      </div>

      {/* Monitoring Entry Modal */}
      {showMonitoringEntry && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <CardContent className="p-6 overflow-y-auto max-h-[90vh]">
              <MonitoringEntry
                onEnable={() => {
                  setShowMonitoringEntry(false);
                  setShowMonitoringDashboard(true);
                }}
                onSkip={() => setShowMonitoringEntry(false)}
              />
            </CardContent>
          </Card>
        </div>
      )}

      {/* Monitoring Dashboard Modal */}
      {showMonitoringDashboard && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-6xl max-h-[90vh] overflow-hidden">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Health Monitoring Dashboard</CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowMonitoringDashboard(false)}
                >
                  <XCircle className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="overflow-y-auto max-h-[calc(90vh-120px)]">
              <MonitoringDashboard onClose={() => setShowMonitoringDashboard(false)} />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
