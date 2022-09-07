import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DatasetInterface } from 'src/app/models/source.model';

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
  getDatasets(): Observable<DatasetInterface[] | any> {
    return this.httpClient.get<DatasetInterface[]>(this.apiUrl)
  }

  getSingleDatasets(dataset: DatasetInterface): Observable<DatasetInterface | any> {
    let url = this.apiUrl + "/single?datasetId="+dataset.id;
    return this.httpClient.get<DatasetInterface>(url);
  }

  deleteDataset(dataset: DatasetInterface): Observable<DatasetInterface | any> {
    const url = `${this.apiUrl}/${dataset.id}`;
    return this.httpClient.delete<DatasetInterface>(url);
  }

  addDataset(dataset: DatasetInterface): Observable<DatasetInterface | any> {
    console.log("New dataset:  ",dataset);
    return this.httpClient.post<DatasetInterface>(this.apiUrl, dataset, httpOptions);
  }


}
