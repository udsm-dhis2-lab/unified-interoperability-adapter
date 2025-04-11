import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './containers/home/home.component';
import { ClientDetailsComponent } from './containers/appointment-details/appointment-details.component';
import { HealthRecordsComponent } from './containers/health-records/health-records.component';

const routes: Routes = [
  {
    path: "",
    component: HomeComponent
  },
  {
    path: 'appointments-list',
    component: HomeComponent,
  },
  {
    path: 'referral-list',
    component: HomeComponent,
  },
  {
    path: 'appointment-details',
    component: ClientDetailsComponent,
  },
  {
    path: "health-records-details",
    component: ClientDetailsComponent
  },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
