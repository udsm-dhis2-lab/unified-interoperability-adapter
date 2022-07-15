import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InstanceInterface } from '../../resources/interfaces'


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  })
}

@Injectable({
  providedIn: 'root'
})
export class InstancesService {

  private apiUrl = 'http://localhost:5000/instances';

  constructor(private httpClient: HttpClient) {}

  //Using Observables to create a service instance
  getInstances(): Observable<InstanceInterface[]> {
    return this.httpClient.get<InstanceInterface[]>(this.apiUrl)
  }

  getSingleInstance(instance: InstanceInterface): Observable<InstanceInterface> {
    const url = `${this.apiUrl}/${instance.id}`;
    return this.httpClient.get<InstanceInterface>(url);
  }
  deleteInstance(instance: InstanceInterface): Observable<InstanceInterface> {
    const url = `${this.apiUrl}/${instance.id}`;
    return this.httpClient.delete<InstanceInterface>(url);
  }

  updateInstanceActivate(instance: InstanceInterface): Observable<InstanceInterface> {
    const url = `${this.apiUrl}/${instance.id}`;
    return this.httpClient.put<InstanceInterface>(url, instance, httpOptions);
  }

  addInstance(instance: InstanceInterface): Observable<InstanceInterface> {
    return this.httpClient.post<InstanceInterface>(this.apiUrl, instance, httpOptions);
  }

}
