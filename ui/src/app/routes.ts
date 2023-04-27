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
import { Routes } from '@angular/router';
import { InstanceComponent } from './components/page/instance/instance.component';
import { SourcesComponent } from './components/page/sources/sources.component';
import { MappingComponent } from './components/page/mapping/mapping.component';
import { ReportsComponent } from './components/page/reports/reports.component';
import { LogsComponent } from './components/page/logs/logs.component';
import { SettingsComponent } from './components/page/settings/settings.component';
import { DatasetsComponent } from './components/page/datasets/datasets.component';

export const appRoutes: Routes = [
  { path: '', redirectTo: '/reports', pathMatch: 'full' },
  { path: 'instances', component: InstanceComponent },
  { path: 'sources', component: SourcesComponent },
  { path: 'mapping', component: MappingComponent },
  { path: 'reports', component: ReportsComponent },
  { path: 'logs', component: LogsComponent },
  { path: 'settings', component: SettingsComponent },
  { path: 'datasets', component: DatasetsComponent },
];
