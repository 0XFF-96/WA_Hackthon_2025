import { useState, useEffect } from 'react';
import { MTFCase, SystemStats, KPIData, BatchProcessingData, RiskTrendData, ReportScanData } from '@/types/mtf-console';

export function useMTFData() {
  const [mtfCases, setMtfCases] = useState<MTFCase[]>([]);
  const [systemStats, setSystemStats] = useState<SystemStats>({
    totalProcessed: 0,
    mtfDetected: 0,
    pendingReview: 0,
    averageProcessingTime: 0,
    averageConfidence: 0,
    qualityScore: 0
  });
  const [isLoading, setIsLoading] = useState(true);

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
      // Use mock data on error
      setSystemStats({
        totalProcessed: 1247,
        mtfDetected: 89,
        pendingReview: 23,
        averageProcessingTime: 2.3,
        averageConfidence: 94.2,
        qualityScore: 87.5
      });
    }
  };

  const fetchMTFCases = async () => {
    try {
      setIsLoading(true);
      // Mock data - should fetch from API in real application
      const mockCases: MTFCase[] = [
        {
          id: 'case_001',
          patientId: 'patient_001',
          patientName: 'Margaret Johnson',
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
          patientName: 'Robert Chen',
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
          patientName: 'Susan Lee',
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

  useEffect(() => {
    fetchSystemStats();
    fetchMTFCases();
  }, []);

  return {
    mtfCases,
    systemStats,
    isLoading,
    refreshData: () => {
      fetchSystemStats();
      fetchMTFCases();
    }
  };
}

export function useKPIData() {
  const [kpiData, setKpiData] = useState<KPIData>({
    totalReportsScanned: 0,
    suspectedMTFCases: 0,
    outreachEmailsSent: 0,
    pendingDoctorReview: 0
  });

  const fetchKPIData = async () => {
    try {
      // Simulate API call with animation
      setTimeout(() => {
        setKpiData({
          totalReportsScanned: 1247,
          suspectedMTFCases: 89,
          outreachEmailsSent: 156,
          pendingDoctorReview: 23
        });
      }, 500);
    } catch (error) {
      console.error('Failed to fetch KPI data:', error);
    }
  };

  useEffect(() => {
    fetchKPIData();
  }, []);

  return { kpiData, refreshKPIData: fetchKPIData };
}

export function useBatchProcessing() {
  const [batchProcessingData, setBatchProcessingData] = useState<BatchProcessingData>({
    currentBatch: 0,
    totalBatches: 0,
    priorityDistribution: { critical: 0, high: 0, medium: 0, low: 0 },
    processingStats: {
      totalProcessed: 0,
      successRate: 0,
      averageProcessingTime: 0,
      errors: 0,
      queueSize: 0
    },
    batchHistory: [],
    realTimeMetrics: {
      currentThroughput: 0,
      peakThroughput: 0,
      averageLatency: 0,
      memoryUsage: 0,
      cpuUsage: 0
    }
  });

  const fetchBatchProcessingData = async () => {
    try {
      setTimeout(() => {
        setBatchProcessingData({
          currentBatch: 82,
          totalBatches: 100,
          priorityDistribution: {
            critical: 12,
            high: 28,
            medium: 35,
            low: 25
          },
          processingStats: {
            totalProcessed: 1247,
            successRate: 94.2,
            averageProcessingTime: 2.3,
            errors: 23,
            queueSize: 156
          },
          batchHistory: [
            {
              batchId: 'BATCH-001',
              startTime: '2024-01-15T10:00:00Z',
              endTime: '2024-01-15T10:15:00Z',
              status: 'completed',
              processedCount: 100,
              errorCount: 2,
              duration: 15
            },
            {
              batchId: 'BATCH-002',
              startTime: '2024-01-15T10:15:00Z',
              endTime: '2024-01-15T10:28:00Z',
              status: 'completed',
              processedCount: 95,
              errorCount: 1,
              duration: 13
            },
            {
              batchId: 'BATCH-003',
              startTime: '2024-01-15T10:30:00Z',
              endTime: '2024-01-15T10:42:00Z',
              status: 'completed',
              processedCount: 88,
              errorCount: 3,
              duration: 12
            },
            {
              batchId: 'BATCH-004',
              startTime: '2024-01-15T10:45:00Z',
              endTime: '2024-01-15T10:58:00Z',
              status: 'completed',
              processedCount: 92,
              errorCount: 1,
              duration: 13
            },
            {
              batchId: 'BATCH-005',
              startTime: '2024-01-15T11:00:00Z',
              status: 'processing',
              processedCount: 82,
              errorCount: 0
            }
          ],
          realTimeMetrics: {
            currentThroughput: 6.8,
            peakThroughput: 8.2,
            averageLatency: 1.8,
            memoryUsage: 67.5,
            cpuUsage: 45.2
          }
        });
      }, 800);
    } catch (error) {
      console.error('Failed to fetch batch processing data:', error);
    }
  };

  useEffect(() => {
    fetchBatchProcessingData();
  }, []);

  return { batchProcessingData, refreshBatchProcessing: fetchBatchProcessingData };
}

export function useReportScanData() {
  const [reportScanData, setReportScanData] = useState<ReportScanData[]>([]);

  const fetchReportScanData = async () => {
    try {
      // Mock data - should fetch from API in real application
      const mockData: ReportScanData[] = [
        {
          id: 'scan_001',
          patientId: 'P001234',
          scanType: 'xray',
          scanTime: new Date('2024-01-15T10:30:00'),
          aiPriority: 'critical',
          riskScore: 89,
          status: 'pending_review'
        },
        {
          id: 'scan_002',
          patientId: 'P001235',
          scanType: 'ct',
          scanTime: new Date('2024-01-15T10:25:00'),
          aiPriority: 'high',
          riskScore: 76,
          status: 'outreach_sent'
        },
        {
          id: 'scan_003',
          patientId: 'P001236',
          scanType: 'mri',
          scanTime: new Date('2024-01-15T10:20:00'),
          aiPriority: 'medium',
          riskScore: 62,
          status: 'completed'
        },
        {
          id: 'scan_004',
          patientId: 'P001237',
          scanType: 'xray',
          scanTime: new Date('2024-01-15T10:15:00'),
          aiPriority: 'low',
          riskScore: 34,
          status: 'processing'
        },
        {
          id: 'scan_005',
          patientId: 'P001238',
          scanType: 'ct',
          scanTime: new Date('2024-01-15T10:10:00'),
          aiPriority: 'critical',
          riskScore: 92,
          status: 'pending_review'
        }
      ];
      setReportScanData(mockData);
    } catch (error) {
      console.error('Failed to fetch report scan data:', error);
    }
  };

  useEffect(() => {
    fetchReportScanData();
  }, []);

  return { reportScanData, refreshReportScanData: fetchReportScanData };
}

export function useRiskTrendData() {
  const [riskTrendData, setRiskTrendData] = useState<RiskTrendData[]>([]);

  const fetchRiskTrendData = async () => {
    try {
      const mockTrendData: RiskTrendData[] = [
        { date: '2024-01-09', critical: 8, high: 15, medium: 22, low: 18 },
        { date: '2024-01-10', critical: 12, high: 18, medium: 25, low: 20 },
        { date: '2024-01-11', critical: 6, high: 12, medium: 28, low: 22 },
        { date: '2024-01-12', critical: 15, high: 22, medium: 30, low: 25 },
        { date: '2024-01-13', critical: 9, high: 16, medium: 26, low: 19 },
        { date: '2024-01-14', critical: 11, high: 20, medium: 32, low: 24 },
        { date: '2024-01-15', critical: 12, high: 25, medium: 35, low: 28 }
      ];
      setRiskTrendData(mockTrendData);
    } catch (error) {
      console.error('Failed to fetch risk trend data:', error);
    }
  };

  useEffect(() => {
    fetchRiskTrendData();
  }, []);

  return { riskTrendData, refreshRiskTrendData: fetchRiskTrendData };
}
