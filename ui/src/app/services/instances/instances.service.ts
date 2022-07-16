import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';
import { InstanceInterface } from '../../resources/interfaces';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

@Injectable({
  providedIn: 'root',
})
export class InstancesService {
  private _instances: any[] = [];
  // private apiUrl = 'http://localhost:5000/instances';
  private apiUrl = 'http://localhost:4200/api/v1/instance';

  constructor(private httpClient: HttpClient) {}

  //Using Observables to create a service instance
  getInstances(): Observable<InstanceInterface[]> {
    return this._instances.length > 0
      ? of(this._instances)
      : this.httpClient.get<InstanceInterface[]>(this.apiUrl).pipe(tap((instances) => {this._instances = instances}));
  }

  getSingleInstance(
    instance: InstanceInterface
  ): Observable<InstanceInterface> {
    const url = `${this.apiUrl}/${instance.id}`;
    return this.httpClient.get<InstanceInterface>(url);
  }
  deleteInstance(instance: InstanceInterface): Observable<InstanceInterface> {
    const url = `${this.apiUrl}/${instance.id}`;
    return this.httpClient.delete<InstanceInterface>(url);
  }

  updateInstance(instance: InstanceInterface): Observable<InstanceInterface> {
    const url = `${this.apiUrl}`;
    return this.httpClient.put<InstanceInterface>(url, instance, httpOptions);
  }

  addInstance(instance: InstanceInterface): Observable<InstanceInterface> {
    console.log('Payload: ', instance);
    return this.httpClient.post<InstanceInterface>(
      this.apiUrl,
      instance,
      httpOptions
    );
  }
}
