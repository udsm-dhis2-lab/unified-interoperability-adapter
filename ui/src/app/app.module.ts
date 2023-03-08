/* BSD 3-Clause License

Copyright (c) 2022, UDSM DHIS2 Lab Tanzania.
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.

* Neither the name of the copyright holder nor the names of its
  contributors may be used to endorse or promote products derived from
  this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/
import { NetworkInterceptor } from './interceptors/network/network.interceptor';
import { NgModule, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';

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
    RouterModule.forRoot(appRoutes, { useHash: true, enableTracing: true }),
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
