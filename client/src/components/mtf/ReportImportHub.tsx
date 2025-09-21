import React, { useState, useCallback, useEffect } from 'react';
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
  Brain,
  Activity,
  RefreshCw,
  Clock,
  Zap,
  ArrowRight,
  Download,
  Settings,
  Eye,
  Trash2
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

interface SystemIntegration {
  id: string;
  name: string;
  type: 'epic' | 'cerner' | 'pacs' | 'ris' | 'hl7' | 'api';
  status: 'connected' | 'disconnected' | 'syncing' | 'error';
  lastSync: string;
  reports: number;
  syncProgress?: number;
  error?: string;
  config?: any;
}

interface ImportedReport {
  id: string;
  patientId: string;
  patientName: string;
  reportType: string;
  reportDate: string;
  source: string;
  status: 'imported' | 'processing' | 'analyzed' | 'error';
  riskScore?: number;
  priority?: 'critical' | 'high' | 'medium' | 'low';
  confidence?: number;
  createdAt: string;
}

export function ReportImportHub({ onImportComplete }: ReportImportHubProps) {
  const [activeTab, setActiveTab] = useState<'manual' | 'file' | 'integration' | 'email'>('manual');
  const [isProcessing, setIsProcessing] = useState(false);
  const [importedFiles, setImportedFiles] = useState<ImportedFile[]>([]);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [systemIntegrations, setSystemIntegrations] = useState<SystemIntegration[]>([]);
  const [importedReports, setImportedReports] = useState<ImportedReport[]>([]);
  const [isAutoSync, setIsAutoSync] = useState(false);
  const [syncStats, setSyncStats] = useState({
    totalImported: 0,
    todayImported: 0,
    pendingAnalysis: 0,
    errorCount: 0
  });

  // Manual input form state
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

  // Initialize mock data
  useEffect(() => {
    const mockIntegrations: SystemIntegration[] = [
      {
        id: 'epic-001',
        name: 'Epic MyChart',
        type: 'epic',
        status: 'connected',
        lastSync: '2 hours ago',
        reports: 145,
        config: { endpoint: 'https://epic.example.com/api', version: 'v2.1' }
      },
      {
        id: 'cerner-001',
        name: 'Cerner PowerChart',
        type: 'cerner',
        status: 'disconnected',
        lastSync: 'Never',
        reports: 0,
        config: { endpoint: 'https://cerner.example.com/api', version: 'v1.8' }
      },
      {
        id: 'pacs-001',
        name: 'PACS System',
        type: 'pacs',
        status: 'connected',
        lastSync: '1 hour ago',
        reports: 67,
        config: { endpoint: 'https://pacs.example.com/dicom', version: 'DICOM 3.0' }
      },
      {
        id: 'ris-001',
        name: 'RIS System',
        type: 'ris',
        status: 'connected',
        lastSync: '30 minutes ago',
        reports: 23,
        config: { endpoint: 'https://ris.example.com/api', version: 'v3.2' }
      },
      {
        id: 'hl7-001',
        name: 'HL7 Interface',
        type: 'hl7',
        status: 'connected',
        lastSync: '15 minutes ago',
        reports: 89,
        config: { endpoint: 'https://hl7.example.com/fhir', version: 'R4' }
      }
    ];

    const mockReports: ImportedReport[] = [
      {
        id: 'report-001',
        patientId: 'P001234',
        patientName: 'John Smith',
        reportType: 'X-Ray',
        reportDate: '2024-01-15',
        source: 'Epic MyChart',
        status: 'analyzed',
        riskScore: 89,
        priority: 'critical',
        confidence: 92,
        createdAt: '2024-01-15T10:30:00Z'
      },
      {
        id: 'report-002',
        patientId: 'P001235',
        patientName: 'Jane Doe',
        reportType: 'CT Scan',
        reportDate: '2024-01-15',
        source: 'PACS System',
        status: 'processing',
        riskScore: 76,
        priority: 'high',
        confidence: 85,
        createdAt: '2024-01-15T10:25:00Z'
      },
      {
        id: 'report-003',
        patientId: 'P001236',
        patientName: 'Bob Johnson',
        reportType: 'MRI',
        reportDate: '2024-01-15',
        source: 'RIS System',
        status: 'analyzed',
        riskScore: 62,
        priority: 'medium',
        confidence: 78,
        createdAt: '2024-01-15T10:20:00Z'
      }
    ];

    setSystemIntegrations(mockIntegrations);
    setImportedReports(mockReports);
    setSyncStats({
      totalImported: 324,
      todayImported: 23,
      pendingAnalysis: 5,
      errorCount: 2
    });
  }, []);

  // Handle manual input submission
  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setProcessingProgress(0);

    try {
      // Simulate processing progress
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

  // 系统同步功能
  const syncSystem = async (integrationId: string) => {
    setSystemIntegrations(prev => prev.map(integration => 
      integration.id === integrationId 
        ? { ...integration, status: 'syncing', syncProgress: 0 }
        : integration
    ));

    try {
      // 模拟同步过程
      for (let progress = 0; progress <= 100; progress += 20) {
        setSystemIntegrations(prev => prev.map(integration => 
          integration.id === integrationId 
            ? { ...integration, syncProgress: progress }
            : integration
        ));
        await new Promise(resolve => setTimeout(resolve, 300));
      }

      // 模拟同步完成，添加新报告
      const integration = systemIntegrations.find(i => i.id === integrationId);
      if (integration) {
        const newReports: ImportedReport[] = Array.from({ length: Math.floor(Math.random() * 5) + 1 }, (_, index) => ({
          id: `report-${Date.now()}-${index}`,
          patientId: `P${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`,
          patientName: `Patient ${Math.floor(Math.random() * 1000)}`,
          reportType: ['X-Ray', 'CT Scan', 'MRI', 'Ultrasound'][Math.floor(Math.random() * 4)],
          reportDate: new Date().toISOString().split('T')[0],
          source: integration.name,
          status: 'imported',
          riskScore: Math.floor(Math.random() * 100),
          priority: ['critical', 'high', 'medium', 'low'][Math.floor(Math.random() * 4)] as any,
          confidence: Math.floor(Math.random() * 40) + 60,
          createdAt: new Date().toISOString()
        }));

        setImportedReports(prev => [...newReports, ...prev]);
        setSyncStats(prev => ({
          ...prev,
          totalImported: prev.totalImported + newReports.length,
          todayImported: prev.todayImported + newReports.length
        }));
      }

      setSystemIntegrations(prev => prev.map(integration => 
        integration.id === integrationId 
          ? { 
              ...integration, 
              status: 'connected', 
              lastSync: 'Just now',
              reports: integration.reports + Math.floor(Math.random() * 5) + 1,
              syncProgress: undefined
            }
          : integration
      ));

    } catch (error) {
      setSystemIntegrations(prev => prev.map(integration => 
        integration.id === integrationId 
          ? { 
              ...integration, 
              status: 'error', 
              error: 'Sync failed',
              syncProgress: undefined
            }
          : integration
      ));
    }
  };

  // 自动同步功能
  const toggleAutoSync = () => {
    setIsAutoSync(!isAutoSync);
  };

  // 模拟自动同步
  useEffect(() => {
    if (!isAutoSync) return;

    const interval = setInterval(() => {
      const connectedSystems = systemIntegrations.filter(s => s.status === 'connected');
      if (connectedSystems.length > 0) {
        const randomSystem = connectedSystems[Math.floor(Math.random() * connectedSystems.length)];
        syncSystem(randomSystem.id);
      }
    }, 30000); // 每30秒自动同步一次

    return () => clearInterval(interval);
  }, [isAutoSync, systemIntegrations]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scan className="h-5 w-5" />
            Report Import Center
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="manual">Manual Input</TabsTrigger>
              <TabsTrigger value="file">File Upload</TabsTrigger>
              <TabsTrigger value="integration">System Integration</TabsTrigger>
              <TabsTrigger value="email">Email Import</TabsTrigger>
            </TabsList>

            {/* Manual Input */}
            <TabsContent value="manual" className="space-y-4">
              <form onSubmit={handleManualSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Patient ID *</label>
                    <Input
                      value={manualForm.patientId}
                      onChange={(e) => setManualForm({...manualForm, patientId: e.target.value})}
                      placeholder="Enter patient ID"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Patient Name *</label>
                    <Input
                      value={manualForm.patientName}
                      onChange={(e) => setManualForm({...manualForm, patientName: e.target.value})}
                      placeholder="Enter patient name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Age *</label>
                    <Input
                      type="number"
                      value={manualForm.age}
                      onChange={(e) => setManualForm({...manualForm, age: e.target.value})}
                      placeholder="Enter age"
                      min="0"
                      max="150"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Gender *</label>
                    <Select value={manualForm.gender} onValueChange={(value) => setManualForm({...manualForm, gender: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Report Type *</label>
                    <Select value={manualForm.reportType} onValueChange={(value) => setManualForm({...manualForm, reportType: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select report type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="xray">X-Ray</SelectItem>
                        <SelectItem value="mri">MRI</SelectItem>
                        <SelectItem value="ct">CT Scan</SelectItem>
                        <SelectItem value="discharge_summary">Discharge Summary</SelectItem>
                        <SelectItem value="gp_notes">GP Notes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Report Date *</label>
                    <Input
                      type="date"
                      value={manualForm.reportDate}
                      onChange={(e) => setManualForm({...manualForm, reportDate: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Report Content *</label>
                  <Textarea
                    value={manualForm.reportText}
                    onChange={(e) => setManualForm({...manualForm, reportText: e.target.value})}
                    placeholder="Paste or enter radiology report content..."
                    className="min-h-[200px]"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Medical Facility</label>
                    <Input
                      value={manualForm.facility}
                      onChange={(e) => setManualForm({...manualForm, facility: e.target.value})}
                      placeholder="Enter medical facility name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Ordering Physician</label>
                    <Input
                      value={manualForm.orderingPhysician}
                      onChange={(e) => setManualForm({...manualForm, orderingPhysician: e.target.value})}
                      placeholder="Enter ordering physician name"
                    />
                  </div>
                </div>

                {isProcessing && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Brain className="h-4 w-4 animate-spin" />
                      <span className="text-sm">AI analyzing report...</span>
                    </div>
                    <Progress value={processingProgress} className="h-2" />
                  </div>
                )}

                <Button type="submit" disabled={isProcessing} className="w-full">
                  {isProcessing ? (
                    <>
                      <Brain className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <FileText className="h-4 w-4 mr-2" />
                      Import & Analyze Report
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
              <SystemIntegrationTab 
                integrations={systemIntegrations}
                reports={importedReports}
                syncStats={syncStats}
                isAutoSync={isAutoSync}
                onSync={syncSystem}
                onToggleAutoSync={toggleAutoSync}
              />
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
interface SystemIntegrationTabProps {
  integrations: SystemIntegration[];
  reports: ImportedReport[];
  syncStats: any;
  isAutoSync: boolean;
  onSync: (integrationId: string) => void;
  onToggleAutoSync: () => void;
}

function SystemIntegrationTab({ 
  integrations, 
  reports, 
  syncStats, 
  isAutoSync, 
  onSync, 
  onToggleAutoSync 
}: SystemIntegrationTabProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-green-100 text-green-800';
      case 'syncing': return 'bg-blue-100 text-blue-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'connected': return 'Connected';
      case 'syncing': return 'Syncing...';
      case 'error': return 'Error';
      default: return 'Disconnected';
    }
  };

  const getSystemIcon = (type: string) => {
    switch (type) {
      case 'epic': return '🏥';
      case 'cerner': return '💊';
      case 'pacs': return '📷';
      case 'ris': return '📋';
      case 'hl7': return '🔗';
      default: return '💻';
    }
  };

  return (
    <div className="space-y-6">
      {/* 统计概览 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Imported', value: syncStats.totalImported, icon: Download, color: 'text-blue-600', bgColor: 'bg-blue-50' },
          { label: 'Today Imported', value: syncStats.todayImported, icon: Activity, color: 'text-green-600', bgColor: 'bg-green-50' },
          { label: 'Pending Analysis', value: syncStats.pendingAnalysis, icon: Clock, color: 'text-orange-600', bgColor: 'bg-orange-50' },
          { label: 'Errors', value: syncStats.errorCount, icon: AlertTriangle, color: 'text-red-600', bgColor: 'bg-red-50' }
        ].map((stat, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`w-10 h-10 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 自动同步控制 - 优化版本 */}
      <Card className={`relative overflow-hidden transition-all duration-500 ${
        isAutoSync 
          ? 'border-2 border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 shadow-lg' 
          : 'border-2 border-dashed border-gray-200 bg-white'
      }`}>
        {/* 动态背景效果 */}
        {isAutoSync && (
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-200 to-transparent animate-workflow-flow"></div>
          </div>
        )}
        
        <CardContent className="p-6 relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* 增强的图标区域 */}
              <div className={`relative w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-300 ${
                isAutoSync 
                  ? 'bg-gradient-to-br from-green-100 to-emerald-100 shadow-md' 
                  : 'bg-gray-100'
              }`}>
                <Zap className={`w-7 h-7 transition-all duration-300 ${
                  isAutoSync ? 'text-green-600' : 'text-gray-600'
                } ${isAutoSync ? 'animate-pulse' : ''}`} />
                
                {/* 活跃状态指示器 */}
                {isAutoSync && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-ping"></div>
                )}
              </div>
              
              {/* 文本信息区域 */}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-lg font-bold text-gray-900">Auto Sync</h4>
                  <Badge 
                    variant={isAutoSync ? "default" : "secondary"}
                    className={`text-xs ${
                      isAutoSync 
                        ? 'bg-green-600 text-white animate-pulse' 
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {isAutoSync ? 'ACTIVE' : 'INACTIVE'}
                  </Badge>
                </div>
                <p className={`text-sm font-medium ${
                  isAutoSync ? 'text-green-700' : 'text-gray-600'
                }`}>
                  {isAutoSync ? 'Automatically syncing every 30 seconds' : 'Manual sync only'}
                </p>
                
                {/* 实时同步计数器和进度环 */}
                {isAutoSync && (
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 text-xs text-green-600">
                      <Clock className="w-3 h-3" />
                      <span>Next sync in: </span>
                      <SyncCountdown />
                    </div>
                    <SyncProgressRing />
                  </div>
                )}
              </div>
            </div>
            
            {/* 增强的按钮区域 */}
            <div className="flex items-center gap-3">
              {/* 同步状态指示 */}
              {isAutoSync && (
                <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg border border-green-200">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
                  <span className="text-xs font-medium text-green-700">Live</span>
                </div>
              )}
              
              <Button
                onClick={onToggleAutoSync}
                variant={isAutoSync ? 'destructive' : 'default'}
                size="lg"
                className={`font-semibold transition-all duration-300 ${
                  isAutoSync 
                    ? 'bg-red-600 hover:bg-red-700 shadow-lg' 
                    : 'bg-green-600 hover:bg-green-700 shadow-lg'
                }`}
              >
                {isAutoSync ? (
                  <>
                    <X className="w-4 h-4 mr-2" />
                    Stop Auto Sync
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    Enable Auto Sync
                  </>
                )}
              </Button>
            </div>
          </div>
          
          {/* 同步统计信息 */}
          {isAutoSync && (
            <div className="mt-4 pt-4 border-t border-green-200">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-lg font-bold text-green-600">847</div>
                  <div className="text-xs text-green-700">Reports Synced</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-green-600">99.2%</div>
                  <div className="text-xs text-green-700">Success Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-green-600">2.3s</div>
                  <div className="text-xs text-green-700">Avg Response</div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 系统列表 */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-semibold text-gray-900">Connected Systems</h4>
          <Button size="sm" variant="outline" className="text-gray-600">
            <Settings className="w-4 h-4 mr-2" />
            Manage
          </Button>
        </div>
        
        {integrations.map((integration, index) => (
          <Card key={integration.id} className={`sync-card animate-slide-in-up ${
            integration.status === 'syncing' ? 'ring-2 ring-blue-200 animate-sync-pulse' : ''
          }`} style={{ animationDelay: `${index * 100}ms` }}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <div className="text-2xl">{getSystemIcon(integration.type)}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h5 className="font-semibold text-gray-900">{integration.name}</h5>
                      <Badge className={getStatusColor(integration.status)}>
                        {getStatusText(integration.status)}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div>Last sync: {integration.lastSync} | Reports: {integration.reports}</div>
                      {integration.config && (
                        <div className="text-xs text-gray-500">
                          {integration.config.endpoint} • {integration.config.version}
                        </div>
                      )}
                      {integration.status === 'syncing' && integration.syncProgress !== undefined && (
                        <div className="w-full">
                          <Progress value={integration.syncProgress} className="h-2" />
                        </div>
                      )}
                      {integration.status === 'error' && integration.error && (
                        <div className="text-red-600 text-xs">{integration.error}</div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onSync(integration.id)}
                    disabled={integration.status === 'syncing'}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    {integration.status === 'syncing' ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <RefreshCw className="w-4 h-4" />
                    )}
                  </Button>
                  <Button size="sm" variant="outline" className="text-gray-600">
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 最近导入的报告 */}
      {reports.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center">
              <FileText className="w-4 h-4 mr-2" />
              Recently Imported Reports ({reports.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {reports.slice(0, 5).map((report, index) => (
                <div key={report.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors animate-report-import" style={{ animationDelay: `${index * 150}ms` }}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{report.patientName} ({report.patientId})</div>
                      <div className="text-sm text-gray-600">
                        {report.reportType} • {report.source} • {new Date(report.createdAt).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {report.riskScore && (
                      <Badge variant={
                        report.priority === 'critical' ? 'destructive' :
                        report.priority === 'high' ? 'default' :
                        report.priority === 'medium' ? 'secondary' : 'outline'
                      }>
                        {report.riskScore}/100
                      </Badge>
                    )}
                    <Badge variant={
                      report.status === 'analyzed' ? 'default' :
                      report.status === 'processing' ? 'secondary' : 'outline'
                    }>
                      {report.status}
                    </Badge>
                  </div>
                </div>
              ))}
              {reports.length > 5 && (
                <div className="text-center pt-2">
                  <Button variant="outline" size="sm" className="text-gray-600">
                    View All Reports
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
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

// Sync Countdown Component
function SyncCountdown() {
  const [countdown, setCountdown] = useState(30);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          return 30; // Reset to 30 seconds
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <span className={`font-bold transition-all duration-300 ${
      countdown <= 5 
        ? 'text-red-600 animate-countdown-warning' 
        : countdown <= 10 
          ? 'text-orange-600 animate-pulse' 
          : 'text-green-600'
    }`}>
      {countdown}s
    </span>
  );
}

// Sync Progress Ring Component
function SyncProgressRing() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          return 0; // Reset to 0
        }
        return prev + (100 / 30); // Increment every second for 30 seconds
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const circumference = 2 * Math.PI * 8; // radius = 8
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative w-5 h-5">
      <svg className="w-5 h-5 transform -rotate-90" viewBox="0 0 20 20">
        {/* Background circle */}
        <circle
          cx="10"
          cy="10"
          r="8"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          className="text-green-200"
        />
        {/* Progress circle */}
        <circle
          cx="10"
          cy="10"
          r="8"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          className="text-green-600 transition-all duration-1000 ease-linear"
          style={{
            strokeDasharray,
            strokeDashoffset
          }}
        />
      </svg>
      {/* Center dot */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-1 h-1 bg-green-600 rounded-full animate-pulse"></div>
      </div>
    </div>
  );
}
