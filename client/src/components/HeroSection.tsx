import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Brain, Activity, Users, Zap, Workflow } from "lucide-react";
import heroImage from '@assets/generated_images/Medical_AI_diagnostic_interface_b11401a9.png';
import dashboardImage from '@assets/generated_images/Healthcare_dashboard_interface_tablet_e70c1368.png';

interface HeroSectionProps {
  onGetStarted: () => void;
  onLearnMore: () => void;
  onStartAssessment: () => void;
  onStartMonitoring: () => void;
  onWorkflowManagement: () => void;
}

export function HeroSection({ onGetStarted, onLearnMore, onStartAssessment, onStartMonitoring, onWorkflowManagement }: HeroSectionProps) {
  //todo: remove mock functionality
  const stats = [
    { icon: Brain, label: "AI Accuracy", value: "96.5%", color: "text-primary" },
    { icon: Activity, label: "Avg. Processing", value: "2.3s", color: "text-green-600" },
    { icon: Users, label: "Cases Analyzed", value: "12.5K", color: "text-blue-600" },
    { icon: Zap, label: "Success Rate", value: "94.2%", color: "text-orange-600" },
  ];

  return (
    <div className="relative min-h-screen">
      {/* Hero Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ 
          backgroundImage: `linear-gradient(135deg, rgba(0, 94, 184, 0.9) 0%, rgba(40, 167, 69, 0.8) 100%), url(${heroImage})`,
        }}
      />
      
      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <header className="p-6">
          <nav className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-md flex items-center justify-center">
                <Brain className="w-4 h-4 text-white" />
              </div>
              <span className="text-white font-bold text-lg" data-testid="text-hero-brand">HealthAI</span>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                Live Demo
              </Badge>
            </div>
          </nav>
        </header>

        {/* Main Hero Content */}
        <main className="flex-1 flex items-center">
          <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Column */}
              <div className="space-y-8">
                <div className="space-y-4">
                  <Badge className="bg-white/10 backdrop-blur-sm border-white/20 text-white" data-testid="badge-hero-category">
                    AI-Powered Healthcare
                  </Badge>
                  <h1 className="text-4xl lg:text-6xl font-bold text-white leading-tight" data-testid="text-hero-title">
                    Advanced 
                    <span className="block text-green-300">Micro-Fracture</span>
                    Diagnosis
                  </h1>
                  <p className="text-lg text-white/90 leading-relaxed" data-testid="text-hero-description">
                    Experience the future of healthcare with our AI-enabled platform that combines 
                    multi-agent simulation, dynamic data systems, and system thinking for precise 
                    micro-fracture diagnosis and treatment planning.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    size="lg"
                    onClick={onGetStarted}
                    className="bg-white text-primary hover:bg-white/90"
                    data-testid="button-get-started"
                  >
                    Start Diagnosis Demo
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                  <Button 
                    size="lg"
                    variant="outline"
                    onClick={onStartAssessment}
                    className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
                    data-testid="button-start-assessment"
                  >
                    Check Your Bone Health
                  </Button>
                  <Button 
                    size="lg"
                    variant="outline"
                    onClick={onStartMonitoring}
                    className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
                    data-testid="button-start-monitoring"
                  >
                    <Activity className="w-4 h-4 mr-2" />
                    Health Monitoring
                  </Button>
                  <Button 
                    size="lg"
                    variant="outline"
                    onClick={onWorkflowManagement}
                    className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
                    data-testid="button-workflow-management"
                  >
                    <Workflow className="w-4 h-4 mr-2" />
                    Workflow Management
                  </Button>
                  <Button 
                    size="lg"
                    variant="outline"
                    onClick={onLearnMore}
                    className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
                    data-testid="button-learn-more"
                  >
                    Learn More
                  </Button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-12">
                  {stats.map((stat, index) => (
                    <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20" data-testid={`stat-${index}`}>
                      <CardContent className="p-4 text-center">
                        <stat.icon className={`w-5 h-5 mx-auto mb-2 ${stat.color}`} />
                        <div className="text-lg font-bold text-white">{stat.value}</div>
                        <div className="text-xs text-white/70">{stat.label}</div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Right Column - Dashboard Preview */}
              <div className="relative">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-green-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all" />
                  <img 
                    src={dashboardImage}
                    alt="Healthcare AI Dashboard"
                    className="relative rounded-2xl shadow-2xl w-full max-w-md mx-auto"
                    data-testid="img-hero-dashboard"
                  />
                </div>
                
                {/* Floating Elements */}
                <div className="absolute -top-4 -right-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold animate-pulse">
                  AI Active
                </div>
                <div className="absolute -bottom-4 -left-4 bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs">
                  Real-time Analysis
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Bottom Section */}
        <div className="p-6 text-center">
          <p className="text-white/70 text-sm" data-testid="text-hero-footer">
            Trusted by healthcare professionals • HIPAA Compliant • 99.9% Uptime
          </p>
        </div>
      </div>
    </div>
  );
}