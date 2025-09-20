import React, { useState } from 'react';
import { MTFDetectionDashboard } from '@/components/mtf/MTFDetectionDashboard';
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
  Phone
} from 'lucide-react';

export default function MTFDetectionPage() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedCase, setSelectedCase] = useState<any>(null);
  const [importResult, setImportResult] = useState<any>(null);

  // 处理导入完成
  const handleImportComplete = (result: any) => {
    setImportResult(result);
    // 可以在这里显示成功消息或导航到结果页面
    console.log('Import completed:', result);
  };

  // 处理病例选择
  const handleCaseSelect = (caseId: string) => {
    // 这里应该获取完整的病例数据
    const mockCase = {
      id: caseId,
      patient: {
        id: 'patient_001',
        name: '张丽华',
        email: 'zhang.lihua@example.com',
        phone: '138-8888-8888',
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
              location: '第一腰椎椎体',
              type: '压缩性骨折',
              severity: 'moderate',
              mechanism: '站立高度跌倒',
              isMinimalTrauma: true
            }
          ],
          riskFactors: ['高龄（>70岁）', '既往骨折史', '绝经后女性', '骨质疏松'],
          recommendations: ['DEXA骨密度检查', '骨科专科转诊', '跌倒预防评估'],
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
        riskFactors: ['高龄（>70岁）', '既往骨折史', '绝经后女性'],
        recommendations: ['立即安排骨科专科会诊', '24小时内完成DEXA检查', '跌倒风险评估'],
        preventionMeasures: ['抗骨质疏松药物治疗', '家庭安全改造', '平衡训练']
      }
    };
    
    setSelectedCase(mockCase);
    setActiveTab('outreach');
  };

  // 工作流程步骤
  const workflowSteps = [
    {
      id: 1,
      title: '报告导入',
      description: '上传或输入放射学报告',
      icon: Upload,
      status: importResult ? 'completed' : 'pending'
    },
    {
      id: 2,
      title: 'AI分析',
      description: 'AI自动检测MTF和风险评估',
      icon: Brain,
      status: importResult?.scanResult ? 'completed' : 'pending'
    },
    {
      id: 3,
      title: '风险评估',
      description: '生成个性化风险评估报告',
      icon: AlertTriangle,
      status: importResult?.riskAssessment ? 'completed' : 'pending'
    },
    {
      id: 4,
      title: '患者外联',
      description: '自动生成个性化沟通内容',
      icon: Phone,
      status: 'pending'
    }
  ];

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">MTF检测与患者外联</h1>
          <p className="text-gray-600 mt-1">微创骨折智能检测和自动化患者管理系统</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            系统运行正常
          </Badge>
        </div>
      </div>

      {/* 工作流程概览 */}
      {!importResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              MTF检测工作流程
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              {workflowSteps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      step.status === 'completed' ? 'bg-green-100 text-green-600' :
                      step.status === 'in_progress' ? 'bg-blue-100 text-blue-600' :
                      'bg-gray-100 text-gray-400'
                    }`}>
                      <step.icon className="w-6 h-6" />
                    </div>
                    <div className="text-center mt-2">
                      <div className="font-medium text-sm">{step.title}</div>
                      <div className="text-xs text-gray-500">{step.description}</div>
                    </div>
                  </div>
                  {index < workflowSteps.length - 1 && (
                    <ArrowRight className="w-5 h-5 text-gray-400 mx-4" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 导入结果展示 */}
      {importResult && (
        <Card className="border-l-4 border-l-green-500 bg-green-50">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <CheckCircle className="h-6 w-6 text-green-600 mt-1" />
              <div className="flex-1">
                <h3 className="font-semibold text-green-900 mb-2">AI分析完成</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-green-700">风险评分:</span>
                    <span className="ml-2 font-medium">{importResult.scanResult?.riskScore || 0}/100</span>
                  </div>
                  <div>
                    <span className="text-green-700">置信度:</span>
                    <span className="ml-2 font-medium">{importResult.scanResult?.confidence || 0}%</span>
                  </div>
                  <div>
                    <span className="text-green-700">MTF疑似:</span>
                    <span className="ml-2 font-medium">
                      {importResult.scanResult?.mtfSuspected ? '是' : '否'}
                    </span>
                  </div>
                  <div>
                    <span className="text-green-700">处理时间:</span>
                    <span className="ml-2 font-medium">{importResult.processingTimeMs || 0}ms</span>
                  </div>
                </div>
                {importResult.scanResult?.mtfSuspected && (
                  <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center gap-2 text-red-800">
                      <AlertTriangle className="h-4 w-4" />
                      <span className="font-medium">检测到疑似微创骨折，建议立即专科评估</span>
                    </div>
                  </div>
                )}
              </div>
              <Button 
                onClick={() => setActiveTab('outreach')}
                className="bg-green-600 hover:bg-green-700"
              >
                生成患者外联
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 主要内容标签页 */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            检测控制台
          </TabsTrigger>
          <TabsTrigger value="import" className="flex items-center gap-2">
            <Upload className="w-4 h-4" />
            报告导入
          </TabsTrigger>
          <TabsTrigger value="outreach" className="flex items-center gap-2" disabled={!selectedCase && !importResult}>
            <Users className="w-4 h-4" />
            患者外联
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            分析统计
          </TabsTrigger>
        </TabsList>

        {/* 检测控制台 */}
        <TabsContent value="dashboard">
          <MTFDetectionDashboard onCaseSelect={handleCaseSelect} />
        </TabsContent>

        {/* 报告导入 */}
        <TabsContent value="import">
          <ReportImportHub onImportComplete={handleImportComplete} />
        </TabsContent>

        {/* 患者外联 */}
        <TabsContent value="outreach">
          {(selectedCase || importResult) ? (
            <PatientOutreachCenter
              patient={selectedCase?.patient || {
                id: 'patient_imported',
                name: '导入患者',
                email: 'patient@example.com',
                age: 65,
                gender: 'female'
              }}
              scanResult={selectedCase?.scanResult || importResult?.scanResult}
              riskAssessment={selectedCase?.riskAssessment || importResult?.riskAssessment}
              onOutreachSent={(outreach) => {
                console.log('Outreach sent:', outreach);
                // 可以在这里更新患者状态或显示成功消息
              }}
            />
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Users className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">选择患者进行外联</h3>
                <p className="text-gray-500 mb-6">
                  请先从检测控制台选择一个患者案例，或导入新的报告来生成患者外联内容
                </p>
                <div className="flex gap-2 justify-center">
                  <Button 
                    variant="outline" 
                    onClick={() => setActiveTab('dashboard')}
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    查看控制台
                  </Button>
                  <Button 
                    onClick={() => setActiveTab('import')}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    导入报告
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* 分析统计 */}
        <TabsContent value="analytics">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  系统性能分析
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">94.2%</div>
                    <div className="text-sm text-gray-600">AI检测准确率</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">2.3s</div>
                    <div className="text-sm text-gray-600">平均处理时间</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">78%</div>
                    <div className="text-sm text-gray-600">患者响应率</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">本周检测统计</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">总处理报告</span>
                      <span className="font-medium">147</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">MTF检出</span>
                      <span className="font-medium text-red-600">23</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">高风险病例</span>
                      <span className="font-medium text-orange-600">31</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">已联系患者</span>
                      <span className="font-medium text-green-600">89</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">外联效果分析</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">邮件发送</span>
                      <span className="font-medium">89</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">邮件打开率</span>
                      <span className="font-medium">87%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">短信发送</span>
                      <span className="font-medium">67</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">电话联系</span>
                      <span className="font-medium">34</span>
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
