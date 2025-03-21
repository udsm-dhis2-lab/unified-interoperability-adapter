import { Injectable } from '@angular/core';

import { HduHttpService } from 'libs/hdu-api-http-client/src/lib/services/hdu-http.service';
import { ClientUrls } from '../models';
import { catchError, map, Observable } from 'rxjs';
import { HttpHeaders, HttpParams, HttpClient } from '@angular/common/http';
import {
  UnAuothorizedException,
  UnknownException,
} from '../../../../../../../libs/models/src';
import { ClientPage } from '../models';

@Injectable()
export class ClientManagementService {
  hduClientsUrl: string = ClientUrls.GET_CLIENTS;
  hduSharedRecordsUrl: string = ClientUrls.GET_SHARED_RECORDS;

  // TODO: softcode authentification credentials
  private readonly apiUrl = 'http://41.59.228.177/engine/processes/FHIR-APPOINTMENT-QUERY/run?async=true';
  private readonly credentials = {
    username: 'admin',
    password: 'Admin123'
  };

  constructor(private httpClient: HduHttpService,private http: HttpClient) {}

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

  getClientById(
    id: string
  ): Observable<ClientPage> {

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

  private getHeaders(): HttpHeaders {
    const authHeader = 'Basic ' + btoa(`${this.credentials.username}:${this.credentials.password}`);
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': authHeader
    });
  }

  getAppointments(filters: any): Observable<Referral[]> {
    return this.http.post<Referral[]>(this.apiUrl,
      filters
      ,
      {
      headers: this.getHeaders()

    });
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
