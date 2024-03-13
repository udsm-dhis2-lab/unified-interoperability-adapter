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
import { Observable, catchError, map, of } from 'rxjs';
import { DatasetInterface } from 'src/app/models/source.model';

@Injectable({
  providedIn: 'root',
})
export class DatasetsService {
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
  getDatasets(): Observable<DatasetInterface[] | any> {
    return this.httpClient
      .get<DatasetInterface[]>(this.apiUrl, this.httpOptions)
      .pipe(
        map((response: any) => {
          return response?.map((dataset: any) => {
            return {
              ...dataset,
              formDesignCode:
                dataset?.formType == 'CUSTOM' &&
                dataset?.datasetFields?.indexOf('{') > -1
                  ? JSON?.parse(dataset?.datasetFields)?.dataEntryForm?.htmlCode
                  : dataset?.datasetFields,
            };
          });
        })
      );
  }

  getSingleDatasets(
    dataset: DatasetInterface
  ): Observable<DatasetInterface | any> {
    let url = this.apiUrl + '/single?datasetId=' + dataset.id;
    return this.httpClient.get<DatasetInterface>(url, this.httpOptions);
  }

  deleteDataset(dataset: DatasetInterface): Observable<DatasetInterface | any> {
    const url = `${this.apiUrl}/${dataset.id}`;
    return this.httpClient.delete<DatasetInterface>(url, this.httpOptions);
  }

  addDataset(dataset: DatasetInterface): Observable<DatasetInterface | any> {
    return this.httpClient.post<DatasetInterface>(
      this.apiUrl,
      dataset,
      this.httpOptions
    );
  }

  saveDataSetQuery(payload: any): Observable<any> {
    return (
      !payload?.uuid
        ? this.httpClient.post(
            `./api/v1/dataSetQueries`,
            payload,
            this.httpOptions
          )
        : this.httpClient.put(
            `./api/v1/dataSetQueries`,
            payload,
            this.httpOptions
          )
    ).pipe(
      map((response: any) => response),
      catchError((error: any) => of(error))
    );
  }

  getDataSetQueries(paramaters?: string[]): Observable<any> {
    return this.httpClient
      .get(
        `./api/v1/dataSetQueries${
          paramaters ? '?' + paramaters?.join('&') : ''
        }`
      )
      .pipe(
        map((response: any) => {
          console.log((response?.filter((item: any) => item) || [])?.length);
          return response?.filter((item: any) => item) || [];
        })
      );
  }
}
