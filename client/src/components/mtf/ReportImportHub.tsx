import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  Upload, 
  FileText, 
  Database, 
  Mail,
  Scan,
  CheckCircle,
  AlertTriangle,
  X,
  Plus,
  Brain
} from 'lucide-react';

interface ReportImportHubProps {
  onImportComplete: (result: any) => void;
}

interface ImportedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  content?: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  progress?: number;
  result?: any;
  error?: string;
}

export function ReportImportHub({ onImportComplete }: ReportImportHubProps) {
  const [activeTab, setActiveTab] = useState<'manual' | 'file' | 'integration' | 'email'>('manual');
  const [isProcessing, setIsProcessing] = useState(false);
  const [importedFiles, setImportedFiles] = useState<ImportedFile[]>([]);
  const [processingProgress, setProcessingProgress] = useState(0);

  // 手动输入表单状态
  const [manualForm, setManualForm] = useState({
    patientId: '',
    patientName: '',
    age: '',
    gender: '',
    reportType: 'xray',
    reportText: '',
    facility: '',
    orderingPhysician: '',
    reportDate: new Date().toISOString().split('T')[0]
  });

  // 处理手动输入提交
  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setProcessingProgress(0);

    try {
      // 模拟处理进度
      for (let i = 0; i <= 100; i += 10) {
        setProcessingProgress(i);
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      const reportData = {
        reportText: manualForm.reportText,
        reportType: manualForm.reportType,
        patientContext: {
          patientId: manualForm.patientId,
          age: parseInt(manualForm.age),
          gender: manualForm.gender,
          medicalHistory: ''
        },
        metadata: {
          facility: manualForm.facility,
          orderingPhysician: manualForm.orderingPhysician,
          reportDate: manualForm.reportDate
        }
      };

      // 调用API
      const response = await fetch('/api/mtf/complete-workflow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reportData,
          patientContext: reportData.patientContext,
          patient: {
            id: manualForm.patientId,
            name: manualForm.patientName,
            email: 'patient@example.com',
            age: parseInt(manualForm.age),
            gender: manualForm.gender
          }
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        onImportComplete(result.data);
        // 重置表单
        setManualForm({
          patientId: '',
          patientName: '',
          age: '',
          gender: '',
          reportType: 'xray',
          reportText: '',
          facility: '',
          orderingPhysician: '',
          reportDate: new Date().toISOString().split('T')[0]
        });
      } else {
        throw new Error(result.error || 'Processing failed');
      }
    } catch (error) {
      console.error('Manual import error:', error);
      alert(`导入失败: ${error instanceof Error ? error.message : '未知错误'}`);
    } finally {
      setIsProcessing(false);
      setProcessingProgress(0);
    }
  };

  // 处理文件拖放
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  // 处理文件选择
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(Array.from(e.target.files));
    }
  };

  // 处理文件列表
  const handleFiles = (files: File[]) => {
    const newFiles: ImportedFile[] = files.map(file => ({
      id: `file_${Date.now()}_${Math.random()}`,
      name: file.name,
      size: file.size,
      type: file.type,
      status: 'pending'
    }));

    setImportedFiles(prev => [...prev, ...newFiles]);
    
    // 开始处理文件
    newFiles.forEach(processFile);
  };

  // 处理单个文件
  const processFile = async (file: ImportedFile) => {
    setImportedFiles(prev => prev.map(f => 
      f.id === file.id ? { ...f, status: 'processing', progress: 0 } : f
    ));

    try {
      // 模拟文件处理过程
      for (let progress = 0; progress <= 100; progress += 20) {
        setImportedFiles(prev => prev.map(f => 
          f.id === file.id ? { ...f, progress } : f
        ));
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      // 模拟OCR提取和AI处理
      const mockResult = {
        patientId: `extracted_${Date.now()}`,
        reportType: 'xray',
        reportText: `模拟从${file.name}提取的报告内容...`,
        confidence: 85,
        extractionQuality: 'good'
      };

      setImportedFiles(prev => prev.map(f => 
        f.id === file.id ? { 
          ...f, 
          status: 'completed', 
          progress: 100,
          result: mockResult 
        } : f
      ));

    } catch (error) {
      setImportedFiles(prev => prev.map(f => 
        f.id === file.id ? { 
          ...f, 
          status: 'error', 
          error: error instanceof Error ? error.message : '处理失败'
        } : f
      ));
    }
  };

  // 移除文件
  const removeFile = (fileId: string) => {
    setImportedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  // 批量处理完成的文件
  const processCompletedFiles = async () => {
    const completedFiles = importedFiles.filter(f => f.status === 'completed');
    
    if (completedFiles.length === 0) {
      alert('没有可处理的文件');
      return;
    }

    setIsProcessing(true);
    
    try {
      // 这里应该调用批量处理API
      const results = completedFiles.map(file => file.result);
      onImportComplete({ batchResults: results });
    } catch (error) {
      console.error('Batch processing error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scan className="h-5 w-5" />
            报告导入中心
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="manual">手动输入</TabsTrigger>
              <TabsTrigger value="file">文件上传</TabsTrigger>
              <TabsTrigger value="integration">系统集成</TabsTrigger>
              <TabsTrigger value="email">邮件导入</TabsTrigger>
            </TabsList>

            {/* 手动输入 */}
            <TabsContent value="manual" className="space-y-4">
              <form onSubmit={handleManualSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">患者ID *</label>
                    <Input
                      value={manualForm.patientId}
                      onChange={(e) => setManualForm({...manualForm, patientId: e.target.value})}
                      placeholder="输入患者ID"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">患者姓名 *</label>
                    <Input
                      value={manualForm.patientName}
                      onChange={(e) => setManualForm({...manualForm, patientName: e.target.value})}
                      placeholder="输入患者姓名"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">年龄 *</label>
                    <Input
                      type="number"
                      value={manualForm.age}
                      onChange={(e) => setManualForm({...manualForm, age: e.target.value})}
                      placeholder="输入年龄"
                      min="0"
                      max="150"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">性别 *</label>
                    <Select value={manualForm.gender} onValueChange={(value) => setManualForm({...manualForm, gender: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="选择性别" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">男</SelectItem>
                        <SelectItem value="female">女</SelectItem>
                        <SelectItem value="other">其他</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">报告类型 *</label>
                    <Select value={manualForm.reportType} onValueChange={(value) => setManualForm({...manualForm, reportType: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="选择报告类型" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="xray">X光片</SelectItem>
                        <SelectItem value="mri">MRI</SelectItem>
                        <SelectItem value="ct">CT扫描</SelectItem>
                        <SelectItem value="discharge_summary">出院小结</SelectItem>
                        <SelectItem value="gp_notes">全科医生记录</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">报告日期 *</label>
                    <Input
                      type="date"
                      value={manualForm.reportDate}
                      onChange={(e) => setManualForm({...manualForm, reportDate: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">报告内容 *</label>
                  <Textarea
                    value={manualForm.reportText}
                    onChange={(e) => setManualForm({...manualForm, reportText: e.target.value})}
                    placeholder="粘贴或输入放射学报告内容..."
                    className="min-h-[200px]"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">医疗机构</label>
                    <Input
                      value={manualForm.facility}
                      onChange={(e) => setManualForm({...manualForm, facility: e.target.value})}
                      placeholder="输入医疗机构名称"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">开单医生</label>
                    <Input
                      value={manualForm.orderingPhysician}
                      onChange={(e) => setManualForm({...manualForm, orderingPhysician: e.target.value})}
                      placeholder="输入开单医生姓名"
                    />
                  </div>
                </div>

                {isProcessing && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Brain className="h-4 w-4 animate-spin" />
                      <span className="text-sm">AI正在分析报告...</span>
                    </div>
                    <Progress value={processingProgress} className="h-2" />
                  </div>
                )}

                <Button type="submit" disabled={isProcessing} className="w-full">
                  {isProcessing ? (
                    <>
                      <Brain className="h-4 w-4 mr-2 animate-spin" />
                      处理中...
                    </>
                  ) : (
                    <>
                      <FileText className="h-4 w-4 mr-2" />
                      导入并分析报告
                    </>
                  )}
                </Button>
              </form>
            </TabsContent>

            {/* 文件上传 */}
            <TabsContent value="file" className="space-y-4">
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              >
                <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-lg font-medium mb-2">拖放文件到此处或点击上传</p>
                <p className="text-sm text-gray-500 mb-4">支持PDF、DOC、DOCX、TXT文件</p>
                <input
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload">
                  <Button variant="outline" className="cursor-pointer">
                    选择文件
                  </Button>
                </label>
              </div>

              {/* 文件列表 */}
              {importedFiles.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">上传的文件 ({importedFiles.length})</h4>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setImportedFiles([])}
                      >
                        清空列表
                      </Button>
                      <Button
                        size="sm"
                        onClick={processCompletedFiles}
                        disabled={!importedFiles.some(f => f.status === 'completed') || isProcessing}
                      >
                        <Brain className="w-4 h-4 mr-2" />
                        批量处理
                      </Button>
                    </div>
                  </div>

                  {importedFiles.map((file) => (
                    <Card key={file.id} className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          <FileText className="h-5 w-5 text-blue-600" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{file.name}</span>
                              <Badge variant={
                                file.status === 'completed' ? 'default' :
                                file.status === 'processing' ? 'secondary' :
                                file.status === 'error' ? 'destructive' : 'outline'
                              }>
                                {file.status === 'pending' ? '等待处理' :
                                 file.status === 'processing' ? '处理中' :
                                 file.status === 'completed' ? '已完成' : '错误'}
                              </Badge>
                            </div>
                            <div className="text-sm text-gray-500">
                              {(file.size / 1024).toFixed(1)} KB
                            </div>
                            {file.status === 'processing' && file.progress !== undefined && (
                              <Progress value={file.progress} className="h-1 mt-2" />
                            )}
                            {file.status === 'error' && file.error && (
                              <div className="text-sm text-red-600 mt-1">{file.error}</div>
                            )}
                            {file.status === 'completed' && file.result && (
                              <div className="text-sm text-green-600 mt-1">
                                提取置信度: {file.result.confidence}%
                              </div>
                            )}
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeFile(file.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* 系统集成 */}
            <TabsContent value="integration" className="space-y-4">
              <SystemIntegrationTab />
            </TabsContent>

            {/* 邮件导入 */}
            <TabsContent value="email" className="space-y-4">
              <EmailImportTab />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

// 系统集成标签页
function SystemIntegrationTab() {
  const [integrations] = useState([
    { name: 'Epic MyChart', status: 'connected', lastSync: '2小时前', reports: 145 },
    { name: 'Cerner PowerChart', status: 'disconnected', lastSync: '从未', reports: 0 },
    { name: 'PACS System', status: 'connected', lastSync: '1小时前', reports: 67 },
    { name: 'RIS System', status: 'connected', lastSync: '30分钟前', reports: 23 },
  ]);

  return (
    <div className="space-y-4">
      <h4 className="font-medium">已连接的系统</h4>
      {integrations.map((integration, index) => (
        <Card key={index}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Database className="h-8 w-8 text-blue-600" />
                <div>
                  <div className="font-medium">{integration.name}</div>
                  <div className="text-sm text-gray-500">
                    最后同步: {integration.lastSync} | 报告数: {integration.reports}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={integration.status === 'connected' ? 'default' : 'secondary'}>
                  {integration.status === 'connected' ? '已连接' : '未连接'}
                </Badge>
                <Button size="sm" variant="outline">
                  {integration.status === 'connected' ? '立即同步' : '连接'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// 邮件导入标签页
function EmailImportTab() {
  const [emailAddress] = useState('reports@mtf-detection.ai.com');
  const [isMonitoring, setIsMonitoring] = useState(false);

  return (
    <div className="space-y-4">
      <Alert className="border-blue-200 bg-blue-50">
        <Mail className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          <strong>邮件导入设置</strong><br />
          将放射学报告发送到下面的邮箱地址，系统将自动处理并分析。
        </AlertDescription>
      </Alert>

      <div>
        <label className="block text-sm font-medium mb-2">邮件地址</label>
        <div className="flex gap-2">
          <Input
            value={emailAddress}
            readOnly
            className="flex-1"
          />
          <Button variant="outline" size="sm">
            复制
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between p-4 border rounded-lg">
        <div>
          <div className="font-medium">邮件监控</div>
          <div className="text-sm text-gray-500">
            {isMonitoring ? '正在监控新邮件...' : '邮件监控已停止'}
          </div>
        </div>
        <Button
          onClick={() => setIsMonitoring(!isMonitoring)}
          variant={isMonitoring ? 'destructive' : 'default'}
        >
          {isMonitoring ? '停止监控' : '开始监控'}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">使用说明</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>1. 将放射学报告作为邮件附件或正文发送到上述邮箱</p>
          <p>2. 邮件主题请包含患者ID（如：Patient ID: P123456）</p>
          <p>3. 系统将自动提取报告内容并进行AI分析</p>
          <p>4. 分析结果将在控制台中显示</p>
          <p>5. 支持的格式：PDF、DOC、DOCX、纯文本</p>
        </CardContent>
      </Card>
    </div>
  );
}
