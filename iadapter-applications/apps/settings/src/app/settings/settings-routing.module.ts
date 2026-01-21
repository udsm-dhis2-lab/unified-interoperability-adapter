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
    path: 'facilities',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('../modules/facility-management/components/facility-list/facility-list.component').then(
            (m) => m.FacilityListComponent
          ),
      },
      {
        path: 'register',
        loadComponent: () =>
          import('../modules/facility-management/components/facility-form/facility-form.component').then(
            (m) => m.FacilityFormComponent
          ),
      },
      {
        path: ':code',
        loadComponent: () =>
          import('../modules/facility-management/components/facility-details/facility-details.component').then(
            (m) => m.FacilityDetailsComponent
          ),
      },
      {
        path: ':code/mediator',
        loadComponent: () =>
          import('../modules/facility-management/components/facility-form/facility-form.component').then(
            (m) => m.FacilityFormComponent
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingsRoutingModule { }
