import React from 'react';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Checkbox } from '../ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { WorkflowConfig } from '../workflow-stepper';

interface ScheduleConfigStepProps {
  config: WorkflowConfig;
  onUpdate: (updates: Partial<WorkflowConfig>) => void;
  onNext: () => void;
  onBack: () => void;
}

const repeatFrequencies = [
  { value: 'never', label: "Don't Repeat (One-time)" },
  { value: '1hr', label: 'Every 1 hour' },
  { value: '2hr', label: 'Every 2 hours' },
  { value: '4hr', label: 'Every 4 hours' },
  { value: '6hr', label: 'Every 6 hours' },
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' }
];

const daysOfWeek = [
  { value: 'monday', label: 'Mon' },
  { value: 'tuesday', label: 'Tue' },
  { value: 'wednesday', label: 'Wed' },
  { value: 'thursday', label: 'Thu' },
  { value: 'friday', label: 'Fri' },
  { value: 'saturday', label: 'Sat' },
  { value: 'sunday', label: 'Sun' }
];

export function ScheduleConfigStep({ config, onUpdate, onNext, onBack }: ScheduleConfigStepProps) {
  const scheduleConfig = config.scheduleConfig || {
    fromDate: '',
    endDate: '-',
    triggerTime: '',
    repeatFrequency: 'never',
    daysOfWeek: []
  };

  const updateScheduleConfig = (updates: Partial<typeof scheduleConfig>) => {
    onUpdate({
      scheduleConfig: {
        ...scheduleConfig,
        ...updates
      }
    });
  };

  const handleDayToggle = (day: string, checked: boolean) => {
    const updatedDays = checked
      ? [...scheduleConfig.daysOfWeek, day]
      : scheduleConfig.daysOfWeek.filter(d => d !== day);
    
    updateScheduleConfig({ daysOfWeek: updatedDays });
  };

  // Generate preview dates
  const generatePreviewDates = () => {
    if (!scheduleConfig.fromDate || !scheduleConfig.triggerTime || !scheduleConfig.repeatFrequency) {
      return [];
    }

    // For one-time jobs, just show the single scheduled date
    if (scheduleConfig.repeatFrequency === 'never') {
      const singleDate = new Date(scheduleConfig.fromDate + 'T' + scheduleConfig.triggerTime);
      return [singleDate];
    }

    const previewDates = [];
    const startDate = new Date(scheduleConfig.fromDate + 'T' + scheduleConfig.triggerTime);
    
    for (let i = 0; i < 5; i++) {
      const date = new Date(startDate);
      if (scheduleConfig.repeatFrequency === 'daily') {
        date.setDate(date.getDate() + i);
      } else if (scheduleConfig.repeatFrequency === 'weekly') {
        date.setDate(date.getDate() + (i * 7));
      } else if (scheduleConfig.repeatFrequency.includes('hr')) {
        const hours = parseInt(scheduleConfig.repeatFrequency);
        date.setHours(date.getHours() + (i * hours));
      }
      previewDates.push(date);
    }
    
    return previewDates;
  };

  const previewDates = generatePreviewDates();

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg text-gray-900 mb-2">Schedule Configuration</h3>
        <p className="text-muted-foreground mb-6">Set up when and how often your workflow should run.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Schedule Settings */}
        <div className="space-y-6">
          {/* From Date */}
          <div className="space-y-2">
            <Label htmlFor="fromDate">From Date</Label>
            <div className="relative">
              <Input
                id="fromDate"
                type="date"
                value={scheduleConfig.fromDate}
                onChange={(e) => updateScheduleConfig({ fromDate: e.target.value })}
                min={new Date().toISOString().split('T')[0]}
                className="[&::-webkit-calendar-picker-indicator]:opacity-100 [&::-webkit-calendar-picker-indicator]:brightness-0"
              />
            </div>
          </div>

          {/* End Date */}
          <div className="space-y-2">
            <Label htmlFor="endDate">End Date (Optional)</Label>
            <div className="relative">
              <Input
                id="endDate"
                type="date"
                value={scheduleConfig.endDate}
                onChange={(e) => updateScheduleConfig({ endDate: e.target.value })}
                min={scheduleConfig.fromDate}
                className="[&::-webkit-calendar-picker-indicator]:opacity-100 [&::-webkit-calendar-picker-indicator]:brightness-0"
              />
            </div>
          </div>

          {/* Trigger Time */}
          <div className="space-y-2">
            <Label htmlFor="triggerTime">Trigger Time (Eastern)</Label>
            <div className="relative">
              <Input
                id="triggerTime"
                type="time"
                value={scheduleConfig.triggerTime}
                onChange={(e) => updateScheduleConfig({ triggerTime: e.target.value })}
                className="[&::-webkit-calendar-picker-indicator]:opacity-100 [&::-webkit-calendar-picker-indicator]:brightness-0"
              />
            </div>
          </div>
        </div>

        {/* Right Column - Frequency & Days */}
        <div className="space-y-6">
          {/* Repeat Frequency */}
          <div className="space-y-2">
            <Label htmlFor="repeatFrequency">Repeat Frequency</Label>
            <Select 
              value={scheduleConfig.repeatFrequency} 
              onValueChange={(value) => updateScheduleConfig({ repeatFrequency: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                {repeatFrequencies.map((freq) => (
                  <SelectItem key={freq.value} value={freq.value}>
                    {freq.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Days of Week */}
          <div className="space-y-2">
            <Label>Days of Week {scheduleConfig.repeatFrequency === 'never' && <span className="text-muted-foreground">(Not applicable for one-time jobs)</span>}</Label>
            <div className="grid grid-cols-7 gap-2">
              {daysOfWeek.map((day) => (
                <div key={day.value} className="flex flex-col items-center space-y-2">
                  <Label htmlFor={day.value} className="text-xs text-center">
                    {day.label}
                  </Label>
                  <Checkbox
                    id={day.value}
                    checked={scheduleConfig.daysOfWeek.includes(day.value)}
                    onCheckedChange={(checked) => handleDayToggle(day.value, checked as boolean)}
                    disabled={scheduleConfig.repeatFrequency === 'never'}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Schedule Preview */}
      {previewDates.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4" />
              Schedule Preview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground mb-3">
                {scheduleConfig.repeatFrequency === 'never' 
                  ? 'Scheduled to run once:'
                  : 'Next 5 scheduled runs:'
                }
              </p>
              {previewDates.map((date, index) => (
                <div key={index} className="text-sm text-gray-700">
                  {date.toLocaleDateString('en-US', { 
                    weekday: 'short', 
                    month: 'short', 
                    day: 'numeric',
                    year: 'numeric'
                  })} at {date.toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit',
                    timeZoneName: 'short'
                  })}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex justify-between pt-6 border-t border-gray-200">
        <Button variant="outline" onClick={onBack}>
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button 
          onClick={onNext} 
          className="bg-blue-600 hover:bg-blue-700"
          disabled={!scheduleConfig.fromDate || !scheduleConfig.triggerTime || !scheduleConfig.repeatFrequency}
        >
          Next: Confirmation
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}