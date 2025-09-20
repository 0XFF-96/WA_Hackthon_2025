import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, 
  AlertTriangle, 
  Clock, 
  User, 
  FileText, 
  TrendingUp,
  Phone,
  Mail,
  Brain,
  BarChart3,
  CheckCircle,
  XCircle,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

interface MTFDetectionDashboardProps {
  onCaseSelect?: (caseId: string) => void;
}

interface MTFCase {
  id: string;
  patientId: string;
  patientName: string;
  age: number;
  gender: string;
  riskScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  mtfSuspected: boolean;
  confidence: number;
  reportType: string;
  createdAt: Date;
  status: 'pending' | 'reviewed' | 'contacted' | 'completed';
  urgency: number;
  specialistReferral: boolean;
}

interface SystemStats {
  totalProcessed: number;
  mtfDetected: number;
  pendingReview: number;
  averageProcessingTime: number;
  averageConfidence: number;
  qualityScore: number;
}

export function MTFDetectionDashboard({ onCaseSelect }: MTFDetectionDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [systemStats, setSystemStats] = useState<SystemStats>({
    totalProcessed: 0,
    mtfDetected: 0,
    pendingReview: 0,
    averageProcessingTime: 0,
    averageConfidence: 0,
    qualityScore: 0
  });
  const [mtfCases, setMtfCases] = useState<MTFCase[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSystemStats();
    fetchMTFCases();
  }, []);

  const fetchSystemStats = async () => {
    try {
      const response = await fetch('/api/mtf/statistics');
      const data = await response.json();
      if (data.success) {
        setSystemStats({
          totalProcessed: data.data.totalReportsProcessed,
          mtfDetected: data.data.mtfCasesDetected,
          pendingReview: data.data.qualityMetrics.manualReviewRequired,
          averageProcessingTime: data.data.averageProcessingTime,
          averageConfidence: data.data.averageConfidence,
          qualityScore: data.data.qualityMetrics.averageQualityScore
        });
      }
    } catch (error) {
      console.error('Failed to fetch system stats:', error);
    }
  };

  const fetchMTFCases = async () => {
    try {
      setIsLoading(true);
      // 模拟数据 - 在实际应用中应该从API获取
      const mockCases: MTFCase[] = [
        {
          id: 'case_001',
          patientId: 'patient_001',
          patientName: '张丽华',
          age: 73,
          gender: 'female',
          riskScore: 89,
          riskLevel: 'critical',
          mtfSuspected: true,
          confidence: 94,
          reportType: 'xray',
          createdAt: new Date('2024-01-15T10:30:00'),
          status: 'pending',
          urgency: 4,
          specialistReferral: true
        },
        {
          id: 'case_002',
          patientId: 'patient_002',
          patientName: '王建国',
          age: 68,
          gender: 'male',
          riskScore: 76,
          riskLevel: 'high',
          mtfSuspected: true,
          confidence: 87,
          reportType: 'ct',
          createdAt: new Date('2024-01-15T09:15:00'),
          status: 'reviewed',
          urgency: 12,
          specialistReferral: true
        },
        {
          id: 'case_003',
          patientId: 'patient_003',
          patientName: '李梅',
          age: 65,
          gender: 'female',
          riskScore: 62,
          riskLevel: 'medium',
          mtfSuspected: false,
          confidence: 82,
          reportType: 'mri',
          createdAt: new Date('2024-01-15T08:45:00'),
          status: 'contacted',
          urgency: 48,
          specialistReferral: false
        }
      ];
      setMtfCases(mockCases);
    } catch (error) {
      console.error('Failed to fetch MTF cases:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-red-100 text-red-800';
      case 'reviewed': return 'bg-yellow-100 text-yellow-800';
      case 'contacted': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getUrgencyIcon = (urgency: number) => {
    if (urgency <= 4) return <ArrowUp className="h-4 w-4 text-red-600" />;
    if (urgency <= 24) return <ArrowUp className="h-4 w-4 text-orange-600" />;
    return <ArrowDown className="h-4 w-4 text-green-600" />;
  };

  const criticalCases = mtfCases.filter(c => c.riskLevel === 'critical' || c.mtfSuspected);
  const pendingCases = mtfCases.filter(c => c.status === 'pending');

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">MTF检测控制台</h1>
          <p className="text-gray-600">微创骨折检测与患者外联管理系统</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <FileText className="w-4 h-4 mr-2" />
            导入报告
          </Button>
          <Button size="sm">
            <Shield className="w-4 h-4 mr-2" />
            批量扫描
          </Button>
        </div>
      </div>

      {/* Critical Alerts */}
      {criticalCases.length > 0 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>{criticalCases.length}个紧急MTF病例</strong> 需要在24小时内进行专科评估
          </AlertDescription>
        </Alert>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">已处理报告</p>
                <p className="text-2xl font-bold text-gray-900">{systemStats.totalProcessed}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">MTF检出</p>
                <p className="text-2xl font-bold text-gray-900">{systemStats.mtfDetected}</p>
              </div>
              <Shield className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">待审核</p>
                <p className="text-2xl font-bold text-gray-900">{pendingCases.length}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">平均置信度</p>
                <p className="text-2xl font-bold text-gray-900">{systemStats.averageConfidence.toFixed(1)}%</p>
              </div>
              <Brain className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">质量评分</p>
                <p className="text-2xl font-bold text-gray-900">{systemStats.qualityScore.toFixed(1)}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">平均处理时间</p>
                <p className="text-2xl font-bold text-gray-900">{systemStats.averageProcessingTime.toFixed(1)}s</p>
              </div>
              <TrendingUp className="h-8 w-8 text-indigo-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">总览</TabsTrigger>
          <TabsTrigger value="critical">紧急病例 ({criticalCases.length})</TabsTrigger>
          <TabsTrigger value="pending">待处理 ({pendingCases.length})</TabsTrigger>
          <TabsTrigger value="analytics">分析统计</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4">
            <h3 className="text-lg font-semibold">最新MTF检测结果</h3>
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <Card key={i}>
                    <CardContent className="p-6">
                      <div className="animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              mtfCases.slice(0, 5).map((case_) => (
                <MTFCaseCard 
                  key={case_.id} 
                  case_={case_} 
                  onSelect={() => onCaseSelect?.(case_.id)}
                  getRiskLevelColor={getRiskLevelColor}
                  getStatusColor={getStatusColor}
                  getUrgencyIcon={getUrgencyIcon}
                />
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="critical" className="space-y-4">
          <div className="grid gap-4">
            <h3 className="text-lg font-semibold text-red-700">紧急MTF病例</h3>
            {criticalCases.map((case_) => (
              <MTFCaseCard 
                key={case_.id} 
                case_={case_} 
                onSelect={() => onCaseSelect?.(case_.id)}
                getRiskLevelColor={getRiskLevelColor}
                getStatusColor={getStatusColor}
                getUrgencyIcon={getUrgencyIcon}
                variant="critical"
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          <div className="grid gap-4">
            <h3 className="text-lg font-semibold">待处理病例</h3>
            {pendingCases.map((case_) => (
              <MTFCaseCard 
                key={case_.id} 
                case_={case_} 
                onSelect={() => onCaseSelect?.(case_.id)}
                getRiskLevelColor={getRiskLevelColor}
                getStatusColor={getStatusColor}
                getUrgencyIcon={getUrgencyIcon}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <AnalyticsSection stats={systemStats} cases={mtfCases} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// MTF病例卡片组件
interface MTFCaseCardProps {
  case_: MTFCase;
  onSelect: () => void;
  getRiskLevelColor: (level: string) => string;
  getStatusColor: (status: string) => string;
  getUrgencyIcon: (urgency: number) => React.ReactNode;
  variant?: 'default' | 'critical';
}

function MTFCaseCard({ case_, onSelect, getRiskLevelColor, getStatusColor, getUrgencyIcon, variant = 'default' }: MTFCaseCardProps) {
  const cardClass = variant === 'critical' 
    ? 'border-l-4 border-l-red-500 bg-red-50' 
    : 'border-l-4 border-l-blue-500';

  return (
    <Card className={cardClass}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-3">
              <User className="h-4 w-4 text-gray-500" />
              <span className="font-medium text-lg">{case_.patientName}</span>
              <Badge variant="outline">{case_.age}岁 {case_.gender === 'female' ? '女' : '男'}</Badge>
              <Badge className={getRiskLevelColor(case_.riskLevel)}>
                {case_.riskLevel.toUpperCase()}
              </Badge>
              {case_.mtfSuspected && (
                <Badge variant="destructive">MTF疑似</Badge>
              )}
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-500">风险评分:</span>
                <span className="ml-2 font-medium">{case_.riskScore}/100</span>
              </div>
              <div>
                <span className="text-gray-500">置信度:</span>
                <span className="ml-2 font-medium">{case_.confidence}%</span>
              </div>
              <div>
                <span className="text-gray-500">报告类型:</span>
                <span className="ml-2 font-medium">{case_.reportType.toUpperCase()}</span>
              </div>
              <div className="flex items-center">
                <span className="text-gray-500">紧急程度:</span>
                <span className="ml-2 flex items-center gap-1">
                  {getUrgencyIcon(case_.urgency)}
                  {case_.urgency}小时
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge className={getStatusColor(case_.status)}>
                {case_.status === 'pending' ? '待处理' : 
                 case_.status === 'reviewed' ? '已审核' :
                 case_.status === 'contacted' ? '已联系' : '已完成'}
              </Badge>
              {case_.specialistReferral && (
                <Badge variant="outline">需专科转诊</Badge>
              )}
              <span className="text-xs text-gray-500">
                {case_.createdAt.toLocaleString('zh-CN')}
              </span>
            </div>
          </div>

          <div className="flex gap-2 ml-4">
            <Button size="sm" variant="outline" onClick={onSelect}>
              查看详情
            </Button>
            {case_.status === 'pending' && (
              <>
                <Button size="sm" variant="outline">
                  <Phone className="w-4 h-4 mr-1" />
                  联系患者
                </Button>
                <Button size="sm">
                  <Mail className="w-4 h-4 mr-1" />
                  发送外联
                </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// 分析统计组件
interface AnalyticsSectionProps {
  stats: SystemStats;
  cases: MTFCase[];
}

function AnalyticsSection({ stats, cases }: AnalyticsSectionProps) {
  const riskDistribution = cases.reduce((acc, case_) => {
    acc[case_.riskLevel] = (acc[case_.riskLevel] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const statusDistribution = cases.reduce((acc, case_) => {
    acc[case_.status] = (acc[case_.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">系统分析统计</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 风险等级分布 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">风险等级分布</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(riskDistribution).map(([level, count]) => (
                <div key={level} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${
                      level === 'critical' ? 'bg-red-500' :
                      level === 'high' ? 'bg-orange-500' :
                      level === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                    }`}></div>
                    <span className="capitalize">{level}</span>
                  </div>
                  <span className="font-medium">{count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 处理状态分布 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">处理状态分布</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(statusDistribution).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {status === 'pending' ? <Clock className="w-4 h-4 text-red-500" /> :
                     status === 'reviewed' ? <Brain className="w-4 h-4 text-yellow-500" /> :
                     status === 'contacted' ? <Phone className="w-4 h-4 text-blue-500" /> :
                     <CheckCircle className="w-4 h-4 text-green-500" />}
                    <span>
                      {status === 'pending' ? '待处理' :
                       status === 'reviewed' ? '已审核' :
                       status === 'contacted' ? '已联系' : '已完成'}
                    </span>
                  </div>
                  <span className="font-medium">{count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 系统性能指标 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">系统性能指标</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">AI置信度</span>
                <span className="text-sm font-medium">{stats.averageConfidence.toFixed(1)}%</span>
              </div>
              <Progress value={stats.averageConfidence} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">质量评分</span>
                <span className="text-sm font-medium">{stats.qualityScore.toFixed(1)}</span>
              </div>
              <Progress value={stats.qualityScore} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">处理效率</span>
                <span className="text-sm font-medium">
                  {stats.averageProcessingTime < 3 ? '优秀' : 
                   stats.averageProcessingTime < 5 ? '良好' : '需优化'}
                </span>
              </div>
              <Progress 
                value={Math.max(0, 100 - (stats.averageProcessingTime * 10))} 
                className="h-2" 
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
