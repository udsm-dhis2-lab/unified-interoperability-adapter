import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WorkflowsManagementRoutingModule } from './workflows-management-routing.module';
import { WorkflowsManagementHomeComponent } from './workflows-management-home.component';
import { provideRouter } from '@angular/router';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { appEffects, appReducers, metaReducers } from '../state/app.state';
import { appRoutes } from '../app.routes';

@NgModule({
  declarations: [WorkflowsManagementHomeComponent],
  imports: [CommonModule, WorkflowsManagementRoutingModule],
  providers: [
    provideRouter(appRoutes),
    provideStore(appReducers, { metaReducers }),
    provideEffects(appEffects),
  ],
})
export class WorkflowsManagementModule {}
