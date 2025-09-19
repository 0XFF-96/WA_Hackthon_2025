import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  ArrowRight, 
  ArrowLeft, 
  AlertTriangle,
  Zap,
  Activity,
  FileText
} from 'lucide-react';
import { AssessmentData } from '@/types/assessment';

interface RecentEventProps {
  data: Partial<AssessmentData>;
  onNext: (data: Partial<AssessmentData>) => void;
  onPrevious: () => void;
}

export function RecentEvent({ data, onNext, onPrevious }: RecentEventProps) {
  const [recentFall, setRecentFall] = useState<boolean | undefined>(data.recentFall);
  const [recentJump, setRecentJump] = useState<boolean | undefined>(data.recentJump);
  const [recentImpact, setRecentImpact] = useState<boolean | undefined>(data.recentImpact);
  const [impactDescription, setImpactDescription] = useState<string>(data.impactDescription || '');

  const handleNext = () => {
    onNext({
      recentFall,
      recentJump,
      recentImpact,
      impactDescription: impactDescription.trim() || undefined
    });
  };

  const isComplete = recentFall !== undefined && 
                    recentJump !== undefined && 
                    recentImpact !== undefined;

  const questions = [
    {
      id: 'fall',
      icon: AlertTriangle,
      title: 'Did you experience a fall?',
      description: 'Any fall, slip, or loss of balance that may have caused impact',
      value: recentFall,
      onChange: setRecentFall
    },
    {
      id: 'jump',
      icon: Zap,
      title: 'Did you experience a jump or sudden movement?',
      description: 'Jumping from height, sudden stops, or jarring movements',
      value: recentJump,
      onChange: setRecentJump
    },
    {
      id: 'impact',
      icon: Activity,
      title: 'Did you experience any other sudden impact?',
      description: 'Collision, accident, or any other traumatic event',
      value: recentImpact,
      onChange: setRecentImpact
    }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Recent Events</h2>
        <p className="text-gray-600">
          Tell us about any recent incidents that might be related to your symptoms
        </p>
      </div>

      <div className="space-y-6">
        {questions.map((question, index) => (
          <Card key={question.id} className="transition-all hover:shadow-md">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <question.icon className="w-6 h-6 text-primary" />
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    <h3 className="text-lg font-semibold">{question.title}</h3>
                    <p className="text-gray-600 text-sm">{question.description}</p>
                    
                    <RadioGroup
                      value={question.value?.toString()}
                      onValueChange={(value) => question.onChange(value === 'true')}
                      className="mt-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="true" id={`${question.id}-yes`} />
                        <Label htmlFor={`${question.id}-yes`} className="cursor-pointer">
                          Yes
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="false" id={`${question.id}-no`} />
                        <Label htmlFor={`${question.id}-no`} className="cursor-pointer">
                          No
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Additional Details */}
      {(recentFall || recentJump || recentImpact) && (
        <Card className="bg-yellow-50 border-yellow-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-800">
              <FileText className="w-5 h-5" />
              Additional Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-yellow-700 mb-4">
              Please provide more details about the incident(s) you experienced:
            </p>
            <Textarea
              placeholder="Describe what happened, when it occurred, and any immediate symptoms you noticed..."
              value={impactDescription}
              onChange={(e) => setImpactDescription(e.target.value)}
              className="min-h-[100px]"
            />
          </CardContent>
        </Card>
      )}

      {/* Summary */}
      {isComplete && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <h4 className="font-semibold text-blue-900 mb-2">Recent Events Summary:</h4>
            <div className="space-y-1 text-sm text-blue-800">
              <p>• Fall: {recentFall ? 'Yes' : 'No'}</p>
              <p>• Jump/Sudden movement: {recentJump ? 'Yes' : 'No'}</p>
              <p>• Other impact: {recentImpact ? 'Yes' : 'No'}</p>
              {impactDescription && (
                <div className="mt-2">
                  <p className="font-medium">Additional details:</p>
                  <p className="text-xs bg-white/50 p-2 rounded mt-1">{impactDescription}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={onPrevious}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>
        
        <Button 
          onClick={handleNext} 
          disabled={!isComplete}
          className="bg-primary hover:bg-primary/90"
        >
          Get Results
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
