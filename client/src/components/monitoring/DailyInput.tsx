import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Save,
  Plus,
  X,
  Activity,
  TrendingUp,
  AlertTriangle,
  Clock,
  MessageSquare
} from 'lucide-react';
import { DailyInputForm, ActivityType } from '@/types/monitoring';

interface DailyInputProps {
  onSave: (data: DailyInputForm) => void;
  onCancel: () => void;
  initialData?: Partial<DailyInputForm>;
}

const painEmojis = ['😊', '🙂', '😐', '😕', '😟', '😣', '😖', '😫', '😭', '🤕', '💀'];
const activityTypes: { type: ActivityType; label: string; icon: string; color: string }[] = [
  { type: 'walking', label: 'Walking', icon: '🚶', color: 'bg-blue-100 text-blue-800' },
  { type: 'exercise', label: 'Exercise', icon: '💪', color: 'bg-green-100 text-green-800' },
  { type: 'rest', label: 'Rest', icon: '😴', color: 'bg-purple-100 text-purple-800' },
  { type: 'work', label: 'Work', icon: '💼', color: 'bg-orange-100 text-orange-800' },
  { type: 'other', label: 'Other', icon: '📝', color: 'bg-gray-100 text-gray-800' }
];

export function DailyInput({ onSave, onCancel, initialData }: DailyInputProps) {
  const [formData, setFormData] = useState<DailyInputForm>({
    painScore: initialData?.painScore || 0,
    painNote: initialData?.painNote || '',
    gaitStable: initialData?.gaitStable ?? true,
    limpingOrImbalance: initialData?.limpingOrImbalance ?? false,
    activities: initialData?.activities || []
  });

  const [newActivity, setNewActivity] = useState<{
    type: ActivityType;
    duration: number;
    note: string;
  }>({
    type: 'walking',
    duration: 30,
    note: ''
  });

  const handleSave = () => {
    onSave(formData);
  };

  const addActivity = () => {
    if (newActivity.duration > 0) {
      setFormData(prev => ({
        ...prev,
        activities: [...prev.activities, {
          ...newActivity,
          id: Date.now().toString()
        }]
      }));
      setNewActivity({
        type: 'walking',
        duration: 30,
        note: ''
      });
    }
  };

  const removeActivity = (index: number) => {
    setFormData(prev => ({
      ...prev,
      activities: prev.activities.filter((_, i) => i !== index)
    }));
  };

  const getPainEmoji = (score: number) => {
    return painEmojis[Math.min(Math.floor(score), painEmojis.length - 1)];
  };

  const getPainDescription = (score: number) => {
    if (score === 0) return 'No pain';
    if (score <= 2) return 'Very mild pain';
    if (score <= 4) return 'Mild pain';
    if (score <= 6) return 'Moderate pain';
    if (score <= 8) return 'Severe pain';
    return 'Very severe pain';
  };

  const totalActivityMinutes = formData.activities.reduce((sum, activity) => sum + activity.duration, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Daily Health Log</h2>
        <p className="text-gray-600">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
      </div>

      {/* Pain Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Pain Score
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-4">
            <div className="text-6xl">{getPainEmoji(formData.painScore)}</div>
            <div className="text-3xl font-bold text-primary">{formData.painScore}</div>
            <div className="text-lg text-gray-600">{getPainDescription(formData.painScore)}</div>
          </div>
          
          <Slider
            value={[formData.painScore]}
            onValueChange={(value) => setFormData(prev => ({ ...prev, painScore: value[0] }))}
            max={10}
            min={0}
            step={1}
            className="w-full"
          />
          
          <div className="flex justify-between text-xs text-gray-500">
            <span>0 - No pain</span>
            <span>10 - Severe pain</span>
          </div>

          <div className="space-y-2">
            <Label htmlFor="pain-note">Additional Notes (Optional)</Label>
            <Textarea
              id="pain-note"
              placeholder="e.g., Sharp pain when walking upstairs, dull ache in the morning..."
              value={formData.painNote}
              onChange={(e) => setFormData(prev => ({ ...prev, painNote: e.target.value }))}
              className="min-h-[80px]"
            />
          </div>
        </CardContent>
      </Card>

      {/* Gait/Mobility Check */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            Gait & Mobility
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label className="text-base font-medium">Did you feel stable when walking today?</Label>
              <RadioGroup
                value={formData.gaitStable.toString()}
                onValueChange={(value) => setFormData(prev => ({ ...prev, gaitStable: value === 'true' }))}
                className="mt-3"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="true" id="gait-stable-yes" />
                  <Label htmlFor="gait-stable-yes" className="cursor-pointer">Yes, felt stable</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="false" id="gait-stable-no" />
                  <Label htmlFor="gait-stable-no" className="cursor-pointer">No, felt unsteady</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label className="text-base font-medium">Any limping or imbalance?</Label>
              <RadioGroup
                value={formData.limpingOrImbalance.toString()}
                onValueChange={(value) => setFormData(prev => ({ ...prev, limpingOrImbalance: value === 'true' }))}
                className="mt-3"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="false" id="limping-no" />
                  <Label htmlFor="limping-no" className="cursor-pointer">No limping or imbalance</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="true" id="limping-yes" />
                  <Label htmlFor="limping-yes" className="cursor-pointer">Yes, noticed limping or imbalance</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Activity Log */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            Activity Log
          </CardTitle>
          <p className="text-sm text-gray-600">
            Total activity today: {totalActivityMinutes} minutes
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Add New Activity */}
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium">Add Activity</h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="activity-type">Activity Type</Label>
                <select
                  id="activity-type"
                  value={newActivity.type}
                  onChange={(e) => setNewActivity(prev => ({ ...prev, type: e.target.value as ActivityType }))}
                  className="w-full mt-1 p-2 border rounded-md"
                >
                  {activityTypes.map((type) => (
                    <option key={type.type} value={type.type}>
                      {type.icon} {type.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <Label htmlFor="activity-duration">Duration (minutes)</Label>
                <Input
                  id="activity-duration"
                  type="number"
                  min="1"
                  max="480"
                  value={newActivity.duration}
                  onChange={(e) => setNewActivity(prev => ({ ...prev, duration: parseInt(e.target.value) || 0 }))}
                  className="mt-1"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="activity-note">Note (Optional)</Label>
              <Input
                id="activity-note"
                placeholder="e.g., Morning walk in the park"
                value={newActivity.note}
                onChange={(e) => setNewActivity(prev => ({ ...prev, note: e.target.value }))}
                className="mt-1"
              />
            </div>
            
            <Button onClick={addActivity} size="sm" className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Add Activity
            </Button>
          </div>

          {/* Activity List */}
          {formData.activities.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium">Today's Activities</h4>
              {formData.activities.map((activity, index) => {
                const activityType = activityTypes.find(t => t.type === activity.type);
                return (
                  <div key={index} className="flex items-center justify-between p-3 bg-white border rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{activityType?.icon}</span>
                      <div>
                        <div className="font-medium">{activityType?.label}</div>
                        <div className="text-sm text-gray-600">
                          {activity.duration} minutes
                          {activity.note && ` • ${activity.note}`}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeActivity(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-4 pt-6">
        <Button onClick={onCancel} variant="outline" className="flex-1">
          Cancel
        </Button>
        <Button onClick={handleSave} className="flex-1 bg-primary hover:bg-primary/90">
          <Save className="w-4 h-4 mr-2" />
          Save Daily Log
        </Button>
      </div>
    </div>
  );
}
