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

  private apiUrl = 'http://localhost:4200/api/v1/datasetElements';

  constructor(private httpClient: HttpClient) {}

  //Using Observables to create a service instance
  getDataValueFetchs(): Observable<DataValueFetchInterface[]> {
    return this.httpClient.get<DataValueFetchInterface[]>(this.apiUrl)
  }

  deleteDataValueFetch(dataValueFetch: DataValueFetchInterface): Observable<DataValueFetchInterface> {
    const url = `${this.apiUrl}/${dataValueFetch.dataElementCategoryOptionCombo}`;
    return this.httpClient.delete<DataValueFetchInterface>(url);
  }
  
  getSingleDataValueFetch(dataValueFetch: DataValueFetchInterface): Observable<DataValueFetchInterface> {
    const url = `${this.apiUrl}/searchDataSetElements`;
    return this.httpClient.post<DataValueFetchInterface>(url, dataValueFetch, httpOptions);
  }

  addDataValueFetch(dataValueFetch: DataValueFetchInterface): Observable<DataValueFetchInterface> {
    console.log(dataValueFetch);
    return this.httpClient.post<DataValueFetchInterface>(this.apiUrl, dataValueFetch, httpOptions);
  }
  
  testDataValueFetchQuery(dataValueFetch: DataValueFetchInterface): Observable<string> {
    let url = `${this.apiUrl}/testQuery`;
    return this.httpClient.post<string>(url, dataValueFetch, httpOptions);
  }

  
}
