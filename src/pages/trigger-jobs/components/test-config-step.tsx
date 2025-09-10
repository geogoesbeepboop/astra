import React, { useState, useMemo } from 'react';
import { Label } from '../../../components/ui/forms/label';
import { Button } from '../../../components/ui/interactive/button';
import { Input } from '../../../components/ui/forms/input';
import { Badge } from '../../../components/ui/data-display/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../../../components/ui/data-display/accordion';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/data-display/table';
import { Checkbox } from '../../../components/ui/forms/checkbox';
import { ChevronLeft, ChevronRight, Search, Plus, X, Smartphone, Monitor, Tablet, Globe } from 'lucide-react';
import { WorkflowConfig, TestModule, TestCase, SelectedTestCase } from '../../../types';

interface TestConfigStepProps {
  config: WorkflowConfig;
  onUpdate: (updates: Partial<WorkflowConfig>) => void;
  onNext: () => void;
  onBack: () => void;
}

// Mock data for demo
const mockApps = [
  { id: 'mobile-app', name: 'Mobile App', icon: Smartphone, color: 'bg-blue-100 text-blue-600' },
  { id: 'web-app', name: 'Web App', icon: Globe, color: 'bg-green-100 text-green-600' },
  { id: 'desktop-app', name: 'Desktop App', icon: Monitor, color: 'bg-purple-100 text-purple-600' },
  { id: 'tablet-app', name: 'Tablet App', icon: Tablet, color: 'bg-orange-100 text-orange-600' },
  { id: 'admin-portal', name: 'Admin Portal', icon: Monitor, color: 'bg-red-100 text-red-600' }
];

const mockModules: TestModule[] = [
  {
    id: 'module-1',
    name: 'Authentication Module',
    description: 'User login, logout, and authentication flows',
    testCases: [
      {
        id: 'auth-001',
        name: 'User Login Flow',
        description: 'Test successful user login with valid credentials',
        supportedApps: ['mobile-app', 'web-app', 'tablet-app'],
        estimatedDuration: 15,
        moduleId: 'module-1'
      },
      {
        id: 'auth-002',
        name: 'Password Reset',
        description: 'Test password reset functionality',
        supportedApps: ['mobile-app', 'web-app'],
        estimatedDuration: 10,
        moduleId: 'module-1'
      },
      {
        id: 'auth-003',
        name: 'Multi-factor Authentication',
        description: 'Test MFA setup and verification',
        supportedApps: ['web-app', 'desktop-app', 'admin-portal'],
        estimatedDuration: 20,
        moduleId: 'module-1'
      }
    ]
  },
  {
    id: 'module-2',
    name: 'Transaction Processing',
    description: 'Payment and transaction related tests',
    testCases: [
      {
        id: 'txn-001',
        name: 'Payment Processing',
        description: 'Test successful payment transactions',
        supportedApps: ['mobile-app', 'web-app', 'tablet-app'],
        estimatedDuration: 25,
        moduleId: 'module-2'
      },
      {
        id: 'txn-002',
        name: 'Refund Process',
        description: 'Test refund functionality',
        supportedApps: ['web-app', 'admin-portal'],
        estimatedDuration: 15,
        moduleId: 'module-2'
      }
    ]
  },
  {
    id: 'module-3',
    name: 'User Profile Management',
    description: 'Profile creation, editing, and management',
    testCases: [
      {
        id: 'profile-001',
        name: 'Profile Creation',
        description: 'Test new user profile creation',
        supportedApps: ['mobile-app', 'web-app'],
        estimatedDuration: 12,
        moduleId: 'module-3'
      },
      {
        id: 'profile-002',
        name: 'Profile Picture Upload',
        description: 'Test profile picture upload and validation',
        supportedApps: ['mobile-app', 'web-app', 'tablet-app'],
        estimatedDuration: 8,
        moduleId: 'module-3'
      }
    ]
  }
];

const premadeSuites = {
  '25.10_BalGen': {
    id: '25.10_BalGen',
    name: '25.10 Balance Generation Suite',
    modules: [mockModules[0], mockModules[1]], // Auth + Transaction modules
    description: 'Comprehensive test suite for balance generation functionality'
  },
  '25.10_Tests': {
    id: '25.10_Tests',
    name: '25.10 Complete Test Suite',
    modules: mockModules, // All modules
    description: 'Full regression test suite for 25.10 release'
  }
};

function AppIcon({ appId, size = 'sm' }: { appId: string; size?: 'sm' | 'md' }) {
  const app = mockApps.find(a => a.id === appId);
  if (!app) return null;
  
  const Icon = app.icon;
  const sizeClass = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';
  
  return (
    <div className={`${app.color} p-1 rounded ${sizeClass === 'w-4 h-4' ? 'p-0.5' : 'p-1'}`} title={app.name}>
      <Icon className={sizeClass} />
    </div>
  );
}

function PremadeTestSuiteView({ 
  suiteId, 
  onComplete 
}: { 
  suiteId: string;
  onComplete: (testSuiteConfig: any) => void;
}) {
  const suite = premadeSuites[suiteId as keyof typeof premadeSuites];
  
  // Auto-preselect all test cases for premade suites
  const [selectedTestCases, setSelectedTestCases] = useState<SelectedTestCase[]>(() => {
    if (!suite) return [];
    
    return suite.modules.flatMap(module => 
      module.testCases.map(testCase => ({
        testCaseId: testCase.id,
        selectedApps: [...testCase.supportedApps],
        userIds: testCase.supportedApps.reduce((acc, appId) => {
          acc[appId] = `user_${Math.random().toString(36).substr(2, 6)}`;
          return acc;
        }, {} as { [key: string]: string })
      }))
    );
  });

  if (!suite) {
    return <div>Suite not found</div>;
  }

  const handleTestCaseToggle = (testCase: TestCase) => {
    const existing = selectedTestCases.find(s => s.testCaseId === testCase.id);
    if (existing) {
      setSelectedTestCases(prev => prev.filter(s => s.testCaseId !== testCase.id));
    } else {
      const newSelection: SelectedTestCase = {
        testCaseId: testCase.id,
        selectedApps: [...testCase.supportedApps],
        userIds: testCase.supportedApps.reduce((acc, appId) => {
          acc[appId] = `user_${Math.random().toString(36).substr(2, 6)}`;
          return acc;
        }, {} as { [key: string]: string })
      };
      setSelectedTestCases(prev => [...prev, newSelection]);
    }
  };

  const handleAppToggle = (testCaseId: string, appId: string) => {
    setSelectedTestCases(prev => prev.map(selected => {
      if (selected.testCaseId === testCaseId) {
        const newSelectedApps = selected.selectedApps.includes(appId)
          ? selected.selectedApps.filter(id => id !== appId)
          : [...selected.selectedApps, appId];
        
        const newUserIds = { ...selected.userIds };
        if (!newSelectedApps.includes(appId)) {
          delete newUserIds[appId];
        } else if (!selected.selectedApps.includes(appId)) {
          newUserIds[appId] = `user_${Math.random().toString(36).substr(2, 6)}`;
        }

        return {
          ...selected,
          selectedApps: newSelectedApps,
          userIds: newUserIds
        };
      }
      return selected;
    }));
  };

  const handleComplete = () => {
    const testSuiteConfig = {
      type: 'premade' as const,
      premadeId: suiteId,
      selectedTestCases
    };
    onComplete(testSuiteConfig);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900">{suite.name}</h3>
        <p className="text-sm text-muted-foreground mt-1">{suite.description}</p>
      </div>

      <Accordion type="multiple" className="w-full space-y-2">
        {suite.modules.map((module) => (
          <AccordionItem key={module.id} value={module.id} className="border rounded-lg">
            <AccordionTrigger className="px-4 py-3 hover:bg-gray-50">
              <div className="flex justify-between items-center w-full mr-4">
                <span className="font-medium text-left">{module.name}</span>
                <Badge variant="secondary" className="text-xs">
                  {module.testCases.length} test cases
                </Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <p className="text-sm text-muted-foreground mb-4">{module.description}</p>
              <div className="space-y-3">
                {module.testCases.map((testCase) => {
                  const isSelected = selectedTestCases.some(s => s.testCaseId === testCase.id);
                  const selectedConfig = selectedTestCases.find(s => s.testCaseId === testCase.id);
                  
                  return (
                    <div key={testCase.id} className="border rounded-lg p-3 bg-white">
                      <div className="flex items-start space-x-3">
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => handleTestCaseToggle(testCase)}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-medium text-sm">{testCase.name}</h4>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <span className="text-xs text-muted-foreground">Apps:</span>
                              <div className="flex space-x-1">
                                {testCase.supportedApps.map(appId => (
                                  <AppIcon key={appId} appId={appId} size="sm" />
                                ))}
                              </div>
                            </div>
                            
                            {isSelected && selectedConfig && (
                              <div className="flex items-center space-x-2">
                                <span className="text-xs text-muted-foreground">Run on:</span>
                                <div className="flex space-x-1">
                                  {testCase.supportedApps.map(appId => (
                                    <button
                                      key={appId}
                                      onClick={() => handleAppToggle(testCase.id, appId)}
                                      className={`${
                                        selectedConfig.selectedApps.includes(appId)
                                          ? 'ring-2 ring-blue-500 ring-offset-1'
                                          : 'opacity-50'
                                      } rounded transition-all`}
                                    >
                                      <AppIcon appId={appId} size="sm" />
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      {selectedTestCases.length > 0 && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-medium text-sm">Test Selection Summary</h4>
              <p className="text-xs text-muted-foreground">
                {selectedTestCases.length} test cases selected across {suite.modules.length} modules
              </p>
            </div>
            <Button onClick={handleComplete} className="bg-blue-600 hover:bg-blue-700">
              Configure Selected Tests
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function CustomTestSuiteBuilder({ 
  onComplete 
}: { 
  onComplete: (testSuiteConfig: any) => void;
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTestCases, setSelectedTestCases] = useState<SelectedTestCase[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredModules = useMemo(() => {
    if (!searchTerm) return mockModules;
    
    return mockModules.filter(module => 
      module.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      module.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      module.testCases.some(tc => 
        tc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tc.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm]);

  const paginatedModules = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredModules.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredModules, currentPage]);

  const totalPages = Math.ceil(filteredModules.length / itemsPerPage);

  const handleTestCaseAdd = (testCase: TestCase) => {
    if (selectedTestCases.some(s => s.testCaseId === testCase.id)) return;
    
    const newSelection: SelectedTestCase = {
      testCaseId: testCase.id,
      selectedApps: [...testCase.supportedApps],
      userIds: testCase.supportedApps.reduce((acc, appId) => {
        acc[appId] = `user_${Math.random().toString(36).substr(2, 6)}`;
        return acc;
      }, {} as { [key: string]: string })
    };
    setSelectedTestCases(prev => [...prev, newSelection]);
  };

  const handleTestCaseRemove = (testCaseId: string) => {
    setSelectedTestCases(prev => prev.filter(s => s.testCaseId !== testCaseId));
  };

  const handleAppToggle = (testCaseId: string, appId: string) => {
    setSelectedTestCases(prev => prev.map(selected => {
      if (selected.testCaseId === testCaseId) {
        const newSelectedApps = selected.selectedApps.includes(appId)
          ? selected.selectedApps.filter(id => id !== appId)
          : [...selected.selectedApps, appId];
        
        const newUserIds = { ...selected.userIds };
        if (!newSelectedApps.includes(appId)) {
          delete newUserIds[appId];
        } else if (!selected.selectedApps.includes(appId)) {
          newUserIds[appId] = `user_${Math.random().toString(36).substr(2, 6)}`;
        }

        return {
          ...selected,
          selectedApps: newSelectedApps,
          userIds: newUserIds
        };
      }
      return selected;
    }));
  };

  const handleComplete = () => {
    const testSuiteConfig = {
      type: 'custom' as const,
      customSelection: {
        modules: mockModules,
        selectedTestCases
      }
    };
    onComplete(testSuiteConfig);
  };

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 z-10" />
        <Input
          placeholder="Search modules and test cases..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="pl-10"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Available Test Cases - Now using Accordion */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-medium">Available Test Cases</h3>
            <Badge variant="secondary">
              {filteredModules.reduce((acc, module) => acc + module.testCases.length, 0)} total
            </Badge>
          </div>

          <div className="max-h-96 overflow-y-auto">
            <Accordion type="multiple" className="w-full space-y-2">
              {paginatedModules.map((module) => (
                <AccordionItem key={module.id} value={module.id} className="border rounded-lg">
                  <AccordionTrigger className="px-4 py-3 hover:bg-gray-50">
                    <div className="flex justify-between items-center w-full mr-4">
                      <span className="font-medium text-left">{module.name}</span>
                      <Badge variant="secondary" className="text-xs">
                        {module.testCases.length} test cases
                      </Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <div className="space-y-3">
                      {module.testCases.map((testCase) => {
                        const isSelected = selectedTestCases.some(s => s.testCaseId === testCase.id);
                        
                        return (
                          <div key={testCase.id} className="border rounded-lg p-3 bg-white">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1">
                                <h4 className="font-medium text-sm">{testCase.name}</h4>
                              </div>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleTestCaseAdd(testCase)}
                                disabled={isSelected}
                              >
                                <Plus className="w-3 h-3" />
                              </Button>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <span className="text-xs text-muted-foreground">Apps:</span>
                              <div className="flex space-x-1">
                                {testCase.supportedApps.map(appId => (
                                  <AppIcon key={appId} appId={appId} size="sm" />
                                ))}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="px-3 py-1 text-sm">
                {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </div>

        {/* Selected Test Cases */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-medium">Selected Test Cases</h3>
            <Badge variant="secondary">{selectedTestCases.length} selected</Badge>
          </div>

          {selectedTestCases.length === 0 ? (
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
              <p className="text-muted-foreground">No test cases selected yet</p>
              <p className="text-sm text-muted-foreground mt-1">Add test cases from the left panel</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {selectedTestCases.map((selected) => {
                const testCase = mockModules
                  .flatMap(m => m.testCases)
                  .find(tc => tc.id === selected.testCaseId);
                
                if (!testCase) return null;
                
                return (
                  <div key={selected.testCaseId} className="border rounded-lg p-3 bg-white">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{testCase.name}</h4>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleTestCaseRemove(selected.testCaseId)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-muted-foreground">Apps:</span>
                        <div className="flex space-x-1">
                          {testCase.supportedApps.map(appId => (
                            <AppIcon key={appId} appId={appId} size="sm" />
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-muted-foreground">Run on:</span>
                        <div className="flex space-x-1">
                          {testCase.supportedApps.map(appId => (
                            <button
                              key={appId}
                              onClick={() => handleAppToggle(selected.testCaseId, appId)}
                              className={`${
                                selected.selectedApps.includes(appId)
                                  ? 'ring-2 ring-blue-500 ring-offset-1'
                                  : 'opacity-50'
                              } rounded transition-all`}
                            >
                              <AppIcon appId={appId} size="sm" />
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {selectedTestCases.length > 0 && (
            <Button onClick={handleComplete} className="w-full bg-blue-600 hover:bg-blue-700">
              Configure Selected Tests ({selectedTestCases.length})
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export function TestConfigStep({ config, onUpdate, onNext, onBack }: TestConfigStepProps) {
  const [showTestMatrix, setShowTestMatrix] = useState(false);
  const [testSuiteConfig, setTestSuiteConfig] = useState(config.testSuiteConfig);

  const handleTestSuiteComplete = (newTestSuiteConfig: any) => {
    setTestSuiteConfig(newTestSuiteConfig);
    setShowTestMatrix(true);
  };

  const handleMatrixComplete = () => {
    onUpdate({ testSuiteConfig });
    onNext();
  };

  // Show custom builder for "custom" suite selection or premade for others
  const showCustomBuilder = config.suite === 'custom';
  const suiteId = showCustomBuilder ? '' : config.suite;

  if (showTestMatrix && testSuiteConfig) {
    return <TestMatrixView 
      testSuiteConfig={testSuiteConfig} 
      onComplete={handleMatrixComplete}
      onBack={() => setShowTestMatrix(false)}
    />;
  }

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg text-gray-900 mb-2">Test Configuration</h3>
        <p className="text-muted-foreground mb-6">
          {showCustomBuilder 
            ? 'Build your custom test suite by selecting specific test cases from available modules.'
            : `Configure your ${config.suite} test suite by selecting the test cases you want to run.`
          }
        </p>
      </div>

      {showCustomBuilder ? (
        <CustomTestSuiteBuilder onComplete={handleTestSuiteComplete} />
      ) : (
        <PremadeTestSuiteView suiteId={suiteId} onComplete={handleTestSuiteComplete} />
      )}

      {/* Navigation */}
      <div className="flex justify-between pt-6 border-t border-gray-200">
        <Button variant="outline" onClick={onBack}>
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button 
          variant="outline"
          onClick={onNext}
          disabled={!testSuiteConfig}
        >
          Skip Test Configuration
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}

function TestMatrixView({ 
  testSuiteConfig, 
  onComplete, 
  onBack 
}: { 
  testSuiteConfig: any; 
  onComplete: () => void;
  onBack: () => void;
}) {
  const [matrixData, setMatrixData] = useState(() => {
    if (testSuiteConfig.type === 'premade') {
      return testSuiteConfig.selectedTestCases || [];
    } else {
      return testSuiteConfig.customSelection?.selectedTestCases || [];
    }
  });

  const handleUserIdChange = (testCaseId: string, appId: string, newUserId: string) => {
    setMatrixData((prev: SelectedTestCase[]) =>
      prev.map(selected =>
        selected.testCaseId === testCaseId
          ? {
              ...selected,
              userIds: { ...selected.userIds, [appId]: newUserId }
            }
          : selected
      )
    );
  };

  const allApps = useMemo(() => {
    const appSet = new Set<string>();
    matrixData.forEach((selected: SelectedTestCase) => {
      selected.selectedApps.forEach(appId => appSet.add(appId));
    });
    return Array.from(appSet);
  }, [matrixData]);

  const getTestCaseName = (testCaseId: string) => {
    const testCase = mockModules
      .flatMap(m => m.testCases)
      .find(tc => tc.id === testCaseId);
    return testCase?.name || testCaseId;
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg text-gray-900 mb-2">Test Execution Matrix</h3>
        <p className="text-muted-foreground mb-6">
          Review and configure user IDs for each test case and application combination.
        </p>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-64">Test Method</TableHead>
              {allApps.map(appId => {
                const app = mockApps.find(a => a.id === appId);
                return (
                  <TableHead key={appId} className="text-center min-w-32">
                    <div className="flex items-center justify-center space-x-2">
                      <AppIcon appId={appId} size="sm" />
                      <span className="text-xs">{app?.name}</span>
                    </div>
                  </TableHead>
                );
              })}
            </TableRow>
          </TableHeader>
          <TableBody>
            {matrixData.map((selected: SelectedTestCase) => (
              <TableRow key={selected.testCaseId}>
                <TableCell className="font-medium">
                  {getTestCaseName(selected.testCaseId)}
                </TableCell>
                {allApps.map(appId => {
                  const isAppSelected = selected.selectedApps.includes(appId);
                  const userId = selected.userIds[appId] || '';

                  return (
                    <TableCell key={appId} className="text-center">
                      {isAppSelected ? (
                        <Input
                          value={userId}
                          onChange={(e) => handleUserIdChange(selected.testCaseId, appId, e.target.value)}
                          className="text-center text-xs h-8"
                          placeholder="user_id"
                        />
                      ) : (
                        <span className="text-muted-foreground text-xs">—</span>
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-between items-center pt-4 border-t">
        <Button variant="outline" onClick={onBack}>
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back to Test Selection
        </Button>
        
        <div className="flex items-center space-x-4">
          <div className="text-sm text-muted-foreground">
            {matrixData.length} test cases configured
          </div>
          <Button onClick={onComplete} className="bg-blue-600 hover:bg-blue-700">
            Continue
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}