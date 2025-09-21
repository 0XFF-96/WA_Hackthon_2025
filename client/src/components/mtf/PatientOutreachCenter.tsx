import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { 
  Mail, 
  MessageSquare, 
  Phone, 
  User,
  Send,
  Eye,
  CheckCircle,
  Clock,
  FileText,
  Edit,
  Copy,
  Download,
  Calendar,
  AlertCircle
} from 'lucide-react';

interface PatientOutreachCenterProps {
  patient: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    age: number;
    gender: string;
    preferredLanguage?: string;
  };
  scanResult: any;
  riskAssessment: any;
  onOutreachSent?: (outreach: any) => void;
}

interface OutreachContent {
  email: {
    subject: string;
    content: string;
    personalizedContent: string;
  };
  sms: {
    message: string;
    priority: string;
    urgency: number;
  };
  phone: {
    script: string;
    tone: string;
    followUpRequired: boolean;
    estimatedDuration: number;
  };
  selfAssessment: {
    title: string;
    instructions: string;
    questions: Array<{
      id: string;
      question: string;
      type: string;
      options?: string[];
      required: boolean;
    }>;
    estimatedTime: number;
  };
}

export function PatientOutreachCenter({ 
  patient, 
  scanResult, 
  riskAssessment, 
  onOutreachSent 
}: PatientOutreachCenterProps) {
  const [outreachContent, setOutreachContent] = useState<OutreachContent | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [activeTab, setActiveTab] = useState('email');
  const [sendingProgress, setSendingProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Validate required data
  const isDataValid = patient && patient.id && patient.name && riskAssessment;
  
  // Clear messages after timeout
  React.useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  // Generate outreach content
  const generateOutreach = async () => {
    if (!isDataValid) {
      setError('Missing required patient or risk assessment data');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setSuccess(null);
    
    try {
      // Simulate API call with mock data for now
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate mock outreach content based on risk assessment
      const mockOutreachContent: OutreachContent = {
        email: {
          subject: `Important Health Update - MTF Risk Assessment Results`,
          content: `Dear ${patient.name},\n\nBased on your recent medical imaging, our AI analysis has identified potential areas of concern regarding bone health and fracture risk.\n\nRisk Level: ${riskAssessment.riskLevel || 'Medium'}\nConfidence: ${riskAssessment.confidence || 85}%\n\nWe recommend scheduling a follow-up appointment with your healthcare provider to discuss these findings and potential preventive measures.\n\nBest regards,\nHealthcare Team`,
          personalizedContent: `This assessment is specifically tailored for ${patient.name} (${patient.age}y ${patient.gender}) based on their unique medical profile.`
        },
        sms: {
          message: `Hi ${patient.name}, your recent scan results show increased fracture risk. Please contact your doctor to discuss next steps. For questions, call our office.`,
          priority: riskAssessment.priority || 'medium',
          urgency: riskAssessment.riskScore > 80 ? 9 : riskAssessment.riskScore > 60 ? 6 : 3
        },
        phone: {
          script: `Hello ${patient.name}, this is a call regarding your recent medical imaging results. Our analysis suggests elevated fracture risk. We'd like to schedule a consultation to discuss preventive care options.`,
          tone: 'professional',
          followUpRequired: riskAssessment.riskScore > 70,
          estimatedDuration: 5
        },
        selfAssessment: {
          title: 'Bone Health Self-Assessment',
          instructions: 'Please complete this brief assessment to help us better understand your current health status and risk factors.',
          questions: [
            {
              id: 'pain_level',
              question: 'Have you experienced any bone or joint pain in the past month?',
              type: 'multiple_choice',
              options: ['None', 'Mild', 'Moderate', 'Severe'],
              required: true
            },
            {
              id: 'falls_history',
              question: 'Have you had any falls in the past 6 months?',
              type: 'yes_no',
              required: true
            },
            {
              id: 'activity_level',
              question: 'How would you describe your current activity level?',
              type: 'multiple_choice',
              options: ['Very active', 'Moderately active', 'Somewhat active', 'Not very active'],
              required: true
            },
            {
              id: 'medications',
              question: 'Are you currently taking any medications for bone health?',
              type: 'text',
              required: false
            },
            {
              id: 'concerns',
              question: 'Do you have any specific concerns about your bone health?',
              type: 'text',
              required: false
            }
          ],
          estimatedTime: 5
        }
      };

      setOutreachContent(mockOutreachContent);
      setSuccess('Outreach content generated successfully!');
    } catch (error) {
      console.error('Failed to generate outreach:', error);
      setError(`Failed to generate outreach content: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  // Send outreach
  const sendOutreach = async (type: 'email' | 'sms' | 'phone') => {
    if (!outreachContent) {
      setError('No outreach content available. Please generate content first.');
      return;
    }

    setIsSending(true);
    setSendingProgress(0);
    setError(null);
    setSuccess(null);

    try {
      // Simulate sending progress
      for (let i = 0; i <= 100; i += 20) {
        setSendingProgress(i);
        await new Promise(resolve => setTimeout(resolve, 300));
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const outreachRecord = {
        type,
        content: outreachContent[type],
        sentAt: new Date(),
        status: 'sent',
        patient: patient,
        priority: riskAssessment?.priority || 'medium'
      };

      onOutreachSent?.(outreachRecord);
      
      const typeLabel = type === 'email' ? 'Email' : type === 'sms' ? 'SMS' : 'Phone call';
      setSuccess(`${typeLabel} outreach sent successfully to ${patient.name}!`);
    } catch (error) {
      console.error('Failed to send outreach:', error);
      setError(`Failed to send ${type} outreach. Please try again.`);
    } finally {
      setIsSending(false);
      setSendingProgress(0);
    }
  };

  // Get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Data Validation Warning */}
      {!isDataValid && (
        <Card className="border-l-4 border-l-red-500 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <span className="text-red-800 font-medium">
                Missing required data. Please ensure patient and risk assessment information is available.
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Success/Error Messages */}
      {success && (
        <Card className="border-l-4 border-l-green-500 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-green-800 font-medium">{success}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {error && (
        <Card className="border-l-4 border-l-red-500 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <span className="text-red-800 font-medium">{error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Patient Information Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Patient Outreach Center - {patient.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="text-sm text-gray-600">Patient Information</div>
              <div className="space-y-1">
                <div className="font-medium">{patient.name}</div>
                <div className="text-sm text-gray-500">{patient.age}y {patient.gender === 'female' ? 'F' : 'M'}</div>
                <div className="text-sm text-gray-500">{patient.email}</div>
                {patient.phone && (
                  <div className="text-sm text-gray-500">{patient.phone}</div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-sm text-gray-600">Risk Assessment</div>
              <div className="space-y-1">
                <Badge className={getPriorityColor(riskAssessment.priority)}>
                  {riskAssessment.priority.toUpperCase()} Priority
                </Badge>
                <div className="text-sm">Risk Score: {scanResult.riskScore}/100</div>
                <div className="text-sm">Urgency: Within {riskAssessment.urgency}h</div>
                {scanResult.mtfSuspected && (
                  <Badge variant="destructive">MTF Suspected</Badge>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-sm text-gray-600">Recommended Actions</div>
              <div className="space-y-1">
                {riskAssessment.specialistReferral && (
                  <div className="flex items-center gap-1 text-sm">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    Specialist referral required
                  </div>
                )}
                {riskAssessment.followUpRequired && (
                  <div className="flex items-center gap-1 text-sm">
                    <Clock className="h-3 w-3 text-orange-600" />
                    Follow-up required
                  </div>
                )}
                <div className="text-sm">Estimated cost: ${riskAssessment.estimatedCost}</div>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <Button 
              onClick={generateOutreach} 
              disabled={isGenerating || !isDataValid} 
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <MessageSquare className="h-4 w-4 mr-2 animate-spin" />
                  Generating personalized outreach content...
                </>
              ) : (
                <>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  {outreachContent ? 'Regenerate Outreach Content' : 'Generate Outreach Content'}
                </>
              )}
            </Button>
            {!isDataValid && (
              <p className="text-sm text-red-600 mt-2 text-center">
                Complete patient and risk assessment data required
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Outreach Content */}
      {outreachContent && (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="sms">SMS</TabsTrigger>
            <TabsTrigger value="phone">Phone</TabsTrigger>
            <TabsTrigger value="assessment">Self-Assessment</TabsTrigger>
          </TabsList>

          {/* Email Outreach */}
          <TabsContent value="email">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Personalized Email
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Email Subject:</label>
                  <div className="p-3 bg-gray-50 rounded-lg text-sm border">
                    {outreachContent.email.subject}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Email Content:</label>
                  <Textarea
                    value={outreachContent.email.personalizedContent}
                    readOnly
                    className="min-h-[300px] text-sm"
                  />
                </div>

                {isSending && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Send className="h-4 w-4 animate-pulse" />
                      <span className="text-sm">Sending email...</span>
                    </div>
                    <Progress value={sendingProgress} className="h-2" />
                  </div>
                )}

                <div className="flex gap-2">
                  <Button 
                    onClick={() => sendOutreach('email')} 
                    disabled={isSending}
                    className="flex-1"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Send Email
                  </Button>
                  <Button variant="outline">
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                  <Button variant="outline">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button variant="outline">
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                </div>

                {/* Email Statistics */}
                <div className="grid grid-cols-3 gap-4 p-4 bg-blue-50 rounded-lg">
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-600">Expected Open Rate</div>
                    <div className="text-sm text-blue-800">85%</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-600">Expected Response Rate</div>
                    <div className="text-sm text-blue-800">62%</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-600">Send Timing</div>
                    <div className="text-sm text-blue-800">Send Now</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SMS Outreach */}
          <TabsContent value="sms">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  SMS Notification
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg border">
                  <div className="text-sm font-medium mb-2">SMS Content ({outreachContent.sms.message.length}/160 characters):</div>
                  <div className="text-sm">{outreachContent.sms.message}</div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-600">Priority:</span>
                    <Badge className={getPriorityColor(outreachContent.sms.priority)}>
                      {outreachContent.sms.priority.toUpperCase()}
                    </Badge>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Urgency:</span>
                    <span className="ml-2 text-sm font-medium">Within {outreachContent.sms.urgency}h</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button 
                    onClick={() => sendOutreach('sms')} 
                    disabled={isSending}
                    className="flex-1"
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Send SMS
                  </Button>
                  <Button variant="outline">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button variant="outline">
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Send
                  </Button>
                </div>

                <div className="text-xs text-gray-500 p-3 bg-yellow-50 rounded-lg">
                  <AlertCircle className="h-4 w-4 inline mr-1" />
                  SMS sending will incur charges. High priority messages will be sent first based on priority level.
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Phone Outreach */}
          <TabsContent value="phone">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  Phone Script
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Call Script:</label>
                    <div className="p-3 bg-gray-50 rounded-lg text-sm border">
                      {outreachContent.phone.script}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Tone:</label>
                      <div className="p-2 bg-blue-50 rounded text-sm capitalize">
                        {outreachContent.phone.tone}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Estimated Duration:</label>
                      <div className="p-2 bg-green-50 rounded text-sm">
                        {outreachContent.phone.estimatedDuration} minutes
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Follow-up Required:</label>
                      <div className={`p-2 rounded text-sm ${outreachContent.phone.followUpRequired ? 'bg-yellow-50 text-yellow-800' : 'bg-green-50 text-green-800'}`}>
                        {outreachContent.phone.followUpRequired ? 'Yes' : 'No'}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button 
                    onClick={() => sendOutreach('phone')} 
                    disabled={isSending}
                    className="flex-1"
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Mark as Called
                  </Button>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export Script
                  </Button>
                  <Button variant="outline">
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Callback
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-4 p-4 bg-green-50 rounded-lg">
                  <div>
                    <div className="text-sm font-medium text-green-800">Call Tips</div>
                    <div className="text-xs text-green-700">
                      • Maintain gentle, professional tone<br/>
                      • Allow patient questions<br/>
                      • Record important information
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-green-800">Expected Duration</div>
                    <div className="text-xs text-green-700">
                      5-10 minutes<br/>
                      (depends on patient questions)
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Self-Assessment Form */}
          <TabsContent value="assessment">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Patient Self-Assessment Form
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="text-sm font-medium text-blue-900 mb-2">Form Instructions</div>
                  <div className="text-sm text-blue-800">{outreachContent.selfAssessment.instructions}</div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-600">Number of Questions:</span>
                    <span className="ml-2 font-medium">{outreachContent.selfAssessment.questions.length} items</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Estimated Time:</span>
                    <span className="ml-2 font-medium">{outreachContent.selfAssessment.estimatedTime} min</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Question Preview (first 3):</label>
                  <div className="space-y-3">
                    {outreachContent.selfAssessment.questions.slice(0, 3).map((question, index) => (
                      <div key={index} className="p-3 border rounded-lg">
                        <div className="font-medium text-sm mb-2">
                          {index + 1}. {question.question}
                        </div>
                        <div className="text-xs text-gray-600">
                          Type: {question.type} | Required: {question.required ? 'Yes' : 'No'}
                        </div>
                        {question.options && (
                          <div className="text-xs text-gray-500 mt-1">
                            Options: {question.options.length}
                          </div>
                        )}
                      </div>
                    ))}
                    {outreachContent.selfAssessment.questions.length > 3 && (
                      <div className="text-center text-sm text-gray-500">
                        ...{outreachContent.selfAssessment.questions.length - 3} more questions
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button className="flex-1">
                    <FileText className="h-4 w-4 mr-2" />
                    Generate Form Link
                  </Button>
                  <Button variant="outline">
                    <Eye className="h-4 w-4 mr-2" />
                    Preview Form
                  </Button>
                  <Button variant="outline">
                    <Edit className="h-4 w-4 mr-2" />
                    Customize Questions
                  </Button>
                </div>

                <div className="text-xs text-gray-500 p-3 bg-gray-50 rounded-lg">
                  Form links will be automatically included in emails and SMS after generation. Results will sync to the system automatically when patients complete the form.
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
