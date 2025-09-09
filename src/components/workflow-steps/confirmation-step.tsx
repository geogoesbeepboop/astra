import React from 'react';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import { ChevronLeft, ChevronDown, ChevronRight, Play, Calendar } from 'lucide-react';
import { WorkflowConfig } from '../workflow-stepper';

interface ConfirmationStepProps {
  config: WorkflowConfig;
  onUpdate: (updates: Partial<WorkflowConfig>) => void;
  onSubmit: () => void;
  onBack: () => void;
}

export function ConfirmationStep({ config, onUpdate, onSubmit, onBack }: ConfirmationStepProps) {
  const getDeviceLabels = () => {
    const deviceLabels: { [key: string]: string } = {
      'iphone-15-pro': 'iPhone 15 Pro',
      'iphone-14': 'iPhone 14',
      'pixel-8': 'Google Pixel 8',
      'galaxy-s24': 'Samsung Galaxy S24',
      'ipad-pro': 'iPad Pro 12.9"',
      'surface-pro': 'Microsoft Surface Pro'
    };
    return config.deviceList.map(device => deviceLabels[device] || device);
  };

  const getPlatformLabel = (value: string) => {
    const labels: { [key: string]: string } = {
      'ios': 'iOS',
      'android': 'Android',
      'web': 'Web',
      'desktop': 'Desktop'
    };
    return labels[value] || value;
  };

  const getExecutionTypeLabel = () => {
    return config.executionType === 'schedule' ? 'Scheduled Job' : 'Run Immediately';
  };

  const getComparisonLabel = (value: string) => {
    const labels: { [key: string]: string } = {
      '=': 'equals to',
      '>': 'greater than',
      '<': 'less than',
      '>=': 'greater than or equals to',
      '<=': 'less than or equals to'
    };
    return labels[value] || value;
  };

  const getOSVersionLabel = (value: string) => {
    const labels: { [key: string]: string } = {
      'ios-17': 'iOS 17.x',
      'ios-16': 'iOS 16.x',
      'android-14': 'Android 14',
      'android-13': 'Android 13',
      'windows-11': 'Windows 11',
      'macos-sonoma': 'macOS Sonoma'
    };
    return labels[value] || value;
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg text-gray-900 mb-2">
          {config.executionType === 'schedule' ? 'Final Confirmation' : 'Confirmation'}
        </h3>
        <p className="text-muted-foreground mb-6">
          Review your configuration and {config.executionType === 'schedule' ? 'schedule' : 'trigger'} the workflow.
        </p>
      </div>

      <div className="space-y-6">
        {/* Core Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Core Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Platform:</span>
                <span className="ml-2">{getPlatformLabel(config.platform)}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Environment:</span>
                <span className="ml-2 capitalize">{config.environment}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Suite:</span>
                <span className="ml-2 capitalize">{config.suite.replace('-', ' ')}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Release Version:</span>
                <span className="ml-2">{config.releaseVersion}</span>
              </div>
              <div className="col-span-2">
                <span className="text-muted-foreground">Execution Type:</span>
                <Badge className="ml-2" variant={config.executionType === 'schedule' ? 'secondary' : 'default'}>
                  {getExecutionTypeLabel()}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Advanced Options */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Advanced Options</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Custom Script:</span>
                <span className="ml-2">{config.customScript || 'None'}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Device Farm:</span>
                <span className="ml-2">{config.deviceFarm || 'None'}</span>
              </div>
              <div className="col-span-2">
                <span className="text-muted-foreground">OS Version Comparison:</span>
                <span className="ml-2">
                  {config.comparisonType && config.osVersion 
                    ? `${config.comparisonType} ${getOSVersionLabel(config.osVersion)}`
                    : 'None'
                  }
                </span>
              </div>
              <div className="col-span-2">
                <span className="text-muted-foreground">Devices:</span>
                <div className="mt-1">
                  {config.deviceList.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {getDeviceLabels().map((device, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {device}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <span className="ml-2 text-muted-foreground">None selected</span>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Schedule Details - Only for scheduled jobs */}
        {config.executionType === 'schedule' && config.scheduleConfig && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Calendar className="w-4 h-4" />
                Schedule Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Start Date:</span>
                  <span className="ml-2">{config.scheduleConfig.fromDate || 'Not set'}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">End Date:</span>
                  <span className="ml-2">{config.scheduleConfig.endDate === '-' ? 'No end date' : config.scheduleConfig.endDate || 'No end date'}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Time:</span>
                  <span className="ml-2">{config.scheduleConfig.triggerTime || 'Not set'} Eastern</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Frequency:</span>
                  <span className="ml-2 capitalize">{
                    config.scheduleConfig.repeatFrequency === 'never' 
                      ? "Don't Repeat (One-time)" 
                      : config.scheduleConfig.repeatFrequency || 'Not set'
                  }</span>
                </div>
                <div className="col-span-2">
                  <span className="text-muted-foreground">Days:</span>
                  <div className="mt-1">
                    {config.scheduleConfig.repeatFrequency === 'never' ? (
                      <span className="ml-2 text-muted-foreground">Not applicable (one-time job)</span>
                    ) : config.scheduleConfig.daysOfWeek.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {config.scheduleConfig.daysOfWeek.map((day) => (
                          <Badge key={day} variant="outline" className="text-xs capitalize">
                            {day.slice(0, 3)}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <span className="ml-2 text-muted-foreground">All days</span>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Save as Favorite */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Save as Favorite</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="save-favorite"
                  checked={config.saveAsFavorite}
                  onCheckedChange={(checked) => onUpdate({ saveAsFavorite: checked })}
                />
                <Label htmlFor="save-favorite">Save this workflow as a favorite</Label>
              </div>
              {config.saveAsFavorite && (
                <div className="flex-1 max-w-md">
                  <Input
                    placeholder="Enter favorite workflow name"
                    value={config.favoriteName}
                    onChange={(e) => onUpdate({ favoriteName: e.target.value })}
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-6 border-t border-gray-200">
        <Button variant="outline" onClick={onBack}>
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button 
          onClick={onSubmit} 
          className="bg-green-600 hover:bg-green-700"
          disabled={config.saveAsFavorite && !config.favoriteName}
        >
          {config.executionType === 'schedule' ? (
            <>
              <Calendar className="w-4 h-4 mr-2" />
              Schedule Job
            </>
          ) : (
            <>
              <Play className="w-4 h-4 mr-2" />
              Trigger Job
            </>
          )}
        </Button>
      </div>
    </div>
  );
}