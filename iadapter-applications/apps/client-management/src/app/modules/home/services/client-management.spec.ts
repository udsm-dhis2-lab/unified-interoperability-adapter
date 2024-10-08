import { TestBed } from '@angular/core/testing';

import { ClientManagement } from './client-management';

describe('ClientServiceService', () => {
  let service: ClientManagement;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClientManagement);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
