import { Injectable } from '@angular/core';
import { HduHttpService } from 'libs/hdu-api-http-client/src/lib/services/hdu-http.service';
import { Endpoints } from '../constants';
import { catchError, map, Observable, switchMap } from 'rxjs';
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
  verifyInstanceByCodeUrl: string = Endpoints.VERIFY_CODE;

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

  addInstance(payLoad: any) {
    return this.httpClient
      .post(this.instanceUrl, payLoad)
      .pipe(catchError((error: any) => this.handleError(error)));
  }

  updateInstance(payLoad: any) {
    return this.httpClient
      .put(this.instanceUrl, payLoad)
      .pipe(catchError((error: any) => this.handleError(error)));
  }

  verifyInstanceByCode(payLoad: any) {
    return this.httpClient.post(this.verifyInstanceByCodeUrl, payLoad).pipe(
      catchError((error: any) => {
        if (error.status === 400) {
          throw new Error('Incorrect code or credentilals');
        } else {
          this.handleError(error);
        }
      })
    );
  }

  verifyAndAddInstance(payLoad: any): Observable<any> {
    return payLoad.uuid != null
      ? this.verifyInstanceByCode(payLoad).pipe(
          switchMap(() => this.addInstance(payLoad))
        )
      : this.verifyInstanceByCode(payLoad).pipe(
          switchMap(() => this.updateInstance(payLoad))
        );
  }

  deleteInstance(uuid: string) {
    return this.httpClient
      .delete(`${this.instanceUrl}/${uuid}`)
      .pipe(catchError((error: any) => this.handleError(error)));
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
