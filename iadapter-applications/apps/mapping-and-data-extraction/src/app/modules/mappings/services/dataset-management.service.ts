import { Injectable } from '@angular/core';
import { HduHttpService } from 'libs/hdu-api-http-client/src/lib/services/hdu-http.service';
import { catchError, map, Observable } from 'rxjs';
import {
  ConfigurationPage,
  Dataset,
  DatasetPage,
  IcdCodePage,
  MappingsUrls,
  LoincCodePage,
  FlatViewsTablesPage,
} from '../models';
import { HttpParams } from '@angular/common/http';
import {
  UnAuothorizedException,
  UnknownException,
  InternalServerException,
} from '../../../../../../../libs/models';
import { CategoryOptionCombo } from '../models/category-option-combo.model';
import { Endpoints } from '../../../shared';
import { MsdCodePage } from '../models/responses/msd-code-page';
import { BaseMappingService } from './base-mapping.service';

@Injectable({
  providedIn: 'root',
})
export class DatasetManagementService {
  instanceUrl: string = Endpoints.INSTANCES;
  dataSetByIdUrl: string = MappingsUrls.GET_DATASET_BY_ID;
  configurationUrl: string = MappingsUrls.CONFIGURATIONS;
  getFlatViewsTablesUrl: string = MappingsUrls.GET_FLAT_VIEWS_TABLES;

  constructor(
    private httpClient: HduHttpService,
    private baseMappingService: BaseMappingService
  ) { }

  getDatasets(
    pageIndex: number,
    pageSize: number,
    dataSetUrl: string,
    filters: Array<{ key: string; value: string[] }>
  ): Observable<DatasetPage> {
    const params = this.buildHttpParams(pageIndex, pageSize, true, filters);

    return this.httpClient
      .get<{ results: any }>(dataSetUrl, {
        params,
      })
      .pipe(
        map((response: { results: any }) => {
          return DatasetPage.fromJson(response);
        }),
        catchError((error: any) => this.handleError(error))
      );
  }

  getFlatViewsTables(
    pageIndex: number,
    pageSize: number,
    filters: Array<{ key: string; value: string[] }>
  ) {
    const params = this.buildHttpParams(pageIndex, pageSize, true, filters);

    return this.httpClient
      .get<{ results: any }>(this.getFlatViewsTablesUrl, { params })
      .pipe(
        map((response: { results: any }) => {
          return FlatViewsTablesPage.fromJson(response);
        }),
        catchError((error: any) => this.handleError(error))
      );
  }

  getDatasetById(uuid: string): Observable<Dataset> {
    return this.httpClient
      .get<{ results: any }>(`${this.dataSetByIdUrl}/${uuid}`)
      .pipe(
        map((response: { results: any }) => {
          return Dataset.fromJson(response);
        }),
        catchError((error: any) => this.handleError(error))
      );
  }

  getConfigurations(
    pageIndex: number,
    pageSize: number,
    filters: Array<{ key: string; value: string[] }>
  ) {
    const params = this.buildHttpParams(pageIndex, pageSize, true, filters);

    return this.httpClient
      .get<{ results: any }>(this.configurationUrl, { params })
      .pipe(
        map((response: { results: any }) => {
          return ConfigurationPage.fromJson(response);
        }),
        catchError((error: any) => this.handleError(error))
      );
  }

  addConfiguration(payLoad: any): Observable<any> {
    return this.httpClient.post<any>(this.configurationUrl, payLoad).pipe(
      // TODO: return response
      map((response: any) => console.log(response)),
      catchError((error: any) => this.handleError(error))
    );
  }

  deleteConfiguration(uuid: string): Observable<any> {
    return this.httpClient
      .delete<any>(`${this.configurationUrl}/${uuid}`, {})
      .pipe(
        // TODO: return response
        map((response: any) => console.log(response)),
        catchError((error: any) => this.handleError(error))
      );
  }

  editConfiguration(payLoad: any): Observable<any> {
    return this.httpClient
      .put<any>(`${this.configurationUrl}/${payLoad.uuid}`, payLoad)
      .pipe(
        // TODO: return response
        map((response: any) => console.log(response)),
        catchError((error: any) => this.handleError(error))
      );
  }

  getIcdCodes(
    pageIndex: number,
    pageSize: number,
    filters: Array<{ key: string; value: string[] }>
  ): Observable<any> {
    const params = this.buildHttpParams(pageIndex, pageSize, true, filters);

    return this.httpClient
      .get<any>(MappingsUrls.GET_ICD_CODES, { params })
      .pipe(
        map((response: { results: any }) => {
          return IcdCodePage.fromJson(response);
        }),
        catchError((error: any) => this.handleError(error))
      );
  }

  getLoincCodes(
    pageIndex: number,
    pageSize: number,
    filters: Array<{ key: string; value: string[] }>
  ): Observable<any> {
    const params = this.buildHttpParams(pageIndex, pageSize, true, filters);

    return this.httpClient
      .get<any>(MappingsUrls.GET_LOINC_CODES, { params })
      .pipe(
        map((response: { results: any }) => {
          return LoincCodePage.fromJson(response);
        }),
        catchError((error: any) => this.handleError(error))
      );
  }

  getMsdCodes(
    pageIndex: number,
    pageSize: number,
    filters: Array<{ key: string; value: string[] }>
  ): Observable<any> {
    const params = this.buildHttpParams(pageIndex, pageSize, true, filters);

    return this.httpClient
      .get<any>(MappingsUrls.GET_MSD_CODES, { params })
      .pipe(
        map((response: { results: any }) => {
          return MsdCodePage.fromJson(response);
        }),
        catchError((error: any) => this.handleError(error))
      );
  }

  selectDatasetForMapping(
    instanceUuid: string,
    datasetUuid: string
  ): Observable<any> {
    return this.httpClient
      .post<any>(MappingsUrls.SELECT_DATASET_FOR_MAPPING, {
        dataSet: datasetUuid,
        instance: instanceUuid,
      })
      .pipe(
        // TODO: return response
        map((response: any) => console.log(response)),
        catchError((error: any) => this.handleError(error))
      );
  }

  removeDatasetForMapping(datasetUuid: string) {
    return this.httpClient
      .delete<any>(
        `${MappingsUrls.REMOVE_DATASET_FROM_MAPPING}/${datasetUuid}`,
        {}
      )
      .pipe(
        // TODO: return response
        map((response: any) => console.log(response)),
        catchError((error: any) => this.handleError(error))
      );
  }

  getCategoryOptionCombos(dataElementId: string) {
    return this.httpClient
      .get<any>(`${MappingsUrls.GET_CATEGORY_OPTION_COMBO}/${dataElementId}`)
      .pipe(
        map((response: any) => {
          return response['categoryCombo']['categoryOptionCombos'].map(
            (categoryOptionCombo: any) => {
              return CategoryOptionCombo.fromJson(categoryOptionCombo);
            }
          );
        }),
        catchError((error: any) => this.handleError(error))
      );
  }

  addMappings(payLoad: any): Observable<any> {
    return this.baseMappingService.addMapping(payLoad, MappingsUrls.HDU_MAPPINGS);
  }

  getExistingMappings(dataElementUud: string, datasetUuid: string): Observable<any> {
    const namespace = `MAPPINGS-${datasetUuid}`;
    return this.baseMappingService.getExistingMapping(dataElementUud, namespace, MappingsUrls.HDU_MAPPINGS);
  }

  updateMappings(payLoad: any, mappingUuid: string): Observable<any> {
    return this.baseMappingService.updateMapping(payLoad, mappingUuid, MappingsUrls.HDU_MAPPINGS);
  }

  deleteMapping(mappingUuid: string): Observable<any> {
    return this.baseMappingService.deleteMapping(mappingUuid, MappingsUrls.HDU_MAPPINGS);
  }

  private buildHttpParams(
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

  private handleError(error: any): never {
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
