import React from 'react';
import { Button } from '../../../components/ui/interactive/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/layout/card';
import { Badge } from '../../../components/ui/data-display/badge';
import { CheckCircle, ExternalLink, Plus, ArrowLeft, Calendar, Play } from 'lucide-react';
import { WorkflowConfig } from '../../../types';

interface SuccessStateProps {
  config: WorkflowConfig;
  onCreateAnother: () => void;
  onClose: () => void;
}

export function SuccessState({ config, onCreateAnother, onClose }: SuccessStateProps) {
  // Generate mock job ID
  const jobId = `JOB-${Date.now().toString().slice(-6)}`;
  const isScheduled = config.executionType === 'schedule';

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      {/* Success Icon and Message */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div>
          <h2 className="text-xl text-gray-900 mb-2">
            {isScheduled ? 'Job Scheduled Successfully!' : 'Job Triggered Successfully!'}
          </h2>
          <p className="text-muted-foreground">
            {isScheduled 
              ? 'Your workflow has been scheduled and will run according to your configuration.'
              : 'Your workflow is now running. You can monitor its progress below.'
            }
          </p>
        </div>
      </div>

      {/* Job Details Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              {isScheduled ? (
                <Calendar className="w-5 h-5 text-blue-600" />
              ) : (
                <Play className="w-5 h-5 text-green-600" />
              )}
              Job Details
            </span>
            <Badge variant="outline" className="font-mono">
              {jobId}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Platform:</span>
              <span className="ml-2 capitalize">{config.platform}</span>
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
              <span className="text-muted-foreground">Version:</span>
              <span className="ml-2">{config.releaseVersion}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Status:</span>
              <Badge className={isScheduled 
                ? "bg-blue-100 text-blue-800 border-blue-200 ml-2" 
                : "bg-green-100 text-green-800 border-green-200 ml-2"
              }>
                {isScheduled ? 'Scheduled' : 'Running'}
              </Badge>
            </div>
            <div>
              <span className="text-muted-foreground">Created:</span>
              <span className="ml-2">{new Date().toLocaleString()}</span>
            </div>
          </div>

          {/* Schedule Details for scheduled jobs */}
          {isScheduled && config.scheduleConfig && (
            <div className="pt-4 border-t border-gray-200">
              <h4 className="text-sm text-gray-900 mb-3">Schedule Configuration</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Start Date:</span>
                  <span className="ml-2">{config.scheduleConfig.fromDate}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Time:</span>
                  <span className="ml-2">{config.scheduleConfig.triggerTime} Eastern</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Frequency:</span>
                  <span className="ml-2 capitalize">{config.scheduleConfig.repeatFrequency}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Next Run:</span>
                  <span className="ml-2">
                    {new Date(config.scheduleConfig.fromDate + 'T' + config.scheduleConfig.triggerTime)
                      .toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Favorite Confirmation */}
          {config.saveAsFavorite && (
            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-muted-foreground">Saved as favorite:</span>
                <span className="text-gray-900">{config.favoriteName}</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="space-y-4">
        <div className="flex justify-center">
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={() => window.open(`/job-details/${jobId}`, '_blank')}
          >
            <ExternalLink className="w-4 h-4" />
            View Job Details
          </Button>
        </div>

        <div className="flex gap-4 justify-center">
          <Button onClick={onCreateAnother} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Create Another Workflow
          </Button>
          <Button variant="outline" onClick={onClose}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Return to Dashboard
          </Button>
        </div>
      </div>

      {/* Additional Help Text */}
      <div className="text-center text-sm text-muted-foreground">
        {isScheduled ? (
          <p>
            You will receive notifications when scheduled jobs start and complete. 
            You can manage your scheduled jobs from the dashboard.
          </p>
        ) : (
          <p>
            You will receive a notification when the job completes. 
            Results will be available in the job details page.
          </p>
        )}
      </div>
    </div>
  );
}