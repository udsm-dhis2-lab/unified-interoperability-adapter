import { Injectable } from '@angular/core';

import { HttpClient, HttpParams } from '@angular/common/http';
import { HduHttpService } from 'libs/hdu-api-http-client/src/lib/services/hdu-http.service';
import { catchError, map, Observable } from 'rxjs';
import {
  UnAuothorizedException,
  UnknownException,
} from '../../../../../../../libs/models/src';
import { ClientPage, ClientUrls } from '../models';

@Injectable()
export class ClientManagementService {
  hduClientsUrl: string = ClientUrls.GET_CLIENTS;
  hduSharedRecordsUrl: string = ClientUrls.GET_SHARED_RECORDS;

  constructor(private httpClient: HduHttpService, private http: HttpClient) {}

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

  getHduSharedRecords(
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
      .get<{ results: any }>(`${this.hduSharedRecordsUrl}`, {
        params,
      })
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

  getClientById(id: string): Observable<ClientPage> {
    return this.httpClient
      .get<{ results: any }>(`${this.hduSharedRecordsUrl}?id=${id}`)
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

  getAppointments(filters: any): Observable<any> {
    return this.http.post<Referral[]>(
      `${ClientUrls.BASE_URL}/processes`,
      filters,
      {}
    );
  }
}

export interface Referral {
  client_id: string;
  first_name: string;
  surname: string;
  gender: string;
  referral_date: string;
  referral_number: string;
  referred_to_other_country: boolean | null;
  referring_facility_code: string | null;
  referring_facility: string | null;
}
