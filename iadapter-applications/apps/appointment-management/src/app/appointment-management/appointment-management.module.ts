import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReferralManagementComponent } from './appointment-management.component';
import { ReferralManagementRoutingModule } from './appointment-management.routing.module';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [],
  imports: [
    RouterModule,
    CommonModule,
    ReferralManagementRoutingModule,
    ReferralManagementComponent,
  ],
})
export class AppointmentManagementModule {}
