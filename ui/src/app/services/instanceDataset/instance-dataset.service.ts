import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { InstanceDatasetsInterface } from 'src/app/resources/interfaces'

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  })
}


@Injectable({
  providedIn: 'root'
})
export class InstanceDatasetsService {
  private apiUrl = 'http://localhost:5000/instancedatasets';

  constructor(private httpClient: HttpClient) {}

  //Using Observables to create a service instance
  getInstanceDatasets(): Observable<InstanceDatasetsInterface[]> {
    return this.httpClient.get<InstanceDatasetsInterface[]>(this.apiUrl)
  }

  deleteInstanceDataset(instanceDataset: InstanceDatasetsInterface): Observable<InstanceDatasetsInterface> {
    const url = `${this.apiUrl}/${instanceDataset.id}`;
    return this.httpClient.delete<InstanceDatasetsInterface>(url);
  }

  addInstanceDataset(instanceDataset: InstanceDatasetsInterface): Observable<InstanceDatasetsInterface> {
    return this.httpClient.post<InstanceDatasetsInterface>(this.apiUrl, instanceDataset, httpOptions);
  }
}
