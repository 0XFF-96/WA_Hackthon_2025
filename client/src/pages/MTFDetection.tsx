import React, { useState } from 'react';
import { MTFDetectionConsole } from '@/components/mtf/MTFDetectionConsole';
import { ReportImportHub } from '@/components/mtf/ReportImportHub';
import { PatientOutreachCenter } from '@/components/mtf/PatientOutreachCenter';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Shield, 
  Upload, 
  Users, 
  BarChart3,
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowRight,
  Brain,
  FileText,
  Phone,
  Activity,
  Zap,
  Target
} from 'lucide-react';

export default function MTFDetectionPage() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedCase, setSelectedCase] = useState<any>(null);
  const [importResult, setImportResult] = useState<any>(null);

  // Handle import completion
  const handleImportComplete = (result: any) => {
    setImportResult(result);
    // Show success message or navigate to results page
    console.log('Import completed:', result);
  };

  // Handle case selection
  const handleCaseSelect = (caseId: string) => {
    // Fetch complete case data
    const mockCase = {
      id: caseId,
      patient: {
        id: 'patient_001',
        name: 'Margaret Johnson',
        email: 'margaret.johnson@email.com',
        phone: '+1-555-0123',
        age: 73,
        gender: 'female'
      },
      scanResult: {
        riskScore: 89,
        riskLevel: 'critical',
        mtfSuspected: true,
        confidence: 94,
        keyFindings: {
          fractures: [
            {
              location: 'L1 Vertebral Body',
              type: 'Compression Fracture',
              severity: 'moderate',
              mechanism: 'Fall from standing height',
              isMinimalTrauma: true
            }
          ],
          riskFactors: ['Advanced age (>70 years)', 'Previous fracture history', 'Postmenopausal female', 'Osteoporosis'],
          recommendations: ['DEXA bone density scan', 'Orthopedic specialist referral', 'Fall risk assessment'],
          followUpRequired: true
        },
        processingTime: 1200
      },
      riskAssessment: {
        priority: 'critical',
        urgency: 4,
        specialistReferral: true,
        estimatedCost: 2500,
        followUpRequired: true,
        riskFactors: ['Advanced age (>70 years)', 'Previous fracture history', 'Postmenopausal female'],
        recommendations: ['Immediate orthopedic specialist consultation', 'Complete DEXA scan within 24 hours', 'Fall risk assessment'],
        preventionMeasures: ['Anti-osteoporotic medication therapy', 'Home safety modifications', 'Balance training']
      }
    };
    
    setSelectedCase(mockCase);
    setActiveTab('outreach');
  };

  // Workflow steps
  const workflowSteps = [
    {
      id: 1,
      title: 'Report Import',
      description: 'Upload or input radiology reports',
      icon: Upload,
      status: importResult ? 'completed' : 'pending',
      color: 'blue'
    },
    {
      id: 2,
      title: 'AI Analysis',
      description: 'AI-powered MTF detection & risk assessment',
      icon: Brain,
      status: importResult?.scanResult ? 'completed' : 'pending',
      color: 'purple'
    },
    {
      id: 3,
      title: 'Risk Assessment',
      description: 'Generate personalized risk evaluation',
      icon: Target,
      status: importResult?.riskAssessment ? 'completed' : 'pending',
      color: 'orange'
    },
    {
      id: 4,
      title: 'Patient Outreach',
      description: 'Automated personalized communication',
      icon: Phone,
      status: 'pending',
      color: 'green'
    }
  ];

  return (
    <div className="container mx-auto py-6 space-y-8">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">MTF Detection & Patient Outreach</h1>
              <p className="text-gray-600 mt-1 text-lg">Intelligent minimal trauma fracture detection and automated patient management system</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 mt-2">
          <Badge variant="secondary" className="bg-green-100 text-green-800 px-4 py-2 text-sm font-medium">
            <Activity className="w-4 h-4 mr-2" />
            System Online
          </Badge>
          <Badge variant="secondary" className="bg-blue-100 text-blue-800 px-4 py-2 text-sm font-medium">
            <Zap className="w-4 h-4 mr-2" />
            AI Ready
          </Badge>
        </div>
      </div>
      {/* Analysis Results Display */}
      {importResult && (
        <Card className="border-l-4 border-l-green-500 bg-gradient-to-r from-green-50 to-emerald-50 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-start justify-between gap-6">
              <div className="flex items-start gap-6 flex-1">
                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="h-7 w-7 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-green-900 mb-4 text-xl">AI Analysis Complete</h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                    <div className="bg-white/70 p-4 rounded-lg border border-green-200">
                      <span className="text-green-700 font-medium block mb-2">Risk Score</span>
                      <div className="text-2xl font-bold text-green-900">{importResult.scanResult?.riskScore || 0}/100</div>
                    </div>
                    <div className="bg-white/70 p-4 rounded-lg border border-green-200">
                      <span className="text-green-700 font-medium block mb-2">Confidence</span>
                      <div className="text-2xl font-bold text-green-900">{importResult.scanResult?.confidence || 0}%</div>
                    </div>
                    <div className="bg-white/70 p-4 rounded-lg border border-green-200">
                      <span className="text-green-700 font-medium block mb-2">MTF Suspected</span>
                      <div className="text-2xl font-bold text-green-900">
                        {importResult.scanResult?.mtfSuspected ? 'Yes' : 'No'}
                      </div>
                    </div>
                    <div className="bg-white/70 p-4 rounded-lg border border-green-200">
                      <span className="text-green-700 font-medium block mb-2">Processing Time</span>
                      <div className="text-2xl font-bold text-green-900">{importResult.processingTimeMs || 0}ms</div>
                    </div>
                  </div>
                  {importResult.scanResult?.mtfSuspected && (
                    <div className="mt-6 p-4 bg-red-50 border-l-4 border-l-red-400 rounded-lg">
                      <div className="flex items-center gap-3 text-red-800">
                        <AlertTriangle className="h-5 w-5 flex-shrink-0" />
                        <span className="font-semibold">Minimal Trauma Fracture detected - Immediate specialist evaluation recommended</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex-shrink-0">
                <Button 
                  onClick={() => setActiveTab('outreach')}
                  className="bg-green-600 hover:bg-green-700 px-6 py-3 shadow-md text-white font-medium"
                >
                  Generate Patient Outreach
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="w-full">
          <TabsList className="grid w-full grid-cols-4 h-12 bg-gray-100 rounded-xl p-1">
            <TabsTrigger value="dashboard" className="flex items-center justify-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-blue-500">
              <Shield className="w-4 h-4" />
              Detection Console
            </TabsTrigger>
            <TabsTrigger value="import" className="flex items-center justify-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-blue-500">
              <Upload className="w-4 h-4" />
              Report Import
            </TabsTrigger>
            <TabsTrigger value="outreach" className="flex items-center justify-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-blue-500" disabled={!selectedCase && !importResult}>
              <Users className="w-4 h-4" />
              Patient Outreach
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center justify-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-blue-500">
              <BarChart3 className="w-4 h-4" />
              Analytics
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Detection Console */}
        <TabsContent value="dashboard" className="mt-4">
          <MTFDetectionConsole onCaseSelect={handleCaseSelect} />
        </TabsContent>

        {/* Report Import */}
        <TabsContent value="import" className="mt-6">
          <ReportImportHub onImportComplete={handleImportComplete} />
        </TabsContent>

        {/* Patient Outreach */}
        <TabsContent value="outreach" className="mt-6">
          {(selectedCase || importResult) ? (
            <PatientOutreachCenter
              patient={selectedCase?.patient || {
                id: 'patient_imported',
                name: 'Imported Patient',
                email: 'patient@example.com',
                age: 65,
                gender: 'female'
              }}
              scanResult={selectedCase?.scanResult || importResult?.scanResult}
              riskAssessment={selectedCase?.riskAssessment || importResult?.riskAssessment}
              onOutreachSent={(outreach) => {
                console.log('Outreach sent:', outreach);
                // Update patient status or show success message
              }}
            />
          ) : (
            <Card className="border-dashed border-2 border-gray-200">
              <CardContent className="p-12 text-center">
                <div className="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-6">
                  <Users className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Select Patient for Outreach</h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  Please select a patient case from the detection console or import a new report to generate personalized patient outreach content.
                </p>
                <div className="flex gap-3 justify-center">
                  <Button 
                    variant="outline" 
                    onClick={() => setActiveTab('dashboard')}
                    className="px-6"
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    View Console
                  </Button>
                  <Button 
                    onClick={() => setActiveTab('import')}
                    className="px-6"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Import Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Analytics */}
        <TabsContent value="analytics" className="mt-6">
          <div className="grid gap-8">
            {/* Performance Overview */}
            <Card className="border-t-4 border-t-purple-500 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <BarChart3 className="h-5 w-5 text-purple-600" />
                  System Performance Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl text-center">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Brain className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-3xl font-bold text-blue-700 mb-1">94.2%</div>
                    <div className="text-sm font-medium text-blue-600">AI Detection Accuracy</div>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl text-center">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Zap className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-3xl font-bold text-green-700 mb-1">2.3s</div>
                    <div className="text-sm font-medium text-green-600">Average Processing Time</div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl text-center">
                    <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-3xl font-bold text-purple-700 mb-1">78%</div>
                    <div className="text-sm font-medium text-purple-600">Patient Response Rate</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Weekly Detection Stats */}
              <Card className="shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Shield className="h-5 w-5 text-red-600" />
                    Weekly Detection Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">Total Reports Processed</span>
                      <span className="font-bold text-lg text-gray-900">147</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                      <span className="text-sm font-medium text-red-700">MTF Detected</span>
                      <span className="font-bold text-lg text-red-600">23</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                      <span className="text-sm font-medium text-orange-700">High Risk Cases</span>
                      <span className="font-bold text-lg text-orange-600">31</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <span className="text-sm font-medium text-green-700">Patients Contacted</span>
                      <span className="font-bold text-lg text-green-600">89</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Outreach Effectiveness */}
              <Card className="shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Phone className="h-5 w-5 text-blue-600" />
                    Outreach Effectiveness Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                      <span className="text-sm font-medium text-blue-700">Emails Sent</span>
                      <span className="font-bold text-lg text-blue-600">89</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-indigo-50 rounded-lg">
                      <span className="text-sm font-medium text-indigo-700">Email Open Rate</span>
                      <span className="font-bold text-lg text-indigo-600">87%</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-violet-50 rounded-lg">
                      <span className="text-sm font-medium text-violet-700">SMS Sent</span>
                      <span className="font-bold text-lg text-violet-600">67</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                      <span className="text-sm font-medium text-purple-700">Phone Contacts</span>
                      <span className="font-bold text-lg text-purple-600">34</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
