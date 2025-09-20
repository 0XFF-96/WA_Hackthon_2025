import { HeroSection } from "@/components/HeroSection";
import { PatientSelfAssessment } from "@/components/PatientSelfAssessment";
import { useLocation } from "wouter";
import { useState } from "react";

export default function Home() {
  const [, navigate] = useLocation();
  const [showAssessment, setShowAssessment] = useState(false);

  const handleGetStarted = () => {
    console.log('Get Started clicked - navigating to dashboard');
    navigate('/dashboard');
  };

  const handleLearnMore = () => {
    console.log('Learn More clicked - scrolling to features');
    // In a real app, this would scroll to a features section
  };

  const handleStartAssessment = () => {
    setShowAssessment(true);
  };

  const handleCloseAssessment = () => {
    setShowAssessment(false);
  };

  const handleStartMonitoring = () => {
    navigate('/monitoring');
  };

  const handleWorkflowManagement = () => {
    navigate('/workflow');
  };

  // 新增：MTF检测处理函数
  const handleMTFDetection = () => {
    console.log('MTF Detection clicked - navigating to enhanced dashboard');
    // 直接导航到Dashboard并切换到MTF Detection标签页
    navigate('/dashboard?tab=mtf-detection');
  };

  return (
    <div data-testid="page-home">
      <HeroSection 
        onGetStarted={handleGetStarted}
        onLearnMore={handleLearnMore}
        onStartAssessment={handleStartAssessment}
        onStartMonitoring={handleStartMonitoring}
        onWorkflowManagement={handleWorkflowManagement}
        onMTFDetection={handleMTFDetection}
      />
      
      {showAssessment && (
        <PatientSelfAssessment onClose={handleCloseAssessment} />
      )}
    </div>
  );
}