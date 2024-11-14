import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadChildren: () =>
      import('../modules/general-settings/general-settings.module').then(
        (m) => m.GeneralSettingsModule
      ),
  },
  {
    path: 'instances',
    loadChildren: () =>
      import('../modules/instances/instances.module').then(
        (m) => m.InstancesModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingsRoutingModule {}
