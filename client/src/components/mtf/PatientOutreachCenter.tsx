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

  // 生成外联内容
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
      alert(`生成外联内容失败: ${error instanceof Error ? error.message : '未知错误'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  // 发送外联
  const sendOutreach = async (type: 'email' | 'sms' | 'phone') => {
    if (!outreachContent) return;

    setIsSending(true);
    setSendingProgress(0);

    try {
      // 模拟发送进度
      for (let i = 0; i <= 100; i += 20) {
        setSendingProgress(i);
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      // 模拟API调用
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
      
      alert(`${type === 'email' ? '邮件' : type === 'sms' ? '短信' : '电话'}外联已发送成功！`);
    } catch (error) {
      console.error('Failed to send outreach:', error);
      alert('发送失败，请重试');
    } finally {
      setIsSending(false);
      setSendingProgress(0);
    }
  };

  // 获取优先级颜色
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
      {/* 患者信息卡 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            患者外联中心 - {patient.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="text-sm text-gray-600">患者信息</div>
              <div className="space-y-1">
                <div className="font-medium">{patient.name}</div>
                <div className="text-sm text-gray-500">{patient.age}岁 {patient.gender === 'female' ? '女' : '男'}</div>
                <div className="text-sm text-gray-500">{patient.email}</div>
                {patient.phone && (
                  <div className="text-sm text-gray-500">{patient.phone}</div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-sm text-gray-600">风险评估</div>
              <div className="space-y-1">
                <Badge className={getPriorityColor(riskAssessment.priority)}>
                  {riskAssessment.priority.toUpperCase()} 优先级
                </Badge>
                <div className="text-sm">风险评分: {scanResult.riskScore}/100</div>
                <div className="text-sm">紧急程度: {riskAssessment.urgency}小时内</div>
                {scanResult.mtfSuspected && (
                  <Badge variant="destructive">MTF疑似</Badge>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-sm text-gray-600">推荐行动</div>
              <div className="space-y-1">
                {riskAssessment.specialistReferral && (
                  <div className="flex items-center gap-1 text-sm">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    需要专科转诊
                  </div>
                )}
                {riskAssessment.followUpRequired && (
                  <div className="flex items-center gap-1 text-sm">
                    <Clock className="h-3 w-3 text-orange-600" />
                    需要随访
                  </div>
                )}
                <div className="text-sm">预估费用: ¥{riskAssessment.estimatedCost}</div>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <Button onClick={generateOutreach} disabled={isGenerating} className="w-full">
              {isGenerating ? (
                <>
                  <MessageSquare className="h-4 w-4 mr-2 animate-spin" />
                  生成个性化外联内容中...
                </>
              ) : (
                <>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  生成外联内容
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 外联内容 */}
      {outreachContent && (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="email">邮件</TabsTrigger>
            <TabsTrigger value="sms">短信</TabsTrigger>
            <TabsTrigger value="phone">电话</TabsTrigger>
            <TabsTrigger value="assessment">自评表单</TabsTrigger>
          </TabsList>

          {/* 邮件外联 */}
          <TabsContent value="email">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  个性化邮件
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">邮件主题:</label>
                  <div className="p-3 bg-gray-50 rounded-lg text-sm border">
                    {outreachContent.email.subject}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">邮件内容:</label>
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
                      <span className="text-sm">正在发送邮件...</span>
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
                    发送邮件
                  </Button>
                  <Button variant="outline">
                    <Eye className="h-4 w-4 mr-2" />
                    预览
                  </Button>
                  <Button variant="outline">
                    <Edit className="h-4 w-4 mr-2" />
                    编辑
                  </Button>
                  <Button variant="outline">
                    <Copy className="h-4 w-4 mr-2" />
                    复制
                  </Button>
                </div>

                {/* 邮件统计 */}
                <div className="grid grid-cols-3 gap-4 p-4 bg-blue-50 rounded-lg">
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-600">预计打开率</div>
                    <div className="text-sm text-blue-800">85%</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-600">预计响应率</div>
                    <div className="text-sm text-blue-800">62%</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-600">发送时机</div>
                    <div className="text-sm text-blue-800">立即发送</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 短信外联 */}
          <TabsContent value="sms">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  短信通知
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg border">
                  <div className="text-sm font-medium mb-2">短信内容 ({outreachContent.sms.message.length}/160 字符):</div>
                  <div className="text-sm">{outreachContent.sms.message}</div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-600">优先级:</span>
                    <Badge className={getPriorityColor(outreachContent.sms.priority)} size="sm">
                      {outreachContent.sms.priority.toUpperCase()}
                    </Badge>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">紧急程度:</span>
                    <span className="ml-2 text-sm font-medium">{outreachContent.sms.urgency}小时内</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button 
                    onClick={() => sendOutreach('sms')} 
                    disabled={isSending}
                    className="flex-1"
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    发送短信
                  </Button>
                  <Button variant="outline">
                    <Edit className="h-4 w-4 mr-2" />
                    编辑
                  </Button>
                  <Button variant="outline">
                    <Calendar className="h-4 w-4 mr-2" />
                    定时发送
                  </Button>
                </div>

                <div className="text-xs text-gray-500 p-3 bg-yellow-50 rounded-lg">
                  <AlertCircle className="h-4 w-4 inline mr-1" />
                  短信发送将产生费用。根据优先级，高优先级短信将优先发送。
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 电话外联 */}
          <TabsContent value="phone">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  电话脚本
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">开场白:</label>
                    <div className="p-3 bg-gray-50 rounded-lg text-sm border">
                      {outreachContent.phone.opening}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">要点 ({outreachContent.phone.keyPoints.length}项):</label>
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
                    <label className="block text-sm font-medium mb-2">结束语:</label>
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
                    标记为已致电
                  </Button>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    导出脚本
                  </Button>
                  <Button variant="outline">
                    <Calendar className="h-4 w-4 mr-2" />
                    安排回拨
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-4 p-4 bg-green-50 rounded-lg">
                  <div>
                    <div className="text-sm font-medium text-green-800">通话提示</div>
                    <div className="text-xs text-green-700">
                      • 保持语调温和、专业<br/>
                      • 允许患者提问<br/>
                      • 记录重要信息
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-green-800">预计时长</div>
                    <div className="text-xs text-green-700">
                      5-10分钟<br/>
                      (取决于患者的问题)
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 自评表单 */}
          <TabsContent value="assessment">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  患者自评表单
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="text-sm font-medium text-blue-900 mb-2">表单说明</div>
                  <div className="text-sm text-blue-800">{outreachContent.selfAssessment.instructions}</div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-600">问题数量:</span>
                    <span className="ml-2 font-medium">{outreachContent.selfAssessment.questions.length}题</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">预计完成时间:</span>
                    <span className="ml-2 font-medium">{outreachContent.selfAssessment.estimatedTime}分钟</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">问题预览 (前3题):</label>
                  <div className="space-y-3">
                    {outreachContent.selfAssessment.questions.slice(0, 3).map((question, index) => (
                      <div key={index} className="p-3 border rounded-lg">
                        <div className="font-medium text-sm mb-2">
                          {index + 1}. {question.question}
                        </div>
                        <div className="text-xs text-gray-600">
                          类型: {question.type} | 必填: {question.required ? '是' : '否'}
                        </div>
                        {question.options && (
                          <div className="text-xs text-gray-500 mt-1">
                            选项数: {question.options.length}
                          </div>
                        )}
                      </div>
                    ))}
                    {outreachContent.selfAssessment.questions.length > 3 && (
                      <div className="text-center text-sm text-gray-500">
                        ...还有 {outreachContent.selfAssessment.questions.length - 3} 题
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button className="flex-1">
                    <FileText className="h-4 w-4 mr-2" />
                    生成表单链接
                  </Button>
                  <Button variant="outline">
                    <Eye className="h-4 w-4 mr-2" />
                    预览表单
                  </Button>
                  <Button variant="outline">
                    <Edit className="h-4 w-4 mr-2" />
                    自定义问题
                  </Button>
                </div>

                <div className="text-xs text-gray-500 p-3 bg-gray-50 rounded-lg">
                  表单链接将在生成后自动包含在邮件和短信中。患者完成后，结果将自动同步到系统。
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
