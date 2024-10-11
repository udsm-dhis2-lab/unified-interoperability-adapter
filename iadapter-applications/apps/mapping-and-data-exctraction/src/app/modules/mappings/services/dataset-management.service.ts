import { Injectable } from '@angular/core';
import { HduHttpService } from 'libs/hdu-api-http-client/src/lib/services/hdu-http.service';
import { catchError, map, Observable } from 'rxjs';
import { DatasetPage, MappingsUrls } from '../models';
import { HttpParams } from '@angular/common/http';
import { UnAuothorizedException, UnknownException } from '@models';

@Injectable({
  providedIn: 'root',
})
export class DatasetManagementService {
  dataSetUrl: string = MappingsUrls.GET_DATASETS;

  constructor(private httpClient: HduHttpService) {}

  getDatasets(
    pageIndex: number,
    pageSize: number,
    filters: Array<{ key: string; value: string[] }>
  ): Observable<DatasetPage> {
    let params = new HttpParams()
      .append('page', `${pageIndex}`)
      .append('results', `${pageSize}`);
    filters.forEach((filter) => {
      filter.value.forEach((value) => {
        params = params.append(filter.key, value);
      });
    });

    return this.httpClient
      .get<{ results: any }>(`${this.dataSetUrl}`, {
        params,
      })
      .pipe(
        map((response: { results: any }) => {
          return DatasetPage.fromJson(response);
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
}
