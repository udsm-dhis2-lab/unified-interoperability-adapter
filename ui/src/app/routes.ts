import { Routes} from '@angular/router';
import { InstanceComponent } from './components/page/instance/instance.component';
import { SourcesComponent } from './components/page/sources/sources.component';
import { MappingComponent } from './components/page/mapping/mapping.component';
import { ReportsComponent } from './components/page/reports/reports.component';
import { LogsComponent } from './components/page/logs/logs.component';
import { SettingsComponent } from './components/page/settings/settings.component';
import { DatasetsComponent } from './components/page/datasets/datasets.component';
import { AppComponent } from './app.component';


export const appRoutes: Routes = [
    { path: '', redirectTo: '/reports', pathMatch: 'full'},
    { path: 'instances', component: InstanceComponent },
    { path: 'sources', component: SourcesComponent },
    { path: 'mapping', component: MappingComponent },
    { path: 'reports', component: ReportsComponent },
    { path: 'logs', component: LogsComponent },
    { path: 'settings', component: SettingsComponent },
    { path: 'datasets', component: DatasetsComponent },
  ]
