export interface DailyMonitoringData {
  id: string;
  date: string; // ISO date string
  userId?: string;
  
  // Pain Score
  painScore: number; // 0-10
  painNote?: string;
  
  // Gait/Mobility
  gaitStable: boolean;
  limpingOrImbalance: boolean;
  
  // Activity Log
  activities: ActivityEntry[];
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

export interface ActivityEntry {
  id: string;
  type: ActivityType;
  duration: number; // minutes
  note?: string;
  timestamp: Date;
}

export type ActivityType = 'walking' | 'exercise' | 'rest' | 'work' | 'other';

export interface MonitoringInsight {
  id: string;
  type: 'positive' | 'warning' | 'neutral';
  title: string;
  description: string;
  trend: 'improving' | 'declining' | 'stable';
  confidence: number; // 0-100
  createdAt: Date;
}

export interface MonitoringTrend {
  period: '7d' | '30d';
  painScoreTrend: number[]; // Array of pain scores
  gaitStabilityTrend: boolean[]; // Array of stability status
  activityLevelTrend: number[]; // Array of daily activity minutes
  dates: string[]; // Corresponding dates
}

export interface MonitoringSettings {
  enabled: boolean;
  reminderTime?: string; // HH:MM format
  reminderEnabled: boolean;
  dataRetentionDays: number;
  shareWithDoctor: boolean;
  doctorEmail?: string;
}

export interface MonitoringSummary {
  totalDays: number;
  averagePainScore: number;
  stabilityPercentage: number;
  totalActivityMinutes: number;
  recentTrend: 'improving' | 'declining' | 'stable';
  insights: MonitoringInsight[];
}

// Form data types for daily input
export interface DailyInputForm {
  painScore: number;
  painNote: string;
  gaitStable: boolean;
  limpingOrImbalance: boolean;
  activities: Omit<ActivityEntry, 'id' | 'timestamp'>[];
}

// Chart data types
export interface ChartDataPoint {
  date: string;
  value: number | boolean;
  label?: string;
}

export interface SparklineData {
  painScore: ChartDataPoint[];
  gaitStability: ChartDataPoint[];
  activityLevel: ChartDataPoint[];
}
