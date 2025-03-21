import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReferralManagementComponent } from './appointment-management.component';

const routes: Routes = [
  {
    path: '',
    component: ReferralManagementComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('../modules/home/home.module').then((m) => m.HomeModule),
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReferralManagementRoutingModule {}
