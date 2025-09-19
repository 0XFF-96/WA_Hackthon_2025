import React, { useState } from 'react';
import { MonitoringDashboard } from '@/components/monitoring/MonitoringDashboard';
import { MonitoringEntry } from '@/components/monitoring/MonitoringEntry';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Activity, 
  TrendingUp, 
  Shield, 
  Heart,
  ArrowLeft,
  Brain
} from 'lucide-react';
import { useLocation } from 'wouter';

export default function Monitoring() {
  const [, navigate] = useLocation();
  const [showEntry, setShowEntry] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [isMonitoringEnabled, setIsMonitoringEnabled] = useState(false);

  const handleEnableMonitoring = () => {
    setIsMonitoringEnabled(true);
    setShowEntry(false);
    setShowDashboard(true);
  };

  const handleSkipMonitoring = () => {
    setShowEntry(false);
    // User can still access dashboard later
  };

  const features = [
    {
      icon: TrendingUp,
      title: "Track Recovery Progress",
      description: "Monitor your pain levels and mobility improvements over time with daily health logs"
    },
    {
      icon: Brain,
      title: "AI-Powered Insights",
      description: "Get personalized recommendations and trend analysis based on your health data"
    },
    {
      icon: Shield,
      title: "Doctor Collaboration",
      description: "Share detailed reports with your healthcare provider for better care coordination"
    },
    {
      icon: Heart,
      title: "Personalized Care",
      description: "Receive tailored advice and early warning alerts based on your specific condition"
    }
  ];

  const benefits = [
    "Daily pain score tracking with visual feedback",
    "Gait and mobility assessment",
    "Activity logging with smart insights",
    "7-day and 30-day trend visualization",
    "AI-powered health recommendations",
    "Export reports for your doctor",
    "Privacy-protected data storage",
    "Mobile-friendly interface"
  ];

  if (showDashboard) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <Button 
              variant="outline" 
              onClick={() => navigate('/')}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </div>
          <MonitoringDashboard />
        </div>
      </div>
    );
  }

  if (showEntry) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <Button 
              variant="outline" 
              onClick={() => setShowEntry(false)}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>
          <div className="max-w-4xl mx-auto">
            <MonitoringEntry
              onEnable={handleEnableMonitoring}
              onSkip={handleSkipMonitoring}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
              <Activity className="w-10 h-10 text-primary" />
            </div>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Health Monitoring
          </h1>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Track your recovery progress with our AI-powered health monitoring system. 
            Get personalized insights and share detailed reports with your healthcare team.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              onClick={() => setShowEntry(true)}
              className="bg-primary hover:bg-primary/90 text-white px-8 py-3"
            >
              <Activity className="w-5 h-5 mr-2" />
              Start Monitoring
            </Button>
            
            <Button 
              size="lg"
              variant="outline"
              onClick={() => navigate('/')}
              className="px-8 py-3"
            >
              Back to Home
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Benefits Section */}
        <div className="grid lg:grid-cols-2 gap-12 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                What You'll Get
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                    <span className="text-sm text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                Privacy & Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0" />
                  <span className="text-sm text-gray-700">HIPAA compliant data protection</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0" />
                  <span className="text-sm text-gray-700">End-to-end encryption</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0" />
                  <span className="text-sm text-gray-700">You control your data</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0" />
                  <span className="text-sm text-gray-700">Export or delete anytime</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-primary mb-2">96.5%</div>
              <div className="text-sm text-gray-600">AI Accuracy Rate</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-primary mb-2">2.3s</div>
              <div className="text-sm text-gray-600">Average Processing Time</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-primary mb-2">12.5K+</div>
              <div className="text-sm text-gray-600">Cases Monitored</div>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to Start Monitoring?</h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Join thousands of users who are already tracking their health and recovery progress 
              with our AI-powered monitoring system.
            </p>
            <Button 
              size="lg"
              onClick={() => setShowEntry(true)}
              className="bg-primary hover:bg-primary/90 text-white px-8 py-3"
            >
              <Activity className="w-5 h-5 mr-2" />
              Get Started Now
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
