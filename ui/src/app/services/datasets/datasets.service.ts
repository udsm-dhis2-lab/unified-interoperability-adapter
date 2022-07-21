import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DatasetInterface } from 'src/app/resources/interfaces';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  })
}

@Injectable({
  providedIn: 'root'
})
export class DatasetsService {


  private apiUrl = '/api/v1/datasets';

  constructor(private httpClient: HttpClient) {}

  //Using Observables to create a service instance
  getDatasets(): Observable<DatasetInterface[]> {
    return this.httpClient.get<DatasetInterface[]>(this.apiUrl)
  }

  getSingleDatasets(dataset: DatasetInterface): Observable<DatasetInterface> {
    let url = this.apiUrl + "/single?datasetId="+dataset.id;
    return this.httpClient.get<DatasetInterface>(url);
  }

  deleteDataset(dataset: DatasetInterface): Observable<DatasetInterface> {
    const url = `${this.apiUrl}/${dataset.id}`;
    return this.httpClient.delete<DatasetInterface>(url);
  }

  addDataset(dataset: DatasetInterface): Observable<DatasetInterface> {
    console.log("New dataset:  ",dataset);
    return this.httpClient.post<DatasetInterface>(this.apiUrl, dataset, httpOptions);
  }


}
