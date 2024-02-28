import { AddDatasetComponent } from './datasets/add-dataset/add-dataset.component';
import { DatasetsComponent } from './datasets/datasets.component';
import { AddInstanceComponent } from './instance/add-instance/add-instance.component';
import { EditInstanceComponent } from './instance/edit-instance/edit-instance.component';
import { InstanceComponent } from './instance/instance.component';
import { LoadingComponent } from '../../../shared/loader/loading/loading.component';
import { LogsComponent } from './logs/logs.component';
import { AddQueryComponent } from './mapping/custom-form/add-query/add-query.component';
import { CustomFormComponent } from './mapping/custom-form/custom-form.component';
import { MappingComponent } from './mapping/mapping.component';
import { DatasetViewFormComponent } from './reports/dataset-view-form/dataset-view-form.component';
import { ReportsComponent } from './reports/reports.component';
import { SettingsComponent } from './settings/settings.component';
import { AddSourceComponent } from './sources/add-source/add-source.component';
import { EditSourceComponent } from './sources/edit-source/edit-source.component';
import { SourcesComponent } from './sources/sources.component';
export const components: any[] = [
  EditInstanceComponent,
  EditSourceComponent,
  AddQueryComponent,
  CustomFormComponent,
  DatasetViewFormComponent,
  AddInstanceComponent,
  InstanceComponent,
  SourcesComponent,
  MappingComponent,
  ReportsComponent,
  LogsComponent,
  SettingsComponent,
  AddSourceComponent,
  DatasetsComponent,
  AddDatasetComponent,
  LoadingComponent
  
];
