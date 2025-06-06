import { Injectable } from '@angular/core';
import { ServiceTerminologyConstants } from '../models/constants/service-terminology-constants';
import { catchError, map, Observable, throwError } from 'rxjs';
import { HduHttpService } from 'libs/hdu-api-http-client/src/lib/services/hdu-http.service';

@Injectable({
  providedIn: 'root'
})
export class ServicesTerminologyServiceService {
  dataStoreUrl: string = ServiceTerminologyConstants.DATA_STORE;

  constructor(private httpClient: HduHttpService) { }

  saveServiceCode(data: any): Observable<any> {
    return this.httpClient.post(this.dataStoreUrl, data).pipe(
      map((response: any) => response),
      catchError((error: any) => {
        return throwError(error);
      })
    );
  }

  getServiceCodes(namespace: string, pageIndex: number, pageSize: number): Observable<any> {
    const url = `${this.dataStoreUrl}/${namespace}?page=${pageIndex}&pageSize=${pageSize}`;
    return this.httpClient.get(url).pipe(
      map((response: any) => response),
      catchError((error: any) => {
        return throwError(error);
      })
    )
  }
}
