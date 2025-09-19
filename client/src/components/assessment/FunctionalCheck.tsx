import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { 
  ArrowRight, 
  ArrowLeft, 
  Activity,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { AssessmentData } from '@/types/assessment';

interface FunctionalCheckProps {
  data: Partial<AssessmentData>;
  onNext: (data: Partial<AssessmentData>) => void;
  onPrevious: () => void;
}

export function FunctionalCheck({ data, onNext, onPrevious }: FunctionalCheckProps) {
  const [painWhenWalking, setPainWhenWalking] = useState<boolean | undefined>(
    data.painWhenWalking
  );
  const [painWhenClimbing, setPainWhenClimbing] = useState<boolean | undefined>(
    data.painWhenClimbing
  );
  const [limpingOrImbalance, setLimpingOrImbalance] = useState<boolean | undefined>(
    data.limpingOrImbalance
  );

  const handleNext = () => {
    onNext({
      painWhenWalking,
      painWhenClimbing,
      limpingOrImbalance
    });
  };

  const isComplete = painWhenWalking !== undefined && 
                    painWhenClimbing !== undefined && 
                    limpingOrImbalance !== undefined;

  const questions = [
    {
      id: 'walking',
      icon: Activity,
      title: 'Do you feel pain when walking?',
      description: 'This includes normal walking, even short distances',
      value: painWhenWalking,
      onChange: setPainWhenWalking
    },
    {
      id: 'climbing',
      icon: TrendingUp,
      title: 'Do you feel pain when climbing stairs?',
      description: 'Going up or down stairs, or stepping up onto curbs',
      value: painWhenClimbing,
      onChange: setPainWhenClimbing
    },
    {
      id: 'limping',
      icon: AlertTriangle,
      title: 'Have you noticed limping or imbalance?',
      description: 'Any changes in your walking pattern or balance',
      value: limpingOrImbalance,
      onChange: setLimpingOrImbalance
    }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Functional Assessment</h2>
        <p className="text-gray-600">
          Let's understand how your symptoms affect your daily activities
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

      {/* Summary */}
      {isComplete && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <h4 className="font-semibold text-blue-900 mb-2">Your Responses:</h4>
            <div className="space-y-1 text-sm text-blue-800">
              <p>• Walking pain: {painWhenWalking ? 'Yes' : 'No'}</p>
              <p>• Stair climbing pain: {painWhenClimbing ? 'Yes' : 'No'}</p>
              <p>• Limping or imbalance: {limpingOrImbalance ? 'Yes' : 'No'}</p>
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
          Next
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
