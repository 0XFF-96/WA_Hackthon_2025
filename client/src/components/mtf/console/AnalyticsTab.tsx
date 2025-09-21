import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  Activity, 
  TrendingUp,
  BarChart3,
  Brain,
  AlertTriangle,
  Monitor,
  TrendingDown
} from 'lucide-react';

export function AnalyticsTab() {
  return (
    <div className="space-y-6">
      {/* Trend Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Cases",
            value: 555,
            change: "+18%",
            color: "text-blue-600",
            bgColor: "bg-blue-50",
            icon: Shield
          },
          {
            label: "Critical Cases",
            value: 73,
            change: "+25%",
            color: "text-red-600",
            bgColor: "bg-red-50",
            icon: Activity
          },
          {
            label: "High Risk",
            value: 128,
            change: "+12%",
            color: "text-orange-600",
            bgColor: "bg-orange-50",
            icon: TrendingUp
          },
          {
            label: "Avg Daily",
            value: 79,
            change: "+8%",
            color: "text-green-600",
            bgColor: "bg-green-50",
            icon: BarChart3
          }
        ].map((stat, index) => (
          <div key={index} className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <Badge variant="secondary" className="text-xs mt-1">
                  {stat.change}
                </Badge>
              </div>
              <div className={`w-10 h-10 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Weekly Pattern Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border border-gray-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center">
              <div className="w-6 h-6 bg-indigo-100 rounded-lg flex items-center justify-center mr-2">
                <BarChart3 className="w-3 h-3 text-indigo-600" />
              </div>
              Weekly Pattern Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <span className="text-sm font-medium text-blue-900">Peak Day</span>
                <span className="text-lg font-bold text-blue-600">Wednesday</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span className="text-sm font-medium text-green-900">Lowest Day</span>
                <span className="text-lg font-bold text-green-600">Saturday</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                <span className="text-sm font-medium text-purple-900">Avg Weekend</span>
                <span className="text-lg font-bold text-purple-600">45 cases</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                <span className="text-sm font-medium text-orange-900">Avg Weekday</span>
                <span className="text-lg font-bold text-orange-600">67 cases</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Risk Level Trends */}
        <Card className="border border-gray-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center">
              <div className="w-6 h-6 bg-pink-100 rounded-lg flex items-center justify-center mr-2">
                <TrendingUp className="w-3 h-3 text-pink-600" />
              </div>
              Risk Level Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { level: 'Critical', trend: '+25%', color: 'red', icon: Activity },
                { level: 'High', trend: '+12%', color: 'orange', icon: TrendingUp },
                { level: 'Medium', trend: '+8%', color: 'yellow', icon: BarChart3 },
                { level: 'Low', trend: '-5%', color: 'green', icon: TrendingDown }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 bg-${item.color}-100 rounded-lg flex items-center justify-center`}>
                      <item.icon className={`w-4 h-4 text-${item.color}-600`} />
                    </div>
                    <span className="font-medium text-gray-900">{item.level}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-bold ${
                      item.trend.startsWith('+') ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {item.trend}
                    </span>
                    <span className="text-xs text-gray-500">vs last week</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Predictive Analysis */}
      <Card className="border border-purple-200 bg-gradient-to-br from-purple-50 to-indigo-50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center">
            <div className="w-6 h-6 bg-purple-100 rounded-lg flex items-center justify-center mr-2">
              <Brain className="w-3 h-3 text-purple-600" />
            </div>
            AI Predictive Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-white rounded-lg border border-purple-200">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">Next 7 Days</h4>
              <p className="text-2xl font-bold text-purple-600 mb-1">+15%</p>
              <p className="text-sm text-gray-600">Expected increase</p>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border border-indigo-200">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Activity className="w-6 h-6 text-indigo-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">Peak Risk</h4>
              <p className="text-2xl font-bold text-indigo-600 mb-1">Jan 18</p>
              <p className="text-sm text-gray-600">Predicted peak day</p>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border border-pink-200">
              <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Monitor className="w-6 h-6 text-pink-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">Confidence</h4>
              <p className="text-2xl font-bold text-pink-600 mb-1">87%</p>
              <p className="text-sm text-gray-600">Prediction accuracy</p>
            </div>
          </div>
          <div className="mt-4 p-3 bg-white rounded-lg border border-gray-200">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Brain className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <h5 className="font-semibold text-gray-900 mb-1">AI Recommendation</h5>
                <p className="text-sm text-gray-700">
                  Based on current trends and historical patterns, we recommend increasing 
                  staffing levels for the week of January 15-21 to handle the predicted 
                  15% increase in MTF cases. Consider pre-scheduling additional specialist 
                  consultations for high-risk patients.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
