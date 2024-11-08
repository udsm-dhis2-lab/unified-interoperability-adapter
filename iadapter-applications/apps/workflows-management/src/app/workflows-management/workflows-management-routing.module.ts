import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WorkflowsManagementHomeComponent } from './workflows-management-home.component';

const routes: Routes = [
  {
    path: '',
    component: WorkflowsManagementHomeComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('../../app/features/workflow/workflow.module').then(
            (m) => m.WorkflowModule
          ),
      },
      {
        path: 'schedules',
        loadChildren: () =>
          import('../../app/features/schedule/schedule.module').then(
            (m) => m.ScheduleModule
          ),
      },
      {
        path: 'workflows',
        loadChildren: () =>
          import('../../app/features/workflow/workflow.module').then(
            (m) => m.WorkflowModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WorkflowsManagementRoutingModule {}
