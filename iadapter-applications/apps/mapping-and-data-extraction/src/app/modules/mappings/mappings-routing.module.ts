import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './containers/home/home.component';
import { DatasetMappingComponent } from './containers/dataset-mapping/dataset-mapping.component';
import { ProgramMappingComponent } from './containers/program-mapping/program-mapping.component';
import { ConfigurationsComponent } from './containers/configurations/configurations.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'dataset-mapping',
    component: DatasetMappingComponent,
  },
  {
    path: 'program-mapping',
    component: ProgramMappingComponent,
  },
  {
    path: 'configuration',
    component: ConfigurationsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MappingsRoutingModule { }
