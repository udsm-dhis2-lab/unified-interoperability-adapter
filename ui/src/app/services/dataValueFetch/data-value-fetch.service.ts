import { DataValueFetchInterface } from './../../resources/interfaces';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  })
}

@Injectable({
  providedIn: 'root'
})
export class DataValueFetchService {

  private apiUrl = './api/v1/datasetElements';

  constructor(private httpClient: HttpClient) {}

  //Using Observables to create a service instance
  getDataValueFetchs(): Observable<DataValueFetchInterface[]|any> {
    return this.httpClient.get<DataValueFetchInterface[]|any>(this.apiUrl)
  }

  deleteDataValueFetch(dataValueFetch: DataValueFetchInterface): Observable<DataValueFetchInterface|any> {
    const url = `${this.apiUrl}/${dataValueFetch.dataElementCategoryOptionCombo}`;
    return this.httpClient.delete<DataValueFetchInterface|any>(url);
  }
  
  getSingleDataValueFetch(dataValueFetch: DataValueFetchInterface): Observable<DataValueFetchInterface|any> {
    const url = `${this.apiUrl}/searchDataSetElements`;
    return this.httpClient.post<DataValueFetchInterface|any>(url, dataValueFetch, httpOptions);
  }

  addDataValueFetch(dataValueFetch: DataValueFetchInterface): Observable<DataValueFetchInterface|any> {
    return this.httpClient.post<DataValueFetchInterface|any>(this.apiUrl, dataValueFetch, httpOptions);
  }
  
  testDataValueFetchQuery(dataValueFetch: any): Observable<any> {
    let url = `${this.apiUrl}/testQuery`;
    return this.httpClient.post<any>(url, dataValueFetch, httpOptions);
  }

  
}
