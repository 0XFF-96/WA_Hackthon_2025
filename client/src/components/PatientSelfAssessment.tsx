import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Download,
  Send,
  Bone,
  Heart,
  Activity,
} from "lucide-react";
import {
  AssessmentData,
  AssessmentResult,
  AssessmentStep,
  AssessmentState,
} from "@/types/assessment";
import { AssessmentLanding } from "./assessment/AssessmentLanding";
import { SymptomScoring } from "./assessment/SymptomScoring";
import { FunctionalCheck } from "./assessment/FunctionalCheck";
import { RiskFactors } from "./assessment/RiskFactors";
import { RecentEvent } from "./assessment/RecentEvent";
import { AssessmentResults } from "./assessment/AssessmentResults";

interface PatientSelfAssessmentProps {
  onClose?: () => void;
}

export function PatientSelfAssessment({ onClose }: PatientSelfAssessmentProps) {
  const [state, setState] = useState<AssessmentState>({
    currentStep: "landing",
    data: {},
    isCompleted: false,
  });

  const steps: { key: AssessmentStep; title: string; description: string }[] = [
    {
      key: "landing",
      title: "Welcome",
      description: "Get started with your assessment",
    },
    {
      key: "symptoms",
      title: "Symptoms",
      description: "Tell us about your pain",
    },
    {
      key: "functional",
      title: "Function",
      description: "How does it affect your movement",
    },
    {
      key: "risk-factors",
      title: "Risk Factors",
      description: "Your health background",
    },
    {
      key: "recent-event",
      title: "Recent Events",
      description: "Any recent incidents",
    },
    { key: "results", title: "Results", description: "Your risk assessment" },
  ];

  const currentStepIndex = steps.findIndex(
    (step) => step.key === state.currentStep
  );
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  const handleNext = (stepData?: Partial<AssessmentData>) => {
    const newData = { ...state.data, ...stepData };

    if (state.currentStep === "recent-event") {
      // Calculate results and move to results step
      const result = calculateRiskAssessment(newData as AssessmentData);
      setState({
        currentStep: "results",
        data: newData,
        isCompleted: true,
      });
    } else {
      const nextStepIndex = currentStepIndex + 1;
      if (nextStepIndex < steps.length) {
        setState({
          ...state,
          currentStep: steps[nextStepIndex].key,
          data: newData,
        });
      }
    }
  };

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      setState({
        ...state,
        currentStep: steps[currentStepIndex - 1].key,
      });
    }
  };

  const handleRestart = () => {
    setState({
      currentStep: "landing",
      data: {},
      isCompleted: false,
    });
  };

  const calculateRiskAssessment = (data: AssessmentData): AssessmentResult => {
    let score = 0;
    const factors: string[] = [];

    // Pain severity scoring (0-30 points)
    score += data.painSeverity * 3;
    if (data.painSeverity > 7) factors.push("High pain severity");

    // Functional impact (0-20 points)
    if (data.painWhenWalking) {
      score += 5;
      factors.push("Pain when walking");
    }
    if (data.painWhenClimbing) {
      score += 5;
      factors.push("Pain when climbing stairs");
    }
    if (data.limpingOrImbalance) {
      score += 10;
      factors.push("Limping or imbalance");
    }

    // Risk factors (0-30 points)
    if (data.ageGroup === "over-70") {
      score += 15;
      factors.push("Age over 70");
    } else if (data.ageGroup === "50-70") {
      score += 10;
      factors.push("Age 50-70");
    }

    if (data.osteoporosisHistory) {
      score += 10;
      factors.push("Osteoporosis history");
    }
    if (data.previousFractures) {
      score += 8;
      factors.push("Previous fractures");
    }
    if (data.smoking) {
      score += 5;
      factors.push("Smoking");
    }
    if (data.lowCalciumIntake) {
      score += 5;
      factors.push("Low calcium intake");
    }

    // Recent events (0-20 points)
    if (data.recentFall) {
      score += 15;
      factors.push("Recent fall");
    }
    if (data.recentJump) {
      score += 10;
      factors.push("Recent jump");
    }
    if (data.recentImpact) {
      score += 10;
      factors.push("Recent impact");
    }

    // Determine risk level
    let riskLevel: "low" | "medium" | "high";
    let recommendations: string[];
    let summary: string;
    let nextSteps: string[];

    if (score <= 30) {
      riskLevel = "low";
      summary =
        "Based on your responses, you have a low risk of minimal trauma fracture.";
      recommendations = [
        "Continue monitoring your symptoms",
        "Maintain regular physical activity",
        "Ensure adequate calcium and vitamin D intake",
      ];
      nextSteps = [
        "No urgent action required",
        "Schedule routine check-up if symptoms persist",
        "Contact healthcare provider if pain worsens",
      ];
    } else if (score <= 60) {
      riskLevel = "medium";
      summary =
        "Your responses suggest a moderate risk of minimal trauma fracture.";
      recommendations = [
        "Consider scheduling a GP visit",
        "Avoid high-impact activities temporarily",
        "Monitor symptoms closely",
      ];
      nextSteps = [
        "Schedule appointment with healthcare provider",
        "Consider follow-up imaging if recommended",
        "Implement preventive measures",
      ];
    } else {
      riskLevel = "high";
      summary =
        "Your responses indicate a high risk of minimal trauma fracture.";
      recommendations = [
        "Seek medical attention soon",
        "Avoid weight-bearing activities",
        "Use assistive devices if needed",
      ];
      nextSteps = [
        "Contact healthcare provider immediately",
        "Consider emergency care if severe pain",
        "Follow up with imaging studies",
      ];
    }

    return {
      riskLevel,
      riskScore: Math.min(score, 100),
      recommendations,
      summary,
      nextSteps,
    };
  };

  const renderCurrentStep = () => {
    switch (state.currentStep) {
      case "landing":
        return <AssessmentLanding onStart={() => handleNext()} />;
      case "symptoms":
        return (
          <SymptomScoring
            data={state.data}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );
      case "functional":
        return (
          <FunctionalCheck
            data={state.data}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );
      case "risk-factors":
        return (
          <RiskFactors
            data={state.data}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );
      case "recent-event":
        return (
          <RecentEvent
            data={state.data}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );
      case "results":
        return (
          <AssessmentResults
            data={state.data as AssessmentData}
            result={calculateRiskAssessment(state.data as AssessmentData)}
            onRestart={handleRestart}
            onClose={onClose}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Bone className="w-5 h-5 text-primary" />
                Bone Health Self-Assessment
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {steps[currentStepIndex]?.description}
              </p>
            </div>
            {onClose && (
              <Button variant="ghost" size="sm" onClick={onClose}>
                <XCircle className="w-4 h-4" />
              </Button>
            )}
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex justify-between text-xs text-muted-foreground mb-2">
              <span>
                Step {currentStepIndex + 1} of {steps.length}
              </span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardHeader>

        <CardContent className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {renderCurrentStep()}
        </CardContent>
      </Card>
    </div>
  );
}
