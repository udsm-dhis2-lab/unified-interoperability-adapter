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

  private apiUrl = 'http://localhost:5000/dataValueFetchs';

  constructor(private httpClient: HttpClient) {}

  //Using Observables to create a service instance
  getDataValueFetchs(): Observable<DataValueFetchInterface[]> {
    return this.httpClient.get<DataValueFetchInterface[]>(this.apiUrl)
  }

  deleteDataValueFetch(dataValueFetch: DataValueFetchInterface): Observable<DataValueFetchInterface> {
    const url = `${this.apiUrl}/${dataValueFetch.dataElementCombo}`;
    return this.httpClient.delete<DataValueFetchInterface>(url);
  }
  
  getSingleDataValueFetch(dataValueFetch: DataValueFetchInterface): Observable<DataValueFetchInterface> {
    const url = `${this.apiUrl}/`;
    return this.httpClient.get<DataValueFetchInterface>(url);
  }

  addDataValueFetch(dataValueFetch: DataValueFetchInterface): Observable<DataValueFetchInterface> {
    return this.httpClient.post<DataValueFetchInterface>(this.apiUrl, dataValueFetch, httpOptions);
  }
}
