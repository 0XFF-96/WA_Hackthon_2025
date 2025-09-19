import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { 
  ArrowRight, 
  ArrowLeft, 
  Calendar,
  Shield,
  X,
  Coffee,
  Activity
} from 'lucide-react';
import { AssessmentData } from '@/types/assessment';

interface RiskFactorsProps {
  data: Partial<AssessmentData>;
  onNext: (data: Partial<AssessmentData>) => void;
  onPrevious: () => void;
}

const ageGroups = [
  { value: 'under-30', label: 'Under 30', description: 'Lower risk age group' },
  { value: '30-50', label: '30-50 years', description: 'Moderate risk age group' },
  { value: '50-70', label: '50-70 years', description: 'Higher risk age group' },
  { value: 'over-70', label: 'Over 70 years', description: 'Highest risk age group' }
];

const riskFactors = [
  {
    id: 'osteoporosisHistory',
    label: 'History of osteoporosis',
    description: 'Have you been diagnosed with osteoporosis or low bone density?',
    icon: Shield
  },
  {
    id: 'previousFractures',
    label: 'Previous fractures',
    description: 'Have you had any bone fractures in the past?',
    icon: Shield
  },
  {
    id: 'smoking',
    label: 'Smoking',
    description: 'Do you currently smoke or have a history of smoking?',
    icon: X
  },
  {
    id: 'lowCalciumIntake',
    label: 'Low calcium intake',
    description: 'Do you consume less than 3 servings of dairy or calcium-rich foods daily?',
    icon: Coffee
  },
  {
    id: 'highImpactActivity',
    label: 'High-impact activities',
    description: 'Do you regularly participate in high-impact sports or activities?',
    icon: Activity
  }
];

export function RiskFactors({ data, onNext, onPrevious }: RiskFactorsProps) {
  const [ageGroup, setAgeGroup] = useState<string>(data.ageGroup || '');
  const [selectedFactors, setSelectedFactors] = useState<Record<string, boolean>>({
    osteoporosisHistory: data.osteoporosisHistory || false,
    previousFractures: data.previousFractures || false,
    smoking: data.smoking || false,
    lowCalciumIntake: data.lowCalciumIntake || false,
    highImpactActivity: data.highImpactActivity || false
  });

  const handleFactorChange = (factorId: string, checked: boolean) => {
    setSelectedFactors(prev => ({
      ...prev,
      [factorId]: checked
    }));
  };

  const handleNext = () => {
    onNext({
      ageGroup: ageGroup as any,
      osteoporosisHistory: selectedFactors.osteoporosisHistory,
      previousFractures: selectedFactors.previousFractures,
      smoking: selectedFactors.smoking,
      lowCalciumIntake: selectedFactors.lowCalciumIntake,
      highImpactActivity: selectedFactors.highImpactActivity
    });
  };

  const isComplete = ageGroup !== '';

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Risk Factors Assessment</h2>
        <p className="text-gray-600">
          Help us understand your health background and lifestyle factors
        </p>
      </div>

      {/* Age Group Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Age Group
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={ageGroup}
            onValueChange={setAgeGroup}
            className="space-y-3"
          >
            {ageGroups.map((group) => (
              <div key={group.value} className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-gray-50">
                <RadioGroupItem value={group.value} id={group.value} />
                <div className="flex-1">
                  <Label htmlFor={group.value} className="cursor-pointer font-medium">
                    {group.label}
                  </Label>
                  <p className="text-sm text-gray-600">{group.description}</p>
                </div>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Risk Factors */}
      <Card>
        <CardHeader>
          <CardTitle>Health & Lifestyle Factors</CardTitle>
          <p className="text-sm text-gray-600">
            Select all that apply to you
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {riskFactors.map((factor) => (
              <div key={factor.id} className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-gray-50">
                <Checkbox
                  id={factor.id}
                  checked={selectedFactors[factor.id]}
                  onCheckedChange={(checked) => handleFactorChange(factor.id, checked as boolean)}
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <factor.icon className="w-4 h-4 text-gray-600" />
                    <Label htmlFor={factor.id} className="cursor-pointer font-medium">
                      {factor.label}
                    </Label>
                  </div>
                  <p className="text-sm text-gray-600">{factor.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      {isComplete && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <h4 className="font-semibold text-blue-900 mb-2">Your Risk Profile:</h4>
            <div className="space-y-1 text-sm text-blue-800">
              <p>• Age group: {ageGroups.find(g => g.value === ageGroup)?.label}</p>
              {Object.entries(selectedFactors).map(([key, value]) => {
                if (value) {
                  const factor = riskFactors.find(f => f.id === key);
                  return <p key={key}>• {factor?.label}</p>;
                }
                return null;
              })}
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
