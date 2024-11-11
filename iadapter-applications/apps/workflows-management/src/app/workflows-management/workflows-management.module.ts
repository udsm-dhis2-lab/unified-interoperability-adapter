import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WorkflowsManagementRoutingModule } from './workflows-management-routing.module';
import { WorkflowsManagementHomeComponent } from './workflows-management-home.component';

@NgModule({
  declarations: [WorkflowsManagementHomeComponent],
  imports: [CommonModule, WorkflowsManagementRoutingModule],
})
export class WorkflowsManagementModule {}
