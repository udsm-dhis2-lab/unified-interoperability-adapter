import { Injectable } from '@angular/core';

import { HduHttpService } from 'libs/hdu-api-http-client/src/lib/services/hdu-http.service';
import { Client } from '../models';
import { catchError, Observable, of } from 'rxjs';
import { HttpParams } from '@angular/common/http';

@Injectable()
export class ClientServiceService {
  hduClientUrl = '';

  constructor(private httpClient: HduHttpService) {}

  getClients(
    pageIndex: number,
    pageSize: number,
    sortField: string | null,
    sortOrder: string | null,
    filters: Array<{ key: string; value: string[] }>
  ): Observable<{ results: Client[] }> {
    let params = new HttpParams()
      .append('page', `${pageIndex}`)
      .append('results', `${pageSize}`)
      .append('sortField', `${sortField}`)
      .append('sortOrder', `${sortOrder}`);
    filters.forEach((filter) => {
      filter.value.forEach((value) => {
        params = params.append(filter.key, value);
      });
    });
    return this.httpClient
      .get<{ results: Client[] }>(`${this.hduClientUrl}`, { params })
      .pipe(catchError(() => of({ results: [] })));
  }
}
