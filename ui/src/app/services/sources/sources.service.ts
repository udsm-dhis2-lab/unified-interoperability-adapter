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
import { Observable, map } from 'rxjs';
import { SourceInterface } from 'src/app/models/source.model';

@Injectable({
  providedIn: 'root',
})
export class SourcesService {
  private apiUrl = './api/v1/datasource';
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
  getSources(): Observable<SourceInterface[]> {
    return this.httpClient
      .get<SourceInterface[]>(this.apiUrl, this.httpOptions)
      .pipe(map((response: any) => response));
  }

  deleteSource(source: SourceInterface): Observable<SourceInterface> {
    const url = `${this.apiUrl}/${source.id}`;
    return this.httpClient
      .delete<SourceInterface>(url, this.httpOptions)
      .pipe(map((response: any) => response));
  }

  updateSourceActivate(source: SourceInterface): Observable<SourceInterface> {
    const url = `${this.apiUrl}`;
    return this.httpClient
      .put<SourceInterface>(url, source, this.httpOptions)
      .pipe(map((response: any) => response));
  }

  addSource(source: SourceInterface): Observable<SourceInterface> {
    return this.httpClient
      .post<SourceInterface>(this.apiUrl, source, this.httpOptions)
      .pipe(map((response: any) => response));
  }
}
