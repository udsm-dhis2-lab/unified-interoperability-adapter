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
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MappingAndDataExtractionRoutingModule {}
