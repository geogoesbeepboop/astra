// Global type definitions

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

export interface WorkflowStepperProps {
  onClose: () => void;
}

export interface TriggerJobsProps {
  debugEmptyState?: boolean;
}