import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WorkflowComponent } from './workflow.component';
import { ProcessComponent } from './containers/process/process.component';
import { MainComponent } from './containers/main/main.component';
import { FlowchartComponent } from './components/flow-chart/flow-chart.component';
import { CodeEditorComponent } from '../../shared/components/code-editor/code-editor.component';
import { WorkflowManagementComponent } from './containers/workflow-management/workflow-management.component';

const routes: Routes = [
  {
    path: '',
    component: WorkflowComponent,
  },
  {
    path: 'config',
    component: WorkflowManagementComponent,
    children: [
      {
        path: 'flow',
        component: FlowchartComponent,
        pathMatch: 'full',
      },
      {
        path: 'flow/:workflowId',
        component: FlowchartComponent,
        pathMatch: 'full',
      },
      {
        path: 'code-editor/:workflowId/proc/:procId',
        component: CodeEditorComponent,
        pathMatch: 'full',
      }
    ]
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WorkflowRoutingModule {}
