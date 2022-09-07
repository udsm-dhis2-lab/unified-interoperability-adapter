import { NetworkInterceptor } from './interceptors/network/network.interceptor';
import { NgModule, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { MatButtonModule } from '@angular/material/button'

import { AppComponent } from './app.component';
import { HeaderComponent } from './components/core/header/header.component';
import { FooterComponent } from './components/core/footer/footer.component';
import { ButtonComponent } from './components/core/button/button.component';
import { BodyComponent } from './components/core/body/body.component';
import { InstanceComponent } from './components/page/instance/instance.component';
import { SourcesComponent } from './components/page/sources/sources.component';
import { MappingComponent } from './components/page/mapping/mapping.component';
import { ReportsComponent } from './components/page/reports/reports.component';
import { LogsComponent } from './components/page/logs/logs.component';
import { SettingsComponent } from './components/page/settings/settings.component';
import { AddSourceComponent } from './components/page/sources/add-source/add-source.component';
import { appRoutes } from './routes';
import { AddInstanceComponent } from './components/page/instance/add-instance/add-instance.component';
import { DatasetsComponent } from './components/page/datasets/datasets.component';
import { AddDatasetComponent } from './components/page/datasets/add-dataset/add-dataset.component';
import { SidenavComponent } from './components/core/sidenav/sidenav.component';
import { EditInstanceComponent } from './components/page/instance/edit-instance/edit-instance.component';
import { EditSourceComponent } from './components/page/sources/edit-source/edit-source.component';
import { AddQueryComponent } from './components/page/mapping/custom-form/add-query/add-query.component';
import { CustomFormComponent } from './components/page/mapping/custom-form/custom-form.component';
import { DatasetViewFormComponent } from './components/page/reports/dataset-view-form/dataset-view-form.component';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';

import { NgxDhis2PeriodFilterModule } from '@iapps/ngx-dhis2-period-filter';
import { SharedModule } from './shared/shared.modules';
import { NgxDhis2HttpClientModule } from '@iapps/ngx-dhis2-http-client';
import { PeriodFilter } from './Helpers/period-filter';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    ButtonComponent,
    BodyComponent,
    InstanceComponent,
    SourcesComponent,
    MappingComponent,
    ReportsComponent,
    LogsComponent,
    SettingsComponent,
    AddSourceComponent,
    AddInstanceComponent,
    DatasetsComponent,
    AddDatasetComponent,
    SidenavComponent,
    EditInstanceComponent,
    EditSourceComponent,
    AddQueryComponent,
    CustomFormComponent,
    DatasetViewFormComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatToolbarModule,
    RouterModule,
    HttpClientModule,
    FontAwesomeModule,
    FormsModule,
    SharedModule,
    RouterModule.forRoot(appRoutes, { enableTracing: true }),
    NgxDhis2HttpClientModule.forRoot({
      namespace: 'iapps',
      version: 1,
      models: {
        users: 'id',
        organisationUnitLevels: 'id,level',
        organisationUnits: 'id,name,level',
        organisationUnitGroups: 'id',
        dataStore_scorecards: 'id',
      },
    }),
  ],
  providers: [
    MappingComponent,
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: 'fill' },
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: NetworkInterceptor,
      multi: true,
    },
    PeriodFilter,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
