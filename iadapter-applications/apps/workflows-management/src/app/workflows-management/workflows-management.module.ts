import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WorkflowsManagementRoutingModule } from './workflows-management-routing.module';
import { WorkflowsManagementHomeComponent } from './workflows-management-home.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    WorkflowsManagementRoutingModule,
    WorkflowsManagementHomeComponent,
  ],
})
export class WorkflowsManagementModule {}
