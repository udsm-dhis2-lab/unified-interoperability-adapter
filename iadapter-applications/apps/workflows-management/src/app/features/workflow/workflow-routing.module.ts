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
    path: 'process',
    component: ProcessComponent,
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
        path: 'flow/:id',
        component: FlowchartComponent,
        pathMatch: 'full',
      },
      {
        path: 'code-editor/:id',
        component: CodeEditorComponent,
        pathMatch: 'full',
      }
    ]
  },
  // {
  //   path: 'main',
  //   component: MainComponent,
  //   children: [
  //     {
  //       path: '',
  //       redirectTo: 'flow',
  //       pathMatch: 'full',
  //     },
  //     {
  //       path: 'flow',
  //       component: FlowchartComponent,
  //     },
  //     {
  //       path: 'flow/:id',
  //       component: FlowchartComponent,
  //     },
  //     {
  //       path: 'code-editor/:id',
  //       component: CodeEditorComponent,
  //     },
  //   ],
  // },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WorkflowRoutingModule {}
