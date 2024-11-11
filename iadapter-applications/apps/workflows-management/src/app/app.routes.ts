import { Route } from '@angular/router';

export const workflowManagementRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'workflows',
  },
  {
    path: '',
    loadChildren: () =>
      import('../app/features/workflow/workflow.module').then(
        (m) => m.WorkflowModule
      ),
  },
  {
    path: 'schedules',
    loadChildren: () =>
      import('../app/features/schedule/schedule.module').then(
        (m) => m.ScheduleModule
      ),
  },
  {
    path: 'workflows',
    loadChildren: () =>
      import('../app/features/workflow/workflow.module').then(
        (m) => m.WorkflowModule
      ),
  },
];
