import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReferralManagementComponent } from './appointment-management.component';
import { ReferralManagementRoutingModule } from './appointment-management.routing.module';



@NgModule({
  declarations: [ReferralManagementComponent],
  imports: [
    CommonModule,
    ReferralManagementRoutingModule
  ]
})
export class AppointmentManagementModule { }
