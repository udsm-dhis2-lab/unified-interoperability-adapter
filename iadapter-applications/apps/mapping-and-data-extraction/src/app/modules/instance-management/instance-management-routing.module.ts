import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InstancesHomeComponent } from './containers/instances-home/instances-home.component';
const routes: Routes = [
  {
    path: '',
    component: InstancesHomeComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InstancesManagementRoutingModule {}
