import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus,
  Calendar,
  TrendingUp,
  Settings,
  Download,
  Share,
  Bell,
  Activity,
  AlertTriangle,
  CheckCircle,
  Mic,
  Bot
} from 'lucide-react';
import { DailyInput } from './DailyInput';
import { MonitoringVisualization } from './MonitoringVisualization';
import { VoiceHealthAssistant } from './VoiceHealthAssistant';
import { 
  DailyMonitoringData, 
  DailyInputForm, 
  MonitoringTrend, 
  MonitoringInsight, 
  MonitoringSummary,
  MonitoringSettings 
} from '@/types/monitoring';

interface MonitoringDashboardProps {
  onClose?: () => void;
}

export function MonitoringDashboard({ onClose }: MonitoringDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [showDailyInput, setShowDailyInput] = useState(false);
  const [showVoiceAssistant, setShowVoiceAssistant] = useState(false);
  const [monitoringData, setMonitoringData] = useState<DailyMonitoringData[]>([]);
  const [settings, setSettings] = useState<MonitoringSettings>({
    enabled: true,
    reminderEnabled: true,
    reminderTime: '20:00',
    dataRetentionDays: 90,
    shareWithDoctor: false
  });

  // Mock data for demonstration
  useEffect(() => {
    // Generate mock data for the last 7 days
    const mockData: DailyMonitoringData[] = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      mockData.push({
        id: `day-${i}`,
        date: date.toISOString().split('T')[0],
        painScore: Math.floor(Math.random() * 8) + 1,
        painNote: i === 0 ? 'Feeling better today' : '',
        gaitStable: Math.random() > 0.3,
        limpingOrImbalance: Math.random() > 0.7,
        activities: [
          {
            id: `activity-${i}-1`,
            type: 'walking',
            duration: Math.floor(Math.random() * 60) + 15,
            note: 'Morning walk',
            timestamp: date
          },
          {
            id: `activity-${i}-2`,
            type: 'rest',
            duration: Math.floor(Math.random() * 120) + 30,
            note: 'Afternoon rest',
            timestamp: date
          }
        ],
        createdAt: date,
        updatedAt: date
      });
    }
    
    setMonitoringData(mockData);
  }, []);

  const handleSaveDailyInput = (data: DailyInputForm) => {
    const newEntry: DailyMonitoringData = {
      id: `day-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      painScore: data.painScore,
      painNote: data.painNote,
      gaitStable: data.gaitStable,
      limpingOrImbalance: data.limpingOrImbalance,
      activities: data.activities.map(activity => ({
        ...activity,
        id: `activity-${Date.now()}-${Math.random()}`,
        timestamp: new Date()
      })),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setMonitoringData(prev => [newEntry, ...prev]);
    setShowDailyInput(false);
  };

  const handleVoiceDataExtracted = (data: Partial<DailyInputForm>) => {
    // Auto-save complete voice data as daily input
    if (data.painScore !== undefined && (data.gaitStable !== undefined || data.activities?.length)) {
      const completeData: DailyInputForm = {
        painScore: data.painScore,
        painNote: data.painNote || '',
        gaitStable: data.gaitStable ?? true,
        limpingOrImbalance: data.limpingOrImbalance ?? false,
        activities: data.activities || []
      };
      handleSaveDailyInput(completeData);
      setShowVoiceAssistant(false);
    }
  };

  const generateTrends = (): MonitoringTrend => {
    const painScores = monitoringData.map(d => d.painScore);
    const gaitStability = monitoringData.map(d => d.gaitStable);
    const activityLevels = monitoringData.map(d => 
      d.activities.reduce((sum, activity) => sum + activity.duration, 0)
    );
    const dates = monitoringData.map(d => d.date);

    return {
      period: '7d',
      painScoreTrend: painScores,
      gaitStabilityTrend: gaitStability,
      activityLevelTrend: activityLevels,
      dates
    };
  };

  const generateInsights = (): MonitoringInsight[] => {
    const insights: MonitoringInsight[] = [];
    
    if (monitoringData.length >= 3) {
      const recentPainScores = monitoringData.slice(0, 3).map(d => d.painScore);
      const olderPainScores = monitoringData.slice(3, 6).map(d => d.painScore);
      
      const recentAvg = recentPainScores.reduce((a, b) => a + b, 0) / recentPainScores.length;
      const olderAvg = olderPainScores.reduce((a, b) => a + b, 0) / olderPainScores.length;
      
      if (recentAvg < olderAvg - 1) {
        insights.push({
          id: 'pain-improvement',
          type: 'positive',
          title: 'Pain Improvement Detected',
          description: `Your pain score has decreased by ${(olderAvg - recentAvg).toFixed(1)} points over the past 3 days.`,
          trend: 'improving',
          confidence: 85,
          createdAt: new Date()
        });
      } else if (recentAvg > olderAvg + 1) {
        insights.push({
          id: 'pain-worsening',
          type: 'warning',
          title: 'Pain Level Increasing',
          description: `Your pain score has increased by ${(recentAvg - olderAvg).toFixed(1)} points. Consider consulting your doctor.`,
          trend: 'declining',
          confidence: 80,
          createdAt: new Date()
        });
      }
    }

    const stabilityRate = monitoringData.filter(d => d.gaitStable).length / monitoringData.length;
    if (stabilityRate < 0.7) {
      insights.push({
        id: 'gait-concern',
        type: 'warning',
        title: 'Gait Stability Concern',
        description: 'Your gait stability has been below 70% recently. Consider using assistive devices.',
        trend: 'declining',
        confidence: 75,
        createdAt: new Date()
      });
    }

    return insights;
  };

  const generateSummary = (): MonitoringSummary => {
    const totalDays = monitoringData.length;
    const averagePainScore = monitoringData.reduce((sum, d) => sum + d.painScore, 0) / totalDays;
    const stabilityPercentage = (monitoringData.filter(d => d.gaitStable).length / totalDays) * 100;
    const totalActivityMinutes = monitoringData.reduce((sum, d) => 
      sum + d.activities.reduce((activitySum, activity) => activitySum + activity.duration, 0), 0
    );

    // Determine recent trend
    let recentTrend: 'improving' | 'declining' | 'stable' = 'stable';
    if (monitoringData.length >= 2) {
      const recent = monitoringData[0].painScore;
      const previous = monitoringData[1].painScore;
      if (recent < previous - 0.5) recentTrend = 'improving';
      else if (recent > previous + 0.5) recentTrend = 'declining';
    }

    return {
      totalDays,
      averagePainScore,
      stabilityPercentage,
      totalActivityMinutes,
      recentTrend,
      insights: generateInsights()
    };
  };

  const todayEntry = monitoringData.find(d => d.date === new Date().toISOString().split('T')[0]);
  const hasLoggedToday = !!todayEntry;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Health Monitoring</h1>
          <p className="text-gray-600">Track your recovery progress daily</p>
        </div>
        <div className="flex items-center gap-2">
          {hasLoggedToday ? (
            <Badge variant="outline" className="text-green-600 border-green-200">
              <CheckCircle className="w-3 h-3 mr-1" />
              Logged Today
            </Badge>
          ) : (
            <Badge variant="outline" className="text-orange-600 border-orange-200">
              <AlertTriangle className="w-3 h-3 mr-1" />
              Not Logged Today
            </Badge>
          )}
          <Button onClick={() => setShowDailyInput(true)} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Log Today
          </Button>
          <Button 
            onClick={() => setShowVoiceAssistant(true)} 
            size="sm"
            variant="outline"
            className="border-purple-200 text-purple-600 hover:bg-purple-50"
          >
            <Mic className="w-4 h-4 mr-2" />
            Voice Log
          </Button>
        </div>
      </div>

      {/* Daily Input Modal */}
      {showDailyInput && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-hidden">
            <CardHeader>
              <CardTitle>Daily Health Log</CardTitle>
            </CardHeader>
            <CardContent className="overflow-y-auto max-h-[calc(90vh-120px)]">
              <DailyInput
                onSave={handleSaveDailyInput}
                onCancel={() => setShowDailyInput(false)}
                initialData={todayEntry}
              />
            </CardContent>
          </Card>
        </div>
      )}

      {/* Voice Assistant Modal */}
      {showVoiceAssistant && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-4xl h-[90vh] bg-white rounded-lg overflow-hidden">
            <VoiceHealthAssistant
              onHealthDataExtracted={handleVoiceDataExtracted}
              onClose={() => setShowVoiceAssistant(false)}
              initialPrompt="Hello! I'm here to help you log your daily health status. Please tell me about your pain level, activities, and how you're feeling today."
            />
          </div>
        </div>
      )}

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <MonitoringVisualization
            trend={generateTrends()}
            insights={generateInsights()}
            summary={generateSummary()}
          />
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Detailed Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Detailed trend analysis and historical data will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Monitoring Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">Configure your monitoring preferences and notifications.</p>
              {/* Settings form would go here */}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
