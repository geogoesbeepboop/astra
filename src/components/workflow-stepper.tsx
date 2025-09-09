import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { CoreConfigStep } from './workflow-steps/core-config-step';
import { AdvancedOptionsStep } from './workflow-steps/advanced-options-step';
import { ScheduleConfigStep } from './workflow-steps/schedule-config-step';
import { ConfirmationStep } from './workflow-steps/confirmation-step';
import { SuccessState } from './workflow-steps/success-state';

interface WorkflowStepperProps {
  onClose: () => void;
}

export interface WorkflowConfig {
  platform: string;
  environment: string;
  suite: string;
  releaseVersion: string;
  executionType: 'run-now' | 'schedule';
  customScript: string;
  deviceFarm: string;
  comparisonType: string;
  osVersion: string;
  deviceList: string[];
  scheduleConfig?: {
    fromDate: string;
    endDate: string;
    triggerTime: string;
    repeatFrequency: string;
    daysOfWeek: string[];
  };
  saveAsFavorite: boolean;
  favoriteName: string;
}

const steps = [
  { id: 1, name: 'Core Config', required: true },
  { id: 2, name: 'Advanced Options', required: true },
  { id: 3, name: 'Schedule Config', required: false }, // Only shown for schedule jobs
  { id: 4, name: 'Confirmation', required: true }
];

export function WorkflowStepper({ onClose }: WorkflowStepperProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [config, setConfig] = useState<WorkflowConfig>({
    platform: 'ios', // Default selection
    environment: 'dev', // Default selection  
    suite: 'regression', // Default selection
    releaseVersion: '1.0.0', // Default selection
    executionType: 'run-now',
    customScript: 'default', // Default selection
    deviceFarm: 'aws-device-farm', // Default selection
    comparisonType: '=', // Default selection
    osVersion: 'ios-17', // Default selection
    deviceList: [],
    saveAsFavorite: false,
    favoriteName: ''
  });

  // Filter steps based on execution type
  const visibleSteps = config.executionType === 'schedule' 
    ? steps 
    : steps.filter(step => step.name !== 'Schedule Config');

  // Renumber steps for run-now (1, 2, 3 instead of 1, 2, 4)
  const numberedSteps = visibleSteps.map((step, index) => ({
    ...step,
    displayNumber: index + 1
  }));

  const currentStepData = numberedSteps.find(step => step.displayNumber === currentStep);
  const stepIndex = numberedSteps.findIndex(step => step.displayNumber === currentStep);
  const progress = ((stepIndex + 1) / numberedSteps.length) * 100;

  const handleNext = () => {
    setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  const updateConfig = (updates: Partial<WorkflowConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  const handleSubmit = () => {
    // Simulate API call
    setTimeout(() => {
      setIsSubmitted(true);
    }, 1000);
  };

  if (isSubmitted) {
    return <SuccessState config={config} onCreateAnother={() => {
      setIsSubmitted(false);
      setCurrentStep(1);
      setConfig({
        platform: '',
        environment: '',
        suite: '',
        releaseVersion: '',
        executionType: 'run-now',
        customScript: '',
        deviceFarm: '',
        comparisonType: '',
        osVersion: '',
        deviceList: [],
        saveAsFavorite: false,
        favoriteName: ''
      });
    }} onClose={onClose} />;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <Card className="bg-white shadow-lg">
        <CardHeader className="border-b bg-gray-50">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl text-gray-800">Create New Workflow</CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Progress Indicator */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              {numberedSteps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium border-2 ${
                    currentStep > step.displayNumber 
                      ? 'bg-green-600 text-white border-green-600' 
                      : currentStep === step.displayNumber
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-400 border-gray-300'
                  }`}>
                    {step.displayNumber}
                  </div>
                  <span className={`ml-2 text-sm ${
                    currentStep >= step.displayNumber ? 'text-gray-900' : 'text-gray-400'
                  }`}>
                    {step.name}
                  </span>
                  {index < numberedSteps.length - 1 && (
                    <div className={`w-12 h-0.5 mx-4 ${
                      currentStep > step.displayNumber ? 'bg-green-600' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            <Progress value={progress} className="mt-4" />
          </div>
        </CardHeader>
        
        <CardContent className="p-8">
          {currentStep === 1 && (
            <CoreConfigStep 
              config={config} 
              onUpdate={updateConfig}
              onNext={handleNext}
            />
          )}
          
          {currentStep === 2 && (
            <AdvancedOptionsStep 
              config={config} 
              onUpdate={updateConfig}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}
          
          {currentStep === 3 && config.executionType === 'schedule' && (
            <ScheduleConfigStep 
              config={config} 
              onUpdate={updateConfig}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}
          
          {((currentStep === 3 && config.executionType === 'run-now') || 
            (currentStep === 4 && config.executionType === 'schedule')) && (
            <ConfirmationStep 
              config={config} 
              onUpdate={updateConfig}
              onSubmit={handleSubmit}
              onBack={handleBack}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}