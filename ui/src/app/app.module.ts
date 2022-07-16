import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {MatButtonModule} from '@angular/material/button';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatDialogModule} from '@angular/material/dialog';

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
import { ViewFormDesignComponent } from './components/page/mapping/view-form-design/view-form-design.component';
import { SidenavComponent } from './components/core/sidenav/sidenav.component';
import { EditInstanceComponent } from './components/page/instance/edit-instance/edit-instance.component';
import { EditSourceComponent } from './components/page/sources/edit-source/edit-source.component';
import { AddQueryComponent } from './components/page/mapping/view-form-design/custom-form/add-query/add-query.component';
import { CustomFormComponent } from './components/page/mapping/view-form-design/custom-form/custom-form.component';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';



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
    ViewFormDesignComponent,
    SidenavComponent,
    EditInstanceComponent,
    EditSourceComponent,
    CustomFormComponent,
    AddQueryComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FontAwesomeModule,
    HttpClientModule,
    FormsModule,
    MatCheckboxModule,
    MatButtonModule,
    MatSidenavModule,    
    MatSelectModule,
    MatDialogModule,

    RouterModule.forRoot(appRoutes, { enableTracing: true })
  ],
  providers: [
    MappingComponent,
    {provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'fill'}}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
