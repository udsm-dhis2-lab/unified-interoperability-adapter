import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, delay, Observable, of } from 'rxjs';
import { Deduplication } from '../models/deduplication.model';

@Injectable()
export class DeduplicationManagementService {
  hduDeduplicationUrl = '';

  deduplicationData: Deduplication[] = [
    {
      clientID: '1',
      fname: 'John',
      mname: 'A',
      surname: 'Doe',
      gender: 'Male',
      idNUmber: '123456',
      idType: 'Passport',
      associatedDuplicates: 2,
    },
    {
      clientID: '2',
      fname: 'Jane',
      mname: 'B',
      surname: 'Smith',
      gender: 'Female',
      idNUmber: '789012',
      idType: 'ID Card',
      associatedDuplicates: 1,
    },
    {
      clientID: '3',
      fname: 'Alice',
      mname: 'C',
      surname: 'Johnson',
      gender: 'Female',
      idNUmber: '345678',
      idType: 'Driver License',
      associatedDuplicates: 3,
    },
    {
      clientID: '4',
      fname: 'Bob',
      mname: 'D',
      surname: 'Brown',
      gender: 'Male',
      idNUmber: '901234',
      idType: 'Passport',
      associatedDuplicates: 0,
    },
    {
      clientID: '5',
      fname: 'Charlie',
      mname: 'E',
      surname: 'Davis',
      gender: 'Male',
      idNUmber: '567890',
      idType: 'ID Card',
      associatedDuplicates: 4,
    },
    {
      clientID: '6',
      fname: 'Diana',
      mname: 'F',
      surname: 'Miller',
      gender: 'Female',
      idNUmber: '234567',
      idType: 'Driver License',
      associatedDuplicates: 2,
    },
    {
      clientID: '7',
      fname: 'Eve',
      mname: 'G',
      surname: 'Wilson',
      gender: 'Female',
      idNUmber: '890123',
      idType: 'Passport',
      associatedDuplicates: 1,
    },
    {
      clientID: '8',
      fname: 'Frank',
      mname: 'H',
      surname: 'Moore',
      gender: 'Male',
      idNUmber: '456789',
      idType: 'ID Card',
      associatedDuplicates: 3,
    },
    {
      clientID: '9',
      fname: 'Grace',
      mname: 'I',
      surname: 'Taylor',
      gender: 'Female',
      idNUmber: '123890',
      idType: 'Driver License',
      associatedDuplicates: 0,
    },
    {
      clientID: '10',
      fname: 'Henry',
      mname: 'J',
      surname: 'Anderson',
      gender: 'Male',
      idNUmber: '678901',
      idType: 'Passport',
      associatedDuplicates: 5,
    },
  ];

  constructor(private httpClient: HttpClient) {}

  getDeduplicationClients(
    pageIndex: number,
    pageSize: number,
    filters: Array<{ key: string; value: string[] }>
  ): Observable<{ results: Deduplication[] }> {
    let params = new HttpParams()
      .append('page', `${pageIndex}`)
      .append('results', `${pageSize}`);
    filters.forEach((filter) => {
      filter.value.forEach((value) => {
        params = params.append(filter.key, value);
      });
    });
    this.httpClient
      .get<{ results: Deduplication[] }>(`${this.hduDeduplicationUrl}`, {
        params,
      })
      .pipe(catchError(() => of({ results: [] })));

    return of({ results: this.deduplicationData }).pipe(delay(3000));
  }
}
