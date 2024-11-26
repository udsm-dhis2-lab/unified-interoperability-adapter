import { Injectable } from '@angular/core';
import { HduHttpService } from 'libs/hdu-api-http-client/src/lib/services/hdu-http.service';
import { Endpoints } from '../constants';
import { catchError, map } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import {
  InternalServerException,
  UnAuothorizedException,
  UnknownException,
} from '../../../../../../libs/models';
import { InstancePage } from '../models';

@Injectable({
  providedIn: 'root',
})
export class InstanceManagementService {
  instanceUrl: string = Endpoints.INSTANCES;

  constructor(private httpClient: HduHttpService) {}

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

  // TODO: These functions below need to be moved to a common shared folder
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
