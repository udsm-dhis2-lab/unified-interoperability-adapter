import { Injectable } from '@angular/core';

import { HduHttpService } from 'libs/hdu-api-http-client/src/lib/services/hdu-http.service';
import { HduClient } from '../models';
import { catchError, delay, Observable, of } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable()
export class ClientManagement {
  hduClientUrl = '';

  mockClients: HduClient[] = [
    {
      clientID: '48HGB',
      fname: 'John',
      mname: 'A',
      surname: 'Doe',
      gender: 'Male',
      idNUmber: '123456',
      idType: 'Passport',
    },
    {
      clientID: '32HGB',
      fname: 'Jane',
      mname: 'B',
      surname: 'Smith',
      gender: 'Female',
      idNUmber: '789012',
      idType: 'ID Card',
    },
    {
      clientID: '56HGB',
      fname: 'Alice',
      mname: 'C',
      surname: 'Johnson',
      gender: 'Female',
      idNUmber: '345678',
      idType: 'Driver License',
    },
    {
      clientID: '90HGB',
      fname: 'Bob',
      mname: 'D',
      surname: 'Brown',
      gender: 'Male',
      idNUmber: '901234',
      idType: 'Passport',
    },
    {
      clientID: '21HGB',
      fname: 'Charlie',
      mname: 'E',
      surname: 'Davis',
      gender: 'Male',
      idNUmber: '567890',
      idType: 'ID Card',
    },
    {
      clientID: '11VVZ',
      fname: 'Diana',
      mname: 'F',
      surname: 'Miller',
      gender: 'Female',
      idNUmber: '234567',
      idType: 'Driver License',
    },
    {
      clientID: '09VVZ',
      fname: 'Eve',
      mname: 'G',
      surname: 'Wilson',
      gender: 'Female',
      idNUmber: '890123',
      idType: 'Passport',
    },
    {
      clientID: '12NGL',
      fname: 'Frank',
      mname: 'H',
      surname: 'Moore',
      gender: 'Male',
      idNUmber: '456789',
      idType: 'ID Card',
    },
    {
      clientID: '08HGB',
      fname: 'Grace',
      mname: 'I',
      surname: 'Taylor',
      gender: 'Female',
      idNUmber: '123890',
      idType: 'Driver License',
    },
    {
      clientID: '65XZT',
      fname: 'Henry',
      mname: 'J',
      surname: 'Anderson',
      gender: 'Male',
      idNUmber: '678901',
      idType: 'Passport',
    },
  ];

  constructor(private httpClient: HttpClient) {}

  getHduClients(
    pageIndex: number,
    pageSize: number,
    filters: Array<{ key: string; value: string[] }>
  ): Observable<{ results: HduClient[] }> {
    let params = new HttpParams()
      .append('page', `${pageIndex}`)
      .append('results', `${pageSize}`);
    filters.forEach((filter) => {
      filter.value.forEach((value) => {
        params = params.append(filter.key, value);
      });
    });
    this.httpClient
      .get<{ results: HduClient[] }>(`${this.hduClientUrl}`, { params })
      .pipe(catchError(() => of({ results: [] })));

    return of({ results: this.mockClients }).pipe(delay(3000));
  }
}
