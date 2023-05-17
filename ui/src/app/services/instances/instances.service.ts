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
import { Observable, of, tap } from 'rxjs';
import { InstanceInterface } from '../../resources/interfaces';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

@Injectable({
  providedIn: 'root',
})
export class InstancesService {
  private _instances: any[] = [];

  private apiUrl = './api/v1/instance';
  private reportsApiUrl = './api/v1/reports';

  constructor(private httpClient: HttpClient) {}

  //Using Observables to create a service instance
  getInstances(): Observable<InstanceInterface[] | any> {
    return this._instances.length > 0
      ? of(this._instances)
      : this.httpClient.get<InstanceInterface[]>(this.apiUrl).pipe(
          tap((instances) => {
            this._instances = instances;
          })
        );
  }

  getSingleInstance(
    instance: InstanceInterface
  ): Observable<InstanceInterface | any> {
    const url = `${this.apiUrl}/${instance.id}`;
    return this.httpClient.get<InstanceInterface>(url);
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
    return this.httpClient.put<InstanceInterface>(url, instance, httpOptions);
  }

  addInstance(
    instance: InstanceInterface
  ): Observable<InstanceInterface | any> {
    return this.httpClient.post<InstanceInterface>(
      this.apiUrl,
      instance,
      httpOptions
    );
  }

  verifyDHIS2Connection(parameters: any): Observable<any> {
    return this.httpClient.post(
      this.reportsApiUrl + '/verifyCode',
      parameters,
      httpOptions
    );
  }
}
