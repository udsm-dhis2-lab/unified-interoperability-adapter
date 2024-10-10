import { HttpParams } from '@angular/common/http';
import { Injectable, model } from '@angular/core';
import { catchError, map, Observable, tap } from 'rxjs';
import { DeduplicationUrls } from '../../../shared/constants';
import { DeduplicationPage } from '../models';
import { HduHttpService } from '@iadapter-applications/hdu-api-http-client';
import { UnAuothorizedException, UnknownException } from '@models';

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
      .get<{ results: any }>(`${this.hduDeduplicationUrl}`, {
        params,
      })
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
}
