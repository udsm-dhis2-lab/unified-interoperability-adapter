import { Injectable } from '@angular/core';
import { HduHttpService } from 'libs/hdu-api-http-client/src/lib/services/hdu-http.service';
import { catchError, map, Observable } from 'rxjs';
import {
  ConfigurationPage,
  Dataset,
  DatasetPage,
  IcdCodePage,
  InstancePage,
  MappingsUrls,
} from '../models';
import { HttpParams } from '@angular/common/http';
import { UnAuothorizedException, UnknownException } from '@models';
import { CategoryOptionCombo } from '../models/category-option-combo.model';

@Injectable({
  providedIn: 'root',
})
export class DatasetManagementService {
  instanceUrl: string = MappingsUrls.GET_INSTANCES;
  dataSetByIdUrl: string = MappingsUrls.GET_DATASET_BY_ID;
  configurationUrl: string = MappingsUrls.GET_CONFIGURATIONS;
  addMappingsUrl: string = MappingsUrls.ADD_MAPPINGS;

  constructor(private httpClient: HduHttpService) {}

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

  getInstanceById(uuid: string): Observable<Dataset> {
    return this.httpClient
      .get<{ results: any }>(`${this.dataSetByIdUrl}/${uuid}`)
      .pipe(
        map((response: { results: any }) => {
          return Dataset.fromJson(response);
        }),
        catchError((error: any) => this.handleError(error))
      );
  }

  getInstances(
    pageIndex: number,
    pageSize: number,
    paging: boolean,
    filters: Array<{ key: string; value: string[] }>
  ) {
    const params = this.buildHttpParams(pageIndex, pageSize, paging, filters);

    return this.httpClient
      .get<{ results: any }>(this.instanceUrl, {
        params,
      })
      .pipe(
        map((response: { results: any }) => {
          return InstancePage.fromJson(response);
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

  private handleError(error: any): never {
    console.log('ERRORRR', error);
    if (error.status === 401) {
      throw new UnAuothorizedException('Invalid username or password');
    } else {
      throw new UnknownException(
        'An unexpected error occurred. Please try again later.'
      );
    }
  }

  addMappings(payLoad: any): Observable<any> {
    return this.httpClient.post<any>(this.addMappingsUrl, payLoad).pipe(
      // TODO: return response
      map((response: any) => console.log(response)),
      catchError((error: any) => this.handleError(error))
    );
  }

  private buildHttpParams(
    pageIndex: number,
    pageSize: number,
    paging: boolean = true,
    filters: Array<{ key: string; value: string[] }>
  ): HttpParams {
    let params = new HttpParams()
      .append('page', `${pageIndex}`)
      .append('results', `${pageSize}`)
      .append('paging', `${paging}`);

    filters.forEach((filter) => {
      filter.value.forEach((value) => {
        params = params.append(filter.key, value);
      });
    });

    return params;
  }
}
