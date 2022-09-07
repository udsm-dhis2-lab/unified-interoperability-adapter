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
  private apiUrl = './api/v1/datasets';

  constructor(private httpClient: HttpClient) {}

  //Using Observables to create a service instance
  getInstanceDatasets(instanceId: number): Observable<InstanceDatasetsInterface[] | any> {
    let url = `${this.apiUrl}/remote/${instanceId}`;
    return this.httpClient.get<InstanceDatasetsInterface[]>(url);
  }
  
  searchInstanceDatasets(instanceId: number, datasetName: string): Observable<InstanceDatasetsInterface[] | any> {
    let url = `${this.apiUrl}/remote/${instanceId}/${datasetName}`;
    return this.httpClient.get<InstanceDatasetsInterface[]>(url);
  }

  deleteInstanceDataset(instanceDataset: InstanceDatasetsInterface): Observable<InstanceDatasetsInterface | any> {
    const url = `${this.apiUrl}/${instanceDataset.id}`;
    return this.httpClient.delete<InstanceDatasetsInterface>(url);
  }

  addInstanceDataset(instanceDataset: InstanceDatasetsInterface): Observable<InstanceDatasetsInterface | any> {
    return this.httpClient.post<InstanceDatasetsInterface>(this.apiUrl, instanceDataset, httpOptions);
  }
}
