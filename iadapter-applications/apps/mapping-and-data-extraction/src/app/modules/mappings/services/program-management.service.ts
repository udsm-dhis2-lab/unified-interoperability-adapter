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
import { MappingsUrls } from '../models/constants/mappings-urls';
import { BaseMappingService } from './base-mapping.service';

@Injectable({
    providedIn: 'root'
})
export class ProgramManagementService {

    constructor(
        private httpClient: HduHttpService,
        private baseMappingService: BaseMappingService
    ) { }

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

    getProgramById(programId: string, programUrl: string, instance: string): Observable<any> {
        const params = new HttpParams()
            .set('programId', programId)
            .set('instance', instance);
        return this.httpClient
            .get<any>(programUrl, { params })
            .pipe(
                catchError((error: any) => this.handleError(error))
            );
    }

    // Program Mapping Methods
    addProgramMapping(payLoad: any): Observable<any> {
        return this.baseMappingService.addMapping(payLoad, MappingsUrls.HDU_PROGRAM_MAPPINGS);
    }

    getExistingProgramMapping(dataElementUuid: string, programId: string, instanceId: string): Observable<any> {
        const namespace = `PROGRAM-${programId}`;
        return this.baseMappingService.getExistingMapping(dataElementUuid, namespace, MappingsUrls.HDU_PROGRAM_MAPPINGS);
    }

    updateProgramMapping(payLoad: any, mappingUuid: string): Observable<any> {
        return this.baseMappingService.updateMapping(payLoad, mappingUuid, MappingsUrls.HDU_PROGRAM_MAPPINGS);
    }

    deleteProgramMapping(mappingUuid: string): Observable<any> {
        return this.baseMappingService.deleteMapping(mappingUuid, MappingsUrls.HDU_PROGRAM_MAPPINGS);
    }

    getDataTemplate(): Observable<any> {
        return this.httpClient
            .get<any>(MappingsUrls.GET_DATA_TEMPLATE)
            .pipe(
                map((response: any) => {
                    return response.value || response.dataTemplate || response;
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
