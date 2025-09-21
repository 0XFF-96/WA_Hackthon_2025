import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Activity,
  Play,
  Pause,
  Settings,
  CheckCircle2,
  Target,
  Timer,
  XCircle as XCircleIcon,
  Clock,
  Monitor,
  BarChart3,
  TrendingUp,
  HardDrive,
  Cpu
} from 'lucide-react';

import { BatchProcessingData } from '@/types/mtf-console';

interface BatchProcessingMonitorProps {
  batchProcessingData: BatchProcessingData;
}

export function BatchProcessingMonitor({ batchProcessingData }: BatchProcessingMonitorProps) {
  return (
    <div className="space-y-6">
      {/* Main Processing Status */}
      <Card className="batch-card shadow-sm border-l-4 border-l-indigo-500 animate-slide-in-up">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center text-lg">
              <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
                <Activity className="w-4 h-4 text-indigo-600" />
              </div>
              Batch Processing Monitor
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" className="text-indigo-600 border-indigo-300 hover:bg-indigo-50">
                <Play className="w-4 h-4 mr-1" />
                Start
              </Button>
              <Button size="sm" variant="outline" className="text-gray-600">
                <Pause className="w-4 h-4 mr-1" />
                Pause
              </Button>
              <Button size="sm" variant="outline" className="text-gray-600">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Progress Section */}
            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">Current Batch Progress</h4>
                  <p className="text-sm text-gray-600">Processing batch {batchProcessingData.currentBatch} of {batchProcessingData.totalBatches}</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-indigo-600">
                    {Math.round((batchProcessingData.currentBatch / batchProcessingData.totalBatches) * 100)}%
                  </div>
                  <div className="text-sm text-gray-600">Complete</div>
                </div>
              </div>
              <Progress 
                value={(batchProcessingData.currentBatch / batchProcessingData.totalBatches) * 100} 
                className="h-3 mb-4"
              />
              <div className="flex justify-between text-sm text-gray-600">
                <span>Started: 11:00 AM</span>
                <span>ETA: 11:18 AM</span>
              </div>
            </div>

            {/* Processing Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              {[
                { label: 'Total Processed', value: batchProcessingData.processingStats.totalProcessed, icon: CheckCircle2, color: 'text-green-600', bgColor: 'bg-green-50' },
                { label: 'Success Rate', value: `${batchProcessingData.processingStats.successRate}%`, icon: Target, color: 'text-blue-600', bgColor: 'bg-blue-50' },
                { label: 'Avg Time', value: `${batchProcessingData.processingStats.averageProcessingTime}s`, icon: Timer, color: 'text-orange-600', bgColor: 'bg-orange-50' },
                { label: 'Errors', value: batchProcessingData.processingStats.errors, icon: XCircleIcon, color: 'text-red-600', bgColor: 'bg-red-50' },
                { label: 'Queue Size', value: batchProcessingData.processingStats.queueSize, icon: Clock, color: 'text-purple-600', bgColor: 'bg-purple-50' }
              ].map((stat, index) => (
                <div key={index} className="text-center p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                  <div className={`w-10 h-10 ${stat.bgColor} rounded-lg flex items-center justify-center mx-auto mb-2`}>
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Real-time Metrics and Priority Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Real-time Metrics */}
        <Card className="batch-card shadow-sm animate-slide-in-up" style={{ animationDelay: '100ms' }}>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-base">
              <div className="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center mr-2">
                <Monitor className="w-3 h-3 text-green-600" />
              </div>
              Real-time Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { label: 'Current Throughput', value: `${batchProcessingData.realTimeMetrics.currentThroughput} req/s`, icon: Activity, color: 'text-green-600' },
                { label: 'Peak Throughput', value: `${batchProcessingData.realTimeMetrics.peakThroughput} req/s`, icon: TrendingUp, color: 'text-blue-600' },
                { label: 'Average Latency', value: `${batchProcessingData.realTimeMetrics.averageLatency}ms`, icon: Timer, color: 'text-orange-600' },
                { label: 'Memory Usage', value: `${batchProcessingData.realTimeMetrics.memoryUsage}%`, icon: HardDrive, color: 'text-purple-600' },
                { label: 'CPU Usage', value: `${batchProcessingData.realTimeMetrics.cpuUsage}%`, icon: Cpu, color: 'text-red-600' }
              ].map((metric, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <metric.icon className={`w-4 h-4 ${metric.color}`} />
                    <span className="text-sm font-medium text-gray-700">{metric.label}</span>
                  </div>
                  <span className={`font-bold ${metric.color}`}>{metric.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Priority Distribution */}
        <Card className="batch-card shadow-sm animate-slide-in-up" style={{ animationDelay: '200ms' }}>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-base">
              <div className="w-6 h-6 bg-pink-100 rounded-lg flex items-center justify-center mr-2">
                <BarChart3 className="w-3 h-3 text-pink-600" />
              </div>
              Priority Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(batchProcessingData.priorityDistribution).map(([priority, count]) => {
                const total = Object.values(batchProcessingData.priorityDistribution).reduce((sum, val) => sum + val, 0);
                const percentage = total > 0 ? (count / total) * 100 : 0;
                
                return (
                  <div key={priority} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${
                          priority === 'critical' ? 'bg-red-500' :
                          priority === 'high' ? 'bg-orange-500' :
                          priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                        }`}></div>
                        <span className="capitalize text-sm font-medium text-gray-700">{priority}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-lg text-gray-900">{count}</span>
                        <span className="text-sm text-gray-500 ml-1">({percentage.toFixed(1)}%)</span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          priority === 'critical' ? 'bg-red-500' :
                          priority === 'high' ? 'bg-orange-500' :
                          priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Batch History */}
      <Card className="batch-card shadow-sm animate-slide-in-up" style={{ animationDelay: '300ms' }}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center text-base">
            <div className="w-6 h-6 bg-gray-100 rounded-lg flex items-center justify-center mr-2">
              <Clock className="w-3 h-3 text-gray-600" />
            </div>
            Recent Batch History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {batchProcessingData.batchHistory.map((batch, index) => (
              <div key={batch.batchId} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    batch.status === 'completed' ? 'bg-green-100' :
                    batch.status === 'processing' ? 'bg-blue-100' : 'bg-red-100'
                  }`}>
                    {batch.status === 'completed' ? (
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                    ) : batch.status === 'processing' ? (
                      <Activity className="w-4 h-4 text-blue-600 animate-pulse" />
                    ) : (
                      <XCircleIcon className="w-4 h-4 text-red-600" />
                    )}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{batch.batchId}</div>
                    <div className="text-sm text-gray-600">
                      {new Date(batch.startTime).toLocaleString()} • 
                      Processed: {batch.processedCount} • 
                      Errors: {batch.errorCount}
                      {batch.duration && ` • Duration: ${batch.duration}min`}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={
                    batch.status === 'completed' ? 'default' :
                    batch.status === 'processing' ? 'secondary' : 'destructive'
                  }>
                    {batch.status}
                  </Badge>
                  {batch.status === 'processing' && (
                    <div className="w-16 bg-gray-200 rounded-full h-1">
                      <div className="bg-blue-500 h-1 rounded-full animate-pulse" style={{ width: '75%' }}></div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
