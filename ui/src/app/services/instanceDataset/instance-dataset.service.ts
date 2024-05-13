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

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { InstanceDatasetsInterface } from 'src/app/resources/interfaces';

@Injectable({
  providedIn: 'root',
})
export class InstanceDatasetsService {
  private apiUrl = './api/v1/datasets';
  httpOptions: any;
  constructor(private httpClient: HttpClient) {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Auth: 'Basic ' + localStorage.getItem('iadapterAuthKey'),
      }),
    };
  }

  //Using Observables to create a service instance
  getInstanceDatasets(
    instanceId: number
  ): Observable<InstanceDatasetsInterface[] | any> {
    let url = `${this.apiUrl}/remote/${instanceId}`;
    return this.httpClient.get<InstanceDatasetsInterface[]>(
      url,
      this.httpOptions
    );
  }

  searchInstanceDatasets(
    instanceId: number,
    datasetName: string
  ): Observable<InstanceDatasetsInterface[] | any> {
    let url = `${this.apiUrl}/remote/${instanceId}/${datasetName}`;
    return this.httpClient.get<InstanceDatasetsInterface[]>(
      url,
      this.httpOptions
    );
  }

  deleteInstanceDataset(
    instanceDataset: InstanceDatasetsInterface
  ): Observable<InstanceDatasetsInterface | any> {
    const url = `${this.apiUrl}/${instanceDataset.id}`;
    return this.httpClient.delete<InstanceDatasetsInterface>(
      url,
      this.httpOptions
    );
  }

  addInstanceDataset(
    instanceDataset: InstanceDatasetsInterface
  ): Observable<InstanceDatasetsInterface | any> {
    return this.httpClient.post<InstanceDatasetsInterface>(
      this.apiUrl,
      instanceDataset,
      this.httpOptions
    );
  }
}
