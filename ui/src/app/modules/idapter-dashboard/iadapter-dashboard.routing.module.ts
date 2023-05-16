import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InstanceComponent } from './components/instance/instance.component';
import { SourcesComponent } from './components/sources/sources.component';
import { MappingComponent } from './components/mapping/mapping.component';
import { ReportsComponent } from './components/reports/reports.component';
import { LogsComponent } from './components/logs/logs.component';
import { SettingsComponent } from './components/settings/settings.component';
import { DatasetsComponent } from './components/datasets/datasets.component';
import { IadapterDashboardComponent } from './containers/iadapter-dashboard/iadapter-dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: IadapterDashboardComponent,
    children: [
      {
        path: '',
        redirectTo: 'reports',
        pathMatch: 'full',
      },
      { path: 'instances', component: InstanceComponent },
      { path: 'sources', component: SourcesComponent },
      { path: 'mapping', component: MappingComponent },
      { path: 'reports', component: ReportsComponent },
      { path: 'logs', component: LogsComponent },
      { path: 'settings', component: SettingsComponent },
      { path: 'datasets', component: DatasetsComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IAdapterDashboardRoutingModule {}
