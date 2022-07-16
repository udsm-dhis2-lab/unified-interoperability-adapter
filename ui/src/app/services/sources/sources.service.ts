import { SourceInterface } from './../../resources/interfaces';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  })
}


@Injectable({
  providedIn: 'root'
})
export class SourcesService {

  private apiUrl = 'http://localhost:4200/api/v1/datasource';

  constructor(private httpClient: HttpClient) { }

  //Using Observables to create a service instance
  getSources(): Observable<SourceInterface[]> {

    return this.httpClient.get<SourceInterface[]>(this.apiUrl)
  
  }

  deleteSource(source: SourceInterface): Observable<SourceInterface> {
    const url = `${this.apiUrl}/${source.id}`;
    return this.httpClient.delete<SourceInterface>(url);
  }

  updateSourceActivate(source: SourceInterface): Observable<SourceInterface> {
    const url = `${this.apiUrl}`;
    return this.httpClient.put<SourceInterface>(url, source, httpOptions);
  }

  addSource(source: SourceInterface): Observable<SourceInterface>{
    return this.httpClient.post<SourceInterface>(this.apiUrl, source, httpOptions);
  }

}
