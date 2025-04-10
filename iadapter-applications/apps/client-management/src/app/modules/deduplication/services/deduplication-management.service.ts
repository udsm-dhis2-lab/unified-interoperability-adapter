import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable } from 'rxjs';
import { HduHttpService } from '../../../../../../../libs/hdu-api-http-client/src/lib/services/hdu-http.service';
import {
  UnAuothorizedException,
  UnknownException,
} from '../../../../../../../libs/models';
import { DeduplicationPage, DeduplicationUrls } from '../models';

@Injectable()
export class DeduplicationManagementService {
  hduDeduplicationUrl: string = DeduplicationUrls.GET_DEDUPLICATIONS;

  constructor(private httpClient: HduHttpService) {}

  getDeduplicationClients(
    pageIndex: number,
    pageSize: number,
    filters: Array<{ key: string; value: string[] }>
  ): Observable<DeduplicationPage> {
    let params = new HttpParams()
      .append('page', `${pageIndex}`)
      .append('pageSize', `${pageSize}`);
    filters.forEach((filter) => {
      filter.value.forEach((value) => {
        params = params.append(filter.key, value);
      });
    });
    return this.httpClient
      .post<{ results: any }>(
        `${this.hduDeduplicationUrl}`,
        { code: 'DEDUPLICATION' },
        {
          params,
        }
      )
      .pipe(
        map((response: { results: any }) => {
          return DeduplicationPage.fromJson(response);
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

  createMergeRequest(payload: any): Observable<any> {
    const namespace = 'MERGE_REQUESTS';
    const time = new Date().toISOString;
    const dataKey = `MG${payload['id']}${time}`;
    return this.httpClient
      .post<any>(
        `${DeduplicationUrls.DATASTORE}/${namespace}/${dataKey}`,
        payload
      )
      .pipe(
        map((response: any) => response)
        //TODO: Implement error handling
      );
  }
}
