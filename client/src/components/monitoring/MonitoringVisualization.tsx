import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Activity,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  LineChart
} from 'lucide-react';
import { MonitoringTrend, MonitoringInsight, MonitoringSummary } from '@/types/monitoring';

interface MonitoringVisualizationProps {
  trend: MonitoringTrend;
  insights: MonitoringInsight[];
  summary: MonitoringSummary;
}

export function MonitoringVisualization({ trend, insights, summary }: MonitoringVisualizationProps) {
  const getTrendIcon = (trendType: 'improving' | 'declining' | 'stable') => {
    switch (trendType) {
      case 'improving':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'declining':
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      default:
        return <Minus className="w-4 h-4 text-gray-600" />;
    }
  };

  const getInsightIcon = (type: 'positive' | 'warning' | 'neutral') => {
    switch (type) {
      case 'positive':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      default:
        return <Activity className="w-5 h-5 text-blue-600" />;
    }
  };

  const getInsightColor = (type: 'positive' | 'warning' | 'neutral') => {
    switch (type) {
      case 'positive':
        return 'bg-green-50 border-green-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  // Simple sparkline component
  const Sparkline = ({ data, color = "blue" }: { data: number[]; color?: string }) => {
    if (data.length === 0) return <div className="h-8 bg-gray-100 rounded" />;
    
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    
    return (
      <div className="h-8 flex items-end gap-1">
        {data.map((value, index) => {
          const height = ((value - min) / range) * 100;
          return (
            <div
              key={index}
              className={`bg-${color}-500 rounded-sm`}
              style={{ 
                width: `${100 / data.length}%`, 
                height: `${Math.max(height, 10)}%` 
              }}
            />
          );
        })}
      </div>
    );
  };

  // Simple bar chart for activity levels
  const ActivityBarChart = ({ data }: { data: number[] }) => {
    if (data.length === 0) return <div className="h-8 bg-gray-100 rounded" />;
    
    const max = Math.max(...data);
    
    return (
      <div className="h-8 flex items-end gap-1">
        {data.map((value, index) => {
          const height = max > 0 ? (value / max) * 100 : 0;
          return (
            <div
              key={index}
              className="bg-green-500 rounded-sm"
              style={{ 
                width: `${100 / data.length}%`, 
                height: `${Math.max(height, 5)}%` 
              }}
            />
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Average Pain Score</p>
                <p className="text-2xl font-bold">{summary.averagePainScore.toFixed(1)}</p>
              </div>
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-red-600 text-sm">😣</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Stability Rate</p>
                <p className="text-2xl font-bold">{summary.stabilityPercentage.toFixed(0)}%</p>
              </div>
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Daily Activity</p>
                <p className="text-2xl font-bold">{Math.round(summary.totalActivityMinutes / summary.totalDays)}m</p>
              </div>
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Activity className="w-4 h-4 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Overall Trend</p>
                <div className="flex items-center gap-2">
                  {getTrendIcon(summary.recentTrend)}
                  <span className="text-sm font-medium capitalize">{summary.recentTrend}</span>
                </div>
              </div>
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <LineChart className="w-4 h-4 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Trend Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pain Score Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <LineChart className="w-4 h-4" />
              Pain Score Trend ({trend.period})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Sparkline data={trend.painScoreTrend} color="red" />
            <div className="mt-2 text-xs text-gray-600">
              Latest: {trend.painScoreTrend[trend.painScoreTrend.length - 1] || 0}/10
            </div>
          </CardContent>
        </Card>

        {/* Gait Stability Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <CheckCircle className="w-4 h-4" />
              Gait Stability ({trend.period})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span>Stable Days</span>
                <span>{trend.gaitStabilityTrend.filter(Boolean).length}/{trend.gaitStabilityTrend.length}</span>
              </div>
              <Progress 
                value={(trend.gaitStabilityTrend.filter(Boolean).length / trend.gaitStabilityTrend.length) * 100} 
                className="h-2" 
              />
            </div>
          </CardContent>
        </Card>

        {/* Activity Level Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <BarChart3 className="w-4 h-4" />
              Activity Level ({trend.period})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ActivityBarChart data={trend.activityLevelTrend} />
            <div className="mt-2 text-xs text-gray-600">
              Avg: {Math.round(trend.activityLevelTrend.reduce((a, b) => a + b, 0) / trend.activityLevelTrend.length)}m/day
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            AI Insights & Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {insights.map((insight, index) => (
              <div key={index} className={`p-4 rounded-lg border ${getInsightColor(insight.type)}`}>
                <div className="flex items-start gap-3">
                  {getInsightIcon(insight.type)}
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1">{insight.title}</h4>
                    <p className="text-sm text-gray-700">{insight.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="text-xs">
                        {insight.trend}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        Confidence: {insight.confidence}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
