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
      alert(`Import failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
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

      // Simulate OCR extraction and AI processing
      const mockResult = {
        patientId: `extracted_${Date.now()}`,
        reportType: 'xray',
        reportText: `Simulated report content extracted from ${file.name}...`,
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
          error: error instanceof Error ? error.message : 'Processing failed'
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
      alert('No files available for processing');
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

            {/* File Upload */}
            <TabsContent value="file" className="space-y-4">
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              >
                <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-lg font-medium mb-2">Drop files here or click to upload</p>
                <p className="text-sm text-gray-500 mb-4">Supports PDF, DOC, DOCX, TXT files</p>
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
                    Select Files
                  </Button>
                </label>
              </div>

              {/* File List */}
              {importedFiles.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Uploaded Files ({importedFiles.length})</h4>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setImportedFiles([])}
                      >
                        Clear List
                      </Button>
                      <Button
                        size="sm"
                        onClick={processCompletedFiles}
                        disabled={!importedFiles.some(f => f.status === 'completed') || isProcessing}
                      >
                        <Brain className="w-4 h-4 mr-2" />
                        Batch Process
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
                                {file.status === 'pending' ? 'Pending' :
                                 file.status === 'processing' ? 'Processing' :
                                 file.status === 'completed' ? 'Completed' : 'Error'}
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
                                Extraction Confidence: {file.result.confidence}%
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

// Email Import Tab
function EmailImportTab() {
  const [emailAddress] = useState('reports@mtf-detection.ai.com');
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [emailHistory, setEmailHistory] = useState([
    {
      id: 'email-001',
      from: 'dr.smith@hospital.com',
      subject: 'Patient ID: P123456 - X-Ray Report',
      receivedAt: '2024-01-15T10:30:00Z',
      status: 'processed',
      attachments: 1,
      confidence: 94
    },
    {
      id: 'email-002',
      from: 'radiology@clinic.org',
      subject: 'MRI Report - Emergency Case',
      receivedAt: '2024-01-15T09:45:00Z',
      status: 'processing',
      attachments: 2,
      confidence: null
    },
    {
      id: 'email-003',
      from: 'admin@medcenter.com',
      subject: 'Patient ID: P789012 - CT Scan Results',
      receivedAt: '2024-01-15T08:20:00Z',
      status: 'failed',
      attachments: 1,
      confidence: null
    }
  ]);
  const [stats, setStats] = useState({
    todayProcessed: 15,
    weeklyProcessed: 89,
    averageConfidence: 92.3,
    successRate: 94.7
  });

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(emailAddress);
      // You could add a toast notification here
      alert('Email address copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'processed':
        return { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Processed' };
      case 'processing':
        return { color: 'bg-blue-100 text-blue-800', icon: Clock, label: 'Processing' };
      case 'failed':
        return { color: 'bg-red-100 text-red-800', icon: AlertTriangle, label: 'Failed' };
      default:
        return { color: 'bg-gray-100 text-gray-800', icon: Clock, label: 'Pending' };
    }
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Header Alert */}
      <div className="relative overflow-hidden rounded-lg border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-6">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative z-10">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Mail className="h-6 w-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-blue-900 mb-2">Email Import Configuration</h3>
              <p className="text-blue-800 mb-4">
                Send radiology reports to the email address below, and our AI system will automatically process and analyze them in real-time.
              </p>
              <div className="flex items-center gap-2 text-sm text-blue-700">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="font-medium">System is actively monitoring</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Today Processed', value: stats.todayProcessed, icon: Activity, color: 'text-blue-600', bgColor: 'bg-blue-50' },
          { label: 'This Week', value: stats.weeklyProcessed, icon: FileText, color: 'text-green-600', bgColor: 'bg-green-50' },
          { label: 'Avg Confidence', value: `${stats.averageConfidence}%`, icon: Brain, color: 'text-purple-600', bgColor: 'bg-purple-50' },
          { label: 'Success Rate', value: `${stats.successRate}%`, icon: CheckCircle, color: 'text-emerald-600', bgColor: 'bg-emerald-50' }
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

      {/* Enhanced Email Address Section */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Mail className="w-5 h-5 text-blue-600" />
            Dedicated Email Address
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Mail className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 mb-1">Email Address</p>
                <p className="text-lg font-mono text-gray-700 truncate">{emailAddress}</p>
              </div>
              <Button variant="outline" onClick={copyToClipboard} className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                Copy Address
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>SSL Encrypted</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>HIPAA Compliant</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>24/7 Monitoring</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Monitoring Status */}
      <Card className={`transition-all duration-300 ${
        isMonitoring 
          ? 'border-2 border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 shadow-lg' 
          : 'border border-gray-200 bg-white'
      }`}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`relative w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                isMonitoring 
                  ? 'bg-gradient-to-br from-green-100 to-emerald-100' 
                  : 'bg-gray-100'
              }`}>
                <Activity className={`w-6 h-6 transition-all duration-300 ${
                  isMonitoring ? 'text-green-600 animate-pulse' : 'text-gray-600'
                }`} />
                {isMonitoring && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-ping"></div>
                )}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-bold text-gray-900">Email Monitoring</h3>
                  <Badge variant={isMonitoring ? "default" : "secondary"} className={
                    isMonitoring ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'
                  }>
                    {isMonitoring ? 'ACTIVE' : 'INACTIVE'}
                  </Badge>
                </div>
                <p className={`text-sm font-medium ${
                  isMonitoring ? 'text-green-700' : 'text-gray-600'
                }`}>
                  {isMonitoring ? 'Monitoring for new emails in real-time' : 'Email monitoring is currently stopped'}
                </p>
                {isMonitoring && (
                  <div className="flex items-center gap-2 mt-2 text-xs text-green-600">
                    <Clock className="w-3 h-3" />
                    <span>Last check: 2 seconds ago</span>
                  </div>
                )}
              </div>
            </div>
            <Button
              onClick={() => setIsMonitoring(!isMonitoring)}
              variant={isMonitoring ? 'destructive' : 'default'}
              size="lg"
              className="font-semibold"
            >
              {isMonitoring ? (
                <>
                  <X className="w-4 h-4 mr-2" />
                  Stop Monitoring
                </>
              ) : (
                <>
                  <Activity className="w-4 h-4 mr-2" />
                  Start Monitoring
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Email History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-gray-600" />
              Recent Email Activity
            </div>
            <Badge variant="outline" className="text-xs">
              {emailHistory.length} emails
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {emailHistory.map((email, index) => {
              const statusConfig = getStatusConfig(email.status);
              return (
                <div key={email.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Mail className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-gray-900 truncate">{email.subject}</p>
                        <Badge className={statusConfig.color} variant="secondary">
                          <statusConfig.icon className="w-3 h-3 mr-1" />
                          {statusConfig.label}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>From: {email.from}</span>
                        <span>{email.attachments} attachment{email.attachments > 1 ? 's' : ''}</span>
                        <span>{new Date(email.receivedAt).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {email.confidence && (
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">{email.confidence}%</div>
                        <div className="text-xs text-gray-500">Confidence</div>
                      </div>
                    )}
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Usage Instructions */}
      <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-indigo-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-900">
            <Settings className="w-5 h-5" />
            Usage Instructions & Best Practices
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-purple-900 mb-3">How to Send Reports</h4>
              <div className="space-y-3">
                {[
                  'Send radiology reports as email attachments or body text',
                  'Include patient ID in subject line (e.g., "Patient ID: P123456")',
                  'Use clear, descriptive subject lines for better processing',
                  'Ensure attachments are in supported formats'
                ].map((instruction, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center text-xs font-bold text-purple-600 mt-0.5">
                      {index + 1}
                    </div>
                    <p className="text-sm text-purple-800">{instruction}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold text-purple-900 mb-3">Supported Features</h4>
              <div className="space-y-3">
                {[
                  { feature: 'File Formats', detail: 'PDF, DOC, DOCX, plain text' },
                  { feature: 'Processing Time', detail: 'Average 30-60 seconds' },
                  { feature: 'AI Analysis', detail: 'Automatic MTF detection' },
                  { feature: 'Security', detail: 'HIPAA compliant encryption' }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border border-purple-200">
                    <span className="font-medium text-purple-900">{item.feature}</span>
                    <span className="text-sm text-purple-700">{item.detail}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
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
