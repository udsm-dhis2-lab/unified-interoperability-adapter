import { Injectable } from '@angular/core';
import { HduHttpService } from 'libs/hdu-api-http-client/src/lib/services/hdu-http.service';
import { catchError, map, Observable, of } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import {
    UnAuothorizedException,
    UnknownException,
    InternalServerException,
} from '../../../../../../../libs/models';

@Injectable({
    providedIn: 'root'
})
export class BaseMappingService {
    constructor(protected httpClient: HduHttpService) { }

    /**
     * Add a new mapping
     */
    addMapping(payLoad: any, mappingUrl: string): Observable<any> {
        return this.httpClient.post<any>(mappingUrl, payLoad).pipe(
            map((response: any) => response),
            catchError((error: any) => this.handleError(error))
        );
    }

    /**
     * Get existing mapping by namespace and data element
     */
    getExistingMapping(
        dataElementUuid: string,
        namespace: string,
        mappingUrl: string
    ): Observable<any> {
        return this.httpClient
            .get<any>(`${mappingUrl}/${namespace}/${dataElementUuid}`)
            .pipe(
                map((response: any) => response),
                catchError((error: any) => {
                    // Return null if no mapping exists (404 error)
                    if (error.status === 404) {
                        return of({ uuid: null });
                    }
                    return this.handleError(error);
                })
            );
    }

    /**
     * Update an existing mapping
     */
    updateMapping(payLoad: any, mappingUuid: string, mappingUrl: string): Observable<any> {
        return this.httpClient
            .put<any>(`${mappingUrl}/${mappingUuid}`, payLoad)
            .pipe(
                map((response: any) => response),
                catchError((error: any) => this.handleError(error))
            );
    }

    /**
     * Delete a mapping
     */
    deleteMapping(mappingUuid: string, mappingUrl: string): Observable<any> {
        return this.httpClient
            .delete<any>(`${mappingUrl}/${mappingUuid}`)
            .pipe(
                map((response: any) => response),
                catchError((error: any) => this.handleError(error))
            );
    }

    /**
     * Get all mappings with pagination and filters
     */
    getMappings(
        pageIndex: number,
        pageSize: number,
        mappingUrl: string,
        filters: Array<{ key: string; value: string[] }> = []
    ): Observable<any> {
        const params = this.buildHttpParams(pageIndex, pageSize, true, filters);

        return this.httpClient
            .get<any>(mappingUrl, { params })
            .pipe(
                map((response: any) => response),
                catchError((error: any) => this.handleError(error))
            );
    }

    /**
     * Build HTTP parameters for pagination and filtering
     */
    protected buildHttpParams(
        pageIndex: number,
        pageSize: number,
        paging: boolean = true,
        filters: Array<{ key: string; value: string[] }>
    ): HttpParams {
        let params = new HttpParams()
            .append('page', `${pageIndex}`)
            .append('pageSize', `${pageSize}`)
            .append('paging', `${paging}`);

        filters.forEach((filter) => {
            filter.value.forEach((value) => {
                params = params.append(filter.key, value);
            });
        });

        return params;
    }

    /**
     * Handle HTTP errors consistently
     */
    protected handleError(error: any): Observable<never> {
        if (error.status === 401) {
            throw new UnAuothorizedException('Invalid username or password');
        }
        if (error.status === 500) {
            throw new InternalServerException(
                'Something on our end went wrong. Please try again later.'
            );
        } else {
            throw new UnknownException(
                'An unexpected error occurred. Please try again later.'
            );
        }
    }
}
