import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WorkflowComponent } from './workflow.component';
import { WorkflowTableComponent } from './containers/workflow-table/workflow-table.component';

const routes: Routes = [
  {
    path: 'workflows',
    component: WorkflowComponent,
  },
  {
    path: '',
    component: WorkflowTableComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkflowRoutingModule { }
