import React from 'react';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Button } from '../ui/button';
import { ChevronRight } from 'lucide-react';
import { WorkflowConfig } from '../workflow-stepper';

interface CoreConfigStepProps {
  config: WorkflowConfig;
  onUpdate: (updates: Partial<WorkflowConfig>) => void;
  onNext: () => void;
}

// Mock data for dropdowns
const platforms = [
  { value: 'ios', label: 'iOS' },
  { value: 'android', label: 'Android' },
  { value: 'web', label: 'Web' },
  { value: 'desktop', label: 'Desktop' }
];

const environments = {
  ios: [
    { value: 'dev', label: 'Development' },
    { value: 'staging', label: 'Staging' },
    { value: 'prod', label: 'Production' }
  ],
  android: [
    { value: 'dev', label: 'Development' },
    { value: 'staging', label: 'Staging' },
    { value: 'prod', label: 'Production' }
  ],
  web: [
    { value: 'dev', label: 'Development' },
    { value: 'qa', label: 'QA' },
    { value: 'staging', label: 'Staging' },
    { value: 'prod', label: 'Production' }
  ],
  desktop: [
    { value: 'dev', label: 'Development' },
    { value: 'staging', label: 'Staging' },
    { value: 'prod', label: 'Production' }
  ]
};

const suites = {
  'ios-dev': [
    { value: 'regression', label: 'Regression Suite' },
    { value: 'smoke', label: 'Smoke Tests' },
    { value: 'integration', label: 'Integration Tests' }
  ],
  'android-dev': [
    { value: 'regression', label: 'Regression Suite' },
    { value: 'smoke', label: 'Smoke Tests' },
    { value: 'performance', label: 'Performance Tests' }
  ],
  'web-dev': [
    { value: 'e2e', label: 'End-to-End Tests' },
    { value: 'cross-browser', label: 'Cross-Browser Tests' },
    { value: 'accessibility', label: 'Accessibility Tests' }
  ]
};

const releaseVersions = [
  { value: '1.0.0', label: 'v1.0.0' },
  { value: '1.1.0', label: 'v1.1.0' },
  { value: '1.2.0', label: 'v1.2.0' },
  { value: '2.0.0-beta', label: 'v2.0.0-beta' }
];

export function CoreConfigStep({ config, onUpdate, onNext }: CoreConfigStepProps) {
  const isFormValid = config.platform && config.environment && config.suite && config.releaseVersion;
  
  const availableEnvironments = config.platform ? environments[config.platform as keyof typeof environments] : [];
  const availableSuites = config.platform && config.environment 
    ? suites[`${config.platform}-${config.environment}` as keyof typeof suites] || []
    : [];

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg text-gray-900 mb-2">Core Configuration</h3>
        <p className="text-muted-foreground mb-6">Configure the basic parameters for your automation workflow.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 max-w-2xl">
        {/* Platform */}
        <div className="space-y-2">
          <Label htmlFor="platform">Platform *</Label>
          <Select value={config.platform} onValueChange={(value) => onUpdate({ 
            platform: value, 
            environment: '', 
            suite: '' 
          })}>
            <SelectTrigger>
              <SelectValue placeholder="Select platform" />
            </SelectTrigger>
            <SelectContent>
              {platforms.map((platform) => (
                <SelectItem key={platform.value} value={platform.value}>
                  {platform.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Environment */}
        <div className="space-y-2">
          <Label htmlFor="environment">Environment *</Label>
          <Select 
            value={config.environment} 
            onValueChange={(value) => onUpdate({ environment: value, suite: '' })}
            disabled={!config.platform}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select environment" />
            </SelectTrigger>
            <SelectContent>
              {availableEnvironments.map((env) => (
                <SelectItem key={env.value} value={env.value}>
                  {env.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Suite */}
        <div className="space-y-2">
          <Label htmlFor="suite">Test Suite *</Label>
          <Select 
            value={config.suite} 
            onValueChange={(value) => onUpdate({ suite: value })}
            disabled={!config.environment}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select test suite" />
            </SelectTrigger>
            <SelectContent>
              {availableSuites.map((suite) => (
                <SelectItem key={suite.value} value={suite.value}>
                  {suite.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Release Version */}
        <div className="space-y-2">
          <Label htmlFor="releaseVersion">Release Version *</Label>
          <Select value={config.releaseVersion} onValueChange={(value) => onUpdate({ releaseVersion: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select release version" />
            </SelectTrigger>
            <SelectContent>
              {releaseVersions.map((version) => (
                <SelectItem key={version.value} value={version.value}>
                  {version.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Execution Type Toggle */}
        <div className="space-y-4 pt-4 border-t border-gray-200">
          <Label>Execution Type</Label>
          <RadioGroup
            value={config.executionType}
            onValueChange={(value) => onUpdate({ executionType: value as 'run-now' | 'schedule' })}
            className="flex flex-col space-y-3"
          >
            <div className="flex items-center space-x-3 p-3 rounded-lg border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 transition-colors">
              <RadioGroupItem value="run-now" id="run-now" className="text-blue-600" />
              <Label htmlFor="run-now" className="cursor-pointer flex-1">
                <span className="font-medium">Run Now</span>
                <span className="block text-sm text-muted-foreground mt-1">
                  Execute workflow immediately
                </span>
              </Label>
            </div>
            <div className="flex items-center space-x-3 p-3 rounded-lg border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 transition-colors">
              <RadioGroupItem value="schedule" id="schedule" className="text-blue-600" />
              <Label htmlFor="schedule" className="cursor-pointer flex-1">
                <span className="font-medium">Schedule Job</span>
                <span className="block text-sm text-muted-foreground mt-1">
                  Configure scheduling options in the next steps
                </span>
              </Label>
            </div>
          </RadioGroup>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-end pt-6 border-t border-gray-200">
        <Button 
          onClick={onNext}
          disabled={!isFormValid}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Next: Advanced Options
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}