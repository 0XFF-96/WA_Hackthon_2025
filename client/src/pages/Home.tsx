import { HeroSection } from "@/components/HeroSection";
import { useLocation } from "wouter";

export default function Home() {
  const [, navigate] = useLocation();

  const handleGetStarted = () => {
    console.log('Get Started clicked - navigating to dashboard');
    navigate('/dashboard');
  };

  const handleLearnMore = () => {
    console.log('Learn More clicked - scrolling to features');
    // In a real app, this would scroll to a features section
  };

  return (
    <div data-testid="page-home">
      <HeroSection 
        onGetStarted={handleGetStarted}
        onLearnMore={handleLearnMore}
      />
    </div>
  );
}