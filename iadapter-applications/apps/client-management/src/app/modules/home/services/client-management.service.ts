import { Injectable } from '@angular/core';

import { HduHttpService } from 'libs/hdu-api-http-client/src/lib/services/hdu-http.service';
import { HduClient } from '../models';
import { catchError, delay, Observable, of } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable()
export class ClientManagementService {

  constructor(private httpClient: HduHttpService) {}

  getHduClients(
    pageIndex: number,
    pageSize: number,
    filters: Array<{ key: string; value: string[] }>
  ): Observable<{ results: HduClient[] }> {
    let params = new HttpParams()
      .append('page', `${pageIndex}`)
      .append('results', `${pageSize}`);
    filters.forEach((filter) => {
      filter.value.forEach((value) => {
        params = params.append(filter.key, value);
      });
    });
    this.httpClient
      .get<{ results: HduClient[] }>(`${this.hduClientUrl}`, { params })
      .pipe(catchError(() => of({ results: [] })));

    return of({ results: this.mockClients }).pipe(delay(3000));
  }
}
