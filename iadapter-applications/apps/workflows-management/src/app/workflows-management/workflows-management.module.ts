import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WorkflowsManagementRoutingModule } from './workflows-management-routing.module';
import { WorkflowsManagementHomeComponent } from './workflows-management-home.component';
import { provideRouter } from '@angular/router';
import { appRoutes } from '../app.routes';

@NgModule({
  declarations: [WorkflowsManagementHomeComponent],
  imports: [CommonModule, WorkflowsManagementRoutingModule],
  providers: [],
})
export class WorkflowsManagementModule {}
