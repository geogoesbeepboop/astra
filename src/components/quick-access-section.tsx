import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/layout/card';
import { Button } from './ui/interactive/button';
import { Badge } from './ui/data-display/badge';
import { Play, Edit, Plus, RotateCcw } from 'lucide-react';

interface QuickAccessSectionProps {
  onCreateNew: () => void;
  debugEmptyState?: boolean;
}

// Mock data for favorite workflows - simulate empty state for testing
const favoriteWorkflows = [
  {
    id: '1',
    name: 'Mobile App Regression Suite',
    lastRun: '2024-01-15 14:30',
    status: 'success'
  },
  {
    id: '2',
    name: 'API Performance Tests',
    lastRun: '2024-01-15 12:15',
    status: 'success'
  },
  {
    id: '3',
    name: 'Cross-Browser Compatibility',
    lastRun: '2024-01-14 16:45',
    status: 'failed'
  },
  {
    id: '4',
    name: 'Database Migration Tests',
    lastRun: '2024-01-14 09:20',
    status: 'success'
  }
];

// Mock data for recent jobs - simulate empty state for testing  
const recentJobs = [
  {
    id: '1',
    name: 'iOS Build Verification',
    status: 'running',
    timestamp: '2024-01-15 15:45'
  },
  {
    id: '2',
    name: 'Android Security Scan',
    status: 'success',
    timestamp: '2024-01-15 14:20'
  },
  {
    id: '3',
    name: 'Load Test - Production',
    status: 'failed',
    timestamp: '2024-01-15 13:10'
  },
  {
    id: '4',
    name: 'Smoke Test Suite',
    status: 'success',
    timestamp: '2024-01-15 11:55'
  },
  {
    id: '5',
    name: 'Integration Tests',
    status: 'success',
    timestamp: '2024-01-15 10:30'
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'success': return 'bg-green-100 text-green-800 border-green-200';
    case 'failed': return 'bg-red-100 text-red-800 border-red-200';
    case 'running': return 'bg-blue-100 text-blue-800 border-blue-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export function QuickAccessSection({ onCreateNew, debugEmptyState }: QuickAccessSectionProps) {
  // Use debug state to control whether to show data
  const hasData = !debugEmptyState && (favoriteWorkflows.length > 0 || recentJobs.length > 0);
  
  React.useEffect(() => {
    if (!hasData) {
      onCreateNew();
    }
  }, [hasData, onCreateNew]);

  // Don't render anything if no data (stepper will be shown instead)
  if (!hasData) {
    return null;
  }

  return (
    <div className="space-y-8">
      {/* Create New Workflow - Primary Action */}
      <div className="flex justify-center">
        <Button 
          onClick={onCreateNew}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 h-auto"
          size="lg"
        >
          <Plus className="w-5 h-5 mr-2" />
          Setup A New Job
        </Button>
      </div>

      {/* Favorite Workflows */}
      <section>
        <h2 className="mb-6 text-gray-800">Favorite Workflows</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {favoriteWorkflows.map((workflow) => (
            <Card key={workflow.id} className="bg-white shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{workflow.name}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Last run: {workflow.lastRun}
                </p>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between mb-4">
                  <Badge className={getStatusColor(workflow.status)}>
                    {workflow.status}
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700">
                    <Play className="w-4 h-4 mr-1" />
                    Run Again
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    <Edit className="w-4 h-4 mr-1" />
                    Edit & Run
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Recent Jobs */}
      <section>
        <h2 className="mb-6 text-gray-800">Recent Jobs</h2>
        <Card className="bg-white shadow-sm">
          <CardContent className="p-6">
            <div className="space-y-4">
              {recentJobs.map((job) => (
                <div key={job.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                  <div className="flex-1">
                    <h4 className="text-gray-900 mb-1">{job.name}</h4>
                    <p className="text-sm text-muted-foreground">{job.timestamp}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={getStatusColor(job.status)}>
                      {job.status}
                    </Badge>
                    <Button size="sm" variant="outline">
                      <RotateCcw className="w-4 h-4 mr-1" />
                      Re-run
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}