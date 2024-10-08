import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, delay, Observable, of } from 'rxjs';
import { Deduplication } from '../models/deduplication.model';

@Injectable()
export class DeduplicationManagementService {
  hduDeduplicationUrl = '';

  deduplicationData: Deduplication[] = [
    {
      clientID: 'OHJGF1',
      fname: 'John',
      mname: 'A',
      surname: 'Doe',
      gender: 'Male',
      idNUmber: '123456',
      idType: 'Passport',
      associatedDuplicates: 2,
    },
    {
      clientID: 'OBJGF4',
      fname: 'Jane',
      mname: 'B',
      surname: 'Smith',
      gender: 'Female',
      idNUmber: '789012',
      idType: 'ID Card',
      associatedDuplicates: 1,
    },
    {
      clientID: 'ODJGFV',
      fname: 'Alice',
      mname: 'C',
      surname: 'Johnson',
      gender: 'Female',
      idNUmber: '345678',
      idType: 'Driver License',
      associatedDuplicates: 3,
    },
    {
      clientID: 'OXJGF3',
      fname: 'Bob',
      mname: 'D',
      surname: 'Brown',
      gender: 'Male',
      idNUmber: '901234',
      idType: 'Passport',
      associatedDuplicates: 0,
    },
    {
      clientID: 'DHJNF6',
      fname: 'Charlie',
      mname: 'E',
      surname: 'Davis',
      gender: 'Male',
      idNUmber: '567890',
      idType: 'ID Card',
      associatedDuplicates: 4,
    },
    {
      clientID: 'XDJGF4',
      fname: 'Diana',
      mname: 'F',
      surname: 'Miller',
      gender: 'Female',
      idNUmber: '234567',
      idType: 'Driver License',
      associatedDuplicates: 2,
    },
    {
      clientID: 'OJGFM4',
      fname: 'Eve',
      mname: 'G',
      surname: 'Wilson',
      gender: 'Female',
      idNUmber: '890123',
      idType: 'Passport',
      associatedDuplicates: 1,
    },
    {
      clientID: 'LHJGF1',
      fname: 'Frank',
      mname: 'H',
      surname: 'Moore',
      gender: 'Male',
      idNUmber: '456789',
      idType: 'ID Card',
      associatedDuplicates: 3,
    },
    {
      clientID: 'MHJGFI',
      fname: 'Grace',
      mname: 'I',
      surname: 'Taylor',
      gender: 'Female',
      idNUmber: '123890',
      idType: 'Driver License',
      associatedDuplicates: 0,
    },
    {
      clientID: 'OBJGFR',
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
