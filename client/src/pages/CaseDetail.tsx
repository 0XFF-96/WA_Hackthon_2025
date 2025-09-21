import React, { useState, useEffect } from 'react';
import { useLocation, useRoute } from 'wouter';
import { 
  Brain, 
  ArrowLeft,
  Calendar,
  MapPin,
  Heart,
  MessageSquare,
  User,
  Stethoscope,
  HelpCircle,
  Lightbulb,
  Target,
  ThumbsUp,
  ThumbsDown,
  Flag,
  Save,
  Send,
  Eye,
  Copy
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// 使用与Console中相同的类型定义
interface ReportData {
  id: string;
  patientId: string;
  patientName: string;
  age: number;
  gender: string;
  scanType: string;
  scanTime: Date;
  aiPriority: string;
  riskScore: number;
  status: string;
  reportSummary: string;
  fractureLocation: string;
  injuryMechanism: string;
  aiConfidence: number;
  riskFactors: string[];
  aiExplanation: string;
  emailStatus?: string;
  emailSentTime?: Date;
  emailContent?: string;
}

const CaseDetail: React.FC = () => {
  const [, setLocation] = useLocation();
  const [match, params] = useRoute('/case-detail/:caseId');
  const [report, setReport] = useState<ReportData | null>(null);
  const [isEmailExpanded, setIsEmailExpanded] = useState(false);
  const [clinicianComment, setClinicianComment] = useState('');
  const [aiOverride, setAiOverride] = useState<'agree' | 'disagree' | null>(null);
  const [showNextSteps, setShowNextSteps] = useState(true);

  // 模拟数据加载（实际应用中从API获取）
  useEffect(() => {
    if (params?.caseId) {
      // 模拟从API获取数据
      const mockReport: ReportData = {
        id: params.caseId,
        patientId: 'MTF-2024-0892',
        patientName: 'Sarah Johnson',
        age: 68,
        gender: 'Female',
        scanType: 'X-ray',
        scanTime: new Date('2024-09-20T14:30:00'),
        aiPriority: 'High',
        riskScore: 85,
        status: 'Under Review',
        reportSummary: 'Anteroposterior and lateral radiographs of the right wrist demonstrate a comminuted intra-articular fracture of the distal radius with dorsal angulation. No evidence of high-energy trauma. Patient reports fall from standing height while walking. Bone density appears osteoporotic.',
        fractureLocation: 'Distal radius, right wrist',
        injuryMechanism: 'Fall from standing height',
        aiConfidence: 0.92,
        riskFactors: ['Age >65', 'Postmenopausal', 'Previous fracture', 'Low BMI', 'Minimal trauma mechanism'],
        aiExplanation: 'High confidence MTF detection based on low-energy trauma mechanism, patient demographics, and radiographic appearance consistent with osteoporotic fracture.',
        emailStatus: 'sent',
        emailSentTime: new Date('2024-09-20T15:45:00'),
        emailContent: 'Dear Ms. Johnson,\n\nFollowing your recent imaging, we want to discuss your bone health. Your X-ray shows a fracture that may be related to bone density. We recommend scheduling a follow-up with your doctor to discuss bone health assessment and prevention strategies.\n\nPlease contact us if you have any concerns.\n\nBest regards,\nBone Health Team'
      };
      setReport(mockReport);
    }
  }, [params?.caseId]);

  // 实用函数
  const getRiskColor = (score: number) => {
    if (score >= 80) return 'text-red-600';
    if (score >= 60) return 'text-orange-600';
    return 'text-green-600';
  };

  const getMTFClassification = (score: number) => {
    return score >= 70 ? {
      label: '✅ MTF Detected',
      className: 'bg-green-100 text-green-800 border-green-300'
    } : {
      label: '❌ Not MTF',
      className: 'bg-gray-100 text-gray-800 border-gray-300'
    };
  };

  const getProgressBarColor = (score: number) => {
    if (score >= 80) return 'bg-red-500';
    if (score >= 60) return 'bg-orange-500';
    return 'bg-green-500';
  };

  const highlightClinicalKeywords = (text: string) => {
    const keywords = ['fracture', 'comminuted', 'intra-articular', 'osteoporotic', 'minimal trauma', 'standing height', 'bone density'];
    let highlightedText = text;
    
    keywords.forEach(keyword => {
      const regex = new RegExp(`(${keyword})`, 'gi');
      highlightedText = highlightedText.replace(regex, '<mark class="bg-yellow-200 px-1 rounded">$1</mark>');
    });
    
    return { __html: highlightedText };
  };

  const getNextStepRecommendation = (riskScore: number) => {
    if (riskScore >= 80) {
      return {
        action: 'Refer to Specialist',
        icon: Target,
        title: 'Urgent Specialist Referral',
        description: 'High MTF risk requires immediate specialist evaluation for osteoporosis management.',
        buttonText: 'Send Referral',
        buttonIcon: Send
      };
    } else if (riskScore >= 60) {
      return {
        action: 'Send to GP',
        icon: Stethoscope,
        title: 'GP Follow-up Required',
        description: 'Moderate risk - schedule GP appointment for bone health assessment.',
        buttonText: 'Schedule GP Visit',
        buttonIcon: Calendar
      };
    } else {
      return {
        action: 'No Action',
        icon: Eye,
        title: 'Continue Monitoring',
        description: 'Low risk - routine monitoring and lifestyle recommendations.',
        buttonText: 'Mark as Reviewed',
        buttonIcon: Eye
      };
    }
  };

  const getRiskFactorDefinition = (factor: string) => {
    const definitions: Record<string, string> = {
      'Age >65': 'Advanced age increases fracture risk due to bone density decline',
      'Postmenopausal': 'Estrogen deficiency accelerates bone loss after menopause',
      'Previous fracture': 'History of fractures indicates compromised bone structure',
      'Low BMI': 'Low body weight associated with reduced bone density',
      'Minimal trauma mechanism': 'Fracture from low-energy impact suggests bone fragility'
    };
    return definitions[factor] || factor;
  };

  const getEmailStatusConfig = (status: string) => {
    switch (status) {
      case 'sent':
        return { icon: <Send className="w-4 h-4" />, label: 'Email Sent', color: 'bg-green-100 text-green-800' };
      case 'pending':
        return { icon: <MessageSquare className="w-4 h-4" />, label: 'Pending', color: 'bg-yellow-100 text-yellow-800' };
      default:
        return { icon: <Eye className="w-4 h-4" />, label: 'Not Required', color: 'bg-gray-100 text-gray-800' };
    }
  };

  if (!report) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading case details...</p>
        </div>
      </div>
    );
  }

  const mtfClassification = getMTFClassification(report.riskScore);
  const nextStepRec = getNextStepRecommendation(report.riskScore);

    return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white p-6 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full -translate-x-20 -translate-y-20"></div>
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-white rounded-full translate-x-16 translate-y-16"></div>
            <div className="absolute top-1/2 left-1/3 w-20 h-20 bg-white rounded-full -translate-y-10"></div>
          </div>
          
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLocation('/mtf-detection')}
                className="text-white hover:bg-white/20 p-2"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-3xl font-bold">Case Detail</h1>
                <p className="text-blue-100 mt-1">Patient: {report.patientName} • ID: {report.patientId}</p>
              </div>
            </div>
            <div className="text-right">
              <Badge className={`text-base px-4 py-2 border-2 ${mtfClassification.className}`}>
                {mtfClassification.label}
              </Badge>
              <div className="text-blue-100 text-sm mt-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                {report.scanTime.toLocaleDateString()} • {report.scanType}
              </div>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="p-8 space-y-8 max-w-7xl mx-auto">
          
          {/* Two-Column Layout */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            
            {/* Left Column - Patient & Report Info */}
            <div className="space-y-6">
              
              {/* Patient Information */}
              <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
                  <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <User className="w-5 h-5 text-blue-600" />
                    </div>
                    Patient Information
                  </h3>
          </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-sm text-gray-500 uppercase tracking-wider font-semibold">Patient Name</div>
                      <div className="text-lg font-bold text-gray-900">{report.patientName}</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-sm text-gray-500 uppercase tracking-wider font-semibold">Age / Gender</div>
                      <div className="text-lg font-bold text-gray-900">{report.age} years, {report.gender}</div>
                  </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-sm text-gray-500 uppercase tracking-wider font-semibold">Scan Time</div>
                      <div className="text-lg font-bold text-gray-900">{report.scanTime.toLocaleString()}</div>
                </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-sm text-gray-500 uppercase tracking-wider font-semibold">Scan Type</div>
                      <div className="text-lg font-bold text-gray-900">{report.scanType}</div>
              </div>
            </div>
          </CardContent>
        </Card>

              {/* Radiology Report */}
              <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-t-lg">
                  <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                    <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                      <Stethoscope className="w-5 h-5 text-amber-600" />
                    </div>
                    Radiology Report
                  </h3>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="prose prose-sm max-w-none">
                    <p className="text-gray-700 leading-relaxed" dangerouslySetInnerHTML={highlightClinicalKeywords(report.reportSummary)} />
                  </div>
                  <div className="grid grid-cols-1 gap-4 mt-6">
                    <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                      <div className="text-sm text-red-600 uppercase tracking-wider font-semibold">Fracture Location</div>
                      <div className="text-lg font-bold text-red-800">{report.fractureLocation}</div>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                      <div className="text-sm text-orange-600 uppercase tracking-wider font-semibold">Injury Mechanism</div>
                      <div className="text-lg font-bold text-orange-800">{report.injuryMechanism}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

            {/* Right Column - AI Assessment */}
            <div className="space-y-6">
              
              {/* AI Risk Assessment */}
              <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-t-lg">
                  <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Brain className="w-5 h-5 text-purple-600" />
        </div>
                    AI Risk Assessment
                  </h3>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  {/* Risk Score Display */}
                  <div className="text-center space-y-4">
                    <div className="text-7xl font-bold bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent">
                      {report.riskScore}
                </div>
                    <div className="text-sm text-gray-500 uppercase tracking-wider font-semibold">MTF Risk Score</div>
                    <div className="text-2xl font-bold text-gray-900">
                      {report.riskScore >= 80 ? 'High Risk' : 
                       report.riskScore >= 60 ? 'Moderate Risk' : 
                       'Low Risk'}
                </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Risk Level</span>
                      <span>{report.riskScore}%</span>
              </div>
                    <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
                      <div 
                        className={`h-full ${getProgressBarColor(report.riskScore)} transition-all duration-1000 ease-out rounded-full`}
                        style={{ width: `${report.riskScore}%` }}
                      ></div>
            </div>
                  </div>

                  {/* AI Confidence */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-700">AI Confidence</span>
                      <Tooltip>
                        <TooltipTrigger>
                          <Badge className="bg-blue-100 text-blue-800">
                            {report.aiConfidence >= 0.9 ? 'Very High' :
                             report.aiConfidence >= 0.8 ? 'High' :
                             report.aiConfidence >= 0.7 ? 'Moderate' : 'Low'} Confidence
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>AI confidence: {(report.aiConfidence * 100).toFixed(1)}%</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Risk Factors */}
              <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-t-lg">
                  <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Heart className="w-5 h-5 text-blue-600" />
                    </div>
                    Risk Factors
                  </h3>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="flex flex-wrap gap-3">
                    {report.riskFactors.map((factor, index) => (
                      <Tooltip key={index}>
                        <TooltipTrigger>
                          <Badge 
                            className="cursor-help bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border border-blue-300 hover:from-blue-200 hover:to-indigo-200 transition-all duration-200 px-3 py-2"
                          >
                            {factor}
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">{getRiskFactorDefinition(factor)}</p>
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </div>
                  <div className="text-xs text-gray-500 mt-4 flex items-center gap-2">
                    <HelpCircle className="w-4 h-4" />
                    Hover over risk factors for detailed clinical explanations
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Full-Width Sections */}
          <div className="space-y-8">
            
            {/* AI Analysis & Actions Row */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              
              {/* Explainable AI Analysis */}
              <Card className="xl:col-span-2 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-4 bg-gradient-to-r from-green-50 to-teal-50 rounded-t-lg">
                  <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <Lightbulb className="w-5 h-5 text-green-600" />
                    </div>
                    Explainable AI Analysis
                  </h3>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Positive Indicators */}
            <div className="space-y-3">
                      <h4 className="font-semibold text-green-700 flex items-center gap-2">
                        <ThumbsUp className="w-4 h-4" />
                        MTF Indicators
                      </h4>
                      <div className="space-y-2">
                        <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                          <div className="text-sm text-green-800">✓ Low-energy trauma mechanism</div>
                        </div>
                        <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                          <div className="text-sm text-green-800">✓ Age-related risk factors</div>
                        </div>
                        <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                          <div className="text-sm text-green-800">✓ Osteoporotic bone appearance</div>
                        </div>
                      </div>
                  </div>

                    {/* Negative Indicators */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-red-700 flex items-center gap-2">
                        <ThumbsDown className="w-4 h-4" />
                        Non-MTF Factors
                      </h4>
                      <div className="space-y-2">
                        <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                          <div className="text-sm text-gray-600">No high-energy trauma</div>
                  </div>
                        <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                          <div className="text-sm text-gray-600">No pathological findings</div>
                  </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

              {/* Next Steps */}
              <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-t-lg">
                  <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                    <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Target className="w-5 h-5 text-orange-600" />
                    </div>
                    Recommended Next Steps
                  </h3>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                      <div className="flex items-center gap-3 mb-2">
                        <nextStepRec.icon className="w-5 h-5 text-orange-600" />
                        <span className="font-semibold text-orange-800">{nextStepRec.title}</span>
                      </div>
                      <p className="text-sm text-orange-700 mb-4">{nextStepRec.description}</p>
                      <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white">
                        <nextStepRec.buttonIcon className="w-4 h-4 mr-2" />
                        {nextStepRec.buttonText}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Clinical Review */}
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-lg">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-purple-600" />
                  </div>
                  Clinical Review & Override
                </h3>
          </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div>
                  <p className="text-gray-700 font-medium mb-4">Do you agree with the AI assessment?</p>
                  <div className="flex gap-4 mb-6">
                    <Button
                      variant={aiOverride === 'agree' ? 'default' : 'outline'}
                      onClick={() => setAiOverride('agree')}
                      className="flex items-center gap-2"
                    >
                      <ThumbsUp className="w-4 h-4" />
                      Agree
                    </Button>
                    <Button
                      variant={aiOverride === 'disagree' ? 'default' : 'outline'}
                      onClick={() => setAiOverride('disagree')}
                      className="flex items-center gap-2"
                    >
                      <ThumbsDown className="w-4 h-4" />
                      Disagree
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => setAiOverride(null)}
                    >
                      Reset
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Clinical Notes & Comments
                  </label>
                  <Textarea
                    placeholder="Add your clinical observations, concerns, or override rationale..."
                    value={clinicianComment}
                    onChange={(e) => setClinicianComment(e.target.value)}
                    className="min-h-24"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    All overrides are logged for quality assurance
                  </p>
                </div>

                <div className="flex gap-4">
                  <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
                    <Save className="w-4 h-4" />
                    Save Assessment
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Flag className="w-4 h-4" />
                    Flag for Review
                  </Button>
            </div>
          </CardContent>
        </Card>

            {/* Patient Outreach */}
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-t-lg">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                      <MessageSquare className="w-6 h-6 text-green-600" />
                    </div>
                    Patient Outreach Management
                  </h3>
                  <Badge className={`text-base px-4 py-2 ${getEmailStatusConfig(report.emailStatus || 'not_sent').color}`}>
                    {getEmailStatusConfig(report.emailStatus || 'not_sent').icon}
                    <span className="ml-2">{getEmailStatusConfig(report.emailStatus || 'not_sent').label}</span>
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {(report.emailStatus === 'sent' && report.emailSentTime && report.emailContent) ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Badge className={getEmailStatusConfig(report.emailStatus).color}>
                          <span className="flex items-center gap-1">
                            {getEmailStatusConfig(report.emailStatus).icon}
                            Email Successfully Sent
                          </span>
                        </Badge>
                        <span className="text-sm text-gray-600">
                          {report.emailSentTime.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Copy className="w-4 h-4 mr-2" />
                          Copy Content
                        </Button>
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-2" />
                          Preview Email
                        </Button>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-gray-900">Email Content Preview</h4>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setIsEmailExpanded(!isEmailExpanded)}
                        >
                          {isEmailExpanded ? 'Collapse' : 'Expand'}
                        </Button>
                      </div>
                      
                      {isEmailExpanded ? (
                        <div className="prose prose-sm max-w-none">
                          <pre className="whitespace-pre-wrap text-sm text-gray-700 bg-white p-4 rounded border">
                            {report.emailContent}
                          </pre>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-600">
                          {report.emailContent.substring(0, 120)}...
                        </p>
                      )}
              </div>

                    <div className="flex gap-4">
                      <Button className="bg-green-600 hover:bg-green-700 text-white">
                        <Send className="w-4 h-4 mr-2" />
                        Resend Email
                      </Button>
                      <Button variant="outline">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Edit & Send New
                      </Button>
                    </div>
                  </div>
                ) : report.emailStatus === 'pending' ? (
                  <div className="text-center py-8">
                    <Badge className="bg-yellow-100 text-yellow-800 text-lg px-6 py-3 mb-4">
                      <MessageSquare className="w-5 h-5 mr-2" />
                      Pending Send
                    </Badge>
                    <p className="text-gray-600 mb-6">
                      This case requires review before automated outreach can be sent.
                    </p>
                    <div className="flex justify-center gap-4">
                      <Button className="bg-orange-600 hover:bg-orange-700 text-white">
                        Generate & Send Email
                      </Button>
                      <Button variant="outline">
                        Mark as No Contact Required
                      </Button>
                    </div>
              </div>
                ) : (
                  <div className="text-center py-8">
                    <Badge className="bg-gray-100 text-gray-800 text-lg px-6 py-3 mb-4">
                      <Eye className="w-5 h-5 mr-2" />
                      No Outreach Required
                    </Badge>
                    <p className="text-sm text-gray-600 mt-1">
                      Based on the AI assessment, this case does not require patient outreach.
                </p>
              </div>
                )}
        </CardContent>
      </Card>
    </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default CaseDetail;