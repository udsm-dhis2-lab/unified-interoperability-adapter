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

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { InstanceInterface } from '../../resources/interfaces';
@Injectable({
  providedIn: 'root',
})
export class InstancesService {
  private _instances: any[] = [];

  private apiUrl = './api/v1/instance';
  private reportsApiUrl = './api/v1/reports';
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
  getInstances(): Observable<InstanceInterface[] | any> {
    return this._instances.length > 0
      ? of(this._instances)
      : this.httpClient
          .get<InstanceInterface[]>(this.apiUrl, this.httpOptions)
          .pipe(
            tap((instances: any) => {
              this._instances = instances;
            })
          );
  }

  getSingleInstance(
    instance: InstanceInterface
  ): Observable<InstanceInterface | any> {
    const url = `${this.apiUrl}/${instance.id}`;
    return this.httpClient.get<InstanceInterface>(url, this.httpOptions);
  }
  deleteInstance(
    instance: InstanceInterface
  ): Observable<InstanceInterface | any> {
    const url = `${this.apiUrl}/${instance.id}`;
    return this.httpClient.delete<InstanceInterface>(url);
  }

  updateInstance(
    instance: InstanceInterface
  ): Observable<InstanceInterface | any> {
    const url = `${this.apiUrl}`;
    return this.httpClient.put<InstanceInterface>(
      url,
      instance,
      this.httpOptions
    );
  }

  addInstance(
    instance: InstanceInterface
  ): Observable<InstanceInterface | any> {
    return this.httpClient.post<InstanceInterface>(
      this.apiUrl,
      instance,
      this.httpOptions
    );
  }

  verifyDHIS2Connection(parameters: any): Observable<any> {
    return this.httpClient.post(
      this.reportsApiUrl + '/verifyCode',
      parameters,
      this.httpOptions
    );
  }

  getDataSetQueriesByInstanceUuid(uuid: string): Observable<Blob> {
    const url = `./api/v1/dataSetQueries/download?instance=${uuid}`;
    return this.httpClient
      .get(url, {
        responseType: 'blob',
        headers: this.httpOptions.headers,
        observe: 'response',
      })
      .pipe(
        map((response: any) => response.body),
        catchError((error: any) => of(error))
      );
  }

  postDataSetQueriesByInstanceUuid(file: File, uuid: string): Observable<any> {
    const url = `./api/v1/dataSetQueries/upload?instance=${uuid}`;
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);
    const httpOptions = {
      headers: new HttpHeaders({}),
    };
    return this.httpClient.post(url, formData, httpOptions).pipe(
      map((response: any) => response.body),
      catchError((error: any) => of(error))
    );
  }
}
