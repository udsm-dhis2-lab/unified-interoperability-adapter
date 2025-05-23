import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MappingAndDataExtractionComponent } from './mapping-and-data-extraction.component';

const routes: Routes = [
  {
    path: '',
    component: MappingAndDataExtractionComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./../modules/mappings/mappings.module').then(
            (m) => m.MappingsModule
          ),
      },
      {
        path: 'instances',
        loadChildren: () =>
          import(
            './../modules/instance-management/instance-management.module'
          ).then((m) => m.InstanceManagementModule),
      },

      {
        path: 'termminology-services',
        loadChildren: () =>
          import(
            './../modules/service-terminology/service-terminology.module'
          ).then((m) => m.TerminologyServicesModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MappingAndDataExtractionRoutingModule { }
