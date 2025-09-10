// Global type definitions

export interface TestCase {
  id: string;
  name: string;
  description?: string;
  supportedApps: string[]; // App IDs that this test case can run on
  estimatedDuration?: number; // in minutes
  moduleId: string;
}

export interface TestModule {
  id: string;
  name: string;
  description?: string;
  testCases: TestCase[];
}

export interface SelectedTestCase {
  testCaseId: string;
  selectedApps: string[]; // Subset of supportedApps that user wants to run
  userIds: { [appId: string]: string }; // User ID to use for each app
}

export interface TestSuiteConfig {
  type: 'premade' | 'custom';
  premadeId?: string; // ID of the selected premade suite
  customSelection?: {
    modules: TestModule[];
    selectedTestCases: SelectedTestCase[];
  };
}

export interface WorkflowConfig {
  platform: string;
  environment: string;
  suite: string;
  releaseVersion: string;
  build: string;
  executionType: 'run-now' | 'schedule';
  customScript: string;
  deviceFarm: string;
  comparisonType: string;
  osVersion: string;
  deviceList: string[];
  testSuiteConfig?: TestSuiteConfig;
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