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
  LoadingComponent,
];
