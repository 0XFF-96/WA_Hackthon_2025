import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Activity, 
  TrendingUp, 
  Calendar,
  Shield,
  Bell,
  BarChart3,
  Heart
} from 'lucide-react';

interface MonitoringEntryProps {
  onEnable: () => void;
  onSkip: () => void;
}

export function MonitoringEntry({ onEnable, onSkip }: MonitoringEntryProps) {
  const [isEnabled, setIsEnabled] = useState(false);

  const benefits = [
    {
      icon: TrendingUp,
      title: "Track Recovery Progress",
      description: "Monitor your pain levels and mobility improvements over time"
    },
    {
      icon: BarChart3,
      title: "Visual Insights",
      description: "See trends and patterns in your daily health data"
    },
    {
      icon: Shield,
      title: "Better Care",
      description: "Share detailed reports with your healthcare provider"
    },
    {
      icon: Bell,
      title: "Daily Reminders",
      description: "Get gentle reminders to log your daily health status"
    }
  ];

  const features = [
    "Daily pain score tracking with visual feedback",
    "Gait and mobility assessment",
    "Activity logging with quick tags",
    "7-day and 30-day trend visualization",
    "AI-powered insights and recommendations",
    "Export reports for your doctor"
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <Activity className="w-8 h-8 text-primary" />
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900">
          Ongoing Monitoring
        </h2>
        
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Would you like to keep tracking your recovery? Daily monitoring helps you and your doctor better understand your condition.
        </p>
      </div>

      {/* Benefits Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {benefits.map((benefit, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <benefit.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-sm text-gray-600">{benefit.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Features List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-primary" />
            What You'll Get
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-3">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                <span className="text-sm text-gray-700">{feature}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Enable Switch */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="enable-monitoring" className="text-lg font-semibold text-blue-900">
                Enable Daily Monitoring
              </Label>
              <p className="text-sm text-blue-700">
                Start tracking your recovery progress with daily health logs
              </p>
            </div>
            <Switch
              id="enable-monitoring"
              checked={isEnabled}
              onCheckedChange={setIsEnabled}
              className="data-[state=checked]:bg-primary"
            />
          </div>
        </CardContent>
      </Card>

      {/* Privacy Notice */}
      <Card className="bg-gray-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">Your Privacy is Protected</h4>
              <p className="text-sm text-gray-600">
                All your health data is encrypted and stored securely. You can export, 
                share, or delete your data at any time. We follow HIPAA compliance standards.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button 
          onClick={onEnable}
          disabled={!isEnabled}
          className="bg-primary hover:bg-primary/90 text-white px-8 py-3"
          size="lg"
        >
          <Calendar className="w-5 h-5 mr-2" />
          Start Monitoring
        </Button>
        
        <Button 
          onClick={onSkip}
          variant="outline"
          className="px-8 py-3"
          size="lg"
        >
          Skip for Now
        </Button>
      </div>

      {/* Additional Info */}
      <div className="text-center">
        <p className="text-sm text-gray-500">
          You can enable monitoring later from your dashboard settings.
        </p>
      </div>
    </div>
  );
}
