import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  ArrowRight, 
  ArrowLeft, 
  Calendar as CalendarIcon,
  MapPin,
  Zap
} from 'lucide-react';
import { format } from 'date-fns';
import { AssessmentData } from '@/types/assessment';

interface SymptomScoringProps {
  data: Partial<AssessmentData>;
  onNext: (data: Partial<AssessmentData>) => void;
  onPrevious: () => void;
}

const bodyParts = [
  { id: 'head', label: 'Head', icon: '🧠' },
  { id: 'neck', label: 'Neck', icon: '🦴' },
  { id: 'shoulder-left', label: 'Left Shoulder', icon: '🦴' },
  { id: 'shoulder-right', label: 'Right Shoulder', icon: '🦴' },
  { id: 'arm-left', label: 'Left Arm', icon: '🦴' },
  { id: 'arm-right', label: 'Right Arm', icon: '🦴' },
  { id: 'chest', label: 'Chest', icon: '🫁' },
  { id: 'back-upper', label: 'Upper Back', icon: '🦴' },
  { id: 'back-lower', label: 'Lower Back', icon: '🦴' },
  { id: 'hip-left', label: 'Left Hip', icon: '🦴' },
  { id: 'hip-right', label: 'Right Hip', icon: '🦴' },
  { id: 'leg-left', label: 'Left Leg', icon: '🦴' },
  { id: 'leg-right', label: 'Right Leg', icon: '🦴' },
  { id: 'knee-left', label: 'Left Knee', icon: '🦴' },
  { id: 'knee-right', label: 'Right Knee', icon: '🦴' },
  { id: 'ankle-left', label: 'Left Ankle', icon: '🦴' },
  { id: 'ankle-right', label: 'Right Ankle', icon: '🦴' },
  { id: 'foot-left', label: 'Left Foot', icon: '🦶' },
  { id: 'foot-right', label: 'Right Foot', icon: '🦶' }
];

export function SymptomScoring({ data, onNext, onPrevious }: SymptomScoringProps) {
  const [painLocation, setPainLocation] = useState<string[]>(data.painLocation || []);
  const [painSeverity, setPainSeverity] = useState<number>(data.painSeverity || 0);
  const [painStartDate, setPainStartDate] = useState<Date | undefined>(
    data.painStartDate ? new Date(data.painStartDate) : undefined
  );

  const handleLocationToggle = (locationId: string) => {
    setPainLocation(prev => 
      prev.includes(locationId) 
        ? prev.filter(id => id !== locationId)
        : [...prev, locationId]
    );
  };

  const handleNext = () => {
    onNext({
      painLocation,
      painSeverity,
      painStartDate: painStartDate?.toISOString()
    });
  };

  const isComplete = painLocation.length > 0 && painSeverity > 0 && painStartDate;

  return (
    <div className="space-y-8">
      {/* Question 1: Pain Location */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-primary" />
          <h3 className="text-xl font-semibold">Where do you feel pain?</h3>
        </div>
        
        <p className="text-gray-600">Select all areas where you experience pain or discomfort:</p>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {bodyParts.map((part) => (
            <Card 
              key={part.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                painLocation.includes(part.id) 
                  ? 'ring-2 ring-primary bg-primary/5' 
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => handleLocationToggle(part.id)}
            >
              <CardContent className="p-4 text-center">
                <div className="text-2xl mb-2">{part.icon}</div>
                <p className="text-sm font-medium">{part.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {painLocation.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {painLocation.map((location) => {
              const part = bodyParts.find(p => p.id === location);
              return (
                <Badge key={location} variant="secondary" className="gap-1">
                  {part?.icon} {part?.label}
                </Badge>
              );
            })}
          </div>
        )}
      </div>

      {/* Question 2: Pain Severity */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-primary" />
          <h3 className="text-xl font-semibold">How severe is the pain?</h3>
        </div>
        
        <p className="text-gray-600">Rate your pain on a scale from 0 (no pain) to 10 (severe pain):</p>
        
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">{painSeverity}</div>
                <div className="text-sm text-gray-600">
                  {painSeverity === 0 && 'No pain'}
                  {painSeverity > 0 && painSeverity <= 3 && 'Mild pain'}
                  {painSeverity > 3 && painSeverity <= 6 && 'Moderate pain'}
                  {painSeverity > 6 && painSeverity <= 8 && 'Severe pain'}
                  {painSeverity > 8 && 'Very severe pain'}
                </div>
              </div>
              
              <Slider
                value={[painSeverity]}
                onValueChange={(value) => setPainSeverity(value[0])}
                max={10}
                min={0}
                step={1}
                className="w-full"
              />
              
              <div className="flex justify-between text-xs text-gray-500">
                <span>0 - No pain</span>
                <span>10 - Severe pain</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Question 3: Pain Start Date */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-primary" />
          <h3 className="text-xl font-semibold">When did the pain start?</h3>
        </div>
        
        <p className="text-gray-600">Select the date when you first noticed the pain:</p>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              className="w-full justify-start text-left font-normal"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {painStartDate ? format(painStartDate, "PPP") : "Select date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={painStartDate}
              onSelect={setPainStartDate}
              disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

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
