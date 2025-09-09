import React from 'react';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { WorkflowConfig } from '../workflow-stepper';

interface AdvancedOptionsStepProps {
  config: WorkflowConfig;
  onUpdate: (updates: Partial<WorkflowConfig>) => void;
  onNext: () => void;
  onBack: () => void;
}

// Mock data for dropdowns
const customScripts = [
  { value: 'default', label: 'Default Script' },
  { value: 'performance-test', label: 'Performance Test Script' },
  { value: 'security-scan', label: 'Security Scan Script' },
  { value: 'load-test', label: 'Load Test Script' },
  { value: 'custom-validation', label: 'Custom Validation Script' }
];

const deviceFarms = [
  { value: 'aws-device-farm', label: 'AWS Device Farm' },
  { value: 'browserstack', label: 'BrowserStack' },
  { value: 'sauce-labs', label: 'Sauce Labs' },
  { value: 'internal-farm', label: 'Internal Device Farm' }
];

const comparisonTypes = [
  { value: '=', label: '=' },
  { value: '>', label: '>' },
  { value: '<', label: '<' },
  { value: '>=', label: '>=' },
  { value: '<=', label: '<=' }
];

const osVersions = [
  { value: 'ios-17', label: 'iOS 17.x' },
  { value: 'ios-16', label: 'iOS 16.x' },
  { value: 'android-14', label: 'Android 14' },
  { value: 'android-13', label: 'Android 13' },
  { value: 'windows-11', label: 'Windows 11' },
  { value: 'macos-sonoma', label: 'macOS Sonoma' }
];

const availableDevices = [
  { value: 'iphone-15-pro', label: 'iPhone 15 Pro' },
  { value: 'iphone-14', label: 'iPhone 14' },
  { value: 'pixel-8', label: 'Google Pixel 8' },
  { value: 'galaxy-s24', label: 'Samsung Galaxy S24' },
  { value: 'ipad-pro', label: 'iPad Pro 12.9"' },
  { value: 'surface-pro', label: 'Microsoft Surface Pro' }
];

export function AdvancedOptionsStep({ config, onUpdate, onNext, onBack }: AdvancedOptionsStepProps) {
  const handleDeviceSelect = (deviceValue: string) => {
    if (!config.deviceList.includes(deviceValue)) {
      onUpdate({
        deviceList: [...config.deviceList, deviceValue]
      });
    }
  };

  const handleDeviceRemove = (deviceValue: string) => {
    onUpdate({
      deviceList: config.deviceList.filter(device => device !== deviceValue)
    });
  };

  const getDeviceLabel = (deviceValue: string) => {
    return availableDevices.find(device => device.value === deviceValue)?.label || deviceValue;
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg text-gray-900 mb-2">Advanced Options</h3>
        <p className="text-muted-foreground mb-6">Configure additional parameters and device settings for your workflow.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Custom Script */}
          <div className="space-y-2">
            <Label htmlFor="customScript">Custom Script</Label>
            <Select 
              value={config.customScript} 
              onValueChange={(value) => onUpdate({ customScript: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select custom script" />
              </SelectTrigger>
              <SelectContent>
                {customScripts.map((script) => (
                  <SelectItem key={script.value} value={script.value}>
                    {script.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Device Farm */}
          <div className="space-y-2">
            <Label htmlFor="deviceFarm">Device Farm</Label>
            <Select 
              value={config.deviceFarm} 
              onValueChange={(value) => onUpdate({ deviceFarm: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select device farm" />
              </SelectTrigger>
              <SelectContent>
                {deviceFarms.map((farm) => (
                  <SelectItem key={farm.value} value={farm.value}>
                    {farm.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* OS Version Comparison */}
          <div className="space-y-2">
            <Label htmlFor="osVersionComparison">OS Version Comparison</Label>
            <div className="flex gap-2">
              <div className="w-24">
                <Select 
                  value={config.comparisonType} 
                  onValueChange={(value) => onUpdate({ comparisonType: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="=" />
                  </SelectTrigger>
                  <SelectContent>
                    {comparisonTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <Select 
                  value={config.osVersion} 
                  onValueChange={(value) => onUpdate({ osVersion: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select OS version" />
                  </SelectTrigger>
                  <SelectContent>
                    {osVersions.map((version) => (
                      <SelectItem key={version.value} value={version.value}>
                        {version.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Device List */}
          <div className="space-y-2">
            <Label htmlFor="deviceList">Device List *</Label>
            <Select onValueChange={handleDeviceSelect}>
              <SelectTrigger>
                <SelectValue placeholder="Add devices" />
              </SelectTrigger>
              <SelectContent>
                {availableDevices
                  .filter(device => !config.deviceList.includes(device.value))
                  .map((device) => (
                    <SelectItem key={device.value} value={device.value}>
                      {device.label}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            
            {/* Selected Devices */}
            {config.deviceList.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {config.deviceList.map((device) => (
                  <Badge 
                    key={device} 
                    variant="secondary" 
                    className="flex items-center gap-1 px-3 py-1"
                  >
                    {getDeviceLabel(device)}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 hover:bg-transparent"
                      onClick={() => handleDeviceRemove(device)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            )}
            
            {config.deviceList.length === 0 && (
              <p className="text-sm text-muted-foreground mt-2">
                At least one device must be selected to continue.
              </p>
            )}
          </div>

          {/* Placeholder to maintain symmetry */}
          <div></div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-6 border-t border-gray-200">
        <Button variant="outline" onClick={onBack}>
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button 
          onClick={onNext} 
          disabled={config.deviceList.length === 0}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {config.executionType === 'schedule' ? 'Next: Schedule Config' : 'Next: Confirmation'}
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}