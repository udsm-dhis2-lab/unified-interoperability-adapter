import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReferralManagementComponent } from './referral-management.component';

const routes: Routes = [
  {
    path: '',
    component: ReferralManagementComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReferralManagementRoutingModule {}
