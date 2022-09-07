import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

@Injectable({
  providedIn: 'root',
})
export class ReportsService {
  private apiUrl = 'api/v1/reports';

  constructor(private httpClient: HttpClient) {}

  viewReport(payload: any): Observable<any> {
    const url = `${this.apiUrl}`;
    return this.httpClient.post<any>(url, payload, httpOptions);
  }

  // viewReport(payload: any): any {
  //   return [
  //     {
  //       dataElementCategoryCombo: 'Pg47B29PFoR-UVLU1Njotu4-val',
  //       value: 20,
  //     },
  //   ];
  // }

  sendReport(payload: any): Observable<any> {
    const url = `${this.apiUrl}/sendValues`;
    return this.httpClient.post<any>(url, payload, httpOptions);
  }
}
