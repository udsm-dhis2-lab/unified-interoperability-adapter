import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './containers/home/home.component';
import { ClientDetailsComponent } from './containers/referral-details/referral-details.component';
import { HealthRecordsComponent } from './containers/health-records/health-records.component';
import { HealthRecordsDetailsComponent } from './containers/health-r-details/health-r-details.component';

const routes: Routes = [
  {
    path: "",
    component: HealthRecordsComponent
  },
  {
    path: 'health-records',
    component: HealthRecordsComponent,
  },
  {
    path: 'referral-list',
    component: HomeComponent,
  },
  {
    path: 'referral-details',
    component: ClientDetailsComponent,
  },
  {
    path: "health-records-details",
    component: HealthRecordsDetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
