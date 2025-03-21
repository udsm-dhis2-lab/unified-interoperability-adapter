import { Injectable } from '@angular/core';

import { HduHttpService } from 'libs/hdu-api-http-client/src/lib/services/hdu-http.service';
import { ClientUrls } from '../models';
import { catchError, map, Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import {
  UnAuothorizedException,
  UnknownException,
} from '../../../../../../../libs/models';
import { ClientPage } from '../models';

@Injectable()
export class ClientManagementService {
  hduClientsUrl: string = ClientUrls.GET_CLIENTS;
  hduClientRecordsUrl: string = ClientUrls.GET_CLIENTS;

  constructor(private httpClient: HduHttpService) {}

  getHduClients(
    pageIndex: number,
    pageSize: number,
    filters: Array<{ key: string; value: string[] }>
  ): Observable<ClientPage> {
    let params = new HttpParams()
      .append('page', `${pageIndex}`)
      .append('results', `${pageSize}`);
    filters.forEach((filter) => {
      filter.value.forEach((value) => {
        params = params.append(filter.key, value);
      });
    });

    return this.httpClient
      .get<{ results: any }>(`${this.hduClientsUrl}`, {
        params,
      })
      .pipe(
        map((response: { results: any }) => {
          return ClientPage.fromJson(response);
        }),
        catchError((error: any) => {
          if (error.status === 401) {
            throw new UnAuothorizedException('Invalid username or password');
          } else {
            throw new UnknownException(
              'An unexpected error occurred. Please try again later.'
            );
          }
        })
      );
  }

  getClientById(
    id: string
  ): Observable<ClientPage> {

    return this.httpClient
      .get<{ results: any }>(`${this.hduClientRecordsUrl}?id=${id}`)
      .pipe(
        map((response: { results: any }) => {
          return ClientPage.fromJson(response);
        }),
        catchError((error: any) => {
          if (error.status === 401) {
            throw new UnAuothorizedException('Invalid username or password');
          }
          throw new UnknownException(
            'An unexpected error occurred. Please try again later.'
          );
        })
      );
  }
}
