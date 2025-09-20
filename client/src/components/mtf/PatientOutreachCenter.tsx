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
    opening: string;
    keyPoints: string[];
    closing: string;
  };
  selfAssessment: {
    formId: string;
    questions: any[];
    instructions: string;
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

  // Generate outreach content
  const generateOutreach = async () => {
    setIsGenerating(true);
    
    try {
      const response = await fetch('/api/mtf/generate-outreach', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          patient,
          scanResult,
          riskAssessment
        }),
      });

      const data = await response.json();

      if (data.success) {
        setOutreachContent(data.data.outreachGeneration);
      } else {
        throw new Error(data.error || 'Failed to generate outreach');
      }
    } catch (error) {
      console.error('Failed to generate outreach:', error);
      alert(`Failed to generate outreach content: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  // Send outreach
  const sendOutreach = async (type: 'email' | 'sms' | 'phone') => {
    if (!outreachContent) return;

    setIsSending(true);
    setSendingProgress(0);

    try {
      // Simulate sending progress
      for (let i = 0; i <= 100; i += 20) {
        setSendingProgress(i);
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const outreachRecord = {
        type,
        content: outreachContent[type],
        sentAt: new Date(),
        status: 'sent',
        patient: patient,
        priority: riskAssessment.priority
      };

      onOutreachSent?.(outreachRecord);
      
      alert(`${type === 'email' ? 'Email' : type === 'sms' ? 'SMS' : 'Phone'} outreach sent successfully!`);
    } catch (error) {
      console.error('Failed to send outreach:', error);
      alert('Failed to send. Please try again.');
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
            <Button onClick={generateOutreach} disabled={isGenerating} className="w-full">
              {isGenerating ? (
                <>
                  <MessageSquare className="h-4 w-4 mr-2 animate-spin" />
                  Generating personalized outreach content...
                </>
              ) : (
                <>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Generate Outreach Content
                </>
              )}
            </Button>
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
                    <label className="block text-sm font-medium mb-2">Opening:</label>
                    <div className="p-3 bg-gray-50 rounded-lg text-sm border">
                      {outreachContent.phone.opening}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Key Points ({outreachContent.phone.keyPoints.length} items):</label>
                    <div className="space-y-2">
                      {outreachContent.phone.keyPoints.map((point, index) => (
                        <div key={index} className="flex items-start gap-2 p-2 bg-gray-50 rounded">
                          <div className="text-xs bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                            {index + 1}
                          </div>
                          <div className="text-sm">{point}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Closing:</label>
                    <div className="p-3 bg-gray-50 rounded-lg text-sm border">
                      {outreachContent.phone.closing}
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
