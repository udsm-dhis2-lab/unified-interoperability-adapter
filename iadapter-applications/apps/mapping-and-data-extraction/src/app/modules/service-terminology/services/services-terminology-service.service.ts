import { Injectable } from '@angular/core';
import { HduHttpService } from '@iadapter-applications/hdu-api-http-client';
import { ServiceTerminologyConstants } from '../models/constants/service-terminology-constants';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServicesTerminologyServiceService {
  dataStoreUrl: string = ServiceTerminologyConstants.DATA_STORE;

  constructor(private httpClient: HduHttpService) { }

  saveGeneralCodes(data: any): Observable<any> {
    return this.httpClient.post(this.dataStoreUrl, data).pipe(
      map((response: any) => response),
      catchError((error: any) => {
        console.error('Error saving general codes:', error);
        return throwError(error);
      })
    );
  }
}
