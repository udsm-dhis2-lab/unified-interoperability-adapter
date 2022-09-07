import { TestBed } from '@angular/core/testing';

import { DataValueFetchService } from './data-value-fetch.service';

describe('DataValueFetchService', () => {
  let service: DataValueFetchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataValueFetchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
