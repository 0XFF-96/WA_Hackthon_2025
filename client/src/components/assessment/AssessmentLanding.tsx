import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Shield,
  Clock,
  CheckCircle,
  AlertTriangle,
  Heart,
} from "lucide-react";

interface AssessmentLandingProps {
  onStart: () => void;
}

export function AssessmentLanding({ onStart }: AssessmentLandingProps) {
  const features = [
    {
      icon: Clock,
      title: "Quick Assessment",
      description: "Takes only 3-5 minutes to complete",
    },
    {
      icon: Shield,
      title: "Privacy Protected",
      description: "Your data is secure and HIPAA compliant",
    },
    {
      icon: CheckCircle,
      title: "AI-Powered",
      description: "Advanced risk assessment technology",
    },
  ];

  const riskLevels = [
    {
      level: "Low Risk",
      color: "bg-green-100 text-green-800 border-green-200",
      icon: CheckCircle,
      description: "Continue monitoring, no urgent action required",
    },
    {
      level: "Medium Risk",
      color: "bg-yellow-100 text-yellow-800 border-yellow-200",
      icon: AlertTriangle,
      description: "Consider scheduling a GP visit or follow-up imaging",
    },
    {
      level: "High Risk",
      color: "bg-red-100 text-red-800 border-red-200",
      icon: Heart,
      description: "You should seek medical attention soon",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <Heart className="w-8 h-8 text-primary" />
          </div>
        </div>

        <h2 className="text-3xl font-bold text-gray-900">
          Check Your Bone Health
        </h2>

        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          If you recently experienced pain, discomfort, or a fall, you can
          complete this quick self-assessment to understand your risk of minimal
          trauma fracture.
        </p>
      </div>

      {/* Features */}
      <div className="grid md:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <Card key={index} className="text-center">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-600">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Risk Levels Preview */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-center">
          Assessment Results
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          {riskLevels.map((risk, index) => (
            <Card key={index} className={`border-2 ${risk.color}`}>
              <CardContent className="p-4 text-center">
                <div className="flex justify-center mb-2">
                  <risk.icon className="w-6 h-6" />
                </div>
                <h4 className="font-semibold mb-2">{risk.level}</h4>
                <p className="text-sm">{risk.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="text-center space-y-4">
        <Button
          size="lg"
          onClick={onStart}
          className="bg-primary hover:bg-primary/90 text-white px-8 py-3"
        >
          Start Assessment
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>

        <p className="text-sm text-gray-500">
          This assessment is for informational purposes only and does not
          replace professional medical advice.
        </p>
      </div>
    </div>
  );
}
