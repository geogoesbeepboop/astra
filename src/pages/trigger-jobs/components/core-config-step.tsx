import React from 'react';
import { Label } from '../../../components/ui/forms/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/forms/select';
import { RadioGroup, RadioGroupItem } from '../../../components/ui/forms/radio-group';
import { Button } from '../../../components/ui/interactive/button';
import { ChevronRight } from 'lucide-react';
import { WorkflowConfig } from '../../../types';

interface CoreConfigStepProps {
  config: WorkflowConfig;
  onUpdate: (updates: Partial<WorkflowConfig>) => void;
  onNext: () => void;
}

// Mock data for dropdowns
const platforms = [
  { value: 'iPhone', label: 'iPhone' },
  { value: 'android', label: 'Android' },
  { value: 'iPad', label: 'iPad' },
  { value: 'AndroidTablet', label: 'Android Tablet' }
];

const environments = {
  iPhone: [
    { value: 'Sit1', label: 'Sit1' },
    { value: 'Sit2', label: 'Sit2' },
    { value: 'DSA', label: 'DSA' }
  ],
  android: [
    { value: 'Sit1', label: 'Sit1' },
    { value: 'Sit2', label: 'Sit2' },
    { value: 'DSA', label: 'DSA' }
  ],
  iPad: [
    { value: 'Sit1', label: 'Sit1' },
    { value: 'Sit2', label: 'Sit2' },
    { value: 'DSA', label: 'DSA' }
  ],
  AndroidTablet: [
    { value: 'Sit1', label: 'Sit1' },
    { value: 'Sit2', label: 'Sit2' },
    { value: 'DSA', label: 'DSA' }
  ]
};

const suites = {
  'iPhone-Sit1': [
    { value: 'custom', label: 'Custom' },
    { value: '25.10_BalGen', label: '25.10_BalGen' },
    { value: '25.10_Tests', label: '25.10_Tests' }
  ],
  'android-Sit1': [
    { value: 'custom', label: 'Custom' },
    { value: '25.10_BalGen', label: '25.10_BalGen' },
    { value: '25.10_Tests', label: '25.10_Tests' }
  ],
  'iPad-Sit1': [
    { value: 'custom', label: 'Custom' },
    { value: '25.10_BalGen', label: '25.10_BalGen' },
    { value: '25.10_Tests', label: '25.10_Tests' }
  ],
  'AndroidTablet-Sit1': [
    { value: 'custom', label: 'Custom' },
    { value: '25.10_BalGen', label: '25.10_BalGen' },
    { value: '25.10_Tests', label: '25.10_Tests' }
  ]
};

const releaseVersions = [
  { value: '25.09.0', label: '25.09.0' },
  { value: '25.10.0', label: '25.10.0' },
  { value: '25.12.0', label: '25.12.0' },
];

const builds = [
  { value: 'latest', label: 'Latest' },
  { value: 'stable', label: 'Stable' },
  { value: 'rc', label: 'Release Candidate' },
  { value: 'dev', label: 'Development' },
];

export function CoreConfigStep({ config, onUpdate, onNext }: CoreConfigStepProps) {
  const isFormValid = config.platform && config.environment && config.suite && config.releaseVersion && config.build;

  const availableEnvironments = config.platform ? environments[config.platform as keyof typeof environments] : [];
  const availableSuites = config.platform && config.environment
    ? suites[`${config.platform}-${config.environment}` as keyof typeof suites] || []
    : [];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg text-gray-900 mb-2">Core Configuration</h3>
        <p className="text-muted-foreground mb-4">Configure the basic parameters for your automation workflow.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl">
        {/* Platform */}
        <div className="space-y-2">
          <Label htmlFor="platform">Platform *</Label>
          <Select value={config.platform} onValueChange={(value) => onUpdate({
            platform: value,
            environment: '',
            suite: ''
          })}>
            <SelectTrigger className="h-10">
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
            <SelectTrigger className="h-10">
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
            <SelectTrigger className="h-10">
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

        {/* Build */}
        <div className="space-y-2">
          <Label htmlFor="build">Build *</Label>
          <Select value={config.build} onValueChange={(value) => onUpdate({ build: value })}>
            <SelectTrigger className="h-10">
              <SelectValue placeholder="Select build" />
            </SelectTrigger>
            <SelectContent>
              {builds.map((build) => (
                <SelectItem key={build.value} value={build.value}>
                  {build.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Release Version */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="releaseVersion">Release Version *</Label>
          <Select value={config.releaseVersion} onValueChange={(value) => onUpdate({ releaseVersion: value })}>
            <SelectTrigger className="h-10 max-w-md">
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

      </div>

      {/* Execution Type Toggle - Now in dedicated section with more space */}
      <div className="space-y-4 pt-6 border-t border-gray-200">
        <Label className="text-base font-medium">Execution Type</Label>
        <RadioGroup
          value={config.executionType}
          onValueChange={(value) => onUpdate({ executionType: value as 'run-now' | 'schedule' })}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl"
        >
          <div className="flex items-start space-x-3 p-3 rounded-lg border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 transition-colors">
            <RadioGroupItem value="run-now" id="run-now" className="text-blue-600 mt-1" />
            <Label htmlFor="run-now" className="cursor-pointer flex-1">
              <div className="flex flex-col">
                <span className="font-medium">Run Now</span>
                <span className="text-sm text-muted-foreground mt-1">
                  Execute workflow immediately
                </span>
              </div>
            </Label>
          </div>

          <div className="flex items-start space-x-3 p-3 rounded-lg border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 transition-colors">
            <RadioGroupItem value="schedule" id="schedule" className="text-blue-600 mt-1" />
            <Label htmlFor="schedule" className="cursor-pointer flex-1">
              <div className="flex flex-col">
                <span className="font-medium">Schedule Job</span>
                <span className="text-sm text-muted-foreground mt-1">
                  Run at a specific time or on a recurring basis.
                </span>
              </div>
            </Label>
          </div>

        </RadioGroup>
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