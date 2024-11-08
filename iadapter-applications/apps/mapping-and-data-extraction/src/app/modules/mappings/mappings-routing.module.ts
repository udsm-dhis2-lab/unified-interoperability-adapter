import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './containers/home/home.component';
import { DatasetMappingComponent } from './containers/dataset-mapping/dataset-mapping.component';
import { ConfigurationsComponent } from './containers/configurations/configurations.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'dataset-mapping/:uuid',
    component: DatasetMappingComponent,
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
export class MappingsRoutingModule {}
