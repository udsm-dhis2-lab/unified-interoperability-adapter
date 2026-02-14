import { Injectable } from '@angular/core';

import { catchError, map, Observable, throwError } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { API_URLS } from '@hdu/shared';

@Injectable(
    {
        providedIn: "root"
    }
)
export class ClientManagementService {
    hduClientsUrl: string = API_URLS.GET_CLIENTS;

    constructor(private httpClient: HttpClient) { }

    getHduClients(
        pageIndex: number,
        pageSize: number,
        filters: Array<{ key: string; value: string[] }>
    ): Observable<any> {
        let params = new HttpParams()
            .append('page', `${pageIndex}`)
            .append('pageSize', `${pageSize}`);
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
                    return response;
                }),
                catchError((error: any) => throwError(() => error))
            );
    }

    getClientById(
        id: string
    ): Observable<any> {

        return this.httpClient
            .get<{ results: any }>(`${this.hduClientsUrl}?id=${id}`)
            .pipe(
                map((response: { results: any }) => {
                    return response
                }),
                catchError((error: any) => throwError(() => error))
            );
    }
}