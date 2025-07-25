import { Injectable } from '@angular/core';
import { HduHttpService } from 'libs/hdu-api-http-client/src/lib/services/hdu-http.service';
import { catchError, map, Observable } from 'rxjs';
import { ProgramPage } from '../models/responses/program-page';
import { HttpParams } from '@angular/common/http';
import {
    UnAuothorizedException,
    UnknownException,
    InternalServerException,
} from '../../../../../../../libs/models';

@Injectable({
    providedIn: 'root'
})
export class ProgramManagementService {
    constructor(private httpClient: HduHttpService) { }

    getPrograms(
        pageIndex: number,
        pageSize: number,
        programsUrl: string,
        filters: Array<{ key: string; value: string[] }>
    ): Observable<ProgramPage> {
        const params = this.buildHttpParams(pageIndex, pageSize, true, filters);

        return this.httpClient
            .get<{ results: any }>(programsUrl, {
                params,
            })
            .pipe(
                map((response: { results: any }) => {
                    return ProgramPage.fromJson(response);
                }),
                catchError((error: any) => this.handleError(error))
            );
    }

    private buildHttpParams(
        pageIndex: number,
        pageSize: number,
        includeTotalCount: boolean,
        filters: Array<{ key: string; value: string[] }>
    ): HttpParams {
        let params = new HttpParams()
            .set('pageIndex', pageIndex.toString())
            .set('pageSize', pageSize.toString())
            .set('includeTotalCount', includeTotalCount.toString());

        filters.forEach((filter) => {
            if (filter.value.length > 0) {
                filter.value.forEach((value) => {
                    params = params.append(filter.key, value);
                });
            }
        });

        return params;
    }

    private handleError(error: any): Observable<never> {
        if (error.status === 401) {
            throw new UnAuothorizedException(error.error?.message || 'Unauthorized');
        }

        if (error.status === 500) {
            throw new InternalServerException(
                error.error?.message || 'Internal server error'
            );
        }

        throw new UnknownException(error.error?.message || 'Unknown error');
    }
}
