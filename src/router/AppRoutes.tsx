import { useRoutes } from 'react-router-dom';
import { TriggerJobs } from '../pages/trigger-jobs/TriggerJobs';

const routes = [
  {
    path: '/',
    element: <div className="bg-white rounded-lg shadow-sm p-8 min-h-[400px] flex items-center justify-center">
      <p className="text-muted-foreground">Welcome! Navigate to Trigger Jobs to get started.</p>
    </div>
  },
  {
    path: '/insights',
    element: <div className="bg-white rounded-lg shadow-sm p-8 min-h-[400px] flex items-center justify-center">
      <p className="text-muted-foreground">Insights dashboard coming soon...</p>
    </div>
  },
  {
    path: '/triggerjobs',
    element: <TriggerJobs />
  }
];

export function AppRoutes() {
  return useRoutes(routes);
}